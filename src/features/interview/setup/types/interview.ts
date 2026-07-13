import { z } from "zod";

export const StartInterviewResponseSchema = z.object({
  id: z.string(),
  type: z.string(),
  difficulty: z.string(),
  duration: z.number(),
  company: z.string(),
  problemId: z.string(),
  createdAt: z.string().optional(),
});

export type StartInterviewResponse = z.infer<typeof StartInterviewResponseSchema>;
