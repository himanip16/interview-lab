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