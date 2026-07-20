// src/features/dashboard/components/DashboardView.tsx
import Heading  from "@/shared/ui/Heading";
import { Suspense } from "react";

import CurrentStandingCard from "./CurrentStandingCard";
import LiveFeedbackCard from "./LiveFeedbackCard";
import RecommendationCard from "./RecommendationCard";
import ExploreProblems, { type ExploreProblem } from "./ExploreProblems";
import { SkillGraphService } from "@/features/interview/mastery/SkillGraphService";
import { RecommendationService } from "@/features/interview/recommendation/RecommendationService";

// Helper components to fetch their own data
async function SkillGraphWidget({ userId }: { userId: string }) {
  try {
    const service = new SkillGraphService();
    const skillGraph = await service.getSkillGraph(userId);
    return <LiveFeedbackCard hasData={true} skillGraph={skillGraph} />;
  } catch {
    return <div className="p-4 text-sm text-red-500">Failed to load skill graph.</div>;
  }
}

async function RecommendationWidget({ userId }: { userId: string }) {
  try {
    const service = new RecommendationService();
    const recommendation = await service.nextRecommended(userId);
    return <RecommendationCard recommendation={recommendation} />;
  } catch {
    return <div className="p-4 text-sm text-red-500">Failed to load recommendation.</div>;
  }
}

type Props = {
  userId: string;
  hasData: boolean;
  overallReadiness: number | null;
  categoryRatings: Record<string, number>;
  exploreProblems: ExploreProblem[];
};

export default function DashboardView({
  userId,
  hasData,
  overallReadiness,
  categoryRatings,
  exploreProblems,
}: Props) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-foreground">
      <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Active Session
          </span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Your Dashboard
          </h1>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              01. Current Standing
            </span>
            <Heading level="h3" className="mt-1">
              How am I doing?
            </Heading>
          </div>

          <CurrentStandingCard
            hasData={hasData}
            overallReadiness={overallReadiness}
            categoryRatings={categoryRatings}
          />
        </div>

        <div className="space-y-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              02. Live Feedback
            </span>
            <Heading level="h3" className="mt-1">
              What changed recently?
            </Heading>
          </div>
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            <SkillGraphWidget userId={userId} />
          </Suspense>
        </div>

        <div className="space-y-4 md:col-span-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              03. Smart Mentor Recommendation
            </span>
            <Heading level="h3" className="mt-1">
              What should I do next?
            </Heading>
          </div>
          <Suspense fallback={<div className="p-4">Loading...</div>}>
            <RecommendationWidget userId={userId} />
          </Suspense>
        </div>
      </div>

      <ExploreProblems exploreProblems={exploreProblems} />
    </main>
  );
}