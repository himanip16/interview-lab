// src/shared/layout/shells/PanelDetailShell.tsx

import React from 'react';
import { cn } from '@/shared/utils/utils';

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  breadcrumb?: React.ReactNode;
}

/**
 * PageShell Pattern (panel-detail variant)
 * 
 * A pattern component for the panel-detail page shell.
 * Top bar with breadcrumb slot, content slot, consistent padding/max-width.
 * Every feature page should be able to wrap itself in this in under 10 lines.
 * 
 * This pattern provides:
 * - Consistent panel styling (radius, shadow, border)
 * - Breadcrumb slot (top-left)
 * - Content area with proper padding
 * - Responsive max-width behavior
 * - No business logic
 * 
 * Usage: Bug hunting, card detail, whiteboarding, problem library
 * 
 * @example
 * <PageShell
 *   maxWidth="lg"
 *   breadcrumb={<Breadcrumb items={[{ label: 'Library', href: '/library' }, { label: 'Problem' }]} />}
 * >
 *   <YourContent />
 * </PageShell>
 */
export const PageShell: React.FC<PageShellProps> = ({
  children,
  className,
  maxWidth = 'lg',
  breadcrumb,
}) => {
  const maxWidthClasses = {
    sm: 'max-w-[640px]',
    md: 'max-w-[768px]',
    lg: 'max-w-[960px]',
    xl: 'max-w-[1080px]',
    full: 'max-w-full',
  };

  return (
    <main className="min-h-screen bg-[var(--surface-page)] p-6 lg:p-10">
      <div
        className={cn(
          'mx-auto bg-[var(--surface-panel)] rounded-[var(--radius-panel)]',
          'border border-[var(--border-subtle)]',
          'shadow-[var(--shadow-resting)]',
          maxWidthClasses[maxWidth],
          className
        )}
      >
        {/* Breadcrumb Section */}
        {breadcrumb && (
          <div className="px-8 pt-8 pb-4">
            {breadcrumb}
          </div>
        )}

        {/* Content Section */}
        <div className={cn('px-8 pb-8', !breadcrumb && 'pt-8')}>
          {children}
        </div>
      </div>
    </main>
  );
};

// Export as PanelDetailShell for backward compatibility
export { PageShell as PanelDetailShell };
