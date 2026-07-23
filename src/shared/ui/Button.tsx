// src/shared/ui/Button.tsx

import React from 'react';
import { cn } from '@/shared/utils/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-[var(--brand)] text-white hover:bg-[var(--brand-600)] focus:ring-[var(--brand-500)]',
      secondary: 'bg-[var(--paper-200)] text-[var(--ink)] hover:bg-[var(--paper-300)] focus:ring-[var(--paper-400)]',
      ghost: 'bg-transparent text-[var(--ink)] hover:bg-[var(--paper-100)] focus:ring-[var(--paper-300)]',
      danger: 'bg-[var(--error)] text-white hover:bg-[var(--error-600)] focus:ring-[var(--error-500)]',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm radius-small',
      md: 'px-4 py-2 text-base radius-bubble',
      lg: 'px-6 py-3 text-lg radius-card',
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

Button.displayName = 'Button';
