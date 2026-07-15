"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Difficulty } from "@prisma/client";
import {
  type InterviewTypeFilter,
  type StatusFilter,
  type SortOption,
} from "../types/problem";

export interface ProblemFilterState {
  type: InterviewTypeFilter;
  difficulty: Difficulty | "ALL";
  status: StatusFilter;
  sort: SortOption;
  category: string;
  search: string;
  page: number;
}

const DEFAULT_STATE: ProblemFilterState = {
  type: "all",
  difficulty: "ALL",
  status: "all",
  sort: "interviewCount",
  category: "all",
  search: "",
  page: 1,
};

export function useProblemFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFiltersState] = useState<ProblemFilterState>(() => ({
    ...DEFAULT_STATE,
    category: searchParams.get("category") ?? "all",
  }));

  // reacts to external URL change (e.g. nav from landing page cards),
  // not just on first mount — this was the actual bug in the old page.
  useEffect(() => {
    const urlCategory = searchParams.get("category") ?? "all";
    setFiltersState((prev) =>
      prev.category === urlCategory ? prev : { ...prev, category: urlCategory, page: 1 }
    );
  }, [searchParams]);

  const setFilters = useCallback((patch: Partial<ProblemFilterState>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...patch,
      // any filter change except page itself resets pagination
      page: "page" in patch ? patch.page! : 1,
    }));
  }, []);

  const syncCategoryToUrl = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (category === "all") params.delete("category");
      else params.set("category", category);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return { filters, setFilters, syncCategoryToUrl };
}