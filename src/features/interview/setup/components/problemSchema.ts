import { z } from "zod";
import { Difficulty, ProblemCategory } from "@prisma/client";

export const ProblemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  category: z.nativeEnum(ProblemCategory),
  difficulty: z.nativeEnum(Difficulty),
  interviewType: z.string(),
  cruxOfProblem: z.string().nullable(),
  estimatedMinutes: z.number().nullable(),
  tags: z.array(z.string()),
  completionHistory: z
    .object({
      completed: z.boolean(),
      timesCompleted: z.number(),
      lastCompletedAt: z.coerce.date().nullable(),
    })
    .optional(),
});

export const ProblemsResponseSchema = z.object({
  problems: z.array(ProblemSchema),
  totalPages: z.number(),
});

export type Problem = z.infer<typeof ProblemSchema>;
export type ProblemsResponse = z.infer<typeof ProblemsResponseSchema>;
