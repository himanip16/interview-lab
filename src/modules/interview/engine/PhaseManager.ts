// modules/interview/engine/PhaseManager.ts
export enum InterviewPhase {
  INTRODUCTION = 'introduction',
  REQUIREMENTS = 'requirements',
  HIGH_LEVEL_DESIGN = 'high_level_design',
  DEEP_DIVE = 'deep_dive',
  BOTTLE_NECKS = 'bottlenecks',
  CLOSING = 'closing'
}

export class PhaseManager {
  private phases: InterviewPhase[] = [
    InterviewPhase.INTRODUCTION,
    InterviewPhase.REQUIREMENTS,
    InterviewPhase.HIGH_LEVEL_DESIGN,
    InterviewPhase.DEEP_DIVE,
    InterviewPhase.BOTTLE_NECKS,
    InterviewPhase.CLOSING
  ];

  getCurrentPhase(currentPhase: InterviewPhase): InterviewPhase {
    return currentPhase;
  }

  getNextPhase(currentPhase: InterviewPhase): InterviewPhase {
    const currentIndex = this.phases.indexOf(currentPhase);
    if (currentIndex < this.phases.length - 1) {
      return this.phases[currentIndex + 1];
    }
    return currentPhase;
  }

  // Logic to determine if we should transition
  // This can be based on message count, or a hidden "ready" signal from the LLM
  shouldTransition(messageCount: number, aiSignal?: string): boolean {
    if (aiSignal?.includes('[[TRANSITION]]')) return true;
    if (messageCount > 10) return true; // Safety fallback
    return false;
  }
}