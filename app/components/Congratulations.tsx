'use client';

import Button from './Button';
import LeaveActivityButton from './LeaveActivityButton';

interface CongratulationsProps {
    picturesCount?: number;
    onPlayAgain?: () => void;
    onLeave?: () => void;
}

export default function Congratulations({
    picturesCount = 14,
    onPlayAgain,
    onLeave
}: CongratulationsProps) {
    return (
        <div className="flex flex-col relative h-full p-32">
            {onLeave && (
                <div className="absolute top-0 left-0 z-10">
                    <LeaveActivityButton onClick={onLeave} />
                </div>
            )}
            <div className="bg-background rounded-3xl h-full flex flex-col items-center justify-center gap-8 relative">
                <div className="flex justify-center">
                    <img src="/Call/win.svg" alt="Congratulations" className="w-20 h-20" />
                </div>
                <div className="flex flex-col items-center justify-center gap-3">
                    <p className="text-xs font-bold text-dark-50 uppercase tracking-wide">
                        CONGRATULATIONS!
                    </p>
                    <h2 className="text-2xl font-semibold text-dark text-center">
                        You successfully<br />described {picturesCount} pictures
                    </h2>
                </div>
                {onPlayAgain && (
                    <div className="bg-white rounded-3xl p-2 flex justify-center absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                        <Button variant="primary-no-icon" onClick={onPlayAgain}>
                            <p className="text-base font-semibold text-white">Play it again</p>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

