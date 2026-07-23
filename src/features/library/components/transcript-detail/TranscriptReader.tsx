// src/features/library/components/transcript-detail/TranscriptReader.tsx

"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageBlock } from "./MessageBlock";
import type { ContentBlock, TranscriptData } from "@/features/library/types/transcript";

type Props = {
  title: string;
  company?: string;
  difficulty: string;
  duration: number;
  transcript: TranscriptData;
};

function collectHighlights(transcript: TranscriptData) {
  const highlights: Extract<ContentBlock, { type: "highlight" }>[] = [];
  for (const m of transcript.messages) {
    if (typeof m.content === "string") continue;
    for (const b of m.content) {
      if (b.type === "highlight") highlights.push(b);
    }
  }
  return highlights;
}

export function TranscriptReader({ title, company, difficulty, duration, transcript }: Props) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const highlights = useMemo(() => collectHighlights(transcript), [transcript]);
  const strengths = highlights.filter((h) => h.status === "strong");
  const gaps = highlights.filter((h) => h.status === "missed");

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
  };

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg"
      style={{ background: "#FAF9F6", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
    >
      {/* Scroll progress bar */}
      <div className="h-[3px] shrink-0" style={{ background: "rgba(21,22,28,0.06)" }}>
        <div className="h-full transition-[width] duration-100" style={{ width: `${progress}%`, background: "#00A87E" }} />
      </div>

      <div ref={scrollRef} onScroll={onScroll} className="min-h-0 flex-1 overflow-y-auto px-4 pb-10 pt-5 sm:px-6 sm:pt-6">
        <button
          onClick={() => router.push("/learn/transcripts")}
          className="mb-4 flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-medium sm:mb-5"
          style={{ borderColor: "rgba(21,22,28,0.1)", background: "none", color: "#5A5B66" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          Library / <b style={{ color: "#15161C" }}>Read a transcript</b>
        </button>

        <h1 className="text-[22px] font-bold leading-tight tracking-tight sm:text-[26px]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {title}
        </h1>

        <div className="mt-2.5 flex flex-wrap gap-2">
          {company && <span className="rounded-full border px-3 py-1 text-[11px] font-semibold" style={{ borderColor: "rgba(21,22,28,0.08)", color: "#5A5B66" }}>{company}</span>}
          <span className="rounded-full border px-3 py-1 text-[11px] font-semibold" style={{ borderColor: "rgba(21,22,28,0.08)", color: "#5A5B66" }}>{difficulty}</span>
          <span className="rounded-full border px-3 py-1 text-[11px] font-semibold" style={{ borderColor: "rgba(21,22,28,0.08)", color: "#5A5B66" }}>{duration} min</span>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[12px] font-semibold" style={{ background: "rgba(0,217,163,0.08)", color: "#00A87E" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="shrink-0">
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          This is a full past session. Just read — nothing to answer.
        </div>

        {highlights.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px]" style={{ color: "#5A5B66" }}>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-[18px] rounded" style={{ background: "rgba(0,217,163,0.35)" }} />
              Strong moment
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-[18px] rounded" style={{ background: "rgba(255,90,60,0.28)" }} />
              Missed something
            </span>
            <span className="opacity-80">tap a highlight to see why</span>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-5">
          {transcript.messages.map((message, i) => (
            <MessageBlock key={message.id ?? i} message={message} />
          ))}
        </div>

        {(strengths.length > 0 || gaps.length > 0) && (
          <div className="mt-9 rounded-[22px] p-5 sm:p-[26px]" style={{ background: "#15161C", color: "#fff" }}>
            <h3 className="mb-3.5 text-[15px] font-semibold sm:text-[16px]">How this session went</h3>
            <div className="flex flex-col gap-3 sm:flex-row">
              {strengths.length > 0 && (
                <div className="flex-1 rounded-2xl p-3.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wide" style={{ color: "#00D9A3" }}>
                    Strength
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {strengths[0].explanation}
                  </p>
                </div>
              )}
              {gaps.length > 0 && (
                <div className="flex-1 rounded-2xl p-3.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wide" style={{ color: "#FF8A6E" }}>
                    To work on
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {gaps[0].explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}