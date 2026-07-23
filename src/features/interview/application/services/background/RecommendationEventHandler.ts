// src/features/interview/application/services/background/RecommendationEventHandler.ts

import { DomainEvent, TurnCompletedEventData, InterviewCompletedEventData } from "@/features/interview/domain/InterviewAggregate";
import { InterviewRepository } from "@/features/interview/infrastructure/repositories/InterviewRepository";
import { SessionContext } from "@/features/interview/application/context/SessionContext";
import { InterviewProfileService } from "@/features/interview/data/profiles/InterviewProfileService";
import { prisma } from "shared/prisma/client";

/**
 * RecommendationEventHandler
 * 
 * Refreshes the "Next Best Problem" for the user based on interview performance.
 * Triggered by INTERVIEW_COMPLETED events.
 * 
 * This is non-critical derived data that can be recalculated if lost.
 */
export class RecommendationEventHandler {
  private readonly repository = new InterviewRepository();
  private readonly profileService = new InterviewProfileService();

  async handleInterviewCompleted(event: DomainEvent): Promise<void> {
    const data = event.data as InterviewCompletedEventData;
    
    await this.refreshRecommendations(event.aggregateId);
  }

  private async refreshRecommendations(interviewId: string): Promise<void> {
    try {
      // Load session context
      const context = await SessionContext.forBackground({
        interviewId,
        repository: this.repository,
        profileService: this.profileService,
      });

      // Get evaluation to identify weak areas
      const interview = await this.repository.getById(interviewId);
      if (!interview || !interview.evaluation) {
        console.warn(`[RecommendationEventHandler] No evaluation found for interview ${interviewId}`);
        return;
      }

      const evaluation = interview.evaluation;
      const dimensionScores = evaluation.dimensionScores as any;

      // Identify weak dimensions (scores < 0.6)
      const weakDimensions = Object.entries(dimensionScores || {})
        .filter(([_, score]: [string, any]) => score.score < 0.6)
        .map(([dimension, _]: [string, any]) => dimension);

      // Get concepts that need improvement
      const weakConcepts = await this.getWeakConcepts(context.user.id, weakDimensions);

      // Find problems that target weak concepts
      const recommendedProblems = await this.findProblemsForConcepts(weakConcepts, context.problem.id);

      // Create or update practice recommendation
      await this.upsertRecommendation(context.user.id, recommendedProblems, weakDimensions);

      console.log(`[RecommendationEventHandler] Recommendations refreshed for interview ${interviewId}`);
    } catch (error) {
      console.error(`[RecommendationEventHandler] Failed to refresh recommendations for interview ${interviewId}:`, error);
      // Don't throw - this is non-critical work
    }
  }

  private async getWeakConcepts(userId: string, weakDimensions: string[]): Promise<string[]> {
    // Get concepts with low mastery scores
    const weakMasteries = await prisma.conceptMastery.findMany({
      where: {
        userId,
        score: {
          lt: 0.5,
        },
      },
      include: {
        concept: true,
      },
    });

    return weakMasteries.map(m => m.concept.id);
  }

  private async findProblemsForConcepts(
    conceptIds: string[],
    excludeProblemId: string
  ): Promise<Array<{ problemId: string; reason: string }>> {
    if (conceptIds.length === 0) {
      return [];
    }

    // Find problems that target the weak concepts
    const problemConcepts = await prisma.problemConcept.findMany({
      where: {
        conceptId: {
          in: conceptIds,
        },
      },
      include: {
        problem: true,
      },
    });

    // Group by problem and calculate relevance score
    const problemScores = new Map<string, { score: number; problem: any }>();

    for (const pc of problemConcepts) {
      if (pc.problemId === excludeProblemId) continue;

      const existing = problemScores.get(pc.problemId);
      const weight = pc.weight || 1.0;

      if (existing) {
        existing.score += weight;
      } else {
        problemScores.set(pc.problemId, {
          score: weight,
          problem: pc.problem,
        });
      }
    }

    // Sort by score and take top 5
    const sorted = Array.from(problemScores.entries())
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 5);

    return sorted.map(([problemId, data]) => ({
      problemId,
      reason: `Targets concepts you need to improve on (relevance: ${data.score.toFixed(1)})`,
    }));
  }

  private async upsertRecommendation(
    userId: string,
    recommendedProblems: Array<{ problemId: string; reason: string }>,
    weakDimensions: string[]
  ): Promise<void> {
    // Delete old recommendations
    await prisma.practiceRecommendation.deleteMany({
      where: { userId },
    });

    // Create new recommendation
    const recommendation = await prisma.practiceRecommendation.create({
      data: {
        userId,
        reason: weakDimensions.length > 0
          ? `Based on recent interview, focus on improving: ${weakDimensions.join(", ")}`
          : "Continue practicing to maintain your skills",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Add recommendation items
    for (let i = 0; i < recommendedProblems.length; i++) {
      const { problemId, reason } = recommendedProblems[i];
      
      await prisma.practiceRecommendationItem.create({
        data: {
          recommendationId: recommendation.id,
          activityId: problemId, // Using problemId as activityId for now
          rank: i + 1,
          reason,
        },
      });
    }
  }
}
