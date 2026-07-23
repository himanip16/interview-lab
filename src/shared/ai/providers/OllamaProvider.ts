// src/shared/ai/providers/OllamaProvider.ts

import { env } from "@/shared/config/env";
import type { ChatMessage, GenerateOptions, AIProvider } from "../types";

type OllamaResponse = {
  message?: {
    role: string;
    content: string;
  };
  error?: string;
};

export class OllamaProvider implements AIProvider {
  constructor(private readonly baseUrl: string) {}

  async generateResponse(
    messages: ChatMessage[],
    options: GenerateOptions
  ): Promise<string> {
    console.log(`🤖 Requesting ${options.model}...`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), env.REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: options.model,
          messages,
          stream: false,
          ...(options.format ? { format: options.format } : {}),
          options: {
            temperature: options.temperature ?? 0,
          },
        }),
      });

      clearTimeout(timeoutId);

      const data = (await response.json()) as OllamaResponse;

      if (!response.ok) {
        throw new Error(
          data.error ?? `Ollama request failed: ${response.status}`
        );
      }

      const content = data.message?.content;

      if (!content?.trim()) {
        throw new Error(
          `Ollama (${options.model}) returned an empty response`
        );
      }

      console.log(`🤖 ${options.model} response:`, content);

      return content;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Ollama request timed out after ${env.REQUEST_TIMEOUT_MS}ms`);
      }

      throw error;
    }
  }
}