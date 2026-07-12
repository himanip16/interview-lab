import { promises as fs } from "fs";
import path from "path";

export class PromptLoader {
  private readonly templatesDirectory = path.join(
    process.cwd(),
    "src",
    "modules",
    "interview",
    "prompt",
    "templates"
  );

  private readonly rubricsDirectory = path.join(
    process.cwd(),
    "data",
    "rubrics"
  );

  private readonly cache = new Map<string, string>();

  async load(
    templateName: string
  ): Promise<string> {
    const cached = this.cache.get(templateName);

    if (cached) {
      return cached;
    }

    const templatePath = path.join(
      this.templatesDirectory,
      templateName
    );

    try {
      await fs.access(templatePath);

      const template = await fs.readFile(
        templatePath,
        "utf-8"
      );

      this.cache.set(
        templateName,
        template
      );

      return template;
    } catch (error) {
      throw new Error(
        `Prompt template "${templateName}" was not found or could not be loaded at "${templatePath}".`,
        {
          cause: error,
        }
      );
    }
  }

  async loadRubric(
    rubricName: string
  ): Promise<string> {
    const cacheKey = `rubric:${rubricName}`;
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const rubricPath = path.join(
      this.rubricsDirectory,
      rubricName
    );

    try {
      await fs.access(rubricPath);

      const rubric = await fs.readFile(
        rubricPath,
        "utf-8"
      );

      this.cache.set(
        cacheKey,
        rubric
      );

      return rubric;
    } catch (error) {
      throw new Error(
        `Rubric "${rubricName}" was not found or could not be loaded at "${rubricPath}".`,
        {
          cause: error,
        }
      );
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}