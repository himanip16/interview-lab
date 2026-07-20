import { promises as fs } from "fs";
import path from "path";

import { prisma } from "@/shared/prisma/client";

const FALLBACK_RUBRIC = (dimension: string) => `
Score from 0-10 based on how clearly the candidate demonstrated "${dimension}".

No specific rubric has been configured for this dimension yet — score
conservatively and note in the summary that a dedicated rubric is missing.
`.trim();

export class PromptLoader {
  
  private readonly templatesDirectory = path.join(
  process.cwd(),
  "src",
  "features",
  "interview",
  "prompts",
  "prompt",
  "templates"
);

  private readonly cache = new Map<string, string>();

  private readonly rubricCache = new Map<string, string>();

  async load(templateName: string): Promise<string> {
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

      this.cache.set(templateName, template);

      return template;
    } catch (error) {
      throw new Error(
        `Prompt template "${templateName}" was not found or could not be loaded at "${templatePath}".`,
        { cause: error }
      );
    }
  }

  /**
   * Loads a scoring rubric for a single evaluation dimension, scoped to an
   * interview template (RubricTemplate row). This is what makes rubrics
   * extensible along with interview types: a new template brings its own
   * rubric rows instead of a new static .md file + code path.
   *
   * Falls back to a generic rubric (rather than throwing) so a template that
   * hasn't had every dimension's rubric authored yet still produces a scored,
   * evidence-backed evaluation instead of a hard failure.
   */
  async loadRubricForDimension(
    templateId: string,
    dimension: string
  ): Promise<string> {
    const cacheKey = `${templateId}:${dimension}`;

    const cached = this.rubricCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const rubric = await prisma.rubricTemplate.findUnique(
      {
        where: {
          templateId_dimension: {
            templateId,
            dimension,
          },
        },
      }
    );

    const content = rubric?.content?.trim()
      ? rubric.content
      : FALLBACK_RUBRIC(dimension);

    this.rubricCache.set(cacheKey, content);

    return content;
  }

  clearCache(): void {
    this.cache.clear();
    this.rubricCache.clear();
  }
}