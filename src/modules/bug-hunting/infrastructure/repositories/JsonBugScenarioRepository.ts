// src/modules/bug-hunting/infrastructure/repositories/JsonBugScenarioRepository.ts
import { BugScenario } from "../../domain/entities/BugScenario";
import type { BugScenarioRepository } from "../../repositories/BugScenarioRepository";

// Swap this for a Prisma-backed repository later — nothing above this
// layer needs to change.
const SCENARIOS: Record<string, () => Promise<{ default: any }>> = {
  "checkout-timeout": () => import("../../data/scenarios/checkout-timeout.json").then((m) => ({ default: m })),
};

export class JsonBugScenarioRepository implements BugScenarioRepository {
  async findById(id: string): Promise<BugScenario | null> {
    const loader = SCENARIOS[id];
    if (!loader) return null;

    const { default: raw } = await loader();
    return BugScenario.fromJSON(raw);
  }
}