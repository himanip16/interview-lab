// src/features/bug-hunting/infrastructure/ScenarioLoader.ts

import { BugScenario } from "../domain/entities/BugScenario";

export class ScenarioLoader {
  /**
   * Loads and validates a single scenario from raw data.
   * Delegates to BugScenario.fromJSON which uses safeParse() internally
   * to provide clear error messages identifying the specific scenario.
   */
  static load(raw: unknown): BugScenario {
    return BugScenario.fromJSON(raw);
  }
}
