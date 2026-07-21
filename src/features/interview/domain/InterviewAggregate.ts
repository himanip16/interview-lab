import {
  InterviewStatus,
  MessageRole,
  Prisma,
} from "@prisma/client";

import { InterviewProfile } from "@/features/interview/data/profiles/InterviewProfile";
import { PhaseId } from "@/features/interview/data/constants";
import { PhaseAssessment, TransitionResult } from "../engine/InterviewStateMachine";

/**
 * Interview Domain Aggregate
 * 
 * Centralizes business logic for interview state management.
 * Encapsulates turn validation, state transitions, and persistence preparation.
 * 
 * This aggregate follows Domain-Driven Design principles where the Interview
 * is a consistency boundary with all business rules contained within.
 */
export class InterviewAggregate {
  private _id: string;
  private _userId: string;
  private _templateId: string;
  private _problemId: string;
  private _status: InterviewStatus;
  private _currentPhase: PhaseId;
  private _phaseStartedAt: Date;
  private _startedAt: Date;
  private _completedAt: Date | null;
  private _duration: number;
  private _mode: "CANDIDATE" | "REVERSE";
  private _candidatePersona: any;
  private _summary: string;
  private _summaryVersion: number;
  private _transcript: Array<{
    role: MessageRole;
    content: string;
    metadata?: Prisma.JsonValue;
    elapsedSeconds: number;
    phase: string;
  }>;
  private _metadata: Prisma.JsonValue;
  private _whiteboardDescription: string | null;
  private _turnCount: number;

  // Domain events to be dispatched after persistence
  private _domainEvents: DomainEvent[] = [];

  constructor(data: InterviewAggregateData) {
    this._id = data.id;
    this._userId = data.userId;
    this._templateId = data.templateId;
    this._problemId = data.problemId;
    this._status = data.status;
    this._currentPhase = data.currentPhase;
    this._phaseStartedAt = data.phaseStartedAt;
    this._startedAt = data.startedAt;
    this._completedAt = data.completedAt || null;
    this._duration = data.duration;
    this._mode = data.mode;
    this._candidatePersona = data.candidatePersona;
    this._summary = data.summary;
    this._summaryVersion = data.summaryVersion;
    this._transcript = data.transcript;
    this._metadata = data.metadata;
    this._whiteboardDescription = data.whiteboardDescription;
    this._turnCount = data.transcript.filter(msg => msg.role === MessageRole.user).length;
  }

  /**
   * Apply a turn to the interview aggregate
   * Validates the turn, updates internal state, and prepares domain events
   */
  applyTurn(params: {
    userMessage: string;
    aiResponse: string;
    phaseAssessment: PhaseAssessment;
    transition: TransitionResult;
    profile: InterviewProfile;
  }): ApplyTurnResult {
    // Validate interview is in progress
    if (this._status === InterviewStatus.COMPLETED) {
      throw new Error("Cannot apply turn to completed interview");
    }

    const {
      userMessage,
      aiResponse,
      phaseAssessment,
      transition,
      profile,
    } = params;

    const now = new Date();
    const elapsedSeconds = Math.max(
      Math.floor((now.getTime() - this._startedAt.getTime()) / 1000),
      0
    );

    // Update transcript
    this._transcript.push({
      role: MessageRole.user,
      content: userMessage,
      elapsedSeconds,
      phase: this._currentPhase,
    });

    this._transcript.push({
      role: MessageRole.assistant,
      content: aiResponse,
      metadata: {
        phaseAssessment,
        transition,
      } as unknown as Prisma.JsonValue,
      elapsedSeconds,
      phase: this._currentPhase,
    });

    this._turnCount++;

    // Handle state transition
    const previousPhase = this._currentPhase;
    let nextPhase = this._currentPhase;

    if (transition.shouldTransition) {
      nextPhase = transition.nextPhase;
      this._currentPhase = nextPhase;
      this._phaseStartedAt = now;

      // Emit phase transition event
      this._domainEvents.push({
        type: "PHASE_TRANSITION",
        aggregateId: this._id,
        data: {
          previousPhase,
          nextPhase,
          reason: transition.reason,
          timestamp: now.toISOString(),
        },
      });
    }

    // Handle interview completion
    if (transition.completed) {
      this._status = InterviewStatus.COMPLETED;
      this._completedAt = now;

      this._domainEvents.push({
        type: "INTERVIEW_COMPLETED",
        aggregateId: this._id,
        data: {
          completedAt: now.toISOString(),
          finalPhase: this._currentPhase,
          totalTurns: this._turnCount,
        },
      });
    }

    // Emit turn completed event for background processing
    this._domainEvents.push({
      type: "TURN_COMPLETED",
      aggregateId: this._id,
      data: {
        turnNumber: this._turnCount,
        currentPhase: this._currentPhase,
        previousPhase,
        transitioned: transition.shouldTransition,
        completed: transition.completed,
        phaseAssessment,
        timestamp: now.toISOString(),
      },
    });

    return {
      reply: aiResponse,
      phase: nextPhase,
      previousPhase,
      transitioned: transition.shouldTransition,
      confidence: phaseAssessment.confidence,
      completed: transition.completed,
      summary: this._summary,
    };
  }

