// src/app/learn/transcripts/page.tsx

"use client";

import TranscriptBrowser from "@/features/library/components/transcript-browser/TranscriptBrowser";

export default function TranscriptsPage() {
  return (
    <div
      style={{ background: "#EAE7DF" }}
      className="h-[calc(100dvh-64px)] overflow-hidden"
    >
      <div className="mx-auto h-full max-w-[1400px] p-2 sm:p-4">
        <div
          className="h-full overflow-hidden rounded-lg"
          style={{
            background: "#FAF9F6",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <TranscriptBrowser />
        </div>
      </div>
    </div>
  );
}