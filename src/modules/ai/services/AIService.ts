import { ZodSchema } from "zod";

import { FallbackAIProvider } from "../providers/FallbackAIProvider";
import { ValidatedJSONParser } from "../utils/ValidatedJSONParser";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class AIService {
  private readonly provider = new FallbackAIProvider();

  async chat(messages: ChatMessage[]): Promise<string> {
    return this.provider.generateResponse(messages);
  }

  async chatJSON<T>(
    messages: ChatMessage[],
    schema: ZodSchema<T>
  ): Promise<T> {
    const response = await this.chat(messages);

    return ValidatedJSONParser.parse(
      response,
      schema,
      async () => {
        return this.chat([
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
          {
            role: "user",
            content: response,
          },
        ]);
      }
    );
  }
}