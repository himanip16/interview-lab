import type { Problem, StatusFilter } from "../types/problem";

export function filterByStatus(problems: Problem[], status: StatusFilter): Problem[] {
  if (status === "all") return problems;
  return problems.filter((p) => {
    const done = p.completionHistory?.completed ?? false;
    return status === "done" ? done : !done;
  });
}

export function filterBySearch(problems: Problem[], query: string): Problem[] {
  const q = query.trim().toLowerCase();
  if (!q) return problems;
  return problems.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      (p.cruxOfProblem?.toLowerCase().includes(q) ?? false)
  );
}