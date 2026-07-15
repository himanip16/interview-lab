"use client";

import { cn } from "@/lib/utils";
import type { Problem } from "../types/problem";
import { Difficulty } from "@prisma/client";

const TYPE_COLORS: Record<string, string> = {
  hld: "bg-[var(--violet)]",
  lld: "bg-[var(--coral)]",
  dsa: "bg-[var(--mint-deep)]",
};

const DIFF_CLASSES: Record<Difficulty, string> = {
  [Difficulty.EASY]: "text-[var(--mint-deep)] bg-[rgba(0,168,126,0.1)]",
  [Difficulty.MEDIUM]: "text-[var(--amber)] bg-[rgba(232,148,10,0.1)]",
  [Difficulty.HARD]: "text-[var(--coral)] bg-[rgba(255,90,60,0.1)]",
};

type Props = {
  problem: Problem;
  onSelect: (problemId: string) => void;
};

export default function ProblemCard({ problem, onSelect }: Props) {
  const typeKey = problem.interviewType ?? "hld";
  const barClass = TYPE_COLORS[typeKey] ?? TYPE_COLORS.hld;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(problem.id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(problem.id)}
      className="flex items-center gap-4 p-[16px_18px] radius-card border border-[var(--border)] cursor-pointer transition-transform duration-[0.25s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[-3px] hover:shadow-floating"
    >
      <div className={cn("w-[5px] self-stretch radius-small flex-shrink-0", barClass)} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="body-s font-semibold text-[var(--ink)]">{problem.title}</h3>
          <span className={cn("caption font-bold tracking-[0.03em] p-[2px_8px] radius-small text-white uppercase", barClass)}>
            {typeKey}
          </span>
        </div>
        {problem.cruxOfProblem && (
          <div className="body-s text-[var(--ink-400)] mt-0.75 overflow-hidden text-ellipsis whitespace-nowrap">
            {problem.cruxOfProblem}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3.5 flex-shrink-0">
        <span className={cn("caption font-semibold p-[4px_10px] radius-pill", DIFF_CLASSES[problem.difficulty])}>
          {problem.difficulty.toLowerCase()}
        </span>
        {problem.estimatedMinutes != null && (
          <span className="body-s text-[var(--ink-400)] w-12 text-right">{problem.estimatedMinutes}m</span>
        )}
        <div
          className={cn(
            "w-[22px] h-[22px] radius-pill flex items-center justify-center flex-shrink-0",
            problem.completionHistory?.completed
              ? "bg-[var(--mint-deep)] text-white"
              : "border-[1.5px] border-[var(--border)]"
          )}
        >
          {problem.completionHistory?.completed && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M5 12l5 5L20 7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}