// src/app/bug-hunting/[scenarioId]/page.tsx

import { notFound } from "next/navigation";

import { getBugHuntingService } from "@/features/bug-hunting";
import BugHuntingShell from "@/features/bug-hunting/components/BugHuntingShell";
import DeploymentsPanel from "@/features/bug-hunting/components/Tabs/DeploymentsPanel";
import DocsPanel from "@/features/bug-hunting/components/Tabs/DocsPanel";
import LogsPanel from "@/features/bug-hunting/components/Tabs/LogsPanel";
import Header from "@/features/bug-hunting/components/Header/Header";
import ReportSidebar from "@/features/bug-hunting/components/Sidebar/ReportSidebar";
import type { BugScenario } from "@/features/bug-hunting/types/Scenario";

type Props = {
  params: {
    scenarioId: string;
  };
};

export default async function BugHuntingPage({ params }: Props) {
  const { scenarioId } = await params;

  const service = getBugHuntingService();
  const scenario = await service.getScenario(scenarioId);

  if (!scenario) {
    notFound();
  }

  return (
    <main className="bug-hunting-page">
      <Header scenario={scenario} />

      <div className="bh-body">
        <ReportSidebar scenario={scenario} />

        <BugHuntingShell
          logsPanel={<LogsPanel scenario={scenario} />}
          docsPanel={
            <DocsPanel
              docs={scenario.documentation}
              active={false}
            />
          }
          deploymentsPanel={
            <DeploymentsPanel
              deployments={scenario.deployments}
              active={false}
            />
          }
          sqlFixture={scenario.database}
          codeFiles={scenario.code}
          scenarioId={scenario.id}
        />
      </div>
    </main>
  );
}