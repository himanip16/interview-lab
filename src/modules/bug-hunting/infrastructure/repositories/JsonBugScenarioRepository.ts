// src/modules/bug-hunting/infrastructure/repositories/JsonBugScenarioRepository.ts
import { BugScenario } from "../../domain/entities/BugScenario";
import type { BugScenarioRepository } from "../../repositories/BugScenarioRepository";
import scenariosMetadata from "../../data/scenarios_metadata.json";

// Swap this for a Prisma-backed repository later — nothing above this
// layer needs to change.
const SCENARIOS: Record<string, () => Promise<{ default: any }>> = {
  "checkout-timeout": () => import("../../data/scenarios/checkout-timeout.json").then((m) => ({ default: m })),
};

interface ScenarioMetadata {
  id: string;
  title: string;
  description: string;
  symptom: string;
  service: string;
  severity: string;
  timerSeconds: number;
}

export class JsonBugScenarioRepository implements BugScenarioRepository {
  async findById(id: string): Promise<BugScenario | null> {
    const loader = SCENARIOS[id];
    if (!loader) return null;

    const { default: raw } = await loader();
    return BugScenario.fromJSON(raw);
  }

  async list(): Promise<BugScenario[]> {
    // Return lightweight metadata objects instead of loading full scenario details
    // This avoids the performance cost of loading all JSON files with logs, code, etc.
    return scenariosMetadata.map((meta: ScenarioMetadata) => {
      // Create a minimal BugScenario with just the metadata needed for the list view
      return BugScenario.fromJSON({
        id: meta.id,
        report: {
          title: meta.title,
          severity: meta.severity as any,
          severityLabel: meta.severity,
          symptom: meta.symptom,
          metadata: {
            service: meta.service,
            endpoint: "",
            errorRate: "",
            firstSeen: "",
          },
        },
        logs: [],
        sql: { initialQuery: "", columns: [], rows: [] },
        code: [],
        docs: [],
        deployments: [],
        description: meta.description,
        timerSeconds: meta.timerSeconds,
        createdAt: "",
        metadata: {},
      });
    });
  }
}