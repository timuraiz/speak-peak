'use client';

import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import ActivityCard from "@/app/components/ActivityCard";
import Member from "@/app/components/Member";
import CallButton from "@/app/components/CallButton";
import LeaveActivityButton from "@/app/components/LeaveActivityButton";
import { Suspense } from 'react';

interface CallContextType {
  activeCard: string | null;
  setActiveCard: (card: string | null) => void;
  isLeader: boolean;
  setIsLeader: (isLeader: boolean) => void;
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
  currentUser: { name: string; avatar: string | null };
  partner: { name: string; avatar: string | null };
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export function useCallContext() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCallContext must be used within CallLayout');
  }
  return context;
}

function CallLayoutInner({ children }: { children: React.ReactNode }) {
  const params = useSearchParams();
  const roomId = params.get('roomId');
  const partnerName = typeof window !== 'undefined' ? (sessionStorage.getItem('partnerName') || 'Partner') : 'Partner';
  const partnerAvatar = typeof window !== 'undefined' ? (sessionStorage.getItem('partnerAvatar') || null) : null;

  const { profile, user } = useAuth();
  const currentUserName = profile?.name ?? user?.email?.split('@')[0] ?? 'You';
  const currentUserAvatar = profile?.avatar ?? null;

  const [activeCard, setActiveCardState] = useState<string | null>(null);
  const [isLeader, setIsLeader] = useState<boolean>(
    () => typeof window !== 'undefined' && sessionStorage.getItem('isLeader') === 'true'
  );
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Leader: sync activity to server on change
  const setActiveCard = (card: string | null) => {
    setActiveCardState(card);
    if (isLeader && roomId) {
      fetch('/api/room/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, activity: card }),
      });
    }
  };

  // Non-leader: poll activity from server
  useEffect(() => {
    if (isLeader || !roomId) return;

    pollingRef.current = setInterval(async () => {
      const res = await fetch(`/api/room/activity?roomId=${roomId}`);
      const data = await res.json();
      setActiveCardState(data.activity);
    }, 1000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [isLeader, roomId]);

  return (
    <CallContext.Provider value={{
      activeCard, setActiveCard, isLeader, setIsLeader, isMuted, setIsMuted,
      currentUser: { name: currentUserName, avatar: currentUserAvatar },
      partner: { name: partnerName, avatar: partnerAvatar },
    }}>
      <div className="flex h-screen w-screen overflow-hidden p-4 gap-4">
        <aside className="w-[311px] shrink-0 px-5 py-8 flex flex-col h-full justify-between items-start">
          <div className="w-full flex flex-col gap-7 items-start">
            {isLeader ? (
              <h1 className="text-2xl font-semibold text-[#494949]">Choose an activity</h1>
            ) : (
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-[#494949]">Choose one of the options</h1>
                <p className="text-sm text-dark-50">on the left to begin.</p>
              </div>
            )}
            <div className='flex flex-col gap-2 w-full'>
              <ActivityCard
                icon="/Call/iconsax-gallery.svg"
                title="Guess the object"
                description="Explain the picture. Your partner tries to guess the object"
                alt="gallery icon"
                isPressed={activeCard === 'object'}
                object={true}
                onClick={isLeader ? () => setActiveCard(activeCard === 'object' ? null : 'object') : undefined}
                disabled={true}
                badge="soon"
              />
              <ActivityCard
                icon="/Call/iconsax-message-notif.svg"
                title="Suggest a topic"
                description="Get a topic for discussion"
                alt="message notification icon"
                isPressed={activeCard === 'topic'}
                topic={true}
                onClick={isLeader ? () => setActiveCard(activeCard === 'topic' ? null : 'topic') : undefined}
                disabled={!isLeader}
              />
            </div>
          </div>
          <div className="flex flex-col gap-7 w-full items-center">
            <div className="flex flex-col gap-2 w-full">
              <Member isCurrentUser={true} />
              <Member isCurrentUser={false} />
            </div>
            <div className="flex gap-2">
              <CallButton />
              <CallButton variant="cancel" />
            </div>
          </div>
        </aside>
        <main className="flex-1 gap-8 flex flex-col min-w-0 overflow-auto bg-white border border-border rounded-3xl p-8">
          {activeCard && isLeader && (
            <LeaveActivityButton onClick={() => setActiveCard(null)} />
          )}
          {children}
        </main>
      </div>
    </CallContext.Provider>
  );
}

export default function CallLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense>
      <CallLayoutInner>{children}</CallLayoutInner>
    </Suspense>
  );
}
