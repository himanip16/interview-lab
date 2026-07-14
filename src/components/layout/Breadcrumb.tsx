import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onBack?: () => void;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  onBack,
  className
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {onBack && (
        <button
          onClick={onBack}
          className="w-8 h-8 radius-pillborder border border-[var(--border)] bg-transparent text-[var(--ink)] flex items-center justify-center cursor-pointer flex-shrink-0 hover:bg-[var(--paper-100)] transition-colors"
        >
          <ChevronRight className="w-3 h-3 rotate-180" />
        </button>
      )}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span
            className={cn(
              'body-s font-medium',
              item.active ? 'text-[var(--ink)] font-semibold' : 'text-[var(--ink-400)]'
            )}
          >
            {item.href ? (
              <a href={item.href} className="hover:text-[var(--ink)] transition-colors">
                {item.label}
              </a>
            ) : (
              item.label
            )}
          </span>
          {index < items.length - 1 && (
            <span className="text-[var(--ink-400)]">&nbsp;/&nbsp;</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
