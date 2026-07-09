export enum InterviewPhase {
  INTRODUCTION = "INTRODUCTION",
  REQUIREMENTS = "REQUIREMENTS",
  HLD = "HIGH_LEVEL_DESIGN",
  DEEP_DIVE = "DEEP_DIVE",
  TRADEOFFS = "TRADEOFFS",
  COMPLETED = "COMPLETED"
}


export interface InterviewState {
  id: string;
  question: string;
  phase: InterviewPhase;
  startedAt: number;
  phaseStartedAt: number;
}