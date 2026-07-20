// src/features/bug-hunting/components/BugHuntingShell.tsx
"use client";

import { useState, type ReactNode } from "react";
import { BUG_TABS, TAB_LIST, type TabId } from "../constants/tabs";
import CodePanel from "./Tabs/CodePanel";
import SqlPanel from "./Tabs/SqlPanel";
import type { CodeFile, SqlFixture } from "@/features/bug-hunting/domain/entities/BugScenario";

type Props = {
  logsPanel: ReactNode;
  docsPanel: ReactNode;
  deploymentsPanel: ReactNode;
  sqlFixture: SqlFixture;
  codeFiles: CodeFile[];
  scenarioId: string;
};

export default function BugHuntingShell({
  logsPanel,
  docsPanel,
  deploymentsPanel,
  sqlFixture,
  codeFiles,
  scenarioId,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>(BUG_TABS.LOGS);
  const [activeFileKey, setActiveFileKey] = useState<string>("");

  const panels: Record<TabId, ReactNode> = {
    [BUG_TABS.LOGS]: logsPanel,
    [BUG_TABS.SQL]: <SqlPanel scenarioId={scenarioId} fixture={sqlFixture} />,
    [BUG_TABS.CODE]: (
      <CodePanel
        files={codeFiles}
        active={activeTab === BUG_TABS.CODE}
        activeFileKey={activeFileKey}
        onFileChange={setActiveFileKey}
      />
    ),
    [BUG_TABS.DOCS]: docsPanel,
    [BUG_TABS.DEPLOYMENTS]: deploymentsPanel,
  };

  return (
    <section className="bh-main">
      <div className="bh-tabbar">
        {TAB_LIST.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`bh-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bh-panel">{panels[activeTab]}</div>
    </section>
  );
}