import type {
  EvidenceItem,
  DimensionScore,
} from "@/features/interview/domain/evaluation/types";

export interface EvaluationResult {
  overallScore: number; // 0-100
  dimensionScores: DimensionScore[];
  strengths: string[];
  weaknesses: string[];
  missedConcepts: string[];
  riskAssessment: string[];
  hireRecommendation: "STRONG_HIRE" | "HIRE" | "NO_HIRE" | "STRONG_NO_HIRE";
  feedback: string;
}

/** Minimal shape EvidenceEvaluator needs — matches the Prisma include used in EvaluationService. */
export interface EvaluatableInterview {
  id: string;
  startedAt: Date | null;
  createdAt: Date;
  mode: "CANDIDATE" | "REVERSE";
  transcript: Array<{
    id: string;
    role: string;
    content: string;
    createdAt: Date;
    elapsedSeconds?: number;
  }>;
  template: {
    id: string;
    slug: string;
    name: string;
    phases: Array<{ evaluationDimensions: unknown; reverseEvaluationDimensions?: unknown }>;
  };
}