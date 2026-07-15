"use client";
import { useEffect, useState } from "react";

export function useTimer(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    const id = setInterval(() => setSecondsLeft((s) => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return { secondsLeft, formatted };
}