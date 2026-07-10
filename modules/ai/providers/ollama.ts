// modules/ai/providers/ollama.ts
export class OllamaProvider {
  // Use 127.0.0.1 instead of localhost
  private baseUrl = "http://127.0.0.1:11434/api/chat"; 
  private model = "llama3"; // Make sure this matches what you 'ollama run'

  async generateResponse(messages: { role: string; content: string }[]) {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          stream: false,
        }),
      });

      if (!response.ok) throw new Error(`Ollama HTTP Error: ${response.status}`);

      const data = await response.json();
      return data.message.content;
    } catch (error) {
      console.error("Ollama Error:", error);
      return "I'm having trouble connecting to my brain (Ollama). Is it running?";
    }
  }
}