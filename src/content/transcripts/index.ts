// src/content/transcripts/index.ts

import {
  TranscriptEntry,
  TranscriptCategory,
} from "./types";

import { TRANSCRIPTS } from "@/features/library/data/generated";

const categoryMap = new Map<
  TranscriptCategory,
  TranscriptEntry[]
>();

for (const transcript of TRANSCRIPTS) {
  const list =
    categoryMap.get(transcript.summary.category) ?? [];

  list.push(transcript);

  categoryMap.set(
    transcript.summary.category,
    list
  );
}

export function getAllTranscripts(): readonly TranscriptEntry[] {
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
  dsa: "Data Structures & Algorithms",
  hld: "High Level Design",
  lld: "Low Level Design",
  "machine-coding": "Machine Coding",
  sql: "SQL",
  database: "Database Internals",
  cpp: "C++",
  java: "Java",
  python: "Python",
  go: "Go",
  frontend: "Frontend",
  devops: "DevOps",
  os: "Operating Systems",
  networking: "Networking",
  behavioral: "Behavioral",
  ai: "AI / ML",
};
  return labels[category];
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

    if (transcript.summary.tags.length === 0) {
      throw new Error(
        `${transcript.summary.slug}: missing tags`
      );
    }

    if (transcript.summary.duration <= 0) {
      throw new Error(
        `${transcript.summary.slug}: invalid duration`
      );
    }
  }
}