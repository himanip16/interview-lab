// src/features/bug-hunting/domain/entities/BugScenario.ts

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

  report?: ScenarioReport;

  logs?: LogEntry[];

  database?: DatabaseFixture;

  code?: CodeFile[];

  documentation?: DocumentationSection[];

  deployments?: Deployment[];

  description?: string;

  timerSeconds?: number;

  createdAt?: string;

  metadata?: Record<string, unknown>;
}


export const BugScenarioSchema = z.object({
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
  }).optional(),

  logs: z.array(z.object({
    id: z.string(),
    timestamp: z.string(),
    level: z.enum([
      "INFO",
      "WARN",
      "ERROR",
    ]),
    message: z.string(),
  })).optional(),

  database: z.any().optional(),

  code: z.array(z.any()).optional(),

  documentation: z.array(z.any()).optional(),

  deployments: z.array(z.any()).optional(),

  description: z.string().optional(),

  timerSeconds: z.number().optional(),

  createdAt: z.string().optional(),

  metadata: z.record(z.string(), z.unknown()).optional(),
});


export class BugScenario {
  private constructor(
    private readonly props: BugScenarioProps
  ) {}

  static fromJSON(raw: unknown): BugScenario {
    const result = BugScenarioSchema.safeParse(raw);

    if (!result.success) {
      const id = typeof raw === 'object' && raw !== null && 'id' in raw ? String(raw.id) : 'unknown';
      throw new Error(
        `Invalid scenario "${id}":\n${result.error.message}`
      );
    }

    return new BugScenario(result.data);
  }


  get id() {
    return this.props.id;
  }

  get code() {
    return this.props.code ?? [];
  }

  get database() {
    return this.props.database;
  }

  get documentation() {
    return this.props.documentation ?? [];
  }

  get deployments() {
    return this.props.deployments ?? [];
  }

  get logs() {
    return this.props.logs ?? [];
  }


  get title() {
    return this.props.report?.title ?? '';
  }

  get symptom() {
    return this.props.report?.symptom ?? '';
  }

  get service() {
    return this.props.report?.metadata.service ?? '';
  }

  get severity() {
    return this.props.report?.severity;
  }


  toJSON(): BugScenarioProps {
    return this.props;
  }
}