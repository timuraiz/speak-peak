'use client';

export default function ConnectingPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center px-4 py-8">
            <div className="flex flex-col items-center gap-6">
                <img
                    src="/partner.png"
                    alt="Alex Smith"
                    className="w-24 h-24 rounded-full"
                />
                <h2 className="text-xl font-semibold text-dark">
                    Alex Smith
                </h2>
                <div className="flex gap-1.5 items-center">
                    <div className="w-1 h-1 bg-accent rounded-full"></div>
                    <p className="text-xs font-light text-dark">
                        Connecting
                        <span className="connecting-dots">
                            <span className="dot">.</span>
                            <span className="dot">.</span>
                            <span className="dot">.</span>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

