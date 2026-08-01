// src/features/deep-dive/components/RelatedTechnologyCard.tsx

import type { ReactNode } from 'react';

type RelationshipType = 'buildsOn' | 'prerequisite' | 'contrast' | 'similar' | 'advanced';

interface RelatedTechnologyCardProps {
  name: string;
  description: string;
  heroIllustration?: ReactNode;
  relationship?: RelationshipType;
}

const relationshipLabels: Record<RelationshipType, string> = {
  buildsOn: 'Builds On',
  prerequisite: 'Prerequisite',
  contrast: 'Contrast',
  similar: 'Similar',
  advanced: 'Advanced',
};

export function RelatedTechnologyCard({ name, description, heroIllustration, relationship }: RelatedTechnologyCardProps) {
  return (
    <div className="rel-card">
      {relationship && (
        <div className={`rel-badge rel-badge-${relationship}`}>
          {relationshipLabels[relationship]}
        </div>
      )}
      {heroIllustration && (
        <div className="rel-card-illustration">
          {heroIllustration}
        </div>
      )}
      <div className="rn">{name}</div>
      <div className="rd">{description}</div>
    </div>
  );
}
