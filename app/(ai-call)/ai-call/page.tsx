"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ConversationProvider, useConversation } from "@elevenlabs/react";
import AiCallOnboarding from "@/app/components/AiCallOnboarding";

const TOPICS = [
  { id: 1, icon: "/topic-coffee.svg", label: "Ordering coffee" },
  { id: 2, icon: "/topic-job.svg", label: "Job interview" },
  { id: 3, icon: "/topic-airport.svg", label: "At the airport" },
  { id: 4, icon: "/topic-party.svg", label: "Small talk at a party" },
  { id: 5, icon: "/topic-phone.svg", label: "Phone complaint" },
];

function useTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function AiCallContent() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [onboarded, setOnboarded] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const endingRef = useRef(false);

  const [prevChunk, setPrevChunk] = useState("");
  const [currentChunk, setCurrentChunk] = useState("");
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const conversation = useConversation({
    onDisconnect: () => {
      if (endingRef.current) router.push("/");
    },
    onMessage: ({ source, message }) => {
      if (source !== "ai") return;
      clearTimers();
      setPrevChunk("");
      setCurrentChunk("");

      // Split by punctuation then merge until each chunk has ~5-7 words
      const TARGET_WORDS = 6;
      const parts = (message.match(/[^,!?.]+[,!?.]?/g) ?? [message])
        .map((s) => s.trim()).filter(Boolean);
      const chunks: string[] = [];
      let current = "";
      for (const part of parts) {
        const merged = current ? `${current} ${part}` : part;
        if (current && merged.split(/\s+/).length > TARGET_WORDS) {
          chunks.push(current);
          current = part;
        } else {
          current = merged;
        }
      }
      if (current) chunks.push(current);

      let elapsed = 0;
      chunks.forEach((chunk, i) => {
        const duration = (chunk.split(/\s+/).length / 2.5) * 1000;
        timersRef.current.push(
          setTimeout(() => {
            setPrevChunk(i === 0 ? "" : chunks[i - 1]);
            setCurrentChunk(chunk);
          }, elapsed)
        );
        elapsed += duration;
      });
    },
    onModeChange: ({ mode }) => {
      if (mode === "listening") {
        // Don't clear timers — let last chunks finish playing out
        // Text will be replaced when the next message arrives
      }
    },
  });
  const isActive = conversation.status === "connected";
  const isSpeaking = conversation.mode === "speaking";
  const timer = useTimer(isActive);
  const blurClass = !onboarded ? "blur-sm" : "blur-0";

  const getSignedUrl = useCallback(async (): Promise<string> => {
    const res = await fetch("/api/elevenlabs/signed-url");
    if (!res.ok) throw new Error("Failed to get signed URL");
    const data = await res.json();
    return data.signedUrl;
  }, []);

  const handleOnboarded = useCallback(async () => {
    setOnboarded(true);
    if (conversation.status !== "disconnected") return;
    try { new AudioContext().resume(); } catch { /* ignore */ }
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const signedUrl = await getSignedUrl();
      const topic = TOPICS.find((t) => t.id === selectedTopic);
      conversation.startSession({
        signedUrl,
        overrides: {
          agent: {
            firstMessage: topic
              ? `Let's practice: ${topic.label}.`
              : `Hey! I'm your English tutor. Pick a topic and let's get started!`,
          },
        },
      });
    } catch (e) {
      console.error("[handleStart]", e);
    }
  }, [conversation, getSignedUrl, selectedTopic]);

  const handleTopicChange = useCallback((topicId: number) => {
    setSelectedTopic(topicId);
    if (conversation.status === "connected") {
      const label = TOPICS.find((t) => t.id === topicId)?.label;
      conversation.sendContextualUpdate(`The user wants to switch topics. New topic: ${label}. Smoothly transition the conversation to this new topic.`);
    }
  }, [conversation]);

  const handleEnd = useCallback(() => {
    if (conversation.status === "disconnected") {
      router.push("/");
      return;
    }
    endingRef.current = true;
    conversation.endSession();
  }, [conversation, router]);

  return (
    <div className="flex flex-col md:flex-row h-full md:p-4 md:gap-4">
      {!onboarded && <AiCallOnboarding onStart={handleOnboarded} />}

      {/* Sidebar */}
      <aside
        className={`
          order-2 md:order-1
          md:w-[311px] md:shrink-0 md:flex-col md:rounded-3xl md:border md:border-border md:px-5 md:py-8 md:justify-between
          flex flex-row items-center justify-between
          px-4 py-3 border-t border-border bg-background
          transition-[filter] duration-500 ${blurClass}
        `}
      >
        {/* Topics — desktop */}
        <div className="hidden md:flex flex-col gap-7 w-full">
          <h1 className="text-2xl font-semibold text-dark">Choose topic</h1>
          <div className="flex flex-col gap-2.5">
            {TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => handleTopicChange(topic.id)}
                  className={`flex items-center gap-3 w-full bg-white px-4 py-4 rounded-2xl text-left transition-colors border ${
                    isSelected ? "border-accent" : "border-transparent"
                  }`}
                >
                  <Image src={topic.icon} alt="" width={36} height={36} className="shrink-0" />
                  <span className="text-base font-semibold text-dark">{topic.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Topics — mobile */}
        <div className="flex md:hidden items-center gap-2 w-full overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-1">
            {TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => handleTopicChange(topic.id)}
                  className={`flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-full text-xs font-semibold border transition-colors ${
                    isSelected
                      ? "border-accent text-accent bg-accent-12"
                      : "border-border text-dark bg-white"
                  }`}
                >
                  <Image src={topic.icon} alt="" width={20} height={20} />
                  <span>{topic.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* End session — desktop */}
        <button
          onClick={() => setShowEndConfirm(true)}
          className="hidden md:flex items-center justify-center gap-2 w-full border border-border rounded-2xl px-6 py-4.5 text-sm font-semibold text-dark hover:bg-hover transition-colors"
        >
          <Image src="/iconsax-close-circle.svg" alt="" width={16} height={16} />
          End session
        </button>

        {/* Confirm dialog */}
        {showEndConfirm && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
            <div className="absolute inset-0 bg-dark/20 backdrop-blur-sm" onClick={() => setShowEndConfirm(false)} />
            <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4 text-center">
              <p className="text-base font-semibold text-dark">End session?</p>
              <p className="text-sm text-dark-50">Your conversation will be stopped.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="flex-1 h-[49px] rounded-2xl border border-button-secondary text-sm font-semibold text-dark shadow-[0_4px_0_var(--color-button-secondary)] active:shadow-[0_1px_0_var(--color-button-secondary)] active:translate-y-[3px] transition-all duration-100 ease-out"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEnd}
                  className="flex-1 h-[49px] rounded-2xl bg-accent text-white text-sm font-semibold shadow-[0_4px_0_rgba(27,127,203,1)] active:shadow-[0_1px_0_rgba(27,127,203,0.3)] active:translate-y-[3px] transition-all duration-100 ease-out"
                >
                  End session
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <main
        className={`
          order-1 md:order-2
          relative flex-1 bg-white md:border md:border-border md:rounded-3xl
          overflow-hidden flex flex-col items-center justify-center
          transition-[filter] duration-500 ${blurClass}
        `}
      >
        {/* End button — mobile */}
        <button
          onClick={() => setShowEndConfirm(true)}
          className="md:hidden absolute top-8 right-5 flex items-center justify-center size-11 rounded-full border border-border bg-white/80 backdrop-blur-sm z-10"
        >
          <Image src="/iconsax-close-circle.svg" alt="" width={20} height={20} />
        </button>

        {/* Timer */}
        <p className="absolute top-8 left-1/2 -translate-x-1/2 text-xl font-medium text-dark">
          {isActive ? timer : "0:00"}
        </p>

        {/* AI Avatar */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative size-[132px]">
            <div
              className={`absolute inset-0 blur-[25px] rounded-full overflow-hidden transition-opacity duration-300 ${
                isSpeaking ? "opacity-40" : "opacity-20"
              }`}
            >
              <Image src="/ai-avatar-bg.png" alt="" fill className="object-cover" />
            </div>
            <div className="relative size-[132px] rounded-full overflow-hidden">
              <Image src="/ai-avatar-bg.png" alt="" fill className="object-cover" />
            </div>
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <Image src="/ai-memoji.png" alt="AI tutor" fill className="object-cover object-top scale-110" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-xl font-semibold text-dark">AI Tutor</p>
            <div className="flex items-center gap-1.5">
              {conversation.status === "connecting" ? (
                <>
                  <span className="size-1 rounded-full bg-dark-20 animate-pulse" />
                  <p className="text-xs text-dark">Connecting...</p>
                </>
              ) : isActive ? (
                <>
                  <span className={`size-1 rounded-full transition-colors ${isSpeaking ? "bg-accent" : "bg-green"}`} />
                  <p className="text-xs text-dark">{isSpeaking ? "Speaking..." : "Listening..."}</p>
                </>
              ) : (
                <>
                  <span className="size-1 rounded-full bg-dark-20" />
                  <p className="text-xs text-dark">Pick a topic and let&apos;s go</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Transcript */}
        {isActive && (prevChunk || currentChunk) && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-[280px] md:w-[360px] flex flex-col items-center gap-2 text-center">
            {prevChunk && (
              <p key={prevChunk} className="text-base text-dark-20 animate-chunk-out">
                {prevChunk}
              </p>
            )}
            {currentChunk && (
              <p key={currentChunk} className="text-xl font-semibold text-dark animate-chunk-in">
                {currentChunk}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AiCallPage() {
  return (
    <ConversationProvider>
      <AiCallContent />
    </ConversationProvider>
  );
}
