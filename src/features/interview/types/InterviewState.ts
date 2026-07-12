import { InterviewStatus } from "@prisma/client";
import { TranscriptMessage } from "./TranscriptMessage";

export interface InterviewState {
  id: string;

  type: string;
  difficulty: string;
  duration: number;
  company: string;

  status: InterviewStatus;

  currentPhase: string;

  summary: string;

  createdAt: Date;
  updatedAt: Date;

  transcript: TranscriptMessage[];
}