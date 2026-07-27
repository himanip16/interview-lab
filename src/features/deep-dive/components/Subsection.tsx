// src/features/deep-dive/components/Subsection.tsx

'use client';

import type { ParagraphBlock } from '@/features/deep-dive/types';
import { ContentRenderer } from '@/features/deep-dive/components/ContentRenderer';

interface SubsectionProps {
  dotColor?: string;
  title: string;
  content: ParagraphBlock[];
  className?: string;
}

export function Subsection({ dotColor = 'var(--mint-deep)', title, content, className = '' }: SubsectionProps) {
  return (
    <div className={`subhead ${className}`}>
      <div className="dot" style={{ background: dotColor }} />
      <h3>{title}</h3>
      <ContentRenderer content={content} />
    </div>
  );
}
