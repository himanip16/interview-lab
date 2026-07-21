// src/features/bug-hunting/infrastructure/repositories/JsonBugScenarioRepository.ts

import { BugScenario } from "../../domain/entities/BugScenario";
import { ScenarioLoader } from "../../infrastructure/ScenarioLoader";
import type { BugScenarioRepository } from "./BugScenarioRepository";

const SCENARIOS: Record<string, () => Promise<unknown>> = {
  "checkout-timeout": () =>
    import("../../data/scenarios/checkout-timeout.json").then(
      (module) => module.default
    ),
};

export class JsonBugScenarioRepository implements BugScenarioRepository {
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
      Object.keys(SCENARIOS).map(async (id) => {
        const raw = await SCENARIOS[id]();

        return ScenarioLoader.load(raw);
      })
    );

    return scenarios;
  }
}