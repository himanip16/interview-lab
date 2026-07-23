// src/shared/ai/AIService.ts

import { ZodSchema } from "zod";

import { FallbackAIProvider } from "./providers/FallbackAIProvider";
import { StructuredOutputParser } from "./parsers/StructuredOutputParser";
import type { ChatMessage } from "./types";
import { getTaskConfig, type AITask, type UserAIConfig } from "./config/modelRouting";

export type { ChatMessage, AITask };

export interface AIRequestOptions {
  task: AITask;
  temperature?: number; // overrides the task's default
  format?: object; // raw JSON Schema for Ollama's structured output — the
                    // caller's schema, never a provider-level constant
  userConfig?: UserAIConfig; // user-specific AI configuration
}

export class AIService {
  private provider: FallbackAIProvider;

  constructor(userConfig?: UserAIConfig) {
    this.provider = new FallbackAIProvider(userConfig);
  }

  async chat(
    messages: ChatMessage[],
    options: AIRequestOptions
  ): Promise<string> {
    const config = getTaskConfig(options.userConfig)[options.task];

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

    return StructuredOutputParser.parse(response, schema, async () => {
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
          userConfig: options.userConfig,
        }
      );
    });
  }
}