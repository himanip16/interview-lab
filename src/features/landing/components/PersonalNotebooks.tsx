"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/shared/ui/Card";
import Heading from "@/shared/ui/Heading";
import Text from "@/shared/ui/Text";

interface Problem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
}


export default function PersonalNotebooks() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const response = await fetch('/api/problems');
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        const data = await response.json();
        setProblems(data.problems || []);
      } catch (err) {
        console.error('Error fetching problems:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProblems();
  }, []);

  const getInterviewType = (category: string): string => {
    switch (category) {
      case 'SYSTEM_DESIGN':
      case 'DISTRIBUTED_SYSTEMS':
        return 'hld';
      case 'LOW_LEVEL_DESIGN':
        return 'lld';
      default:
        return 'dsa';
    }
  };

  const getReadTime = (difficulty: string): string => {
    switch (difficulty) {
      case 'EASY': return '15 min read';
      case 'MEDIUM': return '25 min read';
      case 'HARD': return '35 min read';
      default: return '25 min read';
    }
  };

  const getTypeLabel = (category: string): string => {
    switch (category) {
      case 'SYSTEM_DESIGN':
      case 'DISTRIBUTED_SYSTEMS':
        return 'HLD';
      case 'LOW_LEVEL_DESIGN':
        return 'LLD';
      default:
        return 'DSA';
    }
  };

  if (loading) {
    return (
      <section className="py-20">
        <div className="mb-6">
          <Heading level="h2" className="mb-2">
            System Design Library
          </Heading>
          <Text variant="muted">Master distributed system architectures</Text>
        </div>
        <div className="flex items-center justify-center py-12">
          <Text variant="muted">Loading problems...</Text>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="mb-6">
        <Heading level="h2" className="mb-2">
          System Design Library
        </Heading>
        <Text variant="muted">Master distributed system architectures</Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {problems.map((problem) => (
          <div
            key={problem.id}
            className="hover:border-border transition-colors group h-full"
          >
            <Card className="h-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-mono rounded-lg">
                  {getTypeLabel(problem.category)}
                </span>
              </div>
              <h3 className="text-card-foreground font-medium mb-2 group-hover:text-foreground transition-colors">
                {problem.title}
              </h3>
              <Text variant="small" className="mb-3 line-clamp-2">
                {problem.description}
              </Text>
              <div className="flex items-center justify-between">
                <Text variant="small">{getReadTime(problem.difficulty)}</Text>
                <Text variant="small" className="text-muted-foreground">Coming soon</Text>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
