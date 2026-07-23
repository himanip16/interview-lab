// src/features/interview/application/engine/ResponseParser.ts

import { z } from "zod";

import { StructuredOutputParser } from "@/shared/ai/parsers/StructuredOutputParser";

/**
 * Normalizes confidence values from different LLM output scales.
 * 
 * LLMs may output confidence on different scales despite prompt instructions:
 * - Unit scale (0-1): 0.8 → 0.8 (no change)
 * - 1-10 scale: 5 → 0.5, 8 → 0.8 (divide by 10)
 * - Percentage scale (0-100): 75 → 0.75 (divide by 100)
 * 
 * Scale detection is based on explicit ranges to avoid ambiguity:
 * - 0-1: already normalized
 * - 1-10: treated as 1-10 rating scale
 * - 10-100: treated as percentage
 * - >100 or <0: invalid, rejected
 * 
 * Logs warnings when normalization is required to detect prompt drift.
 */
function normalizeConfidence(value: number): number {
  // Reject invalid values - let Zod validation fail so repair/retry can handle it
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid confidence: ${value} is not a finite number`);
  }
  
  // Reject obviously invalid ranges - don't silently clamp
  if (value < 0 || value > 100) {
    throw new Error(`Invalid confidence: ${value} is outside valid range [0, 100]`);
  }
  
  // Unit scale (0-1): already normalized, no transformation needed
  if (value <= 1) {
    return value;
  }
  
  // 1-10 scale: divide by 10 (e.g., 5 → 0.5, 8 → 0.8)
  // Note: 10 is treated as 1.0 (perfect confidence), not 10%
  if (value > 1 && value <= 10) {
    console.warn(`[LLM Drift] confidence value ${value} appears to be on 1-10 scale, normalizing to ${value / 10}. Prompt may need adjustment.`);
    return value / 10;
  }
  
  // Percentage scale (10-100): divide by 100 (e.g., 75 → 0.75)
  if (value > 10 && value <= 100) {
    console.warn(`[LLM Drift] confidence value ${value} appears to be on percentage scale, normalizing to ${value / 100}. Prompt may need adjustment.`);
    return value / 100;
  }
  
  // This should never be reached due to the >100 check above
  throw new Error(`Invalid confidence: ${value} could not be normalized`);
}

/**
 * Normalizes goal coverage values from different LLM output scales.
 * Same logic as normalizeConfidence but with goal-specific logging.
 */
function normalizeGoalCoverage(value: number): number {
  // Reject invalid values - let Zod validation fail so repair/retry can handle it
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid goal coverage: ${value} is not a finite number`);
  }
  
  // Reject obviously invalid ranges - don't silently clamp
  if (value < 0 || value > 100) {
    throw new Error(`Invalid goal coverage: ${value} is outside valid range [0, 100]`);
  }
  
  // Unit scale (0-1): already normalized, no transformation needed
  if (value <= 1) {
    return value;
  }
  
  // 1-10 scale: divide by 10
  if (value > 1 && value <= 10) {
    console.warn(`[LLM Drift] goal coverage value ${value} appears to be on 1-10 scale, normalizing to ${value / 10}. Prompt may need adjustment.`);
    return value / 10;
  }
  
  // Percentage scale (10-100): divide by 100
  if (value > 10 && value <= 100) {
    console.warn(`[LLM Drift] goal coverage value ${value} appears to be on percentage scale, normalizing to ${value / 100}. Prompt may need adjustment.`);
    return value / 100;
  }
  
  throw new Error(`Invalid goal coverage: ${value} could not be normalized`);
}

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
      z.number().transform(normalizeGoalCoverage)
    ).optional().default({}),

    confidence: z
      .number()
      .transform(normalizeConfidence)
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
  // If phaseAssessment exists but top-level confidence/transition also exist, merge them
  if (data.phaseAssessment) {
    return {
      reply: data.reply,
      phaseAssessment: {
        goalCoverage: data.phaseAssessment.goalCoverage ?? {},
        confidence: data.confidence ?? data.phaseAssessment.confidence ?? 0.5,
        unresolvedTopics: data.phaseAssessment.unresolvedTopics ?? [],
      },
    };
  }

  // If phaseAssessment doesn't exist but top-level values do, create phaseAssessment
  if (data.confidence !== undefined || data.transition !== undefined) {
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
    return StructuredOutputParser.parse(
      response,
      AIResponseSchema,
      retry
    );
  }
}