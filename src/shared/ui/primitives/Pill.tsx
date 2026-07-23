// src/shared/ui/primitives/Pill.tsx

import React from 'react';
import { cn } from '@/shared/utils/utils';

interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  color?: 'practice' | 'learn' | 'live' | 'concept' | 'info' | 'social' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * Pill Primitive
 * 
 * A pill-shaped button component used consistently across the app.
 * Covers tags, filter chips, badges, nav pills.
 * 
 * This primitive provides:
 * - Consistent pill shape (radius-pill)
 * - Category-based color mapping (color prop)
 * - Active state (active prop)
 * - Size variants (sm/md/lg)
 * - No business logic
 * 
 * Usage: Filter pills, category tags, toggle buttons
 * 
 * @example
 * <Pill active color="learn" size="md">
 *   Easy
 * </Pill>
 */
export const Pill = React.forwardRef<HTMLButtonElement, PillProps>(
  ({ 
    active = false, 
    color = 'neutral',
    size = 'md',
    className, 
    children, 
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none font-medium rounded-[var(--radius-pill)]';
    
    const variants = {
      default: 'bg-[var(--background-secondary)] text-[var(--text-primary)] hover:bg-[var(--background-muted)] focus:ring-[var(--border-default)]',
      active: 'text-white focus:ring-[var(--border-default)]',
    };
    
    const sizes = {
      sm: 'px-3 py-1 text-xs',
      md: 'px-4 py-1.5 text-sm',
      lg: 'px-5 py-2 text-base',
    };

    const activeStyles = active 
      ? { backgroundColor: `var(--category-${color})` }
      : {};

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[active ? 'active' : 'default'], sizes[size], className)}
        style={activeStyles}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Pill.displayName = 'Pill';
