import "@/styles/bug-hunting.css";

import { notFound } from "next/navigation";

import BugHuntingWorkspace from "@/features/bug-hunting/components/BugHuntingWorkspace";
import { ScenarioRegistry } from "@/modules/bug-hunting/infrastructure/registry/ScenarioRegistry";

type Props = {
  params: Promise<{
    scenarioId: string;
  }>;
};

export default async function BugHuntingPage({ params }: Props) {
  const { scenarioId } = await params;

  const scenario = ScenarioRegistry.get(scenarioId);

  if (!scenario) {
    notFound();
  }

  return (
    <main className="bg-paper px-5 py-8">
      <BugHuntingWorkspace scenario={scenario} />
    </main>
  );
}