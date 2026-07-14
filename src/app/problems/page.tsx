"use client";

import { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";

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
      case 'hld': return 'bg-[#6A5AE0]';
      case 'lld': return 'bg-[#FF5A3C]';
      case 'dsa': return 'bg-[#00A87E]';
      default: return 'bg-[#6A5AE0]';
    }
  };

  const getTagClass = (type: string) => {
    switch(type) {
      case 'hld': return 'bg-[#6A5AE0]';
      case 'lld': return 'bg-[#FF5A3C]';
      case 'dsa': return 'bg-[#00A87E]';
      default: return 'bg-[#6A5AE0]';
    }
  };

  const getDiffClass = (diff: string) => {
    switch(diff) {
      case 'easy': return 'text-[#00A87E] bg-[rgba(0,168,126,0.1)]';
      case 'medium': return 'text-[#E8940A] bg-[rgba(232,148,10,0.1)]';
      case 'hard': return 'text-[#FF5A3C] bg-[rgba(255,90,60,0.1)]';
      default: return 'text-[#00A87E] bg-[rgba(0,168,126,0.1)]';
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10 px-6">
      <div className="panel max-w-[960px] mx-auto bg-white rounded-[32px] p-[32px_36px_40px] shadow-[0_24px_60px_rgba(21,22,28,0.06)] border border-[rgba(21,22,28,0.06)]">
        
        {/* Top Section */}
        <div className="top flex items-center justify-between mb-6">
          <h2 className="text-[23px] font-semibold text-[#15161C] font-['Poppins'] tracking-tight">
            Problem library
          </h2>
          <div className="search flex items-center gap-2 bg-[#FAF9F6] border border-[rgba(21,22,28,0.08)] rounded-[999px] p-[9px_16px] text-[13px] text-[#5A5B66] w-[220px]">
            <svg className="w-[14px] h-[14px] opacity-50 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.3-4.3"/>
            </svg>
            <span>Search problems&hellip;</span>
          </div>
        </div>

        {/* Filter Section */}
        <div className="filters mb-2">
          {/* Type Filter Row */}
          <div className="filter-row flex items-center gap-4.5 flex-wrap mb-3.5">
            <span className="filter-label text-[10.5px] font-bold tracking-[0.06em] text-[#5A5B66] text-transform:uppercase mr-0.5">
              Type
            </span>
            <div className="pillgroup flex gap-1.5" id="typeGroup">
              {["all", "hld", "lld", "dsa"].map((type) => (
                <button
                  key={type}
                  onClick={() => setState({ ...state, type })}
                  className={cn(
                    "fpill text-[12.5px] font-semibold p-[6px_13px] rounded-[999px] border border-[rgba(21,22,28,0.1)] text-[#5A5B66] cursor-pointer transition-all duration-200 whitespace-nowrap",
                    state.type === type && "active bg-[#15161C] text-white border-[#15161C]",
                    state.type === 'hld' && state.type === type && "type-hld bg-[#6A5AE0] border-[#6A5AE0]",
                    state.type === 'lld' && state.type === type && "type-lld bg-[#FF5A3C] border-[#FF5A3C]",
                    state.type === 'dsa' && state.type === type && "type-dsa bg-[#00A87E] border-[#00A87E]"
                  )}
                >
                  {type === "all" ? "All" : type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty & Status Filter Row */}
          <div className="filter-row flex items-center gap-4.5 flex-wrap mb-3.5">
            <span className="filter-label text-[10.5px] font-bold tracking-[0.06em] text-[#5A5B66] text-transform:uppercase mr-0.5">
              Difficulty
            </span>
            <div className="pillgroup flex gap-1.5" id="diffGroup">
              {["all", "easy", "medium", "hard"].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setState({ ...state, diff })}
                  className={cn(
                    "fpill text-[12.5px] font-semibold p-[6px_13px] rounded-[999px] border border-[rgba(21,22,28,0.1)] text-[#5A5B66] cursor-pointer transition-all duration-200 whitespace-nowrap",
                    state.diff === diff && "active bg-[#15161C] text-white border-[#15161C]"
                  )}
                >
                  {diff === "all" ? "All" : diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              ))}
            </div>
            <span className="filter-label text-[10.5px] font-bold tracking-[0.06em] text-[#5A5B66] text-transform:uppercase ml-2 mr-0.5">
              Status
            </span>
            <div className="pillgroup flex gap-1.5" id="statusGroup">
              {["all", "done", "pending"].map((status) => (
                <button
                  key={status}
                  onClick={() => setState({ ...state, status })}
                  className={cn(
                    "fpill text-[12.5px] font-semibold p-[6px_13px] rounded-[999px] border border-[rgba(21,22,28,0.1)] text-[#5A5B66] cursor-pointer transition-all duration-200 whitespace-nowrap",
                    state.status === status && "active bg-[#15161C] text-white border-[#15161C]"
                  )}
                >
                  {status === "all" ? "All" : status === "done" ? "Completed" : "Not started"}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="bar-bottom flex items-center justify-between pt-3.5 border-t border-[rgba(21,22,28,0.06)] mb-1.5">
            <div className="count text-[12.5px] text-[#5A5B66]">
              <b className="text-[#15161C]">{filteredProblems.length}</b> problem{filteredProblems.length !== 1 ? "s" : ""}
            </div>

            {/* Sort Dropdown */}
            <div className="sort-wrap relative">
              <button
                onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                className="sort-btn flex items-center gap-1.75 text-[12.5px] font-semibold p-[8px_14px] rounded-[999px] border border-[rgba(21,22,28,0.1)] bg-white cursor-pointer text-[#15161C]"
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
                <div className="sort-menu absolute right-0 top-[calc(100%+6px)] bg-white rounded-[14px] border border-[rgba(21,22,28,0.08)] shadow-[0_14px_34px_rgba(21,22,28,0.1)] p-1.5 z-10 min-w-[170px]">
                  {["popularity", "alpha", "difficulty", "time"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setState({ ...state, sort: option });
                        setIsSortMenuOpen(false);
                      }}
                      className={cn(
                        "sort-opt block w-full text-left text-[12.5px] p-[8px_12px] rounded-lg cursor-pointer text-[#5A5B66] font-medium",
                        state.sort === option ? "text-[#15161C] font-semibold" : "hover:bg-[#FAF9F6]"
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
        <div className="list flex flex-col gap-2.5 mt-4.5">
          {filteredProblems.length === 0 ? (
            <div className="empty-state text-center py-12 text-[13.5px] text-[#5A5B66]">
              No problems match these filters.
            </div>
          ) : (
            filteredProblems.map((p) => (
              <div
                key={p.title}
                className="row flex items-center gap-4 p-[16px_18px] rounded-[18px] border border-[rgba(21,22,28,0.07)] cursor-pointer transition-transform duration-[0.25s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[-3px] hover:shadow-[0_14px_30px_rgba(21,22,28,0.07)]"
                onClick={() => {
                  window.location.href = `/interview/setup?problemId=${p.title}`;
                }}
              >
                <div className={`bar w-[5px] self-stretch rounded-[3px] flex-shrink-0 ${getBarClass(p.type)}`} />
                
                <div className="row-main flex-1 min-w-0">
                  <div className="row-title flex items-center gap-2">
                    <h3 className="text-[14.5px] font-semibold text-[#15161C] font-['Poppins']">{p.title}</h3>
                    <span className={`type-tag text-[10px] font-bold tracking-[0.03em] p-[2px_8px] rounded-[6px] text-white text-transform-uppercase ${getTagClass(p.type)}`}>
                      {p.type}
                    </span>
                  </div>
                  <div className="row-crux text-[12.5px] text-[#5A5B66] mt-0.75 overflow-hidden text-ellipsis whitespace-nowrap">
                    {p.crux}
                  </div>
                </div>

                <div className="row-right flex items-center gap-3.5 flex-shrink-0">
                  <span className={`diff text-[11px] font-semibold p-[4px_10px] rounded-[999px] ${getDiffClass(p.diff)}`}>
                    {p.diff}
                  </span>
                  <span className="mins text-[12px] text-[#5A5B66] w-12 text-right">
                    {p.mins}m
                  </span>
                  <div className={`check w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 ${p.done ? 'done bg-[#00A87E] text-white' : 'pending border-[1.5px] border-[rgba(21,22,28,0.15)]'}`}>
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
      </div>
    </div>
  );
}
