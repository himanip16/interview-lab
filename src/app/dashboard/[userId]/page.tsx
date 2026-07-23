// src/app/dashboard/[userId]/page.tsx

import { notFound } from "next/navigation";
import { InterviewStatus } from "@prisma/client";
import { prisma } from "shared/prisma/client";
import DashboardView from "@/features/dashboard/components/DashboardView";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return notFound();

  const [completedInterviews, exploreProblems] = await Promise.all([
    prisma.interview.findMany({
      where: { userId, status: InterviewStatus.COMPLETED },
      include: { template: true, evaluation: true },
      orderBy: { updatedAt: "desc" },
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
    // Map various slug formats to standardized keys expected by CurrentStandingCard
    const normalizedSlug = slug === 'system-design' ? 'hld' : slug;
    (scoresByTemplate[normalizedSlug] ??= []).push(interview.evaluation.overallScore);
  }

  const categoryRatings = Object.fromEntries(
    Object.entries(scoresByTemplate).map(([slug, scores]) => [
      slug,
      Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) / 20)
    ])
  );

  return (
    <DashboardView
      userId={userId}
      hasData={completedInterviews.length > 0}
      overallReadiness={null} // Calculate if needed
      categoryRatings={categoryRatings}
      exploreProblems={exploreProblems.map(p => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        difficulty: p.difficulty,
        description: p.description
      }))}
    />
  );
}