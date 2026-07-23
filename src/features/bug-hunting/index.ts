// src/features/bug-hunting/index.ts

// Public API for bug-hunting feature

import { BugHuntingService } from "./services/BugHuntingService";
import { JsonBugScenarioRepository } from "./infrastructure/repositories/JsonBugScenarioRepository";
import { PrismaBugAttemptRepository } from "./infrastructure/repositories/PrismaBugAttemptRepository";

// Application Services
export { BugHuntingService } from "./services/BugHuntingService";

// Service Factory
export function getBugHuntingService(): BugHuntingService {
  return new BugHuntingService(new JsonBugScenarioRepository(), new PrismaBugAttemptRepository());
}