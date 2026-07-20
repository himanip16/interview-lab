// components/interview/live/Timer.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useTimer } from '../hooks/useTimer';

interface TimerProps {
  durationInMinutes: number;
  interviewId: string;
  onFinish?: () => void;
}

export default function Timer({ durationInMinutes, interviewId, onFinish }: TimerProps) {
  const router = useRouter();

  const handleFinish = async () => {
    const response = await fetch(`/api/interviews/${interviewId}/finish`, {
      method: 'POST',
    });
    if (response.ok) {
      router.push(`/interview/report/${interviewId}`);
    }
    onFinish?.();
  };

  const { formattedTime, timeLeft } = useTimer(durationInMinutes, handleFinish);

  return (
    <div className={`p-2 rounded-lg font-mono text-xl ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
      {formattedTime}
    </div>
  );
}