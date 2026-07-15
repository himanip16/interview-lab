// src/features/interview/live/components/LiveInterviewSession.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useMessages } from "../hooks/useMessages";
import { useTimer } from "../hooks/useTimer";
import ChatInput from "./ChatInput";
import { Bubble } from "@/components/ui/Bubble";
import { Timer } from "@/components/ui/Timer";

export default function LiveInterviewSession({
  interviewId, duration, problemTitle, currentPhase, initialMessages, initialSummary,
}: {
  interviewId: string; duration: number; problemTitle: string; currentPhase: string;
  initialMessages: { role: string; content: string }[]; initialSummary: string;
}) {
  const { messages, sendMessage, isLoading } = useMessages(interviewId, initialMessages as any);
  const [phase, setPhase] = useState(currentPhase);
  const [summary, setSummary] = useState(initialSummary);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (text: string) => {
    const result = await sendMessage(text);
    setPhase(result.phase);
    setSummary(result.summary);
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] py-6 px-4 flex flex-col">
      <div className="max-w-[720px] w-full mx-auto flex flex-col flex-1 bg-white rounded-[32px] border border-[var(--border)] overflow-hidden">

        {/* header: phase + timer */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="body-s font-semibold">{problemTitle}</div>
          <div className="flex items-center gap-3">
            <span className="caption font-semibold bg-[var(--ink)] text-white px-3 py-1 rounded-full">{phase}</span>
            <Timer initialTime={duration * 60} />
          </div>
        </div>

        {/* collapsible summary */}
        <button
          className="text-left px-4 py-2 border-b border-[var(--border)] caption font-semibold text-[var(--mint-deep)]"
          onClick={() => setSummaryOpen(v => !v)}
        >
          {summaryOpen ? "▾ Hide design summary" : "▸ Show design summary"}
        </button>
        {summaryOpen && (
          <div className="px-4 pb-3 body-s text-[var(--ink-400)] whitespace-pre-wrap border-b border-[var(--border)]">
            {summary}
          </div>
        )}

        {/* chat, bottom-anchored */}
        <div className="flex-1 flex flex-col-reverse overflow-y-auto p-4 gap-3">
          <div ref={bottomRef} />
          {[...messages].reverse().map((m, i) => (
            <Bubble key={i} variant={m.role === "user" ? "sent" : "received"}>
              {m.content}
            </Bubble>
          ))}
        </div>

        <ChatInput onSendMessage={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}