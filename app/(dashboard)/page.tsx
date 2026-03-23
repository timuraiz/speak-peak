"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import Loader from "@/app/components/Loader";
import Fire from "@/app/components/Fire";
import Button from "@/app/components/Button";
import Queue from "../components/Queue";
import OnlineBadge from "../components/OnlineBadge";
import TimeSpentCard from "../components/TimeSpentCard";
import DailyGoal from "../components/DailyGoal";
import SnackBar from "../components/SnackBar";

export default function Home() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const displayName = profile?.name ?? user?.email?.split("@")[0] ?? "there";

  if (loading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );

  const handleStartCall = () => {
    router.push("/search");
  };

  return (
    <div className="py-6 px-4 md:py-8.75 md:w-[520px] md:px-0 mx-auto min-h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-semibold">
          Welcome back, {displayName} 👋
        </h1>
        <Fire streak={3} />
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 gap-3 md:gap-4 mt-5 md:mt-7 md:h-[495px]">
        <div className="border border-border relative flex flex-col gap-6 md:gap-12 bg-background p-8 md:p-9 rounded-[20px] md:rounded-3xl lg:rounded-4xl col-span-2">
          <OnlineBadge count={231} className="absolute top-7 right-7" />
          <div className="flex flex-col gap-4.5">
            <span className="text-xs font-bold text-dark-50">
              REAL PRACTICE
            </span>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-dark">
                Speak with real person
              </h2>
              <p className="text-sm font-normal text-dark-70">
                We'll match you instantly with another learner
              </p>
            </div>
          </div>
          <div className="flex gap-4 pb-1">
            <Button onClick={handleStartCall} className="shrink-0">Start a call</Button>
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
