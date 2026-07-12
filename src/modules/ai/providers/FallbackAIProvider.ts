import { OllamaProvider } from "./OllamaProvider";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class FallbackAIProvider {
  private readonly providers = [
    new OllamaProvider("qwen2.5:7b"),
    new OllamaProvider("llama3.2:1b"),
  ];

  async generateResponse(
    messages: ChatMessage[]
  ): Promise<string> {
    let lastError: unknown;

    for (const provider of this.providers) {
      try {
        console.log(
          `🤖 Requesting ${provider.getModel()}...`
        );

        const response =
          await provider.generateResponse(messages);

        if (!response?.trim()) {
          throw new Error("AI returned empty response");
        }

        return response;
      } catch (error) {
        console.warn(
          `Provider ${provider.getModel()} failed.`,
          error
        );

        lastError = error;
      }
    }

    throw new Error("All AI providers failed.", {
      cause: lastError,
    });
  }
}