// src/features/deep-dive/types.ts

import type { ComponentType } from "react";
import type { CodeLanguage } from "@/shared/code/enums";

export type DeepDiveCategory =
  | "db"
  | "msg"
  | "concept"
  | "tools"
  | "algorithms"
  | "data-structures"
  | "streaming";

export type LinkType =
  | "deep-dive"
  | "transcript"
  | "external";

export type DiagramType =
  | "excalidraw"
  | "flowchart"
  | "dataflow"
  | "architecture"
  | "sequence";

export type CalloutType =
  | "info"
  | "warning"
  | "concept"
  | "tradeoff"
  | "note";

export interface DeepDiveSummary {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  tags: string[];
  category: DeepDiveCategory;
  readTime: string;
  credit: string;
  creditOrg: string;
  docsUrl?: string;
}

/**
 * Inline text formatting within paragraphs
 */
export interface InlineContent {
  type: "text" | "bold" | "code" | "link";
  text: string;
  href?: {
    type: LinkType;
    target: string;
    preview?: string;
  };
}

export type Paragraph = InlineContent[];

/**
 * Code snippets with language support
 */
export interface CodeSnippet {
  code: string;
  language: CodeLanguage;
  title?: string;
  highlight?: number[]; // line numbers to highlight (0-indexed)
  collapsible?: boolean;
}

/**
 * Diagrams: Excalidraw for hand-drawn style, or structured data for flowcharts
 */
export interface Diagram {
  type: DiagramType;
  caption: string;
  source: string; // URL to Excalidraw JSON, or inline JSON for structured diagrams
  alt: string; // description for accessibility
  width?: "full" | "half" | "two-thirds";
}

/**
 * Key concepts explained inline or as sidebars
 */
export interface ConceptExplanation {
  term: string; // e.g., "Partition Key", "Consistency Level"
  definition: Paragraph[];
  examples?: string[];
  relatedTerms?: string[]; // references to other concepts in article
}

/**
 * Comparison rows for features/tradeoffs
 */
export interface ComparisonRow {
  feature: string;
  columns: Record<string, string>; // key -> value for each column
}

/**
 * Flexible comparison block that can appear in sections
 */
export interface ComparisonBlock {
  title?: string;
  columnHeaders: Record<string, string>; // id -> display name
  rows: ComparisonRow[];
  caption?: string;
}

/**
 * Callouts for important ideas, warnings, or conceptual asides
 */
export interface Callout {
  type: CalloutType;
  label?: string; // e.g., "Important", "Watch out", "Key Idea"
  content: Paragraph[];
  title?: string; // optional header for callout
}

/**
 * Related resources for deeper learning
 */
export interface RelatedResource {
  type: "article" | "video" | "tool" | "code" | "paper";
  title: string;
  description?: string;
  url: string;
  slug?: string; // if it's another deep-dive
}

/**
 * Tradeoffs and decision space for this component
 */
export interface TradeoffAnalysis {
  title: string; // e.g., "Write vs Read Tradeoff", "Consistency vs Availability"
  description: Paragraph[];
  sides: Array<{
    name: string; // e.g., "Favors Writes"
    pros: string[];
    cons: string[];
  }>;
  cassandraChoice?: Paragraph[]; // how Cassandra chose
}

/**
 * Main section of article
 */
export interface Section {
  number: number;
  title: string;
  lede?: Paragraph[]; // optional intro para before main content
  content: Paragraph[];

  // Content blocks
  diagrams?: Diagram[];
  code?: CodeSnippet[];
  callouts?: Callout[];
  concepts?: ConceptExplanation[];
  comparisons?: ComparisonBlock[];
  tradeoffs?: TradeoffAnalysis[];

  // Learning resources
  resources?: RelatedResource[];
}

/**
 * Glossary or concept index for the article
 */
export interface ConceptIndex {
  [term: string]: ConceptExplanation;
}

/**
 * Related deep-dive or external resource
 */
export interface RelatedTechnology {
  slug: string;
  name: string;
  description: string;
  relationship?: "prerequisite" | "similar" | "contrast" | "buildsOn";
}

/**
 * Main article structure
 */
export interface DeepDiveArticle extends DeepDiveSummary {
  title: string;
  lede: Paragraph[]; // intro paragraph(s)
  
  // Hero section
  heroIllustration?: {
    type: DiagramType;
    source: string;
    alt: string;
  };
  
  // Main content
  sections: Section[];

  // Supporting structures
  concepts?: ConceptIndex; // glossary of key terms
  tradeoffs?: TradeoffAnalysis[]; // article-level tradeoffs
  relatedArticles?: RelatedTechnology[];

  // Metadata
  lastUpdated?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
}