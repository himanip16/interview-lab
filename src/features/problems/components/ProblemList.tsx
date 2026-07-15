"use client";

import ProblemCard from "./ProblemCard";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Problem } from "../types/problem";

type Props = {
  problems: Problem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSelect: (problemId: string) => void;
};

export default function ProblemList({ problems, loading, error, onRetry, onSelect }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2.5 mt-4.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-[16px_18px] radius-card border border-[var(--border)]">
            <Skeleton className="w-[5px] h-12 radius-small flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-5 w-2/3 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-6 w-16 radius-pill" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="body-s text-[var(--coral)] mb-4">{error}</div>
        <button
          onClick={onRetry}
          className="body-s font-semibold p-[8px_16px] radius-pill border border-[var(--border)] bg-[var(--surface)] cursor-pointer text-[var(--ink)] hover:bg-[var(--paper-100)] transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  if (problems.length === 0) {
    return <div className="text-center py-12 body-s text-[var(--ink-400)]">No problems match these filters.</div>;
  }

  return (
    <div className="flex flex-col gap-2.5 mt-4.5">
      {problems.map((p) => (
        <ProblemCard key={p.id} problem={p} onSelect={onSelect} />
      ))}
    </div>
  );
}