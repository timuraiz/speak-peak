'use client';

import { useEffect, useState } from "react";
import Button from "@/app/components/Button";
import { useCallContext } from "@/app/(call)/layout";

export default function TopicContent() {
  const { currentTopic, setCurrentTopic, isLeader } = useCallContext();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentTopic) {
      setVisible(false);
      const t = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [currentTopic?.id]);

  const fetchTopic = async () => {
    if (loading) return;
    setVisible(false);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 250));
    try {
      const res = await fetch('/api/topics/random');
      const data = await res.json();
      setCurrentTopic(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (isLeader && !currentTopic) {
      fetchTopic();
    }
  }, [isLeader]);

  return (
    <div className="flex flex-col relative px-4 md:px-32">
      <div className="bg-background rounded-3xl h-[450px] flex flex-col items-center justify-center gap-8 relative">
        <div
          className={`flex flex-col items-center justify-center gap-3 transition-all duration-500 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="text-xs font-bold text-dark-50 uppercase tracking-wide">Topic for discussion</div>
          <div className="text-dark text-2xl font-semibold text-center px-6">
            {currentTopic?.title ?? ''}
          </div>
        </div>
        {isLeader && (
          <div className="bg-white rounded-3xl p-2 flex justify-center absolute -bottom-5 left-1/2 transform -translate-x-1/2">
            <Button variant="primary-no-icon" onClick={fetchTopic} disabled={loading}>
              <p className="text-base font-semibold text-white">
                {loading ? 'Generating...' : 'Generate another topic'}
              </p>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
