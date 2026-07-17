import { z } from "zod";
import { Difficulty, ProblemCategory } from "@prisma/client";

// Single source of truth. features/interview/problems/components/problemSchema.ts
// should be changed to `export * from "@/features/problems/types/problem"`
// instead of redefining this — do that as a follow-up, not bundled here.

export const ProblemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  category: z.nativeEnum(ProblemCategory),
  difficulty: z.nativeEnum(Difficulty),
  interviewType: z.string().nullable().optional(),
  cruxOfProblem: z.string().nullable(),
  estimatedMinutes: z.number().nullable(),
  tags: z.array(z.string()).default([]),
  completionHistory: z
    .object({
      completed: z.boolean(),
      timesCompleted: z.number(),
      lastCompletedAt: z.coerce.date().nullable(),
    })
    .optional(),
});

export const ProblemsResponseSchema = z.object({
  problems: z.array(ProblemSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export type Problem = z.infer<typeof ProblemSchema>;
export type ProblemsResponse = z.infer<typeof ProblemsResponseSchema>;

export const INTERVIEW_TYPES = [
  "hld",
  "lld",
  "dsa",
  "pr_review",
  "deep_dive",
  "tech_doc_review",
  "task_breakdown",
] as const;
export type InterviewTypeFilter = (typeof INTERVIEW_TYPES)[number] | "all";

export const STATUS_FILTERS = ["all", "done", "pending"] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

export const SORT_OPTIONS = [
  "interviewCount",
  "title",
  "difficulty",
  "estimatedMinutes",
] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export const SORT_LABELS: Record<SortOption, string> = {
  interviewCount: "Popularity",
  title: "Alphabetical",
  difficulty: "Difficulty",
  estimatedMinutes: "Time estimate",
};