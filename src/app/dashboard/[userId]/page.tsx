// src/app/dashboard/[userId]/page.tsx
import { notFound } from "next/navigation";
import { InterviewStatus } from "@prisma/client";

import { prisma } from "@/shared/prisma/client";
import { SkillGraphService } from "@/src/modules/interview/services/mastery/SkillGraphService";
import { RecommendationService } from "@/src/modules/interview/services/recommendation/RecommendationService";
import DashboardView from "@/src/features/dashboard/components/DashboardView";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return notFound();

  const skillGraphService = new SkillGraphService();
  const recommendationService = new RecommendationService();

  const [skillGraph, recommendation, completedInterviews, exploreProblems] =
    await Promise.all([
      skillGraphService.getSkillGraph(userId),
      recommendationService.nextRecommended(userId),
      prisma.interview.findMany({
        where: { userId, status: InterviewStatus.COMPLETED },
        include: { template: true, evaluation: true },
        orderBy: { completedAt: "desc" },
      }),
      prisma.problem.findMany({
        orderBy: { interviewCount: "desc" },
        take: 4,
      }),
    ]);

  // Group completed-interview scores by template slug (hld / lld / dsa) so
  // we can show a 0-5 star rating per interview type, same idea as the
  // per-concept mastery bars but at the template level.
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
      ), // 0-100 score -> 0-5 stars
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
      hasData={hasData}
      overallReadiness={overallReadiness}
      categoryRatings={categoryRatings}
      skillGraph={skillGraph}
      recommendation={recommendation}
      exploreProblems={exploreProblems.map((problem) => ({
        id: problem.id,
        title: problem.title,
        difficulty: problem.difficulty,
        description: problem.description,
      }))}
    />
  );
}