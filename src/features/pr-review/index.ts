// Public API for pr-review feature

import { ReviewService } from "./services/ReviewService";
import { ScenarioLoader } from "./services/ScenarioLoader";
import { PrismaReviewAttemptRepository } from "./infrastructure/repositories/PrismaReviewAttemptRepository";

// Application Services
export { ReviewService } from "./services/ReviewService";
export { ScenarioLoader } from "./services/ScenarioLoader";

// Domain Entities
export * from "./domain/entities/ReviewAttempt";
export * from "./domain/entities/ReviewComment";
export * from "./domain/entities/ReviewReport";

// Infrastructure
export * from "./infrastructure/repositories/repositories/ReviewAttemptRepository";

// Service Factory
export function getReviewService() {
  const scenarioLoader = new ScenarioLoader();
  const repository = new PrismaReviewAttemptRepository();
  return new ReviewService(repository, scenarioLoader);
}
