import { z } from "zod";

import { ValidatedJSONParser } from "@/src/modules/ai/utils/ValidatedJSONParser";

const AIResponseSchema = z.object({
  reply: z.string().min(1),

  phaseAssessment: z.object({
    goalCoverage: z.record(
      z.string(),
      z.number().min(0).max(1)
    ),

    confidence: z
      .number()
      .transform((value) =>
        value > 1
          ? Math.min(value / 100, 1)
          : value
      )
      .pipe(
        z.number().min(0).max(1)
      ),

    unresolvedTopics: z.array(
      z.string()
    ),
  }),
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