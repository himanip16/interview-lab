// src/shared/layout/shells/ReadingShell.tsx

import React from 'react';
import { cn } from '@/shared/utils/utils';

interface ReadingShellProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  progress?: number;
  progressColor?: string;
}

/**
 * Reading Shell
 * 
 * One of the four page shells used across the application.
 * 
 * Usage: Narrow centered column, progress bar, no panel chrome.
 * Used for: Long-form consumption (articles, transcripts).
 * 
 * This shell provides:
 * - Narrow centered column for optimal reading
 * - Progress bar at top (sticky)
 * - No panel chrome (clean, focused reading experience)
 * - Typography-optimized layout
 * 
 * @example
 * <ReadingShell maxWidth="md" showProgress progress={45}>
 *   <YourArticleContent />
 * </ReadingShell>
 */
export const ReadingShell: React.FC<ReadingShellProps> = ({
  children,
  className,
  maxWidth = 'md',
  showProgress = false,
  progress = 0,
  progressColor = 'var(--category-learn-deep)',
}) => {
  const maxWidthClasses = {
    sm: 'max-w-[560px]',
    md: 'max-w-[680px]',
    lg: 'max-w-[800px]',
  };

  return (
    <main className="min-h-screen bg-[var(--surface-page)]">
      {/* Progress Bar */}
      {showProgress && (
        <div
          className="sticky top-0 left-0 right-0 h-[3px] bg-[rgba(21,22,28,0.06)] z-50"
          style={{ transition: 'background-color 0.1s linear' }}
        >
          <div
            className="h-full transition-all duration-100 ease-linear"
            style={{
              width: `${progress}%`,
              backgroundColor: progressColor,
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className={cn('mx-auto px-6 py-10 lg:py-16', maxWidthClasses[maxWidth], className)}>
        {children}
      </div>
    </main>
  );
};
