import React from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'default', size = 'md', className, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      default: 'bg-[var(--paper-200)] text-[var(--ink)] hover:bg-[var(--paper-300)] focus:ring-[var(--paper-400)]',
      ghost: 'bg-transparent text-[var(--ink)] hover:bg-[var(--paper-100)] focus:ring-[var(--paper-300)]',
      danger: 'bg-[var(--error)] text-white hover:bg-[var(--error-600)] focus:ring-[var(--error-500)]',
    };
    
    const sizes = {
      sm: 'p-1.5 radius-small',
      md: 'p-2 radius-bubble',
      lg: 'p-3 radius-card',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
