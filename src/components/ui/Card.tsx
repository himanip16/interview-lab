import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'hover';
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const baseStyles = 'bg-[var(--surface)]';
    
    const variants = {
      default: 'border border-[var(--border)]',
      elevated: 'shadow-panel',
      hover: 'border border-[var(--border)] hover:shadow-hover transition-shadow',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], 'radius-card', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
