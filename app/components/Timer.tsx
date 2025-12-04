'use client';

import { useState, useEffect, useRef } from 'react';

interface TimerProps {
    initialSeconds?: number;
    onTimerEnd?: () => void;
}

export default function Timer({ initialSeconds = 30, onTimerEnd }: TimerProps) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const hasCalledOnTimerEnd = useRef(false);

    useEffect(() => {
        if (seconds <= 0) {
            if (onTimerEnd && !hasCalledOnTimerEnd.current) {
                hasCalledOnTimerEnd.current = true;
                onTimerEnd();
            }
            return;
        }

        const interval = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds, onTimerEnd]);

    const formatTime = (totalSeconds: number): string => {
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const isLowTime = seconds <= 10;

    return (
        <div className="flex items-center gap-3 bg-white rounded-xl px-3 py-2">
            <img
                src={isLowTime ? "/Call/iconsax-timer-red.svg" : "/Call/iconsax-timer.svg"}
                alt="Timer"
                className="w-5 h-5"
            />
            <p className={`text-sm font-medium ${isLowTime ? 'text-red-500' : 'text-dark-50'}`}>
                {formatTime(seconds)}
            </p>
        </div>
    );
}

