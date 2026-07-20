import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";

// Transcript categories - add new categories here and create corresponding folder
export const TRANSCRIPT_CATEGORIES = [
  "hld",
  "lld",
  "dsa",
  "behavioural",
  "ai",
] as const;

export type TranscriptCategory = typeof TRANSCRIPT_CATEGORIES[number];

export type TranscriptSummary = {
  slug: string;

  title: string;

  category: TranscriptCategory;

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