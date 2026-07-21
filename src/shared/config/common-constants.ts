// Common constants used across the application

// ---------------------------------------------------------------------------
// Difficulty Levels
// ---------------------------------------------------------------------------

export const DIFFICULTY_LEVELS = ["easy", "medium", "hard"] as const;
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];

export const DIFFICULTY_ORDER: Record<DifficultyLevel, number> = {
  easy: 0,
  medium: 1,
  hard: 2,
};

// ---------------------------------------------------------------------------
// Problem/Interview Types
// ---------------------------------------------------------------------------

export const PROBLEM_TYPES = ["hld", "lld", "dsa"] as const;
export type ProblemType = (typeof PROBLEM_TYPES)[number];

// ---------------------------------------------------------------------------
// Status Filters
// ---------------------------------------------------------------------------

export const STATUS_FILTERS = ["all", "done", "pending"] as const;
export type StatusFilter = (typeof STATUS_FILTERS)[number];

// ---------------------------------------------------------------------------
// Sort Options
// ---------------------------------------------------------------------------

export const SORT_OPTIONS = ["popularity", "alpha", "difficulty", "time"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

// ---------------------------------------------------------------------------
// Common Filter Values
// ---------------------------------------------------------------------------

export const ALL_FILTER = "all" as const;

// ---------------------------------------------------------------------------
// Time Constants (in milliseconds)
// ---------------------------------------------------------------------------

export const ONE_SECOND_MS = 1000;
export const ONE_MINUTE_MS = 60 * ONE_SECOND_MS;
export const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;

// ---------------------------------------------------------------------------
// Duration Constants (in minutes)
// ---------------------------------------------------------------------------

export const DURATION_SHORT = 30;
export const DURATION_MEDIUM = 45;
export const DURATION_LONG = 60;
export const DURATION_EXTENDED = 90;
export const DURATION_MAX = 180;

// ---------------------------------------------------------------------------
// UI Constants
// ---------------------------------------------------------------------------

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
