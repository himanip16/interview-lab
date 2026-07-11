// modules/ai/providers/ollama.ts
export class OllamaProvider {
  constructor(
    private readonly model: string
  ) {}

  getModel() {
    return this.model;
  }

  private baseUrl = "http://127.0.0.1:11434/api/chat";
  
  async generateResponse(messages: { role: string; content: string }[]) {
    try {
      console.log("🤖 Requesting Qwen...");
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          stream: false,
        }),
      });

//       const response = await fetch(`${this.baseUrl}/api/chat`, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     model: this.model,
//     messages,
//     stream: false,
//   }),
// });

const data = await response.json();

return data.message.content;

      
    } catch (e) {
      console.error("Ollama connection failed. Is the app open?");
      return "I'm having trouble connecting to my brain (Ollama).";
    }
  }
}