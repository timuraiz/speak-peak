'use client';

import { useRef } from 'react';
import WordCard from './WordCard';

export default function HelpWords() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
        }
    };

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
                    <WordCard
                        word="Memorable"
                        pronunciation="['mem(ə)rəb(ə)l]"
                        tags={['Special', 'Worth remembering']}
                    />
                    <WordCard
                        word="Scenery"
                        pronunciation="['si:narı]"
                        tags={['the natural view', 'landscape']}
                    />
                    <WordCard
                        word="Memorable"
                        pronunciation="['mem(ə)rəb(ə)l]"
                        tags={['Special', 'Worth remembering']}
                    />
                    <WordCard
                        word="Scenery"
                        pronunciation="['si:narı]"
                        tags={['the natural view', 'landscape']}
                    />
                    <WordCard
                        word="Scenery"
                        pronunciation="['si:narı]"
                        tags={['the natural view', 'landscape']}
                    />
                    <WordCard
                        word="Scenery"
                        pronunciation="['si:narı]"
                        tags={['the natural view', 'landscape']}
                    />
                    <WordCard
                        word="Scenery"
                        pronunciation="['si:narı]"
                        tags={['the natural view', 'landscape']}
                    />
                </div>
            </div>
        </div>
    );
}

