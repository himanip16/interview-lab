// src/shared/schemas/interviewSchemas.ts
import { z } from "zod";
import { Difficulty, InterviewMode } from "@prisma/client";

export const StartInterviewSchema = z.object({
  type: z.string(),
  difficulty: z.nativeEnum(Difficulty),
  duration: z.number().int().positive(),
  company: z.string(),
  problemId: z.string().uuid(),
  mode: z.nativeEnum(InterviewMode).optional(),
  topic: z.string().optional(),
});

export const GoalsSchema = z.array(z.string());

export const EvaluationDimensionsSchema = z.array(z.string());

export const ConversationSchema = z.array(
  z.object({
    role: z.enum(["interviewer", "candidate", "assistant", "user"]),
    content: z.string(),
  })
);

export type StartInterviewInput = z.infer<typeof StartInterviewSchema>;