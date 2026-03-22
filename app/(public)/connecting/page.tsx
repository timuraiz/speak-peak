'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

function ConnectingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const roomId = params.get('roomId');
  const partnerName = params.get('partnerName') ?? 'Partner';

  useEffect(() => {
    if (!roomId) {
      router.push('/');
      return;
    }

    const timeout = setTimeout(() => {
      router.push(`/call?roomId=${roomId}`);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [roomId, router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="flex flex-col items-center gap-6">
        <img
          src="/partner.png"
          alt={partnerName}
          className="w-24 h-24 rounded-full"
        />
        <h2 className="text-xl font-semibold text-dark">{partnerName}</h2>
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

export default function ConnectingPage() {
  return (
    <Suspense>
      <ConnectingContent />
    </Suspense>
  );
}
