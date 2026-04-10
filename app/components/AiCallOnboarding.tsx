"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { title: "Pick a topic", description: "Choose what you want to talk about." },
  { title: "Just speak naturally", description: "Talk out loud — no typing needed." },
  { title: "AI listens & responds", description: "The AI tutor keeps the conversation going." },
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
        className={`relative bg-white rounded-2xl p-8 w-full max-w-[400px] flex flex-col gap-7 transition-all duration-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col gap-1.5 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.4px] text-dark-50">
            Before you start
          </span>
          <h2 className="text-xl font-semibold text-dark">Here&apos;s how it works</h2>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-4">
          {STEPS.map((step, i) => (
            <div key={i} className="flex flex-col gap-0.5 text-center">
              <p className="text-sm font-semibold text-dark">{step.title}</p>
              <p className="text-sm text-dark-50">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="flex flex-col isolate pb-[45px] relative w-full">
          <button
            onClick={onStart}
            className="relative z-[2] mb-[-45px] bg-accent text-white font-semibold text-sm h-[49px] w-full rounded-2xl shadow-[0_4px_0_rgba(27,127,203,1)] active:shadow-[0_1px_0_rgba(27,127,203,0.3)] active:translate-y-[3px] transition-all duration-100 ease-out"
          >
            Let&apos;s go
          </button>
          <div className="bg-[#1b7fcb] h-[49px] rounded-2xl w-full z-[1]" />
        </div>
      </div>
    </div>
  );
}
