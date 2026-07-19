'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InterviewHeaderProps {
  title: string;
  isLive: boolean;
  remainingSeconds: number;
}

/**
 * InterviewHeader
 *
 * Shows:
 * - Back button
 * - Interview title
 * - "Live" indicator (if IN_PROGRESS)
 * - Timer with countdown
 *
 * Timer updates every second from remainingSeconds prop
 */
export function InterviewHeader({
  title,
  isLive,
  remainingSeconds,
}: InterviewHeaderProps) {
  const router = useRouter();
  const [displaySeconds, setDisplaySeconds] = useState(remainingSeconds);

  // Update display seconds every second
  useEffect(() => {
    setDisplaySeconds(remainingSeconds);

    if (remainingSeconds <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setDisplaySeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [remainingSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      {/* Left: Back + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/problems')}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <p className="text-sm text-gray-600">Live interview</p>
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>
      </div>

      {/* Right: Live + Timer */}
      <div className="flex items-center gap-4">
        {isLive && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-red-500">Live</span>
          </div>
        )}

        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-gray-900 text-white">
          <span className="text-sm font-mono font-semibold">
            {formatTime(displaySeconds)}
          </span>
          <span className="text-xs text-gray-400">LEFT</span>
        </div>
      </div>
    </div>
  );
}