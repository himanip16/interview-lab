// src/features/library/components/TranscriptDetail.tsx

"use client";

import { useState } from "react";
import Link from "next/link";

import {
  type ContentBlock,
  type TranscriptData,
} from "../types/transcript";

import DialogueBubble from "./transcript/DialogueBubble";
import HighlightExplanation from "./transcript/HighlightExplanation";
import TranscriptHeader from "./transcript/TranscriptHeader";
import { TranscriptSummary } from "@/content/transcripts/types";
import { useTheme } from "@/features/theme/ThemeProvider";


type Props = {
  transcript: TranscriptData;
  summary?: TranscriptSummary;
  showBackButton?: boolean;
};

function findHighlights(
  content: ContentBlock[] | string
): (ContentBlock & { type: "highlight" })[] {
  if (typeof content === "string") {
    return [];
  }

  return content.filter(
    (
      block
    ): block is ContentBlock & { type: "highlight" } =>
      block.type === "highlight"
  );
}

export default function TranscriptDetail({
  transcript,
  showBackButton = false,
}: Props) {
  const { theme, toggleTheme } = useTheme();
  const [activeHighlightId, setActiveHighlightId] =
    useState<string | null>(null);

  const [activeHighlight, setActiveHighlight] =
    useState<(ContentBlock & { type: "highlight" }) | null>(
      null
    );

  function handleHighlightClick(highlightId: string) {
    for (const message of transcript.messages) {
      const highlights = findHighlights(message.content);

      const found = highlights.find(
        (h) => h.id === highlightId
      );

      if (!found) {
        continue;
      }

      if (activeHighlightId === highlightId) {
        setActiveHighlightId(null);
        setActiveHighlight(null);
      } else {
        setActiveHighlightId(highlightId);
        setActiveHighlight(found);
      }

      return;
    }
  }

  function handleCloseExplanation() {
    setActiveHighlightId(null);
    setActiveHighlight(null);
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--paper)' }}>
      <div className="max-w-[1180px] mx-auto">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-[30px] py-[16px] gap-5">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Link href="/library" className="flex items-center gap-[6px] text-[13.5px] font-semibold cursor-pointer" style={{ color: 'var(--ink-soft)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M15 6l-6 6 6 6"/></svg>
            Home
          </Link>
        </div>
        <div className="flex-1 max-w-[340px] flex items-center gap-[9px] rounded-full pt-[9px] pr-[10px] pb-[9px] pl-[16px]" style={{ backgroundColor: '#fff', border: '1px solid rgba(21,22,28,0.08)', color: 'var(--ink-soft)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.55 }}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
          <span className="text-[13px] flex-1">Search...</span>
          <span className="text-[10px] font-semibold rounded-md px-[6px] py-[2px]" style={{ color: 'var(--ink-soft)', backgroundColor: 'var(--paper)', border: '1px solid rgba(21,22,28,0.1)' }}>⌘K</span>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="flex items-center gap-[6px] text-[12px] font-bold px-[12px] py-[6px] rounded-full" style={{ color: 'var(--amber)', backgroundColor: 'rgba(232,148,10,0.1)' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6L21 9.3l-5 4.6L17.5 21 12 17.6 6.5 21 8 13.9 3 9.3l6.1-.7z"/></svg>
            1,350 XP
          </div>
          <button className="w-[34px] h-[34px] rounded-full flex items-center justify-center cursor-pointer" style={{ border: '1px solid rgba(21,22,28,0.1)', backgroundColor: '#fff', color: 'var(--ink-soft)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/></svg>
          </button>
          <button 
            onClick={toggleTheme}
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center cursor-pointer" 
            style={{ border: '1px solid rgba(21,22,28,0.1)', backgroundColor: '#fff', color: 'var(--ink-soft)' }}
          >
            {theme === 'light' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            )}
          </button>
          <div className="w-[34px] h-[34px] rounded-full text-white flex items-center justify-center text-[12.5px] font-bold font-['Poppins']" style={{ backgroundColor: 'var(--ink)' }}>H</div>
        </div>
      </nav>

      {/* Continue Banner */}
      <div className="mx-[30px] mt-[4px] flex items-center justify-between gap-[16px] rounded-2xl px-[20px] py-[13px]" style={{ backgroundColor: '#fff', border: '1px solid rgba(21,22,28,0.07)' }}>
        <div className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Continue from where you left off &mdash; <b className="font-semibold" style={{ color: 'var(--ink)' }}>{transcript.metadata.title}</b>, 8% complete
        </div>
        <button className="flex items-center gap-[7px] text-white border-none px-[16px] py-[9px] rounded-full text-[12.5px] font-semibold cursor-pointer whitespace-nowrap" style={{ backgroundColor: 'var(--mint-deep)' }}>
          Jump back in
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </div>

      {/* Page Header */}
      <div className="pt-[26px] px-[30px] pb-[22px]">
        <div className="text-[11.5px] font-bold tracking-[0.1em] uppercase" style={{ color: 'var(--mint-deep)' }}>{transcript.metadata.category}</div>
        <h1 className="text-[30px] font-semibold mt-[8px] font-['Poppins'] tracking-tight" style={{ color: 'var(--ink)' }}>{transcript.metadata.title}</h1>
        <div className="flex gap-[8px] mt-[14px]">
          <span className="text-[11.5px] font-semibold px-[12px] py-[5px] rounded-full" style={{ backgroundColor: 'rgba(232,148,10,0.1)', color: 'var(--amber)' }}>{transcript.metadata.difficulty}</span>
          <span className="text-[11.5px] font-semibold px-[12px] py-[5px] rounded-full" style={{ backgroundColor: 'var(--paper)', color: 'var(--ink-soft)', border: '1px solid rgba(21,22,28,0.08)' }}>{transcript.metadata.duration} min</span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-[20px] px-[30px] pb-[60px] items-start">
        {/* Rail Sidebar */}
        <div className="flex-0 w-[250px] flex flex-col gap-[14px] sticky top-[20px] hidden sm:flex">
          {/* Session Card */}
          <div className="rounded-[18px] p-[18px]" style={{ backgroundColor: '#fff', border: '1px solid rgba(21,22,28,0.07)' }}>
            <div className="flex items-center gap-[8px] text-[11px] font-bold tracking-[0.05em] uppercase mb-[12px]" style={{ color: 'var(--ink-soft)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              Session
            </div>
            <div className="h-[6px] rounded-full overflow-hidden mt-[12px] mb-[8px]" style={{ backgroundColor: 'var(--paper)' }}>
              <div className="h-full rounded-full w-[13%]" style={{ backgroundColor: 'var(--mint-deep)' }}/>
            </div>
            <div className="text-[12px] mb-[12px]" style={{ color: 'var(--ink-soft)' }}>13% complete</div>
            <div className="flex items-center gap-[9px] rounded-xl px-[12px] py-[9px]" style={{ backgroundColor: 'var(--paper)' }}>
              <div className="w-[8px] h-[8px] rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--violet)' }}/>
              <span className="text-[12px] font-semibold flex-1" style={{ color: 'var(--ink)' }}>Transcript</span>
              <span className="text-[11px] font-['JetBrains Mono']" style={{ color: 'var(--ink-soft)' }}>0:00</span>
            </div>
          </div>

          {/* BookmarksCard */}
          <div className="rounded-[18px] p-[18px]" style={{ backgroundColor: '#fff', border: '1px solid rgba(21,22,28,0.07)' }}>
            <div className="flex items-center gap-[8px] text-[11px] font-bold tracking-[0.05em] uppercase mb-[12px]" style={{ color: 'var(--ink-soft)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 3h12v18l-6-4-6 4z"/></svg>
              My bookmarks
            </div>
            <div className="text-[12px] italic mt-[12px]" style={{ color: 'var(--ink-soft)' }}>Nothing bookmarked yet.</div>
          </div>

          {/* Concepts Card */}
          <div className="rounded-[18px] p-[18px]" style={{ backgroundColor: '#fff', border: '1px solid rgba(21,22,28,0.07)' }}>
            <div className="flex items-center gap-[8px] text-[11px] font-bold tracking-[0.05em] uppercase mb-[12px]" style={{ color: 'var(--ink-soft)' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" opacity=".5"/></svg>
              Concepts explored
            </div>
            <div className="flex flex-wrap gap-[6px] mt-[12px]">
              {transcript.metadata.topics?.map((topic) => (
                <span key={topic} className="text-[11px] font-semibold px-[10px] py-[5px] rounded-full" style={{ backgroundColor: 'rgba(106,90,224,0.08)', color: 'var(--violet)' }}>{topic}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 min-w-0 flex flex-col gap-[22px]">
          {transcript.messages.map((message, index) => (
            <div key={message.id ?? index}>
              <DialogueBubble
                role={message.role}
                content={message.content}
                elapsedSeconds={message.elapsedSeconds}
                onHighlightClick={handleHighlightClick}
                activeHighlightId={activeHighlightId}
              />
              {activeHighlight && activeHighlightId && (
                <HighlightExplanation
                  highlight={activeHighlight}
                  onClose={handleCloseExplanation}
                />
              )}
            </div>
          ))}
          {transcript.messages.length === 0 && (
            <div className="text-[#5A5B66] italic">No messages.</div>
          )}
        </div>
      </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 px-[6px] py-[10px] flex items-center justify-around sm:hidden" style={{ backgroundColor: '#fff', borderTop: '1px solid rgba(21,22,28,0.08)' }}>
        <div className="flex flex-col items-center gap-[4px] text-[9.5px] font-semibold" style={{ color: 'var(--mint-deep)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7" opacity=".5"/><circle cx="12" cy="12" r="10" opacity=".3"/></svg>
          Deep Dives
        </div>
        <div className="flex flex-col items-center gap-[4px] text-[9.5px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h10M4 18h13"/></svg>
          Transcripts
        </div>
        <div className="flex flex-col items-center gap-[4px] text-[9.5px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="6" width="16" height="12" rx="2"/><path d="M8 10h5M8 13h8"/></svg>
          Interviews
        </div>
        <div className="flex flex-col items-center gap-[4px] text-[9.5px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="13" rx="2"/><path d="M8 21h8"/></svg>
          Whiteboard
        </div>
        <div className="flex flex-col items-center gap-[4px] text-[9.5px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
          Dashboard
        </div>
      </div>
    </div>
  );
}