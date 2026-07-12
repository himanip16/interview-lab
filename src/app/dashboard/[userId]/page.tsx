import { notFound } from "next/navigation";

import { prisma } from "@/shared/prisma/client";
import { SkillGraphService } from "@/src/modules/interview/services/mastery/SkillGraphService";
import { RecommendationService } from "@/src/modules/interview/services/recommendation/RecommendationService";
import SkillGraphView from "@/src/features/dashboard/components/SkillGraphView";
import NextRecommendedInterview from "@/src/features/dashboard/components/NextRecommendedInterview";

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function DashboardPage({ params }: Props) {
  const { userId } = await params;

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return notFound();

  const skillGraphService = new SkillGraphService();
  const recommendationService = new RecommendationService();

  const [skillGraph, recommendation] = await Promise.all([
    skillGraphService.getSkillGraph(userId),
    recommendationService.nextRecommended(userId),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-foreground">
      <h1 className="text-4xl font-bold text-white">Your Dashboard</h1>

      <div className="mt-8">
        <NextRecommendedInterview recommendation={recommendation} />
      </div>

      <div className="mt-8">
        <SkillGraphView skillGraph={skillGraph} />
      </div>
    </main>
  );
}