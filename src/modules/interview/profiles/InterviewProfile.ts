export type PhaseId = string;

export interface InterviewPhaseDefinition {
  id: PhaseId;

  goals: string[];

  evaluationDimensions: string[];

  targetDurationRatio: number;

  transitionThreshold: number;

  instructions: string;
}

export interface InterviewProfile {
  type: string;

  phases: InterviewPhaseDefinition[];
}
