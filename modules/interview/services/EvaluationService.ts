import { prisma } from "@/lib/prisma";
import { AIService } from "../../ai/AIService";
import { PromptLoader } from "../../prompt/PromptLoader";

export class EvaluationService {
  private ai = new AIService();
  private promptLoader = new PromptLoader();

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
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      )
      .map((message) => `${message.role}: ${message.content}`)
      .join("\n");

    const rubric = await this.promptLoader.load(
      "rubrics/scalability.md"
    );

    const evaluationTemplate = await this.promptLoader.load(
      "evaluation.md"
    );

    const prompt = evaluationTemplate
      .replace("{{rubric}}", rubric)
      .replace("{{transcript}}", transcript);

    const response = await this.ai.chat([
      {
        role: "user",
        content: prompt,
      },
    ]);

    let result: {
      score: number;
      feedback: string;
      strengths: string[];
      weaknesses: string[];
    };

    try {
      result = JSON.parse(response);
    } catch {
      throw new Error("AI did not return valid JSON.");
    }

    return prisma.evaluation.create({
      data: {
        interviewId,
        score: result.score,
        feedback: result.feedback,
        metadata: {
          strengths: result.strengths,
          weaknesses: result.weaknesses,
        },
      },
    });
  }
}