// src/features/bug-hunting/domain/types/CodeFile.ts

export interface CodeFile {
  id: string;
  key: string;
  path: string;
  language: string;
  content: string;
  version?: string;
  highlightedHtml?: string;
  relatedBugArea?: string;
}