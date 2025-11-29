'use client';

import { useEffect, useState } from 'react';
import CircularProgress from './CircularProgress';

export default function DailyGoal() {
  const [progress, setProgress] = useState(0);
  const targetProgress = 0.7;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Animate progress from 0 to target value
    const duration = 1500; // ⚡ Change this to affect speed: lower = faster, higher = slower

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progressValue = Math.min(elapsed / duration, 1);

      // 🎨 EASING OPTIONS - uncomment one to change animation style:
      // Linear (current): constant speed
      const eased = progressValue;

      // Ease-out: fast start, slow end (smooth deceleration)
      // const eased = 1 - Math.pow(1 - progressValue, 3);

      // Ease-in: slow start, fast end (acceleration)
      // const eased = Math.pow(progressValue, 3);

      // Ease-in-out: slow start and end, fast middle
      // const eased = progressValue < 0.5 
      //   ? 2 * Math.pow(progressValue, 3)
      //   : 1 - Math.pow(-2 * progressValue + 2, 3) / 2;

      // Exponential ease-out: very fast start, very slow end
      // const eased = 1 - Math.pow(1 - progressValue, 4);

      setProgress(eased * targetProgress);

      if (progressValue < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="border border-border p-8 rounded-[20px] md:rounded-[24px] lg:rounded-[28px]">
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
          strokeDashoffset={strokeDashoffset}
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-normal text-dark">10 out 15 min</p>
          <p className="text-sm font-normal text-dark-50">
            Daily speaking goal
          </p>
        </div>
      </div>
    </div>
  );
}

