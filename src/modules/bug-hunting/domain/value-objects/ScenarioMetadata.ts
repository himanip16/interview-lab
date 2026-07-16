import { ScenarioDifficulty } from "./ScenarioDifficulty";
import { Severity } from "./Severity";
import { ScenarioCategory } from "./ScenarioCategory";

export class ScenarioMetadata {
  constructor(
    readonly difficulty: ScenarioDifficulty,
    readonly severity: Severity,
    readonly category: ScenarioCategory,
    readonly estimatedTimeMinutes: number,
    readonly tags: readonly string[],
  ) {}
}