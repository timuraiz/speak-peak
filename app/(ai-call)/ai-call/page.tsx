"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AiCallOnboarding from "@/app/components/AiCallOnboarding";

const TOPICS = [
  { id: 1, emoji: "☕", label: "Ordering coffee" },
  { id: 2, emoji: "💼", label: "Job interview" },
  { id: 3, emoji: "✈️", label: "At the airport" },
  { id: 4, emoji: "🎉", label: "Small talk at a party" },
  { id: 5, emoji: "📞", label: "Phone complaint" },
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

  const isSpeaking = aiState === "speaking";

  return (
    <div className="flex h-full p-4 gap-4">
      {!onboarded && <AiCallOnboarding onStart={() => setOnboarded(true)} />}
      {/* Sidebar */}
      <aside className={`w-[311px] shrink-0 flex flex-col justify-between bg-background border border-border rounded-3xl px-5 py-8 transition-[filter] duration-500 ${!onboarded ? "blur-sm" : "blur-0"}`}>
        <div className="flex flex-col gap-7">
          <h1 className="text-2xl font-semibold text-dark">Choose topic</h1>
          <div className="flex flex-col gap-2.5">
            {TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic.id)}
                  className={`flex items-center gap-3 w-full bg-white px-4 py-4 rounded-2xl text-left transition-colors ${
                    isSelected ? "border border-accent" : "border border-transparent"
                  }`}
                >
                  <span className="text-2xl shrink-0">{topic.emoji}</span>
                  <span className="text-base font-semibold text-dark">{topic.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* End session */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center gap-2 w-full border border-border rounded-2xl px-6 py-4.5 text-sm font-semibold text-dark hover:bg-hover transition-colors"
        >
          <Image src="/iconsax-close-circle.svg" alt="" width={16} height={16} />
          End session
        </button>
      </aside>

      {/* Main content */}
      <main
        className={`relative flex-1 bg-white border border-border rounded-3xl overflow-hidden flex flex-col items-center justify-center cursor-pointer transition-[filter] duration-500 ${!onboarded ? "blur-sm" : "blur-0"}`}
        onClick={() => setAiState(isSpeaking ? "listening" : "speaking")}
      >
        {/* Timer */}
        <p className="absolute top-8 left-1/2 -translate-x-1/2 text-xl font-medium text-dark">
          {timer}
        </p>

        {/* AI Avatar */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative size-[132px]">
            {/* Glow */}
            <div className="absolute inset-0 blur-[25px] opacity-20 rounded-full overflow-hidden">
              <Image src="/ai-avatar-bg.png" alt="" fill className="object-cover" />
            </div>
            {/* Circle bg */}
            <div className="relative size-[132px] rounded-full overflow-hidden">
              <Image src="/ai-avatar-bg.png" alt="" fill className="object-cover" />
            </div>
            {/* Memoji */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <Image
                src="/ai-memoji.png"
                alt="AI tutor"
                fill
                className="object-cover object-top scale-110"
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-xl font-semibold text-dark">AI Tutor</p>
            <div className="flex items-center gap-1.5">
              <span
                className={`size-1 rounded-full transition-colors ${
                  isSpeaking ? "bg-accent" : "bg-green"
                }`}
              />
              <p className="text-xs text-dark">
                {isSpeaking ? "Speaking..." : "Listening..."}
              </p>
            </div>
          </div>
        </div>

        {/* Messages — только когда ИИ говорит */}
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
