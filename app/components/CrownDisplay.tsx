'use client';

import Button from "@/app/components/Button";

interface CrownDisplayProps {
    hasCrown: boolean;
    onGotIt: () => void;
}

export default function CrownDisplay({ hasCrown, onGotIt }: CrownDisplayProps) {
    return (
        <>
            <div className="bg-background rounded-3xl h-[calc(100%-32px)] flex flex-col items-center justify-center gap-8">
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
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-2 z-10">
                <div className="bg-white rounded-3xl pt-2 px-2">
                    <Button variant="primary-no-icon" className="mx-auto" onClick={onGotIt}>
                        <p className="text-base font-semibold text-white">Got it</p>
                    </Button>
                </div>
            </div>
        </>
    );
}

