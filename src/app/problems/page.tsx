"use client";

import { useState } from "react";
import ProblemCard from "@/src/features/interview/setup/components/ProblemCard";
import type { Problem } from "@/src/features/interview/setup/components/problemSchema";
import { cn } from "@/src/lib/utils";

// Mock data - replace with actual data fetching
const MOCK_PROBLEMS: Problem[] = [
  {
    id: "1",
    slug: "design-chat-system",
    title: "Design a chat system",
    description: "Design a real-time chat system with message ordering, presence, and delivery guarantees",
    cruxOfProblem: "Message ordering, presence, and delivery guarantees",
    difficulty: "HARD",
    category: "SYSTEM_DESIGN",
    estimatedMinutes: 45,
    tags: ["messaging", "real-time", "scalability"],
    interviewType: "SYSTEM_DESIGN",
    completionHistory: { completed: false, timesCompleted: 0, lastCompletedAt: null },
  },
  {
    id: "2",
    slug: "design-lru-cache",
    title: "Design an LRU cache",
    description: "Design an LRU cache with O(1) get and put operations",
    cruxOfProblem: "Hash map plus doubly linked list, O(1) get and put",
    difficulty: "MEDIUM",
    category: "DATABASES",
    estimatedMinutes: 30,
    tags: ["caching", "data-structures", "optimization"],
    interviewType: "LOW_LEVEL_DESIGN",
    completionHistory: { completed: true, timesCompleted: 1, lastCompletedAt: new Date() },
  },
  {
    id: "3",
    slug: "design-rate-limiter",
    title: "Design a rate limiter",
    description: "Design a distributed rate limiter with sliding windows and fairness under load",
    cruxOfProblem: "Distributed state, sliding windows, fairness under load",
    difficulty: "HARD",
    category: "SYSTEM_DESIGN",
    estimatedMinutes: 30,
    tags: ["rate-limiting", "distributed-systems", "fairness"],
    interviewType: "SYSTEM_DESIGN",
    completionHistory: { completed: false, timesCompleted: 0, lastCompletedAt: null },
  },
];

