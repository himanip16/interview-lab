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
import { EvaluationOrchestrator } from "../evaluation/EvaluationOrchestrator";



export class InterviewMessageService {
  private readonly repository =
    new InterviewRepository();

  private readonly engine =
    new InterviewEngine();

  private readonly profileService =
    new InterviewProfileService();

  private readonly summaryService =
    new IncrementalSummaryService();

  private readonly evaluationOrchestrator =
    new EvaluationOrchestrator();

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
        candidateName: interview.mode === "REVERSE" && interview.candidatePersona
          ? (interview.candidatePersona as any).name || "Candidate"
          : "Candidate",
        interviewDurationMinutes:
          interview.duration,
        interviewStartedAt,
        phaseStartedAt,
        mode: interview.mode,
        persona: interview.candidatePersona as any,
        whiteboardDescription: (interview as any).whiteboardDescription || undefined,
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

      // Evaluate in background without blocking response using orchestrator
      this.evaluationOrchestrator.requestEvaluation(interview.id, { background: true }).catch((error: Error) => {
        console.error(`Failed to request evaluation for interview ${interview.id}:`, error);
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

    // Update phaseStartedAt atomically with phase transition to prevent timestamp mismatch
    const newPhaseStartedAt = result.transition.shouldTransition
      ? new Date()
      : phaseStartedAt;

    await this.repository.persistTurn({
      interviewId: interview.id,
      userMessage: normalizedMessage,
      assistantMessage: result.reply,
      currentPhase: nextPhase,
      status,
      assistantMetadata: metadata,
      elapsedSeconds,
    });

    // Update phaseStartedAt when phase transitions (atomic with phase update)
    if (result.transition.shouldTransition) {
      await this.repository.updateProgress(interview.id, {
        currentPhase: nextPhase,
        phaseStartedAt: newPhaseStartedAt,
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

      // Optimistic concurrency: retry up to 3 times on version conflicts
      const MAX_RETRIES = 3;
      let retryCount = 0;
      let summaryUpdated = false;

      while (retryCount < MAX_RETRIES && !summaryUpdated) {
        // Get current interview state with version
        const currentInterview = await this.repository.getById(interview.id);
        if (!currentInterview) {
          throw new Error("Interview not found during summary update");
        }

        const currentVersion = currentInterview.summaryVersion || 0;
        const currentSummary = currentInterview.summary;

        // Generate new summary based on current state
        updatedSummary = await this.summaryService.updateSummary(
          currentSummary,
          recentMessages
        );

        // Try to update with version check
        const updateResult = await this.repository.updateSummaryWithVersion(
          interview.id,
          updatedSummary,
          currentVersion
        );

        if (updateResult.success) {
          summaryUpdated = true;
        } else {
          retryCount++;
          // If conflict, loop will retry with fresh data
          console.warn(`Summary version conflict, retry ${retryCount}/${MAX_RETRIES}`);
        }
      }

      if (!summaryUpdated) {
        console.error(`Failed to update summary after ${MAX_RETRIES} retries due to version conflicts`);
        // Continue with interview flow even if summary update fails
      }
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