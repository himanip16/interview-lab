"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import {
  type ExperienceItem,
  type CompletedInterviewItem,
  type Tab,
} from "../types";

import LibraryTabs from "./LibraryTabs";
import ExperienceList from "./ExperienceList";
import DiagramGallery from "./DiagramGallery";

const VALID_TABS = new Set<Tab>([
  "experiences",
  "diagrams",
]);

type Props = {
  experiences: ExperienceItem[];
  completedInterviews: CompletedInterviewItem[];
};

export default function LibraryView({
  experiences,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] =
    useState<Tab>("experiences");

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (tab && VALID_TABS.has(tab as Tab)) {
      setActiveTab(tab as Tab);
    }
  }, [searchParams]);

  function switchTab(tab: Tab) {
    setActiveTab(tab);

    router.replace(`/library?tab=${tab}`);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Knowledge Base
          </span>

          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Personal Library
          </h1>
        </div>

        <LibraryTabs
          activeTab={activeTab}
          onTabChange={switchTab}
        />
      </div>

      <div className="mt-8">
        {activeTab === "experiences" && (
          <ExperienceList
            experiences={experiences}
          />
        )}

        {activeTab === "diagrams" && (
          <DiagramGallery />
        )}
      </div>
    </main>
  );
}