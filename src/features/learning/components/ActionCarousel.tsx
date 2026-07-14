"use client";

import { useRef, useState } from "react";
import { cn } from "@/src/lib/utils";
import type { Action } from "../types/learning";

export interface CarouselItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  gradientClass: string;
  icon: React.ReactNode;
}

type Props = {
  items: CarouselItem[];
  onCardClick?: (item: CarouselItem) => void;
};

const GRADIENTS = [
  "bg-gradient-to-br from-[#FF6B4A] to-[#E0432A]",
  "bg-gradient-to-br from-[#3E6BFF] to-[#213FCC]",
  "bg-gradient-to-br from-[#262832] to-[#121319]",
  "bg-gradient-to-br from-[#00E0AB] to-[#00A87E]",
  "bg-gradient-to-br from-[#FFB930] to-[#E8940A]",
  "bg-gradient-to-br from-[#7A6BFF] to-[#4C3FD6]",
  "bg-gradient-to-br from-[#FF4D93] to-[#D62568]",
];

// Helper function to convert Action to CarouselItem
export function actionToCarouselItem(action: Action, index: number): CarouselItem {
  const gradient = GRADIENTS[index % GRADIENTS.length];
  
  // Icon based on action type
  const getIcon = () => {
    switch (action.type) {
      case "OBSERVE":
        return (
          <svg viewBox="0 0 84 84" fill="none">
            <circle cx="42" cy="42" r="40" fill="#fff"/>
            <ellipse cx="42" cy="46" rx="14" ry="10" fill="#FF6B4A"/>
            <circle cx="35" cy="42" r="3" fill="#26282F"/>
            <circle cx="49" cy="42" r="3" fill="#26282F"/>
            <path d="M28 34 Q22 26 16 30" stroke="#FF6B4A" strokeWidth="3" strokeLinecap="round" fill="none"/>
            <path d="M56 34 Q62 26 68 30" stroke="#FF6B4A" strokeWidth="3" strokeLinecap="round" fill="none"/>
          </svg>
        );
      case "JUDGE":
        return (
          <svg viewBox="0 0 84 84" fill="none">
            <circle cx="42" cy="42" r="40" fill="#fff"/>
            <rect x="26" y="24" width="32" height="36" rx="4" fill="#3E6BFF"/>
            <path d="M32 44l6 6 12-14" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        );
      case "FIX":
        return (
          <svg viewBox="0 0 84 84" fill="none">
            <circle cx="42" cy="42" r="40" fill="#fff"/>
            <path d="M26 30h32v6H26z" fill="#262832"/>
            <path d="M26 42h24v5H26z" fill="#262832" opacity="0.7"/>
            <path d="M26 52h28v5H26z" fill="#262832" opacity="0.45"/>
          </svg>
        );
      case "PREDICT":
        return (
          <svg viewBox="0 0 84 84" fill="none">
            <circle cx="42" cy="42" r="40" fill="#fff"/>
            <rect x="24" y="28" width="36" height="26" rx="3" fill="#00A87E"/>
            <path d="M30 40h10M30 46h16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
            <rect x="24" y="58" width="36" height="4" rx="2" fill="#00A87E" opacity="0.4"/>
          </svg>
        );
      case "COMPARE":
        return (
          <svg viewBox="0 0 84 84" fill="none">
            <circle cx="42" cy="42" r="40" fill="#fff"/>
            <circle cx="42" cy="42" r="6" fill="#4C3FD6"/>
            <circle cx="42" cy="42" r="13" stroke="#4C3FD6" strokeWidth="2.5" fill="none" opacity="0.55"/>
            <circle cx="42" cy="42" r="20" stroke="#4C3FD6" strokeWidth="2.5" fill="none" opacity="0.3"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 84 84" fill="none">
            <circle cx="42" cy="42" r="40" fill="#fff"/>
            <circle cx="42" cy="42" r="6" fill="#4C3FD6"/>
            <circle cx="42" cy="42" r="13" stroke="#4C3FD6" strokeWidth="2.5" fill="none" opacity="0.55"/>
            <circle cx="42" cy="42" r="20" stroke="#4C3FD6" strokeWidth="2.5" fill="none" opacity="0.3"/>
          </svg>
        );
    }
  };

  return {
    id: action.id,
    title: action.title,
    category: action.type,
    duration: "15 min", // Default duration, can be customized
    gradientClass: gradient,
    icon: getIcon(),
  };
}

export default function ActionCarousel({ items, onCardClick }: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (railRef.current) {
      const scrollAmount = 234; // card width (216) + gap (18)
      railRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Rail Container */}
      <div className="rail-wrap relative">
        <div
          ref={railRef}
          className="rail flex gap-[18px] overflow-x-auto scroll-smooth scroll-snap-x-mandatory px-[4px] py-[34px] pb-2 mx-[-4px] scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={() => onCardClick?.(item)}
              className={cn(
                "card relative flex-shrink-0 w-[216px] h-[300px] rounded-[26px] p-[22px]",
                "scroll-snap-start cursor-pointer overflow-visible",
                "transition-transform duration-[0.35s] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                "hover:-translate-y-2 flex flex-col justify-end",
                GRADIENTS[index % GRADIENTS.length]
              )}
            >
              {/* Floating Icon */}
              <div className="icon-float absolute -top-[30px] left-1/2 -translate-x-1/2 w-[84px] h-[84px] animate-float">
                {item.icon}
              </div>

              {/* Card Content */}
              <h3 className="text-white text-[16.5px] font-semibold mb-1">{item.title}</h3>
              <div className="meta flex items-center gap-1.5 text-[11.5px] text-white/75 font-medium">
                <span>{item.category}</span>
                <span className="dot w-1 h-1 rounded-full bg-white/60"></span>
                <span>{item.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="bottom flex items-center justify-between mt-5">
        <div className="socials flex gap-[18px] text-[13px] text-[#5A5B66] font-medium">
          <span>Facebook</span>
          <span>Twitter</span>
        </div>
        <div className="nav-btns flex items-center gap-4">
          <button
            onClick={() => scroll("left")}
            className="prev text-[13px] text-[#5A5B66] font-semibold cursor-pointer flex items-center gap-1.5 hover:text-[#15161C] transition-colors"
          >
            <span>&larr;</span>
            <span>Prev</span>
          </button>
          <button
            onClick={() => scroll("right")}
            className="next-btn relative w-[46px] h-[46px] rounded-full border-none bg-[#15161C] text-white flex items-center justify-center cursor-pointer z-10 hover:bg-[#262832] transition-colors"
          >
            <div className="next-ring absolute inset-[-6px] rounded-full border-[1.5px] border-[rgba(0,168,126,0.5)] animate-breathe"></div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 6l6 6-6 6"/>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes float {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-8px);
          }
        }
        .animate-float {
          animation: float 4.5s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.18);
            opacity: 0;
          }
        }
        .animate-breathe {
          animation: breathe 2.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
