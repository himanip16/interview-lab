"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/src/components/ui/Card";
import Heading from "@/src/components/ui/Heading";
import Text from "@/src/components/ui/Text";

interface Recommendation {
  problemId: string;
  slug: string;
  title: string;
  difficulty: string;
  score: number;
  reasons: string[];
}

export default function SmartMentor() {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendation() {
      try {
        // For now, use a demo user ID. In production, this should come from auth
        const response = await fetch('/api/users/demo-user/recommendations?limit=1');
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
  }, []);

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
          Smart Recommendation
        </Heading>
        <Text variant="muted">What should I practice next?</Text>
      </div>

      <Card rounded="xl" padding="8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Text variant="muted">Loading recommendations...</Text>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <Text variant="muted">{error}</Text>
          </div>
        ) : recommendation ? (
          <>
            <div className="flex items-start justify-between mb-6">
              <div>
                <Heading level="h3" className="mb-2">
                  {recommendation.title}
                </Heading>
                <Text variant="small">
                  Based on your skill graph
                </Text>
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-mono rounded-full border border-primary/20">
                {getDifficultyLabel(recommendation.difficulty)} • {getDuration(recommendation.difficulty)}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {recommendation.reasons.map((reason, index) => (
                <span key={index} className="px-3 py-1 bg-muted text-foreground text-sm rounded-lg">
                  {reason}
                </span>
              ))}
            </div>

            <Link
              href={`/interview/setup?problemId=${recommendation.problemId}`}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Start Practice
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </>
        ) : (
          <div className="flex items-center justify-center py-12">
            <Text variant="muted">No recommendations available. Complete some interviews to get personalized suggestions!</Text>
          </div>
        )}
      </Card>
    </section>
  );
}
