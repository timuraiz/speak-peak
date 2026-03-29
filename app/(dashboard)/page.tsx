"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { createClient } from "@/app/lib/supabase/client";
import Loader from "@/app/components/Loader";
import Fire from "@/app/components/Fire";
import Button from "@/app/components/Button";
import Queue from "../components/Queue";
import OnlineBadge from "../components/OnlineBadge";
import TimeSpentCard from "../components/TimeSpentCard";
import DailyGoal from "../components/DailyGoal";
import SnackBar from "../components/SnackBar";

function useStreak(userId: string | undefined) {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    supabase
      .from('call_sessions')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!data || data.length === 0) { setStreak(0); return; }

        const days = new Set(
          data.map(s => new Date(s.created_at).toDateString())
        );

        let count = 0;
        const today = new Date();
        for (let i = 0; i < 365; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          if (days.has(d.toDateString())) {
            count++;
          } else if (i === 0) {
            // today has no call yet — check yesterday before breaking
            continue;
          } else {
            break;
          }
        }
        setStreak(count);
      });
  }, [userId]);

  return streak;
}

function useOnlineCount(userId: string | undefined) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!userId) return;
    const ping = async () => {
      try {
        const res = await fetch('/api/presence/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        const data = await res.json();
        setCount(data.count);
      } catch {}
    };
    ping();
    const interval = setInterval(ping, 20_000);
    return () => clearInterval(interval);
  }, [userId]);

  return count;
}

export default function Home() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const displayName = profile?.name ?? user?.email?.split("@")[0] ?? "there";
  const streak = useStreak(user?.id);
  const onlineCount = useOnlineCount(user?.id);

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
        <Fire streak={streak} />
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 gap-3 md:gap-4 mt-5 md:mt-7 md:h-[495px]">
        <div className="border border-border relative flex flex-col gap-6 md:gap-12 bg-background p-8 md:p-9 rounded-[20px] md:rounded-3xl lg:rounded-4xl col-span-2">
          {onlineCount !== null && <OnlineBadge count={onlineCount} className="absolute top-7 right-7" />}
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
