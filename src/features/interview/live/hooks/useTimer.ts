import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseTimerOptions {
  startedAt?: Date | string | number | null;
  durationMinutes: number;
  isRunning?: boolean;
  onFinish?: () => void;
}

export function useTimer({
  startedAt,
  durationMinutes,
  isRunning = true,
  onFinish,
}: UseTimerOptions) {
  const onFinishRef = useRef(onFinish);

  // Keep onFinish callback reference updated without re-triggering interval reset
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const calculateRemaining = useCallback(() => {
    if (!startedAt || durationMinutes <= 0) return 0;

    const startDate = new Date(startedAt);
    if (isNaN(startDate.getTime())) return 0;

    const startMs = startDate.getTime();

    const durationMs = durationMinutes * 60 * 1000;
    const endMs = startMs + durationMs;
    const remaining = Math.max(0, Math.floor((endMs - Date.now()) / 1000));

    return remaining;
  }, [startedAt, durationMinutes]);

  const [remainingSeconds, setRemainingSeconds] = useState<number>(calculateRemaining);

  useEffect(() => {
    // Sync immediately when parameters change
    const remaining = calculateRemaining();
    setRemainingSeconds(remaining);

    if (!isRunning || !startedAt || remaining <= 0) return;

    const timer = setInterval(() => {
      const updated = calculateRemaining();
      setRemainingSeconds(updated);

      if (updated <= 0) {
        clearInterval(timer);
        onFinishRef.current?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startedAt, durationMinutes, isRunning, calculateRemaining]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return {
    remainingSeconds,
    timeLeft: remainingSeconds, // Aliased for backwards compatibility
    formattedTime,
  };
}