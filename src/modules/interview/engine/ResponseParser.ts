import { z } from "zod";

import { ValidatedJSONParser } from "@/modules/ai/utils/ValidatedJSONParser";

// Ollama structured-output schema, kept next to the Zod schema it must match
// exactly — this used to live inside OllamaProvider.ts as a stale constant
// (transition/nextPhase/confidence) that no longer matched what's parsed
// below (reply/phaseAssessment). goalCoverage keys are dynamic per phase, so
// it's constrained via additionalProperties rather than fixed keys.
export const INTERVIEWER_JSON_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    phaseAssessment: {
      type: "object",
      properties: {
        goalCoverage: {
          type: "object",
          additionalProperties: { type: "number" },
        },
        confidence: { type: "number" },
        unresolvedTopics: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["goalCoverage", "confidence", "unresolvedTopics"],
    },
  },
  required: ["reply", "phaseAssessment"],
} as const;

const AIResponseSchema = z.object({
  reply: z.string().min(1),

  phaseAssessment: z.object({
    goalCoverage: z.record(
      z.string(),
      z.number().min(0).max(1)
    ).optional().default({}),

    confidence: z
      .number()
      .transform((value) =>
        value > 1
          ? Math.min(value / 100, 1)
          : value
      )
      .pipe(
        z.number().min(0).max(1)
      )
      .optional()
      .default(0.5),

    unresolvedTopics: z.array(
      z.string()
    ).optional().default([]),
  }).optional(),

  transition: z.boolean().optional(),
  nextPhase: z.string().optional(),
  confidence: z.number().optional(),
}).transform((data) => {
  if (!data.phaseAssessment && (data.confidence !== undefined || data.transition !== undefined)) {
    return {
      reply: data.reply,
      phaseAssessment: {
        goalCoverage: {},
        confidence: data.confidence ?? 0.5,
        unresolvedTopics: [],
      },
    };
  }
  return data;
});

export type ParsedResponse = z.infer<typeof AIResponseSchema>;

export class ResponseParser {
  async parse(
    response: string,
    retry?: () => Promise<string>
  ): Promise<ParsedResponse> {
    return ValidatedJSONParser.parse(
      response,
      AIResponseSchema,
      retry
    );
  }
}