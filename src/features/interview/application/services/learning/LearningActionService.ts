// src/features/interview/application/services/learning/LearningActionService.ts

// src/modules/interview/services/learning/LearningActionService.ts
import { prisma } from "shared/prisma/client";

const MIN_CONFIDENCE_TO_TARGET = 0.35; // ignore concepts with too little evidence to trust the gap
const CANDIDATE_CONCEPT_LIMIT = 5; // how many of the user's weakest concepts we search segments for

export interface NextLearningAction {
  actionId: string;
  type: string;
  prompt: string;
  reflection: string;
  payload: unknown;
  segment: {
    id: string;
    title: string;
    dialogue: unknown;
  };
  scenario: {
    id: string;
    title: string;
  };
  targetConcept: {
    slug: string;
    name: string;
  };
}

export class LearningActionService {
  /**
   * Finds the next Learning Action for a user: rank their weakest
   * confidently-assessed concepts, find a ScenarioSegment tagged with one of
   * them, and return whichever of its LearningActions the user hasn't
   * attempted yet (or, if all attempted, the least recently attempted one).
   */
  async nextActionForUser(userId: string): Promise<NextLearningAction | null> {
    const weakConcepts = await prisma.conceptMastery.findMany({
      where: { userId, confidence: { gte: MIN_CONFIDENCE_TO_TARGET } },
      orderBy: { score: "asc" },
      take: CANDIDATE_CONCEPT_LIMIT,
      select: { conceptId: true, concept: { select: { slug: true, name: true } } },
    });

    if (weakConcepts.length === 0) {
      return null; // not enough evidence yet — caller should fall back to a default/intro scenario
    }

    for (const weak of weakConcepts) {
      const segment = await prisma.learningSegment.findFirst({
        where: {
          scenario: { isActive: true },
          concepts: { some: { conceptId: weak.conceptId } },
        },
        orderBy: {
          concepts: { _count: "desc" }, // prefer segments richly tagged with this concept
        },
        include: {
          scenario: { select: { id: true, title: true } },
          actions: {
            where: { isActive: true },
            orderBy: { createdAt: "asc" },
            include: {
              attempts: {
                where: { userId },
                orderBy: { startedAt: "desc" },
                take: 1,
              },
            },
          },
        },
      });

      if (!segment || segment.actions.length === 0) continue;

      const unattempted = segment.actions.find((a) => a.attempts.length === 0);
      const chosen = unattempted ?? segment.actions[0];

      return {
        actionId: chosen.id,
        type: chosen.type,
        prompt: chosen.instructions ?? "",
        reflection: JSON.stringify(chosen.content),
        payload: chosen.content,
        segment: {
          id: segment.id,
          title: segment.takeaway ?? `Segment ${segment.order}`,
          dialogue: segment.conversation,
        },
        scenario: segment.scenario,
        targetConcept: weak.concept,
      };
    }

    return null; // no authored content yet covers any of this user's weak concepts
  }

  async recordAttempt(params: {
    userId: string;
    actionId: string;
    response: unknown;
    score?: number;
    feedback?: string;
  }) {
    return prisma.userLearningAttempt.create({
      data: {
        userId: params.userId,
        actionId: params.actionId,
        response: params.response as object,
        status: "COMPLETED",
        score: params.score,
        feedback: params.feedback,
      },
    });
  }
}