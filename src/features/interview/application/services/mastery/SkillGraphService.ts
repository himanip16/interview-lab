// src/features/interview/application/services/mastery/SkillGraphService.ts

import { prisma } from "shared/prisma/client";

const CONFIDENCE_THRESHOLD_FOR_RANKING = 0.4; // ~2+ evidence samples before a concept counts toward strengths/weaknesses
const TOP_N = 5;

export interface ConceptMasterySnapshot {
  conceptId: string;
  slug: string;
  name: string;
  category: string;
  score: number | null; // null = not yet assessed
  confidence: number;
  sampleCount: number;
  lastDemonstratedAt: Date | null;
}

export interface SkillGraph {
  userId: string;
  categories: Record<string, ConceptMasterySnapshot[]>;
  strengths: ConceptMasterySnapshot[];
  weaknesses: ConceptMasterySnapshot[];
  overallMastery: number | null;
  totalConceptsTracked: number;
}

export class SkillGraphService {
  async getSkillGraph(userId: string): Promise<SkillGraph> {
    const [concepts, masteries] = await Promise.all([
      prisma.concept.findMany({
        orderBy: [{ category: "asc" }, { name: "asc" }],
      }),
      prisma.conceptMastery.findMany({ where: { userId } }),
    ]);

    const masteryByConceptId = new Map(
      masteries.map((m) => [m.conceptId, m])
    );

    const snapshots: ConceptMasterySnapshot[] = concepts.map((concept) => {
      const mastery = masteryByConceptId.get(concept.id);

      return {
        conceptId: concept.id,
        slug: concept.slug,
        name: concept.name,
        category: concept.category,
        score: mastery ? mastery.score : null,
        confidence: mastery?.confidence ?? 0,
        sampleCount: mastery?.sampleCount ?? 0,
        lastDemonstratedAt: mastery?.lastDemonstratedAt ?? null,
      };
    });

    const categories: Record<string, ConceptMasterySnapshot[]> = {};

    for (const snapshot of snapshots) {
      (categories[snapshot.category] ??= []).push(snapshot);
    }

    const ranked = snapshots.filter(
      (s): s is ConceptMasterySnapshot & { score: number } =>
        s.score !== null &&
        s.confidence >= CONFIDENCE_THRESHOLD_FOR_RANKING
    );

    const strengths = [...ranked]
      .sort((a, b) => b.score - a.score)
      .slice(0, TOP_N);

    const weaknesses = [...ranked]
      .sort((a, b) => a.score - b.score)
      .slice(0, TOP_N);

    const weightedSum = masteries.reduce(
      (sum, m) => sum + m.score * m.confidence,
      0
    );

    const weightTotal = masteries.reduce(
      (sum, m) => sum + m.confidence,
      0
    );

    const overallMastery =
      weightTotal > 0 ? weightedSum / weightTotal : null;

    return {
      userId,
      categories,
      strengths,
      weaknesses,
      overallMastery,
      totalConceptsTracked: masteries.length,
    };
  }

  /**
   * Compute per-interview concept scores (0-100) from EvidenceItem.normalizedScore.
   * This is different from the dashboard's rolling mastery — this is interview-scoped,
   * computed fresh from this evaluation's EvidenceConcept rows, not from the decayed
   * rolling ConceptMastery table.
   */
  async getInterviewConceptScores(
    evaluationId: string
  ): Promise<Array<{ concept: string; score: number }>> {
    const evidenceItems = await prisma.evidenceItem.findMany({
      where: { evaluationId },
      include: {
        concepts: {
          include: {
            concept: true,
          },
        },
      },
    });

    const byConceptSlug = new Map<string, number[]>();

    for (const item of evidenceItems) {
      for (const link of item.concepts) {
        const scores = byConceptSlug.get(link.concept.slug) ?? [];
        scores.push(item.normalizedScore);
        byConceptSlug.set(link.concept.slug, scores);
      }
    }

    const result: Array<{ concept: string; score: number }> = [];

    for (const [conceptSlug, scores] of byConceptSlug.entries()) {
      const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      result.push({
        concept: conceptSlug,
        score: Math.round(avgScore * 100), // Convert 0-1 to 0-100
      });
    }

    return result;
  }
}