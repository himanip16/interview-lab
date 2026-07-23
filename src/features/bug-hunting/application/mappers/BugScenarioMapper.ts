// src/features/bug-hunting/application/mappers/BugScenarioMapper.ts

// src/modules/bug-hunting/application/mappers/BugScenarioMapper.ts

import { BugScenario } from "../../domain/entities/BugScenario";
import type { BugScenarioDetailDTO, BugScenarioListDTO } from "../../application/dtos/BugScenarioDTO";

export class BugScenarioMapper {
  static toDTO(scenario: BugScenario): BugScenarioDetailDTO {
    const json = scenario.toJSON();

    return {
      id: scenario.id,
      title: scenario.title,
      description: json.description ?? '',

      symptom: scenario.symptom,
      service: scenario.service,

      severity: scenario.severity ?? '',


      endpoint: json.report?.metadata.endpoint ?? '',
      errorRate: json.report?.metadata.errorRate ?? '',
      firstSeen: json.report?.metadata.firstSeen ?? '',

      timerSeconds: json.timerSeconds ?? 0,
      createdAt: json.createdAt ?? '',

      metadata: {
  difficulty: String(json.metadata?.difficulty ?? ""),
  category: String(json.metadata?.category ?? ""),
  estimatedTimeMinutes: Number(json.metadata?.estimatedTimeMinutes ?? 0),
},

      report: json.report ?? {
        title: '',
        severity: '',
        severityLabel: '',
        symptom: '',
        metadata: {
          service: '',
          endpoint: '',
          errorRate: '',
          firstSeen: '',
        },
      },
      logs: json.logs ?? [],
      database: json.database,
      code: json.code ?? [],
      documentation: json.documentation ?? [],
      deployments: json.deployments ?? [],
    };
  }

  static toListDTO(scenario: BugScenario): BugScenarioListDTO {
    const json = scenario.toJSON();

    return {
      id: scenario.id,
      title: scenario.title,
      description: json.description ?? '',
      symptom: scenario.symptom,
      service: scenario.service,
      severity: scenario.severity ?? '',
      timerSeconds: json.timerSeconds ?? 0,
    };
  }
}