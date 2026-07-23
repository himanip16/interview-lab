// src/shared/ai/providers/FallbackAIProvider.ts

import { env } from "@/shared/config/env";
import type { ChatMessage, AIProvider } from "../types";
import { OllamaProvider } from "./OllamaProvider";
import { OpenAIProvider } from "./OpenAIProvider";
import type { UserAIConfig } from "../config/modelRouting";

export type { ChatMessage };

export interface FallbackGenerateOptions {
  model: string;
  fallbackModel?: string;
  temperature?: number;
  format?: object;
}

export class FallbackAIProvider {
  private readonly provider: AIProvider;

  constructor(userConfig?: UserAIConfig) {
    const provider = userConfig?.provider || env.AI_PROVIDER;
    
    if (provider === "openai") {
      const apiKey = userConfig?.apiKey || env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error("OPENAI_API_KEY is required when AI_PROVIDER is 'openai'");
      }
      this.provider = new OpenAIProvider(apiKey);
    } else {
      const baseUrl = userConfig?.baseUrl || env.OLLAMA_BASE_URL;
      this.provider = new OllamaProvider(baseUrl);
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