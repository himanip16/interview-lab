export interface TimelineEvent {
  timestamp: string;

  type:
    | "deployment"
    | "alert"
    | "incident"
    | "rollback";

  title: string;

  description: string;

  metadata?: Record<string, unknown>;
}