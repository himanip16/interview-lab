import {
  InterviewStatus,
  MessageRole,
  Prisma,
} from "@prisma/client";

import { InterviewRepository } from "../../repositories/InterviewRepository";
import { InterviewEngine } from "../../engine/InterviewEngine";
import { InterviewProfileService } from "../../profiles/InterviewProfileService";
import { ChatMessage } from "@/src/modules/ai/services/AIService";

export class InterviewMessageService {
  private readonly repository =
    new InterviewRepository();

  private readonly engine =
    new InterviewEngine();

  private readonly profileService =
    new InterviewProfileService();

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

    const profile =
      await this.profileService.resolveByTemplateId(
        interview.templateId
      );

    const history: ChatMessage[] = conversation.map(
      (msg) => ({
        role: msg.role,
        content: msg.content,
      })
    );

    const problemDescription =
      interview.problem.description ??
      interview.problem.title;

    const interviewStartedAt =
      interview.startedAt ??
      interview.createdAt;

    // For now, use interview start time as phase start time
    // TODO: Track actual phase start time in the database
    const phaseStartedAt = interviewStartedAt;

    const result =
      await this.engine.processUserMessage({
        profile,
        currentPhase: interview.currentPhase,
        history,
        runningSummary: interview.summary,
        problem: problemDescription,
        candidateName: "Candidate",
        interviewDurationMinutes:
          interview.duration,
        interviewStartedAt,
        phaseStartedAt,
      });

    const nextPhase =
      result.transition.shouldTransition
        ? result.transition.nextPhase
        : interview.currentPhase;

    const metadata: Prisma.InputJsonValue = {
      phase: nextPhase,
      previousPhase:
        interview.currentPhase,
      transitioned:
        result.transition.shouldTransition,
      confidence:
        result.phaseAssessment?.confidence ?? 0.5,
      transitionReason:
        result.transition.reason,
    };

    await this.repository.persistTurn({
      interviewId: interview.id,
      userMessage,
      assistantMessage: result.reply,
      currentPhase: nextPhase,
      status:
        result.transition.reason === "stay" &&
        !result.transition.shouldTransition
          ? InterviewStatus.IN_PROGRESS
          : InterviewStatus.COMPLETED,
      assistantMetadata: metadata,
    });

    return {
      reply: result.reply,
      phase: nextPhase,
      previousPhase:
        interview.currentPhase,
      transitioned:
        result.transition.shouldTransition,
      confidence:
        result.phaseAssessment?.confidence ?? 0.5,
      completed:
        result.transition.reason === "stay" &&
        !result.transition.shouldTransition
          ? false
          : true,
    };
  }
}