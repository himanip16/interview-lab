// src/features/deep-dive/components/IllustrationBlock.tsx

import type { ReactNode } from 'react';

type IllustrationWidth = 'full' | 'half' | 'two-thirds' | 'quarter' | 'fixed' | 'auto';

interface IllustrationBlockProps {
  illustration: ReactNode;
  caption: string;
  alt?: string;
  children?: ReactNode;
  width?: IllustrationWidth;
}

export function IllustrationBlock({
  illustration,
  caption,
  alt,
  children,
  width = 'fixed',
}: IllustrationBlockProps) {
  const isFullWidth = width === 'full';

  return (
    <div className={`illust-row ${isFullWidth ? 'full-width' : ''}`}>
      <div className={`illust-box ${width}`} role="img" aria-label={alt}>
        {illustration}
        <div className="illust-cap">{caption}</div>
      </div>
      {children && !isFullWidth && <div className="illust-text">{children}</div>}
    </div>
  );
}