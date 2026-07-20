import React from 'react';
import { cn } from '@/shared/utils/utils';

interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'sent' | 'received' | 'system';
  children: React.ReactNode;
}

export const Bubble = React.forwardRef<HTMLDivElement, BubbleProps>(
  ({ variant = 'received', className, children, ...props }, ref) => {
    const baseStyles = 'max-w-[80%] p-3';
    
    const variants = {
      sent: 'bg-[var(--brand)] text-white ml-auto',
      received: 'bg-[var(--paper-200)] text-[var(--ink)]',
      system: 'bg-[var(--paper-100)] text-[var(--ink-600)] text-center mx-auto',
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], 'radius-bubble', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Bubble.displayName = 'Bubble';
