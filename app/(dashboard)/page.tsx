'use client';

import { useRouter } from 'next/navigation';
import Fire from "@/app/components/Fire";
import Button from "@/app/components/Button";
import Queue from "../components/Queue";
import OnlineBadge from "../components/OnlineBadge";
import TimeSpentCard from "../components/TimeSpentCard";
import DailyGoal from "../components/DailyGoal";
import SnackBar from "../components/SnackBar";

export default function Home() {
  const router = useRouter();

  const handleStartCall = () => {
    router.push('/search');
  };

  return (
    <div className="py-8.75 w-[520px] mx-auto min-h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Welcome back, Tim 👋</h1>
        <Fire streak={3} />
      </div>

      <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-7 h-[495px]">
        <div className="relative flex flex-col gap-12 bg-background p-9 rounded-[20px] md:rounded-[24px] lg:rounded-[28px] col-span-2">
          <OnlineBadge count={231} className="absolute top-7 right-7" />
          <div className="flex flex-col gap-4.5">
            <span className="text-xs font-bold text-dark-50">REAL PRACTICE</span>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-dark">
                Speak with real person
              </h2>
              <p className="text-sm font-normal text-dark-70">
                We'll match you instantly with another learner
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleStartCall}>Start a call</Button>
            <Queue />
          </div>
        </div>
        <DailyGoal />
        <TimeSpentCard />
      </div>
      <div className="mt-auto">
        <SnackBar />
      </div>

    </div>
  );
}
