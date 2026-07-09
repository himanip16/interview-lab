"use client";

import { useEffect, useState } from "react";

interface Props {
  phase: string;
  phaseStartedAt: number;
  duration: number;
}

export default function InterviewHeader({
  phase,
  phaseStartedAt,
  duration,
}: Props) {
  const [phaseStart, setPhaseStart] = useState<number | null>(null);

  useEffect(() => {
    setPhaseStart(Date.now());
  }, []);

  const [remaining, setRemaining] = useState(duration * 1000);

  useEffect(() => {
    if (phaseStart === null) return;

    const updateRemaining = () => {
      setRemaining(
        Math.max(
          0,
          phaseStart + duration * 1000 - Date.now()
        )
      );
    };

    updateRemaining();

    const timer = setInterval(updateRemaining, 1000);

    return () => clearInterval(timer);
  }, [phaseStart, duration]);

  const minutes = Math.floor(remaining / 1000 / 60);

  const seconds = Math.floor((remaining / 1000) % 60);

  return (
    <header className="border-b p-4">
      <h1 className="text-2xl font-bold">
        AI System Design Interviewer
      </h1>

      <p className="text-sm text-gray-500">
        Practice High Level Design interviews
      </p>

      <div className="mt-3 text-sm">
        <p>Phase: {phase}</p>

        <p>
          Time Remaining: {minutes}:
          {seconds.toString().padStart(2, "0")}
        </p>
      </div>
    </header>
  );
}