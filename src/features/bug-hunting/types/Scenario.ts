// src/features/bug-hunting/types/Scenario.ts
export type Severity = "P0" | "P1" | "P2" | "P3";

export interface ReportMetadata {
  service: string;
  endpoint: string;
  errorRate: string;
  firstSeen: string;
}

export interface Report {
  title: string;
  severity: Severity;
  severityLabel: string; // e.g. "Intermittent"
  symptom: string;
  metadata: ReportMetadata;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
}

export interface SqlQuery {
  initialQuery: string;
  columns: string[];
  rows: string[][];
}

export interface SourceFile {
  id: string;
  key: string;
  name: string;
  language: string;
  contentHtml: string; // pre-highlighted markup, matches CodeBlock's dangerouslySetInnerHTML
}

export interface DocumentationSection {
  title: string;
  body: string;
}

export interface Deployment {
  id: string;
  version: string;
  status: "rolled" | "ok"; // matches mockup's .dep.rolled / .dep.ok classes
  message: string;
  time: string;
}

export interface BugScenarioMetadata {
  difficulty: string;
  category: string;
  estimatedTimeMinutes: number;
}

export interface BugScenario {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  metadata: BugScenarioMetadata;
  report: Report;