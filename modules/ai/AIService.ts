import type { AIProvider } from "./AIProvider";

export class AIService {
  private readonly provider: AIProvider;

  constructor(provider: AIProvider) {
    this.provider = provider;
  }

  async generate(prompt: string): Promise<string> {
    return this.provider.generate(prompt);
  }
}