// src/features/library/components/transcript/HighlightExplanation.tsx
"use client";

import { type ContentBlock } from "../../types/transcript";

type Props = {
  highlight: ContentBlock & { type: "highlight" };
  onClose: () => void;
};

export default function HighlightExplanation({ highlight, onClose }: Props) {
  return (
    <div className="relative max-w-[82%] self-end -mt-1.5">
      <div className="bg-white border border-[rgba(232,148,10,0.35)] rounded-[14px] px-3.5 py-2.5 flex items-start gap-2.5 shadow-[0_10px_24px_rgba(21,22,28,0.08)]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="flex-shrink-0 mt-0.5 text-[#E8940A]">
          <path d="M8 12h8M8 8h8M8 16h5M4 4h16v14l-4 4v-4H4z"/>
        </svg>
        <p className="text-[12px] text-[#15161C] flex-1 leading-relaxed">
          {highlight.explanation}
        </p>
        <button
          onClick={onClose}
          className="bg-none border-none text-[#5A5B66] cursor-pointer flex-shrink-0"
          aria-label="Close explanation"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M6 6l12 12M18 6L6 18"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
