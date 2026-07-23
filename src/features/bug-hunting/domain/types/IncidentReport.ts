// src/features/bug-hunting/domain/types/IncidentReport.ts

export interface IncidentReport {
  title: string;

  severity: "P0" | "P1" | "P2" | "P3";

  service: string;

  symptom: string;

  impact: string;

  affectedUsers: string;

  startedAt: string;

  frequency: string;
}