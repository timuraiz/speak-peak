'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Room, RoomEvent, Track, RemoteTrack, RemoteTrackPublication, RemoteParticipant, LogLevel, setLogLevel } from 'livekit-client';

setLogLevel(LogLevel.warn);

// Suppress LiveKit's benign race-condition warning about tracks arriving
// before participant metadata — audio still works correctly
if (typeof window !== 'undefined') {
  const _origError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && (
      args[0].includes('Tried to add a track for a participant') ||
      args[0].includes('Unknown DataChannel error')
    )) return;
    _origError(...args);
  };
}

interface UseAudioCallOptions {
  roomId: string | null;
  userId: string | null;
  userName: string;
}

export function useAudioCall({ roomId, userId, userName }: UseAudioCallOptions) {
  const roomRef = useRef<Room | null>(null);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const attachTrack = (track: RemoteTrack) => {
    if (track.kind !== Track.Kind.Audio) return;
    const el = track.attach();
    el.style.display = 'none';
    document.body.appendChild(el);
  };

  const detachTrack = (track: RemoteTrack) => {
    track.detach().forEach((el) => el.remove());
  };

  const toggleMute = useCallback(async () => {
    const room = roomRef.current;
    if (!room) { console.warn('[mute] room not connected'); return; }
    const next = !isMuted;
    console.log('[mute] setting mic enabled:', !next);
    try {
      await room.localParticipant.setMicrophoneEnabled(!next);
      console.log('[mute] done, isMuted now:', next);
      setIsMuted(next);
    } catch (e) {
      console.error('[mute] error:', e);
    }
  }, [isMuted]);

  const connect = useCallback(async () => {
    if (!roomId || !userId) return;

    const res = await fetch(
      `/api/livekit/token?roomId=${encodeURIComponent(roomId)}&userId=${encodeURIComponent(userId)}&name=${encodeURIComponent(userName)}`
    );
    const { token, url } = await res.json();
    if (!token || !url) return;

    const room = new Room();
    roomRef.current = room;

    room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _pub: RemoteTrackPublication, _participant: RemoteParticipant) => {
      attachTrack(track);
    });

    room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
      detachTrack(track);
    });

    room.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
      setPartnerOnline(true);
      participant.trackPublications.forEach((pub) => {
        if (pub.track) attachTrack(pub.track as RemoteTrack);
      });
    });

    room.on(RoomEvent.ParticipantDisconnected, () => {
      setPartnerOnline(false);
    });

    await room.connect(url, token);
    await room.localParticipant.setMicrophoneEnabled(true);

    if (room.remoteParticipants.size > 0) {
      setPartnerOnline(true);
      room.remoteParticipants.forEach((participant) => {
        participant.trackPublications.forEach((pub) => {
          if (pub.track) attachTrack(pub.track as RemoteTrack);
        });
      });
    }
  }, [roomId, userId, userName]);

  useEffect(() => {
    connect();
    return () => {
      const room = roomRef.current;
      if (!room) return;

      // Stop local mic track so browser releases the microphone indicator
      room.localParticipant.trackPublications.forEach((pub) => {
        pub.track?.stop();
      });

      // Detach and remove all remote audio elements
      room.remoteParticipants.forEach((participant) => {
        participant.trackPublications.forEach((pub) => {
          if (pub.track) pub.track.detach().forEach((el) => el.remove());
        });
      });

      room.disconnect();
      roomRef.current = null;
    };
  }, [connect]);

  return { partnerOnline, isMuted, toggleMute };
}
