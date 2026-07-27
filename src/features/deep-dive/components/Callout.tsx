// src/features/deep-dive/components/Callout.tsx

import type { ParagraphBlock, CalloutType } from '@/features/deep-dive/types';
import { ContentRenderer, InlineContentRenderer } from '@/features/deep-dive/components/ContentRenderer';

interface CalloutProps {
  variant: CalloutType;
  label?: string;
  title?: string;
  content: ParagraphBlock[];
  className?: string;
}

const variantLabel: Record<CalloutType, string> = {
  info: 'Info',
  warning: 'Watch out',
  concept: 'Concept',
  tradeoff: 'Tradeoff',
  note: 'Note',
  tip: 'Tip',
  success: 'Success',
};

const variantColor: Record<CalloutType, string> = {
  info: 'var(--mint-deep)',
  warning: 'var(--coral)',
  concept: 'var(--violet)',
  tradeoff: 'var(--amber)',
  note: 'var(--text-soft)',
  tip: 'var(--mint)',
  success: 'var(--mint-deep)',
};

export function Callout({ variant, label, title, content, className = '' }: CalloutProps) {
  const color = variantColor[variant];
  const labelText = label ?? variantLabel[variant];

  return (
    <div className={`callout callout--${variant} ${className}`}>
      <div
        className="lbl"
        style={{
          background: `${color}15`,
          color,
        }}
      >
        {labelText}
      </div>
      {title && <h4 className="callout-title">{title}</h4>}
      <ContentRenderer content={content} />
    </div>
  );
}