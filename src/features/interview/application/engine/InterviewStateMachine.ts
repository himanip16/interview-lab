// src/features/interview/application/engine/InterviewStateMachine.ts

import {
  InterviewPhaseDefinition,
  InterviewProfile,
} from "@/features/interview/data/profiles/InterviewProfile";
import { PhaseId } from "@/features/interview/data/constants";

export interface PhaseAssessment {
  goalCoverage: Record<string, number>;
  confidence: number;
  unresolvedTopics: string[];
}

export interface TransitionContext {
  currentPhase: PhaseId;
  interviewDurationMinutes: number;
  elapsedInterviewSeconds: number;
  elapsedPhaseSeconds: number;
  assessment: PhaseAssessment;
  turnCount?: number;
}

export type TransitionReason =
  | "goals_completed"
  | "phase_time_budget_exceeded"
  | "interview_time_pressure"
  | "interview_completed"
  | "stay";

export interface TransitionResult {
  shouldTransition: boolean;
  completed: boolean;
  currentPhase: PhaseId;
  nextPhase: PhaseId;
  reason: TransitionReason;
}

export class InterviewStateMachine {
  private static readonly TIME_PRESSURE_START_RATIO = 0.5;
  private static readonly TIME_PRESSURE_THRESHOLD = 0.3;
  private static readonly MIN_PHASE_TIME_RATIO = 0.3;
  private static readonly FLOATING_POINT_EPSILON = 0.001;
  private static readonly HARD_COMPLETION_OVERRUN_RATIO = 0.1;

  constructor(
    private readonly profile: InterviewProfile
  ) {
    if (profile.phases.length === 0) {
      throw new Error(
        `Interview profile "${profile.type}" has no phases`
      );
    }
  }

  getPhase(
    phaseId: PhaseId
  ): InterviewPhaseDefinition {
    const phase = this.profile.phases.find(
      (candidate) => candidate.id === phaseId
    );

    if (!phase) {
      throw new Error(
        `Unknown phase "${phaseId}" for interview type "${this.profile.type}"`
      );
    }

    return phase;
  }

  getInitialPhase(): PhaseId {
    return this.profile.phases[0].id;
  }

  evaluateTransition(
    context: TransitionContext
  ): TransitionResult {
    const currentPhase = this.getPhase(
      context.currentPhase
    );

    const currentIndex =
      this.profile.phases.findIndex(
        (phase) => phase.id === currentPhase.id
      );

    const nextPhase =
      this.profile.phases[currentIndex + 1];

    const totalInterviewSeconds = Math.max(
      context.interviewDurationMinutes * 60,
      1
    );

    const elapsedInterviewSeconds = Math.max(
      context.elapsedInterviewSeconds,
      0
    );

    const elapsedPhaseSeconds = Math.max(
      context.elapsedPhaseSeconds,
      0
    );

    const targetPhaseSeconds =
      totalInterviewSeconds *
      currentPhase.targetDurationRatio;

    // LLM provides signals (goalCoverage, confidence, unresolvedTopics)
    // State machine applies deterministic constraints
    const coverage = this.calculateGoalCoverage(
      currentPhase,
      context.assessment
    );

    const goalsCompleted =
      coverage >= (currentPhase.transitionThreshold - InterviewStateMachine.FLOATING_POINT_EPSILON) &&
      this.clamp(context.assessment.confidence) >=
        (currentPhase.transitionThreshold - InterviewStateMachine.FLOATING_POINT_EPSILON) &&
      context.assessment.unresolvedTopics.length === 0;

    /*
     * Terminal phase owns interview completion.
     *
     * A terminal phase does NOT complete merely because there is no
     * next phase. Completion requires its goals to be satisfied.
     *
     * Hard completion: If interview duration exceeded by 10%, force completion
     * to prevent getting stuck in terminal phase indefinitely.
     */
    if (!nextPhase) {
      // Check for hard completion due to time overrun
      const hardCompletionThreshold = totalInterviewSeconds * (1 + InterviewStateMachine.HARD_COMPLETION_OVERRUN_RATIO);
      if (elapsedInterviewSeconds >= hardCompletionThreshold) {
        return {
          shouldTransition: false,
          completed: true,
          currentPhase: currentPhase.id,
          nextPhase: currentPhase.id,
          reason: "interview_completed",
        };
      }

      if (goalsCompleted) {
        return {
          shouldTransition: false,
          completed: true,
          currentPhase: currentPhase.id,
          nextPhase: currentPhase.id,
          reason: "interview_completed",
        };
      }

      return {
        shouldTransition: false,
        completed: false,
        currentPhase: currentPhase.id,
        nextPhase: currentPhase.id,
        reason: "stay",
      };
    }

    // Deterministic rule: Transition only if goals are met OR hard caps hit
    // LLM is a sensor, not the decision maker
    if (goalsCompleted) {
      return this.transitionTo(
        currentPhase,
        nextPhase,
        "goals_completed"
      );
    }

    // Hard cap: Phase time budget exceeded
    if (
      elapsedPhaseSeconds >= targetPhaseSeconds
    ) {
      return this.transitionTo(
        currentPhase,
        nextPhase,
        "phase_time_budget_exceeded"
      );
    }

    // Hard cap: Interview time pressure (must complete remaining phases)
    if (
      this.isUnderTimePressure({
        currentIndex,
        totalInterviewSeconds,
        elapsedInterviewSeconds,
        elapsedPhaseSeconds,
        targetPhaseSeconds,
      })
    ) {
      return this.transitionTo(
        currentPhase,
        nextPhase,
        "interview_time_pressure"
      );
    }

    // Stay in current phase - constraints not satisfied
    return {
      shouldTransition: false,
      completed: false,
      currentPhase: currentPhase.id,
      nextPhase: currentPhase.id,
      reason: "stay",
    };
  }

