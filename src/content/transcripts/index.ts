import {
  TranscriptEntry,
} from "./types";

import { TRANSCRIPTS } from "./generated";

export function getAllTranscripts(): TranscriptEntry[] {
  return TRANSCRIPTS;
}

export function getTranscript(
  slug: string
): TranscriptEntry | undefined {
  return TRANSCRIPTS.find(
    (t) => t.summary.slug === slug
  );
}

export function getTranscriptsByCategory(
  category: string
): TranscriptEntry[] {
  return TRANSCRIPTS.filter(
    (t) => t.summary.category === category
  );
}

export function getCategories(): string[] {
  return [
    ...new Set(
      TRANSCRIPTS.map(
        (t) => t.summary.category
      )
    ),
  ];
}

export function getCategoryLabel(
  category: string
): string {
  const labels: Record<string, string> = {
    hld: "High Level Design",
    lld: "Low Level Design",
    dsa: "Data Structures & Algorithms",
    behavioural: "Behavioural"
  };

  return labels[category] || category;
}

function validateTranscripts() {
  const slugs = new Set<string>();

  for (const transcript of TRANSCRIPTS) {
    if (slugs.has(transcript.summary.slug)) {
      throw new Error(
        `Duplicate slug: ${transcript.summary.slug}`
      );
    }

    slugs.add(transcript.summary.slug);
  }
}

// Validate on import
validateTranscripts();