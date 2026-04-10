"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AiCallOnboarding from "@/app/components/AiCallOnboarding";

const TOPICS = [
  { id: 1, icon: "/topic-coffee.svg", label: "Ordering coffee" },
  { id: 2, icon: "/topic-job.svg", label: "Job interview" },
  { id: 3, icon: "/topic-airport.svg", label: "At the airport" },
  { id: 4, icon: "/topic-party.svg", label: "Small talk at a party" },
  { id: 5, icon: "/topic-phone.svg", label: "Phone complaint" },
];

function useTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type AiState = "speaking" | "listening";

export default function AiCallPage() {
  const router = useRouter();
  const timer = useTimer();
  const [selectedTopic, setSelectedTopic] = useState(2);
  const [aiState, setAiState] = useState<AiState>("speaking");
  const [onboarded, setOnboarded] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const isSpeaking = aiState === "speaking";
  const blurClass = !onboarded ? "blur-sm" : "blur-0";

  return (
    <div className="flex flex-col md:flex-row h-full md:p-4 md:gap-4">
      {!onboarded && <AiCallOnboarding onStart={() => setOnboarded(true)} />}

      {/* Sidebar — desktop: left column, mobile: bottom panel */}
      <aside
        className={`
          order-2 md:order-1
          md:w-[311px] md:shrink-0 md:flex-col md:rounded-3xl md:border md:border-border md:px-5 md:py-8 md:justify-between
          flex flex-row items-center justify-between
          px-4 py-3 border-t border-border bg-background
          transition-[filter] duration-500 ${blurClass}
        `}
      >
        {/* Topics — desktop only */}
        <div className="hidden md:flex flex-col gap-7 w-full">
          <h1 className="text-2xl font-semibold text-dark">Choose topic</h1>
          <div className="flex flex-col gap-2.5">
            {TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
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

        {/* Mobile: topic selector pill + end button */}
        <div className="flex md:hidden items-center gap-2 w-full overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-1">
            {TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
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

        {/* End session — mobile: separate row above topics */}
        <button
          onClick={() => setShowEndConfirm(true)}
          className="md:hidden shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border border-border text-dark bg-white"
        >
          <Image src="/iconsax-close-circle.svg" alt="" width={14} height={14} className="opacity-70" />
          End
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
                  onClick={() => router.push("/")}
                  className="flex-1 h-[49px] rounded-2xl bg-accent text-white text-sm font-semibold shadow-[0_4px_0_rgba(27,127,203,1)] active:shadow-[0_1px_0_rgba(27,127,203,0.3)] active:translate-y-[3px] transition-all duration-100 ease-out"
                >
                  End session
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main
        className={`
          order-1 md:order-2
          relative flex-1 bg-white md:border md:border-border md:rounded-3xl
          overflow-hidden flex flex-col items-center justify-center
          cursor-pointer transition-[filter] duration-500 ${blurClass}
        `}
        onClick={() => setAiState(isSpeaking ? "listening" : "speaking")}
      >
        {/* Timer */}
        <p className="absolute top-8 left-1/2 -translate-x-1/2 text-xl font-medium text-dark">
          {timer}
        </p>

        {/* AI Avatar */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative size-[132px]">
            <div className="absolute inset-0 blur-[25px] opacity-20 rounded-full overflow-hidden">
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
              <span className={`size-1 rounded-full transition-colors ${isSpeaking ? "bg-accent" : "bg-green"}`} />
              <p className="text-xs text-dark">{isSpeaking ? "Speaking..." : "Listening..."}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {isSpeaking && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 text-center w-[234px]">
            <p className="text-base font-medium text-dark-20">
              Hey! I&apos;m your English tutor. Let&apos;s start to practise english
            </p>
            <p className="text-xl font-medium text-dark">How was your day?</p>
          </div>
        )}
      </main>
    </div>
  );
}
