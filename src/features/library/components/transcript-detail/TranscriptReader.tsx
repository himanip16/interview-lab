// src/features/library/components/transcript-detail/TranscriptReader.tsx

"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MessageBlock } from "./MessageBlock";
import { ContinueBanner } from "./ContinueBanner";
import { SectionMarker } from "./SectionMarker";
import { RightSidebar } from "./RightSidebar";
import type { ContentBlock, TranscriptData, TranscriptSection, UserProgress, TranscriptMessage } from "@/features/library/types/transcript";

type Props = {
  title: string;
  company?: string;
  difficulty: string;
  duration: number;
  transcript: TranscriptData;
  sections?: TranscriptSection[];
};

function collectHighlights(transcript: TranscriptData) {
  const highlights: Extract<ContentBlock, { type: "highlight" }>[] = [];
  for (const m of transcript.messages) {
    if (typeof m.content === "string") continue;
    for (const b of m.content) {
      if (b.type === "highlight") highlights.push(b);
    }
  }
  return highlights;
}

export function TranscriptReader({ title, company, difficulty, duration, transcript, sections = [] }: Props) {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement>>({});
  const messageRefs = useRef<Record<string, HTMLDivElement>>({});
  
  const [progress, setProgress] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [aiReplies, setAiReplies] = useState<Record<string, string>>({});
  const [exploredConcepts, setExploredConcepts] = useState<string[]>([]);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const highlights = useMemo(() => collectHighlights(transcript), [transcript]);
  const strengths = highlights.filter((h) => h.status === "strong");
  const gaps = highlights.filter((h) => h.status === "missed");

  const allMessages = useMemo(() => {
    return transcript.messages.map((m) => ({
      id: m.id,
      text: typeof m.content === "string" ? m.content : m.content.map((b) => b.type === "text" ? b.value : "").join(" ")
    }));
  }, [transcript.messages]);

  const allMessagesFlat = useMemo(() => {
    if (sections.length > 0) {
      return sections.flatMap(s => s.messages.map(m => ({ ...m, sectionId: s.id })));
    }
    return transcript.messages.map(m => ({ ...m, sectionId: "default" }));
  }, [sections, transcript.messages]);

  // Load from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("td_bookmarks");
    if (savedBookmarks) setBookmarks(new Set(JSON.parse(savedBookmarks)));

    const savedNotes = localStorage.getItem("td_notes");
    if (savedNotes) setNotes(JSON.parse(savedNotes));

    const savedExplored = localStorage.getItem("td_explored");
    if (savedExplored) setExploredConcepts(JSON.parse(savedExplored));
  }, []);

  // Save to localStorage
  const saveBookmarks = useCallback((newBookmarks: Set<string>) => {
    setBookmarks(newBookmarks);
    localStorage.setItem("td_bookmarks", JSON.stringify([...newBookmarks]));
  }, []);

  const saveNotes = useCallback((newNotes: Record<string, string>) => {
    setNotes(newNotes);
    localStorage.setItem("td_notes", JSON.stringify(newNotes));
  }, []);

  const saveExploredConcepts = useCallback((newExplored: string[]) => {
    setExploredConcepts(newExplored);
    localStorage.setItem("td_explored", JSON.stringify(newExplored));
  }, []);

  const saveProgress = useCallback((messageId: string, sectionId: string, pct: number) => {
    const progress: UserProgress = { messageId, sectionId, pct };
    localStorage.setItem("td_progress", JSON.stringify(progress));
  }, []);

  // Intersection observers for progress tracking
  useEffect(() => {
    const msgObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const idx = allMessagesFlat.findIndex((m) => m.id === target.dataset.id);
            if (idx > -1) {
              const pct = Math.round(((idx + 1) / allMessagesFlat.length) * 100);
              setProgress(pct);
              const msg = allMessagesFlat[idx];
              saveProgress(msg.id || "", msg.sectionId, pct);
            }
          }
        });
      },
      { rootMargin: "0px 0px -60% 0px" }
    );

    Object.values(messageRefs.current).forEach((el) => {
      if (el) msgObserver.observe(el);
    });

    return () => msgObserver.disconnect();
  }, [allMessagesFlat, saveProgress]);

  // Intersection observer for sections
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            const sectionId = target.dataset.section;
            const idx = sections.findIndex((s) => s.id === sectionId);
            if (idx > -1) setCurrentSectionIndex(idx);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) sectionObserver.observe(el);
    });

    return () => sectionObserver.disconnect();
  }, [sections]);

  // Scroll hint - hide when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollHint(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJumpToSection = useCallback((sectionId: string) => {
    const el = sectionRefs.current[sectionId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleJumpToMessage = useCallback((messageId: string) => {
    const el = messageRefs.current[messageId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleJumpToConcept = useCallback((conceptKey: string) => {
    if (!exploredConcepts.includes(conceptKey)) {
      saveExploredConcepts([...exploredConcepts, conceptKey]);
    }
  }, [exploredConcepts, saveExploredConcepts]);

  const handleToggleBookmark = useCallback((messageId: string) => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(messageId)) {
      newBookmarks.delete(messageId);
    } else {
      newBookmarks.add(messageId);
    }
    saveBookmarks(newBookmarks);
  }, [bookmarks, saveBookmarks]);

  const handleSaveNote = useCallback((messageId: string, note: string) => {
    const newNotes = { ...notes };
    newNotes[messageId] = note;
    saveNotes(newNotes);
  }, [notes, saveNotes]);

  const handleDeleteNote = useCallback((messageId: string) => {
    const newNotes = { ...notes };
    delete newNotes[messageId];
    saveNotes(newNotes);
  }, [notes, saveNotes]);

  const handleStartNote = useCallback(() => {
    // Note input state is managed locally in MessageBlock
  }, []);

  const handleAskAI = useCallback((messageId: string, type: "why" | "explain" | "challenge") => {
    const replies: Record<string, string> = {
      why: "The candidate is trading strong consistency for write throughput and lower latency — reasonable here since query logs only feed an hourly batch job, not something a user reads immediately.",
      explain: "In short: writes go to a store built for handling huge volumes quickly, without needing every replica to agree instantly — that tradeoff is fine because nothing downstream needs the data right away.",
      challenge: "A fair pushback: what happens if that batch job falls behind? At 10k QPS, how stale can rankings get before autocomplete quality visibly degrades?",
    };
    setAiReplies((prev) => ({ ...prev, [messageId]: replies[type] }));
  }, []);

  const handleCollapseAiReply = useCallback((messageId: string) => {
    setAiReplies((prev) => {
      const newReplies = { ...prev };
      delete newReplies[messageId];
      return newReplies;
    });
  }, []);

  const handleExploreConcept = useCallback((conceptKey: string) => {
    if (!exploredConcepts.includes(conceptKey)) {
      saveExploredConcepts([...exploredConcepts, conceptKey]);
    }
  }, [exploredConcepts, saveExploredConcepts]);

  const handleContinueJump = useCallback(() => {
    const saved = localStorage.getItem("td_progress");
    if (saved) {
      try {
        const progress: UserProgress = JSON.parse(saved);
        handleJumpToMessage(progress.messageId);
      } catch (e) {
        console.error("Error parsing progress:", e);
      }
    }
  }, [handleJumpToMessage]);

  const concepts = transcript.metadata.concepts || {};
  const architectureSteps = transcript.metadata.architectureSteps || [];

  // Calculate actual elapsed time for default section
  const getSectionTime = (messages: TranscriptMessage[]) => {
    if (messages.length === 0) return "0:00";
    const lastMessage = messages[messages.length - 1];
    const elapsedSeconds = lastMessage.elapsedSeconds ?? 0;
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{ background: "var(--surface-page)", fontFamily: "'Inter', sans-serif", color: "var(--text-primary)" }}>
      {/* Continue Banner */}
      <ContinueBanner 
        sectionTitle={sections[currentSectionIndex]?.title || title} 
        onJump={handleContinueJump} 
      />

      {/* Header */}
      <div className="mx-auto max-w-[1300px] px-6 py-6 pb-4.5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider">
          <span style={{ color: "#5A5B66" }}>Learn</span>
          <span style={{ color: "#5A5B66" }}>›</span>
          <span style={{ color: "#5A5B66" }}>{transcript.metadata.category}</span>
          <span style={{ color: "#5A5B66" }}>›</span>
          <span style={{ color: "var(--category-concept-deep)" }}>{transcript.metadata.template}</span>
        </div>
        <h1 
          className="mt-2 text-[28px] font-extrabold leading-tight tracking-tight" 
          style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "-0.02em" }}
        >
          {title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <span 
            className="rounded-full px-3 py-1 text-[11.5px] font-semibold"
            style={{ 
              background: difficulty === "Hard" ? "rgba(255,90,60,0.12)" : "var(--surface-page)",
              color: difficulty === "Hard" ? "#FF5A3C" : "var(--text-secondary)"
            }}
          >
            {difficulty}
          </span>
          <span className="rounded-full px-3 py-1 text-[11.5px] font-semibold" style={{ background: "var(--surface-page)", color: "var(--text-secondary)" }}>
            {duration} min
          </span>
          {company && <span className="rounded-full px-3 py-1 text-[11.5px] font-semibold" style={{ background: "var(--surface-page)", color: "var(--text-secondary)" }}>
            {company}
          </span>}
        </div>
        {transcript.metadata.topics && transcript.metadata.topics.length > 0 && (
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold" style={{ color: "var(--text-secondary)" }}>Topics</span>
            {transcript.metadata.topics.map((topic) => (
              <span
                key={topic}
                className="cursor-pointer rounded-full border px-3 py-1 text-[11.5px] font-semibold"
                style={{
                  borderColor: exploredConcepts.includes(topic) ? "rgba(0,168,126,0.3)" : "var(--border)",
                  color: exploredConcepts.includes(topic) ? "#00A87E" : "var(--text-secondary)"
                }}
                onClick={() => handleJumpToConcept(topic)}
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Two-column layout */}
      <div className="mx-auto flex gap-5 px-6 py-5.5 pb-20 max-w-[1400px] items-start">
        {/* Center Transcript */}
        <div className="flex-1 min-w-0 max-w-[900px] lg:max-w-[900px] xl:max-w-[900px] 2xl:max-w-[1000px] w-full relative">
          {sections.length > 0 ? (
            sections.map((section, sectionIndex) => (
              <div key={section.id}>
                <SectionMarker title={section.title} isFirst={sectionIndex === 0} />
                <div ref={(el) => { if (el) sectionRefs.current[section.id] = el; }} data-section={section.id}>
                  {section.messages.map((message) => (
                    <div
                      key={message.id}
                      ref={(el) => { if (el && message.id) messageRefs.current[message.id] = el; }}
                      data-id={message.id}
                    >
                      <MessageBlock
                        message={message}
                        isBookmarked={bookmarks.has(message.id || "")}
                        note={notes[message.id || ""]}
                        aiReply={aiReplies[message.id || ""]}
                        concepts={concepts}
                        exploredConcepts={exploredConcepts}
                        onToggleBookmark={handleToggleBookmark}
                        onStartNote={handleStartNote}
                        onSaveNote={handleSaveNote}
                        onDeleteNote={handleDeleteNote}
                        onAskAI={handleAskAI}
                        onExploreConcept={handleExploreConcept}
                        onCollapseAiReply={handleCollapseAiReply}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            transcript.messages.map((message) => (
              <div
                key={message.id}
                ref={(el) => { if (el && message.id) messageRefs.current[message.id] = el; }}
                data-id={message.id}
              >
                <MessageBlock
                  message={message}
                  isBookmarked={bookmarks.has(message.id || "")}
                  note={notes[message.id || ""]}
                  aiReply={aiReplies[message.id || ""]}
                  concepts={concepts}
                  exploredConcepts={exploredConcepts}
                  onToggleBookmark={handleToggleBookmark}
                  onStartNote={handleStartNote}
                  onSaveNote={handleSaveNote}
                  onDeleteNote={handleDeleteNote}
                  onAskAI={handleAskAI}
                  onExploreConcept={handleExploreConcept}
                  onCollapseAiReply={handleCollapseAiReply}
                />
              </div>
            ))
          )}

          {/* Session summary */}
          {(strengths.length > 0 || gaps.length > 0) && (
            <div className="mt-9 rounded-[22px] p-5 sm:p-[26px]" style={{ background: "var(--surface-panel)", color: "var(--text-primary)" }}>
              <h3 className="mb-3.5 text-[15px] font-semibold sm:text-[16px]">How this session went</h3>
              <div className="flex flex-col gap-3 sm:flex-row">
                {strengths.length > 0 && (
                  <div className="flex-1 rounded-2xl p-3.5" style={{ background: "var(--surface-page)" }}>
                    <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wide" style={{ color: "#00D9A3" }}>
                      Strength
                    </div>
                    <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {strengths[0].explanation}
                    </p>
                  </div>
                )}
                {gaps.length > 0 && (
                  <div className="flex-1 rounded-2xl p-3.5" style={{ background: "var(--surface-page)" }}>
                    <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wide" style={{ color: "#FF8A6E" }}>
                      To work on
                    </div>
                    <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {gaps[0].explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Scroll hint indicator */}
          {showScrollHint && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg" style={{ background: "rgba(21,22,28,0.9)", color: "#fff" }}>
                <span className="text-xs font-medium">Scroll for more</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - only render if there's content */}
        <RightSidebar
          architectureSteps={architectureSteps}
          currentSectionIndex={currentSectionIndex}
          sections={sections.length > 0 ? sections : [{ id: "default", title: "Transcript", time: getSectionTime(transcript.messages), messages: transcript.messages }]}
          progress={progress}
          bookmarks={[...bookmarks]}
          allMessages={allMessages}
          exploredConcepts={exploredConcepts}
          concepts={concepts}
          onJumpToSection={handleJumpToSection}
          onJumpToMessage={handleJumpToMessage}
          onJumpToConcept={handleJumpToConcept}
        />
      </div>
    </div>
  );
}