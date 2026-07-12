

import { InterviewRepository } from "../../repositories/InterviewRepository";
import { InterviewEngine } from "../../engine/InterviewEngine";
import { Message, MessageRole } from "@prisma/client";
import { ChatMessage } from "@/src/modules/ai/services/AIService";

export class InterviewMessageService {
  private repository = new InterviewRepository();
  private engine = new InterviewEngine();

  async processMessage(
    interviewId: string,
    message: string
  ) {
    const interview = await this.repository.getById(interviewId);

    if (!interview) {
      throw new Error("Interview not found");
    }

    await this.repository.addMessage(
      interviewId,
      MessageRole.user,
      message
    );

    const history: ChatMessage[] = interview.transcript.map(
  (m: Message): ChatMessage => ({
    role:
      m.role === MessageRole.user
        ? "user"
        : m.role === MessageRole.assistant
        ? "assistant"
        : "system",
    content: m.content,
  })
);

    const result = await this.engine.processUserMessage(
      interview.currentPhase as any,
      history,
      interview.summary,
      interview.topic,
      "Candidate"
    );

    const aiMessage = await this.repository.addMessage(
      interviewId,
      MessageRole.assistant,
      result.reply
    );

    await this.repository.updateSummary(
      interviewId,
      interview.summary
    );

    return {
      aiMessage,
      newSummary: interview.summary,
    };
  }
}