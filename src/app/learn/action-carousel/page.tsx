"use client";

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from '@/components/ui/Search';
import { Panel } from '@/components/ui/Panel';
import { cn } from '@/lib/utils';

const CARDS = [
  {
    id: 1,
    title: 'Bug hunting',
    meta: 'Practice · 15 min',
    gradient: 'from-[#FF6B4A] to-[#E0432A]',
    href: '/bug-hunting/checkout-timeout',
    icon: (
      <svg viewBox="0 0 84 84" fill="none">
        <circle cx="42" cy="42" r="40" fill="#fff"/>
        <ellipse cx="42" cy="46" rx="14" ry="10" fill="#FF6B4A"/>
        <circle cx="35" cy="42" r="3" fill="#26282F"/>
        <circle cx="49" cy="42" r="3" fill="#26282F"/>
        <path d="M28 34 Q22 26 16 30" stroke="#FF6B4A" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M56 34 Q62 26 68 30" stroke="#FF6B4A" strokeWidth="3" strokeLinecap="round" fill="none"/>
      </svg>
    )
  },
  {
    id: 2,
    title: 'Review a PR',
    meta: 'Practice · 30 min',
    gradient: 'from-[#3E6BFF] to-[#213FCC]',
    href: '/learn/pr-review', // TODO: Create PR review practice page
    icon: (
      <svg viewBox="0 0 84 84" fill="none">
        <circle cx="42" cy="42" r="40" fill="#fff"/>
        <rect x="26" y="24" width="32" height="36" rx="4" fill="#3E6BFF"/>
        <path d="M32 44l6 6 12-14" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    )
  },
  {
    id: 3,
    title: 'Read a transcript',
    meta: 'Library · Full session',
    gradient: 'from-[#262832] to-[#121319]',
    href: '/library/transcript',
    icon: (
      <svg viewBox="0 0 84 84" fill="none">
        <circle cx="42" cy="42" r="40" fill="#fff"/>
        <path d="M26 30h32v6H26z" fill="#262832"/>
        <path d="M26 42h24v5H26z" fill="#262832" opacity=".7"/>
        <path d="M26 52h28v5H26z" fill="#262832" opacity=".45"/>
      </svg>
    )
  },
  {
    id: 4,
    title: 'Learn whiteboarding',
    meta: 'Learn · Guided',
    gradient: 'from-[#00E0AB] to-[#00A87E]',
    href: '/learn/whiteboard',
    icon: (
      <svg viewBox="0 0 84 84" fill="none">
        <circle cx="42" cy="42" r="40" fill="#fff"/>
        <rect x="24" y="28" width="36" height="26" rx="3" fill="#00A87E"/>
        <path d="M30 40h10M30 46h16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
        <rect x="24" y="58" width="36" height="4" rx="2" fill="#00A87E" opacity=".4"/>
      </svg>
    )
  },
  {
    id: 5,
    title: 'Live interview with AI',
    meta: 'Live · 45 min',
    gradient: 'from-[#FFB930] to-[#E8940A]',
    href: '/interview/problems',
    icon: (
      <svg viewBox="0 0 84 84" fill="none">
        <circle cx="42" cy="42" r="40" fill="#fff"/>
        <rect x="35" y="24" width="14" height="24" rx="7" fill="#E8940A"/>
        <path d="M28 40a14 14 0 0028 0" stroke="#E8940A" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <line x1="42" y1="54" x2="42" y2="60" stroke="#E8940A" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    id: 6,
    title: 'Deep dives',
    meta: 'Learn · Topic-based',
    gradient: 'from-[#7A6BFF] to-[#4C3FD6]',
    href: '/interview/problems?type=deep_dive',
    icon: (
      <svg viewBox="0 0 84 84" fill="none">
        <circle cx="42" cy="42" r="40" fill="#fff"/>
        <circle cx="42" cy="42" r="6" fill="#4C3FD6"/>
        <circle cx="42" cy="42" r="13" stroke="#4C3FD6" strokeWidth="2.5" fill="none" opacity=".55"/>
        <circle cx="42" cy="42" r="20" stroke="#4C3FD6" strokeWidth="2.5" fill="none" opacity=".3"/>
      </svg>
    )
  },
  {
    id: 7,
    title: 'Build it',
    meta: 'Hands-on · Self-paced',
    gradient: 'from-[#FF4D93] to-[#D62568]',
    href: '/learn/build', // TODO: Create hands-on coding workspace page
    icon: (
      <svg viewBox="0 0 84 84" fill="none">
        <circle cx="42" cy="42" r="40" fill="#fff"/>
        <rect x="27" y="46" width="12" height="12" fill="#D62568"/>
        <rect x="39" y="34" width="12" height="24" fill="#FF4D93"/>
        <rect x="51" y="24" width="12" height="34" fill="#D62568"/>
      </svg>
    )
  },
];

export default function ActionCarouselPage() {
  const railRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scroll = (direction: 'left' | 'right') => {
    if (railRef.current) {
      railRef.current.scrollBy({
        left: direction === 'right' ? 234 : -234,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--paper)] py-12 px-6">
      <Panel variant="default" className="max-w-[1080px] mx-auto p-[36px_40px_44px]">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8.5 gap-6">
          <div className="heading-m font-semibold">
            interview<span style={{ color: 'var(--mint-deep)' }}>.</span>lab
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
        <div className="relative">
          <div 
            ref={railRef}
            className="flex gap-4.5 overflow-x-auto scroll-smooth scroll-snap-x-mandatory p-[34px_4px_8px] m-0 -mx-1 scrollbar-hide"
            style={{ scrollbarWidth: 'none' }}
          >
            {CARDS.map((card) => (
              <div
                key={card.id}
                role="button"
                tabIndex={0}
                onClick={() => router.push(card.href)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') router.push(card.href);
                }}
                className="relative flex-0-0-[216px] h-[300px] radius-card p-5.5 scroll-snap-start cursor-pointer overflow-visible transition-transform duration-[0.35s] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[-8px] flex flex-col justify-end bg-gradient-to-br"
                style={{ background: `linear-gradient(160deg, ${card.gradient.split(' ')[0]}, ${card.gradient.split(' ')[1]})` }}
              >
                <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 w-[84px] h-[84px] animate-float">
                  {card.icon}
                </div>
                <h3 className="text-white body-s font-semibold mb-1">{card.title}</h3>
                <div className="flex items-center gap-1.5 caption text-white/75 font-medium">
                  <span className="w-1 h-1 radius-full bg-white/60" />
                  {card.meta}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-5">
          <div className="flex gap-4.5 body-s text-[var(--ink-400)] font-medium">
            <span>Facebook</span>
            <span>Twitter</span>
          </div>
          <div className="flex items-center gap-4">
            <span 
              className="body-s text-[var(--ink-400)] font-semibold cursor-pointer flex items-center gap-1.5"
              onClick={() => scroll('left')}
            >
              ← Prev
            </span>
            <button 
              className="relative w-[46px] h-[46px] radius-pill border-none bg-[var(--ink)] text-white flex items-center justify-center cursor-pointer z-10"
              onClick={() => scroll('right')}
            >
              <div className="absolute inset-[-6px] radius-pill border-[1.5px] border-[rgba(0,168,126,0.5)] animate-breathe" />
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
