"use client";

import { useEffect, useState, useRef } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  async function fetchProblems() {
    try {
      setError(null);
      
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();
      
      const params = new URLSearchParams();
      if (difficulty) params.append("difficulty", difficulty);
      if (company) params.append("company", company);

      const response = await fetch(
        `/api/problems${params.toString() ? `?${params.toString()}` : ""}`,
        { signal: abortControllerRef.current.signal }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch problems: ${response.statusText}`);
      }
      
      const data = await response.json();
      setProblems(data.problems || []);
    } catch (error) {
      // Ignore abort errors (from cancelled requests)
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch problems";
      setError(errorMessage);
      console.error("Failed to fetch problems:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProblems();
  }, [difficulty, company]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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

      {error && (
        <div className="mb-4 rounded-lg border border-red-800 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">
            {error}
          </p>
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
      )}

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