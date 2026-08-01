// src/features/skill-tree/components/BossGate.tsx

import React from 'react';
import { cn } from '@/shared/utils/utils';
import { Bug, Lock } from 'lucide-react';
import { StatusDot } from '@/shared/ui/primitives/StatusDot';

interface BossGateProps {
  title: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  isLocked?: boolean;
}

const statusConfig = {
  locked: {
    bgColor: 'var(--background-muted)',
    borderColor: 'var(--border-subtle)',
    textColor: 'var(--text-tertiary)',
  },
  available: {
    bgColor: 'var(--surface-panel)',
    borderColor: 'var(--category-practice)',
    textColor: 'var(--text-primary)',
  },
  'in-progress': {
    bgColor: 'var(--surface-panel)',
    borderColor: 'var(--category-live)',
    textColor: 'var(--text-primary)',
  },
  completed: {
    bgColor: 'var(--category-learn-bg)',
    borderColor: 'var(--category-learn)',
    textColor: 'var(--category-learn-deep)',
  },
};

/**
 * BossGate Component
 * 
 * A distinct "Final Boss" gate at the end of each proficiency level.
 * Features:
 * - Larger, more prominent styling
 * - StatusDot with "Live" pulsing for active challenges
 * - Bug icon for visual identity
 * - Locked state with lock icon
 * - Distinct visual treatment to stand out from regular cards
 */
export const BossGate: React.FC<BossGateProps> = ({
  title,
  status,
  isLocked = false,
}) => {
  const config = statusConfig[isLocked ? 'locked' : status];

  return (
    <div
      className={cn(
        'relative p-6 rounded-[var(--radius-panel)] border-2',
        'transition-all duration-300',
        'hover:shadow-[var(--shadow-floating)]',
        isLocked && 'pointer-events-none'
      )}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Bug Icon */}
          <div
            className="w-12 h-12 rounded-[var(--radius-card)] flex items-center justify-center"
            style={{
              backgroundColor: isLocked
                ? 'var(--border-subtle)'
                : 'var(--category-practice-bg)',
            }}
          >
            {isLocked ? (
              <Lock
                className="w-6 h-6"
                style={{ color: 'var(--text-tertiary)' }}
              />
            ) : (
              <Bug
                className="w-6 h-6"
                style={{ color: 'var(--category-practice)' }}
              />
            )}
          </div>

          <div>
            <div
              className="text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Final Boss
            </div>
            <h3
              className="text-lg font-bold"
              style={{ color: config.textColor }}
            >
              {title}
            </h3>
          </div>
        </div>

        {/* Status Indicator */}
        {status === 'available' && !isLocked && (
          <StatusDot status="live" label="Live" />
        )}
        {status === 'in-progress' && (
          <StatusDot status="live" label="In Progress" />
        )}
        {status === 'completed' && (
          <StatusDot status="done" label="Completed" />
        )}
      </div>

      {/* Description */}
      <p
        className="text-sm"
        style={{ color: 'var(--text-secondary)' }}
      >
        Complete all items in this level to unlock the bug hunting challenge.
      </p>

      {/* Decorative Corner Accent */}
      {!isLocked && (
        <div
          className="absolute top-0 right-0 w-16 h-16 rounded-bl-[var(--radius-panel)] opacity-10"
          style={{ backgroundColor: 'var(--category-practice)' }}
        />
      )}
    </div>
  );
};
