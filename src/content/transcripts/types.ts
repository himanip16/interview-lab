import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";

export type TranscriptCategory =
  | "hld"
  | "lld"
  | "dsa"
  | "behavioural";

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