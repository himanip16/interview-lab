// src/shared/config/env.ts

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  DATABASE_URL: z.string().url(),

  AI_PROVIDER: z
    .enum(["ollama", "openai"])
    .default("ollama"),

  OLLAMA_BASE_URL: z
    .string()
    .url()
    .default("http://127.0.0.1:11434"),

  // Per-task model routing. Replaces the old single OLLAMA_MODEL var, which
  // was defined but never actually read by FallbackAIProvider — every task
  // was silently hardcoded to qwen2.5-coder:7b / llama3.2:1b regardless of
  // this file. Each task now has its own model + a shared fallback.
  OLLAMA_MODEL_INTERVIEWER: z.string().default("qwen3:8b"),
  OLLAMA_MODEL_SUMMARY: z.string().default("qwen3:8b"),
  OLLAMA_MODEL_EVALUATION: z.string().default("gemma3:12b"),
  OLLAMA_MODEL_REPAIR: z.string().default("qwen3:8b"),
  OLLAMA_FALLBACK_MODEL: z.string().default("llama3.2:1b"),

  OPENAI_API_KEY: z
    .string()
    .optional(),

  // Per-task model routing for OpenAI
  OPENAI_MODEL_INTERVIEWER: z.string().default("gpt-4o"),
  OPENAI_MODEL_SUMMARY: z.string().default("gpt-4o"),
  OPENAI_MODEL_EVALUATION: z.string().default("gpt-4o"),
  OPENAI_MODEL_REPAIR: z.string().default("gpt-4o"),
  OPENAI_FALLBACK_MODEL: z.string().default("gpt-4o-mini"),

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