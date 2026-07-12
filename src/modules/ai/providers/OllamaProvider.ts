export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OllamaResponse = {
  message?: {
    role: string;
    content: string;
  };
  error?: string;
};

export interface OllamaGenerateOptions {
  model: string;
  temperature?: number;
  format?: object; // raw JSON Schema — the caller's concern, not the provider's
}

export class OllamaProvider {
  constructor(private readonly baseUrl: string) {}

  async generateResponse(
    messages: ChatMessage[],
    options: OllamaGenerateOptions
  ): Promise<string> {
    console.log(`🤖 Requesting ${options.model}...`);

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
  }
}