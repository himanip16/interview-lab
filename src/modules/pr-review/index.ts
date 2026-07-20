// src/modules/pr-review/index.ts
import { ReviewService } from "./services/ReviewService";
import { PrismaReviewAttemptRepository } from "./infrastructure/repositories/PrismaReviewAttemptRepository";
import { ScenarioLoader } from "./services/ScenarioLoader";

const scenarioLoader = new ScenarioLoader();
const repository = new PrismaReviewAttemptRepository();

let reviewServiceInstance: ReviewService;

export function getReviewService(): ReviewService {
  if (!reviewServiceInstance) {
    reviewServiceInstance = new ReviewService(repository, scenarioLoader);
  }
  return reviewServiceInstance;
}

export * from "./domain/entities/ReviewAttempt";
export * from "./domain/entities/ReviewComment";
export * from "./domain/entities/ReviewReport";
export * from "./repositories/ReviewAttemptRepository";
export * from "./services/ScenarioLoader";
