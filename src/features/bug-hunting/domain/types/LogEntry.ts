// src/features/bug-hunting/domain/types/LogEntry.ts

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
}