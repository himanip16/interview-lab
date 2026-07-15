import { TranscriptEntry, TranscriptCategory } from "./types";

import paymentSystem from "./hld/payment-system";

const TRANSCRIPTS: TranscriptEntry[] = [
  paymentSystem,
];

export function getAllTranscripts(): TranscriptEntry[] {
  return TRANSCRIPTS;
}

export function getTranscript(slug: string): TranscriptEntry | undefined {
  return TRANSCRIPTS.find(
    (transcript) => transcript.summary.slug === slug
  );
}

export function getTranscriptsByCategory(
  category: TranscriptCategory
): TranscriptEntry[] {
  return TRANSCRIPTS.filter(
    (transcript) => transcript.summary.category === category
  );
}

export function getGroupedTranscripts(): Record<
  TranscriptCategory,
  TranscriptEntry[]
> {
  return {
    hld: getTranscriptsByCategory("hld"),
    lld: getTranscriptsByCategory("lld"),
    dsa: getTranscriptsByCategory("dsa"),
    behavioural: getTranscriptsByCategory("behavioural"),
  };
}

export const TRANSCRIPT_CATEGORIES: {
  id: TranscriptCategory;
  label: string;
}[] = [
  {
    id: "hld",
    label: "High Level Design",
  },
  {
    id: "lld",
    label: "Low Level Design",
  },
  {
    id: "dsa",
    label: "Data Structures & Algorithms",
  },
  {
    id: "behavioural",
    label: "Behavioural",
  },
];