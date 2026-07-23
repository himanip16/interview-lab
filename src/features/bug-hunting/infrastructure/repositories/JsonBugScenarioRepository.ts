// src/features/bug-hunting/infrastructure/repositories/JsonBugScenarioRepository.ts

import { BugScenario } from "../../domain/entities/BugScenario";
import { ScenarioLoader } from "../ScenarioLoader";
import type { BugScenarioRepository } from "./BugScenarioRepository";

const SCENARIOS: Record<string, () => Promise<any>> = {
  "checkout-timeout": async () =>
    (
      await import(
        "@/content/bug-hunting/scenarios/checkout-timeout.json"
      )
    ).default,

  "cache-stampede": async () =>
    (
      await import(
        "@/content/bug-hunting/scenarios/cache-stampede.json"
      )
    ).default,
};

export class JsonBugScenarioRepository
  implements BugScenarioRepository
{
  async findById(id: string): Promise<BugScenario | null> {
    const loader = SCENARIOS[id];

    if (!loader) {
      return null;
    }

    const raw = await loader();

    return ScenarioLoader.load(raw);
  }

  async list(): Promise<BugScenario[]> {
    const scenarios = await Promise.all(
      Object.values(SCENARIOS).map(async (loader) => {
        const raw = await loader();

        return ScenarioLoader.load(raw);
      })
    );

    return scenarios;
  }
}