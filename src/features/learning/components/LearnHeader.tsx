"use client";

import { Search } from "@/components/ui/Search";
import { BRANDING, getNavigationLinks } from "../config/branding";

interface LearnHeaderProps {
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

export function LearnHeader({ onSearch, showSearch = true }: LearnHeaderProps) {
  const navLinks = getNavigationLinks();

  return (
    <div className="flex items-center justify-between mb-8.5 gap-6">
      <div className="heading-m font-semibold">
        {BRANDING.app.name}
      </div>
      
      {showSearch && (
        <Search
          placeholder="Search actions…"
          className="flex-1 max-w-[340px]"
          onSearch={onSearch || (() => {})}
        />
      )}
      
      <div className="flex items-center gap-4">
        {navLinks.map((link) => (
          <div
            key={link.label}
            className={`body-s font-semibold cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              link.disabled 
                ? "text-[var(--ink-200)] cursor-not-allowed" 
                : "text-[var(--ink-400)] hover:text-[var(--ink)]"
            }`}
            onClick={() => {
              if (!link.disabled && link.href !== "#") {
                window.location.href = link.href;
              }
            }}
            role={link.disabled ? "none" : "button"}
            tabIndex={link.disabled ? -1 : 0}
          >
            {link.label}
            {link.label === "Menu" && (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="19" cy="12" r="2"/>
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
