import { z } from "zod";

export const StartInterviewResponseSchema = z.object({
  id: z.string(),
});

export type StartInterviewResponse = z.infer<typeof StartInterviewResponseSchema>;
