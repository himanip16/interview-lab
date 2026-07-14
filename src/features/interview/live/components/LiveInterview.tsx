"use client";

import { useState, useEffect } from "react";

type Props = {
  interviewId: string;
  duration: number;
  initialMessages?: any[];
  interviewTitle?: string;
  designSummary?: string[];
};

export default function LiveInterview({ interviewId, duration, initialMessages = [], interviewTitle = 'System Design Interview', designSummary = [] }: Props) {
  const [messages, setMessages] = useState(initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages(prev => [...prev, { role: 'user', content: inputValue }]);
      setInputValue('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-10 px-6">
      <div className="panel max-w-[1080px] mx-auto bg-white rounded-[32px] overflow-hidden shadow-[0_24px_60px_rgba(21,22,28,0.06)] border border-[rgba(21,22,28,0.06)]">
        
        {/* Header */}
        <div className="head flex items-center justify-between p-[22px_30px] border-b border-[rgba(21,22,28,0.06)]">
          <div className="crumb flex items-center gap-2.5">
            <button className="back w-8 h-8 rounded-full border border-[rgba(21,22,28,0.1)] bg-none text-[#15161C] flex items-center justify-center cursor-pointer flex-shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M15 6l-6 6 6 6"/>
              </svg>
            </button>
            <div className="crumb-text text-[13px] text-[#5A5B66] font-medium">
              Live interview &nbsp;/&nbsp; <b className="text-[#15161C] font-semibold">{interviewTitle}</b>
            </div>
          </div>
          <div className="head-right flex items-center gap-4.5">
            <div className="live-badge flex items-center gap-1.75 text-[12px] font-semibold text-[#FF5A3C] bg-[rgba(255,90,60,0.1)] p-[6px_13px] rounded-[999px]">
              <span className="dot w-1.5 h-1.5 rounded-full bg-[#FF5A3C]">
                <style>{`
                  @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.25; }
                  }
                  .dot {
                    animation: pulse 1.6s ease-in-out infinite;
                  }
                `}</style>
              </span>
              Live
            </div>
            <div className="timer relative w-[58px] h-[58px]">
              <div className="aura absolute inset-[-10px] rounded-full bg-[radial-gradient(circle,rgba(0,217,163,0.28),transparent_70%)]">
                <style>{`
                  @keyframes breathe {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                  }
                  .aura {
                    animation: breathe 3.2s ease-in-out infinite;
                  }
                `}</style>
              </div>
              <div className="ring absolute inset-0 rounded-full bg-[#15161C] flex items-center justify-center flex-col border-[1.5px] border-[rgba(0,217,163,0.4)]">
                <div className="t font-['Poppins'] text-[13px] font-semibold text-[#00D9A3]">{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</div>
                <div className="l text-[7px] text-white/50 tracking-[0.05em] mt-0.25">LEFT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Stepper */}
        <div className="stepper flex items-center gap-1.5 p-4 border-b border-[rgba(21,22,28,0.06)] overflow-x-auto">
          <div className="step done flex items-center gap-1.5 flex-shrink-0">
            <div className="node w-[9px] h-[9px] rounded-full bg-[#00A87E]"></div>
            <span className="text-[11.5px] font-semibold text-[#5A5B66] whitespace-nowrap">Intro</span>
          </div>
          <div className="step-line w-5 h-[1px] bg-[rgba(21,22,28,0.12)] flex-shrink-0"></div>
          <div className="step active flex items-center gap-1.5 flex-shrink-0">
            <div className="node w-[9px] h-[9px] rounded-full bg-[#15161C] relative">
              <style>{`
                @keyframes breathe {
                  0%, 100% { transform: scale(1); opacity: 0.7; }
                  50% { transform: scale(1.18); opacity: 0; }
                }
                .node::after {
                  content: '';
                  position: absolute;
                  inset: -5px;
                  border-radius: 50%;
                  border: 1.5px solid rgba(21,22,28,0.35);
                  animation: breathe 2.4s ease-in-out infinite;
                }
              `}</style>
            </div>
            <span className="text-[11.5px] font-semibold text-[#15161C] whitespace-nowrap">Requirements</span>
          </div>
          <div className="step-line w-5 h-[1px] bg-[rgba(21,22,28,0.12)] flex-shrink-0"></div>
          <div className="step upcoming flex items-center gap-1.5 flex-shrink-0">
            <div className="node w-[9px] h-[9px] rounded-full border-[1.5px] border-[rgba(21,22,28,0.2)]"></div>
            <span className="text-[11.5px] font-semibold text-[#5A5B66] whitespace-nowrap">High-level design</span>
          </div>
          <div className="step-line w-5 h-[1px] bg-[rgba(21,22,28,0.12)] flex-shrink-0"></div>
          <div className="step upcoming flex items-center gap-1.5 flex-shrink-0">
            <div className="node w-[9px] h-[9px] rounded-full border-[1.5px] border-[rgba(21,22,28,0.2)]"></div>
            <span className="text-[11.5px] font-semibold text-[#5A5B66] whitespace-nowrap">Deep dive</span>
          </div>
          <div className="step-line w-5 h-[1px] bg-[rgba(21,22,28,0.12)] flex-shrink-0"></div>
          <div className="step upcoming flex items-center gap-1.5 flex-shrink-0">
            <div className="node w-[9px] h-[9px] rounded-full border-[1.5px] border-[rgba(21,22,28,0.2)]"></div>
            <span className="text-[11.5px] font-semibold text-[#5A5B66] whitespace-nowrap">Scalability</span>
          </div>
          <div className="step-line w-5 h-[1px] bg-[rgba(21,22,28,0.12)] flex-shrink-0"></div>
          <div className="step upcoming flex items-center gap-1.5 flex-shrink-0">
            <div className="node w-[9px] h-[9px] rounded-full border-[1.5px] border-[rgba(21,22,28,0.2)]"></div>
            <span className="text-[11.5px] font-semibold text-[#5A5B66] whitespace-nowrap">Closing</span>
          </div>
        </div>

        {/* Body */}
        <div className="body flex h-[520px]">
          {/* Chat */}
          <div className="chat flex-1 flex flex-col">
            <div className="messages flex-1 overflow-y-auto p-[26px_30px] flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`msg max-w-[70%] flex flex-col gap-1 ${msg.role === 'ai' ? 'ai self-start' : 'user self-end items-end'}`}>
                  <div className="who text-[10.5px] text-[#5A5B66] font-semibold p-0 1">{msg.role === 'ai' ? 'Interviewer' : 'Candidate'}</div>
                  <div className={`bubble p-[13px_16px] rounded-[18px] text-[13.5px] leading-[1.55] ${msg.role === 'ai' ? 'bg-[#F1EFEA] text-[#15161C] rounded-bl-[4px]' : 'bg-[#15161C] text-white rounded-br-[4px]'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="msg ai self-start">
                  <div className="who text-[10.5px] text-[#5A5B66] font-semibold p-0 1">Interviewer</div>
                  <div className="typing flex gap-1 p-[13px_16px] bg-[#F1EFEA] rounded-[18px] rounded-bl-[4px] w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5A5B66]">
                      <style>{`
                        @keyframes tbounce {
                          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                          30% { transform: translateY(-4px); opacity: 1; }
                        }
                        span {
                          animation: tbounce 1.2s ease-in-out infinite;
                        }
                      `}</style>
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5A5B66]" style={{ animationDelay: '0.15s' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5A5B66]" style={{ animationDelay: '0.3s' }}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="input-row flex items-center gap-2.5 p-[18px_24px] border-t border-[rgba(21,22,28,0.06)]">
              <button className="mic-btn w-[42px] h-[42px] rounded-full border border-[rgba(21,22,28,0.12)] bg-none text-[#5A5B66] flex items-center justify-center cursor-pointer flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="2" width="6" height="12" rx="3"/>
                  <path d="M5 10a7 7 0 0014 0M12 19v3"/>
                </svg>
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Explain your design&hellip;"
                className="field flex-1 border border-[rgba(21,22,28,0.1)] rounded-[999px] p-[12px_18px] text-[13.5px] font-['Inter'] outline-none focus:border-[#00A87E]"
              />
              <button
                onClick={handleSend}
                className="send-btn w-[42px] h-[42px] rounded-full border-none bg-[#00A87E] text-white flex items-center justify-center cursor-pointer flex-shrink-0 transition-transform duration-200 hover:scale-[1.06]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar flex-0-0-[260px] border-l border-[rgba(21,22,28,0.06)] p-6 overflow-y-auto">
            <div className="side-label text-[10.5px] font-bold tracking-[0.06em] text-[#00A87E] text-transform:uppercase mb-2.5">Current phase</div>
            <div className="phase-pill inline-block text-[12px] font-semibold bg-[#15161C] text-white p-[5px_13px] rounded-[999px] mb-5.5">Requirements</div>

            <div className="side-label text-[10.5px] font-bold tracking-[0.06em] text-[#00A87E] text-transform:uppercase mb-2.5">Design summary</div>
            {designSummary.length > 0 ? (
              designSummary.map((item, idx) => (
                <div key={idx} className="summary-item text-[12.5px] text-[#5A5B66] leading-[1.6] pl-3.5 relative mb-2.5">
                  <style>{`
                    .summary-item::before {
                      content: '';
                      position: absolute;
                      left: 0;
                      top: 6px;
                      width: 5px;
                      height: 5px;
                      border-radius: 50%;
                      background: #00D9A3;
                    }
                  `}</style>
                  {item}
                </div>
              ))
            ) : (
              <div className="text-[12.5px] text-[#5A5B66] leading-[1.6] pl-3.5 relative">
                No design summary available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
