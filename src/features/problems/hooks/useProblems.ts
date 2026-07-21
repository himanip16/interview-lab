"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ProblemsResponseSchema, type Problem, type ProblemFilterState } from "../types/problem";
import { DEFAULT_PAGE_SIZE } from "@/shared/config/common-constants";

interface UseProblemsResult {
  problems: Problem[];
  totalPages: number;
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProblems(
  filters: Pick<ProblemFilterState, "type" | "difficulty" | "category" | "sort" | "page">,
  userId: string | null
): UseProblemsResult {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const [tick, setTick] = useState(0); // manual refetch trigger

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function run() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.type !== "all") params.set("interviewType", filters.type);
      if (filters.difficulty !== "ALL") params.set("difficulty", filters.difficulty);
      if (filters.category && filters.category !== "all") params.set("category", filters.category);
      params.set("sort", filters.sort);
      params.set("page", String(filters.page));
      params.set("limit", String(DEFAULT_PAGE_SIZE));
      if (userId) params.set("userId", userId);

      try {
        const res = await fetch(`/api/problems?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to load problems (${res.status})`);
        }

        const json = await res.json();
        const parsed = ProblemsResponseSchema.parse(json);

        if (requestId !== requestIdRef.current) return; // stale response, drop it

        setProblems(parsed.problems);
        setTotalPages(parsed.totalPages);
        setTotal(parsed.total);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (requestId !== requestIdRef.current) return;

        // NEVER fall back to mock data here — a real failure must stay visible.
        setError(err instanceof Error ? err.message : "Failed to load problems");
        setProblems([]);
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [filters.type, filters.difficulty, filters.category, filters.sort, filters.page, userId, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return { problems, totalPages, total, loading, error, refetch };
}