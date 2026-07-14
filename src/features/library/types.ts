// src/features/library/types.ts
import { Difficulty, ExperienceSource, InterviewMode } from "@prisma/client";

export type ExperienceItem = {
  id: string;
  role: string | null;
  level: string | null;
  year: number | null;
  source: ExperienceSource;
  url: string;
  notes: string | null;
  problem: {
    id: string;
    title: string;
    description: string | null;
    difficulty: Difficulty;
  };
  company: {
    name: string;
  };
};

export type TranscriptMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  elapsedSeconds: number;
};

export type DimensionScore = {
  dimension: string;
  score: number;
  summary: string;
};

export type EvidenceEntry = {
  dimension: string;
  timestampSeconds: number;
  quote: string;
  comment: string;
};

export type EvaluationMetadata = {
  strengths?: string[];
  weaknesses?: string[];
};

export type CompletedInterviewItem = {
  id: string;
  mode: InterviewMode;
  difficulty: Difficulty;
  duration: number;
  company: string;
  displayDate: string; // pre-formatted on the server — avoids hydration mismatches
  problem: {
    title: string;
  };
  template: {
    name: string;
  };
  transcript: TranscriptMessage[];
  evaluation: {
    overallScore: number;
    feedback: string;
    dimensionScores: DimensionScore[];
    evidence: EvidenceEntry[];
    metadata: EvaluationMetadata;
  } | null;
};

export type Tab = "problems" | "transcripts" | "diagrams" | "experiences";
