"use client";

import { useMemo, useState } from "react";

import Header from "./Header/Header";
import ReportSidebar from "./Sidebar/ReportSidebar";

import LogsPanel from "./Tabs/LogsPanel";
import SqlPanel from "./Tabs/SqlPanel";
import CodePanel from "./Tabs/CodePanel";
import DocsPanel from "./Tabs/DocsPanel";
import DeploymentsPanel from "./Tabs/DeploymentsPanel";

import type { BugScenario } from "../types/Scenario";

type TabId =
  | "logs"
  | "sql"
  | "code"
  | "docs"
  | "deployments";

interface Props {
  scenario: BugScenario;
}

const TABS: {
  id: TabId;
  label: string;
}[] = [
  {
    id: "logs",
    label: "Logs",
  },
  {
    id: "sql",
    label: "SQL runner",
  },
  {
    id: "code",
    label: "Code",
  },
  {
    id: "docs",
    label: "Tech docs",
  },
  {
    id: "deployments",
    label: "Deployments",
  },
];

export default function BugHuntingWorkspace({
  scenario,
}: Props) {
  const [activeTab, setActiveTab] =
    useState<TabId>("logs");

  const panel = useMemo(() => {
    switch (activeTab) {
      case "logs":
        return <LogsPanel scenario={scenario} />;

      case "sql":
        return <SqlPanel scenario={scenario} />;

      case "code":
        return <CodePanel scenario={scenario} />;

      case "docs":
        return <DocsPanel scenario={scenario} />;

      case "deployments":
        return (
          <DeploymentsPanel
            scenario={scenario}
          />
        );

      default:
        return null;
    }
  }, [activeTab, scenario]);

  return (
    <div className="app">
      <Header scenario={scenario} />

      <div className="body">
        <ReportSidebar scenario={scenario} />

        <section className="main">
          <div className="tabbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tab ${
                  activeTab === tab.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setActiveTab(tab.id)
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="panel active">
            {panel}
          </div>
        </section>
      </div>
    </div>
  );
}