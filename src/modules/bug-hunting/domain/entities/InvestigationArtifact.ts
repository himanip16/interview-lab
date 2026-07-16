import { EvidenceType } from "../value-objects/EvidenceType";

export class InvestigationArtifact {
  private unlocked: boolean;

  constructor(
    readonly id: string,
    readonly type: EvidenceType,
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