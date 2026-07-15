import {
  InterviewStatus,
  MessageRole,
  Prisma,
} from "@prisma/client";

import { ChatMessage } from "@/modules/ai/services/AIService";

import { InterviewEngine } from "../../engine/InterviewEngine";
import { InterviewRepository } from "../../repositories/InterviewRepository";
import { InterviewProfileService } from "../../profiles/InterviewProfileService";
import { IncrementalSummaryService } from "../summary/IncrementalSummaryService";
import { createEvaluationService } from "@/modules/container";



export class InterviewMessageService {
  private readonly repository =
    new InterviewRepository();

  private readonly engine =
    new InterviewEngine();

  private readonly profileService =
    new InterviewProfileService();

  private readonly summaryService =
    new IncrementalSummaryService();

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

    const phaseStartedAt =
      interview.phaseStartedAt ??
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

    // Trigger evaluation if interview naturally completed
    if (result.transition.completed) {
      // Set completedAt timestamp (status is set by persistTurn below)
      await this.repository.updateProgress(interview.id, {
        completedAt: new Date(),
      });

      // Evaluate in background without blocking response
      const evaluationService = createEvaluationService();
      evaluationService.evaluateInterview(interview.id).catch((error) => {
        console.error(`Failed to evaluate interview ${interview.id}:`, error);
        // Store error in interview metadata so the report page can display it
        this.repository.updateMetadata(interview.id, {
          evaluationError: error instanceof Error ? error.message : 'Unknown evaluation error',
          evaluationFailedAt: new Date().toISOString(),
        }).catch((updateError: Error) => {
          console.error(`Failed to store evaluation error for interview ${interview.id}:`, updateError);
        });
      });
    }

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

    // Update phaseStartedAt when phase transitions
    if (result.transition.shouldTransition) {
      await this.repository.updateProgress(interview.id, {
        currentPhase: nextPhase,
        phaseStartedAt: new Date(),
      });
    }

    // Update summary incrementally with new messages (debounced to every 3 turns)
    // Also update on phase transitions or interview completion to capture important points
    const shouldUpdateSummary = 
      result.transition.shouldTransition || 
      result.transition.completed ||
      (interview.transcript.length + 1) % 3 === 0; // Update every 3 turns
    
    let updatedSummary = interview.summary;
    if (shouldUpdateSummary) {
      const recentMessages = [
        { role: "user", content: normalizedMessage },
        { role: "assistant", content: result.reply },
      ];
      updatedSummary = await this.summaryService.updateSummary(
        interview.summary,
        recentMessages
      );
      await this.repository.updateSummary(interview.id, updatedSummary);
    }

    return {
      reply: result.reply,
      phase: nextPhase,
      previousPhase,
      transitioned:
        result.transition.shouldTransition,
      confidence,
      completed:
        result.transition.completed,
      summary: updatedSummary,
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