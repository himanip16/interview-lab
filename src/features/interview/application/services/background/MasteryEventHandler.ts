import { DomainEvent, TurnCompletedEventData } from "@/features/interview/domain/InterviewAggregate";
import { InterviewRepository } from "@/features/interview/infrastructure/repositories/InterviewRepository";
import { SessionContext } from "@/features/interview/application/context/SessionContext";
import { InterviewProfileService } from "@/features/interview/data/profiles/InterviewProfileService";
import { prisma } from "@/shared/prisma/client";

/**
 * MasteryEventHandler
 * 
 * Updates the skill graph and concept mastery based on interview performance.
 * Triggered by TURN_COMPLETED events.
 * 
 * This is non-critical derived data that can be recomputed if lost.
 */
export class MasteryEventHandler {
  private readonly repository = new InterviewRepository();
  private readonly profileService = new InterviewProfileService();

  async handleTurnCompleted(event: DomainEvent): Promise<void> {
    const data = event.data as TurnCompletedEventData;
    
    // Only update mastery on phase completion or interview completion
    if (!data.transitioned && !data.completed) {
      return;
    }

    await this.updateMastery(event.aggregateId);
  }

  private async updateMastery(interviewId: string): Promise<void> {
    try {
      // Load session context
      const context = await SessionContext.forBackground({
        interviewId,
        repository: this.repository,
        profileService: this.profileService,
      });

      // Get evaluation if available
      const interview = await this.repository.getById(interviewId);
      if (!interview || !interview.evaluation) {
        console.warn(`[MasteryEventHandler] No evaluation found for interview ${interviewId}`);
        return;
      }

      const evaluation = interview.evaluation;
      
      // Extract evidence from evaluation
      const evidence = evaluation.evidence as any;
      if (!evidence || !Array.isArray(evidence)) {
        console.warn(`[MasteryEventHandler] No evidence found in evaluation for interview ${interviewId}`);
        return;
      }

      // Update concept mastery for each evidence item
      for (const evidenceItem of evidence) {
        await this.updateConceptMastery(
          context.user.id,
          evidenceItem
        );
      }

      console.log(`[MasteryEventHandler] Mastery updated for interview ${interviewId}`);
    } catch (error) {
      console.error(`[MasteryEventHandler] Failed to update mastery for interview ${interviewId}:`, error);
      // Don't throw - this is non-critical work
    }
  }

  private async updateConceptMastery(
    userId: string,
    evidenceItem: any
  ): Promise<void> {
    // Extract concepts from evidence item
    const concepts = evidenceItem.concepts || [];
    
    for (const conceptLink of concepts) {
      const conceptId = conceptLink.conceptId;
      const weight = conceptLink.weight || 1.0;
      const score = evidenceItem.normalizedScore || 0.5;

      // Update or create concept mastery
      const existing = await prisma.conceptMastery.findUnique({
        where: {
          userId_conceptId: {
            userId,
            conceptId,
          },
        },
      });

      if (existing) {
        // Rolling average with confidence weighting
        const newSampleCount = existing.sampleCount + 1;
        const newScore = (
          (existing.score * existing.sampleCount * existing.confidence) +
          (score * weight)
        ) / (newSampleCount * Math.max(existing.confidence, 0.5));
        
        const newConfidence = Math.min(
          existing.confidence + (1 - existing.confidence) * 0.1,
          0.95
        );

        await prisma.conceptMastery.update({
          where: {
            userId_conceptId: {
              userId,
              conceptId,
            },
          },
          data: {
            score: newScore,
            confidence: newConfidence,
            sampleCount: newSampleCount,
            lastDemonstratedAt: new Date(),
          },
        });
      } else {
        // Create new mastery record
        await prisma.conceptMastery.create({
          data: {
            userId,
            conceptId,
            score: score * weight,
            confidence: 0.3, // Low confidence for new records
            sampleCount: 1,
            lastDemonstratedAt: new Date(),
          },
        });
      }
    }
  }
}
