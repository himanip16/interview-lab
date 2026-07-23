// src/features/bug-hunting/domain/types/MetricSnapshot.ts

export interface MetricSnapshot {
  name: string;

  unit:
    | "percentage"
    | "count"
    | "milliseconds"
    | "bytes";

  currentValue: number;

  baselineValue?: number;

  timestamp: string;

  tags?: Record<string,string>;
}