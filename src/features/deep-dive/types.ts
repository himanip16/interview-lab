export interface DeepDiveSummary {
  slug: string;
  name: string;
  eyebrow: string;
  description: string[];
  tags: string[];
  credit: string;
  creditOrg: string;
  docsUrl?: string;
}

export interface Section {
  number: number;
  title: string;
  content: string[];
  callout?: {
    label: string;
    content: string;
  };
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
  sections: Section[];
  tradeoffs?: TradeoffData;
  related: RelatedTechnology[];
}
