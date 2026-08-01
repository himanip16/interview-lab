// src/features/deep-dive/components/Subsection.tsx

'use client';

import type { ParagraphBlock } from '@/features/deep-dive/types';
import { ContentRenderer } from '@/features/deep-dive/components/ContentRenderer';
import styles from './Subsection.module.css';

interface SubsectionProps {
  dotColor?: string;
  title: string;
  content: ParagraphBlock[];
  className?: string;
}

export function Subsection({ dotColor = 'var(--mint-deep)', title, content, className = '' }: SubsectionProps) {
  return (
    <div className={`${styles.subhead} ${className}`}>
      <div className={styles.subheadHeader}>
        <div className={styles.dot} style={{ background: dotColor }} />
        <h3>{title}</h3>
      </div>
      <ContentRenderer content={content} />
    </div>
  );
}
