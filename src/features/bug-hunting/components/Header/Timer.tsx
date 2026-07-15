"use client";
import { useTimer } from "../../hooks/useTimer";

export default function Timer({ seconds }: { seconds: number }) {
  const { formatted } = useTimer(seconds);
  return (
    <div className="timer">
      <div className="aura" />
      <div className="ring"><div className="t">{formatted}</div></div>
    </div>
  );
}