// src/features/dashboard/components/DashboardView.tsx
import Link from "next/link";

import Card from "@/src/components/ui/Card";
import Heading from "@/src/components/ui/Heading";
import Text from "@/src/components/ui/Text";
import { Button } from "@/src/components/ui/Button";

import type { SkillGraph } from "@/src/modules/interview/services/mastery/SkillGraphService";
import type { Recommendation } from "@/src/modules/interview/services/recommendation/RecommendationService";
import type { Difficulty } from "@prisma/client";

export type ExploreProblem = {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string | null;
};

type Props = {
  hasData: boolean;
  overallReadiness: number | null;
  categoryRatings: Record<string, number>; // template slug ("hld" | "lld" | "dsa") -> 0-5 stars
  skillGraph: SkillGraph;
  recommendation: Recommendation | null;
  exploreProblems: ExploreProblem[];
};

const TEMPLATE_LABELS: Record<string, string> = {
  hld: "High-Level Design",
  lld: "Low-Level Design",
  dsa: "Data Structures & Algorithms",
};

function Stars({ rating }: { rating: number | undefined }) {
  if (!rating) {
    return (
      <span className="text-sm italic text-muted-foreground">
        Not assessed
      </span>
    );
  }

  return (
    <span className="font-mono text-lg tracking-wider text-amber-500">
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  EASY: "border-green-800 text-green-400",
  MEDIUM: "border-amber-800 text-amber-400",
  HARD: "border-red-800 text-red-400",
};

export default function DashboardView({
  hasData,
  overallReadiness,
  categoryRatings,
  skillGraph,
  recommendation,
  exploreProblems,
}: Props) {
  const strengthNames = skillGraph.strengths.slice(0, 3).map((s) => s.name);
  const weaknessNames = skillGraph.weaknesses.slice(0, 3).map((w) => w.name);

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

          <Card padding="6" className="space-y-6">
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <Text variant="small" className="font-medium">
                  Interview Readiness
                </Text>
                <span className="font-mono text-2xl font-bold text-foreground">
                  {hasData && overallReadiness !== null
                    ? `${overallReadiness}%`
                    : "—"}
                </span>
              </div>

              {hasData && overallReadiness !== null ? (
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-1000"
                    style={{ width: `${overallReadiness}%` }}
                  />
                </div>
              ) : (
                <Text variant="small" className="italic">
                  Not enough data yet. Complete an interview to calculate
                  readiness.
                </Text>
              )}
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              {Object.entries(TEMPLATE_LABELS).map(([slug, label]) => (
                <div key={slug} className="flex items-center justify-between">
                  <span className="font-mono text-sm text-muted-foreground">
                    {label}
                  </span>
                  <Stars rating={categoryRatings[slug]} />
                </div>
              ))}
            </div>
          </Card>
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

          <Card padding="6" className="flex h-[230px] flex-col justify-between">
            {hasData && (strengthNames.length > 0 || weaknessNames.length > 0) ? (
              <div className="grid h-full grid-cols-2 gap-4">
                <div className="space-y-3 overflow-y-auto border-r border-border pr-2">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-green-500">
                    Recently Improved
                  </span>
                  <ul className="space-y-1.5">
                    {strengthNames.length > 0 ? (
                      strengthNames.map((name, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1 text-xs leading-snug text-foreground"
                        >
                          <span className="mt-0.5 text-green-500">✓</span>
                          {name}
                        </li>
                      ))
                    ) : (
                      <li className="text-xs italic text-muted-foreground">
                        None yet
                      </li>
                    )}
                  </ul>
                </div>

                <div className="space-y-3 overflow-y-auto pl-2">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-amber-500">
                    Needs Attention
                  </span>
                  <ul className="space-y-1.5">
                    {weaknessNames.length > 0 ? (
                      weaknessNames.map((name, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-1 text-xs leading-snug text-foreground"
                        >
                          <span className="mt-0.5 text-amber-500">•</span>
                          {name}
                        </li>
                      ))
                    ) : (
                      <li className="text-xs italic text-muted-foreground">
                        None yet
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                <Text variant="small" className="italic">
                  Practice more problems to surface strengths and growth
                  areas.
                </Text>
              </div>
            )}
          </Card>
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

          {recommendation ? (
            <div className="overflow-hidden rounded-xl border border-primary/40 bg-card">
              <div className="flex items-center justify-between bg-primary/10 p-4">
                <div>
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Recommended Practice Session
                  </span>
                  <span className="text-base font-semibold text-foreground">
                    {recommendation.title}
                  </span>
                </div>

                <span
                  className={`rounded border px-2 py-0.5 font-mono text-xs ${DIFFICULTY_STYLES[recommendation.difficulty]}`}
                >
                  {recommendation.difficulty}
                </span>
              </div>

              <div className="space-y-4 p-6">
                <div className="space-y-1">
                  <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Mentor Assessment
                  </span>
                  <ul className="space-y-1 text-sm text-foreground">
                    {recommendation.reasons.map((reason, i) => (
                      <li key={i}>• {reason}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-end pt-2">
                  <Link
                    href={`/interview/setup?problemId=${recommendation.problemId}&type=hld`}
                  >
                    <Button variant="primary" className="text-sm">
                      Start Interview →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <Card padding="6">
              <Text variant="muted">
                Complete a few interviews to unlock personalized
                recommendations.
              </Text>
            </Card>
          )}
        </div>
      </div>

      {/* 04 — Explore more problems */}
      <div className="mt-12 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              04. Explore
            </span>
            <Heading level="h3" className="mt-1">
              More problems to try
            </Heading>
          </div>

          <Link
            href="/#interviews"
            className="font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            Browse all →
          </Link>
        </div>

        <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 pt-1">
          {exploreProblems.map((problem) => (
            <Link
              key={problem.id}
              href={`/interview/setup?problemId=${problem.id}&type=hld`}
              className="flex h-[140px] w-64 flex-shrink-0 flex-col justify-between rounded-lg border border-border bg-card p-5 transition hover:border-foreground/40"
            >
              <div>
                <span className="mb-1 block font-mono text-[10px] uppercase text-muted-foreground">
                  {problem.difficulty}
                </span>
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                  {problem.title}
                </h3>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-2 text-[10px] font-mono text-muted-foreground">
                <span className="line-clamp-1">
                  {problem.description ?? "System Design"}
                </span>
                <span className="flex-shrink-0 text-foreground">Start →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}