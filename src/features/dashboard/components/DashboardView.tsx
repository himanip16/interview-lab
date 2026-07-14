// src/features/dashboard/components/DashboardView.tsx
import Heading  from "@/components/ui/Heading";

import type { SkillGraph } from "@/modules/interview/services/mastery/SkillGraphService";
import type { Recommendation } from "@/modules/interview/services/recommendation/RecommendationService";

import CurrentStandingCard from "./CurrentStandingCard";
import LiveFeedbackCard from "./LiveFeedbackCard";
import RecommendationCard from "./RecommendationCard";
import ExploreProblems, { type ExploreProblem } from "./ExploreProblems";

type Props = {
  hasData: boolean;
  overallReadiness: number | null;
  categoryRatings: Record<string, number>; // template slug ("hld" | "lld" | "dsa") -> 0-5 stars
  skillGraph: SkillGraph;
  recommendation: Recommendation | null;
  exploreProblems: ExploreProblem[];
};

export default function DashboardView({
  hasData,
  overallReadiness,
  categoryRatings,
  skillGraph,
  recommendation,
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
        {/* 01 — Current standing */}
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

        {/* 02 — Live feedback */}
        <div className="space-y-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              02. Live Feedback
            </span>
            <Heading level="h3" className="mt-1">
              What changed recently?
            </Heading>
          </div>

          <LiveFeedbackCard hasData={hasData} skillGraph={skillGraph} />
        </div>

        {/* 03 — Smart mentor recommendation */}
        <div className="space-y-4 md:col-span-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              03. Smart Mentor Recommendation
            </span>
            <Heading level="h3" className="mt-1">
              What should I do next?
            </Heading>
          </div>

          <RecommendationCard recommendation={recommendation} />
        </div>
      </div>

      {/* 04 — Explore more problems */}
      <ExploreProblems exploreProblems={exploreProblems} />
    </main>
  );
}