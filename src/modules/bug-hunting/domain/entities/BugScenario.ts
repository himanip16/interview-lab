// src/modules/bug-hunting/domain/entities/BugScenario.ts
import { z } from "zod";

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

// Zod schema for validation
const BugScenarioSchema = z.object({
  id: z.string(),
  report: z.object({
    title: z.string(),
    severity: z.enum(["P0", "P1", "P2", "P3"]),
    severityLabel: z.string(),
    symptom: z.string(),
    metadata: z.object({
      service: z.string(),
      endpoint: z.string(),
      errorRate: z.string(),
      firstSeen: z.string(),
    }),
  }),
  logs: z.array(z.object({
    id: z.string(),
    timestamp: z.string(),
    level: z.enum(["INFO", "WARN", "ERROR"]),
    message: z.string(),
  })),
  sql: z.object({
    initialQuery: z.string(),
    columns: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  }),
  code: z.array(z.object({
    id: z.string(),
    key: z.string(),
    name: z.string(),
    language: z.string(),
    contentHtml: z.string(),
  })),
  docs: z.array(z.object({
    title: z.string(),
    body: z.string(),
  })),
  deployments: z.array(z.object({
    id: z.string(),
    version: z.string(),
    status: z.enum(["rolled", "ok"]),
    message: z.string(),
    time: z.string(),
  })),
  title: z.string(),
  description: z.string(),
  symptom: z.string(),
  service: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  endpoint: z.string(),
  errorRate: z.string(),
  firstSeen: z.string(),
  timerSeconds: z.number(),
  createdAt: z.string(),
  metadata: z.any(),
});

/** Domain entity — the UI only ever sees this shape via toJSON(). */
export class BugScenario {
  private constructor(private readonly props: BugScenarioProps) {}

  static fromJSON(raw: unknown): BugScenario {
    const validated = BugScenarioSchema.parse(raw);
    return new BugScenario(validated);
  }

  get id() {
    return this.props.id;
  }

  toJSON(): BugScenarioProps {
    return this.props;
  }
}