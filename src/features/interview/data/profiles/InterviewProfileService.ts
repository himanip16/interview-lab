import { prisma } from "@/shared/prisma/client";

import {
  InterviewPhaseDefinition,
  InterviewProfile,
  GoalDefinition,
  InterviewProfileMetadata,
} from "./InterviewProfile";
import { Goal } from "../constants";

// Cache entry with timestamp for TTL
interface CacheEntry {
  profile: InterviewProfile;
  timestamp: number;
}

/**
 * Resolves an InterviewProfile from the database instead of a hardcoded
 * switch statement. Adding a new interview type (DSA, Behavioral,
 * Concurrency, ...) means inserting InterviewTemplate + InterviewPhaseTemplate
 * rows (see prisma/seed.ts) — this class never needs to change.
 *
 * Replaces: InterviewProfileResolver.ts, HLDInterviewProfile.ts, LLDInterviewProfile.ts
 */
export class InterviewProfileService {
  // Small in-memory cache with TTL: templates change rarely, and every interview
  // message currently re-resolves the profile. TTL of 5 minutes ensures stale data
  // is refreshed while still providing performance benefits.
  private readonly cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 100; // Prevent unbounded growth

  async resolveByTemplateId(
    templateId: string
  ): Promise<InterviewProfile> {
    // Clean up expired entries periodically
    this.cleanupExpiredEntries();

    const cached = this.cache.get(templateId);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.profile;
    }

    const template =
      await prisma.interviewTemplate.findUnique({
        where: { id: templateId },
        include: {
          phases: {
            orderBy: { order: "asc" },
          },
        },
      });

    if (!template) {
      throw new Error(
        `Interview template "${templateId}" was not found.`
      );
    }

    if (template.phases.length === 0) {
      throw new Error(
        `Interview template "${template.slug}" has no phases configured.`
      );
    }

    const profile: InterviewProfile = {
      type: template.slug,
      metadata: {
        difficulty: "Medium",
        estimatedQuestions: 10,
        maxRetries: 3,
        allowBacktracking: true,
        supportsInterruptions: true,
      },
      phases: template.phases.map(
        (phase): InterviewPhaseDefinition => ({
          id: phase.phaseKey as any,
          goals: (phase.goals as string[]).map((goalId) => ({
            id: Goal[goalId as keyof typeof Goal] || goalId as Goal,
            required: true,
            weight: 1,
          })),
          evaluationDimensions:
            phase.evaluationDimensions as any,
          continuousEvaluation: [],
          phaseEvaluation: phase.evaluationDimensions as any,
          targetDurationRatio:
            phase.targetDurationRatio,
          transitionThreshold:
            phase.transitionThreshold,
          prompt: {
            objective: phase.instructions,
          },
          showWhiteboard: phase.showWhiteboard,
        })
      ),
    };

    // Enforce cache size limit by removing oldest entries if needed
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(templateId, {
      profile,
      timestamp: Date.now(),
    });

    return profile;
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= this.CACHE_TTL_MS) {
        this.cache.delete(key);
      }
    }
  }

  async resolveBySlug(
    slug: string
  ): Promise<InterviewProfile> {
    const template =
      await prisma.interviewTemplate.findUnique({
        where: { slug },
      });

    if (!template) {
      throw new Error(
        `Interview template "${slug}" was not found.`
      );
    }

    return this.resolveByTemplateId(template.id);
  }

  /** All active templates, for populating setup UIs. */
  async listActive() {
    return prisma.interviewTemplate.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  clearCache(): void {
    this.cache.clear();
  }
}