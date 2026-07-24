// src/features/deep-dive/types.ts

import type { ComponentType } from "react";
import type { CodeLanguage } from "@/shared/code/enums";

export type DeepDiveCategory =
  | "db"
  | "msg"
  | "concept"
  | "streaming";

export type LinkType =
  | "deep-dive"
  | "transcript"
  | "external";

export type IllustrationWidth =
  | "full"
  | "half"
  | "third"
  | "quarter"
  | "fixed"
  | "auto";

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

export interface ContentBlock {
  type: "text" | "link";
  text: string;
  bold?: boolean;
  href?: {
    type: LinkType;
    target: string;
    preview?: string;
  };
}

export type Paragraph = ContentBlock[];

export interface CodeSnippet {
  code: string;
  language: CodeLanguage;
  title?: string;
}

export interface ResourceChip {
  label: string;
  variant?: "ok";
}

export interface ResourceCard {
  icon: string;
  title: string;
  subtitle: string;
  chips?: ResourceChip[];
}

export interface Illustration {
  component: string;
  caption: string;
  text?: string;
  width?: IllustrationWidth;
}

export interface VideoBlock {
  caption: string;
  duration?: string;
}

export interface Callout {
  label: string;
  content: Paragraph[];
}

export interface Section {
  number: number;
  title: string;
  content: Paragraph[];

  callout?: Callout;
  illustration?: Illustration;
  video?: VideoBlock;
  code?: CodeSnippet;
  resources?: ResourceCard[];
}

export interface TradeoffData {
  strengths: string[];
  weaknesses: string[];
}

export interface RelatedTechnology {
  name: string;
  description: string;
  slug: string;
}

export interface DeepDiveArticle extends DeepDiveSummary {
  title: string;
  lede: string;
  heroIllustration: ComponentType;
  sections: Section[];
  tradeoffs?: TradeoffData;
  related: RelatedTechnology[];
}