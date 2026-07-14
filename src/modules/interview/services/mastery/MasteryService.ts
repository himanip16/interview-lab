import { prisma } from "@/shared/prisma/client";
import logger from "@/shared/logger/logger";

// How quickly old mastery pulls back toward "unknown" (0.5) if a concept
// hasn't been demonstrated recently. 90 days = one full decay step.
const DECAY_HALF_LIFE_DAYS = 90;

// How much a single new evaluation can move the score, before decay/sample
// weighting. Kept fixed rather than 1/sampleCount so mastery can still shift
// meaningfully after many interviews instead of ossifying.
const BASE_LEARNING_RATE = 0.3;

type ConceptSignal = {
  conceptId: string;
  // 0-1, derived from the dimension score(s) of the evidence tagging this concept
  demonstratedScore: number;
};

export class MasteryService {
  /**
   * Recomputes ConceptMastery for every concept touched by a single
   * evaluation. Call this right after EvaluationService persists
   * EvidenceItem/EvidenceConcept rows for that evaluation.
   */
  async recomputeForEvaluation(evaluationId: string): Promise<void> {
    const evaluation = await prisma.evaluation.findUnique({
      where: { id: evaluationId },
      include: {
        interview: { select: { userId: true } },
        evidenceItems: {
          include: { concepts: true },
        },
      },
    });

    if (!evaluation) {
      throw new Error(`Evaluation ${evaluationId} not found`);
    }

    const dimensionScoresById = new Map(
      (
        evaluation.dimensionScores as Array<{
          dimension: string;
          score: number;
        }>
      ).map((d) => [d.dimension, d.score])
    );

    // Aggregate per-concept signal across every evidence item in this
    // evaluation that tagged it — a concept demonstrated by 3 evidence items
    // gets the average of those items' dimension scores.
    const signalsByConceptId = new Map<string, number[]>();

    for (const item of evaluation.evidenceItems) {
      const dimensionScore =
        dimensionScoresById.get(item.dimension) ?? 0;

      const normalized = Math.min(
        Math.max(dimensionScore / 10, 0),
        1
      );

      for (const link of item.concepts) {
        const existing =
          signalsByConceptId.get(link.conceptId) ?? [];

        existing.push(normalized * link.weight);

        signalsByConceptId.set(link.conceptId, existing);
      }
    }

    const signals: ConceptSignal[] = [
      ...signalsByConceptId.entries(),
    ].map(([conceptId, scores]) => ({
      conceptId,
      demonstratedScore:
        scores.reduce((sum, s) => sum + s, 0) / scores.length,
    }));

    for (const signal of signals) {
      await this.applySignal(
        evaluation.interview.userId,
        signal
      );
    }

    logger.info(
      `Mastery recomputed for evaluation ${evaluationId}: ${signals.length} concepts touched`
    );
  }

  private async applySignal(
    userId: string,
    signal: ConceptSignal
  ): Promise<void> {
    const existing = await prisma.conceptMastery.findUnique({
      where: {
        userId_conceptId: {
          userId,
          conceptId: signal.conceptId,
        },
      },
    });

    const now = new Date();

    const decayedScore = existing
      ? this.applyDecay(
          existing.score,
          existing.lastDemonstratedAt,
          now
        )
      : 0.5; // no prior data — start neutral, not zero

    const newScore =
      decayedScore +
      (signal.demonstratedScore - decayedScore) *
        BASE_LEARNING_RATE;

    const newSampleCount = (existing?.sampleCount ?? 0) + 1;

    // Confidence grows asymptotically: 1 sample ~0.33, 5 samples ~0.71,
    // 10 samples ~0.83. Never fully reaches 1 — there's always more signal
    // that could still shift the estimate.
    const newConfidence = newSampleCount / (newSampleCount + 2);

    await prisma.conceptMastery.upsert({
      where: {
        userId_conceptId: {
          userId,
          conceptId: signal.conceptId,
        },
      },
      update: {
        score: newScore,
        confidence: newConfidence,
        sampleCount: newSampleCount,
        lastDemonstratedAt: now,
      },
      create: {
        userId,
        conceptId: signal.conceptId,
        score: newScore,
        confidence: newConfidence,
        sampleCount: newSampleCount,
        lastDemonstratedAt: now,
      },
    });
  }

  /** Pulls a stale score back toward 0.5 (unknown) the longer it's been since it was last demonstrated. */
  private applyDecay(
    score: number,
    lastDemonstratedAt: Date | null,
    now: Date
  ): number {
    if (!lastDemonstratedAt) return score;

    const daysSince =
      (now.getTime() - lastDemonstratedAt.getTime()) /
      (1000 * 60 * 60 * 24);

    const decaySteps = daysSince / DECAY_HALF_LIFE_DAYS;

    const decayFactor = Math.pow(0.5, decaySteps);

    return 0.5 + (score - 0.5) * decayFactor;
  }
}