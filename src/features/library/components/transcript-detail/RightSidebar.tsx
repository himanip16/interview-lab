// src/features/library/components/transcript-detail/RightSidebar.tsx

"use client";

import { useMemo } from "react";
import type { ArchitectureNode, TranscriptSection, Concept } from "@/features/library/types/transcript";

type Props = {
  architectureSteps: ArchitectureNode[][];
  currentSectionIndex: number;
  sections: TranscriptSection[];
  progress: number;
  bookmarks: string[];
  allMessages: Array<{ id?: string; text: string }>;
  exploredConcepts: string[];
  concepts: Record<string, Concept>;
  onJumpToSection: (sectionId: string) => void;
  onJumpToMessage: (messageId: string) => void;
  onJumpToConcept: (conceptKey: string) => void;
};

export function RightSidebar({ 
  architectureSteps, 
  currentSectionIndex,
  sections,
  progress,
  bookmarks,
  allMessages,
  exploredConcepts,
  concepts,
  onJumpToSection,
  onJumpToMessage,
  onJumpToConcept
}: Props) {
  const maxNodes = architectureSteps[architectureSteps.length - 1] || [];
  const visibleCount = (architectureSteps[Math.min(currentSectionIndex, architectureSteps.length - 1)] || []).length;

  const bookmarkedMessages = useMemo(() => {
    return bookmarks
      .map((id) => allMessages.find((m) => m.id === id))
      .filter(Boolean) as Array<{ id: string; text: string }>;
  }, [bookmarks, allMessages]);

  const hasContent = maxNodes.length > 0 || Object.keys(concepts).length > 0 || bookmarkedMessages.length > 0;

  // Don't render if there's no content to show
  if (!hasContent) {
    return null;
  }

  return (
    <div className="sticky top-5 hidden w-[220px] shrink-0 flex-col gap-3.5 xl:flex lg:flex">
      {/* Session Card */}
      <div
        className="rounded-[18px] border p-4.5"
        style={{ background: "#fff", borderColor: "rgba(21,22,28,0.07)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <svg
            className="w-4 h-4 text-[#FF5A3C] flex-shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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
            
            return (
              <div
                key={section.id}
                onClick={() => onJumpToSection(section.id)}
                className="flex items-center gap-2 rounded-[10px] px-2 py-2 cursor-pointer text-[12.5px] font-medium"
                style={{
                  color: state === "active" ? "#3E6BFF" : "#5A5B66",
                  background: state === "active" ? "rgba(62,107,255,0.09)" : "transparent",
                  fontWeight: state === "active" ? 700 : 500
                }}
              >
                <span
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: state === "done" ? "#00A87E" : state === "active" ? "#3E6BFF" : "transparent",
                    border: state === "upcoming" ? "1.5px solid rgba(21,22,28,0.18)" : "none"
                  }}
                >
                  {state === "done" && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: "#fff" }}>
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
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
          <div className="py-3 flex flex-col items-center text-center">
            <svg
              className="w-8 h-8 mb-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ color: "rgba(90,91,102,0.3)" }}
            >
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <div className="text-[11.5px]" style={{ color: "#5A5B66", opacity: 0.7 }}>
              Nothing bookmarked yet.
            </div>
            <div className="text-[10px] mt-1" style={{ color: "#5A5B66", opacity: 0.5 }}>
              Click bookmark icon on messages to save them
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {bookmarkedMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => onJumpToMessage(msg.id)}
                className="cursor-pointer rounded-[9px] px-2 py-2 text-[12px] flex items-start gap-2"
                style={{ color: "#5A5B66" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#FAF9F6"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ color: "#00A87E" }}
                >
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="flex-1 line-clamp-2">{msg.text.replace(/<[^>]+>/g, "").slice(0, 80)}…</span>
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
        {Object.keys(concepts).length === 0 ? (
          <div className="py-3 flex flex-col items-center text-center">
            <svg
              className="w-8 h-8 mb-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ color: "rgba(90,91,102,0.3)" }}
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <div className="text-[11.5px]" style={{ color: "#5A5B66", opacity: 0.7 }}>
              No concepts yet
            </div>
            <div className="text-[10px] mt-1" style={{ color: "#5A5B66", opacity: 0.5 }}>
              Concepts will appear as you discuss them
            </div>
          </div>
        ) : (
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
                  {concept.name}
                  {explored && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "#00A87E" }}>
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* System Design Card - only if there's content */}
      {maxNodes.length > 0 && (
        <div
          className="rounded-[18px] border p-4.5"
          style={{ background: "#fff", borderColor: "rgba(21,22,28,0.07)" }}
        >
          <h3
            className="mb-3.5 text-[11px] font-bold uppercase tracking-wider"
            style={{ color: "#5A5B66" }}
          >
            System design, as it emerges
          </h3>
          <div className="flex flex-col">
            {maxNodes.map((node, index) => {
              const isVisible = index < visibleCount;
              return (
                <div key={index}>
                  {index > 0 && (
                    <div
                      className="ml-6 h-3.5 transition-opacity duration-300"
                      style={{
                        width: "1.5px",
                        background: "rgba(21,22,28,0.15)",
                        opacity: isVisible ? 1 : 0
                      }}
                    />
                  )}
                  <div
                    className="flex items-center gap-2.5 rounded-[11px] px-3 py-2.5 text-[12px] font-semibold transition-all duration-400"
                    style={{
                      background: node.color,
                      color: "#fff",
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? "translateY(0)" : "translateY(8px)"
                    }}
                  >
                    {node.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
