import { z } from "zod";

export const GoalsSchema = z.array(z.string());

export const EvaluationDimensionsSchema = z.array(z.string());

export const ConversationSchema = z.array(
  z.object({
    role: z.enum(["interviewer", "candidate", "assistant", "user"]),
    content: z.string(),
  })
);

export const JsonSchema = z.unknown();

export type Goal = z.infer<typeof GoalsSchema>[number];

export type EvaluationDimension =
  z.infer<typeof EvaluationDimensionsSchema>[number];