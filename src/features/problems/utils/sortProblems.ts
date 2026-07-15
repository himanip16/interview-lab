import { Difficulty } from "@prisma/client";
import type { Problem, SortOption } from "../types/problem";

export { SORT_LABELS } from "../types/problem";

const DIFF_ORDER: Record<Difficulty, number> = {
  [Difficulty.EASY]: 0,
  [Difficulty.MEDIUM]: 1,
  [Difficulty.HARD]: 2,
};

export function sortProblems(problems: Problem[], sort: SortOption): Problem[] {
  const copy = [...problems];
  switch (sort) {
    case "title":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "difficulty":
      return copy.sort((a, b) => DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty]);
    case "estimatedMinutes":
      return copy.sort((a, b) => (a.estimatedMinutes ?? 0) - (b.estimatedMinutes ?? 0));
    case "interviewCount":
    default:
      return copy; // server already ordered by this
  }
}