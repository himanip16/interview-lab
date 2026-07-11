import { z } from "zod";
import { InterviewPhase } from "./InterviewStateMachine";
import { ValidatedJSONParser } from "@/src/modules/ai/utils/ValidatedJSONParser";

const AIResponseSchema = z.object({
  reply: z.string(),

  transition: z.boolean(),

  nextPhase: z.nativeEnum(InterviewPhase).optional(),

  confidence: z.number().min(0).max(1).optional(),
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