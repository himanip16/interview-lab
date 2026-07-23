// src/features/interview/prompts/prompt/builders/PhasePromptBuilder.ts

export class PhasePromptBuilder {
  build(
    basePrompt: string,
    phaseInstructions: string
  ): string {
    return [
      basePrompt,
      "",
      phaseInstructions,
    ].join("\n");
  }
}