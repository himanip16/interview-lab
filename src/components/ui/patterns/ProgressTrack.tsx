import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressStep {
  id: string;
  label: string;
  status: 'done' | 'active' | 'upcoming';
  timestamp?: string;
}

interface ProgressTrackProps {
  steps: ProgressStep[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'stepper' | 'timeline';
  className?: string;
}

/**
 * ProgressTrack Pattern
 * 
 * A unified pattern for ordered states with a "current" pointer.
 * Combines Stepper (horizontal) and Timeline (vertical) into one component.
 * 
 * This pattern provides:
 * - Configurable orientation (horizontal/vertical)
 * - Configurable variant (stepper/timeline)
 * - Visual step states (done/active/upcoming)
 * - Breathing ring animation for active step
 * - Category-based color mapping
 * - No business logic
 * 
 * Usage: Phase trackers, deploy history, multi-step workflows
 * 
 * @example
 * // Stepper variant (horizontal)
 * <ProgressTrack
 *   variant="stepper"
 *   orientation="horizontal"
 *   steps={[
 *     { id: '1', label: 'Requirements', status: 'done' },
 *     { id: '2', label: 'Design', status: 'active' },
 *     { id: '3', label: 'Implementation', status: 'upcoming' }
 *   ]}
 * />
 * 
 * @example
 * // Timeline variant (vertical)
 * <ProgressTrack
 *   variant="timeline"
 *   orientation="vertical"
 *   steps={[
 *     { id: '1', label: 'Deployed', status: 'done', timestamp: '2h ago' },
 *     { id: '2', label: 'In Progress', status: 'active', timestamp: 'Now' }
 *   ]}
 * />
 */
export const ProgressTrack: React.FC<ProgressTrackProps> = ({
  steps,
  orientation = 'horizontal',
  variant = 'stepper',
  className
}) => {
  const isHorizontal = orientation === 'horizontal';
  const isTimeline = variant === 'timeline';

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'items-center gap-1.5 px-7 py-4 border-b border-[var(--border-subtle)]' : 'flex-col gap-4',
        className
      )}
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Step Node */}
          <div className={cn('flex', isHorizontal ? 'items-center gap-2' : 'flex-row gap-4')}>
            <div className="relative flex-shrink-0">
              <div
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all',
                  step.status === 'done' && 'bg-[var(--category-learn-deep)]',
                  step.status === 'active' && 'bg-[var(--text-primary)]',
                  step.status === 'upcoming' && 'border border-[var(--border-default)] bg-transparent'
                )}
              >
                {step.status === 'active' && (
                  <div className="breathe-ring" style={{ inset: '-5px', color: 'var(--text-primary)' }} />
                )}
              </div>
            </div>
            
            {/* Step Content */}
            <div className={cn(isTimeline && 'flex-1')}>
              <span
                className={cn(
                  'text-[11.5px] font-semibold',
                  step.status === 'done' && 'text-[var(--category-learn-deep)]',
                  step.status === 'active' && 'text-[var(--text-primary)]',
                  step.status === 'upcoming' && 'text-[var(--text-tertiary)]'
                )}
              >
                {step.label}
              </span>
              {isTimeline && step.timestamp && (
                <span className="text-[10.5px] text-[var(--text-tertiary)] ml-2">
                  {step.timestamp}
                </span>
              )}
            </div>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                isHorizontal ? 'w-5 h-px bg-[var(--border-subtle)]' : 'w-px h-4 bg-[var(--border-subtle)] ml-[5px]'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
