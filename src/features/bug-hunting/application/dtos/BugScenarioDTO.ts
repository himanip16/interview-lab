// src/features/bug-hunting/application/dtos/BugScenarioDTO.ts

// src/modules/bug-hunting/application/dtos/BugScenarioDTO.ts

import { DatabaseFixture, CodeFile, DocumentationSection, Deployment, LogEntry } from "@/features/bug-hunting/domain/types/"

export interface BugScenarioDetailDTO {
  id: string;
  title: string;
  description: string;
  symptom: string;
  service: string;
  severity: string;

  endpoint: string;
  errorRate: string;
  firstSeen: string;

  timerSeconds: number;
  createdAt: string;

  metadata: {
    difficulty: string;
    category: string;
    estimatedTimeMinutes: number;
  };

  report: {
    title: string;
    severity: string;
    severityLabel: string;
    symptom: string;
    metadata: {
      service: string;
      endpoint: string;
      errorRate: string;
      firstSeen: string;
    };
  };

  logs: LogEntry[];
  database?: DatabaseFixture;
  code: CodeFile[];
  documentation: DocumentationSection[];
  deployments: Deployment[];
}

export interface BugScenarioListDTO {
  id: string;
  title: string;
  description: string;
  symptom: string;
  service: string;
  severity: string;
  timerSeconds: number;
}
