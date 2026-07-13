import { InterviewStatus } from "@prisma/client";

import { prisma } from "@/shared/prisma/client";
import { getCurrentUserId } from "@/src/modules/auth/getCurrentUserId";
import LibraryView, {
  type CompletedInterviewItem,
  type ExperienceItem,
} from "@/src/features/library/components/LibraryView";

type DimensionScore = {
  dimension: string;
  score: number;
  summary: string;
};

type EvidenceEntry = {
  dimension: string;
  timestampSeconds: number;
  quote: string;
  comment: string;
};

type EvaluationMetadata = {
  strengths?: string[];
  weaknesses?: string[];
};

function formatDisplayDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default async function LibraryPage() {
  const userId = await getCurrentUserId();

  const [experiencesRaw, interviewsRaw] = await Promise.all([
    prisma.interviewExperience.findMany({
      include: {
        problem: {
          select: { id: true, title: true, description: true, difficulty: true },
        },
        company: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    userId
      ? prisma.interview.findMany({
          where: { userId, status: InterviewStatus.COMPLETED },
          include: {
            problem: { select: { title: true } },
            template: { select: { name: true } },
            evaluation: true,
            transcript: {
              orderBy: { createdAt: "asc" },
              select: { id: true, role: true, content: true, elapsedSeconds: true },
            },
          },
          // `completedAt` isn't currently set when an interview finishes, so
          // order by `updatedAt` (which the finish flow does update) instead.
          orderBy: { updatedAt: "desc" },
        })
      : Promise.resolve([]),
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
      const metadata = (interview.evaluation?.metadata ??
        {}) as EvaluationMetadata;

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