  private transitionTo(
    currentPhase: InterviewPhaseDefinition,
    nextPhase: InterviewPhaseDefinition,
    reason: Exclude<
      TransitionReason,
      "stay" | "interview_completed"
    >
  ): TransitionResult {
    return {
      shouldTransition: true,
      completed: false,
      currentPhase: currentPhase.id,
      nextPhase: nextPhase.id,
      reason,
    };
  }

  private isUnderTimePressure(params: {
    currentIndex: number;
    totalInterviewSeconds: number;
    elapsedInterviewSeconds: number;
    elapsedPhaseSeconds: number;
    targetPhaseSeconds: number;
  }): boolean {
    const {
      currentIndex,
      totalInterviewSeconds,
      elapsedInterviewSeconds,
      elapsedPhaseSeconds,
      targetPhaseSeconds,
    } = params;

    const elapsedRatio =
      elapsedInterviewSeconds /
      totalInterviewSeconds;

    if (
      elapsedRatio <
      InterviewStateMachine.TIME_PRESSURE_START_RATIO
    ) {
      return false;
    }

    if (
      elapsedPhaseSeconds <
      targetPhaseSeconds *
        InterviewStateMachine.MIN_PHASE_TIME_RATIO
    ) {
      return false;
    }

    const remainingPhaseRatio =
      this.profile.phases
        .slice(currentIndex + 1)
        .reduce(
          (sum, phase) =>
            sum + phase.targetDurationRatio,
          0
        );

    const expectedRemainingSeconds =
      totalInterviewSeconds *
      remainingPhaseRatio;

    const actualRemainingSeconds = Math.max(
      totalInterviewSeconds -
        elapsedInterviewSeconds,
      0
    );

    return (
      actualRemainingSeconds <
      expectedRemainingSeconds *
        (1 -
          InterviewStateMachine.TIME_PRESSURE_THRESHOLD)
    );
  }

  private calculateGoalCoverage(
    phase: InterviewPhaseDefinition,
    assessment: PhaseAssessment
  ): number {
    if (phase.goals.length === 0) {
      return 1;
    }

    const total = phase.goals.reduce(
      (sum, goal) =>
        sum +
        this.clamp(
          assessment.goalCoverage[goal.id] ?? 0
        ),
      0
    );

    return total / Math.max(phase.goals.length, 1);
  }

  private clamp(value: number): number {
    if (!Number.isFinite(value)) {
      return 0;
    }

    return Math.min(Math.max(value, 0), 1);
  }
}