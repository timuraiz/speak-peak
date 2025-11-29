'use client';

import { useEffect, useState, useRef } from 'react';
import CircularProgress from './CircularProgress';

export default function DailyGoal() {
  const [progress, setProgress] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(15);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeSpent = 10; // Current time spent in minutes
  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const duration = 1500; // ⚡ Change this to affect speed: lower = faster, higher = slower
    // Allow progress to exceed 1 (100%) to show over-completion like Apple Fitness
    const targetProgress = timeSpent / dailyGoal;

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progressValue = Math.min(elapsed / duration, 1);

      const eased = progressValue;

      setProgress(eased * targetProgress);

      if (progressValue < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [dailyGoal, timeSpent]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  return (
    <div className="border border-border p-8 rounded-[20px] md:rounded-[24px] lg:rounded-[28px] relative">

      <button
        onClick={handleEditClick}
        className='bg-background absolute top-4 right-4 p-2.5 rounded-xl z-1 hover:opacity-80 transition-opacity cursor-pointer'
        aria-label="Edit daily goal"
      >
        <img src="/iconsax-edit-2.svg" alt="Edit daily goal" className="w-3 h-3" />
      </button>
      <h2 className="text-[28px] md:text-[30px] lg:text-[32px] font-semibold text-dark">
        10 min
      </h2>
      <p className="text-sm font-normal text-dark-50">
        Today's total speaking time
      </p>

      <img
        src="/dashed.svg"
        alt="separator"
        className="my-7"
      />

      <div className="flex items-center gap-3">
        <CircularProgress
          radius={radius}
          circumference={circumference}
          strokeDashoffset={circumference * (1 - progress)}
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-normal text-dark">
            10 out{' '}
            {isEditing ? (
              <input
                ref={inputRef}
                type="number"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="inline-block w-12 text-sm font-normal text-dark bg-transparent border-b border-dark focus:outline-none focus:border-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="1"
              />
            ) : (
              dailyGoal
            )}{' '}
            min
          </p>
          <p className="text-sm font-normal text-dark-50">
            Daily speaking goal
          </p>
        </div>
      </div>
    </div>
  );
}

