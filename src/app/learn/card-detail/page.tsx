"use client";

import React from 'react';
import { Search } from '@/src/components/ui/Search';
import { Panel } from '@/src/components/ui/Panel';
import { Badge } from '@/src/components/ui/Badge';
import { cn } from '@/src/lib/utils';

export default function CardDetailPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)] py-12 px-6">
      <Panel variant="default" className="max-w-[1080px] mx-auto p-[36px_40px_40px]">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-7 gap-6">
          <div className="heading-m font-semibold">
            interview<span style={{ color: 'var(--amber-deep)' }}>.</span>lab
          </div>
          <Search 
            placeholder="Search actions…" 
            className="flex-1 max-w-[340px]"
            onSearch={() => {}}
          />
          <div className="body-s font-semibold text-[var(--ink-400)] cursor-pointer flex items-center gap-2 whitespace-nowrap">
            Menu
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="19" cy="12" r="2"/>
            </svg>
          </div>
        </div>

        {/* Detail Layout */}
        <div className="flex radius-card overflow-hidden min-h-[420px]">
          
          {/* Rail - Vertical Navigation */}
          <div className="w-[52px] flex-shrink-0 bg-[var(--paper)] flex flex-col items-center justify-between p-5 0">
            <div className="flex flex-col gap-6.5 items-center">
              <div className="writing-mode-vertical-rl rotate-180 body-s font-semibold text-[var(--ink-400)] tracking-[0.02em] cursor-pointer p-0.5">
                Bug hunting
              </div>
              <div className="writing-mode-vertical-rl rotate-180 body-s font-semibold text-[var(--ink)] cursor-pointer p-0.5">
                Live interview
              </div>
              <div className="writing-mode-vertical-rl rotate-180 body-s font-semibold text-[var(--ink-400)] tracking-[0.02em] cursor-pointer p-0.5">
                Deep dives
              </div>
            </div>
            <svg className="text-[var(--ink-400)] animate-bob" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>

          {/* Hero Section */}
          <div className="flex-0-0-[42%] relative bg-gradient-to-br from-[#FFB930] to-[var(--amber-deep)] flex items-center justify-center">
            
            {/* Close Button */}
            <div className="absolute top-[18px] right-[18px]">
              <button className="relative w-[34px] h-[34px] radius-pill border-none bg-[rgba(255,255,255,0.18)] text-white flex items-center justify-center cursor-pointer z-10">
                <div className="absolute inset-[-5px] radius-pill border-[1.5px] border-[rgba(255,255,255,0.6)] animate-breathe" />
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 6l12 12M18 6L6 18"/>
                </svg>
              </button>
            </div>

            {/* Illustration */}
            <svg className="w-[200px] h-[200px] animate-float" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="92" fill="rgba(255,255,255,0.14)"/>
              <rect x="82" y="56" width="36" height="60" rx="18" fill="#fff"/>
              <path d="M64 96a36 36 0 0072 0" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none"/>
              <line x1="100" y1="132" x2="100" y2="148" stroke="#fff" strokeWidth="7" strokeLinecap="round"/>
              <line x1="80" y1="148" x2="120" y2="148" stroke="#fff" strokeWidth="7" strokeLinecap="round"/>
            </svg>

            {/* Play Button */}
            <div className="absolute bottom-[26px] left-[26px]">
              <button className="relative w-[58px] h-[58px] radius-pill border-none bg-white text-[var(--amber-deep)] flex items-center justify-center cursor-pointer z-10 shadow-floating">
                <div className="absolute inset-[-8px] radius-pill border-[1.5px] border-[rgba(255,255,255,0.7)] animate-breathe" />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-[34px_38px] flex flex-col">
            <Badge className="self-end mb-auto" variant="default">
              <span className="w-1.5 h-1.5 radius-full bg-[var(--amber)] animate-pulse mr-1.5" />
              Live session
            </Badge>

            <h2 className="heading-l font-bold mt-4.5">Live interview with AI</h2>
            <div className="body-s text-[var(--ink-400)] mt-1 font-medium">
              Format <b className="text-[var(--ink)]">System design</b> &nbsp;&middot;&nbsp; Duration <b className="text-[var(--ink)]">45 min</b>
            </div>

            <p className="body-s text-[var(--ink-400)] leading-relaxed mt-4 max-w-[400px]">
              A real-time mock interview that adapts its follow-ups to what you actually say.
              Talk through requirements, sketch on the whiteboard, and get pushed on tradeoffs —
              then walk away with a phase-by-phase breakdown of how it went.
            </p>

            <div className="body-s font-semibold text-[var(--ink-400)] mt-5.5 mb-3">Preview the phases</div>
            <div className="flex gap-2.5">
              <div className="flex-1 h-16 radius-card flex items-center justify-center text-white body-s font-semibold gap-1.5 cursor-pointer transition-transform duration-[0.25s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[-4px] bg-gradient-to-br from-[#3E6BFF] to-[#213FCC]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 6h16M4 12h10M4 18h13"/>
                </svg>
                Requirements
              </div>
              <div className="flex-1 h-16 radius-card flex items-center justify-center text-white body-s font-semibold gap-1.5 cursor-pointer transition-transform duration-[0.25s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[-4px] bg-gradient-to-br from-[#00E0AB] to-[#00A87E]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="5" width="18" height="13" rx="2"/>
                  <path d="M8 21h8"/>
                </svg>
                Whiteboard
              </div>
              <div className="flex-1 h-16 radius-card flex items-center justify-center text-white body-s font-semibold gap-1.5 cursor-pointer transition-transform duration-[0.25s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[-4px] bg-gradient-to-br from-[#262832] to-[#121319]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 6l-6 6 6 6M15 6l6 6-6 6"/>
                </svg>
                Wrap-up
              </div>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