  /**
   * Update the interview summary with version control
   */
  updateSummary(newSummary: string): void {
    this._summary = newSummary;
    this._summaryVersion++;

    this._domainEvents.push({
      type: "SUMMARY_UPDATED",
      aggregateId: this._id,
      data: {
        newSummary,
        version: this._summaryVersion,
        timestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Transition interview from SETUP to IN_PROGRESS
   * Sets both startedAt and phaseStartedAt (idempotent transition)
   */
  start(now: Date): void {
    if (this._status !== InterviewStatus.SETUP) {
      return; // Already in progress or completed, no-op
    }

    this._status = InterviewStatus.IN_PROGRESS;
    this._startedAt = now;
    this._phaseStartedAt = now;
  }

  /**
   * Enforces domain invariant: startedAt must be non-null for IN_PROGRESS and COMPLETED states
   * @throws Error if startedAt is null in an invalid state
   */
  requireStartedAt(): Date {
    if (
      this._status !== InterviewStatus.SETUP &&
      !this._startedAt
    ) {
      throw new Error(
        `Interview ${this._id} has no startedAt in status ${this._status}. ` +
        `Domain invariant violation: IN_PROGRESS and COMPLETED interviews must have startedAt.`
      );
    }
    return this._startedAt!;
  }

  /**
   * Enforces domain invariant: phaseStartedAt must be non-null for IN_PROGRESS and COMPLETED states
   * @throws Error if phaseStartedAt is null in an invalid state
   */
  requirePhaseStartedAt(): Date {
    if (
      this._status !== InterviewStatus.SETUP &&
      !this._phaseStartedAt
    ) {
      throw new Error(
        `Interview ${this._id} has no phaseStartedAt in status ${this._status}. ` +
        `Domain invariant violation: IN_PROGRESS and COMPLETED interviews must have phaseStartedAt.`
      );
    }
    return this._phaseStartedAt!;
  }

  /**
   * Check if the interview should transition based on deterministic rules
   * This encapsulates the business rules for phase transitions
   */
  shouldTransition(params: {
    phaseAssessment: PhaseAssessment;
    profile: InterviewProfile;
    elapsedPhaseSeconds: number;
    elapsedInterviewSeconds: number;
  }): boolean {
    const { phaseAssessment, profile, elapsedPhaseSeconds, elapsedInterviewSeconds } = params;

    const currentPhaseDef = profile.phases.find(
      (p) => p.id === this._currentPhase
    );

    if (!currentPhaseDef) {
      return false;
    }

    // Calculate goal coverage
    const goalCoverage = this.calculateGoalCoverage(currentPhaseDef, phaseAssessment);
    
    // Check mandatory goals met
    const goalsMet = 
      goalCoverage >= currentPhaseDef.transitionThreshold &&
      phaseAssessment.confidence >= currentPhaseDef.transitionThreshold &&
      phaseAssessment.unresolvedTopics.length === 0;

    // Calculate time budgets
    const totalInterviewSeconds = this._duration * 60;
    const targetPhaseSeconds = totalInterviewSeconds * currentPhaseDef.targetDurationRatio;

    // Transition if goals are met
    if (goalsMet) {
      return true;
    }

    // Transition if phase time budget exceeded
    if (elapsedPhaseSeconds >= targetPhaseSeconds) {
      return true;
    }

    // Check time pressure (simplified - full logic in StateMachine)
    const elapsedRatio = elapsedInterviewSeconds / totalInterviewSeconds;
    if (elapsedRatio > 0.7) {
      return true;
    }

    return false;
  }

  private calculateGoalCoverage(
    phase: { goals: Array<{ id: string }> },
    assessment: PhaseAssessment
  ): number {
    if (phase.goals.length === 0) {
      return 1;
    }

    const total = phase.goals.reduce(
      (sum, goal) => sum + (assessment.goalCoverage[goal.id] ?? 0),
      0
    );

    return total / Math.max(phase.goals.length, 1);
  }

  /**
   * Prepare atomic payload for repository persistence
   */
  toPersistence(): PersistencePayload {
    return {
      interviewId: this._id,
      currentPhase: this._currentPhase,
      status: this._status,
      phaseStartedAt: this._phaseStartedAt,
      completedAt: this._completedAt,
      summary: this._summary,
      summaryVersion: this._summaryVersion,
      transcript: this._transcript,
      metadata: this._metadata,
      domainEvents: this._domainEvents,
    };
  }

  /**
   * Get domain events and clear them from the aggregate
   * Events should be dispatched after successful persistence
   */
  pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }

  // Getters
  get id(): string { return this._id; }
  get userId(): string { return this._userId; }
  get templateId(): string { return this._templateId; }
  get problemId(): string { return this._problemId; }
  get status(): InterviewStatus { return this._status; }
  get currentPhase(): PhaseId { return this._currentPhase; }
  get phaseStartedAt(): Date { return this._phaseStartedAt; }
  get startedAt(): Date { return this._startedAt; }
  get completedAt(): Date | null { return this._completedAt; }
  get duration(): number { return this._duration; }
  get mode(): "CANDIDATE" | "REVERSE" { return this._mode; }
  get candidatePersona(): any { return this._candidatePersona; }
  get summary(): string { return this._summary; }
  get summaryVersion(): number { return this._summaryVersion; }
  get transcript(): Array<{
    role: MessageRole;
    content: string;
    metadata?: Prisma.JsonValue;
    elapsedSeconds: number;
    phase: string;
  }> { return this._transcript; }
  get metadata(): Prisma.JsonValue { return this._metadata; }
  get whiteboardDescription(): string | null { return this._whiteboardDescription; }
  get turnCount(): number { return this._turnCount; }
}

/**
 * Data required to construct an InterviewAggregate
 */
export interface InterviewAggregateData {
  id: string;
  userId: string;
  templateId: string;
  problemId: string;
  status: InterviewStatus;
  currentPhase: PhaseId;
  phaseStartedAt: Date;
  startedAt: Date;
  completedAt: Date | null;
  duration: number;
  mode: "CANDIDATE" | "REVERSE";
  candidatePersona: any;
  summary: string;
  summaryVersion: number;
  transcript: Array<{
    role: MessageRole;
    content: string;
    metadata?: Prisma.JsonValue;
    elapsedSeconds: number;
    phase: string;
  }>;
  metadata: Prisma.JsonValue;
  whiteboardDescription: string | null;
}

/**
 * Result of applying a turn to the aggregate
 */
export interface ApplyTurnResult {
  reply: string;
  phase: string;
  previousPhase: string;
  transitioned: boolean;
  confidence: number;
  completed: boolean;
  summary: string;
}

/**
 * Payload for atomic persistence
 */
export interface PersistencePayload {
  interviewId: string;
  currentPhase: string;
  status: InterviewStatus;
  phaseStartedAt: Date;
  completedAt: Date | null;
  summary: string;
  summaryVersion: number;
  transcript: Array<{
    role: MessageRole;
    content: string;
    metadata?: Prisma.JsonValue;
    elapsedSeconds: number;
    phase: string;
  }>;
  metadata: Prisma.JsonValue;
  domainEvents: DomainEvent[];
}

/**
 * Domain Event types
 */
export type DomainEventType = 
  | "TURN_COMPLETED"
  | "PHASE_TRANSITION"
  | "INTERVIEW_COMPLETED"
  | "SUMMARY_UPDATED";

/**
 * Base Domain Event interface
 */
export interface DomainEvent {
  type: DomainEventType;
  aggregateId: string;
  data: Record<string, any>;
}

/**
 * Specific event data interfaces
 */
export interface TurnCompletedEventData {
  turnNumber: number;
  currentPhase: string;
  previousPhase: string;
  transitioned: boolean;
  completed: boolean;
  phaseAssessment: PhaseAssessment;
  timestamp: string;
}

export interface PhaseTransitionEventData {
  previousPhase: string;
  nextPhase: string;
  reason: string;
  timestamp: string;
}

export interface InterviewCompletedEventData {
  completedAt: string;
  finalPhase: string;
  totalTurns: number;
}

export interface SummaryUpdatedEventData {
  newSummary: string;
  version: number;
  timestamp: string;
}
