import React from 'react';
import { cn } from '@/shared/utils/utils';

export interface InspectorBlock {
  label: string;
  content: string;
}

export interface InspectorProps {
  title: string;
  kind: string;
  category?: 'practice' | 'learn' | 'live' | 'concept' | 'info' | 'social' | 'neutral';
  color?: string; // Deprecated: use category instead
  blocks: InspectorBlock[];
  empty?: boolean;
  emptyMessage?: string;
  className?: string;
}

/**
 * Inspector Pattern
 * 
 * A Pattern component for the "detail drawer" interaction pattern.
 * Used across features: whiteboarding inspector, bug hunting report panel.
 * 
 * This pattern provides:
 * - Consistent detail panel layout
 * - Category-based color mapping (via category-color registry)
 * - Uppercase labeled sections
 * - Empty state handling
 * 
 * Interaction: Select something → see structured detail in side panel
 * 
 * @example
 * <Inspector
 *   title="Load Balancer"
 *   kind="Gateway"
 *   category="neutral"
 *   blocks={[
 *     { label: 'Role & duty', content: 'Distributes incoming traffic...' },
 *     { label: 'Deep dive', content: 'Uses round-robin algorithm...' }
 *   ]}
 * />
 */
export const Inspector: React.FC<InspectorProps> = ({
  title,
  kind,
  category = 'neutral',
  color, // Deprecated: kept for backward compatibility
  blocks,
  empty = false,
  emptyMessage = 'Select a component to see details',
  className
}) => {
  // Map category to CSS variable
  const getCategoryColor = (cat: string) => {
    if (color) return color; // Backward compatibility
    return `var(--category-${cat})`;
  };

  const getCategoryDeepColor = (cat: string) => {
    return `var(--category-${cat}-deep)`;
  };

  if (empty) {
    return (
      <div className={cn(
        'rounded-[var(--radius-card)] border border-[var(--border-default)]',
        'p-6 flex flex-col',
        className
      )}>
        <div className="m-auto text-center text-[var(--text-tertiary)] text-sm">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'rounded-[var(--radius-card)] border border-[var(--border-default)]',
      'p-6 flex flex-col',
      className
    )}>
      {/* Header with category indicator */}
      <div className="flex items-center gap-2.5 mb-5">
        <div
          className="w-9 h-9 rounded-[var(--radius-small)] flex items-center justify-center text-white"
          style={{ backgroundColor: getCategoryColor(category) }}
        >
          <div className="w-4 h-4 rounded-full border-2 border-current" />
        </div>
        <div>
          <h3 className="text-base font-semibold leading-tight text-[var(--text-primary)]">
            {title}
          </h3>
          <div className="text-xs text-[var(--text-tertiary)]">{kind}</div>
        </div>
      </div>

      {/* Content blocks */}
      {blocks.map((block, index) => (
        <div key={index} className="mb-4 last:mb-0">
          <div className={cn(
            'text-xs font-medium uppercase tracking-wider mb-1.5',
            'text-[var(--text-primary)]'
          )} style={{ color: getCategoryDeepColor(category) }}>
            {block.label}
          </div>
          <div className="text-sm text-[var(--text-tertiary)] leading-relaxed">
            {block.content}
          </div>
        </div>
      ))}
    </div>
  );
};
