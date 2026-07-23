// src/features/interview/prompts/prompt/builders/BasePromptBuilder.ts

export class BasePromptBuilder {
  build(
    systemPrompt: string,
    interviewContext: string
  ): string {
    return [
      systemPrompt,
      "",
      interviewContext,
    ].join("\n");
  }
}