"use client";

import { useState, useEffect } from "react";
import { Difficulty, ProblemCategory } from "@prisma/client";
import { Button } from "@/src/components/ui/Button";

type Problem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: ProblemCategory;
  difficulty: Difficulty;
  interviewType: string;
  cruxOfProblem: string | null;
  estimatedMinutes: number | null;
  tags: string[];
};

type Props = {
  onSelectProblem?: (problemId: string) => void;
};

const INTERVIEW_TYPES = ["hld", "lld", "dsa"] as const;
const DIFFICULTIES = ["All", Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD] as const;

const CATEGORY_LABELS: Record<ProblemCategory, string> = {
  SYSTEM_DESIGN: "System Design",
  LOW_LEVEL_DESIGN: "Low Level Design",
  DATABASES: "Databases",
  BACKEND: "Backend",
  DISTRIBUTED_SYSTEMS: "Distributed Systems",
  JAVA: "Java",
  KAFKA: "Kafka",
  REDIS: "Redis",
  OPERATING_SYSTEMS: "Operating Systems",
  NETWORKING: "Networking",
};

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  EASY: "border-green-800 text-green-400",
  MEDIUM: "border-amber-800 text-amber-400",
  HARD: "border-red-800 text-red-400",
};

export default function ProblemInventoryView({ onSelectProblem }: Props) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<(typeof INTERVIEW_TYPES)[number]>("hld");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<(typeof DIFFICULTIES)[number]>("All");
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const response = await fetch("/api/problems");
        const data = await response.json();
        setProblems(data.problems || []);
      } catch (error) {
        console.error("Failed to fetch problems:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProblems();
  }, []);

  const categories = Array.from(
    new Set(problems.map((p) => p.category))
  ).sort();

  const filteredProblems = problems.filter((problem) => {
    if (problem.interviewType !== selectedType) return false;
    if (selectedCategory !== "All" && problem.category !== selectedCategory) return false;
    if (selectedDifficulty !== "All" && problem.difficulty !== selectedDifficulty) return false;
    return true;
  });

  function handleProblemClick(problem: Problem) {
    if (expandedProblem === problem.id) {
      setExpandedProblem(null);
    } else {
      setExpandedProblem(problem.id);
    }
  }

  function handleSelectProblem(problemId: string) {
    if (onSelectProblem) {
      onSelectProblem(problemId);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Loading problems...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Interview Type Tabs */}
      <div className="flex overflow-x-auto rounded-lg border border-border bg-muted p-1">
        {INTERVIEW_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => {
              setSelectedType(type);
              setExpandedProblem(null);
            }}
            className={`whitespace-nowrap rounded px-4 py-2 font-mono text-sm font-medium transition ${
              selectedType === type
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded border border-border bg-card px-3 py-1.5 text-sm text-foreground"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat as ProblemCategory] || cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Difficulty:</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as (typeof DIFFICULTIES)[number])}
            className="rounded border border-border bg-card px-3 py-1.5 text-sm text-foreground"
          >
            {DIFFICULTIES.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Problem Count */}
      <p className="text-sm text-muted-foreground">
        {filteredProblems.length} problem{filteredProblems.length !== 1 ? "s" : ""} found
      </p>

      {/* Problem List */}
      <div className="space-y-3">
        {filteredProblems.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-muted-foreground">No problems match your filters.</p>
          </div>
        ) : (
          filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className="overflow-hidden rounded-lg border border-border bg-card transition hover:border-foreground/40"
            >
              {/* Problem Row */}
              <button
                onClick={() => handleProblemClick(problem)}
                className="w-full px-4 py-3 text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-foreground">
                        {problem.title}
                      </span>
                      <span
                        className={`rounded border px-2 py-0.5 text-xs font-mono uppercase tracking-wider ${DIFFICULTY_COLORS[problem.difficulty]}`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>

                    {problem.cruxOfProblem && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {problem.cruxOfProblem}
                      </p>
                    )}

                    {problem.tags && problem.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {problem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {problem.estimatedMinutes && (
                      <span className="text-sm font-mono text-muted-foreground">
                        {problem.estimatedMinutes}min
                      </span>
                    )}
                    <span className="text-muted-foreground">
                      {expandedProblem === problem.id ? "▼" : "▶"}
                    </span>
                  </div>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedProblem === problem.id && (
                <div className="border-t border-border bg-muted p-4">
                  {problem.description && (
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-semibold text-foreground">
                        Description
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {problem.description}
                      </p>
                    </div>
                  )}

                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-semibold text-foreground">
                      Details
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Category:</span>{" "}
                        <span className="text-foreground">
                          {CATEGORY_LABELS[problem.category] || problem.category}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Interview Type:</span>{" "}
                        <span className="text-foreground uppercase">{problem.interviewType}</span>
                      </div>
                    </div>
                  </div>

                  {onSelectProblem && (
                    <Button
                      variant="primary"
                      onClick={() => handleSelectProblem(problem.id)}
                      className="w-full"
                    >
                      Select This Problem
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
