import { z } from "zod";
import { Difficulty, ProblemCategory } from "@prisma/client";

// src/features/interview/setup/components/problemSchema.ts

export const ProblemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  category: z.nativeEnum(ProblemCategory),
  difficulty: z.nativeEnum(Difficulty),
  // FIX: Make this nullable or optional to match the database
  interviewType: z.string().nullable().optional(), 
  cruxOfProblem: z.string().nullable(),
  estimatedMinutes: z.number().nullable(),
  // Ensure tags is always an array
  tags: z.array(z.string()).default([]), 
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
