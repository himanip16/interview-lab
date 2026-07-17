// src/modules/bug-hunting/index.ts
import { JsonBugScenarioRepository } from "./infrastructure/repositories/JsonBugScenarioRepository";
import { PrismaBugAttemptRepository } from "./infrastructure/repositories/PrismaBugAttemptRepository";
import { BugHuntingService } from "./services/BugHuntingService";

let _service: BugHuntingService | null = null;

export function getBugHuntingService(): BugHuntingService {
  if (!_service) {
    _service = new BugHuntingService(new JsonBugScenarioRepository(), new PrismaBugAttemptRepository());
  }
  return _service;
}