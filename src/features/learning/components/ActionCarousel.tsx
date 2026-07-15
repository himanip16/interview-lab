"use client";

import { useRef } from "react";

export default function ActionCarousel() {
  const railRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (railRef.current) {
      const scrollAmount = 234;
      railRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="panel max-w-[1080px] mx-auto bg-white rounded-[32px] p-[36px_40px_44px] shadow-[0_24px_60px_rgba(21,22,28,0.06)] border border-[rgba(21,22,28,0.06)]">
      {/* Top Section */}
      <div className="top flex items-center justify-between mb-[34px] gap-6">
        <div className="logo font-['Poppins'] font-bold text-[18px] whitespace-nowrap">
          interview<span className="text-[var(--mint-deep)]">.</span>lab
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

      {/* Carousel Section */}
      <div className="rail-wrap relative">
        <div
          ref={railRef}
          className="rail flex gap-[18px] overflow-x-auto scroll-smooth scroll-snap-x-mandatory p-[34px_4px_8px] m-0 -mx-1"
          style={{
            scrollbarWidth: "none",
          }}
        >
          <style>{`
            .rail::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          {/* Card 1 */}
          <div className="card c1 relative flex-shrink-0 w-[216px] h-[300px] rounded-[26px] p-[22px] scroll-snap-start cursor-pointer overflow-visible transition-transform duration-[0.35s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 flex flex-col justify-end" style={{ background: 'linear-gradient(160deg,#FF6B4A,#E0432A)' }}>
            <svg className="icon-float absolute -top-[30px] left-1/2 -translate-x-1/2 w-[84px] h-[84px]" viewBox="0 0 84 84" fill="none">
              <circle cx="42" cy="42" r="40" fill="#fff"/>
              <ellipse cx="42" cy="46" rx="14" ry="10" fill="#FF6B4A"/>
              <circle cx="35" cy="42" r="3" fill="#26282F"/>
              <circle cx="49" cy="42" r="3" fill="#26282F"/>
              <path d="M28 34 Q22 26 16 30" stroke="#FF6B4A" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <path d="M56 34 Q62 26 68 30" stroke="#FF6B4A" strokeWidth="3" strokeLinecap="round" fill="none"/>
            </svg>
            <style>{`
              @keyframes float {
                0%, 100% { transform: translateX(-50%) translateY(0); }
                50% { transform: translateX(-50%) translateY(-8px); }
              }
              .icon-float {
                animation: float 4.5s ease-in-out infinite;
              }
            `}</style>
            <h3 className="text-white text-[16.5px] font-semibold mb-1">Bug hunting</h3>
            <div className="meta flex items-center gap-1.5 text-[11.5px] text-white/75 font-medium">
              <span>Practice</span>
              <span className="dot w-1 h-1 rounded-full bg-white/60"></span>
              <span>15 min</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card c2 relative flex-shrink-0 w-[216px] h-[300px] rounded-[26px] p-[22px] scroll-snap-start cursor-pointer overflow-visible transition-transform duration-[0.35s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 flex flex-col justify-end" style={{ background: 'linear-gradient(160deg,#3E6BFF,#213FCC)' }}>
            <svg className="icon-float absolute -top-[30px] left-1/2 -translate-x-1/2 w-[84px] h-[84px]" viewBox="0 0 84 84" fill="none">
              <circle cx="42" cy="42" r="40" fill="#fff"/>
              <rect x="26" y="24" width="32" height="36" rx="4" fill="#3E6BFF"/>
              <path d="M32 44l6 6 12-14" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <h3 className="text-white text-[16.5px] font-semibold mb-1">Review a PR</h3>
            <div className="meta flex items-center gap-1.5 text-[11.5px] text-white/75 font-medium">
              <span>Practice</span>
              <span className="dot w-1 h-1 rounded-full bg-white/60"></span>
              <span>30 min</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card c3 relative flex-shrink-0 w-[216px] h-[300px] rounded-[26px] p-[22px] scroll-snap-start cursor-pointer overflow-visible transition-transform duration-[0.35s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 flex flex-col justify-end" style={{ background: 'linear-gradient(160deg,#262832,#121319)' }}>
            <svg className="icon-float absolute -top-[30px] left-1/2 -translate-x-1/2 w-[84px] h-[84px]" viewBox="0 0 84 84" fill="none">
              <circle cx="42" cy="42" r="40" fill="#fff"/>
              <path d="M26 30h32v6H26z" fill="#262832"/>
              <path d="M26 42h24v5H26z" fill="#262832" opacity="0.7"/>
              <path d="M26 52h28v5H26z" fill="#262832" opacity="0.45"/>
            </svg>
            <h3 className="text-white text-[16.5px] font-semibold mb-1">Read a transcript</h3>
            <div className="meta flex items-center gap-1.5 text-[11.5px] text-white/75 font-medium">
              <span>Library</span>
              <span className="dot w-1 h-1 rounded-full bg-white/60"></span>
              <span>Full session</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="card c4 relative flex-shrink-0 w-[216px] h-[300px] rounded-[26px] p-[22px] scroll-snap-start cursor-pointer overflow-visible transition-transform duration-[0.35s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 flex flex-col justify-end" style={{ background: 'linear-gradient(160deg,#00E0AB,#00A87E)' }}>
            <svg className="icon-float absolute -top-[30px] left-1/2 -translate-x-1/2 w-[84px] h-[84px]" viewBox="0 0 84 84" fill="none">
              <circle cx="42" cy="42" r="40" fill="#fff"/>
              <rect x="24" y="28" width="36" height="26" rx="3" fill="#00A87E"/>
              <path d="M30 40h10M30 46h16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              <rect x="24" y="58" width="36" height="4" rx="2" fill="#00A87E" opacity="0.4"/>
            </svg>
            <h3 className="text-white text-[16.5px] font-semibold mb-1">Learn whiteboarding</h3>
            <div className="meta flex items-center gap-1.5 text-[11.5px] text-white/75 font-medium">
              <span>Learn</span>
              <span className="dot w-1 h-1 rounded-full bg-white/60"></span>
              <span>Guided</span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="card c5 relative flex-shrink-0 w-[216px] h-[300px] rounded-[26px] p-[22px] scroll-snap-start cursor-pointer overflow-visible transition-transform duration-[0.35s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 flex flex-col justify-end" style={{ background: 'linear-gradient(160deg,#FFB930,#E8940A)' }}>
            <svg className="icon-float absolute -top-[30px] left-1/2 -translate-x-1/2 w-[84px] h-[84px]" viewBox="0 0 84 84" fill="none">
              <circle cx="42" cy="42" r="40" fill="#fff"/>
              <rect x="35" y="24" width="14" height="24" rx="7" fill="#E8940A"/>
              <path d="M28 40a14 14 0 0028 0" stroke="#E8940A" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <line x1="42" y1="54" x2="42" y2="60" stroke="#E8940A" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <h3 className="text-white text-[16.5px] font-semibold mb-1">Live interview with AI</h3>
            <div className="meta flex items-center gap-1.5 text-[11.5px] text-white/75 font-medium">
              <span>Live</span>
              <span className="dot w-1 h-1 rounded-full bg-white/60"></span>
              <span>45 min</span>
            </div>
          </div>

          {/* Card 6 */}
          <div className="card c6 relative flex-shrink-0 w-[216px] h-[300px] rounded-[26px] p-[22px] scroll-snap-start cursor-pointer overflow-visible transition-transform duration-[0.35s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 flex flex-col justify-end" style={{ background: 'linear-gradient(160deg,#7A6BFF,#4C3FD6)' }}>
            <svg className="icon-float absolute -top-[30px] left-1/2 -translate-x-1/2 w-[84px] h-[84px]" viewBox="0 0 84 84" fill="none">
              <circle cx="42" cy="42" r="40" fill="#fff"/>
              <circle cx="42" cy="42" r="6" fill="#4C3FD6"/>
              <circle cx="42" cy="42" r="13" stroke="#4C3FD6" strokeWidth="2.5" fill="none" opacity="0.55"/>
              <circle cx="42" cy="42" r="20" stroke="#4C3FD6" strokeWidth="2.5" fill="none" opacity="0.3"/>
            </svg>
            <h3 className="text-white text-[16.5px] font-semibold mb-1">Deep dives</h3>
            <div className="meta flex items-center gap-1.5 text-[11.5px] text-white/75 font-medium">
              <span>Learn</span>
              <span className="dot w-1 h-1 rounded-full bg-white/60"></span>
              <span>Topic-based</span>
            </div>
          </div>

          {/* Card 7 */}
          <div className="card c7 relative flex-shrink-0 w-[216px] h-[300px] rounded-[26px] p-[22px] scroll-snap-start cursor-pointer overflow-visible transition-transform duration-[0.35s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 flex flex-col justify-end" style={{ background: 'linear-gradient(160deg,#FF4D93,#D62568)' }}>
            <svg className="icon-float absolute -top-[30px] left-1/2 -translate-x-1/2 w-[84px] h-[84px]" viewBox="0 0 84 84" fill="none">
              <circle cx="42" cy="42" r="40" fill="#fff"/>
              <rect x="27" y="46" width="12" height="12" fill="#D62568"/>
              <rect x="39" y="34" width="12" height="24" fill="#FF4D93"/>
              <rect x="51" y="24" width="12" height="34" fill="#D62568"/>
            </svg>
            <h3 className="text-white text-[16.5px] font-semibold mb-1">Build it</h3>
            <div className="meta flex items-center gap-1.5 text-[11.5px] text-white/75 font-medium">
              <span>Hands-on</span>
              <span className="dot w-1 h-1 rounded-full bg-white/60"></span>
              <span>Self-paced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bottom flex items-center justify-between mt-5">
        <div className="socials flex gap-[18px] text-[13px] text-[#5A5B66] font-medium">
          <span>Facebook</span>
          <span>Twitter</span>
        </div>
        <div className="nav-btns flex items-center gap-4">
          <span
            onClick={() => scroll("left")}
            className="prev text-[13px] text-[#5A5B66] font-semibold cursor-pointer flex items-center gap-1.5"
          >
            &larr; Prev
          </span>
          <button
            onClick={() => scroll("right")}
            className="next-btn relative w-[46px] h-[46px] rounded-full border-none bg-[#15161C] text-white flex items-center justify-center cursor-pointer z-10"
          >
            <div className="next-ring absolute inset-[-6px] rounded-full border-[1.5px] border-[rgba(0,168,126,0.5)]">
              <style>{`
                @keyframes breathe {
                  0%, 100% { transform: scale(1); opacity: 0.7; }
                  50% { transform: scale(1.18); opacity: 0; }
                }
                .next-ring {
                  animation: breathe 2.6s ease-in-out infinite;
                }
              `}</style>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 6l6 6-6 6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
