// src/modules/bug-hunting/domain/entities/BugScenario.ts
export type Severity = "P0" | "P1" | "P2" | "P3";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
}

export interface SqlFixture {
  initialQuery: string;
  columns: string[];
  rows: string[][];
}

export interface CodeFile {
  id: string;
  key: string;
  name: string;
  language: string;
  contentHtml: string; // pre-highlighted markup, matches CodeBlock's dangerouslySetInnerHTML
}

export interface DocSection {
  title: string;
  body: string;
}

export interface Deployment {
  id: string;
  version: string;
  status: "rolled" | "ok";
  message: string;
  time: string;
}

export interface ScenarioReportMetadata {
  service: string;
  endpoint: string;
  errorRate: string;
  firstSeen: string;
}

export interface ScenarioReport {
  title: string;
  severity: Severity;
  severityLabel: string;
  symptom: string;
  metadata: ScenarioReportMetadata;
}

interface BugScenarioProps {
  id: string;
  report: ScenarioReport;
  logs: LogEntry[];
  sql: SqlFixture;
  code: CodeFile[];
  docs: DocSection[];
  deployments: Deployment[];
  // Flattened fields for feature layer compatibility
  title: string;
  description: string;
  symptom: string;
  service: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  endpoint: string;
  errorRate: string;
  firstSeen: string;
  timerSeconds: number;
  createdAt: string;
  metadata: any;
}

/** Domain entity — the UI only ever sees this shape via toJSON(). */
export class BugScenario {
  private constructor(private readonly props: BugScenarioProps) {}

  static fromJSON(raw: BugScenarioProps): BugScenario {
    return new BugScenario(raw);
  }

  get id() {
    return this.props.id;
  }

  toJSON(): BugScenarioProps {
    return this.props;
  }
}