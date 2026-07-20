// src/app/dashboard/[userId]/page.tsx
import { notFound } from "next/navigation";
import { InterviewStatus } from "@prisma/client";

import { prisma } from "@/shared/prisma/client";
import { SkillGraphService } from "@/features/interview/mastery/SkillGraphService";
import { RecommendationService } from "@/features/interview/recommendation/RecommendationService";
import DashboardView from "@/features/dashboard/components/DashboardView";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return notFound();

  // Fetch base data
  const [completedInterviews, exploreProblems] = await Promise.all([
    prisma.interview.findMany({
      where: { userId, status: InterviewStatus.COMPLETED },
      include: { template: true, evaluation: true },
      orderBy: [
        { completedAt: { sort: "desc", nulls: "last" } },
        { updatedAt: "desc" },
      ],
    }),
    prisma.problem.findMany({
      orderBy: { interviewCount: "desc" },
      take: 4,
    }),
  ]);

  const scoresByTemplate: Record<string, number[]> = {};
  for (const interview of completedInterviews) {
    if (!interview.evaluation) continue;
    const slug = interview.template.slug;
    (scoresByTemplate[slug] ??= []).push(interview.evaluation.overallScore);
  }

  const categoryRatings = Object.fromEntries(
    Object.entries(scoresByTemplate).map(([slug, scores]) => [
      slug,
      Math.round(
        (scores.reduce((sum, score) => sum + score, 0) / scores.length) / 20
      ),
    ])
  );

  const hasData = completedInterviews.length > 0;
  const overallReadiness = hasData
    ? Math.round(
        completedInterviews.reduce(
          (sum, interview) => sum + (interview.evaluation?.overallScore ?? 0),
          0
        ) / completedInterviews.length
      )
    : null;

  return (
    <DashboardView
      userId={userId}
      hasData={hasData}
      overallReadiness={overallReadiness}
      categoryRatings={categoryRatings}
      exploreProblems={exploreProblems.map((problem) => ({
        id: problem.id,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        description: problem.description,
      }))}
    />
  );
}