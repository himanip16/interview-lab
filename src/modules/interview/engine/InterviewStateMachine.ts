// src/modules/interview/engine/InterviewStateMachine.ts

export enum InterviewPhase {
  INTRODUCTION = "introduction",
  REQUIREMENTS = "requirements",
  HIGH_LEVEL_DESIGN = "high_level_design",
  DEEP_DIVE = "deep_dive",
  BOTTLE_NECKS = "bottlenecks",
  CLOSING = "closing",
}

export interface PhaseContext {
  phase: InterviewPhase;

  // Phase completion
  requirementsCovered: boolean;
  architectureCovered: boolean;
  deepDiveCompleted: boolean;
  bottlenecksCovered: boolean;

  // Interview quality
  interviewerGoalsCompleted: boolean;
  unansweredQuestions: number;

  // LLM confidence (0-1)
  confidence: number;
}

interface PhaseDefinition {
  phase: InterviewPhase;
  next?: InterviewPhase;

  isComplete(context: PhaseContext): boolean;
}

export class InterviewStateMachine {
  private readonly phases: Record<InterviewPhase, PhaseDefinition> = {
    [InterviewPhase.INTRODUCTION]: {
      phase: InterviewPhase.INTRODUCTION,
      next: InterviewPhase.REQUIREMENTS,
      isComplete: () => true,
    },

    [InterviewPhase.REQUIREMENTS]: {
      phase: InterviewPhase.REQUIREMENTS,
      next: InterviewPhase.HIGH_LEVEL_DESIGN,
      isComplete: (ctx) =>
        ctx.requirementsCovered &&
        ctx.interviewerGoalsCompleted &&
        ctx.unansweredQuestions === 0 &&
        ctx.confidence >= 0.85,
    },

    [InterviewPhase.HIGH_LEVEL_DESIGN]: {
      phase: InterviewPhase.HIGH_LEVEL_DESIGN,
      next: InterviewPhase.DEEP_DIVE,
      isComplete: (ctx) =>
        ctx.architectureCovered &&
        ctx.interviewerGoalsCompleted &&
        ctx.unansweredQuestions === 0 &&
        ctx.confidence >= 0.85,
    },

    [InterviewPhase.DEEP_DIVE]: {
      phase: InterviewPhase.DEEP_DIVE,
      next: InterviewPhase.BOTTLE_NECKS,
      isComplete: (ctx) =>
        ctx.deepDiveCompleted &&
        ctx.confidence >= 0.8,
    },

    [InterviewPhase.BOTTLE_NECKS]: {
      phase: InterviewPhase.BOTTLE_NECKS,
      next: InterviewPhase.CLOSING,
      isComplete: (ctx) =>
        ctx.bottlenecksCovered &&
        ctx.confidence >= 0.8,
    },

    [InterviewPhase.CLOSING]: {
      phase: InterviewPhase.CLOSING,
      isComplete: () => true,
    },
  };

  getCurrentPhase(context: PhaseContext): InterviewPhase {
    return context.phase;
  }

  shouldTransition(context: PhaseContext): boolean {
    return this.phases[context.phase].isComplete(context);
  }

  getNextPhase(context: PhaseContext): InterviewPhase {
    const current = this.phases[context.phase];

    if (!current.next) {
      return context.phase;
    }

    return this.shouldTransition(context)
      ? current.next
      : context.phase;
  }
}