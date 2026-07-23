// src/shared/ui/Input.tsx

import React from 'react';
import { cn } from '@/shared/utils/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="label text-[var(--ink)]">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            'px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] radius-bubble',
            'text-[var(--ink)] placeholder:text-[var(--ink-400)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent',
            'transition-all',
            error && 'border-[var(--error)] focus:ring-[var(--error-500)]',
            className
          )}
          {...props}
        />
        {error && (
          <span className="caption text-[var(--error)]">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
