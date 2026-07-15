"use client";

import { cn } from "@/lib/utils";
import { Difficulty } from "@prisma/client";
import { INTERVIEW_TYPES, STATUS_FILTERS, type ProblemFilterState } from "../types/problem";
import SortDropdown from "./SortDropdown";
import type { SortOption } from "../types/problem";

type Props = {
  filters: ProblemFilterState;
  onChange: (patch: Partial<ProblemFilterState>) => void;
  count: number;
};

export default function ProblemFilters({ filters, onChange, count }: Props) {
  return (
    <div className="mb-2">
      <div className="flex items-center gap-4.5 flex-wrap mb-3.5">
        <span className="label text-[var(--ink-400)] mr-0.5">Type</span>
        <div className="flex gap-1.5">
          {(["all", ...INTERVIEW_TYPES] as const).map((type) => (
            <button
              key={type}
              onClick={() => onChange({ type })}
              className={cn(
                "body-s font-semibold p-[6px_13px] radius-pill border border-[var(--border)] text-[var(--ink-400)] cursor-pointer whitespace-nowrap",
                filters.type === type && "bg-[var(--ink)] text-white border-[var(--ink)]"
              )}
            >
              {type === "all" ? "All" : type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4.5 flex-wrap mb-3.5">
        <span className="label text-[var(--ink-400)] mr-0.5">Difficulty</span>
        <div className="flex gap-1.5">
          {(["ALL", ...Object.values(Difficulty)] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => onChange({ difficulty: diff })}
              className={cn(
                "body-s font-semibold p-[6px_13px] radius-pill border border-[var(--border)] text-[var(--ink-400)] cursor-pointer",
                filters.difficulty === diff && "bg-[var(--ink)] text-white border-[var(--ink)]"
              )}
            >
              {diff === "ALL" ? "All" : diff.charAt(0) + diff.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <span className="label text-[var(--ink-400)] ml-2 mr-0.5">Status</span>
        <div className="flex gap-1.5">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => onChange({ status })}
              className={cn(
                "body-s font-semibold p-[6px_13px] radius-pill border border-[var(--border)] text-[var(--ink-400)] cursor-pointer",
                filters.status === status && "bg-[var(--ink)] text-white border-[var(--ink)]"
              )}
            >
              {status === "all" ? "All" : status === "done" ? "Completed" : "Not started"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3.5 border-t border-[var(--border)] mb-1.5">
        <div className="body-s text-[var(--ink-400)]">
          <b className="text-[var(--ink)]">{count}</b> problem{count !== 1 ? "s" : ""}
        </div>
        <SortDropdown value={filters.sort} onChange={(sort: SortOption) => onChange({ sort })} />
      </div>
    </div>
  );
}