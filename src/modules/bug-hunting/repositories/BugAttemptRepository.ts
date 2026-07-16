import { BugAttempt } from "../domain/entities/BugAttempt";

export interface BugAttemptRepository {
  findById(
    id: string,
  ): Promise<BugAttempt | null>;

  save(
    attempt: BugAttempt,
  ): Promise<void>;
}