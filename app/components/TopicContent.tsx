'use client';

import Button from "@/app/components/Button";

export default function TopicContent() {
    return (
        <div className="flex flex-col relative px-32">
            <div className="bg-background rounded-3xl h-[450px] flex flex-col items-center justify-center gap-8 relative ">
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="text-xs font-bold text-dark-50 uppercase tracking-wide">Topic for discussion</div>
                    <div className="text-dark text-2xl font-semibold">Your most memorable trip</div>
                </div>
                <div className="bg-white rounded-3xl p-2 flex justify-center absolute -bottom-5 left-1/2 transform -translate-x-1/2">
                    <Button variant="primary-no-icon" onClick={() => { }}>
                        <p className="text-base font-semibold text-white">Generate another topic</p>
                    </Button>
                </div>
            </div>
        </div>
    );
}

