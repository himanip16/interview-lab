import {
  BugScenarioRepository,
  ScenarioQuery,
} from "@/repositories";

import BugScenario from "@/domain";


export class BugHuntingService {
  constructor(
    private readonly scenarioRepository: BugScenarioRepository,
  ) {}


  async getScenarios(
    query: ScenarioQuery,
  ): Promise<BugScenario[]> {

    const result =
      await this.scenarioRepository.findMany(
        query,
      );

    return result.items;
  }


  async getScenario(
    id: string,
  ): Promise<BugScenario | null> {

    return this.scenarioRepository.findById(
      id,
    );
  }


  async exists(
    id: string,
  ): Promise<boolean> {

    const scenario =
      await this.scenarioRepository.findById(
        id,
      );

    return scenario !== null;
  }
}