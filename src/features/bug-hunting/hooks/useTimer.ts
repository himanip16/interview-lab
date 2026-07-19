"use client";
import { useEffect, useState, useRef } from "react";

export function useTimer(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const startTimeRef = useRef<number | null>(null);
  const initialTimeRef = useRef<number>(initialSeconds);

  useEffect(() => {
    const id = setInterval(() => {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }

      // Calculate remaining time based on system clock
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, initialTimeRef.current - elapsed);
      
      setSecondsLeft(remaining);
    }, 1000);
    
    return () => clearInterval(id);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return { secondsLeft, formatted };
}