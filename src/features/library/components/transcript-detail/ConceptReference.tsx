// src/features/library/components/transcript-detail/ConceptReference.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import type { Concept } from "@/features/library/types/transcript";

type Props = {
  value: string;
  conceptKey: string;
  concept: Concept;
  onExplore: (key: string) => void;
};

export function ConceptReference({ value, conceptKey, concept, onExplore }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    onExplore(conceptKey);
  };

  return (
    <span ref={ref} className="relative">
      <span
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick(e as any)}
        className="cursor-pointer border-b-[1.5px] border-dotted font-semibold"
        style={{ borderColor: "#00A87E", color: "#00A87E" }}
      >
        {value}
      </span>
      {isOpen && (
        <div
          className="absolute left-0 z-15 w-[250px] rounded-[14px] p-3.5 shadow-lg"
          style={{ 
            bottom: "calc(100% + 8px)",
            background: "#15161C",
            color: "#fff"
          }}
        >
          <div className="text-[13px] font-bold">{concept.name}</div>
          <div className="mb-2 text-[10.5px]" style={{ color: "rgba(255,255,255,0.55)" }}>
            {concept.sub}
          </div>
          <div className="mb-1 text-[9.5px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>
            Used here for
          </div>
          <ul className="m-0 list-none p-0">
            {concept.uses.map((use, index) => (
              <li
                key={index}
                className="relative pl-3.5 text-[11.5px]"
                style={{ color: "rgba(255,255,255,0.8)", marginBottom: "3px" }}
              >
                <span className="absolute left-0" style={{ color: "#00D9A3" }}>
                  ✓
                </span>
                {use}
              </li>
            ))}
          </ul>
          <div className="mt-2 text-[11.5px] font-bold" style={{ color: "#00D9A3" }}>
            Read deep dive →
          </div>
        </div>
      )}
    </span>
  );
}
