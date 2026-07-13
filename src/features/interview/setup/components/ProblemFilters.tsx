import { ProblemCategory } from "@prisma/client";
import { INTERVIEW_TYPES, DIFFICULTIES, SORT_OPTIONS, type FilterState } from "./useProblems";

const CATEGORY_LABELS: Record<ProblemCategory, string> = {
  SYSTEM_DESIGN: "System Design",
  LOW_LEVEL_DESIGN: "Low Level Design",
  DATABASES: "Databases",
  BACKEND: "Backend",
  DISTRIBUTED_SYSTEMS: "Distributed Systems",
  JAVA: "Java",
  KAFKA: "Kafka",
  REDIS: "Redis",
  OPERATING_SYSTEMS: "Operating Systems",
  NETWORKING: "Networking",
};

const ALL_CATEGORIES: ProblemCategory[] = [
  ProblemCategory.SYSTEM_DESIGN,
  ProblemCategory.LOW_LEVEL_DESIGN,
  ProblemCategory.DATABASES,
  ProblemCategory.BACKEND,
  ProblemCategory.DISTRIBUTED_SYSTEMS,
  ProblemCategory.JAVA,
  ProblemCategory.KAFKA,
  ProblemCategory.REDIS,
  ProblemCategory.OPERATING_SYSTEMS,
  ProblemCategory.NETWORKING,
];

type Props = {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
};

export default function ProblemFilters({ filters, onFiltersChange }: Props) {
  return (
    <>
      {/* Interview Type Tabs */}
      <div className="flex overflow-x-auto rounded-lg border border-border bg-muted p-1 mb-4">
        {INTERVIEW_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => {
              onFiltersChange({ selectedType: type, page: 1 });
            }}
            className={`whitespace-nowrap rounded px-4 py-2 font-mono text-sm font-medium transition ${
              filters.selectedType === type
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Category:</label>
          <select
            value={filters.selectedCategory}
            onChange={(e) => {
              onFiltersChange({ selectedCategory: e.target.value, page: 1 });
            }}
            className="rounded border border-border bg-card px-3 py-1.5 text-sm text-foreground"
          >
            <option value="All">All Categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat] || cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Difficulty:</label>
          <select
            value={filters.selectedDifficulty}
            onChange={(e) => {
              onFiltersChange({ selectedDifficulty: e.target.value as (typeof DIFFICULTIES)[number], page: 1 });
            }}
            className="rounded border border-border bg-card px-3 py-1.5 text-sm text-foreground"
          >
            {DIFFICULTIES.map((diff) => (
              <option key={diff} value={diff}>
                {diff}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Sort by:</label>
          <select
            value={filters.selectedSort}
            onChange={(e) => {
              onFiltersChange({ selectedSort: e.target.value as (typeof SORT_OPTIONS)[number], page: 1 });
            }}
            className="rounded border border-border bg-card px-3 py-1.5 text-sm text-foreground"
          >
            <option value="interviewCount">Interview Count</option>
            <option value="title">Title</option>
            <option value="difficulty">Difficulty</option>
            <option value="estimatedMinutes">Estimated Time</option>
          </select>
        </div>
      </div>
    </>
  );
}
