'use client';

import Button from "@/app/components/Button";

interface CrownDisplayProps {
    hasCrown: boolean;
    onGotIt: () => void;
}

export default function CrownDisplay({ hasCrown, onGotIt }: CrownDisplayProps) {
    return (
        <div className="flex flex-col relative h-full p-32">
            <div className="bg-background rounded-3xl h-full flex flex-col items-center justify-center gap-8 relative">
                {hasCrown ? (
                    <>
                        <img src="/Call/crown.svg" alt="Manager" className="w-20 h-20" />
                        <div className="flex flex-col items-center justify-center gap-3">
                            <p className="text-xs font-bold text-dark-50">YOU HAVE THE CROWN</p>
                            <p className="text-2xl font-semibold text-dark text-center">The right to choose<br />an activity is yours</p>
                        </div>
                    </>
                ) : (
                    <>
                        <img src="/Call/crown-grey.svg" alt="Partner has crown" className="w-20 h-20" />
                        <div className="flex flex-col items-center justify-center gap-3">
                            <p className="text-xs font-bold text-dark-50">YOUR PARTNER GOT THE CROWN</p>
                            <p className="text-2xl font-semibold text-dark text-center">The right to choose<br />an activity remains with him</p>
                        </div>
                    </>
                )}
                <div className="bg-white rounded-3xl p-2 flex justify-center absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                    <Button variant="primary-no-icon" onClick={onGotIt}>
                        <p className="text-base font-semibold text-white">Got it</p>
                    </Button>
                </div>
            </div>
        </div>
    );
}

