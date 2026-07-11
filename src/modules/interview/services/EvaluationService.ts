import { prisma } from "@/lib/prisma";
import { AIService } from "../../ai/AIService";
import { PromptLoader } from "../../prompt/PromptLoader";
import { Logger } from "../../logging/Logger";

export class EvaluationService {
  constructor(
    private readonly ai: AIService,
    private readonly promptLoader: PromptLoader,
    private readonly logger: Logger
  ) {}

  async evaluateInterview(interviewId: string) {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        transcript: true,
      },
    });

    if (!interview) {
      throw new Error(`Interview ${interviewId} not found`);
    }

    const transcript = interview.transcript
      .sort(
        (a, b) =>
          a.createdAt.getTime() -
          b.createdAt.getTime()
      )
      .map(
        (message) =>
          `${message.role}: ${message.content}`
      )
      .join("\n");

    const rubric = await this.promptLoader.load(
      "rubrics/scalability.md"
    );

    const template = await this.promptLoader.load(
      "evaluation.md"
    );

    const prompt = template
      .replace("{{rubric}}", rubric)
      .replace("{{transcript}}", transcript);

    const result = await this.ai.chat([
      {
        role: "user",
        content: prompt,
      },
    ]);

    this.logger.info(
      `Evaluation completed for interview ${interviewId}`
    );

    return result;
  }
}