// modules/ai/AIService.ts
import { OllamaProvider } from "./providers/ollama";

export class AIService {
  private provider = new OllamaProvider();

  async chat(messages: { role: string; content: string }[]) {
    // Ensure this calls the method we defined in OllamaProvider
    return await this.provider.generateResponse(messages);
  }
}