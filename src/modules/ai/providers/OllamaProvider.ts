type ChatMessage = {
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

const INTERVIEW_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    reply: {
      type: "string",
    },
    transition: {
      type: "boolean",
    },
    nextPhase: {
      type: "string",
    },
    confidence: {
      type: "number",
      minimum: 0,
      maximum: 1,
    },
    phaseAssessment: {
      type: "object",
      properties: {
        goalCoverage: {
          type: "object",
          additionalProperties: {
            type: "number",
            minimum: 0,
            maximum: 1,
          },
        },
        confidence: {
          type: "number",
          minimum: 0,
          maximum: 1,
        },
        unresolvedTopics: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: ["goalCoverage", "confidence", "unresolvedTopics"],
    },
  },
  required: [
    "reply",
    "phaseAssessment",
  ],
  additionalProperties: false,
};

export class OllamaProvider {
  constructor(
    private readonly model: string
  ) {}

  getModel() {
    return this.model;
  }

  private readonly baseUrl =
    "http://127.0.0.1:11434/api/chat";

  async generateResponse(
    messages: ChatMessage[]
  ): Promise<string> {
    console.log(
      `🤖 Requesting ${this.model}...`
    );

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: false,
        format: INTERVIEW_RESPONSE_SCHEMA,
        options: {
          temperature: 0,
        },
      }),
    });

    const data =
      (await response.json()) as OllamaResponse;

    if (!response.ok) {
      throw new Error(
        data.error ??
          `Ollama request failed: ${response.status}`
      );
    }

    const content = data.message?.content;

    if (!content?.trim()) {
      throw new Error(
        "Ollama returned an empty response"
      );
    }

    console.log(
      `🤖 ${this.model} response:`,
      content
    );

    return content;
  }
}