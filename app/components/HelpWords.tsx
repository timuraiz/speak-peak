'use client';

import { useRef } from 'react';
import WordCard from './WordCard';
import { useCallContext } from '@/app/(call)/layout';

export default function HelpWords() {
  const { currentTopic } = useCallContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => scrollContainerRef.current?.scrollBy({ left: -220, behavior: 'smooth' });
  const scrollRight = () => scrollContainerRef.current?.scrollBy({ left: 220, behavior: 'smooth' });

  const words = currentTopic?.meta?.help_words ?? [];

  return (
    <div className="mt-8 flex flex-col gap-6 border-t border-border pt-10">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-semibold text-dark">Help words</h3>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center cursor-pointer border border-border rounded-xl p-2.5" onClick={scrollLeft} aria-label="Scroll left">
              <img src="/Call/CaretLeft.svg" alt="" className="w-3 h-3" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center cursor-pointer border border-border rounded-xl p-2.5" onClick={scrollRight} aria-label="Scroll right">
              <img src="/Call/CaretRight.svg" alt="" className="w-3 h-3" />
            </button>
          </div>
        </div>
        <p className="text-sm text-dark-50">Useful vocabulary for this topic</p>
      </div>
      <div className="relative">
        <div ref={scrollContainerRef} className="flex gap-4 overflow-hidden pb-2">
          {words.map((w, i) => (
            <WordCard
              key={i}
              word={w.word}
              pronunciation={w.pronunciation}
              tags={w.tags}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
