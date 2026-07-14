"use client";

import { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { Panel } from "@/src/components/ui/Panel";
import { Search } from "@/src/components/ui/Search";
import { Pill } from "@/src/components/ui/Pill";
import { Badge } from "@/src/components/ui/Badge";

type Problem = {
  title: string;
  crux: string;
  type: string;
  diff: string;
  mins: number;
  done: boolean;
  pop: number;
};

const MOCK_PROBLEMS: Problem[] = [
  { title:'Design a chat system', crux:'Message ordering, presence, and delivery guarantees', type:'hld', diff:'hard', mins:45, done:false, pop:9 },
  { title:'Design an LRU cache', crux:'Hash map plus doubly linked list, O(1) get and put', type:'dsa', diff:'medium', mins:30, done:true, pop:8 },
  { title:'Design a rate limiter', crux:'Distributed state, sliding windows, fairness under load', type:'hld', diff:'hard', mins:30, done:false, pop:7 },
  { title:'Design a shopping cart', crux:'Cart persistence, price consistency, session handling', type:'lld', diff:'easy', mins:30, done:true, pop:6 },
  { title:'Design a URL shortener', crux:'Unique ID generation and redirect performance', type:'hld', diff:'medium', mins:30, done:true, pop:9 },
  { title:'Design a booking system', crux:'Availability checking, concurrency, double-booking', type:'lld', diff:'medium', mins:30, done:false, pop:5 },
  { title:'Binary search variations', crux:'Search space reduction and boundary conditions', type:'dsa', diff:'medium', mins:30, done:false, pop:6 },
  { title:'Design cache invalidation', crux:'Invalidation propagation, consistency, performance', type:'lld', diff:'hard', mins:45, done:false, pop:4 },
  { title:'Design event sourcing', crux:'Event storage, snapshotting, replay performance', type:'lld', diff:'hard', mins:45, done:false, pop:3 },
  { title:'Two pointers technique', crux:'Pointer movement and termination conditions', type:'dsa', diff:'easy', mins:30, done:true, pop:7 },
];

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>(MOCK_PROBLEMS);
  const [state, setState] = useState({ type:'all', diff:'all', status:'all', sort:'popularity' });
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const DIFF_ORDER = { easy:0, medium:1, hard:2 };

  const filteredProblems = problems.filter(p =>
    (state.type==='all' || p.type===state.type) &&
    (state.diff==='all' || p.diff===state.diff) &&
    (state.status==='all' || (state.status==='done' ? p.done : !p.done))
  );

  if (state.sort==='popularity') filteredProblems.sort((a,b) => b.pop - a.pop);
  if (state.sort==='alpha') filteredProblems.sort((a,b) => a.title.localeCompare(b.title));
  if (state.sort==='difficulty') filteredProblems.sort((a,b) => DIFF_ORDER[a.diff as keyof typeof DIFF_ORDER] - DIFF_ORDER[b.diff as keyof typeof DIFF_ORDER]);
  if (state.sort==='time') filteredProblems.sort((a,b) => a.mins - b.mins);

  const getBarClass = (type: string) => {
    switch(type) {
      case 'hld': return 'bg-[var(--violet)]';
      case 'lld': return 'bg-[var(--coral)]';
      case 'dsa': return 'bg-[var(--mint-deep)]';
      default: return 'bg-[var(--violet)]';
    }
  };

  const getTagClass = (type: string) => {
    switch(type) {
      case 'hld': return 'bg-[var(--violet)]';
      case 'lld': return 'bg-[var(--coral)]';
      case 'dsa': return 'bg-[var(--mint-deep)]';
      default: return 'bg-[var(--violet)]';
    }
  };

  const getDiffClass = (diff: string) => {
    switch(diff) {
      case 'easy': return 'text-[var(--mint-deep)] bg-[rgba(0,168,126,0.1)]';
      case 'medium': return 'text-[var(--amber)] bg-[rgba(232,148,10,0.1)]';
      case 'hard': return 'text-[var(--coral)] bg-[rgba(255,90,60,0.1)]';
      default: return 'text-[var(--mint-deep)] bg-[rgba(0,168,126,0.1)]';
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
            placeholder="Search problems…" 
            className="w-[220px]"
            onSearch={() => {}}
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
              {["all", "hld", "lld", "dsa"].map((type) => (
                <button
                  key={type}
                  onClick={() => setState({ ...state, type })}
                  className={cn(
                    "body-s font-semibold p-[6px_13px] radius-pill border border-[var(--border)] text-[var(--ink-400)] cursor-pointer transition-all duration-200 whitespace-nowrap",
                    state.type === type && "bg-[var(--ink)] text-white border-[var(--ink)]",
                    state.type === 'hld' && state.type === type && "bg-[var(--violet)] border-[var(--violet)]",
                    state.type === 'lld' && state.type === type && "bg-[var(--coral)] border-[var(--coral)]",
                    state.type === 'dsa' && state.type === type && "bg-[var(--mint-deep)] border-[var(--mint-deep)]"
                  )}
                >
                  {type === "all" ? "All" : type.toUpperCase()}
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
              {["all", "easy", "medium", "hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setState({ ...state, diff })}
                  className={cn(
                    "body-s font-semibold p-[6px_13px] radius-pill border border-[var(--border)] text-[var(--ink-400)] cursor-pointer transition-all duration-200 whitespace-nowrap",
                    state.diff === diff && "bg-[var(--ink)] text-white border-[var(--ink)]"
                  )}
                >
                  {diff === "all" ? "All" : diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
            <span className="label text-[var(--ink-400)] ml-2 mr-0.5">
              Status
            </span>
            <div className="flex gap-1.5" id="statusGroup">
              {["all", "done", "pending"].map((status) => (
                <button
                  key={status}
                  onClick={() => setState({ ...state, status })}
                  className={cn(
                    "body-s font-semibold p-[6px_13px] radius-pill border border-[var(--border)] text-[var(--ink-400)] cursor-pointer transition-all duration-200 whitespace-nowrap",
                    state.status === status && "bg-[var(--ink)] text-white border-[var(--ink)]"
                  )}
                >
                  {status === "all" ? "All" : status === "done" ? "Completed" : "Not started"}
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
            <div className="relative">
              <button
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
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
                <div className="absolute right-0 top-[calc(100%+6px)] bg-[var(--surface)] radius-card border border-[var(--border)] shadow-floating p-1.5 z-10 min-w-[170px]">
                  {["popularity", "alpha", "difficulty", "time"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setState({ ...state, sort: option });
                        setIsSortMenuOpen(false);
                      }}
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
          {filteredProblems.length === 0 ? (
            <div className="text-center py-12 body-s text-[var(--ink-400)]">
              No problems match these filters.
            </div>
          ) : (
            filteredProblems.map((p) => (
              <div
                key={p.title}
                className="flex items-center gap-4 p-[16px_18px] radius-card border border-[var(--border)] cursor-pointer transition-transform duration-[0.25s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[-3px] hover:shadow-floating"
                onClick={() => {
                  window.location.href = `/interview/setup?problemId=${p.title}`;
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
