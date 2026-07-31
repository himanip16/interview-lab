// src/features/library/components/transcript-detail/ContinueBanner.tsx

"use client";

import { useEffect, useState } from "react";
import type { UserProgress } from "@/features/library/types/transcript";

type Props = {
  sectionTitle: string;
  onJump: () => void;
};

export function ContinueBanner({ sectionTitle, onJump }: Props) {
  const [show, setShow] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("td_progress");
    if (saved) {
      try {
        const progress: UserProgress = JSON.parse(saved);
        if (progress.pct < 98) {
          setPct(progress.pct);
          setShow(true);
        }
      } catch (e) {
        console.error("Error parsing progress:", e);
      }
    }
  }, []);

  if (!show) return null;

  return (
    <div
      className="flex items-center justify-between gap-3.5 px-5.5 py-3"
      style={{ background: "#15161C", color: "#fff" }}
    >
      <div className="text-[13px]">
        Continue from where you left off — <b style={{ color: "#00D9A3" }}>{sectionTitle}</b>, {pct}% complete
      </div>
      <button
        onClick={() => {
          onJump();
          setShow(false);
        }}
        className="shrink-0 rounded-full border-none px-4 py-2 text-[12.5px] font-semibold cursor-pointer"
        style={{ background: "#00A87E", color: "#fff" }}
      >
        Jump back in
      </button>
    </div>
  );
}
