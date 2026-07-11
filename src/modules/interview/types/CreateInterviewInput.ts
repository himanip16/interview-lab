import { Difficulty, InterviewType } from "@prisma/client";

export interface CreateInterviewInput {

  type: InterviewType;

  difficulty: Difficulty;

  duration: number;

  company: string;
}