'use client';

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const TOTAL_FACES = 30;

function randomFaces(count: number): string[] {
  const indices = Array.from({ length: TOTAL_FACES }, (_, i) => i + 1);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, count).map((n) => `/faces/${n}.png`);
}

export default function Queue() {
  const [count, setCount] = useState<number | null>(null);
  const [online, setOnline] = useState<number | null>(null);
  const [avatars, setAvatars] = useState<string[]>(() => randomFaces(3));
  const fallbacksRef = useRef<string[]>(randomFaces(3));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/queue/stats');
        const data = await res.json();
        setCount(data.count);
        setOnline(data.online);
        const resolved = (data.avatars as (string | null)[]).map(
          (a, i) => a ?? fallbacksRef.current[i] ?? `/faces/${i + 1}.png`
        );
        // pad to 3 if fewer in queue
        while (resolved.length < 3) {
          resolved.push(fallbacksRef.current[resolved.length]);
        }
        setAvatars(resolved);
      } catch {}
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const zClasses = ['', '-ml-3 z-10', '-ml-3 z-20'];

  return (
    <div className="flex items-center gap-2">
      {avatars.map((src, i) => (
        <Image
          key={i}
          src={src}
          alt={`User ${i + 1}`}
          width={24}
          height={24}
          className={`object-cover rounded-full border-2 border-white ${zClasses[i]}`}
          quality={75}
        />
      ))}
      <span className="text-xs text-dark-50">
        <span className="text-xs text-dark">{online ?? '—'}</span> online
        {count !== null && count > 0 && (
          <>, <span className="text-dark">{count}</span> in queue</>
        )}
      </span>
    </div>
  );
}
