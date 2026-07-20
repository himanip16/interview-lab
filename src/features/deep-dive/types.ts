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
  illustration?: {
    component: string; // Component name to import
    caption: string;
    text?: string;
    width?: 'full' | 'half' | 'third' | 'quarter' | 'fixed' | 'auto';
  };
  video?: {
    caption: string;
    duration?: string;
  };
  code?: string;
  resources?: Array<{
    icon: string; // SVG icon name or path
    title: string;
    subtitle: string;
    chips?: Array<{ label: string; variant?: 'ok' }>;
  }>;
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
