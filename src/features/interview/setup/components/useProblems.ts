import { useState, useEffect, useRef, useCallback } from "react";
import { ProblemsResponseSchema, type Problem } from "./problemSchema";

const INTERVIEW_TYPES = ["hld", "lld", "dsa", "pr_review", "deep_dive", "tech_doc_review", "task_breakdown"] as const;
const DIFFICULTIES = ["All", "EASY", "MEDIUM", "HARD"] as const;
const SORT_OPTIONS = ["interviewCount", "title", "difficulty", "estimatedMinutes"] as const;
const PAGE_SIZE = 20;

type FilterState = {
  selectedType: (typeof INTERVIEW_TYPES)[number];
  selectedCategory: string;
  selectedDifficulty: (typeof DIFFICULTIES)[number];
  selectedSort: (typeof SORT_OPTIONS)[number];
  page: number;
};

export function useProblems(userId: string | null) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);

  const fetchProblems = useCallback(
    async (filters: FilterState) => {
      const requestId = ++requestIdRef.current;
      
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
        if (filters.selectedType) params.append("interviewType", filters.selectedType);
        if (filters.selectedDifficulty !== "All") params.append("difficulty", filters.selectedDifficulty);
        if (filters.selectedCategory !== "All") params.append("category", filters.selectedCategory);
        params.append("sort", filters.selectedSort);
        params.append("page", filters.page.toString());
        params.append("limit", PAGE_SIZE.toString());
        if (userId) params.append("userId", userId);

        const response = await fetch(
          `/api/problems${params.toString() ? `?${params.toString()}` : ""}`,
          { signal: abortControllerRef.current.signal }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch problems: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validate response with Zod
        const validatedData = ProblemsResponseSchema.parse(data);
        
        // Only update state if this is the most recent request
        if (requestId === requestIdRef.current) {
          setProblems(validatedData.problems);
          setTotalPages(validatedData.totalPages);
        }
      } catch (error) {
        // Ignore abort errors (from cancelled requests)
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        
        // Only update error state if this is the most recent request
        if (requestId === requestIdRef.current) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch problems";
          setError(errorMessage);
          console.error("Failed to fetch problems:", error);
        }
      } finally {
        // Only update loading state if this is the most recent request
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [userId]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    problems,
    loading,
    error,
    totalPages,
    fetchProblems,
  };
}

export { INTERVIEW_TYPES, DIFFICULTIES, SORT_OPTIONS, PAGE_SIZE };
export type { FilterState };
