// src/features/learning/components/whiteboard/hooks/useScenarioPlayback.ts

import { useRef, useCallback, useEffect, useState } from "react";

interface UseScenarioPlaybackReturn {
  isPlaying: boolean;
  playPause: () => void;
  stop: () => void;
}

export function useScenarioPlayback(
  onNextStep: () => void,
  hasMoreSteps: () => boolean,
  interval: number = 2100
): UseScenarioPlaybackReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const playPause = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
        playTimerRef.current = null;
      }
    } else {
      setIsPlaying(true);
      playTimerRef.current = setInterval(() => {
        onNextStep();
        
        // Check if we've reached the end
        if (!hasMoreSteps()) {
          setIsPlaying(false);
          if (playTimerRef.current) {
            clearInterval(playTimerRef.current);
            playTimerRef.current = null;
          }
        }
      }, interval);
    }
  }, [isPlaying, onNextStep, hasMoreSteps, interval]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, []);

  return {
    isPlaying,
    playPause,
    stop,
  };
}
