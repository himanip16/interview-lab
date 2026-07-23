import { Difficulty, InterviewStatus } from "@prisma/client";

import { prisma } from "shared/prisma/client";

const RECENCY_REVIEW_DAYS = 21; // untouched this long -> due for spaced-repetition review
const RECENT_PRACTICE_PENALTY_DAYS = 3; // touched this recently -> deprioritize to encourage variety
const NOVELTY_PENALTY_WINDOW_DAYS = 14; // problems solved this recently -> deprioritized, not excluded
const NOVELTY_PENALTY_FACTOR = 0.35;
const TRANSFER_BOOST_WEIGHT = 0.15; // how much category-level strength nudges an untouched concept in that category
const EXPLORATION_PRIORITY = 0.55; // priority for concepts with zero data — enough to get sampled, not enough to drown out known weak spots
const MIN_CONFIDENCE_FOR_TRANSFER = 0.4;

const DIFFICULTY_ANCHOR: Record<Difficulty, number> = {
  EASY: 0.2,
  MEDIUM: 0.5,
  HARD: 0.8,
};

export interface Recommendation {
  problemId: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  score: number;
  reasons: string[];
}

type MasteryWithConcept = {
  conceptId: string;
  score: number;
  confidence: number;
  lastDemonstratedAt: Date | null;
  concept: { category: string };
};

export class RecommendationService {
  async recommend(userId: string, limit = 5): Promise<Recommendation[]> {
    const [problems, masteries, recentInterviews] = await Promise.all([
      prisma.problem.findMany({
        include: { concepts: { include: { concept: true } } },
      }),
      prisma.conceptMastery.findMany({
        where: { userId },
        include: { concept: { select: { category: true } } },
      }),
      prisma.interview.findMany({
        where: {
          userId,
          status: InterviewStatus.COMPLETED,
          completedAt: {
            gte: new Date(
              Date.now() -
                NOVELTY_PENALTY_WINDOW_DAYS * 24 * 60 * 60 * 1000
            ),
          },
        },
        select: { problemId: true },
      }),
    ]);

    const masteryByConceptId = new Map(
      masteries.map((m) => [m.conceptId, m])
    );

    const recentlySolvedProblemIds = new Set(
      recentInterviews.map((i) => i.problemId)
    );

    const overallMastery = this.computeOverallMastery(masteries);
    const categoryStrength = this.computeCategoryStrength(masteries);

    const scored: Recommendation[] = [];

    for (const problem of problems) {
      if (problem.concepts.length === 0) continue; // not yet tagged in ProblemConcept — nothing to score against

      let weightedPrioritySum = 0;
      let weightTotal = 0;
      const reasonCandidates: { text: string; priority: number }[] = [];

      for (const link of problem.concepts) {
        const mastery = masteryByConceptId.get(link.conceptId);

        const { priority, reason } = this.conceptPriority(
          link.concept.name,
          link.concept.category,
          mastery,
          categoryStrength
        );

        weightedPrioritySum += priority * link.weight;
        weightTotal += link.weight;

        if (reason) reasonCandidates.push({ text: reason, priority });
      }

      if (weightTotal === 0) continue;

      const conceptScore = weightedPrioritySum / weightTotal;
      const difficultyFit = this.difficultyFit(problem.difficulty, overallMastery);

      const noveltyFactor = recentlySolvedProblemIds.has(problem.id)
        ? NOVELTY_PENALTY_FACTOR
        : 1;

      const score = conceptScore * difficultyFit * noveltyFactor;

      const reasons = reasonCandidates
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 2)
        .map((r) => r.text);

      reasons.push(this.difficultyReason(problem.difficulty, overallMastery));

      scored.push({
        problemId: problem.id,
        slug: problem.slug,
        title: problem.title,
        difficulty: problem.difficulty,
        score,
        reasons,
      });
    }

    return scored.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  async nextRecommended(userId: string): Promise<Recommendation | null> {
    const [top] = await this.recommend(userId, 1);
    return top ?? null;
  }

  private conceptPriority(
    name: string,
    category: string,
    mastery: MasteryWithConcept | undefined,
    categoryStrength: Map<string, number>
  ): { priority: number; reason: string | null } {
    if (!mastery) {
      const transfer =
        (categoryStrength.get(category) ?? 0) * TRANSFER_BOOST_WEIGHT;

      return {
        priority: Math.min(EXPLORATION_PRIORITY + transfer, 1),
        reason: `New concept for you: ${name}`,
      };
    }

    const gap = 1 - mastery.score;

    // Confident gaps matter more than noisy ones, but even a low-confidence
    // gap keeps a floor so it still gets sampled instead of ignored.
    let priority = gap * (0.3 + 0.7 * mastery.confidence);

    let recencyNote: string | null = null;

    if (mastery.lastDemonstratedAt) {
      const daysSince =
        (Date.now() - mastery.lastDemonstratedAt.getTime()) /
        (1000 * 60 * 60 * 24);

      if (daysSince >= RECENCY_REVIEW_DAYS) {
        priority += 0.15;
        recencyNote = `Due for review: ${name}`;
      } else if (daysSince <= RECENT_PRACTICE_PENALTY_DAYS) {
        priority *= 0.6; // just practiced — favor variety over repetition
      }
    }

    priority = Math.min(Math.max(priority, 0), 1);

    let reason: string | null = recencyNote;

    if (!reason && gap >= 0.35 && mastery.confidence >= 0.4) {
      reason = `Strengthens a weak spot: ${name}`;
    }

    return { priority, reason };
  }

  private computeOverallMastery(
    masteries: { score: number; confidence: number }[]
  ): number {
    if (masteries.length === 0) return 0.4; // no data — bias toward EASY/MEDIUM until we know more

    const weightedSum = masteries.reduce(
      (s, m) => s + m.score * m.confidence,
      0
    );

    const weightTotal = masteries.reduce((s, m) => s + m.confidence, 0);

    return weightTotal > 0
      ? weightedSum / weightTotal
      : masteries.reduce((s, m) => s + m.score, 0) / masteries.length;
  }

  private computeCategoryStrength(
    masteries: MasteryWithConcept[]
  ): Map<string, number> {
    const sums = new Map<string, { weighted: number; weight: number }>();

    for (const m of masteries) {
      if (m.confidence < MIN_CONFIDENCE_FOR_TRANSFER) continue; // only confident data informs transfer boosts

      const entry = sums.get(m.concept.category) ?? {
        weighted: 0,
        weight: 0,
      };

      entry.weighted += m.score * m.confidence;
      entry.weight += m.confidence;

      sums.set(m.concept.category, entry);
    }

    const result = new Map<string, number>();

    for (const [category, { weighted, weight }] of sums) {
      result.set(category, weight > 0 ? weighted / weight : 0);
    }

    return result;
  }

  private difficultyFit(difficulty: Difficulty, overallMastery: number): number {
    // Aim slightly above current level — a stretch, not a repeat.
    const target = Math.min(Math.max(overallMastery + 0.1, 0.15), 0.85);
    const distance = Math.abs(DIFFICULTY_ANCHOR[difficulty] - target);

    return Math.max(1 - distance * 1.5, 0.1);
  }

  private difficultyReason(
    difficulty: Difficulty,
    overallMastery: number
  ): string {
    const target = Math.min(Math.max(overallMastery + 0.1, 0.15), 0.85);
    const anchor = DIFFICULTY_ANCHOR[difficulty];

    if (Math.abs(anchor - target) < 0.15) {
      return "A good stretch for your current level";
    }

    return anchor < target
      ? "A confidence-building warm-up"
      : "A reach — attempt when you have time to struggle with it";
  }
}