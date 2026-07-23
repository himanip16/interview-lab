// src/features/bug-hunting/domain/entities/InvestigationArtifact.ts

import { ArtifactType } from "../value-objects/ArtifactType";

export class InvestigationArtifact {
  private unlocked: boolean;

  constructor(
    readonly id: string,
    readonly type: ArtifactType,
    readonly label: string,
    readonly description: string,
    readonly content: string,
    readonly order: number,
    readonly points: number,
    unlocked = false,
  ) {
    this.unlocked = unlocked;
  }

  unlock() {
    this.unlocked = true;
  }

  isUnlocked() {
    return this.unlocked;
  }
}