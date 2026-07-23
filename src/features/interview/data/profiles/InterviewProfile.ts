// src/features/interview/data/profiles/InterviewProfile.ts

import { PhaseId, Goal, EvaluationDimension } from "../constants";

export interface PhasePrompt {
  objective: string;
  rules?: string[];
  examples?: string[];
  exitCriteria?: string[];
}

export interface GoalDefinition {
  id: Goal;
  required: boolean;
  weight: number;
}

export interface InterviewPhaseDefinition {
  id: PhaseId;

  goals: GoalDefinition[];

  evaluationDimensions: EvaluationDimension[];

  continuousEvaluation: EvaluationDimension[];

  phaseEvaluation: EvaluationDimension[];

  targetDurationRatio: number;

  transitionThreshold: number;

  prompt: PhasePrompt;

  showWhiteboard: boolean;
}

export interface InterviewProfileMetadata {
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedQuestions: number;
  maxRetries: number;
  allowBacktracking: boolean;
  supportsInterruptions: boolean;
}

export interface InterviewProfile {
  type: string;

  metadata: InterviewProfileMetadata;

  phases: InterviewPhaseDefinition[];
}
