import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

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

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, time, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTime(initialTime);
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
