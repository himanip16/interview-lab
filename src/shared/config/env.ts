import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  DATABASE_URL: z.string().url(),

  OPENAI_API_KEY: z.string().min(1),

  OPENAI_MODEL: z
    .string()
    .default("gpt-5.5"),

  LOG_LEVEL: z
    .enum([
      "fatal",
      "error",
      "warn",
      "info",
      "debug",
      "trace",
      "silent",
    ])
    .default("info"),

  MODEL_TEMPERATURE: z.coerce
    .number()
    .min(0)
    .max(2)
    .default(0.5),

  MAX_OUTPUT_TOKENS: z.coerce
    .number()
    .int()
    .positive()
    .default(512),

  REQUEST_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(30000),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;