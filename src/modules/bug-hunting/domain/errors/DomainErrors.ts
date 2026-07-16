export class ArtifactNotFoundError extends Error {
  constructor(id: string) {
    super(`Artifact not found: ${id}`);
  }
}

export class ScenarioCompletedError extends Error {
  constructor() {
    super("Scenario already completed");
  }
}

export class ArtifactLockedError extends Error {
  constructor() {
    super("Artifact is locked");
  }
}