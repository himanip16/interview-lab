import { ZodSchema } from "zod";

import { env } from "@/shared/config/env";

import { FallbackAIProvider } from "../providers/FallbackAIProvider";
import { ChatMessage } from "../providers/OllamaProvider";
import { ValidatedJSONParser } from "../utils/ValidatedJSONParser";

export type { ChatMessage };

export type AITask = "interviewer" | "summary" | "evaluation" | "repair";

interface TaskConfig {
  model: string;
  fallbackModel: string;
  temperature: number;
}

// Model + temperature routing per workload. This is the ONLY place task
// names map to specific models — providers below know nothing about tasks.
const getTaskConfig = (): Record<AITask, TaskConfig> => {
  const isOpenAI = env.AI_PROVIDER === "openai";

  const getModel = (openaiKey: string | undefined, ollamaKey: string | undefined) => {
    const model = isOpenAI ? openaiKey : ollamaKey;
    if (!model) {
      throw new Error(`Missing AI model configuration for provider ${env.AI_PROVIDER}`);
    }
    return model;
  };

  return {
    interviewer: {
      model: getModel(env.OPENAI_MODEL_INTERVIEWER, env.OLLAMA_MODEL_INTERVIEWER),
      fallbackModel: getModel(env.OPENAI_FALLBACK_MODEL, env.OLLAMA_FALLBACK_MODEL),
      temperature: 0.3,
    },
    summary: {
      model: getModel(env.OPENAI_MODEL_SUMMARY, env.OLLAMA_MODEL_SUMMARY),
      fallbackModel: getModel(env.OPENAI_FALLBACK_MODEL, env.OLLAMA_FALLBACK_MODEL),
      temperature: 0.2,
    },
    evaluation: {
      model: getModel(env.OPENAI_MODEL_EVALUATION, env.OLLAMA_MODEL_EVALUATION),
      fallbackModel: getModel(env.OPENAI_FALLBACK_MODEL, env.OLLAMA_FALLBACK_MODEL),
      temperature: 0,
    },
    repair: {
      model: getModel(env.OPENAI_MODEL_REPAIR, env.OLLAMA_MODEL_REPAIR),
      fallbackModel: getModel(env.OPENAI_FALLBACK_MODEL, env.OLLAMA_FALLBACK_MODEL),
      temperature: 0,
    },
  };
};

export interface AIRequestOptions {
  task: AITask;
  temperature?: number; // overrides the task's default
  format?: object; // raw JSON Schema for Ollama's structured output — the
                    // caller's schema, never a provider-level constant
}

export class AIService {
  private readonly provider = new FallbackAIProvider();

  async chat(
    messages: ChatMessage[],
    options: AIRequestOptions
  ): Promise<string> {
    const config = getTaskConfig()[options.task];

    return this.provider.generateResponse(messages, {
      model: config.model,
      fallbackModel: config.fallbackModel,
      temperature: options.temperature ?? config.temperature,
      format: options.format,
    });
  }

  async chatJSON<T>(
    messages: ChatMessage[],
    schema: ZodSchema<T>,
    options: AIRequestOptions
  ): Promise<T> {
    const response = await this.chat(messages, options);

    return ValidatedJSONParser.parse(response, schema, async () => {
      return this.chat(
        [
          {
            role: "system",
            content: `
Convert the following text into valid JSON.

Return ONLY JSON.

Do not use markdown.

Do not explain anything.

The JSON must satisfy the requested schema.
`.trim(),
          },
          { role: "user", content: response },
        ],
        {
          task: "repair",
          // Repair still needs the ORIGINAL schema constraint, not a
          // schema-less retry — otherwise the repair model has just as much
          // room to drift as the first attempt did.
          format: options.format,
        }
      );
    });
  }
}