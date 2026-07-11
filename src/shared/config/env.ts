import * as z from "zod";

const envSchema = z.object({
  ENV_VAR_1: z.string(),
  ENV_VAR_2: z.string(),
  // Add more environment variables here
});

export const env = envSchema.parse(process.env);