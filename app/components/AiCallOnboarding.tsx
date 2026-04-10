"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Pick a topic to talk about",
  "Speak naturally — no typing needed",
  "AI listens, responds and keeps the conversation going",
];

interface Props {
  onStart: () => void;
}

export default function AiCallOnboarding({ onStart }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-dark/20 backdrop-blur-sm" onClick={onStart} />

      {/* Card */}
      <div
        className={`relative bg-background rounded-[28px] p-10 w-full max-w-[380px] flex flex-col items-center gap-8 text-center transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        {/* Icon */}
        <span className="text-[64px] leading-none select-none">🎙️</span>

        {/* Text */}
        <div className="flex flex-col gap-3 w-full">
          <p className="text-xs font-bold uppercase tracking-[0.48px] text-dark-50">
            Before you start
          </p>
          <h2 className="text-2xl font-semibold text-dark">
            Here&apos;s how it works
          </h2>
          <div className="flex flex-col gap-1.5 mt-1">
            {STEPS.map((step, i) => (
              <p key={i} className="text-sm text-dark-50">{step}</p>
            ))}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onStart}
          className="bg-accent text-white font-semibold text-sm h-[49px] w-full rounded-2xl shadow-[0_4px_0_rgba(27,127,203,1)] active:shadow-[0_1px_0_rgba(27,127,203,0.3)] active:translate-y-[3px] transition-all duration-100 ease-out"
        >
          Let&apos;s go
        </button>
      </div>
    </div>
  );
}
