import { Prisma } from "@prisma/client";
import { prisma } from "@/shared/prisma/client";
import { AIService } from "@/src/modules/ai/services/AIService";
import logger from "@/src/shared/logger/logger";

import { EvidenceEvaluator } from "../../evaluators/EvidenceEvaluator";
import { EvaluatableInterview } from "../../evaluators/types";
import { PromptLoader } from "../../prompt/PromptLoader";
import { InterviewRepository } from "../../repositories/InterviewRepository";
import { MasteryService } from "../mastery/MasteryService";

export class EvaluationService {
  private readonly evaluator: EvidenceEvaluator;
  private readonly mastery: MasteryService;

  constructor(
    private readonly ai: AIService,
    private readonly promptLoader: PromptLoader,
    private readonly log: typeof logger = logger
  ) {
    this.evaluator = new EvidenceEvaluator(
      this.ai,
      this.promptLoader
    );
    this.mastery = new MasteryService();
  }

  async evaluateInterview(interviewId: string) {
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId },
      include: {
        transcript: {
          orderBy: { createdAt: "asc" },
        },
        template: {
          include: { phases: true },
        },
      },
    });

    if (!interview) {
      throw new Error(
        `Interview ${interviewId} not found`
      );
    }

    const evaluatable: EvaluatableInterview = {
      id: interview.id,
      startedAt: interview.startedAt,
      createdAt: interview.createdAt,
      transcript: interview.transcript,
      template: interview.template,
    };

    const result = await this.evaluator.evaluate(
      evaluatable
    );

    const evidence = result.dimensionScores.flatMap(
      (dimension) =>
        dimension.evidence.map((item) => ({
          dimension: dimension.dimension,
          conceptSlugs: [], // TODO: Extract from evaluator result when available
          ...item,
        }))
    );

    const repository = new InterviewRepository();

    const evaluation = await repository.saveEvaluation(
      interviewId,
      {
        overallScore: result.overallScore,
        dimensionScores: result.dimensionScores as unknown as Prisma.InputJsonValue,
        evidence: evidence as unknown as Prisma.InputJsonValue,
        feedback: result.feedback,
        metadata: {
          strengths: result.strengths,
          weaknesses: result.weaknesses,
        },
      }
    );

    // Write the normalized evidence/concept rows the Skill Intelligence
    // Layer reads from. This is separate from the Json blob above — that
    // stays as a read-optimized cache for the report page.
    await this.persistEvidenceItems(evaluation.id, evidence);

    await this.mastery.recomputeForEvaluation(evaluation.id);

    this.log.info(
      `Evaluation completed for interview ${interviewId} (overall: ${result.overallScore}, ${evidence.length} evidence items)`
    );

    return evaluation;
  }

  private async persistEvidenceItems(
    evaluationId: string,
    evidence: Array<{
      dimension: string;
      messageId: string;
      timestampSeconds: number;
      quote: string;
      comment: string;
      conceptSlugs: string[];
    }>
  ) {
    if (evidence.length === 0) return;

    const allConceptSlugs = [
      ...new Set(evidence.flatMap((e) => e.conceptSlugs)),
    ];

    const concepts = await prisma.concept.findMany({
      where: { slug: { in: allConceptSlugs } },
      select: { id: true, slug: true },
    });

    const conceptIdBySlug = new Map(
      concepts.map((c) => [c.slug, c.id])
    );

    for (const item of evidence) {
      const created = await prisma.evidenceItem.create({
        data: {
          evaluationId,
          messageId: item.messageId,
          dimension: item.dimension,
          timestampSeconds: item.timestampSeconds,
          quote: item.quote,
          comment: item.comment,
        },
      });

      const conceptLinks = item.conceptSlugs
        .map((slug) => conceptIdBySlug.get(slug))
        .filter((id): id is string => Boolean(id));

      if (conceptLinks.length > 0) {
        await prisma.evidenceConcept.createMany({
          data: conceptLinks.map((conceptId) => ({
            evidenceItemId: created.id,
            conceptId,
          })),
          skipDuplicates: true,
        });
      }
    }
  }
}