"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/Button";
import ProblemFilters from "./ProblemFilters";
import ProblemList from "./ProblemList";
import Pagination from "./Pagination";
import { useProblems, type FilterState } from "./useProblems";
import type { Problem } from "./problemSchema";

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
  const [filters, setFilters] = useState<FilterState>({
    selectedType: "hld",
    selectedCategory: "All",
    selectedDifficulty: "All",
    selectedSort: "interviewCount",
    page: 1,
  });
  const [expandedProblem, setExpandedProblem] = useState<string | null>(null);

  const { problems, loading, error, totalPages, fetchProblems } = useProblems(userId || null);

  // Fetch problems when filters change
  useEffect(() => {
    fetchProblems(filters);
  }, [filters, fetchProblems]);

  function handleFiltersChange(newFilters: Partial<FilterState>) {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setExpandedProblem(null);
  }

  function handleProblemClick(problem: Problem) {
    if (expandedProblem === problem.id) {
      setExpandedProblem(null);
    } else {
      setExpandedProblem(problem.id);
    }
  }

  function handleSelectProblem(problemId: string) {
    onChange(problemId);
  }

  return (
    <div className="mt-8">
      <h3 className="mb-3 font-semibold text-foreground">
        Select a Problem
      </h3>

      <ProblemFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Error Banner */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-800 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">
            {error}
          </p>
          <button
            onClick={() => fetchProblems(filters)}
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

      <Pagination
        currentPage={filters.page}
        totalPages={totalPages}
        onPageChange={(page) => handleFiltersChange({ page })}
      />

      {/* Problem List */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading problems...</p>
      ) : (
        <ProblemList
          problems={problems}
          selectedValue={value}
          expandedProblem={expandedProblem}
          onProblemClick={handleProblemClick}
          onSelectProblem={handleSelectProblem}
        />
      )}
    </div>
  );
}
