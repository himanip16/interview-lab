import { ZodSchema } from "zod";

export class ValidatedJSONParser {
  static async parse<T>(
    response: string,
    schema: ZodSchema<T>,
    repair?: () => Promise<string>
  ): Promise<T> {
    const tryParse = (text: string): T => {
      const cleaned = text
        .replace(/^```json/i, "")
        .replace(/^```/i, "")
        .replace(/```$/i, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      if (typeof parsed.confidence === "number") {
        // Handle negative numbers by clamping to 0
        if (parsed.confidence < 0) {
          parsed.confidence = 0;
        } else if (parsed.confidence > 1 && parsed.confidence <= 100) {
          parsed.confidence = parsed.confidence / 100;
        } else if (parsed.confidence > 100) {
          parsed.confidence = 1;
        }
      } else if (typeof parsed.confidence === "string") {
        // Handle non-numeric strings by attempting to parse
        const numValue = parseFloat(parsed.confidence);
        if (!isNaN(numValue)) {
          parsed.confidence = numValue;
          if (parsed.confidence < 0) {
            parsed.confidence = 0;
          } else if (parsed.confidence > 1 && parsed.confidence <= 100) {
            parsed.confidence = parsed.confidence / 100;
          } else if (parsed.confidence > 100) {
            parsed.confidence = 1;
          }
        } else {
          // If string cannot be parsed to number, default to 0.5
          parsed.confidence = 0.5;
        }
      }

      return schema.parse(parsed);
    };

    try {
      return tryParse(response);
    } catch {
      if (repair) {
        try {
          const repaired = await repair();
          return tryParse(repaired);
        } catch {
          // fall through
        }
      }

      throw new Error(
        `Failed to parse or validate AI response.\n\nResponse:\n${response}`
      );
    }
  }
}
