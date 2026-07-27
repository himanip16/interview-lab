// src/features/deep-dive/types.ts

import type { CodeLanguage } from "@/shared/code/enums";

/* ==========================================================================
   1. CORE PRIMITIVES & TEXT
   ========================================================================== */

export type DeepDiveCategory =
  | "db"
  | "msg"
  | "concept"
  | "tools"
  | "algorithms"
  | "data-structures"
  | "streaming";

export interface LinkRef {
  kind: "deep-dive" | "transcript" | "external";
  target: string; // URL path, slug, or external URL
  preview?: string;
}

export interface InlineText {
  type: "text" | "bold" | "italic" | "code";
  text: string;
}

export interface InlineLink {
  type: "link";
  text: string;
  ref: LinkRef;
}

export type InlineContent = InlineText | InlineLink;

/* ==========================================================================
   2. BLOCKS (Ordered Content Hierarchy)
   ========================================================================== */

export interface ParagraphBlock {
  type: "paragraph";
  content: InlineContent[];
}

export interface CodeBlock {
  type: "code";
  code: string;
  language: CodeLanguage;
  title?: string;
  highlight?: number[]; // line numbers to highlight (0-indexed)
  collapsible?: boolean;
}

/**
 * Discriminated union for diagrams based on execution/rendering target
 */
export type DiagramBlock = {
  type: "diagram";
  caption: string;
  alt: string;
  width?: "full" | "half" | "two-thirds";
} & (
  | { renderEngine: "excalidraw"; url: string }
  | { renderEngine: "flowchart" | "mermaid"; definition: string }
  | { renderEngine: "component"; componentName: string }
  | { renderEngine: "image"; src: string }
);

export type CalloutType = "info" | "warning" | "concept" | "tradeoff" | "note" | "tip";

export interface CalloutBlock {
  type: "callout";
  variant: CalloutType;
  label?: string; // e.g., "Important", "Watch out"
  title?: string;
  content: ParagraphBlock[];
}

export interface ComparisonColumn {
  id: string;
  label: string;
}

export interface ComparisonRow {
  feature: string;
  cells: Record<string, string>; // column.id -> value
}

export interface ComparisonBlock {
  type: "comparison";
  title?: string;
  columns: ComparisonColumn[]; // Explicit array preserves column order
  rows: ComparisonRow[];
  caption?: string;
}

export interface TradeoffSide {
  name: string; // e.g., "Favors Writes"
  pros: string[];
  cons: string[];
}

export interface TradeoffBlock {
  type: "tradeoff";
  title: string;
  description: ParagraphBlock[];
  sides: TradeoffSide[];
  verdict?: ParagraphBlock[]; // Recommendation or platform specific choice
}

export interface QuoteBlock {
  type: "quote";
  quote: string;
  author?: string;
  role?: string;
}

export interface ImageBlock {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: string;
}

export interface TableBlock {
  type: "table";
  headers: string[];
  rows: string[][];
  caption?: string;
}

/**
 * Reference to a globally defined concept in the article's glossary
 */
export interface ConceptReferenceBlock {
  type: "concept-ref";
  conceptId: string;
  summaryOverride?: ParagraphBlock[];
}

/**
 * Unified Discriminated Union for all rendered content blocks
 */
export type ContentBlock =
  | ParagraphBlock
  | CodeBlock
  | DiagramBlock
  | CalloutBlock
  | ComparisonBlock
  | TradeoffBlock
  | QuoteBlock
  | ImageBlock
  | TableBlock
  | ConceptReferenceBlock;

/* ==========================================================================
   3. DOMAIN MODES (Glossary & Resources)
   ========================================================================== */

export interface Concept {
  id: string;
  term: string; // e.g., "Partition Key"
  definition: ParagraphBlock[];
  examples?: string[];
  relatedConceptIds?: string[];
}

export interface RelatedResource {
  type: "article" | "video" | "tool" | "code" | "paper";
  title: string;
  description?: string;
  url: string;
  slug?: string; // Present if type === "article"
  relationship?: "prerequisite" | "similar" | "contrast" | "buildsOn" | "next" | "related";
}

/* ==========================================================================
   4. SECTIONS & ARTICLE METADATA
   ========================================================================== */

export interface Section {
  id: string;
  number: number;
  title: string;
  lede?: ParagraphBlock[];
  blocks: ContentBlock[]; // Ordered sequence of content
}

export interface DifficultyConfig {
  level: 1 | 2 | 3 | 4 | 5; // e.g. 1 (Beginner) to 5 (Master)
  prerequisites?: string[]; // Related topics or article slugs
}

export interface ArticleMetadata {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  category: DeepDiveCategory;
  tags: string[];
  
  // Publishing & Operations
  published: boolean;
  draft: boolean;
  version: string;
  publishedAt?: string;
  updatedAt?: string;
  
  // Attribution & Effort
  estimatedReadingMinutes: number;
  credit?: string;
  creditOrg?: string;
  reviewedBy?: string[];
  
  // Search & Progression Graph
  keywords?: string[];
  aliases?: string[];
  learningObjectives?: string[];
  difficulty?: DifficultyConfig;
  docsUrl?: string;
}

/**
 * Lightweight DTO used for cards, lists, and index pages
 */
export type DeepDiveSummary = ArticleMetadata;

/**
 * Full Deep Dive Article payload
 */
export interface DeepDiveArticle {
  metadata: ArticleMetadata;
  heroDiagram?: DiagramBlock;
  lede: ParagraphBlock[];
  sections: Section[];
  
  // Single sources of truth
  glossary?: Record<string, Concept>; // Map of conceptId -> Concept
  resources?: RelatedResource[];
}