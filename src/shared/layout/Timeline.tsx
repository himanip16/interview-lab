import React from 'react';
import { cn } from '@/shared/utils/utils';

interface TimelineStep {
  id: string;
  label: string;
  status: 'done' | 'active' | 'upcoming';
}

interface TimelineProps {
  steps: TimelineStep[];
  onStepChange?: (stepId: string) => void;
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ steps, onStepChange, className }) => {
  return (
    <div className={cn('flex items-center gap-1.5 overflow-x-auto', className)}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div
              className={cn(
                'w-2 h-2 radius-full cursor-pointer',
                step.status === 'done' && 'bg-[var(--mint-deep)]',
                step.status === 'active' && 'bg-[var(--ink)] relative',
                step.status === 'upcoming' && 'border border-[var(--ink-200)] bg-transparent'
              )}
              onClick={() => onStepChange?.(step.id)}
            >
              {step.status === 'active' && (
                <div className="absolute inset-[-5px] radius-full border border-[var(--ink-300)] animate-breathe" />
              )}
            </div>
            <span
              className={cn(
                'body-s font-semibold whitespace-nowrap cursor-pointer',
                step.status === 'active' ? 'text-[var(--ink)]' : 'text-[var(--ink-400)]'
              )}
              onClick={() => onStepChange?.(step.id)}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="w-5 h-px bg-[var(--ink-100)] flex-shrink-0" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
