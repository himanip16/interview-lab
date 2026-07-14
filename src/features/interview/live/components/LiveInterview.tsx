"use client";

import { useState } from "react";
import Timer from "./Timer";

type Props = {
  interviewId: string;
  duration: number;
  initialMessages: any[];
};

export default function LiveInterview({ interviewId, duration, initialMessages }: Props) {
  const [currentPhase, setCurrentPhase] = useState("Requirements");

  const phases = [
    { name: "Intro", status: "done" },
    { name: "Requirements", status: "active" },
    { name: "High-level design", status: "upcoming" },
    { name: "Deep dive", status: "upcoming" },
    { name: "Scalability", status: "upcoming" },
    { name: "Closing", status: "upcoming" },
  ];

  const summaryItems = [
    "Read-heavy workload assumed, ~100:1 read/write ratio.",
    "Custom aliases scoped out of v1.",
    "Candidate is leaning key-value store + cache over relational.",
    "Not yet discussed: uniqueness strategy for short codes.",
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10 px-6">
      <div className="max-w-[1080px] mx-auto bg-white rounded-[32px] overflow-hidden shadow-[0_24px_60px_rgba(21,22,28,0.06)] border border-[rgba(21,22,28,0.06)]">
        
        {/* Header */}
        <div className="head flex items-center justify-between px-[30px] py-[22px] border-b border-[rgba(21,22,28,0.06)]">
          <div className="crumb flex items-center gap-2.5">
            <button className="back w-8 h-8 rounded-full border border-[rgba(21,22,28,0.1)] bg-none text-[#15161C] flex items-center justify-center cursor-pointer flex-shrink-0 hover:bg-[rgba(21,22,28,0.05)] transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M15 6l-6 6 6 6"/>
              </svg>
            </button>
            <div className="crumb-text text-[13px] text-[#5A5B66] font-medium">
              Live interview &nbsp;/&nbsp; <b className="text-[#15161C] font-semibold">Design a URL shortener</b>
            </div>
          </div>

          <div className="head-right flex items-center gap-4.5">
            <div className="live-badge flex items-center gap-1.5 text-[12px] font-semibold text-[#FF5A3C] bg-[rgba(255,90,60,0.1)] px-3 py-1.5 rounded-[999px]">
              <span className="dot w-1.5 h-1.5 rounded-full bg-[#FF5A3C] animate-pulse"></span>
              Live
            </div>
            
            <Timer durationInMinutes={duration} interviewId={interviewId} />
          </div>
        </div>

        {/* Phase Stepper */}
        <div className="stepper flex items-center gap-1.5 px-[30px] py-4 border-b border-[rgba(21,22,28,0.06)] overflow-x-auto">
          {phases.map((phase, index) => (
            <div key={phase.name}>
              <div className={`step flex items-center gap-1.5 flex-shrink-0 ${phase.status}`}>
                <div className={`node w-[9px] h-[9px] rounded-full ${
                  phase.status === "done" ? "bg-[#00A87E]" :
                  phase.status === "active" ? "bg-[#15161C] relative" :
                  "border-[1.5px] border-[rgba(21,22,28,0.2)]"
                }`}>
                  {phase.status === "active" && (
                    <div className="absolute inset-[-5px] rounded-full border-[1.5px] border-[rgba(21,22,28,0.35)] animate-breathe"></div>
                  )}
                </div>
                <span className="text-[11.5px] font-semibold whitespace-nowrap text-[#5A5B66]">
                  {phase.name}
                </span>
              </div>
              {index < phases.length - 1 && (
                <div className="step-line w-5 h-[1px] bg-[rgba(21,22,28,0.12)] flex-shrink-0"></div>
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="body flex h-[520px]">
          {/* Chat Section */}
          <div className="chat flex-1 flex flex-col">
            <div className="messages flex-1 overflow-y-auto px-[30px] py-6 flex flex-col gap-4">
              {/* AI Message */}
              <div className="msg ai max-w-[70%] flex flex-col gap-1 self-start">
                <div className="who text-[10.5px] text-[#5A5B66] font-semibold px-1">Interviewer</div>
                <div className="bubble px-4 py-3 rounded-[18px] text-[13.5px] leading-[1.55] bg-[#F1EFEA] text-[#15161C] rounded-bl-[4px]">
                  Welcome! Today we'll design a URL shortener. Start by asking clarifying questions before you propose anything.
                </div>
              </div>

              {/* User Message */}
              <div className="msg user max-w-[70%] flex flex-col gap-1 self-end items-end">
                <div className="bubble px-4 py-3 rounded-[18px] text-[13.5px] leading-[1.55] bg-[#15161C] text-white rounded-br-[4px]">
                  Sure — what's the expected read to write ratio, and do we need custom aliases?
                </div>
              </div>

              {/* AI Message */}
              <div className="msg ai max-w-[70%] flex flex-col gap-1 self-start">
                <div className="who text-[10.5px] text-[#5A5B66] font-semibold px-1">Interviewer</div>
                <div className="bubble px-4 py-3 rounded-[18px] text-[13.5px] leading-[1.55] bg-[#F1EFEA] text-[#15161C] rounded-bl-[4px]">
                  Good question. Assume reads outnumber writes heavily, maybe 100 to 1. Custom aliases are a nice-to-have, not required for v1.
                </div>
              </div>

              {/* User Message */}
              <div className="msg user max-w-[70%] flex flex-col gap-1 self-end items-end">
                <div className="bubble px-4 py-3 rounded-[18px] text-[13.5px] leading-[1.55] bg-[#15161C] text-white rounded-br-[4px]">
                  Got it. Given that read-heavy pattern, I'd lean toward a key-value store with a cache in front rather than a relational database.
                </div>
              </div>

              {/* Typing Indicator */}
              <div className="msg ai max-w-[70%] flex flex-col gap-1 self-start">
                <div className="who text-[10.5px] text-[#5A5B66] font-semibold px-1">Interviewer</div>
                <div className="typing flex gap-1 px-4 py-3 bg-[#F1EFEA] rounded-[18px] rounded-bl-[4px] w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A5B66] animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A5B66] animate-bounce" style={{ animationDelay: "0.15s" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A5B66] animate-bounce" style={{ animationDelay: "0.3s" }}></span>
                </div>
              </div>
            </div>

            {/* Input Row */}
            <div className="input-row flex items-center gap-2.5 px-6 py-4.5 border-t border-[rgba(21,22,28,0.06)]">
              <button className="mic-btn w-10.5 h-10.5 rounded-full border border-[rgba(21,22,28,0.12)] bg-none text-[#5A5B66] flex items-center justify-center cursor-pointer flex-shrink-0 hover:bg-[rgba(21,22,28,0.05)] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="2" width="6" height="12" rx="3"/>
                  <path d="M5 10a7 7 0 0014 0M12 19v3"/>
                </svg>
              </button>
              <input 
                className="field flex-1 border border-[rgba(21,22,28,0.1)] rounded-[999px] px-4.5 py-3 text-[13.5px] font-['Inter'] outline-none focus:border-[#00A87E] transition-colors"
                placeholder="Explain your design…"
              />
              <button className="send-btn w-10.5 h-10.5 rounded-full border-none bg-[#00A87E] text-white flex items-center justify-center cursor-pointer flex-shrink-0 transition-transform hover:scale-[1.06]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar border-l border-[rgba(21,22,28,0.06)] px-5.5 py-6 overflow-y-auto" style={{ flex: "0 0 260px" }}>
            <div className="side-label text-[10.5px] font-bold tracking-[0.06em] text-[#00A87E] uppercase mb-2.5">
              Current phase
            </div>
            <div className="phase-pill inline-block text-[12px] font-semibold bg-[#15161C] text-white px-3 py-1 rounded-[999px] mb-5.5">
              {currentPhase}
            </div>

            <div className="side-label text-[10.5px] font-bold tracking-[0.06em] text-[#00A87E] uppercase mb-2.5">
              Design summary
            </div>
            {summaryItems.map((item, index) => (
              <div key={index} className="summary-item text-[12.5px] text-[#5A5B66] leading-[1.6] pl-3.5 relative mb-2.5">
                <div className="absolute left-0 top-1.5 w-1.25 h-1.25 rounded-full bg-[#00D9A3]"></div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
        .animate-pulse {
          animation: pulse 1.6s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        .animate-breathe {
          animation: breathe 2.4s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        .animate-bounce {
          animation: bounce 1.2s ease-in-out infinite;
        }
        .flex-0-0:w-260px {
          flex: 0 0 260px;
        }
        @media (max-width: 800px) {
          .sidebar {
            display: none;
          }
          .msg {
            max-width: 85%;
          }
        }
      `}</style>
    </div>
  );
}
