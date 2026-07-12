import { PromptLoader } from "@/src/modules/interview/prompt/PromptLoader";
import { PromptRenderer } from "@/src/modules/interview/prompt/PromptRenderer";

import { InterviewPhaseDefinition } from "../profiles/InterviewProfile";

export class PromptBuilder {
  constructor(
    private readonly promptLoader =
      new PromptLoader(),
    private readonly promptRenderer =
      new PromptRenderer()
  ) {}

  async buildSystemPrompt(
    phase: InterviewPhaseDefinition,
    candidateName: string,
    problem: string,
    runningSummary = "",
    latestQuestion?: string,
    latestAnswer?: string
  ): Promise<string> {
    const basePrompt =
      await this.promptLoader.load(
        "judge.md"
      );

    const renderedBasePrompt = this.promptRenderer.render(basePrompt, {
      candidate: candidateName,
      question: latestQuestion || "Starting the interview",
      answer: latestAnswer || "No response yet",
    });

    const goals = phase.goals
      .map((goal) => `- ${goal}`)
      .join("\n");

    const dimensions =
      phase.evaluationDimensions
        .map(
          (dimension) => `- ${dimension}`
        )
        .join("\n");

    const goalCoverageTemplate = phase.goals.length > 0
      ? phase.goals
          .map((goal) => `      "${goal}": 0.0`)
          .join(",\n")
      : '      "phase_goal": 0.0';

    return `
${renderedBasePrompt}

Interview Problem:
${problem}

Current Phase:
${phase.id}

Running Summary:
${runningSummary}

PHASE INSTRUCTIONS:

${phase.instructions}

PHASE GOALS:

${goals || "- No explicit goals"}

EVALUATION DIMENSIONS:

${dimensions || "- None"}

You must evaluate only the CURRENT PHASE.

Do not decide whether the interview should transition.

Do not return transition or nextPhase.

Return ONLY valid JSON using exactly this structure:

{
  "reply": "Your next interviewer response",
  "phaseAssessment": {
    "goalCoverage": {
${goalCoverageTemplate}
    },
    "confidence": 0.0,
    "unresolvedTopics": []
  }
}

For goalCoverage:

- Include every phase goal listed above.
- Values must be between 0 and 1.
- 0 means not discussed.
- 0.5 means partially demonstrated.
- 1 means clearly demonstrated.

confidence must be between 0 and 1.

unresolvedTopics must contain only important topics blocking completion of the current phase.

Ask one focused interview question at a time.

Do not solve the problem for the candidate.

Do not use markdown.

Return JSON only.
`.trim();
  }
}