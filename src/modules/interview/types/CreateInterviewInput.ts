import {
  InterviewType,
  Difficulty,
} from "@prisma/client";

export interface CreateInterviewInput {
  userId: string;

  type: InterviewType;

  difficulty: Difficulty;

  duration: number;

  company: string;
}