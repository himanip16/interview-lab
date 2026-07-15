"use client";
import { useState } from "react";
import type { BugScenario } from "../types/Scenario";

export type TabId = "logs" | "sql" | "code" | "docs" | "deploys";

export function useInvestigation(scenario: BugScenario | null) {
  const [activeTab, setActiveTab] = useState<TabId>("logs");
  const [activeFileKey, setActiveFileKey] = useState<string>(scenario?.files[0]?.key ?? "");
  const [hypothesis, setHypothesis] = useState("");
  const [sqlQuery, setSqlQuery] = useState(scenario?.defaultSqlQuery ?? "");

  return {
    activeTab, setActiveTab,
    activeFileKey, setActiveFileKey,
    hypothesis, setHypothesis,
    sqlQuery, setSqlQuery,
  };
}