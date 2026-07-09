import { promises as fs } from "fs";
import path from "path";

export class PromptLoader {
  private readonly templatesDirectory: string;

  constructor() {
    this.templatesDirectory = path.join(
      process.cwd(),
      "modules",
      "prompt",
      "templates"
    );
  }

  async load(templateName: string): Promise<string> {
    const templatePath = path.join(
      this.templatesDirectory,
      templateName
    );

    return fs.readFile(templatePath, "utf-8");
  }
}