// src/features/library/components/LibraryView.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import {
  type ExperienceItem,
  type CompletedInterviewItem,
  type Tab,
} from "../types";

const VALID_TABS = new Set<Tab>([
  "problems",
  "transcripts",
  "experiences",
  "diagrams",
]);

import LibraryTabs from "./LibraryTabs";
import TranscriptList from "./TranscriptList";
import TranscriptDetail from "./TranscriptDetail";
import ExperienceList from "./ExperienceList";
import DiagramGallery from "./DiagramGallery";
import ProblemInventoryView from "@/features/interview/setup/components/ProblemInventoryView";

type Props = {
  experiences: ExperienceItem[];
  completedInterviews: CompletedInterviewItem[];
};

export default function LibraryView({ experiences, completedInterviews }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>("problems");
  const [selectedInterview, setSelectedInterview] =
    useState<CompletedInterviewItem | null>(null);

  // Initialize tab from URL parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && VALID_TABS.has(tabParam as Tab)) {
      setActiveTab(tabParam as Tab);
    }
  }, [searchParams]);

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    setSelectedInterview(null);
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 text-foreground">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Knowledge Base
          </span>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
            Personal Library
          </h1>
        </div>

        <LibraryTabs activeTab={activeTab} onTabChange={switchTab} />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Transcript detail                                                 */}
      {/* ---------------------------------------------------------------- */}
      {selectedInterview && (
        <div className="mt-8">
          <TranscriptDetail
            interview={selectedInterview}
            onBack={() => setSelectedInterview(null)}
          />
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* List views                                                        */}
      {/* ---------------------------------------------------------------- */}
      {!selectedInterview && (
        <div className="mt-8 space-y-6">
          {activeTab === "problems" && (
            <ProblemInventoryView onSelectProblem={(problemId) => {
              router.push(`/interview/setup?problemId=${problemId}`);
            }} />
          )}

          {activeTab === "transcripts" && (
            <TranscriptList
              completedInterviews={completedInterviews}
              onSelectInterview={setSelectedInterview}
            />
          )}

          {activeTab === "experiences" && (
            <ExperienceList experiences={experiences} />
          )}

          {activeTab === "diagrams" && <DiagramGallery />}
        </div>
      )}
    </main>
  );
}