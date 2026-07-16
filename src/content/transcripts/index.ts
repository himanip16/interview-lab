import {
  TranscriptEntry,
  TranscriptCategory,
} from "./types";

import { TRANSCRIPTS } from "@/features/library/data/generated";

// Precompute indexes for O(1) lookups
const transcriptMap = new Map(
  TRANSCRIPTS.map(t => [t.summary.slug, t])
);

const categoryMap = new Map<TranscriptCategory, TranscriptEntry[]>();

for (const transcript of TRANSCRIPTS) {
  const list = categoryMap.get(transcript.summary.category) ?? [];
  list.push(transcript);
  categoryMap.set(transcript.summary.category, list);
}

export function getAllTranscripts(): ReadonlyArray<TranscriptEntry> {
  return TRANSCRIPTS;
}

export function getTranscript(
  slug: string
): TranscriptEntry | undefined {
  return transcriptMap.get(slug);
}

export function getTranscriptsByCategory(
  category: TranscriptCategory
): TranscriptEntry[] {
  return categoryMap.get(category) ?? [];
}

export function getCategories(): TranscriptCategory[] {
  return [
    ...new Set(
      TRANSCRIPTS.map(
        (t) => t.summary.category
      )
    ),
  ];
}

export function getCategoryLabel(
  category: TranscriptCategory
): string {
  const labels: Record<TranscriptCategory, string> = {
    hld: "High Level Design",
    lld: "Low Level Design",
    dsa: "Data Structures & Algorithms",
    behavioural: "Behavioural"
  };

  return labels[category] ?? category;
}

export function validateTranscripts(): void {
  const slugs = new Set<string>();

  for (const transcript of TRANSCRIPTS) {
    if (slugs.has(transcript.summary.slug)) {
      throw new Error(
        `Duplicate slug: ${transcript.summary.slug}`
      );
    }

    slugs.add(transcript.summary.slug);

    if (!transcript.summary.title.trim()) {
      throw new Error(
        `${transcript.summary.slug}: missing title`
      );
    }

    if (!transcript.summary.tags.length) {
      throw new Error(
        `${transcript.summary.slug}: no tags`
      );
    }

    if (transcript.summary.duration <= 0) {
      throw new Error(
        `${transcript.summary.slug}: invalid duration`
      );
    }
  }
}