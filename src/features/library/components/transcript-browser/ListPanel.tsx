// src/features/library/components/transcript-browser/ListPanel.tsx

"use client";

import { ChevronRight } from "lucide-react";
import type { TranscriptEntry } from "./types";

type Props = {
  items: TranscriptEntry[];
  selected: string | null;
  categories: Record<string, { label: string; color: string }>;
  currentPage: number;
  totalPages: number;
  onSelect: (slug: string) => void;
  onPageChange: (page: number) => void;
};

export default function ListPanel({
  items,
  selected,
  categories,
  currentPage,
  totalPages,
  onSelect,
  onPageChange,
}: Props) {
  return (
    <div
      className="list-col flex flex-col"
      style={{
        flex: 1,
        minWidth: 0,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        className="overflow-y-auto"
        style={{
          flex: 1,
          padding: "10px 14px",
        }}
      >
        {items.length === 0 ? (
          <div
            style={{
              padding: "30px",
              textAlign: "center",
              color: "#5A5B66",
              fontSize: "13.75px",
            }}
          >
            No transcripts match.
          </div>
        ) : (
          items.map((transcript, index) => {
            const isSelected =
              selected === transcript.slug;
            const catKey =
              transcript.category as keyof typeof categories;
            const catColor =
              categories[catKey]?.color || "#15161C";

            return (
              <div
                key={`${transcript.slug || "transcript"}-${index}`}
                onClick={() => onSelect(transcript.slug)}
                className="cursor-pointer"
                style={{
                  display: "flex",
                  padding: "12px",
                  borderRadius: "14px",
                  marginBottom: "4px",
                  transition:
                    "background 0.2s ease, transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                  background: isSelected
                    ? `${catColor}15`
                    : "transparent",
                  border: isSelected ? `1px solid ${catColor}40` : "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = `${catColor}10`;
                    e.currentTarget.style.borderColor = `${catColor}40`;
                    e.currentTarget.style.boxShadow = `0 2px 8px ${catColor}15`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background =
                      "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  flex: 1, 
                  minWidth: 0 
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#5A5B66',
                    minWidth: '40px',
                    textAlign: 'right',
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '-0.02em'
                  }}>
                    {transcript.id}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        lineHeight: 1.4,
                        color: "#15161C",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {transcript.title}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        lineHeight: 1.4,
                        color: "#5A5B66",
                        marginTop: "2px",
                      }}
                    >
                      {transcript.difficulty} • {transcript.duration}m
                    </div>
                  </div>
                </div>

                <ChevronRight
                  width={13}
                  height={13}
                  style={{
                    alignSelf: "center",
                    color: "#5A5B66",
                    opacity: isSelected ? 1 : 0,
                    transition: "opacity 0.2s ease",
                    flexShrink: 0,
                  }}
                />
              </div>
            );
          })
        )}
      </div>

      <div
        className="flex items-center justify-center gap-[10px] p-3"
        style={{
          flexShrink: 0,
        }}
      >
        <button
          onClick={() =>
            onPageChange(currentPage - 1)
          }
          disabled={currentPage <= 1}
          style={{
            fontSize: "12.65px",
            fontWeight: 600,
            padding: "6px 12px",
            borderRadius: "999px",
            border:
              "1px solid rgba(21,22,28,0.08)",
            background: "#FFFFFF",
            color: "#15161C",
            cursor:
              currentPage <= 1
                ? "default"
                : "pointer",
            opacity:
              currentPage <= 1 ? 0.35 : 1,
          }}
        >
          ← Prev
        </button>

        <div className="flex gap-[5px]">
          {Array.from({
            length: totalPages,
          }).map((_, i) => (
            <div
              key={i}
              style={{
                width:
                  i + 1 === currentPage
                    ? "14px"
                    : "6px",
                height: "6px",
                borderRadius:
                  i + 1 === currentPage
                    ? "3px"
                    : "50%",
                background:
                  i + 1 === currentPage
                    ? "#00A87E"
                    : "rgba(21,22,28,0.08)",
                transition:
                  "all 0.3s ease",
              }}
            />
          ))}
        </div>

        <button
          onClick={() =>
            onPageChange(currentPage + 1)
          }
          disabled={currentPage >= totalPages}
          style={{
            fontSize: "12.65px",
            fontWeight: 600,
            padding: "6px 12px",
            borderRadius: "999px",
            border:
              "1px solid rgba(21,22,28,0.08)",
            background: "#FFFFFF",
            color: "#15161C",
            cursor:
              currentPage >= totalPages
                ? "default"
                : "pointer",
            opacity:
              currentPage >= totalPages
                ? 0.35
                : 1,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}