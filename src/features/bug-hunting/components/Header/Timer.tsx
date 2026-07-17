"use client";

import { useEffect, useState } from "react";

const START_SECONDS = 12 * 60 + 40;

function format(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Timer() {
  const [seconds, setSeconds] =
    useState(START_SECONDS);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeconds((value) =>
        value > 0 ? value - 1 : 0,
      );
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="timer">
      <div className="aura" />

      <div className="ring">
        <div className="t">
          {format(seconds)}
        </div>
      </div>
    </div>
  );
}