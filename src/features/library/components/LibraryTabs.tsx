// src/features/library/components/LibraryTabs.tsx
"use client";

import { Tab } from "../types";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

export default function LibraryTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex overflow-x-auto rounded-md border border-border bg-muted p-0.5">
      {(
        [
          ["problems", "Problem Library"],
          ["transcripts", "Completed Interviews"],
          ["experiences", "Interview Experiences"],
          ["diagrams", "Interactive Diagrams"],
        ] as [Tab, string][]
      ).map(([tab, label]) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`whitespace-nowrap rounded px-4 py-1.5 font-mono text-xs transition ${
            activeTab === tab
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
