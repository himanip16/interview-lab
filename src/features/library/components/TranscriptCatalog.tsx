"use client";

import {
  getGroupedTranscripts,
  TRANSCRIPT_CATEGORIES,
} from "@/content/transcripts";

import TranscriptCategory from "./TranscriptCategory";
import EmptyState from "./EmptyState";

export default function TranscriptCatalog() {
  const grouped = getGroupedTranscripts();

  const hasTranscripts = Object.values(grouped).some(
    (items) => items.length > 0
  );

  if (!hasTranscripts) {
    return (
      <EmptyState message="No transcripts available yet." />
    );
  }

  return (
    <div className="space-y-10">
      {TRANSCRIPT_CATEGORIES.map((category) => (
        <TranscriptCategory
          key={category.id}
          title={category.label}
          transcripts={grouped[category.id]}
        />
      ))}
    </div>
  );
}