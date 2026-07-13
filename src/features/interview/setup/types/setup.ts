import { Difficulty } from "@prisma/client";
import { z } from "zod";

export const INTERVIEW_TYPES = ["hld", "lld", "dsa", "pr_review", "deep_dive", "tech_doc_review", "task_breakdown"] as const;
export type InterviewType = (typeof INTERVIEW_TYPES)[number];

export const SETUP_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export type SetupDifficulty = (typeof SETUP_DIFFICULTIES)[number];

export const DIFFICULTY_MAP: Record<SetupDifficulty, Difficulty> = {
  Easy: Difficulty.EASY,
  Medium: Difficulty.MEDIUM,
  Hard: Difficulty.HARD,
};

export const DEFAULT_COMPANY = "General";

export function parseInterviewType(value: string | null): InterviewType {
  if (value && INTERVIEW_TYPES.includes(value as InterviewType)) {
    return value as InterviewType;
  }
  return "hld";
}

// Form validation schema
export const interviewSetupSchema = z.object({
  interviewType: z.enum(INTERVIEW_TYPES),
  difficulty: z.enum(SETUP_DIFFICULTIES),
  duration: z.number().int().positive().max(180), // Max 3 hours
  company: z.string().min(1, "Company is required").max(100),
  problemId: z.string().min(1, "Please select a problem"),
  topic: z.string().optional(),
});

export type InterviewSetupForm = z.infer<typeof interviewSetupSchema>;
