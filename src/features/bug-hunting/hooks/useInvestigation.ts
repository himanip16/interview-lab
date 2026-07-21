"use client";

import { useEffect, useState } from "react";
import type { BugScenario } from "@/features/bug-hunting/domain/entities/BugScenario";

export type TabId =
  | "logs"
  | "sql"
  | "database"
  | "code"
  | "docs"
  | "deployments";

export function useInvestigation(
  scenario: BugScenario | null
) {
  const [activeTab, setActiveTab] = useState<TabId>("logs");

  const [activeFileKey, setActiveFileKey] = useState("");

  const [hypothesis, setHypothesis] = useState("");

  const [databaseQuery, setDatabaseQuery] = useState("");

  useEffect(() => {
    if (!scenario) return;

    setActiveFileKey(
      scenario.code[0]?.key ?? ""
    );

    setDatabaseQuery(
  scenario.database.initialQueries[0]?.query ?? ""
);
  }, [scenario]);

  return {
    activeTab,
    setActiveTab,

    activeFileKey,
    setActiveFileKey,

    hypothesis,
    setHypothesis,

    databaseQuery,
    setDatabaseQuery,
  };
}