"use client";

import { useState, useEffect } from "react";
import { Difficulty, ProblemCategory, InterviewStatus } from "@prisma/client";
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
  completionHistory?: {
    completed: boolean;
    timesCompleted: number;
    lastCompletedAt: Date | null;
  };
};

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
  interviewType?: string;
  difficulty?: string;
  company?: string;
  onSearch?: () => void;
  userId?: string | null;
};

const INTERVIEW_TYPES = ["hld", "lld", "dsa", "pr_review", "deep_dive", "tech_doc_review", "task_breakdown"] as const;
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

export default function ProblemSelector({
  value,
  onChange,
  interviewType = "hld",
  difficulty = "Medium",
  company = "",
  onSearch,
  userId,
}: Props) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<(typeof INTERVIEW_TYPES)[number]>(interviewType as any);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<(typeof DIFFICULTIES)[number]>(difficulty as any);
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function fetchProblems() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedType) params.append("interviewType", selectedType);
      if (selectedDifficulty !== "All") params.append("difficulty", selectedDifficulty);
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (company) params.append("company", company);

      const response = await fetch(
        `/api/problems${params.toString() ? `?${params.toString()}` : ""}`
      );
      const data = await response.json();
      
      // Add completion history if userId is provided
      const problemsWithHistory = await Promise.all(
        (data.problems || []).map(async (problem: Problem) => {
          if (!userId) return problem;
          
          try {
            const historyResponse = await fetch(`/api/problems/${problem.id}/history?userId=${userId}`);
            const historyData = await historyResponse.json();
            return {
              ...problem,
              completionHistory: historyData.history || {
                completed: false,
                timesCompleted: 0,
                lastCompletedAt: null,
              },
            };
          } catch {
            return problem;
          }
        })
      );
      
      setProblems(problemsWithHistory);
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hasSearched) {
      fetchProblems();
    }
  }, [selectedType, selectedDifficulty, selectedCategory, hasSearched]);

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

  function handleSearch() {
    setHasSearched(true);
    onSearch?.();
  }

  function formatDate(date: Date | null): string {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  }

  return (
    <div className="mt-8">
      <h3 className="mb-3 font-semibold text-foreground">
        Select a Problem
      </h3>

      {!hasSearched ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure your filters and search to see available problems.
          </p>
          <Button
            type="button"
            variant="primary"
            onClick={handleSearch}
            className="w-full"
          >
            Search Problems
          </Button>
        </div>
      ) : (
        <>
          {/* Interview Type Tabs */}
          <div className="flex overflow-x-auto rounded-lg border border-border bg-muted p-1 mb-4">
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
          <div className="flex flex-wrap gap-4 mb-4">
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
          <p className="text-sm text-muted-foreground mb-4">
            {filteredProblems.length} problem{filteredProblems.length !== 1 ? "s" : ""} found
          </p>

          {/* Problem List */}
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading problems...</p>
          ) : filteredProblems.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">No problems match your filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProblems.map((problem) => (
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
                          {problem.completionHistory?.completed && (
                            <span className="rounded bg-green-500/10 px-2 py-0.5 text-xs font-mono uppercase tracking-wider text-green-400">
                              Done
                            </span>
                          )}
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
                        {problem.completionHistory && (
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">
                              {problem.completionHistory.timesCompleted}x done
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Last: {formatDate(problem.completionHistory.lastCompletedAt)}
                            </div>
                          </div>
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

                      <Button
                        variant="primary"
                        onClick={() => onChange(problem.id)}
                        className="w-full"
                      >
                        Select This Problem
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
