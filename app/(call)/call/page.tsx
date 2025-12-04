'use client';

import { useState } from 'react';
import CrownDisplay from "@/app/components/CrownDisplay";
import ActivityContent from "@/app/components/ActivityContent";

export default function CallPage() {
    const [GotIt, setGotIt] = useState(false);

    return (
        <div className="relative h-full p-32">
            {!GotIt ? <CrownDisplay hasCrown={true} onGotIt={() => setGotIt(!GotIt)} /> :
                <ActivityContent />
            }
        </div>
    );
}

