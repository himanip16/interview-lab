import {
  InterviewStatus,
  MessageRole,
  Prisma,
} from "@prisma/client";

import { ChatMessage } from "@/src/modules/ai/services/AIService";

import { InterviewEngine } from "../../engine/InterviewEngine";
import { InterviewRepository } from "../../repositories/InterviewRepository";
import { InterviewProfileService } from "../../profiles/InterviewProfileService";
import { WhiteboardSerializer } from "../whiteboard/WhiteboardSerializer";

export interface ProcessInterviewMessageResult {
  reply: string;
  phase: string;
  previousPhase: string;
  transitioned: boolean;
  confidence: number;
  completed: boolean;
}

export class InterviewMessageService {
  private readonly repository =
    new InterviewRepository();

  private readonly engine =
    new InterviewEngine();

  private readonly profileService =
    new InterviewProfileService();

  private readonly whiteboardSerializer =
    new WhiteboardSerializer();

  async processMessage(
    interviewId: string,
    userMessage: string
  ): Promise<ProcessInterviewMessageResult> {
    const normalizedMessage =
      userMessage.trim();

    if (!normalizedMessage) {
      throw new Error(
        "Interview message cannot be empty."
      );
    }

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

    const profile =
      await this.profileService.resolveByTemplateId(
        interview.template.id
      );

    const currentPhaseDef = profile.phases.find(
      (p) => p.id === interview.currentPhase
    );

    const whiteboardDescription = currentPhaseDef?.showWhiteboard
      ? this.whiteboardSerializer.describe(
          interview.whiteboardState as any
        )
      : undefined;

    const history =
      this.buildConversationHistory(
        interview.transcript,
        normalizedMessage
      );

    const problemDescription =
      interview.problem.description ??
      interview.problem.title;

    const interviewStartedAt =
      interview.startedAt ??
      interview.createdAt;

    const elapsedSeconds = Math.max(
      Math.floor(
        (Date.now() - interviewStartedAt.getTime()) / 1000
      ),
      0
    );

    /*
     * The schema currently has no phaseStartedAt field.
     *
     * Until that is persisted, createdAt/startedAt is only a fallback.
     * See note below — phase timing should eventually be stored in DB.
     */
    const phaseStartedAt =
      interviewStartedAt;

    const result =
      await this.engine.processUserMessage({
        profile,
        currentPhase:
          interview.currentPhase,
        history,
        runningSummary:
          interview.summary,
        problem: problemDescription,
        candidateName: "Candidate",
        interviewDurationMinutes:
          interview.duration,
        interviewStartedAt,
        phaseStartedAt,
        whiteboardDescription,
        mode: interview.mode,
        persona: interview.candidatePersona as any,
      });

    const previousPhase =
      interview.currentPhase;

    const nextPhase =
      result.transition.shouldTransition
        ? result.transition.nextPhase
        : previousPhase;

    const status =
      result.transition.completed
        ? InterviewStatus.COMPLETED
        : InterviewStatus.IN_PROGRESS;

    const confidence =
      result.phaseAssessment?.confidence ??
      0.5;

    const metadata: Prisma.InputJsonValue = {
      phase: nextPhase,
      previousPhase,
      transitioned:
        result.transition.shouldTransition,
      completed:
        result.transition.completed,
      confidence,
      transitionReason:
        result.transition.reason,
      phaseAssessment:
        result.phaseAssessment ?? null,
    };

    await this.repository.persistTurn({
      interviewId: interview.id,
      userMessage: normalizedMessage,
      assistantMessage: result.reply,
      currentPhase: nextPhase,
      status,
      assistantMetadata: metadata,
      elapsedSeconds,
    });

    return {
      reply: result.reply,
      phase: nextPhase,
      previousPhase,
      transitioned:
        result.transition.shouldTransition,
      confidence,
      completed:
        result.transition.completed,
    };
  }

  private buildConversationHistory(
    transcript: Array<{
      role: MessageRole;
      content: string;
    }>,
    userMessage: string
  ): ChatMessage[] {
    const history: ChatMessage[] =
      transcript
        .filter(
          (message) =>
            message.role === MessageRole.user ||
            message.role ===
              MessageRole.assistant
        )
        .map((message) => ({
          role:
            message.role === MessageRole.user
              ? "user"
              : "assistant",
          content: message.content,
        }));

    history.push({
      role: "user",
      content: userMessage,
    });

    return history;
  }
}