export default function ProblemsPage() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("popularity");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const filteredProblems = MOCK_PROBLEMS.filter((problem) => {
    const matchesType = selectedType === "all" || problem.category.toLowerCase().includes(selectedType);
    const matchesDifficulty = selectedDifficulty === "all" || problem.difficulty.toLowerCase() === selectedDifficulty;
    const matchesStatus = selectedStatus === "all" || 
      (selectedStatus === "done" ? problem.completionHistory?.completed : !problem.completionHistory?.completed);
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesDifficulty && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10 px-6">
      <div className="max-w-[960px] mx-auto bg-white rounded-[32px] p-[32px_36px_40px] shadow-[0_24px_60px_rgba(21,22,28,0.06)] border border-[rgba(21,22,28,0.06)]">
        
        {/* Top Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[23px] font-semibold text-[#15161C] font-['Poppins'] tracking-tight">
            Problem library
          </h2>
          <div className="flex items-center gap-2 bg-[#FAF9F6] border border-[rgba(21,22,28,0.08)] rounded-[999px] px-4 py-2.5 w-[220px]">
            <svg className="w-[14px] h-[14px] opacity-50 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.3-4.3"/>
            </svg>
            <input
              type="text"
              placeholder="Search problems…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[13px] text-[#5A5B66] outline-none w-full placeholder:text-[#5A5B66]"
            />
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-2">
          {/* Type Filter Row */}
          <div className="flex items-center gap-4.5 flex-wrap mb-3.5">
            <span className="text-[10.5px] font-bold tracking-[0.06em] text-[#5A5B66] uppercase mr-0.5">
              Type
            </span>
            <div className="flex gap-1.5">
              {["all", "hld", "lld", "dsa"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "text-[12.5px] font-semibold px-3 py-1.5 rounded-[999px] border cursor-pointer transition-all duration-200 whitespace-nowrap",
                    selectedType === type
                      ? "bg-[#15161C] text-white border-[#15161C]"
                      : "border-[rgba(21,22,28,0.1)] text-[#5A5B66] hover:border-[rgba(21,22,28,0.2)]"
                  )}
                >
                  {type === "all" ? "All" : type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Status Filter Row */}
          <div className="flex items-center gap-4.5 flex-wrap mb-3.5">
            <span className="text-[10.5px] font-bold tracking-[0.06em] text-[#5A5B66] uppercase mr-0.5">
              Difficulty
            </span>
            <div className="flex gap-1.5">
              {["all", "easy", "medium", "hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={cn(
                    "text-[12.5px] font-semibold px-3 py-1.5 rounded-[999px] border cursor-pointer transition-all duration-200 whitespace-nowrap",
                    selectedDifficulty === diff
                      ? "bg-[#15161C] text-white border-[#15161C]"
                      : "border-[rgba(21,22,28,0.1)] text-[#5A5B66] hover:border-[rgba(21,22,28,0.2)]"
                  )}
                >
                  {diff === "all" ? "All" : diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>

            <span className="text-[10.5px] font-bold tracking-[0.06em] text-[#5A5B66] uppercase ml-2 mr-0.5">
              Status
            </span>
            <div className="flex gap-1.5">
              {["all", "done", "pending"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={cn(
                    "text-[12.5px] font-semibold px-3 py-1.5 rounded-[999px] border cursor-pointer transition-all duration-200 whitespace-nowrap",
                    selectedStatus === status
                      ? "bg-[#15161C] text-white border-[#15161C]"
                      : "border-[rgba(21,22,28,0.1)] text-[#5A5B66] hover:border-[rgba(21,22,28,0.2)]"
                  )}
                >
                  {status === "all" ? "All" : status === "done" ? "Completed" : "Not started"}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-3.5 border-t border-[rgba(21,22,28,0.06)] mb-1.5">
            <div className="text-[12.5px] text-[#5A5B66]">
              <b className="text-[#15161C]">{filteredProblems.length}</b> problem{filteredProblems.length !== 1 ? "s" : ""}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                className="flex items-center gap-1.5 text-[12.5px] font-semibold px-3.5 py-2 rounded-[999px] border border-[rgba(21,22,28,0.1)] bg-white cursor-pointer text-[#15161C]"
              >
                <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M4 7h10M4 12h7M4 17h4"/>
                  <path d="M16 6v13M16 19l-3-3M16 19l3-3"/>
                </svg>
                <span>
                  {sortOption === "popularity" ? "Popularity" : 
                   sortOption === "alpha" ? "Alphabetical" : 
                   sortOption === "difficulty" ? "Difficulty" : "Time estimate"}
                </span>
                <svg className="w-[11px] h-[11px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {isSortMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+6px)] bg-white rounded-[14px] border border-[rgba(21,22,28,0.08)] shadow-[0_14px_34px_rgba(21,22,28,0.1)] p-1.5 z-10 min-w-[170px]">
                  {["popularity", "alpha", "difficulty", "time"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortOption(option);
                        setIsSortMenuOpen(false);
                      }}
                      className={cn(
                        "block w-full text-left text-[12.5px] px-3 py-2 rounded-lg cursor-pointer font-medium",
                        sortOption === option ? "text-[#15161C] font-semibold" : "text-[#5A5B66] hover:bg-[#FAF9F6]"
                      )}
                    >
                      {option === "popularity" ? "Popularity" : 
                       option === "alpha" ? "Alphabetical" : 
                       option === "difficulty" ? "Difficulty" : "Time estimate"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Problem List */}
        <div className="flex flex-col gap-2.5 mt-4.5">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-12 text-[13.5px] text-[#5A5B66]">
              No problems match these filters.
            </div>
          ) : (
            filteredProblems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                isSelected={false}
                isExpanded={false}
                onClick={() => {
                  window.location.href = `/interview/setup?problemId=${problem.id}`;
                }}
                onSelect={() => {}}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
