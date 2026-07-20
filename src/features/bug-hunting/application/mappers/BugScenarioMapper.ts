// src/modules/bug-hunting/application/mappers/BugScenarioMapper.ts
import { BugScenario } from "../../domain/entities/BugScenario";
import { BugScenarioDTO, BugScenarioListDTO } from "../dtos/BugScenarioDTO";

export class BugScenarioMapper {
  static toDTO(scenario: BugScenario): BugScenarioDTO {
    return {
      id: scenario.id,
      title: scenario.title,
      description: scenario.toJSON().description,
      symptom: scenario.symptom,
      service: scenario.service,
      severity: scenario.severity,
      endpoint: scenario.endpoint,
      errorRate: scenario.errorRate,
      firstSeen: scenario.firstSeen,
      timerSeconds: scenario.toJSON().timerSeconds,
      createdAt: scenario.toJSON().createdAt,
      metadata: scenario.toJSON().metadata,
    };
  }

  static toListDTO(scenario: BugScenario): BugScenarioListDTO {
    return {
      id: scenario.id,
      title: scenario.title,
      description: scenario.toJSON().description,
      symptom: scenario.symptom,
      service: scenario.service,
      severity: scenario.severity,
      timerSeconds: scenario.toJSON().timerSeconds,
    };
  }
}
