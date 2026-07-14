import React from 'react';
import { cn } from '@/lib/utils';

interface PillProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'active' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Pill = React.forwardRef<HTMLDivElement, PillProps>(
  ({ variant = 'default', size = 'md', className, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center font-medium transition-colors';
    
    const variants = {
      default: 'bg-[var(--paper-200)] text-[var(--ink)]',
      active: 'bg-[var(--brand)] text-white',
      success: 'bg-[var(--success)] text-white',
      warning: 'bg-[var(--warning)] text-white',
      error: 'bg-[var(--error)] text-white',
    };
    
    const sizes = {
      sm: 'px-2 py-0.5 text-xs radius-pill',
      md: 'px-3 py-1 text-sm radius-pill',
      lg: 'px-4 py-1.5 text-base radius-pill',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Pill.displayName = 'Pill';
