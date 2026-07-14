"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

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
  userId?: string | null;
};

export default function ProblemSelector({
  value,
  onChange,
  userId,
}: Props) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchProblems() {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (userId) params.append("userId", userId);

      const response = await fetch(
        `/api/problems${params.toString() ? `?${params.toString()}` : ""}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch problems: ${response.statusText}`);
      }
      
      const data = await response.json();
      setProblems(data.problems || []);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch problems";
      setError(errorMessage);
      console.error("Failed to fetch problems:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProblems();
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">Loading problems...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-800 bg-red-500/10 p-4">
        <p className="text-sm text-red-400">{error}</p>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchProblems();
          }}
          className="mt-2 text-sm text-red-400 underline hover:text-red-300"
        >
          Try again
        </button>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">No problems available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {problems.map((problem) => (
        // In ProblemSelector.tsx
<Button
  key={problem.id}
  type="button"
  variant={value === problem.id ? "primary" : "ghost"}
  aria-pressed={value === problem.id}
  onClick={() => {
    console.log("1. Button clicked, problemId:", problem.id);
    onChange(problem.id);
  }}
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
  );
}
