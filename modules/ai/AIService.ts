import { OllamaProvider } from "./providers/ollama";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class AIService {
  private readonly provider: OllamaProvider;

  constructor(provider?: OllamaProvider) {
    this.provider = provider ?? new OllamaProvider();
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    return this.provider.generateResponse(messages);
  }

  async chatJSON<T>(messages: ChatMessage[]): Promise<T> {
    const response = await this.chat(messages);

    try {
      return JSON.parse(response) as T;
    } catch (error) {
      throw new Error(
        `AI returned invalid JSON.\n\nResponse:\n${response}`
      );
    }
  }
}