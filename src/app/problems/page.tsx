"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Panel } from "@/components/ui/Panel";
import { Search } from "@/components/ui/Search";
import { Skeleton } from "@/components/ui/Skeleton";
import { useSearchParams, useRouter } from "next/navigation";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import {
  DIFFICULTY_LEVELS,
  DIFFICULTY_ORDER,
  PROBLEM_TYPES,
  SORT_OPTIONS,
  STATUS_FILTERS,
  ALL_FILTER,
  type DifficultyLevel,
  type ProblemType,
  type SortOption,
  type StatusFilter,
} from "@/shared/config/common-constants"; 


type Problem = {
  id: string;
  title: string;
  crux: string;
  type: ProblemType;
  diff: DifficultyLevel;
  mins: number;
  done: boolean;
  pop: number;
};

const MOCK_PROBLEMS: Problem[] = [
  { id:'1', title:'Design a chat system', crux:'Message ordering, presence, and delivery guarantees', type:'hld', diff:'hard', mins:45, done:false, pop:9 },
  { id:'2', title:'Design an LRU cache', crux:'Hash map plus doubly linked list, O(1) get and put', type:'dsa', diff:'medium', mins:30, done:true, pop:8 },
  { id:'3', title:'Design a rate limiter', crux:'Distributed state, sliding windows, fairness under load', type:'hld', diff:'hard', mins:30, done:false, pop:7 },
  { id:'4', title:'Design a shopping cart', crux:'Cart persistence, price consistency, session handling', type:'lld', diff:'easy', mins:30, done:true, pop:6 },
  { id:'5', title:'Design a URL shortener', crux:'Unique ID generation and redirect performance', type:'hld', diff:'medium', mins:30, done:true, pop:9 },
  { id:'6', title:'Design a booking system', crux:'Availability checking, concurrency, double-booking', type:'lld', diff:'medium', mins:30, done:false, pop:5 },
  { id:'7', title:'Binary search variations', crux:'Search space reduction and boundary conditions', type:'dsa', diff:'medium', mins:30, done:false, pop:6 },
  { id:'8', title:'Design cache invalidation', crux:'Invalidation propagation, consistency, performance', type:'lld', diff:'hard', mins:45, done:false, pop:4 },
  { id:'9', title:'Design event sourcing', crux:'Event storage, snapshotting, replay performance', type:'lld', diff:'hard', mins:45, done:false, pop:3 },
  { id:'10', title:'Two pointers technique', crux:'Pointer movement and termination conditions', type:'dsa', diff:'easy', mins:30, done:true, pop:7 },
];

const DIFF_ORDER = DIFFICULTY_ORDER;
const TYPE_COLORS: Record<ProblemType, string> = {
  hld: "bg-[var(--violet)]",
  lld: "bg-[var(--coral)]",
  dsa: "bg-[var(--mint-deep)]",
};

