import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  onRemove?: () => void;
  children: React.ReactNode;
}

export const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ onRemove, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 px-2 py-1 bg-[var(--brand)] text-white text-sm radius-small',
          className
        )}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            onClick={onRemove}
            className="hover:bg-[var(--brand-600)] rounded p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }
);

Tag.displayName = 'Tag';
