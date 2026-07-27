// src/features/deep-dive/components/Callout.tsx

import type { ParagraphBlock, CalloutType } from '@/features/deep-dive/types';
import { ContentRenderer } from '@/features/deep-dive/components/ContentRenderer';

interface CalloutProps {
  variant: CalloutType;
  label?: string;
  title?: string;
  content: ParagraphBlock[];
}

const variantLabel: Record<CalloutType, string> = {
  info: 'Info',
  warning: 'Watch out',
  concept: 'Concept',
  tradeoff: 'Tradeoff',
  note: 'Note',
};

export function Callout({ variant, label, title, content }: CalloutProps) {
  return (
    <div className={`callout callout--${variant}`}>
      <div className="lbl">{label ?? variantLabel[variant]}</div>
      {title && <div className="callout-title">{title}</div>}
      <ContentRenderer content={content} />
    </div>
  );
}