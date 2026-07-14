// src/features/library/components/transcript/HighlightExplanation.tsx
"use client";

import { type ContentBlock } from "../../types/transcript";

type Props = {
  highlight: ContentBlock & { type: "highlight" };
  onClose: () => void;
};

export default function HighlightExplanation({ highlight, onClose }: Props) {
  const isStrong = highlight.status === "strong";

  return (
    <div
      className={`mt-3 p-4 rounded-lg border ${
        isStrong
          ? "bg-emerald-50 border-emerald-200"
          : "bg-rose-50 border-rose-200"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span
          className={`text-xs font-bold uppercase ${
            isStrong ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {isStrong ? "✓ Strong moment" : "✗ Missed something"}
        </span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close explanation"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">
        {highlight.explanation}
      </p>
    </div>
  );
}
