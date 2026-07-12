import { z } from "zod";

import { ValidatedJSONParser } from "@/src/modules/ai/utils/ValidatedJSONParser";

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

  // Legacy fields that some AI models might return
  transition: z.boolean().optional(),
  nextPhase: z.string().optional(),
  confidence: z.number().optional(), // Legacy top-level confidence
}).transform((data) => {
  // If AI returned legacy format (top-level confidence), convert to new format
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

export type ParsedResponse = z.infer<
  typeof AIResponseSchema
>;

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