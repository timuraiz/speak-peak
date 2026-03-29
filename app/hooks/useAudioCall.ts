'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Room, RoomEvent, Track, RemoteTrack, RemoteTrackPublication, RemoteParticipant, LogLevel, setLogLevel } from 'livekit-client';

setLogLevel(LogLevel.warn);

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
  onMessage?: (msg: Record<string, unknown>) => void;
}

export function useAudioCall({ roomId, userId, userName, onMessage }: UseAudioCallOptions) {
  const roomRef = useRef<Room | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const [partnerOnline, setPartnerOnline] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [partnerMuted, setPartnerMuted] = useState(false);

  const attachTrack = (track: RemoteTrack) => {
    if (track.kind !== Track.Kind.Audio) return;
    const el = track.attach();
    el.style.display = 'none';
    document.body.appendChild(el);
  };

  const detachTrack = (track: RemoteTrack) => {
    track.detach().forEach((el) => el.remove());
  };

  const sendMessage = useCallback((msg: Record<string, unknown>) => {
    const room = roomRef.current;
    if (!room) return;
    room.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify(msg)),
      { reliable: true }
    );
  }, []);

  const toggleMute = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    const next = !isMuted;
    try {
      await room.localParticipant.setMicrophoneEnabled(!next);
      setIsMuted(next);
      sendMessage({ type: 'mute', value: next });
    } catch (e) {
      console.error('[mute] error:', e);
    }
  }, [isMuted, sendMessage]);

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
      setPartnerMuted(false);
    });

    room.on(RoomEvent.TrackMuted, (pub, participant) => {
      if (participant !== room.localParticipant && pub.kind === Track.Kind.Audio) {
        setPartnerMuted(true);
      }
    });

    room.on(RoomEvent.TrackUnmuted, (pub, participant) => {
      if (participant !== room.localParticipant && pub.kind === Track.Kind.Audio) {
        setPartnerMuted(false);
      }
    });

    room.on(RoomEvent.DataReceived, (data: Uint8Array) => {
      try {
        const msg = JSON.parse(new TextDecoder().decode(data));
        if (msg.type === 'mute') {
          setPartnerMuted(msg.value);
        }
        onMessageRef.current?.(msg);
      } catch {}
    });

    await room.connect(url, token);
    await room.localParticipant.setMicrophoneEnabled(true);

    if (room.remoteParticipants.size > 0) {
      setPartnerOnline(true);
      room.remoteParticipants.forEach((participant) => {
        participant.trackPublications.forEach((pub) => {
          if (pub.track) attachTrack(pub.track as RemoteTrack);
          if (pub.kind === Track.Kind.Audio && pub.isMuted) setPartnerMuted(true);
        });
      });
    }
  }, [roomId, userId, userName]);

  useEffect(() => {
    connect();
    return () => {
      const room = roomRef.current;
      if (!room) return;
      room.localParticipant.trackPublications.forEach((pub) => pub.track?.stop());
      room.remoteParticipants.forEach((participant) => {
        participant.trackPublications.forEach((pub) => {
          if (pub.track) pub.track.detach().forEach((el) => el.remove());
        });
      });
      room.disconnect();
      roomRef.current = null;
    };
  }, [connect]);

  return { partnerOnline, isMuted, partnerMuted, toggleMute, sendMessage };
}
