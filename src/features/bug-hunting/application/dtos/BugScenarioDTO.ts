// src/modules/bug-hunting/application/dtos/BugScenarioDTO.ts

export interface BugScenarioDTO {
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
