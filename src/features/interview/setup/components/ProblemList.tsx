"use client";

import type { Problem } from "./problemSchema";
import ProblemCard from "./ProblemCard";

type Props = {
  problems: Problem[];
  selectedValue: string | null;
  expandedProblem: string | null;
  onProblemClick: (problem: Problem) => void;
  onSelectProblem: (problemId: string) => void;
};

export default function ProblemList({
  problems,
  selectedValue,
  expandedProblem,
  onProblemClick,
  onSelectProblem,
}: Props) {
  if (problems.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No problems match your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {problems.map((problem) => (
        <ProblemCard
          key={problem.id}
          problem={problem}
          isSelected={problem.id === selectedValue}
          isExpanded={expandedProblem === problem.id}
          onClick={() => onProblemClick(problem)}
          onSelect={() => onSelectProblem(problem.id)}
        />
      ))}
    </div>
  );
}
