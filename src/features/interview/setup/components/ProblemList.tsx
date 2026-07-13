import { Difficulty, ProblemCategory } from "@prisma/client";
import { Button } from "@/src/components/ui/Button";
import type { Problem } from "./problemSchema";

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

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

type Props = {
  problems: Problem[];
  selectedValue: string | null;
  expandedProblem: string | null;
  onProblemClick: (problem: Problem) => void;
  onSelectProblem: (problemId: string) => void;
};

function formatDate(date: Date | null): string {
  if (!date) return "Never";
  return DATE_FORMATTER.format(new Date(date));
}

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
        <div
          key={problem.id}
          className={`overflow-hidden rounded-lg border transition hover:border-foreground/40 ${
            problem.id === selectedValue
              ? "border-primary bg-primary/5"
              : "border-border bg-card"
          }`}
        >
          {/* Problem Row */}
          <button
            onClick={() => onProblemClick(problem)}
            className="w-full px-4 py-3 text-left"
            aria-expanded={expandedProblem === problem.id}
            aria-controls={`problem-details-${problem.id}`}
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
                  {problem.id === selectedValue && (
                    <span className="rounded bg-primary px-2 py-0.5 text-xs font-mono uppercase tracking-wider text-primary-foreground">
                      ✓ Selected
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
            <div id={`problem-details-${problem.id}`} className="border-t border-border bg-muted p-4">
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
                onClick={() => onSelectProblem(problem.id)}
                className="w-full"
              >
                Select This Problem
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
