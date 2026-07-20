import { BasePromptBuilder } from "./BasePromptBuilder";
import { PhasePromptBuilder } from "./PhasePromptBuilder";
import { JSONSchemaBuilder } from "./JSONSchemaBuilder";

export class PromptBuilder {
  private readonly baseBuilder = new BasePromptBuilder();
  private readonly phaseBuilder = new PhasePromptBuilder();
  private readonly schemaBuilder = new JSONSchemaBuilder();

  build(input: {
    systemPrompt: string;
    interviewContext: string;
    phaseInstructions: string;
    jsonSchema: string;
  }): string {
    const base = this.baseBuilder.build(
      input.systemPrompt,
      input.interviewContext
    );

    const phase = this.phaseBuilder.build(
      base,
      input.phaseInstructions
    );

    return this.schemaBuilder.build(
      phase,
      input.jsonSchema
    );
  }
}