import { MessageRole } from "@prisma/client";

import { InterviewRepository } from "../repositories/InterviewRepository";
import { InterviewEngine } from "../engine/InterviewEngine";
import { Message } from "@prisma/client";

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

    const result = await this.engine.processUserMessage(
      interview.currentPhase as any,
      interview.transcript.map((m: Message) => ({
        role: m.role,
        content: m.content,
      })),
      interview.summary,
      "URL Shortener",
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