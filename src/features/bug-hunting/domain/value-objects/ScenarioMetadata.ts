// src/features/bug-hunting/domain/value-objects/ScenarioMetadata.ts

import { Difficulty } from "@prisma/client";
import { Severity } from "./Severity";
import { ScenarioCategory } from "./ScenarioCategory";

export class ScenarioMetadata {
  constructor(
    readonly difficulty: Difficulty,
    readonly severity: Severity,
    readonly category: ScenarioCategory,
    readonly estimatedTimeMinutes: number,
    readonly tags: readonly string[],
  ) {}
}