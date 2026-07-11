import {
  Difficulty,
  InterviewStatus,
  InterviewType,
} from "@prisma/client";

import { InterviewState } from "../types/InterviewState";

export function createInterview(
  input: {
    userId: string;
    type: InterviewType;
    difficulty: Difficulty;
    duration: number;
    company: string;
  }
): Omit<InterviewState, "id"> {
  return {
    userId: input.userId,

    type: input.type,

    difficulty: input.difficulty,

    duration: input.duration,

    company: input.company,

    status: InterviewStatus.SETUP,

    currentPhase: "introduction",

    summary: "Interview has not started yet.",

    createdAt: new Date(),

    updatedAt: new Date(),
  };
}