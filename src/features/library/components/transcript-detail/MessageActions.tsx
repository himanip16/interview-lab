// src/features/library/components/transcript-detail/MessageActions.tsx

"use client";

import { useState } from "react";

type Props = {
  messageId: string;
  isBookmarked: boolean;
  isCandidate: boolean;
  onToggleBookmark: (id: string) => void;
  onAddNote: (id: string) => void;
  onAskAI: (id: string, type: "why" | "explain" | "challenge") => void;
};

export function MessageActions({ 
  messageId, 
  isBookmarked, 
  isCandidate, 
  onToggleBookmark, 
  onAddNote, 
  onAskAI 
}: Props) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className="mt-1.5 flex items-center gap-1.5 opacity-0 transition-opacity duration-150"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{ opacity: showActions ? 1 : undefined }}
    >
      <button
        onClick={() => onToggleBookmark(messageId)}
        className="flex items-center gap-1 rounded-full border px-2 py-1 text-[10.5px] font-semibold cursor-pointer"
        style={{
          color: isBookmarked ? "#E8940A" : "#5A5B66",
          borderColor: isBookmarked ? "rgba(232,148,10,0.3)" : "rgba(21,22,28,0.1)",
          background: isBookmarked ? "rgba(232,148,10,0.08)" : "none"
        }}
      >
        ★ {isBookmarked ? "Bookmarked" : "Bookmark"}
      </button>
      <button
        onClick={() => onAddNote(messageId)}
        className="flex items-center gap-1 rounded-full border px-2 py-1 text-[10.5px] font-semibold cursor-pointer"
        style={{ color: "#5A5B66", borderColor: "rgba(21,22,28,0.1)", background: "none" }}
      >
        + Note
      </button>
      {isCandidate && (
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => onAskAI(messageId, "why")}
            className="rounded-full px-2.5 py-1 text-[10.5px] font-semibold cursor-pointer border-none"
            style={{ color: "#6A5AE0", background: "rgba(106,90,224,0.08)" }}
          >
            💬 Ask why?
          </button>
          <button
            onClick={() => onAskAI(messageId, "explain")}
            className="rounded-full px-2.5 py-1 text-[10.5px] font-semibold cursor-pointer border-none"
            style={{ color: "#6A5AE0", background: "rgba(106,90,224,0.08)" }}
          >
            💬 I don't understand
          </button>
          <button
            onClick={() => onAskAI(messageId, "challenge")}
            className="rounded-full px-2.5 py-1 text-[10.5px] font-semibold cursor-pointer border-none"
            style={{ color: "#6A5AE0", background: "rgba(106,90,224,0.08)" }}
          >
            💬 Challenge this
          </button>
        </div>
      )}
    </div>
  );
}
