'use client';

import { useState } from 'react';
import CrownDisplay from "@/app/components/CrownDisplay";
import ActivityContent from "@/app/components/ActivityContent";
import { useCallContext } from '../layout';

export default function CallPage() {
    const [GotIt, setGotIt] = useState(false);
    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="relative h-full">
                {!GotIt ? <CrownDisplay hasCrown={true} onGotIt={() => setGotIt(!GotIt)} /> :
                    <ActivityContent />
                }
            </div>
        </div>
    );
}

