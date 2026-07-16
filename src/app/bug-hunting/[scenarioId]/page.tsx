import "@/styles/bug-hunting.css";
import { notFound } from "next/navigation";
import BugHuntingWorkspace from "@/features/bug-hunting/components/BugHuntingWorkspace";
import type { BugScenario } from "@/features/bug-hunting/types/Scenario";
import checkoutTimeout from "@/features/bug-hunting/data/checkout-timeout.json";

// Swap this map for a real DB/API lookup once bug-hunting scenarios are
// modeled in Prisma (e.g. as PracticeActivityType.BUG_HUNT content).
const SCENARIOS: Record<string, BugScenario> = {
  "checkout-timeout": checkoutTimeout as BugScenario,
};

export default async function Page({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = await params;
  const scenario = SCENARIOS[scenarioId];

  // TODO: CSS variable duplication — colors like var(--paper) and var(--ink)
  // are used throughout the components but aren't fully integrated into a
  // Tailwind theme config, leading to a mix of utility classes and inline styles.
  if (!scenario) notFound();

  return (
    <div className="bg-paper px-5 py-8">
      <BugHuntingWorkspace scenario={scenario} />
    </div>
  );
}