import React from 'react';
import { cn } from '@/lib/utils';

interface StatusDotProps {
  label: string;
  status?: 'live' | 'pending' | 'done' | 'error';
  className?: string;
}

/**
 * StatusDot Primitive
 * 
 * The pulsing live/active dot, always requires a label prop.
 * Enforces the color+text+icon rule from the design system.
 * 
 * This primitive provides:
 * - Consistent status indicator styling
 * - Pulse animation (from motion system)
 * - Category-based color mapping
 * - Always paired with text label (accessibility)
 * - No business logic
 * 
 * Usage: Live badges, status indicators, active states
 * 
 * @example
 * <StatusDot status="live" label="Live" />
 */
export const StatusDot: React.FC<StatusDotProps> = ({
  label,
  status = 'pending',
  className
}) => {
  const statusConfig = {
    live: {
      color: 'var(--category-live)',
      bgColor: 'var(--category-live-bg)',
      textColor: 'var(--category-live-deep)',
    },
    pending: {
      color: 'var(--category-neutral)',
      bgColor: 'var(--category-neutral-bg)',
      textColor: 'var(--text-secondary)',
    },
    done: {
      color: 'var(--category-learn)',
      bgColor: 'var(--category-learn-bg)',
      textColor: 'var(--category-learn-deep)',
    },
    error: {
      color: 'var(--category-practice)',
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
      <div
        className="pulse-dot"
        style={{ backgroundColor: config.color }}
      />
      {label}
    </div>
  );
};
