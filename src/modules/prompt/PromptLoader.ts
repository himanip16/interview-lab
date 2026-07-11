import { readFile } from "fs/promises";
import path from "path";

export class PromptLoader {
  private static readonly cache = new Map<string, string>();

  async load(file: string): Promise<string> {
    const cached = PromptLoader.cache.get(file);

    if (cached) {
      return cached;
    }

    const fullPath = path.join(
      process.cwd(),
      "prompts",
      file
    );

    const content = await readFile(fullPath, "utf-8");

    PromptLoader.cache.set(file, content);

    return content;
  }

  clearCache(): void {
    PromptLoader.cache.clear();
  }
}