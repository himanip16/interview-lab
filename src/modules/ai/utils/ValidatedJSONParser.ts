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