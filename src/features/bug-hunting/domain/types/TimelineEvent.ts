// src/features/bug-hunting/domain/types/TimelineEvent.ts

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