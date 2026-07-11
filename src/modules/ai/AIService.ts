import { OllamaProvider } from "./providers/OllamaProvider";
  import { ZodSchema } from "zod";
import { ValidatedJSONParser } from "./utils/ValidatedJSONParser";
import { FallbackAIProvider } from "./providers/FallbackAIProvider";



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
  const retry = () => this.chat(messages);

  const response = await this.chat(messages);

  return ValidatedJSONParser.parse(
    response,
    schema,
    retry
  );
}
}