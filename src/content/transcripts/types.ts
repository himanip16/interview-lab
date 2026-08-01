// src/content/transcripts/types.ts

import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";

// Transcript categories - add new categories here and create corresponding folder
export const TRANSCRIPT_CATEGORIES = [
  "hld",
  "lld",
  "dsa",
  "behavioral",
  "ai",
  "machine-coding",
   "sql",
  "database",
  "cpp",
  "java",
  "python",
  
  "go",
  
  "frontend",
  
  "devops",
  "os",
  "networking"
] as const;

export type TranscriptCategory = typeof TRANSCRIPT_CATEGORIES[number];

export type TranscriptSummary = {
  id: number;
  slug: string;

  title: string;
  context?: string;
  category: TranscriptCategory;
  lps?: string[];
  difficulty: Difficulty;
  eval_dimensions?: string[];
  duration: number;

  company?: string[];

  tags: string[];

  description: string;
};

export type TranscriptEntry = {
  summary: TranscriptSummary;

  transcript: TranscriptData;
};

export function validateTranscripts(transcripts: TranscriptEntry[]): void {
  const slugs = new Set<string>();

  for (const transcript of transcripts) {
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

    if (transcript.summary.description.length > 300) {
      console.warn(
        `${transcript.summary.slug}: description exceeds 300 characters (${transcript.summary.description.length}), truncating`
      );
      transcript.summary.description = transcript.summary.description.slice(0, 297) + '...';
    }
  }
};