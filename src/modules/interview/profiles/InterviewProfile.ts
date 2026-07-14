import { PhaseId, Goal, EvaluationDimension } from "../constants";

export interface InterviewPhaseDefinition {
  id: PhaseId;

  goals: Goal[];

  evaluationDimensions: EvaluationDimension[];

  targetDurationRatio: number;

  transitionThreshold: number;

  instructions: string;

  showWhiteboard: boolean;
}

export interface InterviewProfile {
  type: string;

  phases: InterviewPhaseDefinition[];
}