const DIFF_CLASSES: Record<DifficultyLevel, string> = {
  easy: "text-[var(--mint-deep)] bg-[rgba(0,168,126,0.1)]",
  medium: "text-[var(--amber)] bg-[rgba(232,148,10,0.1)]",
  hard: "text-[var(--coral)] bg-[rgba(255,90,60,0.1)]",
};

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFromUrl = searchParams.get("category");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Fetch problems from API
  const fetchProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/problems');
      if (!response.ok) {
        throw new Error('Failed to fetch problems');
      }
      const data = await response.json();
      setProblems(data.problems || MOCK_PROBLEMS); // Fallback to mock if API returns empty
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load problems');
      // Fallback to mock data on error
      setProblems(MOCK_PROBLEMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const [state, setState] = useState({
    type: ALL_FILTER as ProblemType | typeof ALL_FILTER,
    diff: ALL_FILTER as DifficultyLevel | typeof ALL_FILTER,
    status: ALL_FILTER as StatusFilter,
    sort: "popularity" as SortOption,
    category: categoryFromUrl || ALL_FILTER,
    searchQuery: "",
  });

  const filteredProblems = useMemo(() => {
    let result = problems.filter(p =>
      (state.type === ALL_FILTER || p.type === state.type) &&
      (state.diff === ALL_FILTER || p.diff === state.diff) &&
      (state.status === ALL_FILTER || (state.status === 'done' ? p.done : !p.done)) &&
      (state.category === ALL_FILTER || p.type === state.category) &&
      (state.searchQuery === "" || p.title.toLowerCase().includes(state.searchQuery.toLowerCase()) || p.crux.toLowerCase().includes(state.searchQuery.toLowerCase()))
    );

    if (state.sort === 'popularity') {
      result = [...result].sort((a, b) => b.pop - a.pop);
    } else if (state.sort === 'alpha') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    } else if (state.sort === 'difficulty') {
      result = [...result].sort((a, b) => DIFF_ORDER[a.diff] - DIFF_ORDER[b.diff]);
    } else if (state.sort === 'time') {
      result = [...result].sort((a, b) => a.mins - b.mins);
    }

    return result;
  }, [problems, state]);

  const getBarClass = (type: ProblemType): string => TYPE_COLORS[type] || TYPE_COLORS.hld;
  const getTagClass = (type: ProblemType): string => TYPE_COLORS[type] || TYPE_COLORS.hld;
  const getDiffClass = (diff: DifficultyLevel): string => DIFF_CLASSES[diff] || DIFF_CLASSES.easy;

  // Close dropdown on Escape key or click outside
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSortMenuOpen) {
        setIsSortMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isSortMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSortMenuOpen]);

  // Handle click outside using custom hook
  useClickOutside(dropdownRef, () => setIsSortMenuOpen(false), isSortMenuOpen);

  // Handle arrow key navigation
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    const options = SORT_OPTIONS;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = (index + 1) % options.length;
        const nextButton = dropdownRef.current?.querySelectorAll('button')[nextIndex] as HTMLButtonElement;
        nextButton?.focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = (index - 1 + options.length) % options.length;
        const prevButton = dropdownRef.current?.querySelectorAll('button')[prevIndex] as HTMLButtonElement;
        prevButton?.focus();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        setState(prev => ({ ...prev, sort: options[index] as SortOption }));
        setIsSortMenuOpen(false);
        triggerRef.current?.focus();
        break;
    }
  };
  

  return (
    <div className="min-h-screen bg-[var(--paper)] py-10 px-6">
      <Panel variant="default" className="max-w-[960px] mx-auto p-[32px_36px_40px]">
        
        {/* Top Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="heading-m text-[var(--ink)]">
            Problem library
          </h2>
          <Search 
            placeholder="Search problems..." 
            className="w-[220px]"
            onSearch={(value) => setState(prev => ({ ...prev, searchQuery: value }))}
          />
        </div>

        {/* Filter Section */}
        <div className="mb-2">
          {/* Type Filter Row */}
          <div className="flex items-center gap-4.5 flex-wrap mb-3.5">
            <span className="label text-[var(--ink-400)] mr-0.5">
              Type
            </span>
            <div className="flex gap-1.5" id="typeGroup">
              {[ALL_FILTER, ...PROBLEM_TYPES].map((type) => (
                <button
                  key={type}
                  onClick={() => setState(prev => ({ ...prev, type: type as ProblemType | typeof ALL_FILTER }))}
                  className={cn(
                    "body-s font-semibold p-[6px_13px] radius-pill border border-[var(--border)] text-[var(--ink-400)] cursor-pointer transition-all duration-200 whitespace-nowrap",
                    state.type === type && "bg-[var(--ink)] text-white border-[var(--ink)]",
                    state.type === 'hld' && state.type === type && "bg-[var(--violet)] border-[var(--violet)]",
                    state.type === 'lld' && state.type === type && "bg-[var(--coral)] border-[var(--coral)]",
                    state.type === 'dsa' && state.type === type && "bg-[var(--mint-deep)] border-[var(--mint-deep)]"
                  )}
                >
                  {type === ALL_FILTER ? "All" : type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Status Filter Row */}
          <div className="flex items-center gap-4.5 flex-wrap mb-3.5">
            <span className="label text-[var(--ink-400)] mr-0.5">
              Difficulty
            </span>
            <div className="flex gap-1.5" id="diffGroup">
              {[ALL_FILTER, ...DIFFICULTY_LEVELS].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setState(prev => ({ ...prev, diff: diff as DifficultyLevel | typeof ALL_FILTER }))}
                  className={cn(
                    "body-s font-semibold p-[6px_13px] radius-pill border border-[var(--border)] text-[var(--ink-400)] cursor-pointer transition-all duration-200 whitespace-nowrap",
                    state.diff === diff && "bg-[var(--ink)] text-white border-[var(--ink)]"
                  )}
                >
                  {diff === ALL_FILTER ? "All" : diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
            <span className="label text-[var(--ink-400)] ml-2 mr-0.5">
              Status
            </span>
            <div className="flex gap-1.5" id="statusGroup">
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status}
                  onClick={() => setState(prev => ({ ...prev, status: status as StatusFilter }))}
                  className={cn(
                    "body-s font-semibold p-[6px_13px] radius-pill border border-[var(--border)] text-[var(--ink-400)] cursor-pointer transition-all duration-200 whitespace-nowrap",
                    state.status === status && "bg-[var(--ink)] text-white border-[var(--ink)]"
                  )}
                >
                  {status === ALL_FILTER ? "All" : status === "done" ? "Completed" : "Not started"}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-3.5 border-t border-[var(--border)] mb-1.5">
            <div className="body-s text-[var(--ink-400)]">
              <b className="text-[var(--ink)]">{filteredProblems.length}</b> problem{filteredProblems.length !== 1 ? "s" : ""}
            </div>

            {/* Sort Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                ref={triggerRef}
                onClick={() => setIsSortMenuOpen(prev => !prev)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' && !isSortMenuOpen) {
                    e.preventDefault();
                    setIsSortMenuOpen(true);
                    setTimeout(() => {
                      const firstOption = dropdownRef.current?.querySelectorAll('button')[0] as HTMLButtonElement;
                      firstOption?.focus();
                    }, 0);
                  }
                }}
                aria-haspopup="true"
                aria-expanded={isSortMenuOpen}
                aria-controls="sort-menu"
                className="flex items-center gap-1.75 body-s font-semibold p-[8px_14px] radius-pill border border-[var(--border)] bg-[var(--surface)] cursor-pointer text-[var(--ink)]"
              >
                <svg className="w-[13px] h-[13px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M4 7h10M4 12h7M4 17h4"/>
                  <path d="M16 6v13M16 19l-3-3M16 19l3-3"/>
                </svg>
                <span id="sortLabel">
                  {state.sort === "popularity" ? "Popularity" : 
                   state.sort === "alpha" ? "Alphabetical" : 
                   state.sort === "difficulty" ? "Difficulty" : "Time estimate"}
                </span>
                <svg className="w-[11px] h-[11px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {isSortMenuOpen && (
                <div
                  id="sort-menu"
                  role="menu"
                  aria-labelledby="sortLabel"
                  className="absolute right-0 top-[calc(100%+6px)] bg-[var(--surface)] radius-card border border-[var(--border)] shadow-floating p-1.5 z-10 min-w-[170px]"
                >
                  {SORT_OPTIONS.map((option, index) => (
                    <button
                      key={option}
                      role="menuitem"
                      tabIndex={index === 0 ? 0 : -1}
                      onClick={() => {
                        setState(prev => ({ ...prev, sort: option as SortOption }));
                        setIsSortMenuOpen(false);
                        triggerRef.current?.focus();
                      }}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      aria-selected={state.sort === option}
                      className={cn(
                        "block w-full text-left body-s p-[8px_12px] radius-small cursor-pointer text-[var(--ink-400)] font-medium",
                        state.sort === option ? "text-[var(--ink)] font-semibold" : "hover:bg-[var(--paper-100)]"
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
          {loading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-[16px_18px] radius-card border border-[var(--border)]">
                <Skeleton className="w-[5px] h-12 radius-small flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-5 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-6 w-16 radius-pill" />
                <Skeleton className="h-5 w-12" />
                <Skeleton className="w-[22px] h-[22px] radius-pill" />
              </div>
            ))
          ) : error ? (
            // Error state with retry
            <div className="text-center py-12">
              <div className="body-s text-[var(--ink-400)] mb-4">
                {error}
              </div>
              <button
                onClick={fetchProblems}
                className="body-s font-semibold p-[8px_16px] radius-pill border border-[var(--border)] bg-[var(--surface)] cursor-pointer text-[var(--ink)] hover:bg-[var(--paper-100)] transition-all"
              >
                Retry
              </button>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="text-center py-12 body-s text-[var(--ink-400)]">
              No problems match these filters.
            </div>
          ) : (
            filteredProblems.map((p) => (
              <div
  key={p.id}
  className="flex items-center gap-4 p-[16px_18px] radius-card border border-[var(--border)] cursor-pointer transition-transform duration-[0.25s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[-3px] hover:shadow-floating"
                onClick={() => {
                  router.push(`/interview/setup?problemId=${encodeURIComponent(p.id)}`);
                }}
>
                <div className={`w-[5px] self-stretch radius-small flex-shrink-0 ${getBarClass(p.type)}`} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="body-s font-semibold text-[var(--ink)]">{p.title}</h3>
                    <span className={`caption font-bold tracking-[0.03em] p-[2px_8px] radius-small text-white uppercase ${getTagClass(p.type)}`}>
                      {p.type}
                    </span>
                  </div>
                  <div className="body-s text-[var(--ink-400)] mt-0.75 overflow-hidden text-ellipsis whitespace-nowrap">
                    {p.crux}
                  </div>
                </div>

                <div className="flex items-center gap-3.5 flex-shrink-0">
                  <span className={`caption font-semibold p-[4px_10px] radius-pill ${getDiffClass(p.diff)}`}>
                    {p.diff}
                  </span>
                  <span className="body-s text-[var(--ink-400)] w-12 text-right">
                    {p.mins}m
                  </span>
                  <div className={`w-[22px] h-[22px] radius-pill flex items-center justify-center flex-shrink-0 ${p.done ? 'bg-[var(--mint-deep)] text-white' : 'border-[1.5px] border-[var(--border)]'}`}>
                    {p.done && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12l5 5L20 7"/>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}
