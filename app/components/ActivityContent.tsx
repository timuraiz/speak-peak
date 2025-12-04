'use client';

import { useState } from 'react';
import { useCallContext } from '@/app/(call)/layout';
import GuessTheObject from './GuessTheObject';
import HelpWords from './HelpWords';
import TopicContent from './TopicContent';

export default function ActivityContent() {
    const { activeCard } = useCallContext();
    const [timerEnded, setTimerEnded] = useState(false);

    if (activeCard === 'object') {
        return (
            <div className="flex flex-col gap-12 h-full">
                <GuessTheObject onTimerEndChange={setTimerEnded} />
                {!timerEnded && <HelpWords />}
            </div>
        );
    }

    if (activeCard === 'topic') {
        return (
            <div className="flex flex-col gap-12 h-full">
                <TopicContent />
                <HelpWords />
            </div>
        );
    }

    return (
        <div className='flex flex-col justify-center items-center gap-8 h-full'>
            <img src="/Call/iconsax-mouse-square.svg" alt="" className="w-7 h-7" />
            <div className='flex flex-col gap-3'>
                <h2 className='text-dark text-xl font-semibold text-center'>Choose an activity</h2>
                <p className='text-dark-50 text-sm font-normal text-center'>Choose one of the options<br />
                    on the left to begin.
                </p>
            </div>
        </div>
    );
}

