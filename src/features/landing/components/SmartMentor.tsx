// src/features/landing/components/SmartMentor.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/shared/ui/Card";
import Heading from "@/shared/ui/Heading";
import Text from "@/shared/ui/Text";
import { Button } from "@/shared/ui/Button";
import { useRouter } from "next/navigation";

interface Recommendation {
  problemId: string;
  slug: string;
  title: string;
  difficulty: string;
  score: number;
  reasons: string[];
}

export default function SmartMentor() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendation() {
      try {
        const response = await fetch('/api/recommendations?limit=1');

        // No session at all — this person has never registered, or their
        // session expired. Send them straight to registration rather than
        // showing a dead-end card that links to a login form they can't
        // use yet.
        if (response.status === 401) {
          router.replace("/register");
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const data = await response.json();
        if (data.recommendations && data.recommendations.length > 0) {
          setRecommendation(data.recommendations[0]);
        }
      } catch (err) {
        console.error('Error fetching recommendation:', err);
        setError('Unable to load recommendations');
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendation();
  }, [router]);

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'Easy';
      case 'MEDIUM': return 'Medium';
      case 'HARD': return 'Hard';
      default: return difficulty;
    }
  };

  const getDuration = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return '30 min';
      case 'MEDIUM': return '45 min';
      case 'HARD': return '60 min';
      default: return '45 min';
    }
  };

  return (
    <section className="py-20">
      <div className="mb-6">
        <Heading level="h2" className="mb-2">
          Personalized Interview Recommendation
        </Heading>
        <Text variant="muted">What should I practice next?</Text>
      </div>

      <Card className="rounded-xl p-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Text variant="muted">Loading recommendations...</Text>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <Text variant="muted">{error}</Text>
          </div>
        ) : recommendation ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-foreground">
                  {recommendation.title}
                </h3>
                <div className="mt-2 flex items-center gap-3">
                  <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
                    {getDifficultyLabel(recommendation.difficulty)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {getDuration(recommendation.difficulty)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Why this interview?</p>
              <ul className="space-y-1 text-sm text-foreground">
                {recommendation.reasons.map((reason, i) => (
                  <li key={i}>• {reason}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end pt-4">
              <Link
                href={`/problems?problem=${recommendation.slug}`}
              >
                <Button size="lg">
                  Practice with AI
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <Text variant="muted">No recommendations available. Complete some interviews to get personalized suggestions!</Text>
          </div>
        )}
      </Card>
    </section>
  );
}

