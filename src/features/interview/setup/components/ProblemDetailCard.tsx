"use client";

import { useState } from "react";

type Props = {
  onClose?: () => void;
  onPlay?: () => void;
};

export default function ProblemDetailCard({ onClose, onPlay }: Props) {
  return (
    <div className="panel max-w-[1080px] mx-auto bg-white rounded-[32px] p-[36px_40px_40px] shadow-[0_24px_60px_rgba(21,22,28,0.06)] border border-[rgba(21,22,28,0.06)]">
      {/* Top Section */}
      <div className="top flex items-center justify-between mb-7 gap-6">
        <div className="logo font-['Poppins'] font-bold text-[18px] whitespace-nowrap">
          interview<span className="text-[#C97800]">.</span>lab
        </div>
        <div className="search flex-1 max-w-[340px] flex items-center gap-2.5 bg-[#FAF9F6] border border-[rgba(21,22,28,0.08)] rounded-[999px] p-[10px_18px] text-[13.5px] text-[#5A5B66]">
          <svg className="w-[15px] h-[15px] opacity-50 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.3-4.3"/>
          </svg>
          <span>Search actions&hellip;</span>
        </div>
        <div className="menu flex items-center gap-2 text-[13.5px] font-semibold text-[#5A5B66] cursor-pointer whitespace-nowrap">
          Menu
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2"/>
            <circle cx="12" cy="12" r="2"/>
            <circle cx="19" cy="12" r="2"/>
          </svg>
        </div>
      </div>

      {/* Detail Section */}
      <div className="detail flex rounded-[26px] overflow-hidden min-h-[420px]">
        {/* Left Rail */}
        <div className="rail w-[52px] flex-shrink-0 bg-[#FAF9F6] flex flex-col items-center justify-between p-5 0">
          <div className="rail-list flex flex-col gap-6.5 items-center">
            <div className="rail-item writing-mode-vertical-rl rotate-180 text-[12px] font-semibold text-[#5A5B66] tracking-[0.02em] cursor-pointer p-0.5">Bug hunting</div>
            <div className="rail-item active writing-mode-vertical-rl rotate-180 text-[12px] font-semibold text-[#15161C] tracking-[0.02em] cursor-pointer p-0.5">Live interview</div>
            <div className="rail-item writing-mode-vertical-rl rotate-180 text-[12px] font-semibold text-[#5A5B66] tracking-[0.02em] cursor-pointer p-0.5">Deep dives</div>
          </div>
          <svg className="chev w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6"/>
          </svg>
          <style>{`
            @keyframes bob {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(4px); }
            }
            .chev {
              animation: bob 2s ease-in-out infinite;
            }
          `}</style>
        </div>

        {/* Hero Section */}
        <div className="hero flex-0-0-[42%] relative bg-[linear-gradient(165deg,#FFB930,#C97800)] flex items-center justify-center">
          {/* Close Button */}
          <div className="close-wrap absolute top-[18px] right-[18px]">
            <button onClick={onClose} className="close-btn relative w-[34px] h-[34px] rounded-full border-none bg-[rgba(255,255,255,0.18)] text-white flex items-center justify-center cursor-pointer z-10">
              <div className="close-ring absolute inset-[-5px] rounded-full border-[1.5px] border-[rgba(255,255,255,0.6)]">
                <style>{`
                  @keyframes breathe {
                    0%, 100% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.22); opacity: 0; }
                  }
                  .close-ring {
                    animation: breathe 2.6s ease-in-out infinite;
                  }
                `}</style>
              </div>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 6l12 12M18 6L6 18"/>
              </svg>
            </button>
          </div>

          {/* Illustration */}
          <svg className="illust-big w-[200px] h-[200px]" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="92" fill="rgba(255,255,255,0.14)"/>
            <rect x="82" y="56" width="36" height="60" rx="18" fill="#fff"/>
            <path d="M64 96a36 36 0 0072 0" stroke="#fff" strokeWidth="7" strokeLinecap="round" fill="none"/>
            <line x1="100" y1="132" x2="100" y2="148" stroke="#fff" strokeWidth="7" strokeLinecap="round"/>
            <line x1="80" y1="148" x2="120" y2="148" stroke="#fff" strokeWidth="7" strokeLinecap="round"/>
          </svg>
          <style>{`
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
            .illust-big {
              animation: float 4.5s ease-in-out infinite;
            }
          `}</style>

          {/* Play Button */}
          <div className="play-wrap absolute bottom-[26px] left-[26px]">
            <button onClick={onPlay} className="play-btn relative w-[58px] h-[58px] rounded-full border-none bg-white text-[#C97800] flex items-center justify-center cursor-pointer z-10 shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
              <div className="play-ring absolute inset-[-8px] rounded-full border-[1.5px] border-[rgba(255,255,255,0.7)]">
                <style>{`
                  @keyframes breathe {
                    0%, 100% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.22); opacity: 0; }
                  }
                  .play-ring {
                    animation: breathe 2.4s ease-in-out infinite;
                  }
                `}</style>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="content flex-1 p-[34px_38px] flex flex-col">
          <div className="badge self-end flex items-center gap-1.5 text-[11px] font-semibold text-[#C97800] bg-[rgba(232,148,10,0.1)] p-[5px_12px] rounded-[999px] mb-auto">
            <span className="dot w-1.5 h-1.5 rounded-full bg-[#E8940A]">
              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.25; }
                }
                .dot {
                  animation: pulse 1.8s ease-in-out infinite;
                }
              `}</style>
            </span>
            Live session
          </div>

          <h2 className="text-[30px] font-bold mt-4.5">Live interview with AI</h2>
          <div className="meta text-[13px] text-[#5A5B66] mt-1 font-medium">
            Format <b className="text-[#15161C]">System design</b> &nbsp;&middot;&nbsp; Duration <b className="text-[#15161C]">45 min</b>
          </div>

          <p className="desc text-[14px] text-[#5A5B66] leading-[1.65] mt-4 max-w-[400px]">
            A real-time mock interview that adapts its follow-ups to what you actually say.
            Talk through requirements, sketch on the whiteboard, and get pushed on tradeoffs —
            then walk away with a phase-by-phase breakdown of how it went.
          </p>

          <div className="clips-label text-[12.5px] font-semibold text-[#5A5B66] mt-5.5 mb-3">Preview the phases</div>
          <div className="clips flex gap-2.5">
            <div className="clip clip1 flex-1 h-16 rounded-[14px] flex items-center justify-center text-white text-[11.5px] font-semibold gap-1.5 cursor-pointer transition-transform duration-[0.25s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1" style={{ background: 'linear-gradient(160deg,#3E6BFF,#213FCC)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 6h16M4 12h10M4 18h13"/>
              </svg>
              Requirements
            </div>
            <div className="clip clip2 flex-1 h-16 rounded-[14px] flex items-center justify-center text-white text-[11.5px] font-semibold gap-1.5 cursor-pointer transition-transform duration-[0.25s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1" style={{ background: 'linear-gradient(160deg,#00E0AB,#00A87E)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="5" width="18" height="13" rx="2"/>
                <path d="M8 21h8"/>
              </svg>
              Whiteboard
            </div>
            <div className="clip clip3 flex-1 h-16 rounded-[14px] flex items-center justify-center text-white text-[11.5px] font-semibold gap-1.5 cursor-pointer transition-transform duration-[0.25s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1" style={{ background: 'linear-gradient(160deg,#262832,#121319)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 6l-6 6 6 6M15 6l6 6-6 6"/>
              </svg>
              Wrap-up
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
