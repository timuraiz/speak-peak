'use client';

import { useState, createContext, useContext } from 'react';
import ActivityCard from "@/app/components/ActivityCard";
import Member from "@/app/components/Member";
import CallButton from "@/app/components/CallButton";
import LeaveActivityButton from "@/app/components/LeaveActivityButton";

interface CallContextType {
  activeCard: string | null;
  setActiveCard: (card: string | null) => void;
  isLeader: boolean;
  setIsLeader: (isLeader: boolean) => void;
  isMuted: boolean;
  setIsMuted: (isMuted: boolean) => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export function useCallContext() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCallContext must be used within CallLayout');
  }
  return context;
}

export default function CallLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isLeader, setIsLeader] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  return (
    <CallContext.Provider value={{ activeCard, setActiveCard, isLeader, setIsLeader, isMuted, setIsMuted }}>
      <div className="flex h-screen w-screen overflow-hidden p-4 gap-4">
        <aside className="w-[311px] flex-shrink-0 px-5 py-8 flex flex-col h-full justify-between items-start">
          <div className="w-full flex flex-col gap-7 items-start">
            <h1 className="text-2xl font-semibold text-[#494949]">Choose an activity</h1>
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

