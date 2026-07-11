import { PromptLoader } from "@/src/modules/prompt/PromptLoader";
import { InterviewPhase } from "./InterviewStateMachine";

export class PromptBuilder {
  constructor(
    private readonly promptLoader = new PromptLoader()
  ) {}

  async buildSystemPrompt(
    phase: InterviewPhase,
    candidateName: string,
    problem: string,
    summary: string = ""
  ): Promise<string> {
    const basePrompt = await this.promptLoader.load(
      "interview/judge.md"
    );

    const phasePrompt = await this.promptLoader.load(
      this.getPhasePrompt(phase)
    );

    return `
${basePrompt}

Candidate:
${candidateName}

Problem:
${problem}

Current Phase:
${phase}

Running Summary:
${summary}

${phasePrompt}
`.trim();
  }

  private getPhasePrompt(
    phase: InterviewPhase
  ): string {
    switch (phase) {
      case InterviewPhase.INTRODUCTION:
        return "interview/intro.md";

      case InterviewPhase.REQUIREMENTS:
        return "interview/clarification.md";

      case InterviewPhase.HIGH_LEVEL_DESIGN:
        return "interview/scaling.md";

      case InterviewPhase.DEEP_DIVE:
        return "interview/deep_dive.md";

      case InterviewPhase.BOTTLE_NECKS:
        return "interview/bottlenecks.md";

      case InterviewPhase.CLOSING:
        return "interview/closing.md";

      default:
        throw new Error(`Unknown phase: ${phase}`);
    }
  }
}