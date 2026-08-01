// src/features/library/components/transcript-detail/LeftSidebar.tsx

"use client";

import { useMemo } from "react";
import type { TranscriptSection, Concept } from "@/features/library/types/transcript";

type Props = {
  sections: TranscriptSection[];
  currentSectionIndex: number;
  progress: number;
  bookmarks: string[];
  allMessages: Array<{ id?: string; text: string }>;
  exploredConcepts: string[];
  concepts: Record<string, Concept>;
  onJumpToSection: (sectionId: string) => void;
  onJumpToMessage: (messageId: string) => void;
  onJumpToConcept: (conceptKey: string) => void;
};

export function LeftSidebar({
  sections,
  currentSectionIndex,
  progress,
  bookmarks,
  allMessages,
  exploredConcepts,
  concepts,
  onJumpToSection,
  onJumpToMessage,
  onJumpToConcept,
}: Props) {
  const bookmarkedMessages = useMemo(() => {
    return bookmarks
      .map((id) => allMessages.find((m) => m.id === id))
      .filter(Boolean) as Array<{ id: string; text: string }>;
  }, [bookmarks, allMessages]);

  return (
    <div className="sticky top-5 hidden w-[180px] shrink-0 flex-col gap-3.5 lg:flex xl:flex">
      {/* Unified Session Summary - combines progress, streak, and XP */}
      <div
        className="rounded-[18px] border p-4.5"
        style={{ background: "#fff", borderColor: "rgba(21,22,28,0.07)" }}
      >
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-4 h-4 text-[#FF5A3C] flex-shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2c1 4-3 5-3 9a3 3 0 006 0c0-1-1-2-1-3 2 1 3 3 3 5a5 5 0 01-10 0c0-5 4-6 5-11z" />
            </svg>
            <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#5A5B66" }}>
              Session
            </div>
          </div>
          
          {progress > 5 && (
            <>
              <div className="mb-1 h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(21,22,28,0.08)" }}>
                <div
                  className="h-full transition-all duration-400"
                  style={{ width: `${progress}%`, background: "#00A87E" }}
                />
              </div>
              <div className="mb-3.5 text-[11px] font-semibold" style={{ color: "#5A5B66" }}>
                {progress}% complete
              </div>
            </>
          )}
          
          <div className="flex flex-col gap-1">
            {sections.map((section, index) => {
              const state = index < currentSectionIndex ? "done" : index === currentSectionIndex ? "active" : "upcoming";
              const icon = state === "done" ? "✓" : state === "active" ? "" : "";
              
              return (
                <div
                  key={section.id}
                  onClick={() => onJumpToSection(section.id)}
                  className="flex items-center gap-2 rounded-[10px] px-2 py-2 cursor-pointer text-[12.5px] font-medium"
                  style={{
                    color: state === "active" ? "#6A5AE0" : "#5A5B66",
                    background: state === "active" ? "rgba(106,90,224,0.09)" : "transparent",
                    fontWeight: state === "active" ? 700 : 500
                  }}
                >
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px]"
                    style={{
                      background: state === "done" ? "#00A87E" : state === "active" ? "#6A5AE0" : "transparent",
                      color: state === "done" || state === "active" ? "#fff" : "transparent",
                      border: state === "upcoming" ? "1.5px solid rgba(21,22,28,0.18)" : "none"
                    }}
                  >
                    {icon}
                  </span>
                  {section.title}
                  <span className="ml-auto text-[10px]" style={{ opacity: 0.6, color: "#5A5B66" }}>
                    {section.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Bookmarks Card */}
      <div
        className="rounded-[18px] border p-4.5"
        style={{ background: "#fff", borderColor: "rgba(21,22,28,0.07)" }}
      >
        <h3
          className="mb-3 text-[11px] font-bold uppercase tracking-wider"
          style={{ color: "#5A5B66" }}
        >
          My Bookmarks
        </h3>
        {bookmarkedMessages.length === 0 ? (
          <div className="py-1 text-[11.5px]" style={{ color: "#5A5B66", opacity: 0.7 }}>
            Nothing bookmarked yet.
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {bookmarkedMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => onJumpToMessage(msg.id)}
                className="cursor-pointer rounded-[9px] px-2 py-2 text-[12px]"
                style={{ color: "#5A5B66" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#FAF9F6"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                {msg.text.replace(/<[^>]+>/g, "").slice(0, 60)}…
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Concepts Card */}
      <div
        className="rounded-[18px] border p-4.5"
        style={{ background: "#fff", borderColor: "rgba(21,22,28,0.07)" }}
      >
        <h3
          className="mb-3 text-[11px] font-bold uppercase tracking-wider"
          style={{ color: "#5A5B66" }}
        >
          Concepts explored
        </h3>
        <div className="flex flex-col gap-1.5">
          {Object.entries(concepts).map(([key, concept]) => {
            const explored = exploredConcepts.includes(key);
            return (
              <div
                key={key}
                onClick={() => onJumpToConcept(key)}
                className="flex items-center gap-2 text-[12px] cursor-pointer"
                style={{
                  color: explored ? "#15161C" : "#5A5B66",
                  fontWeight: explored ? 600 : 400
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background: explored ? "#00A87E" : "transparent",
                    border: explored ? "none" : "1.5px solid rgba(21,22,28,0.2)"
                  }}
                />
                {concept.name} {explored ? "✓" : "○"}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
