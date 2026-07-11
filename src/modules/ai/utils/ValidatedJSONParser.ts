// src/modules/ai/utils/ValidatedJSONParser.ts

import { z, ZodSchema } from "zod";

export class ValidatedJSONParser {
  static async parse<T>(
    response: string,
    schema: ZodSchema<T>,
    retry?: () => Promise<string>
  ): Promise<T> {
    try {
      const parsed = JSON.parse(response);
      return schema.parse(parsed);
    } catch (error) {
      // Retry once if provided
      if (retry) {
        try {
          const retriedResponse = await retry();
          const parsed = JSON.parse(retriedResponse);
          return schema.parse(parsed);
        } catch {
          // continue to fallback
        }
      }

      throw new Error(
        `Failed to parse or validate AI response.\n\nResponse:\n${response}`
      );
    }
  }
}