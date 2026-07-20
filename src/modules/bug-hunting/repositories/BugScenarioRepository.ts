// src/modules/bug-hunting/repositories/BugScenarioRepository.ts
import { BugScenario } from "../domain/entities/BugScenario";

export interface BugScenarioRepository {
  findById(id: string): Promise<BugScenario | null>;
  list(): Promise<BugScenario[]>;
}