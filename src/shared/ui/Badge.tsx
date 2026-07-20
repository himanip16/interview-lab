import React from 'react';
import { cn } from '@/shared/utils/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-colors';
    
    const variants = {
      default: 'bg-[var(--paper-300)] text-[var(--ink)]',
      primary: 'bg-[var(--brand)] text-white',
      success: 'bg-[var(--success)] text-white',
      warning: 'bg-[var(--warning)] text-white',
      error: 'bg-[var(--error)] text-white',
    };
    
    const sizes = {
      sm: 'px-1.5 py-0.5 text-xs radius-small',
      md: 'px-2 py-0.5 text-sm radius-small',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
