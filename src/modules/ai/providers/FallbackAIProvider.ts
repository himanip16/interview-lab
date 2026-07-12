import { env } from "@/src/shared/config/env";

import { OllamaProvider, ChatMessage } from "./OllamaProvider";

export type { ChatMessage };

export interface FallbackGenerateOptions {
  model: string;
  fallbackModel?: string;
  temperature?: number;
  format?: object;
}

export class FallbackAIProvider {
  private readonly provider = new OllamaProvider(env.OLLAMA_BASE_URL);

  async generateResponse(
    messages: ChatMessage[],
    options: FallbackGenerateOptions
  ): Promise<string> {
    const candidates = [options.model, options.fallbackModel].filter(
      (model): model is string => Boolean(model)
    );

    let lastError: unknown;

    for (const model of candidates) {
      try {
        const response = await this.provider.generateResponse(messages, {
          model,
          temperature: options.temperature,
          format: options.format,
        });

        if (!response?.trim()) {
          throw new Error("AI returned empty response");
        }

        return response;
      } catch (error) {
        console.warn(`Provider ${model} failed.`, error);

        lastError = error;
      }
    }

    throw new Error("All AI providers failed.", {
      cause: lastError,
    });
  }
}