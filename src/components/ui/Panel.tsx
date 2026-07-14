import React from 'react';
import { cn } from '@/lib/utils';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'floating';
  children: React.ReactNode;
}

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const baseStyles = 'bg-[var(--surface)]';
    
    const variants = {
      default: 'border border-[var(--border)]',
      elevated: 'shadow-panel',
      floating: 'shadow-floating',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], 'radius-panel', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Panel.displayName = 'Panel';
