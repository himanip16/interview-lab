export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export interface GenerateOptions {
  model: string;
  temperature?: number;
  format?: object;
}

export interface AIProvider {
  generateResponse(
    messages: ChatMessage[],
    options: GenerateOptions
  ): Promise<string>;
}
