'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import Button from '../../components/Button';

export default function SearchPage() {
    const router = useRouter();
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        // Increment elapsed time every second
        const interval = setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    const handleCancel = () => {
        router.push('/');
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center px-4 py-8">
            <div className="flex flex-col items-center gap-8 max-w-md w-full">
                {/* Main search section */}
                <div className="flex flex-col items-center gap-6 w-full">
                    <Loader />

                    {/* Text content */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <h1 className="text-2xl md:text-3xl font-semibold text-dark">
                            Searching for a partner
                        </h1>
                        <p className="text-sm font-normal text-dark-70 max-w-sm">
                            This usually takes just a few seconds.
                        </p>
                    </div>

                    {/* Cancel button and Timer */}
                    <div className="flex flex-col gap-4 items-center w-full">
                        <Button
                            variant="secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <p className="text-sm font-normal text-dark-70">
                            Searching for <span className="text-dark font-medium">{formatTime(elapsedSeconds)}</span>
                        </p>
                    </div>
                </div>

                {/* Practice card */}
                <div className="bg-background w-full max-w-sm h-fit p-6 md:p-8 rounded-3xl flex flex-col gap-4.5 mt-8">
                    <div className="flex justify-between items-center">
                        <span className="text-dark-50 font-bold text-xs uppercase tracking-wide">
                            Repeat before practice
                        </span>
                        <img
                            src="/practice.svg"
                            alt="Practice logo"
                            className="w-6 h-6"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className="text-base font-semibold text-dark">Present Simple</p>
                        <div className="space-y-1">
                            <p className="text-xs text-dark-70 leading-relaxed">
                                We use it for habits.
                                <br />
                                He/She/It → +s.
                                <br />
                                Example: She works every day.
                                <br />
                                Try: Say one habit about yourself.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

