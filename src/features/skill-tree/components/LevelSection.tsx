// src/features/skill-tree/components/LevelSection.tsx

import React from 'react';
import { cn } from '@/shared/utils/utils';

type ProficiencyLevel = 'noob' | 'mid' | 'pro';

interface LevelSectionProps {
  level: ProficiencyLevel;
  title: string;
  description: string;
  isLocked?: boolean;
  children: React.ReactNode;
}

const levelConfig: Record<
  ProficiencyLevel,
  { color: string; bgColor: string; label: string }
> = {
  noob: {
    color: 'var(--category-info)',
    bgColor: 'var(--category-info-bg)',
    label: 'NOOB',
  },
  mid: {
    color: 'var(--category-concept)',
    bgColor: 'var(--category-concept-bg)',
    label: 'MID',
  },
  pro: {
    color: 'var(--category-practice)',
    bgColor: 'var(--category-practice-bg)',
    label: 'PRO',
  },
};

/**
 * LevelSection Component
 * 
 * A large, clearly labeled block for each proficiency level.
 * Features:
 * - Color-coded headers using Category-Color Registry
 * - Locked state with grayscale and blur
 * - Clear visual hierarchy
 */
export const LevelSection: React.FC<LevelSectionProps> = ({
  level,
  title,
  description,
  isLocked = false,
  children,
}) => {
  const config = levelConfig[level];

  return (
    <div
      className={cn(
        'relative mb-12 transition-all duration-300',
        isLocked && 'opacity-50 grayscale blur-[1px] pointer-events-none'
      )}
    >
      {/* Level Header */}
      <div className="flex items-center gap-4 mb-6">
        {/* Level Badge */}
        <div
          className="px-3 py-1.5 rounded-[var(--radius-pill)] text-xs font-bold uppercase tracking-wider"
          style={{
            backgroundColor: config.bgColor,
            color: config.color,
          }}
        >
          {config.label}
        </div>

        {/* Level Title */}
        <div>
          <h2
            className="text-xl font-bold text-[var(--text-primary)]"
            style={{ color: isLocked ? undefined : config.color }}
          >
            {title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {description}
          </p>
        </div>
      </div>

      {/* Level Content */}
      <div className="relative pl-8">
        {/* Connector Node */}
        <div
          className="absolute left-0 top-0 w-4 h-4 rounded-full border-2 bg-[var(--surface-panel)]"
          style={{
            borderColor: config.color,
          }}
        />

        {/* Children Content */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};
