import { prisma } from "@/shared/prisma/client";

import {
  InterviewPhaseDefinition,
  InterviewProfile,
} from "./InterviewProfile";

/**
 * Resolves an InterviewProfile from the database instead of a hardcoded
 * switch statement. Adding a new interview type (DSA, Behavioral,
 * Concurrency, ...) means inserting InterviewTemplate + InterviewPhaseTemplate
 * rows (see prisma/seed.ts) — this class never needs to change.
 *
 * Replaces: InterviewProfileResolver.ts, HLDInterviewProfile.ts, LLDInterviewProfile.ts
 */
export class InterviewProfileService {
  // Small in-memory cache: templates change rarely, and every interview
  // message currently re-resolves the profile.
  private readonly cache = new Map<string, InterviewProfile>();

  async resolveByTemplateId(
    templateId: string
  ): Promise<InterviewProfile> {
    const cached = this.cache.get(templateId);

    if (cached) {
      return cached;
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

      phases: template.phases.map(
        (phase): InterviewPhaseDefinition => ({
          id: phase.phaseKey,
          goals: phase.goals as string[],
          evaluationDimensions:
            phase.evaluationDimensions as string[],
          targetDurationRatio:
            phase.targetDurationRatio,
          transitionThreshold:
            phase.transitionThreshold,
          instructions: phase.instructions,
          showWhiteboard: phase.showWhiteboard,
        })
      ),
    };

    this.cache.set(templateId, profile);

    return profile;
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