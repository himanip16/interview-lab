"use client";

import { useState, useEffect, useRef } from "react";
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
  interviewType?: (typeof INTERVIEW_TYPES)[number];
  difficulty?: (typeof DIFFICULTIES)[number];
  company?: string;
  onSearch?: () => void;
  userId?: string | null;
  hideSearchGate?: boolean;
};

const INTERVIEW_TYPES = ["hld", "lld", "dsa", "pr_review", "deep_dive", "tech_doc_review", "task_breakdown"] as const;
const DIFFICULTIES = ["All", Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD] as const;
const SORT_OPTIONS = ["interviewCount", "title", "difficulty", "estimatedMinutes"] as const;

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

const ALL_CATEGORIES: ProblemCategory[] = [
  ProblemCategory.SYSTEM_DESIGN,
  ProblemCategory.LOW_LEVEL_DESIGN,
  ProblemCategory.DATABASES,
  ProblemCategory.BACKEND,
  ProblemCategory.DISTRIBUTED_SYSTEMS,
  ProblemCategory.JAVA,
  ProblemCategory.KAFKA,
  ProblemCategory.REDIS,
  ProblemCategory.OPERATING_SYSTEMS,
  ProblemCategory.NETWORKING,
];

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  EASY: "border-green-800 text-green-400",
  MEDIUM: "border-amber-800 text-amber-400",
  HARD: "border-red-800 text-red-400",
};

export default function ProblemSelector({
  value,
  onChange,
  interviewType = "hld",
  difficulty = "All",
  company = "",
  onSearch,
  userId,
}: Props) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<(typeof INTERVIEW_TYPES)[number]>(interviewType);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<(typeof DIFFICULTIES)[number]>(difficulty);
  const [selectedSort, setSelectedSort] = useState<(typeof SORT_OPTIONS)[number]>("interviewCount");
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const abortControllerRef = useRef<AbortController | null>(null);

  async function fetchProblems() {
    try {
      setLoading(true);
      setError(null);
      
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();
      
      const params = new URLSearchParams();
      if (selectedType) params.append("interviewType", selectedType);
      if (selectedDifficulty !== "All") params.append("difficulty", selectedDifficulty);
      if (selectedCategory !== "All") params.append("category", selectedCategory);
      if (company) params.append("company", company);
      params.append("sort", selectedSort);
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (userId) params.append("userId", userId);

      const response = await fetch(
        `/api/problems${params.toString() ? `?${params.toString()}` : ""}`,
        { signal: abortControllerRef.current.signal }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch problems: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setProblems(data.problems || []);
      setTotalPages(data.totalPages || 1);
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
  }, [page, selectedType, selectedDifficulty, selectedCategory, selectedSort, company]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  function handleProblemClick(problem: Problem) {
    if (expandedProblem === problem.id) {
      setExpandedProblem(null);
    } else {
      setExpandedProblem(problem.id);
    }
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

      <>
          {/* Interview Type Tabs */}
          <div className="flex overflow-x-auto rounded-lg border border-border bg-muted p-1 mb-4">
            {INTERVIEW_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setPage(1);
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
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="rounded border border-border bg-card px-3 py-1.5 text-sm text-foreground"
              >
                <option value="All">All Categories</option>
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat] || cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground">Difficulty:</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value as (typeof DIFFICULTIES)[number]);
                  setPage(1);
                }}
                className="rounded border border-border bg-card px-3 py-1.5 text-sm text-foreground"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-foreground">Sort by:</label>
              <select
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value as (typeof SORT_OPTIONS)[number]);
                  setPage(1);
                }}
                className="rounded border border-border bg-card px-3 py-1.5 text-sm text-foreground"
              >
                <option value="interviewCount">Interview Count</option>
                <option value="title">Title</option>
                <option value="difficulty">Difficulty</option>
                <option value="estimatedMinutes">Estimated Time</option>
              </select>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-800 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">
                {error}
              </p>
              <button
                onClick={() => fetchProblems()}
                className="mt-2 text-sm text-red-400 underline hover:text-red-300"
              >
                Try again
              </button>
            </div>
          )}

          {/* Problem Count */}
          <p className="text-sm text-muted-foreground mb-4">
            {problems.length} problem{problems.length !== 1 ? "s" : ""} found
          </p>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded border border-border bg-card px-3 py-1.5 text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:border-foreground/40"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded border border-border bg-card px-3 py-1.5 text-sm text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:border-foreground/40"
              >
                Next
              </button>
            </div>
          )}

          {/* Problem List */}
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading problems...</p>
          ) : problems.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <p className="text-muted-foreground">No problems match your filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {problems.map((problem: Problem) => (
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
    </div>
  );
}
