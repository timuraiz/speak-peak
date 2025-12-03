'use client';

import { useState } from 'react';
import CrownDisplay from "@/app/components/CrownDisplay";


export default function CallPage() {
    const [GotIt, setGotIt] = useState(false);

    return (
        <div className="relative h-full">
            {!GotIt ? <CrownDisplay hasCrown={true} onGotIt={() => setGotIt(!GotIt)} /> :
                <div className='flex flex-col justify-center items-center gap-8 h-full'>
                    <img src="/Call/iconsax-mouse-square.svg" alt="" className="w-7 h-7" />
                    <div className='flex flex-col gap-3'>
                        <h2 className='text-dark text-xl font-semibold text-center'>Choose an activity</h2>
                        <p className='text-dark-50 text-sm font-normal text-center'>Choose one of the options<br />
                            on the left to begin.
                        </p>
                    </div>
                </div>
            }
        </div>
    );
}

