import { z } from "zod";

export const StartInterviewResponseSchema = z.object({
  id: z.string(),
});