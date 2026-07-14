import { useState, useEffect, useCallback } from 'react';

export function useTimer(durationInMinutes: number, onFinish: () => void) {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish();
      return;
    }

    if (isPaused) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused, onFinish]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return {
    timeLeft,
    formattedTime: `${minutes}:${seconds.toString().padStart(2, '0')}`,
    isPaused,
    pause,
    resume,
  };
}