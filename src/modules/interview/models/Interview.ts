import {
  InterviewStatus,
  InterviewType,
  Difficulty,
} from "@prisma/client";

export interface Interview {
  id: string;

  type: InterviewType;

  difficulty: Difficulty;

  duration: number;

  company: string;

  status: InterviewStatus;

  currentPhase: string;

  summary: string;

  promptVersion: string;

  createdAt: Date;

  updatedAt: Date;
}