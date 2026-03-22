'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Loader from '../../components/Loader';
import Button from '../../components/Button';
import { useAuth } from '@/app/contexts/AuthContext';

function getOrCreateUserId(): string {
  let userId = sessionStorage.getItem('userId');
  if (!userId) {
    userId = crypto.randomUUID();
    sessionStorage.setItem('userId', userId);
  }
  return userId;
}

export default function SearchPage() {
  const router = useRouter();
  const { profile, user, loading } = useAuth();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const userIdRef = useRef<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const redirectedRef = useRef(false);
  const joinedRef = useRef(false);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (loading) return;
    if (joinedRef.current) return;
    joinedRef.current = true;

    const userId = getOrCreateUserId();
    userIdRef.current = userId;

    const displayName = profile?.name ?? user?.email?.split('@')[0] ?? 'Anonymous';
    const avatar = profile?.avatar ?? null;

    const redirect = (roomId: string, isLeader: boolean, partner?: { name: string; id: string; avatar: string | null }) => {
      if (redirectedRef.current) return;
      redirectedRef.current = true;
      if (pollingRef.current) clearInterval(pollingRef.current);
      sessionStorage.setItem('isLeader', String(isLeader));
      if (partner) {
        sessionStorage.setItem('partnerName', partner.name);
        sessionStorage.setItem('partnerAvatar', partner.avatar ?? '');
      }
      const params = new URLSearchParams({ roomId });
      if (partner) params.set('partnerName', partner.name);
      router.push(`/connecting?${params.toString()}`);
    };

    // Join the queue
    fetch('/api/queue/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, name: displayName, avatar }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.matched) {
          redirect(data.roomId, data.isLeader ?? false, data.partner);
          return;
        }

        // Start polling for match
        pollingRef.current = setInterval(async () => {
          const res = await fetch(`/api/queue/status?userId=${userId}`);
          const status = await res.json();
          if (status.matched) {
            redirect(status.roomId, status.isLeader ?? true, status.partner);
          }
        }, 1500);
      });

    // Timer
    const timer = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);

    return () => {
      clearInterval(timer);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [router, loading]);

  const handleCancel = async () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (userIdRef.current) {
      await fetch('/api/queue/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userIdRef.current }),
      });
    }
    router.push('/');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-end px-4 py-8">
      <div className="flex flex-col items-center gap-8 max-w-md w-full">
        <div className="flex flex-col items-center gap-6 w-full">
          <Loader />

          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-dark">
              Searching for a partner
            </h1>
            <p className="text-sm font-normal text-dark-70 max-w-sm">
              This usually takes just a few seconds.
            </p>
          </div>

          <div className="flex flex-col gap-4 items-center w-full">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <p className="text-sm font-normal text-dark-70">
              Searching for{' '}
              <span className="text-dark font-medium">{formatTime(elapsedSeconds)}</span>
            </p>
          </div>
        </div>

        <div className="bg-background w-full max-w-sm h-fit p-6 md:p-8 rounded-3xl flex flex-col gap-4.5 mt-8">
          <div className="flex justify-between items-center">
            <span className="text-dark-50 font-bold text-xs uppercase tracking-wide">
              Repeat before practice
            </span>
            <img src="/practice.svg" alt="Practice logo" className="w-6 h-6" />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-base font-semibold text-dark">Present Simple</p>
            <div className="space-y-1">
              <p className="text-xs text-dark-70 leading-relaxed">
                We use it for habits.
                <br />
                He/She/It → +s.
                <br />
                Example: She works every day.
                <br />
                Try: Say one habit about yourself.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
