"use client";

import { getSocialLinks } from "../config/branding";

interface LearnFooterProps {
  onPrev?: () => void;
  onNext?: () => void;
  showNavigation?: boolean;
}

export function LearnFooter({ onPrev, onNext, showNavigation = true }: LearnFooterProps) {
  const socialLinks = getSocialLinks();

  return (
    <div className="flex items-center justify-between mt-5">
      <div className="flex body-s text-[var(--ink-400)] font-medium" style={{ gap: '18px' }}>
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`${
              link.disabled 
                ? "cursor-not-allowed text-[var(--ink-200)]" 
                : "hover:text-[var(--ink)] cursor-pointer"
            }`}
            onClick={(e) => {
              if (link.disabled) {
                e.preventDefault();
              }
            }}
            role={link.disabled ? "none" : "link"}
            tabIndex={link.disabled ? -1 : 0}
          >
            {link.label}
          </a>
        ))}
      </div>
      
      {showNavigation && (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onPrev}
            disabled={!onPrev}
            className="body-s text-[var(--ink-400)] font-semibold cursor-pointer flex items-center gap-1.5 bg-transparent border-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!onNext}
            className="relative w-[46px] h-[46px] rounded-full border-none bg-[var(--ink)] text-white flex items-center justify-center cursor-pointer z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-[-6px] rounded-full border-[1.5px] border-[rgba(0,168,126,0.5)] animate-breathe" />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 6l6 6-6 6"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
