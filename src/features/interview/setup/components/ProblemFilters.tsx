import { ProblemCategory } from "@prisma/client";
import { INTERVIEW_TYPES, DIFFICULTIES, SORT_OPTIONS, type FilterState } from "./useProblems";
import { cn } from "@/src/lib/utils";

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

const ALL_CATEGORIES = Object.values(ProblemCategory);

type Props = {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
};

export default function ProblemFilters({ filters, onFiltersChange }: Props) {
  return (
    <div className="space-y-6 mb-8">
      {/* 1. Interview Type Tabs - Modern Pill Style */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {INTERVIEW_TYPES.map((type) => {
          const isActive = filters.selectedType === type;
          return (
            <button
              key={type}
              onClick={() => onFiltersChange({ selectedType: type, page: 1 })}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-200 border",
                isActive
                  ? "bg-primary border-primary text-white shadow-sm shadow-primary/20"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
              )}
            >
              {type.toUpperCase().replace("_", " ")}
            </button>
          );
        })}
      </div>

      {/* 2. Secondary Filters Row - Subtle Integrated Look */}
      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-zinc-800/50">
        
        {/* Category Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">
            Category
          </label>
          <select
            value={filters.selectedCategory}
            onChange={(e) => onFiltersChange({ selectedCategory: e.target.value, page: 1 })}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer hover:bg-zinc-800/50"
          >
            <option value="All">All Categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat] || cat}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">
            Difficulty
          </label>
          <select
            value={filters.selectedDifficulty}
            onChange={(e) => 
              onFiltersChange({ 
                selectedDifficulty: e.target.value as (typeof DIFFICULTIES)[number], 
                page: 1 
              })
            }
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer hover:bg-zinc-800/50"
          >
            {DIFFICULTIES.map((diff) => (
              <option key={diff} value={diff}>
                {diff === "All" ? "All Difficulties" : diff}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">
            Sort By
          </label>
          <select
            value={filters.selectedSort}
            onChange={(e) => 
              onFiltersChange({ 
                selectedSort: e.target.value as (typeof SORT_OPTIONS)[number], 
                page: 1 
              })
            }
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer hover:bg-zinc-800/50"
          >
            <option value="interviewCount">Popularity</option>
            <option value="title">Alphabetical</option>
            <option value="difficulty">Difficulty Level</option>
            <option value="estimatedMinutes">Time Estimate</option>
          </select>
        </div>
      </div>
    </div>
  );
}