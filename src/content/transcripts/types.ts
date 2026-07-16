import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";

// Transcript categories are derived from the filesystem structure
// New categories can be added by creating a new folder under src/content/transcripts/
export type TranscriptCategory = string;

export type TranscriptSummary = {
  slug: string;

  title: string;

  category: string;

  difficulty: Difficulty;

  duration: number;

  company?: string;

  tags: string[];

  description: string;
};

export type TranscriptEntry = {
  summary: TranscriptSummary;

  transcript: TranscriptData;
};