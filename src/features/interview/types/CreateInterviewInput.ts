// src/features/interview/types/CreateInterviewInput.ts

import { Difficulty, InterviewMode } from "@prisma/client";

export interface CreateInterviewInput {
  templateId: string;
  difficulty: Difficulty;
  duration: number;
  company: string;
  problemId: string;
  mode?: InterviewMode;
  topic?: string;
}