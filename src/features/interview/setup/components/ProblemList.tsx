"use client";

import { Clock, CheckCircle2, X, ChevronRight } from "lucide-react";
import type { Problem } from "./problemSchema";
import { Button } from "@/src/components/ui/Button";
import { accentFor, CARD_PALETTE } from "@/src/lib/utils";

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
  const expanded = problems.find((p) => p.id === expandedProblem) ?? null;

  if (problems.length === 0) {
    return (
      <div className="rounded-[26px] border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">No problems match your filters.</p>
      </div>
    );
  }

  if (expanded) {
    const accent = accentFor(expanded.id);

    return (
      <div className="flex flex-col md:flex-row rounded-[26px] overflow-hidden border border-border bg-card shadow-[0_24px_60px_rgba(21,22,28,0.08)] min-h-[420px]">
        <div
          className="relative flex-shrink-0 md:w-[42%] flex items-center justify-center min-h-[220px]"
          style={{ background: `linear-gradient(165deg, ${accent.from}, ${accent.to})` }}
        >
          <button
            onClick={() => onProblemClick(expanded)}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <div className="w-24 h-24 rounded-full bg-white/15 flex items-center justify-center">
            <span className="text-white font-heading text-3xl font-bold">
              {expanded.title.slice(0, 1)}
            </span>
          </div>

          {expanded.completionHistory?.completed && (
            <div
              className="absolute bottom-5 left-5 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold"
              style={{ color: accent.to }}
            >
              <CheckCircle2 size={13} />
              Completed
            </div>
          )}
        </div>

        <div className="flex-1 p-8 flex flex-col">
          <span
            className="self-end text-xs font-semibold px-3 py-1.5 rounded-full mb-auto"
            style={{ color: accent.to, background: `${accent.from}18` }}
          >
            {expanded.difficulty}
          </span>

          <h2 className="mt-4 text-2xl font-bold font-heading text-foreground">{expanded.title}</h2>

          <div className="mt-1 text-sm text-muted-foreground font-medium">
            {expanded.category.replace(/_/g, " ")} &middot; {expanded.estimatedMinutes ?? "—"} min
          </div>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-md">
            {expanded.description ?? expanded.cruxOfProblem}
          </p>

          {expanded.tags && expanded.tags.length > 0 && (
            <>
              <div className="mt-6 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {expanded.tags.slice(0, 4).map((tag, i) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold text-white px-3 py-2 rounded-xl"
                    style={{ background: CARD_PALETTE[i % CARD_PALETTE.length].to }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </>
          )}

          <Button variant="primary" className="mt-8 self-start" onClick={() => onSelectProblem(expanded.id)}>
            Launch Interview →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {problems.map((problem) => {
        const accent = accentFor(problem.id);
        const isSelected = problem.id === selectedValue;

        return (
          <button
            key={problem.id}
            onClick={() => onProblemClick(problem)}
            className={`text-left rounded-[26px] p-5 pt-16 relative overflow-hidden transition-transform hover:-translate-y-1 ${
              isSelected ? "ring-2 ring-primary" : ""
            }`}
            style={{ background: `linear-gradient(165deg, ${accent.from}, ${accent.to})` }}
          >
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white">
              <ChevronRight size={16} />
            </div>

            {problem.completionHistory?.completed && (
              <div className="absolute top-4 left-4 text-white/90">
                <CheckCircle2 size={14} />
              </div>
            )}

            <h3 className="text-white font-heading font-bold text-lg leading-snug line-clamp-2">
              {problem.title}
            </h3>
            <div className="mt-2 flex items-center gap-2 text-white/80 text-xs font-medium">
              <Clock size={12} />
              {problem.estimatedMinutes ?? "—"} min &middot; {problem.difficulty}
            </div>
          </button>
        );
      })}
    </div>
  );
}