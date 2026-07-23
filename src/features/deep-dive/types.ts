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

export interface ContentBlock {
  // 'text': plain or bold inline text. 'link': hoverable phrase that navigates
  // to another deep-dive/transcript covering the same concept or tool.
  type: 'text' | 'link';
  text: string;
  bold?: boolean; // only meaningful when type === 'text'
  // Only present when type === 'link'
  href?: {
    type: 'deep-dive' | 'transcript' | 'external';
    // slug for 'deep-dive' / 'transcript', full URL for 'external'
    target: string;
    // Optional short blurb shown in the hover preview card before navigation
    preview?: string;
  };
}

// One paragraph = one array of inline spans (text/bold/link mixed freely)
export type Paragraph = ContentBlock[];

export interface Section {
  number: number;
  title: string;
  content: Paragraph[];

  callout?: {
    label: string;
    content: Paragraph[];
  };

  illustration?: {
    component: string;
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