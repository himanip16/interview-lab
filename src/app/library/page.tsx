// src/app/library/page.tsx

import { InterviewStatus } from "@prisma/client";

import { prisma } from "@/shared/prisma/client";
import { getCurrentUserId } from "@/features/auth/getCurrentUserId";
import LibraryView from "@/features/library/components/LibraryView";
import {
  type CompletedInterviewItem,
  type ExperienceItem,
  type DimensionScore,
  type EvidenceEntry,
  type EvaluationMetadata,
} from "@/features/library/types";

const EXPERIENCE_LIMIT = 30;

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

function formatDisplayDate(date: Date): string {
  return dateFormatter.format(date);
}

export default async function LibraryPage() {
  const userId = await getCurrentUserId();

  const [experiencesRaw, interviewsRaw] = await Promise.all([
    prisma.interviewExperience.findMany({
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
          },
        },
        company: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: EXPERIENCE_LIMIT,
    }),

    prisma.interview.findMany({
      where: {
        userId,
        status: InterviewStatus.COMPLETED,
      },

      include: {
        problem: {
          select: {
            title: true,
          },
        },

        template: {
          select: {
            name: true,
          },
        },

        evaluation: true,

        transcript: {
          orderBy: {
            createdAt: "asc",
          },

          select: {
            id: true,
            role: true,
            content: true,
            elapsedSeconds: true,
          },
        },
      },

      // completedAt is currently nullable.
      // updatedAt is always refreshed when the interview finishes.
      orderBy: [
        { completedAt: { sort: "desc", nulls: "last" } },
        { updatedAt: "desc" },
      ],
    }),
  ]);

  const experiences: ExperienceItem[] = experiencesRaw.map((exp) => ({
    id: exp.id,
    role: exp.role,
    level: exp.level,
    year: exp.year,
    source: exp.source,
    url: exp.url,
    notes: exp.notes,
    problem: exp.problem,
    company: exp.company,
  }));

  const completedInterviews: CompletedInterviewItem[] = interviewsRaw.map(
    (interview) => {
      const metadata =
        (interview.evaluation?.metadata as EvaluationMetadata | null) ?? {};

      return {
        id: interview.id,
        mode: interview.mode,
        difficulty: interview.difficulty,
        duration: interview.duration,
        company: interview.company,

        displayDate: formatDisplayDate(
          interview.completedAt ?? interview.updatedAt
        ),

        problem: interview.problem,
        template: interview.template,
        transcript: interview.transcript,

        evaluation: interview.evaluation
          ? {
              overallScore: interview.evaluation.overallScore,
              feedback: interview.evaluation.feedback,

              dimensionScores:
                (interview.evaluation.dimensionScores as unknown as DimensionScore[]) ??
                [],

              evidence:
                (interview.evaluation.evidence as unknown as EvidenceEntry[]) ??
                [],

              metadata,
            }
          : null,
      };
    }
  );

  return (
    <LibraryView
      experiences={experiences}
      completedInterviews={completedInterviews}
    />
  );
}