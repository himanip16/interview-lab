import { prisma } from "@/shared/prisma/client";
import { AIService } from "../../../ai/services/AIService";
import { PromptLoader } from "../../prompt/PromptLoader";
import logger from "@/src/shared/logger/logger";
import { InterviewRepository } from "../../repositories/InterviewRepository";

export class EvaluationService {
  constructor(
    private readonly ai: AIService,
    private readonly promptLoader: PromptLoader,
    private readonly logger: any
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

    const rubric = await this.promptLoader.loadRubric(
      "scalability.md"
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

    // Parse the AI response and save to database
    const repository = new InterviewRepository();
    
    // For now, return a placeholder evaluation
    // TODO: Parse the AI response to extract scores and feedback
    const evaluation = await repository.saveEvaluation(
      interviewId,
      {
        overallScore: 75,
        communicationScore: 80,
        architectureScore: 75,
        scalabilityScore: 70,
        tradeoffScore: 75,
        feedback: result,
        metadata: {
          rawResponse: result,
        },
      }
    );

    return evaluation;
  }
}