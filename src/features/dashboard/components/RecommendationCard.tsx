// src/features/dashboard/components/RecommendationCard.tsx

import Link from "next/link";
import Card from "@/shared/ui/Card";
import { Button } from "@/shared/ui/Button";
import { Sparkles, ArrowRight } from "lucide-react"; // Optional: Adding icons
import type { Recommendation } from "@/features/interview/application/services/recommendation/RecommendationService"
import type { Difficulty } from "@prisma/client";

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  EASY: "border-green-600/30 text-green-500 bg-green-500/10",
  MEDIUM: "border-amber-600/30 text-amber-500 bg-amber-500/10",
  HARD: "border-red-600/30 text-red-500 bg-red-500/10",
};

type Props = {
  recommendation: Recommendation | null;
};

export default function RecommendationCard({ recommendation }: Props) {
  // --- Empty State ---
  if (!recommendation) {
    return (
      <Card className="flex h-full flex-col items-center justify-center p-8 text-center border-dashed bg-muted/10">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Sparkles className="w-6 h-6 text-zinc-500" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">Personalized Insights</h3>
        <p className="mt-2 text-xs text-zinc-400 max-w-[200px] leading-relaxed">
          Complete a few interviews to unlock AI-driven recommendations.
        </p>
      </Card>
    );
  }

  // --- Active State ---
  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-950/50">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              AI Recommendation
            </span>
          </div>
          <span
            className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${
              DIFFICULTY_STYLES[recommendation.difficulty]
            }`}
          >
            {recommendation.difficulty}
          </span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-zinc-100">
          {recommendation.title}
        </h2>
      </div>

      {/* Content */}
      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <span className="block font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            Assessment logic
          </span>
          <ul className="space-y-2.5">
            {recommendation.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-400 leading-snug">
                <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Action */}
        <div className="flex items-center justify-end pt-2 border-t border-zinc-800/50">
          <Button size="sm" className="gap-2">
            <Link href={`/problems?problem=${recommendation.slug}`}>
              Practice with AI
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}