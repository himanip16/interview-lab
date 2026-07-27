// src/features/deep-dive/components/ResourceRow.tsx

import type { ReactNode } from 'react';
import Link from 'next/link';

type ChipVariant = 'ok' | 'prerequisite' | 'similar' | 'contrast' | 'buildsOn' | 'next';

interface ResourceRowProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  href?: string;
  chips?: Array<{ label: string; variant?: ChipVariant }>;
}

export function ResourceRow({ icon, title, subtitle, href, chips }: ResourceRowProps) {
  const content = (
    <>
      <div className="res-ic">{icon}</div>
      <div className="res-info">
        <div className="res-title">{title}</div>
        {subtitle && <div className="res-sub">{subtitle}</div>}
      </div>
      {chips && chips.length > 0 && (
        <div className="chip-row">
          {chips.map((chip, index) => (
            <span key={index} className={`chip ${chip.variant ?? ''}`}>
              {chip.label}
            </span>
          ))}
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="res-row">
        {content}
      </Link>
    );
  }

  return <div className="res-row">{content}</div>;
}