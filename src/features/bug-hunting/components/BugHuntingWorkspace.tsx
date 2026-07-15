"use client";
import { useRouter } from "next/navigation";
import { useInvestigation } from "../hooks/useInvestigation";
import type { BugScenario } from "../types/Scenario";

import { Header } from "@/components/layout/Header";
import ReportSidebar from "./Sidebar/ReportSidebar";
import TabBar from "./shared/Tabs";
import LogsPanel from "./Tabs/LogsPanel";
import SqlPanel from "./Tabs/SqlPanel";
import CodePanel from "./Tabs/CodePanel";
import DocsPanel from "./Tabs/DocsPanel";
import DeploymentsPanel from "./Tabs/DeploymentsPanel";

export default function BugHuntingWorkspace({ scenario }: { scenario: BugScenario }) {
  const router = useRouter();
  const inv = useInvestigation(scenario);

  return (
    <div className="app">
      <Header scenario={scenario} onBack={() => router.back()} />
      <div className="body">
        <ReportSidebar
          scenario={scenario}
          hypothesis={inv.hypothesis}
          onHypothesisChange={inv.setHypothesis}
          onSubmitHypothesis={() =>
            fetch("/api/bug-hunting/hypothesis", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ scenarioId: scenario.id, hypothesis: inv.hypothesis }),
            })
          }
        />
        <div className="main">
          <TabBar active={inv.activeTab} onChange={inv.setActiveTab} />
          <LogsPanel logs={scenario.logs} active={inv.activeTab === "logs"} />
          <SqlPanel
            active={inv.activeTab === "sql"}
            query={inv.sqlQuery}
            onQueryChange={inv.setSqlQuery}
            onRun={() => {
              /* wire to /api/bug-hunting/query when backend exists;
                 for now results are the scenario's canned sqlResults */
            }}
            results={scenario.sqlResults}
          />
          <CodePanel
            active={inv.activeTab === "code"}
            files={scenario.files}
            activeFileKey={inv.activeFileKey}
            onFileChange={inv.setActiveFileKey}
          />
          <DocsPanel docs={scenario.docs} active={inv.activeTab === "docs"} />
          <DeploymentsPanel deployments={scenario.deployments} active={inv.activeTab === "deploys"} />
        </div>
      </div>
    </div>
  );
}