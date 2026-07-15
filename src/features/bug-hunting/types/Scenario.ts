export type LogLevel = "info" | "warn" | "error";

export interface LogLine {
  ts: string;
  level: LogLevel;
  message: string;
}

export interface CodeFile {
  key: string;
  label: string;
  // pre-rendered HTML with <span class="kw|str|cm|ty"> spans, same as source
  contentHtml: string;
}

export interface SqlResultRow {
  order_id: string;
  status: string;
  retry_count: number;
  flagged: boolean;
  created_at: string;
}

export interface Deployment {
  version: string;
  status: "rolled" | "ok";
  message: string;
  time: string;
}

export interface DocSection {
  title: string;
  body: string;
}

export interface BugScenario {
  id: string;
  title: string;
  severity: string;
  service: string;
  endpoint: string;
  errorRate: string;
  firstSeen: string;
  symptom: string;
  timerSeconds: number;
  logs: LogLine[];
  defaultSqlQuery: string;
  sqlResults: SqlResultRow[];
  files: CodeFile[];
  docs: DocSection[];
  deployments: Deployment[];
}