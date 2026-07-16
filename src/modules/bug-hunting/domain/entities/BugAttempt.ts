import { Finding } from "./Finding";
import { AttemptStatus } from "../value-objects/AttemptStatus";

export class BugAttempt {
  private findings: Finding[] = [];

  private status: AttemptStatus;

  constructor(
    readonly id: string,
    readonly scenarioId: string,
    readonly startedAt: Date,
  ) {
    this.status = AttemptStatus.IN_PROGRESS;
  }

  addFinding(finding: Finding) {
    this.findings.push(finding);
  }

  complete() {
    this.status = AttemptStatus.COMPLETED;
  }

  abandon() {
    this.status = AttemptStatus.ABANDONED;
  }

  getFindings() {
    return [...this.findings];
  }

  getStatus() {
    return this.status;
  }
}
