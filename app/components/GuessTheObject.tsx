'use client';

import Button from "@/app/components/Button";
import Timer from "@/app/components/Timer";

interface GuessTheObjectProps {
    onRight?: () => void;
    onSkip?: () => void;
}

export default function GuessTheObject({ onRight, onSkip }: GuessTheObjectProps) {
    return (
        <div className="flex flex-col relative">
            <div className="bg-background rounded-3xl h-fit flex flex-col items-center justify-end gap-10 p-5 pt-14" >
                <div className='w-[50%]'>
                    <img src="/Call/picture.png" alt="Guess the object" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <h2 className='text-xl font-medium text-dark'>Mountains</h2>
                    <p className='text-sm text-dark-50'>/ˈmaʊn(t)nz/</p>
                </div>

                <div className="w-full flex justify-start">
                    <Timer />
                </div>
            </div>
            <div className="bg-white rounded-3xl pt-2 px-2 flex justify-center gap-2 absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                <Button variant="secondary" onClick={onSkip}>
                    <p className="text-base font-semibold text-dark-50">Skip</p>
                </Button>
                <Button variant="primary" onClick={onRight} icon="/Call/iconsax-tick-circle.svg">
                    <p className="text-base font-semibold text-white">Right</p>
                </Button>
            </div>
        </div>
    );
}

