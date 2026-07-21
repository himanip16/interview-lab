"use client";

import { useMemo, useState } from "react";

import Header from "./Header/Header";
import ReportSidebar from "./Sidebar/ReportSidebar";

import LogsPanel from "./Tabs/LogsPanel";
import SqlPanel from "./Tabs/SqlPanel";
import CodePanel from "./Tabs/CodePanel";
import DocsPanel from "./Tabs/DocsPanel";
import DeploymentsPanel from "./Tabs/DeploymentsPanel";

import type { BugScenarioDetailDTO } from "../application/dtos/BugScenarioDTO";

type TabId =
  | "logs"
  | "sql"
  | "code"
  | "docs"
  | "deployments";

interface Props {
  scenario: BugScenarioDetailDTO;
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
  return (
    <SqlPanel
      scenarioId={scenario.id}
      fixture={scenario.database}
    />
  );

      case "code":
        
  return (
    <CodePanel
      active={true}
      files={scenario.code}
      activeFileKey={scenario.code[0]?.key ?? ""}
      onFileChange={() => {}}
    />
  );

      case "docs":
  return (
    <DocsPanel
      docs={scenario.documentation}
      active={true}
    />
  );

      case "deployments":
  return (
    <DeploymentsPanel
      deployments={scenario.deployments}
      active={true}
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