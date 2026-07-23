// src/shared/ui/Panel.tsx

import React from 'react';
import { cn } from '@/shared/utils/utils';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'floating';
  children: React.ReactNode;
}

/**
 * Panel Primitive
 * 
 * A dumb, presentation-only primitive for rounded white panels.
 * Used across all features for consistent panel styling.
 * 
 * This primitive provides:
 * - Consistent panel background (surface-panel)
 * - Consistent border radius (radius-panel)
 * - Variant-based shadows and borders
 * - No business logic
 * 
 * @example
 * <Panel variant="elevated">
 *   <YourContent />
 * </Panel>
 */
export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const baseStyles = 'bg-[var(--surface-panel)]';
    
    const variants = {
      default: 'border border-[var(--border-subtle)]',
      elevated: 'shadow-[var(--shadow-hover)]',
      floating: 'shadow-[var(--shadow-floating)]',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], 'rounded-[var(--radius-panel)]', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Panel.displayName = 'Panel';
