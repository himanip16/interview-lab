import { env } from "@/shared/config/env";

import { OllamaProvider, ChatMessage } from "./OllamaProvider";
import { OpenAIProvider } from "./OpenAIProvider";

export type { ChatMessage };

export interface FallbackGenerateOptions {
  model: string;
  fallbackModel?: string;
  temperature?: number;
  format?: object;
}

export class FallbackAIProvider {
  private readonly provider: OllamaProvider | OpenAIProvider;

  constructor() {
    if (env.AI_PROVIDER === "openai") {
      if (!env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is required when AI_PROVIDER is 'openai'");
      }
      this.provider = new OpenAIProvider(env.OPENAI_API_KEY);
    } else {
      this.provider = new OllamaProvider(env.OLLAMA_BASE_URL);
    }
  }

  async generateResponse(
    messages: ChatMessage[],
    options: FallbackGenerateOptions
  ): Promise<string> {
    const candidates = [options.model, options.fallbackModel].filter(
      (model): model is string => Boolean(model)
    );

    const errors: { model: string; error: string }[] = [];

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
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.warn(`Provider ${model} failed.`, errorMessage);
        errors.push({ model, error: errorMessage });
      }
    }

    throw new Error(
      `All AI providers failed: ${JSON.stringify(errors)}`
    );
  }
}