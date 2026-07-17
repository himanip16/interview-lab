"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "@/components/ui/Search";
import { Panel } from "@/components/ui/Panel";

const CARD_WIDTH = 380;
const GAP = 18; // px, matches gap-4.5

const CARDS = [
  {
  id: 1,
  title: "Bug hunting",
  meta: "Practice · 15 min",
  description: "Find production bugs from real systems.",
  from: "#FF6B4A",
  to: "#E0432A",
  href: "/bug-hunting",
  icon: (
    <svg viewBox="0 0 110 110" fill="none">
      <circle cx="55" cy="55" r="52" fill="#fff"/>
      <ellipse cx="55" cy="60" rx="18" ry="13" fill="#FF6B4A"/>
      <circle cx="46" cy="55" r="4" fill="#26282F"/>
      <circle cx="64" cy="55" r="4" fill="#26282F"/>
      <path d="M37 45 Q29 34 21 39" stroke="#FF6B4A" strokeWidth="4" strokeLinecap="round" fill="none"/>
      <path d="M73 45 Q81 34 89 39" stroke="#FF6B4A" strokeWidth="4" strokeLinecap="round" fill="none"/>
    </svg>
  ),
},
  {
    id: 2,
    title: "Review a PR",
    meta: "Practice · 30 min",
    description: "Practice code review on real pull requests.",
    from: "#3E6BFF",
    to: "#213FCC",
    href: "#", // Disabled - route doesn't exist yet
    icon: (
      <svg viewBox="0 0 110 110" fill="none">
        <circle cx="55" cy="55" r="52" fill="#fff"/>
        <rect x="34" y="31" width="42" height="47" rx="5" fill="#3E6BFF"/>
        <path d="M42 58l8 8 16-18" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
  },
  {
    id: 3,
    title: "Read a transcript",
    meta: "Library · Full session",
    description: "Study real interview conversations.",
    from: "#262832",
    to: "#121319",
    href: "/library/transcript", // exact match — the sample transcript page
    icon: (
      <svg viewBox="0 0 110 110" fill="none">
        <circle cx="55" cy="55" r="52" fill="#fff"/>
        <path d="M34 39h42v8H34z" fill="#262832"/>
        <path d="M34 55h32v7H34z" fill="#262832" opacity=".7"/>
        <path d="M34 69h38v7H34z" fill="#262832" opacity=".45"/>
      </svg>
    ),
  },
  {
    id: 4,
    title: "Learn whiteboarding",
    meta: "Learn · Guided",
    description: "Master system design whiteboarding.",
    from: "#00E0AB",
    to: "#00A87E",
    href: "/learn/whiteboard", // exact match
    icon: (
      <svg viewBox="0 0 110 110" fill="none">
        <circle cx="55" cy="55" r="52" fill="#fff"/>
        <rect x="31" y="37" width="47" height="34" rx="4" fill="#00A87E"/>
        <path d="M39 52h13M39 60h21" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
        <rect x="31" y="76" width="47" height="5" rx="2.5" fill="#00A87E" opacity=".4"/>
      </svg>
    ),
  },
  {
    id: 5,
    title: "Live interview with AI",
    meta: "Live · 45 min",
    description: "Practice with an AI interviewer.",
    from: "#FFB930",
    to: "#E8940A",
    href: "/interview/problems", // exact match — the general setup flow
    icon: (
      <svg viewBox="0 0 110 110" fill="none">
        <circle cx="55" cy="55" r="52" fill="#fff"/>
        <rect x="46" y="31" width="18" height="31" rx="9" fill="#E8940A"/>
        <path d="M37 52a18 18 0 0036 0" stroke="#E8940A" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <line x1="55" y1="70" x2="55" y2="78" stroke="#E8940A" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 6,
    title: "Deep dives",
    meta: "Learn · Topic-based",
    description: "Deep dive into specific topics.",
    from: "#7A6BFF",
    to: "#4C3FD6",
    href: "/interview/problems?type=deep_dive", // matches InterviewTemplate slug "deep_dive"
    icon: (
      <svg viewBox="0 0 110 110" fill="none">
        <circle cx="55" cy="55" r="52" fill="#fff"/>
        <circle cx="55" cy="55" r="8" fill="#4C3FD6"/>
        <circle cx="55" cy="55" r="17" stroke="#4C3FD6" strokeWidth="3" fill="none" opacity=".55"/>
        <circle cx="55" cy="55" r="26" stroke="#4C3FD6" strokeWidth="3" fill="none" opacity=".3"/>
      </svg>
    ),
  },
  {
    id: 7,
    title: "Build it",
    meta: "Hands-on · Self-paced",
    description: "Build real systems from scratch.",
    from: "#FF4D93",
    to: "#D62568",
    href: "#", // Disabled - route doesn't exist yet
    icon: (
      <svg viewBox="0 0 110 110" fill="none">
        <circle cx="55" cy="55" r="52" fill="#fff"/>
        <rect x="35" y="60" width="16" height="16" fill="#D62568"/>
        <rect x="51" y="44" width="16" height="32" fill="#FF4D93"/>
        <rect x="67" y="31" width="16" height="45" fill="#D62568"/>
      </svg>
    ),
  },
];

export default function LearnPage() {
  const railRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scroll = (direction: "left" | "right") => {
    if (railRef.current) {
      railRef.current.scrollBy({
        left: direction === "right" ? CARD_WIDTH + GAP : -(CARD_WIDTH + GAP),
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] py-12 px-6">
      <Panel variant="default" className="max-w-[1500px] mx-auto p-[36px_40px_44px]">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8.5 gap-6">
          <div className="heading-m font-semibold">
            interview<span style={{ color: "var(--mint-deep)" }}>.</span>lab
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

        {/* Carousel */}
        <div
          ref={railRef}
          className="flex gap-4.5 overflow-x-auto scroll-smooth snap-x snap-mandatory p-[34px_4px_8px] m-0 -mx-1"
          style={{ scrollbarWidth: "none" }}
        >
          {CARDS.map((card) => (
            <div
              key={card.id}
              role="button"
              tabIndex={0}
              onClick={() => router.push(card.href)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") router.push(card.href);
              }}
              className="relative flex-none snap-start cursor-pointer overflow-visible transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 flex flex-col justify-end p-6"
              style={{
                width: CARD_WIDTH,
                height: 360,
                borderRadius: "26px",
                background: `linear-gradient(160deg, ${card.from}, ${card.to})`,
              }}
            >
              <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 w-[110px] h-[110px] animate-float">
                {card.icon}
              </div>
              <h3 className="text-white body-s font-semibold mb-1 text-2xl">{card.title}</h3>
              {card.description && (
                <p className="text-white/90 text-sm leading-relaxed mb-2">
                  {card.description}
                </p>
              )}
              <div className="flex items-center gap-1.5 caption text-white/75 font-medium">
                <span className="w-1 h-1 rounded-full bg-white/60" />
                {card.meta}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5">
          <div className="flex gap-4.5 body-s text-[var(--ink-400)] font-medium">
            <span>Facebook</span>
            <span>Twitter</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="body-s text-[var(--ink-400)] font-semibold cursor-pointer flex items-center gap-1.5 bg-transparent border-none"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="relative w-[46px] h-[46px] rounded-full border-none bg-[var(--ink)] text-white flex items-center justify-center cursor-pointer z-10"
            >
              <div className="absolute inset-[-6px] rounded-full border-[1.5px] border-[rgba(0,168,126,0.5)] animate-breathe" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 6l6 6-6 6"/>
              </svg>
            </button>
          </div>
        </div>
      </Panel>
    </div>
  );
}