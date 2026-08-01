// src/features/deep-dive/components/RelatedTechnologyCard.tsx

import type { ReactNode } from 'react';
import styles from './RelatedTechnologyCard.module.css';

type RelationshipType = 'buildsOn' | 'prerequisite' | 'contrast' | 'similar' | 'advanced';

interface RelatedTechnologyCardProps {
  name: string;
  description: string;
  heroIllustration?: ReactNode;
  relationship?: RelationshipType;
}

const relationshipLabels: Record<RelationshipType, string> = {
  buildsOn: 'Builds on',
  prerequisite: 'Prerequisite',
  contrast: 'Compare with',
  similar: 'Related',
  advanced: 'Related',
};

export function RelatedTechnologyCard({ name, description, heroIllustration, relationship }: RelatedTechnologyCardProps) {
  return (
    <div className={styles.relCard}>
      {relationship && (
        <div className={`${styles.relBadge} ${styles[`relBadge${relationship.charAt(0).toUpperCase() + relationship.slice(1)}`]}`}>
          {relationshipLabels[relationship]}
        </div>
      )}
      {heroIllustration && (
        <div className={styles.relCardIllustration}>
          {heroIllustration}
        </div>
      )}
      <div className={styles.rn}>{name}</div>
      <div className={styles.rd}>{description}</div>
    </div>
  );
}
