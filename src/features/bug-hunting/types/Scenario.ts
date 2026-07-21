// src/features/bug-hunting/types/Scenario.ts

import type { IncidentReport } from "@/features/bug-hunting/domain/types/IncidentReport";
import type { TimelineEvent } from "@/features/bug-hunting/domain/types/TimelineEvent";
import type { MetricSnapshot } from "@/features/bug-hunting/domain/types/MetricSnapshot";
import type { DatabaseFixture } from "@/features/bug-hunting/domain/types/DatabaseFixture";
import type { CodeFile } from "@/features/bug-hunting/domain/types/CodeFile";
import type { Hint } from "@/features/bug-hunting/domain/types/Hint";
import type { InvestigationPath } from "@/features/bug-hunting/domain/types/InvestigationPath";
import type { Deployment } from "@/features/bug-hunting/domain/types/Deployment";
import type { LogEntry } from "@/features/bug-hunting/domain/types/LogEntry";
import type { Environment } from "@/features/bug-hunting/domain/types/Environment";
import type { DocumentationSection } from "@/features/bug-hunting/domain/types/DocumentationSection";


export interface BugScenarioMetadata {
  id: string;
  slug: string;

  title: string;
  shortDescription: string;

  difficulty: "easy" | "medium" | "hard";

  category:
    | "database"
    | "backend"
    | "distributed-systems"
    | "networking"
    | "performance";

  estimatedTimeMinutes: number;

  tags: string[];

  severity: "P0" | "P1" | "P2" | "P3";

  skills: string[];

  createdAt: string;
  updatedAt: string;

  isPublished: boolean;
}

export interface BugScenario {
  id: string;
  title: string;

  report: IncidentReport;

  environment: Environment;

  timeline: TimelineEvent[];

  logs: LogEntry[];

  metrics: MetricSnapshot[];

  deployments: Deployment[];

  database: DatabaseFixture;

  code: CodeFile[];

  documentation: DocumentationSection[];

  hints: Hint[];

  expectedInvestigation: InvestigationPath;

  createdAt: string;
}

export interface InvestigationEvidence {
  id: string;

  type:
    | "logs"
    | "metrics"
    | "database"
    | "code"
    | "deployment"
    | "documentation";

  title: string;

  data: unknown;
}