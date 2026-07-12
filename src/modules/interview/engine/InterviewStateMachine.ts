import {
  InterviewPhaseDefinition,
  InterviewProfile,
  PhaseId,
} from "../profiles/InterviewProfile";

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
}

export interface TransitionResult {
  shouldTransition: boolean;

  currentPhase: PhaseId;

  nextPhase: PhaseId;

  reason:
    | "goals_completed"
    | "phase_time_budget_exceeded"
    | "interview_time_pressure"
    | "stay";
}

export class InterviewStateMachine {
  constructor(
    private readonly profile: InterviewProfile
  ) {}

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
    const phase = this.profile.phases[0];

    if (!phase) {
      throw new Error(
        `Interview profile "${this.profile.type}" has no phases`
      );
    }

    return phase.id;
  }

  evaluateTransition(
    context: TransitionContext
  ): TransitionResult {
    const currentPhase = this.getPhase(
      context.currentPhase
    );

    const currentIndex =
      this.profile.phases.findIndex(
        (phase) =>
          phase.id === context.currentPhase
      );

    const nextPhase =
      this.profile.phases[currentIndex + 1];

    if (!nextPhase) {
      return {
        shouldTransition: false,
        currentPhase: currentPhase.id,
        nextPhase: currentPhase.id,
        reason: "stay",
      };
    }

    const totalInterviewSeconds =
      Math.max(
        context.interviewDurationMinutes * 60,
        1
      );

    const targetPhaseSeconds =
      totalInterviewSeconds *
      currentPhase.targetDurationRatio;

    const elapsedRatio =
      context.elapsedInterviewSeconds /
      totalInterviewSeconds;

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

    const actualRemainingSeconds =
      Math.max(
        totalInterviewSeconds -
          context.elapsedInterviewSeconds,
        0
      );

    const coverage =
      this.calculateGoalCoverage(
        currentPhase,
        context.assessment
      );

    const goalsCompleted =
      coverage >=
        currentPhase.transitionThreshold &&
      context.assessment.confidence >=
        currentPhase.transitionThreshold &&
      context.assessment.unresolvedTopics.length === 0;

    if (goalsCompleted) {
      return {
        shouldTransition: true,
        currentPhase: currentPhase.id,
        nextPhase: nextPhase.id,
        reason: "goals_completed",
      };
    }

    if (
      context.elapsedPhaseSeconds >=
      targetPhaseSeconds
    ) {
      return {
        shouldTransition: true,
        currentPhase: currentPhase.id,
        nextPhase: nextPhase.id,
        reason: "phase_time_budget_exceeded",
      };
    }

    if (
      elapsedRatio >= 0.5 &&
      actualRemainingSeconds <
        expectedRemainingSeconds
    ) {
      return {
        shouldTransition: true,
        currentPhase: currentPhase.id,
        nextPhase: nextPhase.id,
        reason: "interview_time_pressure",
      };
    }

    return {
      shouldTransition: false,
      currentPhase: currentPhase.id,
      nextPhase: currentPhase.id,
      reason: "stay",
    };
  }

  private calculateGoalCoverage(
    phase: InterviewPhaseDefinition,
    assessment: PhaseAssessment
  ): number {
    if (phase.goals.length === 0) {
      return 1;
    }

    const total = phase.goals.reduce(
      (sum, goal) => {
        const value =
          assessment.goalCoverage[goal] ?? 0;

        return (
          sum +
          Math.min(Math.max(value, 0), 1)
        );
      },
      0
    );

    return total / phase.goals.length;
  }
}