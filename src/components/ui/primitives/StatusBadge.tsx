import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'live' | 'pending' | 'done' | 'error';
  label: string;
  showPulse?: boolean;
  className?: string;
}

/**
 * StatusBadge Pattern
 * 
 * A pattern component for status indicators with pulsing dots.
 * Used for live badges, status indicators, and active states.
 * 
 * This pattern provides:
 * - Consistent status badge styling
 * - Category-based color mapping
 * - Optional pulse animation (for live states)
 * - Always paired with text label (accessibility)
 * 
 * Usage: Live badges, status indicators, active states
 * 
 * @example
 * <StatusBadge status="live" label="Live" showPulse />
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  showPulse = false,
  className
}) => {
  const statusConfig = {
    live: {
      category: 'live',
      bgColor: 'var(--category-live-bg)',
      textColor: 'var(--category-live-deep)',
    },
    pending: {
      category: 'neutral',
      bgColor: 'var(--category-neutral-bg)',
      textColor: 'var(--text-secondary)',
    },
    done: {
      category: 'learn',
      bgColor: 'var(--category-learn-bg)',
      textColor: 'var(--category-learn-deep)',
    },
    error: {
      category: 'practice',
      bgColor: 'var(--category-practice-bg)',
      textColor: 'var(--category-practice-deep)',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-[var(--radius-pill)]',
        'text-xs font-semibold uppercase tracking-wider',
        className
      )}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
      }}
    >
      {showPulse && (
        <div
          className="pulse-dot"
          style={{ backgroundColor: config.textColor }}
        />
      )}
      {label}
    </div>
  );
};
