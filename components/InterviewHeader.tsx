"use client";

import { useEffect, useState } from "react";

interface Props {
  phase: string;
  phaseStart: number;
  duration: number;
}

export default function InterviewHeader({
  phase,
  phaseStart,
  duration,
}: Props) {

  const [remaining, setRemaining] = useState(
    phaseStart + duration * 1000 - Date.now()
  );


  useEffect(() => {

    const timer = setInterval(() => {

      setRemaining(
        phaseStart + duration * 1000 - Date.now()
      );

    }, 1000);


    return () => clearInterval(timer);

  }, [phaseStart, duration]);


  const minutes = Math.max(
    0,
    Math.floor(remaining / 1000 / 60)
  );

  const seconds = Math.max(
    0,
    Math.floor((remaining / 1000) % 60)
  );


  return (
    <header className="border-b bg-white px-6 py-4">

      <h1 className="text-2xl font-bold text-black">
        AI System Design Interviewer
      </h1>

      <p className="text-sm text-gray-500">
        Practice High Level Design interviews
      </p>

      <div className="mt-3 text-sm">

        <p>
          Phase: {phase}
        </p>

        <p>
          Time Remaining:
          {" "}
          {minutes}:{seconds.toString().padStart(2,"0")}
        </p>

      </div>

    </header>
  );
}