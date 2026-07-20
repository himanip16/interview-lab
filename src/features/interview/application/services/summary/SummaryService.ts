import { AIService } from "@/modules/ai/services/AIService";

type TranscriptMessage = {
  role: string;
  content: string;
};

export class SummaryService {
  private readonly aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  async generateSummary(
    messages: TranscriptMessage[]
  ): Promise<string> {
    if (messages.length === 0) {
      return "Interview has not started yet.";
    }

    const transcript = messages
      .map(
        (message) =>
          `${message.role.toUpperCase()}: ${message.content}`
      )
      .join("\n\n");

    const prompt = `
You are an expert engineering interviewer.

Analyze the interview transcript and generate a concise running summary.

Return plain text only.

Include:

1. Current interview phase.
2. Candidate's approach so far.
3. Major components discussed.
4. Important decisions made.
5. Missing areas.
6. Current strengths.
7. Current weaknesses.

Keep the summary under 250 words.

Transcript:

${transcript}
`;

    try {
      const summary = await this.aiService.chat(
  [
    {
      role: "system",
      content: "You are an expert technical interviewer.",
    },
    {
      role: "user",
      content: prompt,
    },
  ],
  { task: "summary" } // no format — this task wants plain text, and now
                        // actually gets it instead of a forced JSON shape
);

      return summary.trim();
    } catch (error) {
      console.error(
        "Summary generation failed:",
        error
      );

      return "Summary generation unavailable.";
    }
  }
}