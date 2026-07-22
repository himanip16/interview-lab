"use client";

import { useState } from "react";
import type { ContentBlock } from "@/features/library/types/transcript";

const HIGHLIGHT_STYLES: Record<string, { bg: string; border: string; label: string; labelColor: string; underline: string }> = {
  strong: { bg: "rgba(0, 217, 163, 0.1)", border: "#00A87E", label: "Strong", labelColor: "#00A87E", underline: "#00D9A3" },
  missed: { bg: "rgba(255, 90, 60, 0.1)", border: "#FF5A3C", label: "Missed", labelColor: "#E0432A", underline: "#FF5A3C" },
  note: { bg: "rgba(232, 148, 10, 0.1)", border: "#E8940A", label: "Note", labelColor: "#C97800", underline: "#E8940A" },
};

export function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  const [revealed, setRevealed] = useState(false);

  switch (block.type) {
    case "text":
      return (
        <p className="whitespace-pre-wrap text-[14px] leading-relaxed sm:text-[15px]" style={{ color: "#15161C" }}>
          {block.value}
        </p>
      );

    case "highlight": {
      const style = HIGHLIGHT_STYLES[block.status] ?? HIGHLIGHT_STYLES.note;

      if (!revealed) {
        return (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="block w-full rounded-lg p-2.5 text-left transition-colors sm:p-3"
            style={{ background: "transparent" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(21,22,28,0.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span
              className="whitespace-pre-wrap text-[13.5px] leading-relaxed sm:text-[14px]"
              style={{
                color: "#15161C",
                textDecoration: "underline",
                textDecorationColor: style.underline,
                textDecorationThickness: "2px",
                textUnderlineOffset: "3px",
                textDecorationStyle: "dashed",
              }}
            >
              {block.value}
            </span>
            <span
              className="ml-2 inline-flex items-center gap-1 text-[10.5px] font-semibold sm:text-[11px]"
              style={{ color: "#9A9BA6" }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              Tap to see evaluation
            </span>
          </button>
        );
      }

      return (
        <button
          type="button"
          onClick={() => setRevealed(false)}
          className="block w-full rounded-lg border-l-[3px] p-3 text-left sm:p-3.5"
          style={{ background: style.bg, borderColor: style.border }}
        >
          <div className="mb-1 flex items-center justify-between gap-2">
            <span
              className="text-[10px] font-bold uppercase tracking-wide sm:text-[10.5px]"
              style={{ color: style.labelColor }}
            >
              {style.label}
            </span>
            <span className="text-[10.5px]" style={{ color: "#9A9BA6" }}>
              Tap to hide
            </span>
          </div>
          <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed sm:text-[14px]" style={{ color: "#15161C" }}>
            {block.value}
          </p>
          {block.explanation && (
            <p className="mt-2 text-[12.5px] leading-relaxed sm:text-[13px]" style={{ color: "#5A5B66" }}>
              {block.explanation}
            </p>
          )}
        </button>
      );
    }

    case "code":
      return (
        <div className="overflow-x-auto rounded-lg" style={{ background: "#15161C" }}>
          <pre className="p-3 text-[12px] leading-relaxed sm:p-4 sm:text-[13px]">
            <code style={{ color: "#F3F2EE", fontFamily: "'JetBrains Mono', monospace" }}>
              {block.value}
            </code>
          </pre>
        </div>
      );

    case "whiteboard":
    case "animation":
      return (
        <div className="rounded-lg border p-2 sm:p-3" style={{ borderColor: "rgba(21,22,28,0.08)", background: "#fff" }}>
          <div
            className="w-full [&_svg]:h-auto [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: block.value }}
          />
          {block.caption && (
            <div className="mt-2 text-center text-[11.5px] sm:text-[12px]" style={{ color: "#5A5B66" }}>
              {block.caption}
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}