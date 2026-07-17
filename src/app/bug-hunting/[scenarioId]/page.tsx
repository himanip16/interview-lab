import { notFound } from "next/navigation";
import { getBugHuntingService } from "@/modules/bug-hunting";

import BugHuntingShell from "@/features/bug-hunting/components/BugHuntingShell";
import DeploymentsPanel from "@/features/bug-hunting/components/Tabs/DeploymentsPanel";
import DocsPanel from "@/features/bug-hunting/components/Tabs/DocsPanel";
import LogsPanel from "@/features/bug-hunting/components/Tabs/LogsPanel";
import Header from "@/features/bug-hunting/components/Header/Header";
import ReportSidebar from "@/features/bug-hunting/components/Sidebar/ReportSidebar";

type Props = {
  params: Promise<{
    scenarioId: string;
  }>;
};

export default async function BugHuntingPage({ params }: Props) {
  const { scenarioId } = await params;
  const service = getBugHuntingService();
  const scenario = await service.getScenario(scenarioId);

  if (!scenario) {
    notFound();
  }

  // Use the plain JSON representation for ALL components
  const data = scenario.toJSON();

  return (
    <main className="bug-hunting-page">
      <Header scenario={data} />

      <div className="bh-body">
        <ReportSidebar
          scenario={data}
          hypothesis=""
          onHypothesisChange={() => {}}
          onSubmitHypothesis={() => {}}
        />

        <BugHuntingShell
          logsPanel={<LogsPanel scenario={data} />}
          docsPanel={<DocsPanel docs={data.docs} active={false} />}
          deploymentsPanel={
            <DeploymentsPanel deployments={data.deployments} active={false} />
          }
          sqlFixture={data.sql}
          codeFiles={data.code}
          scenarioId={data.id}
        />
      </div>
    </main>
  );
}