import { z } from "zod";

import { Severity } from "../value-objects";
import type { LogEntry } from "../types/LogEntry";
import type { CodeFile } from "../types/CodeFile";
import type { Deployment } from "../types/Deployment";
import type { DatabaseFixture } from "../types/DatabaseFixture";
import type { DocumentationSection } from "../types/DocumentationSection";

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

  database: DatabaseFixture;

  code: CodeFile[];

  documentation: DocumentationSection[];

  deployments: Deployment[];

  description: string;

  timerSeconds: number;

  createdAt: string;

  metadata: Record<string, unknown>;
}


const BugScenarioSchema = z.object({
  id: z.string(),

  report: z.object({
    title: z.string(),
    severity: z.enum(Severity),
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
    level: z.enum([
      "INFO",
      "WARN",
      "ERROR",
    ]),
    message: z.string(),
  })),

  database: z.any(),

  code: z.array(z.any()),

  documentation: z.array(z.any()),

  deployments: z.array(z.any()),

  description: z.string(),

  timerSeconds: z.number(),

  createdAt: z.string(),

  metadata: z.record(z.string(), z.unknown()),
});


export class BugScenario {
  private constructor(
    private readonly props: BugScenarioProps
  ) {}

  static fromJSON(raw: unknown): BugScenario {
    const validated = BugScenarioSchema.parse(raw);
    return new BugScenario(validated);
  }


  get id() {
    return this.props.id;
  }

  get code() {
    return this.props.code;
  }

  get database() {
    return this.props.database;
  }

  get documentation() {
    return this.props.documentation;
  }

  get deployments() {
    return this.props.deployments;
  }

  get logs() {
    return this.props.logs;
  }


  get title() {
    return this.props.report.title;
  }

  get symptom() {
    return this.props.report.symptom;
  }

  get service() {
    return this.props.report.metadata.service;
  }

  get severity() {
    return this.props.report.severity;
  }


  toJSON(): BugScenarioProps {
    return this.props;
  }
}