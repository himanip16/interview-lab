// src/features/bug-hunting/domain/types/Environment.ts

export interface Environment {
  service: string;
  version: string;
  region: string;
  runtime: string;
  database: string;
  deploymentId: string;
}