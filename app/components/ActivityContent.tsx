'use client';

import { useCallContext } from '@/app/(call)/layout';
import GuessTheObject from './GuessTheObject';

export default function ActivityContent() {
    const { activeCard } = useCallContext();

    if (activeCard === 'object') {
        return <GuessTheObject />;
    }

    if (activeCard === 'topic') {
        // TODO: Add SuggestTopic component when ready
        return null;
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

