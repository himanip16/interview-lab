"use client";

import { useState, type ReactNode } from "react";

import { BUG_TABS, TAB_LIST, type TabId } from "../constants/tabs";
import type { CodeFile } from "../domain/types";
import type { DatabaseFixture } from "../domain/types";

import CodePanel from "./Tabs/CodePanel";
import SqlPanel from "./Tabs/SqlPanel";

type Props = {
  logsPanel: ReactNode;
  docsPanel: ReactNode;
  deploymentsPanel: ReactNode;
  sqlFixture?: DatabaseFixture;
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
  const [activeFileKey, setActiveFileKey] = useState("");

  const panels: Record<TabId, ReactNode> = {
    [BUG_TABS.LOGS]: logsPanel,

    [BUG_TABS.SQL]: sqlFixture ? (
      <SqlPanel
        scenarioId={scenarioId}
        fixture={sqlFixture}
      />
    ) : (
      <div className="bh-empty-state">
        No database is available for this scenario.
      </div>
    ),

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
    <>
      <div className="bh-tabs">
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

      {panels[activeTab]}
    </>
  );
}