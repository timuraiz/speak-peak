"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { createClient } from "@/app/lib/supabase/client";

function getHeatMapColor(timeSpent: number, dailyGoal: number): string {
  if (dailyGoal === 0) return "bg-dark-8";
  const percentage = (timeSpent / dailyGoal) * 100;
  if (percentage >= 100) return "bg-accent";
  if (percentage >= 70) return "bg-accent-70";
  if (percentage >= 50) return "bg-accent-50";
  if (percentage >= 25) return "bg-accent-25";
  return "bg-dark-8";
}

function formatTotal(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60} min`;
  return `${m} min`;
}

export default function TimeSpentCard() {
  const { user, profile } = useAuth();
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [dailyData, setDailyData] = useState<number[]>(Array(36).fill(0));
  const supabase = createClient();
  const dailyGoal = profile?.daily_goal_minutes ?? 60;

  useEffect(() => {
    if (!user) return;

    const since = new Date();
    since.setDate(since.getDate() - 35);
    since.setHours(0, 0, 0, 0);

    supabase
      .from('call_sessions')
      .select('duration_seconds, created_at')
      .eq('user_id', user.id)
      .gte('created_at', since.toISOString())
      .then(({ data }) => {
        if (!data) return;

        const total = data.reduce((sum, s) => sum + s.duration_seconds, 0);
        setTotalSeconds(total);

        const byDay: Record<string, number> = {};
        data.forEach(s => {
          const day = new Date(s.created_at).toDateString();
          byDay[day] = (byDay[day] ?? 0) + s.duration_seconds;
        });

        const grid = Array(36).fill(0);
        for (let i = 0; i < 36; i++) {
          const d = new Date();
          d.setDate(d.getDate() - (35 - i));
          const key = d.toDateString();
          grid[i] = Math.floor((byDay[key] ?? 0) / 60);
        }
        setDailyData(grid);
      });
  }, [user]);

  return (
    <div className="border border-border p-8 rounded-[20px] md:rounded-3xl lg:rounded-4xl">
      <h2 className="text-[28px] md:text-[30px] lg:text-[32px] font-semibold text-dark">
        {formatTotal(totalSeconds)}
      </h2>
      <p className="text-sm font-normal text-dark-50">Total time spent on calls</p>
      <div className="grid grid-cols-9 grid-rows-4 mt-5 gap-2">
        {dailyData.map((timeSpent, i) => (
          <div
            key={i}
            className={`w-full max-w-5 aspect-square rounded-full mx-auto ${getHeatMapColor(timeSpent, dailyGoal)}`}
          />
        ))}
      </div>
    </div>
  );
}
