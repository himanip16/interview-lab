import {
  InterviewStatus,
  MessageRole,
  Prisma,
} from "@prisma/client";

import { InterviewRepository } from "../../repositories/InterviewRepository";

import { InterviewEngine } from "@src/modules/interview/engine/InterviewEngine";

export class InterviewMessageService {
  private readonly repository =
    new InterviewRepository();

  private readonly engine =
    new InterviewEngine();

  async processMessage(
    interviewId: string,
    userMessage: string
  ) {
    const interview =
      await this.repository.getById(
        interviewId
      );

    if (!interview) {
      throw new Error(
        "Interview not found."
      );
    }

    if (
      interview.status ===
      InterviewStatus.COMPLETED
    ) {
      throw new Error(
        "Interview has already been completed."
      );
    }

    /*
     * Build history INCLUDING the latest
     * user message.
     *
     * Do not persist yet.
     *
     * If AI generation fails we do not want
     * a half-written interview turn.
     */
    const conversation = [
      ...interview.transcript.map(
        (message) => ({
          role:
            message.role ===
            MessageRole.user
              ? ("user" as const)
              : ("assistant" as const),

          content: message.content,
        })
      ),

      {
        role: "user" as const,
        content: userMessage,
      },
    ];

    const result =
      await this.engine.process({
        interview: {
          id: interview.id,
          type: interview.type,
          difficulty:
            interview.difficulty,
          duration: interview.duration,
          company: interview.company,
          currentPhase:
            interview.currentPhase,
          createdAt: interview.createdAt,
        },

        problem: {
          id: interview.problem.id,
          title: interview.problem.title,
          description:
            interview.problem.description,
          category:
            interview.problem.category,
        },

        conversation,
      });

    const metadata: Prisma.InputJsonValue = {
      phase: result.phase,
      previousPhase:
        interview.currentPhase,
      transitioned:
        result.phase !==
        interview.currentPhase,
      confidence: result.confidence,
    };

    await this.repository.persistTurn({
      interviewId: interview.id,
      userMessage,
      assistantMessage: result.reply,
      currentPhase: result.phase,
      status:
        result.completed === true
          ? InterviewStatus.COMPLETED
          : InterviewStatus.IN_PROGRESS,
      assistantMetadata: metadata,
    });

    return {
      reply: result.reply,
      phase: result.phase,
      previousPhase:
        interview.currentPhase,
      transitioned:
        result.phase !==
        interview.currentPhase,
      confidence: result.confidence,
      completed: result.completed,
    };
  }
}