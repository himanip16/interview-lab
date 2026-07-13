import { env } from "@/src/shared/config/env";
import OpenAI from "openai";

export interface GenerateOptions {
  model: string;
  temperature?: number;
  format?: object;
}

export class OpenAIProvider {
  private readonly client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({
      apiKey,
      timeout: env.REQUEST_TIMEOUT_MS,
    });
  }

  async generateResponse(
    messages: Array<{ role: string; content: string }>,
    options: GenerateOptions
  ): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: options.model,
      messages: messages as any,
      temperature: options.temperature ?? 0.7,
      response_format: options.format ? { type: "json_object" } : undefined,
    });

    return response.choices[0]?.message?.content ?? "";
  }
}
