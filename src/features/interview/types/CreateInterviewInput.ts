import { Difficulty } from "@prisma/client";

export interface CreateInterviewInput {
  templateId: string;
  difficulty: Difficulty;
  duration: number;
  company: string;
  problemId: string;
}