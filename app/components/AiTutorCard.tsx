"use client";

import Image from "next/image";
import Link from "next/link";

export default function AiTutorCard() {
  return (
    <div className="relative overflow-hidden rounded-[20px] md:rounded-3xl lg:rounded-4xl border-4 border-white/20 h-[249px] col-span-2 shrink-0">
      {/* Background image */}
      <Image
        src="/ai-tutor-bg.png"
        alt=""
        fill
        className="object-cover pointer-events-none"
        priority
      />

      {/* AI tutor badge */}
      <div className="absolute top-6 right-6 flex items-center gap-1 backdrop-blur-sm bg-white/5 border border-white/20 rounded-full px-2.5 py-2">
        <Image src="/ai-tutor-star.svg" alt="" width={12} height={12} />
        <span className="text-xs font-medium text-white">AI tutor</span>
      </div>

      {/* 3D character */}
      <div className="absolute right-4 top-0 bottom-0 flex items-center pointer-events-none">
        <Image
          src="/ai-tutor-character.png"
          alt=""
          width={210}
          height={210}
          className="object-contain rotate-[12deg]"
        />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-9">
        <div className="flex flex-col font-semibold text-xl leading-snug w-[258px]">
          <span className="text-white/50">{"Let's Chat. "}</span>
          <span className="text-white">{"Pick a topic or just freestyle – I'll keep up."}</span>
        </div>

        <Link
          href="/ai-call"
          className="w-fit bg-white text-dark font-semibold text-sm px-6 h-[49px] rounded-2xl shadow-[0_4px_0_rgba(255,255,255,0.25)] active:shadow-[0_1px_0_rgba(255,255,255,0.1)] active:translate-y-[3px] transition-all duration-100 ease-out flex items-center"
        >
          Start speaking
        </Link>
      </div>
    </div>
  );
}
