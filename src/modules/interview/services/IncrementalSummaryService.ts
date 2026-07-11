// src/modules/interview/services/IncrementalSummaryService.ts

import { AIService } from "@/src/modules/ai/AIService";

export interface TranscriptMessage {
  role: string;
  content: string;
}

export class IncrementalSummaryService {
  private readonly ai = new AIService();

  async updateSummary(
    previousSummary: string,
    recentMessages: TranscriptMessage[]
  ): Promise<string> {
    if (recentMessages.length === 0) {
      return previousSummary;
    }

    const transcript = recentMessages
      .map(
        (m) => `${m.role.toUpperCase()}: ${m.content}`
      )
      .join("\n\n");

    const prompt = `
You are maintaining a running interview summary.

Existing Summary:

${previousSummary}

New Conversation:

${transcript}

Update the summary by incorporating only the new information.

Requirements:

- Keep under 250 words.
- Preserve important architectural decisions.
- Preserve candidate strengths and weaknesses.
- Remove redundant details.
- Return plain text only.
`;

    return this.ai.chat([
      {
        role: "system",
        content: "You are an expert technical interviewer.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]);
  }
}