'use client';

import { useState } from 'react';
import ActivityCard from "@/app/components/ActivityCard";


export default function CallLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <div className="flex h-screen w-screen overflow-hidden p-4 gap-4">
      <aside className="w-[311px] flex-shrink-0 px-5 py-8 flex flex-col h-full gap-7 items-start">
        <h1 className="text-2xl font-semibold text-[#494949]">Choose an activity</h1>
        <div className='flex flex-col gap-2'>
          <ActivityCard
            icon="/Call/iconsax-gallery.svg"
            title="Guess the object"
            description="Explain the picture. Your partner tries to guess the object"
            alt="gallery icon"
            isPressed={activeCard === 'object'}
            object={true}
            onClick={() => setActiveCard(activeCard === 'object' ? null : 'object')}
          />
          <ActivityCard
            icon="/Call/iconsax-message-notif.svg"
            title="Suggest a topic"
            description="Get a topic for discussion"
            alt="message notification icon"
            isPressed={activeCard === 'topic'}
            topic={true}
            onClick={() => setActiveCard(activeCard === 'topic' ? null : 'topic')}
          />
        </div>
      </aside>
      <main className="flex-1 min-w-0 overflow-auto bg-white border border-border rounded-3xl">
        {children}
      </main>
    </div>
  );
}

