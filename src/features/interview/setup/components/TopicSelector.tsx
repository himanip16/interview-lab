"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/Button";

type Problem = {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  category: string;
};

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
  difficulty?: string;
  company?: string;
};

export default function TopicSelector({
  value,
  onChange,
  difficulty,
  company,
}: Props) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const params = new URLSearchParams();
        if (difficulty) params.append("difficulty", difficulty);
        if (company) params.append("company", company);

        const response = await fetch(
          `/api/problems${params.toString() ? `?${params.toString()}` : ""}`
        );
        const data = await response.json();
        setProblems(data.problems || []);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProblems();
  }, [difficulty, company]);

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="mb-3 font-semibold text-foreground">
          Select a Problem
        </h3>
        <p className="text-sm text-muted-foreground">Loading problems...</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="mb-3 font-semibold text-foreground">
        Select a Problem
      </h3>

      {problems.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No problems available for the selected filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {problems.map((problem) => (
            <Button
              key={problem.id}
              type="button"
              variant={value === problem.id ? "primary" : "outline"}
              aria-pressed={value === problem.id}
              onClick={() => onChange(problem.id)}
              className="h-auto w-full justify-start p-4 text-left"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{problem.title}</h4>
                  <span className="text-xs font-mono text-muted-foreground">
                    {problem.difficulty}
                  </span>
                </div>
                {problem.description && (
                  <p className="mt-1 text-sm opacity-80 line-clamp-2">
                    {problem.description}
                  </p>
                )}
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}