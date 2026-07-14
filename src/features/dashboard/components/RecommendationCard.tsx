// src/features/dashboard/components/RecommendationCard.tsx
import Link from "next/link";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import type { Recommendation } from "@/modules/interview/services/recommendation/RecommendationService";
import type { Difficulty } from "@prisma/client";

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  EASY: "border-green-600 text-green-500",
  MEDIUM: "border-amber-600 text-amber-500",
  HARD: "border-red-600 text-red-500",
};

type Props = {
  recommendation: Recommendation | null;
};

export default function RecommendationCard({ recommendation }: Props) {
  if (!recommendation) {
    return (
      <Card className="p-6">
        <Text variant="muted">
          Complete a few interviews to unlock personalized
          recommendations.
        </Text>
      </Card>
    );
  }

  return (
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
            href={`/interview/setup?problemId=${recommendation.problemId}&type=${recommendation.slug}`}
          >
            <Button variant="primary" className="text-sm">
              Start Interview →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
