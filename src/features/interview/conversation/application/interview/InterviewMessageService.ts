import {
  InterviewStatus,
  MessageRole,
  Prisma,
} from "@prisma/client";

import type { ChatMessage } from "@/shared/ai";
import { ProcessInterviewMessageResult } from "@/types/interview";

import { InterviewEngine } from "../../engine/InterviewEngine";
import { InterviewRepository } from "../../repositories/InterviewRepository";
import { InterviewProfileService } from "../../profiles/InterviewProfileService";
import { EvaluationOrchestrator } from "../evaluation/EvaluationOrchestrator";
import { SessionContext } from "../../context/SessionContext";
import { InterviewAggregate } from "../../domain/InterviewAggregate";
import { eventBus } from "../../events/EventBus";
import { SummaryEventHandler } from "../background/SummaryEventHandler";
import { MasteryEventHandler } from "../background/MasteryEventHandler";
import { RecommendationEventHandler } from "../background/RecommendationEventHandler";



export class InterviewMessageService {
  private readonly repository =
    new InterviewRepository();

  private readonly engine =
    new InterviewEngine();

  private readonly profileService =
    new InterviewProfileService();

  private readonly evaluationOrchestrator =
    new EvaluationOrchestrator();

  private readonly summaryEventHandler =
    new SummaryEventHandler();

  private readonly masteryEventHandler =
    new MasteryEventHandler();

  private readonly recommendationEventHandler =
    new RecommendationEventHandler();

  constructor() {
    // Wire up event handlers to event bus
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    eventBus.subscribe("TURN_COMPLETED", async (event) => {
      await this.summaryEventHandler.handleTurnCompleted(event);
      await this.masteryEventHandler.handleTurnCompleted(event);
    });

    eventBus.subscribe("PHASE_TRANSITION", async (event) => {
      await this.summaryEventHandler.handlePhaseTransition(event);
    });

    eventBus.subscribe("INTERVIEW_COMPLETED", async (event) => {
      await this.summaryEventHandler.handleInterviewCompleted(event);
      await this.recommendationEventHandler.handleInterviewCompleted(event);
    });
  }

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

    // Use SessionContext for optimized data fetching (recent transcript only)
    const context = await SessionContext.forRequest({
      interviewId,
      repository: this.repository,
      profileService: this.profileService,
    });

    if (
      context.status ===
      InterviewStatus.COMPLETED
    ) {
      throw new Error(
        "Interview has already been completed."
      );
    }

    const currentPhaseDef = context.profile.phases.find(
      (p) => p.id === context.currentPhase
    );

    const history =
      this.buildConversationHistory(
        context.recentTranscript,
        normalizedMessage
      );

    const problemDescription =
      context.problem.description ??
      context.problem.title;

    const interviewStartedAt =
      context.interviewAggregate.startedAt;

    const elapsedSeconds = Math.max(
      Math.floor(
        (Date.now() - interviewStartedAt.getTime()) / 1000
      ),
      0
    );

    const phaseStartedAt =
      context.interviewAggregate.phaseStartedAt;

    const result =
      await this.engine.processUserMessage({
        profile: context.profile,
        currentPhase:
          context.currentPhase,
        history,
        runningSummary:
          context.summary,
        problem: problemDescription,
        candidateName: context.interviewAggregate.mode === "REVERSE" && context.interviewAggregate.candidatePersona
          ? (context.interviewAggregate.candidatePersona as any).name || "Candidate"
          : "Candidate",
        interviewDurationMinutes:
          context.interviewAggregate.duration,
        interviewStartedAt,
        phaseStartedAt,
        mode: context.interviewAggregate.mode,
        persona: context.interviewAggregate.candidatePersona as any,
        whiteboardDescription: context.interviewAggregate.whiteboardDescription || undefined,
      });

    // Apply turn to aggregate (encapsulates business logic)
    const turnResult = context.interviewAggregate.applyTurn({
      userMessage: normalizedMessage,
      aiResponse: result.reply,
      phaseAssessment: result.phaseAssessment ?? {
        goalCoverage: {},
        confidence: 0.5,
        unresolvedTopics: [],
      },
      transition: result.transition,
      profile: context.profile,
    });

    // Persist atomically
    const payload = context.interviewAggregate.toPersistence();
    await this.repository.persistTurn({
      interviewId: context.interviewId,
      userMessage: normalizedMessage,
      assistantMessage: result.reply,
      currentPhase: payload.currentPhase,
      status: payload.status,
      assistantMetadata: {
        phaseAssessment: result.phaseAssessment,
        transition: result.transition,
      } as unknown as Prisma.InputJsonValue,
      elapsedSeconds,
    });

    // Update phaseStartedAt when phase transitions
    if (result.transition.shouldTransition) {
      await this.repository.updateProgress(context.interviewId, {
        currentPhase: payload.currentPhase,
        phaseStartedAt: payload.phaseStartedAt,
      });
    }

    // Update completedAt if interview finished
    if (result.transition.completed) {
      await this.repository.updateProgress(context.interviewId, {
        completedAt: payload.completedAt || undefined,
      });

      // Evaluate in background without blocking response
      this.evaluationOrchestrator.requestEvaluation(context.interviewId, { background: true }).catch((error: Error) => {
        console.error(`Failed to request evaluation for interview ${context.interviewId}:`, error);
        this.repository.updateMetadata(context.interviewId, {
          evaluationError: error instanceof Error ? error.message : 'Unknown evaluation error',
          evaluationFailedAt: new Date().toISOString(),
        }).catch((updateError: Error) => {
          console.error(`Failed to store evaluation error for interview ${context.interviewId}:`, updateError);
        });
      });
    }

    // Publish domain events (async, non-blocking)
    const domainEvents = context.interviewAggregate.pullDomainEvents();
    for (const event of domainEvents) {
      await eventBus.publish(event);
    }

    return {
      reply: turnResult.reply,
      phase: turnResult.phase,
      previousPhase: turnResult.previousPhase,
      transitioned:
        turnResult.transitioned,
      confidence: turnResult.confidence,
      completed:
        turnResult.completed,
      summary: turnResult.summary,
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