import {
  InterviewState,
  InterviewStatus,
} from "../types";

export function createInterview(
  type: string,
  difficulty: string,
  duration: number,
  company: string
): InterviewState {
  return {
    id: crypto.randomUUID(),

    type,

    difficulty,

    duration,

    company,

    status: InterviewStatus.IN_PROGRESS,

    createdAt: new Date(),

    transcript: [],
  };
}