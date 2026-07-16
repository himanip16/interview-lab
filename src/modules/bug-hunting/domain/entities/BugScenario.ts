import { InvestigationArtifact } from "./InvestigationArtifact";
import { ScenarioMetadata } from "../value-objects/ScenarioMetadata";
import { Finding } from "./Finding";

export class BugScenario {
  private completed = false;

  private findings: Finding[] = [];

  constructor(
    readonly id: string,
    readonly title: string,
    readonly description: string,
    readonly metadata: ScenarioMetadata,
    private readonly artifacts: InvestigationArtifact[],
    readonly createdAt: Date,
  ) {}

  unlockArtifact(id: string) {
    const artifact = this.artifacts.find(
      item => item.id === id,
    );

    if (!artifact) {
      throw new Error(
        `Artifact ${id} not found`,
      );
    }

    artifact.unlock();
  }

  addFinding(finding: Finding) {
    this.findings.push(finding);
  }

  complete() {
    this.completed = true;
  }

  isCompleted() {
    return this.completed;
  }

  getArtifacts() {
    return [...this.artifacts];
  }

  getFindings() {
    return [...this.findings];
  }
}