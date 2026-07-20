import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { cn } from '@/shared/utils/utils';

export const Search = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-400)]" />
        <input
          ref={ref}
          type="text"
          className={cn(
            'w-full pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] radius-bubble',
            'text-[var(--ink)] placeholder:text-[var(--ink-400)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent',
            'transition-all',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Search.displayName = 'Search';
