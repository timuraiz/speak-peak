"use client";

import { useEffect, useState, useRef } from "react";
import CircularProgress from "./CircularProgress";
import { useAuth } from "@/app/contexts/AuthContext";
import { createClient } from "@/app/lib/supabase/client";

export default function DailyGoal() {
  const { user, profile } = useAuth();
  const [progress, setProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(profile?.daily_goal_minutes ?? 15);
  const [editHours, setEditHours] = useState(0);
  const [editMinutes, setEditMinutes] = useState(15);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const hoursRef = useRef<HTMLInputElement>(null);
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const supabase = createClient();

  useEffect(() => {
    if (profile?.daily_goal_minutes) setDailyGoal(profile.daily_goal_minutes);
  }, [profile?.daily_goal_minutes]);

  useEffect(() => {
    if (!user) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    supabase
      .from('call_sessions')
      .select('duration_seconds')
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString())
      .then(({ data }) => {
        const total = (data ?? []).reduce((sum, s) => sum + s.duration_seconds, 0);
        setTimeSpentSeconds(total);
      });
  }, [user]);

  useEffect(() => {
    const timeSpentMinutes = timeSpentSeconds / 60;
    const targetProgress = dailyGoal > 0 ? timeSpentMinutes / dailyGoal : 0;
    const duration = 1500;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      setProgress(t * targetProgress);
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [dailyGoal, timeSpentSeconds]);

  const openEdit = () => {
    setEditHours(Math.floor(dailyGoal / 60));
    setEditMinutes(dailyGoal % 60);
    setIsEditing(true);
    setTimeout(() => hoursRef.current?.focus(), 10);
  };

  const handleSave = async () => {
    const total = editHours * 60 + editMinutes;
    const newGoal = total > 0 ? total : 1;
    setDailyGoal(newGoal);
    setIsEditing(false);
    if (!user) return;
    await supabase.from('profiles').update({ daily_goal_minutes: newGoal }).eq('id', user.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') setIsEditing(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const h = Math.floor(m / 60);
    if (h > 0) return `${h}h ${m % 60} min`;
    return `${m} min`;
  };

  const formatGoal = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0 && m > 0) return `${h}h ${m} min`;
    if (h > 0) return `${h}h`;
    return `${m} min`;
  };

  const inputClass = "w-10 text-sm font-normal text-dark bg-transparent border-b border-dark focus:outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="border border-border p-8 rounded-[20px] md:rounded-3xl lg:rounded-4xl relative">
      <button
        onClick={openEdit}
        className="bg-background absolute top-4 right-4 p-2.5 rounded-xl z-1 hover:opacity-80 transition-opacity cursor-pointer"
        aria-label="Edit daily goal"
      >
        <img src="/iconsax-edit-2.svg" alt="Edit daily goal" className="w-3 h-3" />
      </button>
      <h2 className="text-[28px] md:text-[30px] lg:text-[32px] font-semibold text-dark">
        {formatTime(timeSpentSeconds)}
      </h2>
      <p className="text-sm font-normal text-dark-50">Today's total speaking time</p>

      <div className="my-7 border-t border-dashed border-border" />

      <div className="flex items-center gap-3">
        <CircularProgress
          radius={radius}
          circumference={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-normal text-dark">
            {formatTime(timeSpentSeconds)} out{" "}
            {isEditing ? (
              <span
                className="inline-flex items-center gap-1"
                onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) handleSave(); }}
              >
                <input
                  ref={hoursRef}
                  type="number"
                  value={editHours}
                  onChange={(e) => setEditHours(Math.max(0, Number(e.target.value)))}
                  onKeyDown={handleKeyDown}
                  className={inputClass}
                  min="0"
                  max="23"
                />
                <span>h</span>
                <input
                  type="number"
                  value={editMinutes}
                  onChange={(e) => setEditMinutes(Math.min(59, Math.max(0, Number(e.target.value))))}
                  onKeyDown={handleKeyDown}
                  className={inputClass}
                  min="0"
                  max="59"
                />
                <span>min</span>
              </span>
            ) : (
              formatGoal(dailyGoal)
            )}
          </p>
          <p className="text-sm font-normal text-dark-50">Daily speaking goal</p>
        </div>
      </div>
    </div>
  );
}
