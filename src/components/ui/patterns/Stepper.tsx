import React from 'react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  label: string;
  status: 'done' | 'active' | 'upcoming';
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

/**
 * Stepper Pattern
 * 
 * A pattern component for phase/step tracking.
 * Used in live-interview and multi-step workflows.
 * 
 * This pattern provides:
 * - Consistent stepper layout
 * - Visual step states (done/active/upcoming)
 * - Breathing ring animation for active step
 * - Category-based color mapping
 * 
 * Usage: Phase trackers, multi-step workflows, progress indicators
 * 
 * @example
 * <Stepper
 *   steps={[
 *     { id: '1', label: 'Requirements', status: 'done' },
 *     { id: '2', label: 'Design', status: 'active' },
 *     { id: '3', label: 'Implementation', status: 'upcoming' }
 *   ]}
 * />
 */
export const Stepper: React.FC<StepperProps> = ({ steps, className }) => {
  return (
    <div className={cn('flex items-center gap-1.5 px-7 py-4 border-b border-[var(--border-subtle)]', className)}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Step Node */}
          <div className="flex items-center gap-2">
            <div className="relative">
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
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className="w-5 h-px bg-[var(--border-subtle)]" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
