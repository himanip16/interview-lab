"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/shared/utils/utils";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import { SORT_OPTIONS, SORT_LABELS, type SortOption } from "../types/problem";

type Props = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

export default function SortDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useClickOutside(dropdownRef, () => setOpen(false), open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleArrowNav = (e: React.KeyboardEvent, index: number) => {
    const buttons = dropdownRef.current?.querySelectorAll("button") ?? [];
    if (e.key === "ArrowDown") {
      e.preventDefault();
      (buttons[(index + 1) % SORT_OPTIONS.length] as HTMLButtonElement)?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      (buttons[(index - 1 + SORT_OPTIONS.length) % SORT_OPTIONS.length] as HTMLButtonElement)?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(SORT_OPTIONS[index]);
      setOpen(false);
      triggerRef.current?.focus();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
            requestAnimationFrame(() => {
              (dropdownRef.current?.querySelector("button") as HTMLButtonElement)?.focus();
            });
          }
        }}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-2 body-s font-semibold p-[8px_14px] radius-pill border border-[var(--border)] bg-[var(--surface)] cursor-pointer text-[var(--ink)]"
      >
        {SORT_LABELS[value]}
        <svg className="w-[11px] h-[11px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] bg-[var(--surface)] radius-card border border-[var(--border)] shadow-floating p-2 z-10 min-w-[170px]"
        >
          {SORT_OPTIONS.map((option, i) => (
            <button
              key={option}
              role="menuitem"
              tabIndex={i === 0 ? 0 : -1}
              onClick={() => {
                onChange(option);
                setOpen(false);
                triggerRef.current?.focus();
              }}
              onKeyDown={(e) => handleArrowNav(e, i)}
              className={cn(
                "block w-full text-left body-s p-[8px_12px] radius-small cursor-pointer text-[var(--ink-400)] font-medium",
                value === option ? "text-[var(--ink)] font-semibold" : "hover:bg-[var(--paper-100)]"
              )}
            >
              {SORT_LABELS[option]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}