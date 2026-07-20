import React from 'react';
import { cn } from '@/shared/utils/utils';
import { Pill } from '../primitives/Pill';

interface FilterOption {
  label: string;
  value: string;
  color?: 'practice' | 'learn' | 'live' | 'concept' | 'info' | 'social' | 'neutral';
}

interface FilterBarProps {
  label: string;
  options: FilterOption[];
  activeValue: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * FilterBar Pattern
 * 
 * A pattern component for filter controls with pill buttons.
 * Used for filtering lists, toggling categories, and selecting options.
 * 
 * This pattern provides:
 * - Consistent filter bar layout
 * - Uppercase label with letter spacing
 * - Pill-based filter options
 * - Category-based color mapping for active states
 * 
 * Usage: Problem library filters, category toggles, option selectors
 * 
 * @example
 * <FilterBar
 *   label="Difficulty"
 *   options={[
 *     { label: 'All', value: 'all', color: 'neutral' },
 *     { label: 'Easy', value: 'easy', color: 'learn' },
 *     { label: 'Hard', value: 'hard', color: 'practice' }
 *   ]}
 *   activeValue="easy"
 *   onChange={(v) => setActive(v)}
 * />
 */
export const FilterBar: React.FC<FilterBarProps> = ({
  label,
  options,
  activeValue,
  onChange,
  className
}) => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-[var(--text-secondary)]">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <Pill
            key={option.value}
            active={activeValue === option.value}
            color={option.color || 'neutral'}
            size="sm"
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Pill>
        ))}
      </div>
    </div>
  );
};
