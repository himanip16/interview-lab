import { Difficulty } from "@prisma/client";

export const INTERVIEW_TYPES = ["hld", "lld", "dsa", "pr_review", "deep_dive", "tech_doc_review", "task_breakdown"] as const;
export type InterviewType = (typeof INTERVIEW_TYPES)[number];

export const SETUP_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export type SetupDifficulty = (typeof SETUP_DIFFICULTIES)[number];

export const DIFFICULTY_MAP: Record<SetupDifficulty, Difficulty> = {
  Easy: Difficulty.EASY,
  Medium: Difficulty.MEDIUM,
  Hard: Difficulty.HARD,
};
