// InvestigationPath.ts

export interface InvestigationPath {
  expectedSteps: InvestigationStep[];

  rootCause: string;

  keyInsights: string[];
}

export interface InvestigationStep {
  order: number;

  action:
    | "inspect_logs"
    | "check_metrics"
    | "query_database"
    | "inspect_code"
    | "review_deployment";

  description: string;

  expectedFinding: string;
}