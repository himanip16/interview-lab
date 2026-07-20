import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/shared/utils/utils';

interface TimerProps {
  initialTime?: number; // in seconds
  onTimeUp?: () => void;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ 
  initialTime = 0, 
  onTimeUp,
  className 
}) => {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const initialTimeRef = useRef<number>(initialTime);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep callback updated without triggering effect re-run
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && time > 0) {
      // Record start time when timer starts
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }
      
      interval = setInterval(() => {
        if (startTimeRef.current === null) return;
        
        // Calculate remaining time based on system clock
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const remaining = Math.max(0, initialTimeRef.current - elapsed);
        
        setTime(remaining);

        if (remaining <= 0) {
          setIsRunning(false);
          clearInterval(interval);
          onTimeUpRef.current?.();
        }
      }, 1000);
    } else if (!isRunning) {
      // Reset start time when paused
      startTimeRef.current = null;
    }

    return () => clearInterval(interval);
  }, [isRunning]); // Removed 'time' from dependencies to prevent jitter

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTime(initialTime);
    initialTimeRef.current = initialTime;
    startTimeRef.current = null;
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="font-mono text-2xl font-bold text-[var(--ink)]">
        {formatTime(time)}
      </div>
      <div className="flex gap-1">
        <button
          onClick={toggleTimer}
          className="px-3 py-1 text-sm bg-[var(--brand)] text-white radius-small hover:bg-[var(--brand-600)] transition-colors"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="px-3 py-1 text-sm bg-[var(--paper-200)] text-[var(--ink)] radius-small hover:bg-[var(--paper-300)] transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
