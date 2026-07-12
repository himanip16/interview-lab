// components/interview/live/Timer.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TimerProps {
  durationInMinutes: number;
  interviewId: string;
}

export default function Timer({ durationInMinutes, interviewId }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);
  const router = useRouter();

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleFinish = async () => {
    await fetch(`/api/interviews/${interviewId}/finish`, {
      method: 'POST',
      body: JSON.stringify({ interviewId }),
    });
    router.push(`/interview/report/${interviewId}`);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className={`p-2 rounded-lg font-mono text-xl ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
      {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}