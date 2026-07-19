import Link from "next/link";
import { Button } from "@/components/ui/Button";

import type { Recommendation } from "@/modules/interview/services/recommendation/RecommendationService";

type Props = {
  recommendation: Recommendation | null;
};

export default function NextRecommendedInterview({ recommendation }: Props) {
  if (!recommendation) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold">Next Recommended Interview</h2>

        <p className="mt-3 text-sm text-zinc-400">
          Complete a few interviews to unlock personalized recommendations.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-blue-900 bg-gradient-to-br from-zinc-900 to-blue-950 p-6">
      <p className="text-xs uppercase tracking-wide text-blue-400">
        Next Recommended Interview
      </p>

      <h2 className="mt-2 text-2xl font-bold">{recommendation.title}</h2>

      <span className="mt-1 inline-block text-sm capitalize text-zinc-400">
        {recommendation.difficulty.toLowerCase()}
      </span>

      <ul className="mt-4 space-y-1 text-sm text-zinc-300">
        {recommendation.reasons.map((reason, i) => (
          <li key={i}>• {reason}</li>
        ))}
      </ul>

      <div className="mt-6">
        <Link
          href={`/interview/problems?problem=${recommendation.slug}`}
        >
          <Button size="sm">
            Practice with AI
          </Button>
        </Link>
      </div>
    </div>
  );
}