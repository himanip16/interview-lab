// src/features/interview/types/legacy-types.ts

export enum InterviewStatus {
  SETUP = "SETUP",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface TranscriptMessage {
  role: "assistant" | "user";
  content: string;
}

export interface ProcessInterviewMessageResult {
  reply: string;
  phase: string;
  previousPhase: string;
  transitioned: boolean;
  confidence: number;
  completed: boolean;
  summary: string;
}
export interface InterviewState {
  id: string;
  problem: {
  id: string;
  title: string;
  }

  type: string;
  difficulty: string;
  duration: number;
  company: string;

  status: InterviewStatus;

  currentPhase: string;

  createdAt: Date;
  updatedAt?: Date;

  summary: string;

  transcript: TranscriptMessage[];
}