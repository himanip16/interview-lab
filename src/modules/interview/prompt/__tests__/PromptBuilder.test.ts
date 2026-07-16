import { describe, expect, it } from "vitest";
import { PromptBuilder } from "../builders/PromptBuilder";

describe("PromptBuilder", () => {
  it("produces identical prompt after refactor", () => {
    const builder = new PromptBuilder();

    const result = builder.build({
      systemPrompt: "SYSTEM",
      interviewContext: "CONTEXT",
      phaseInstructions: "PHASE",
      jsonSchema: "{schema}",
    });

    expect(result).toEqual(
`SYSTEM

CONTEXT

PHASE

Return valid JSON only.
{schema}`
    );
  });
});