'use client';

import { useRouter } from 'next/navigation';
import Loader from '../../components/Loader';

export default function SearchPage() {
    const router = useRouter();

    const handleCancel = () => {
        router.push('/');
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-background px-4">
            <div className="flex flex-col items-center gap-8 max-w-md w-full">
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

                {/* Cancel button */}
                <button
                    onClick={handleCancel}
                    className="mt-4 px-6 py-3 rounded-2xl bg-white border border-border text-dark font-medium hover:bg-hover transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

