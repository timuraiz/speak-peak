"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useAudioCall } from "@/app/hooks/useAudioCall";
import ActivityCard from "@/app/components/ActivityCard";
import Member from "@/app/components/Member";
import CallButton from "@/app/components/CallButton";
import LeaveActivityButton from "@/app/components/LeaveActivityButton";
import { Suspense } from "react";

export interface Topic {
  id: number;
  title: string;
  meta: { help_words: { word: string; pronunciation: string; tags: string[] }[] };
}

interface CallContextType {
  activeCard: string | null;
  setActiveCard: (card: string | null) => void;
  isLeader: boolean;
  setIsLeader: (isLeader: boolean) => void;
  isMuted: boolean;
  toggleMute: () => void;
  partnerMuted: boolean;
  currentUser: { name: string; avatar: string | null };
  partner: { name: string; avatar: string | null };
  partnerOnline: boolean;
  currentTopic: Topic | null;
  setCurrentTopic: (topic: Topic) => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export function useCallContext() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCallContext must be used within CallLayout");
  }
  return context;
}

function CallLayoutInner({ children }: { children: React.ReactNode }) {
  const params = useSearchParams();
  const roomId = params.get("roomId");
  const partnerName =
    typeof window !== "undefined"
      ? sessionStorage.getItem("partnerName") || "Partner"
      : "Partner";
  const partnerAvatar =
    typeof window !== "undefined"
      ? sessionStorage.getItem("partnerAvatar") || null
      : null;

  const { profile, user } = useAuth();
  const currentUserName = profile?.name ?? user?.email?.split("@")[0] ?? "You";
  const currentUserAvatar = profile?.avatar ?? null;

  const [activeCard, setActiveCardState] = useState<string | null>(null);
  const [isLeader, setIsLeader] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      sessionStorage.getItem("isLeader") === "true"
  );
  const userId =
    typeof window !== "undefined"
      ? sessionStorage.getItem("userId") || null
      : null;

  const [currentTopic, setCurrentTopicState] = useState<Topic | null>(null);

  const handleMessage = useCallback((msg: Record<string, unknown>) => {
    if (msg.type === "activity") {
      setActiveCardState((msg.value as string | null) ?? null);
    }
    if (msg.type === "topic") {
      setCurrentTopicState(msg.value as Topic);
    }
  }, []);

  const { partnerOnline, isMuted, partnerMuted, toggleMute, sendMessage } = useAudioCall({
    roomId,
    userId,
    userName: currentUserName,
    onMessage: handleMessage,
  });

  const setCurrentTopic = useCallback((topic: Topic) => {
    setCurrentTopicState(topic);
    sendMessage({ type: "topic", value: topic });
  }, [sendMessage]);

  useEffect(() => {
    sessionStorage.setItem("callStartTime", Date.now().toString());
    return () => sessionStorage.removeItem("callStartTime");
  }, []);

  const setActiveCard = useCallback((card: string | null) => {
    setActiveCardState(card);
    if (isLeader) {
      sendMessage({ type: "activity", value: card });
    }
  }, [isLeader, sendMessage]);

  return (
    <CallContext.Provider
      value={{
        activeCard,
        setActiveCard,
        isLeader,
        setIsLeader,
        isMuted,
        toggleMute,
        partnerMuted,
        currentUser: { name: currentUserName, avatar: currentUserAvatar },
        partner: { name: partnerName, avatar: partnerAvatar },
        partnerOnline,
        currentTopic,
        setCurrentTopic,
      }}
    >
      <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden md:p-4 md:gap-4">
        {/* Main content */}
        <main className="relative flex-1 gap-8 flex flex-col min-w-0 overflow-auto bg-white md:border md:border-border md:rounded-3xl p-5 md:p-8 order-1 md:order-2">
          {!partnerOnline && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-dark text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg whitespace-nowrap">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              {partnerName} disconnected. Waiting for reconnect...
            </div>
          )}
          {activeCard && isLeader && (
            <LeaveActivityButton onClick={() => setActiveCard(null)} />
          )}
          {children}
        </main>

        {/* Sidebar — desktop: left column, mobile: bottom panel */}
        <aside className="order-2 md:order-1 md:w-[311px] md:shrink-0 md:px-5 md:py-8 md:h-full md:justify-between md:items-start md:border-t-0 md:border md:border-border md:rounded-3xl flex flex-row md:flex-col items-center justify-between px-4 py-3 border-t border-border rounded-t-3xl bg-white">
          {/* Activity cards — hidden on mobile */}
          <div className="hidden md:flex w-full flex-col gap-7 items-start">
            {isLeader ? (
              <h1 className="text-2xl font-semibold text-[#494949]">
                Choose an activity
              </h1>
            ) : (
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-[#494949]">
                  Choose one of the options
                </h1>
                <p className="text-sm text-dark-50">on the left to begin.</p>
              </div>
            )}
            <div className="flex flex-col gap-2 w-full">
              <ActivityCard
                icon="/Call/iconsax-gallery.svg"
                title="Guess the object"
                description="Explain the picture. Your partner tries to guess the object"
                alt="gallery icon"
                isPressed={activeCard === "object"}
                object={true}
                onClick={
                  isLeader
                    ? () =>
                        setActiveCard(activeCard === "object" ? null : "object")
                    : undefined
                }
                disabled={true}
                badge="soon"
              />
              <ActivityCard
                icon="/Call/iconsax-message-notif.svg"
                title="Suggest a topic"
                description="Get a topic for discussion"
                alt="message notification icon"
                isPressed={activeCard === "topic"}
                topic={true}
                onClick={
                  isLeader
                    ? () =>
                        setActiveCard(activeCard === "topic" ? null : "topic")
                    : undefined
                }
                disabled={!isLeader}
              />
            </div>
          </div>

          {/* Members + buttons — always visible */}
          <div className="flex md:flex-col items-center gap-3 md:gap-7 w-full">
            <div className="flex md:flex-col gap-2 w-full">
              <Member isCurrentUser={true} />
              <Member isCurrentUser={false} />
            </div>
            <div className="flex gap-2 shrink-0 self-center">
              <CallButton />
              <CallButton variant="cancel" />
            </div>
          </div>
        </aside>
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
