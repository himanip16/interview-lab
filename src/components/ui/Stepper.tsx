import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  onStepChange?: (step: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  totalSteps,
  onStepChange,
  className
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  const handlePrevious = () => {
    if (currentStep > 1) {
      onStepChange?.(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      onStepChange?.(currentStep + 1);
    }
  };

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <button
        onClick={handlePrevious}
        disabled={currentStep === 1}
        className="p-2 radius-bubble bg-[var(--paper-200)] text-[var(--ink)] hover:bg-[var(--paper-300)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-2">
        {steps.map((step) => (
          <React.Fragment key={step}>
            <div
              className={cn(
                'w-8 h-8 flex items-center justify-center radius-bubble font-medium transition-colors',
                step === currentStep
                  ? 'bg-[var(--brand)] text-white'
                  : step < currentStep
                  ? 'bg-[var(--success)] text-white'
                  : 'bg-[var(--paper-200)] text-[var(--ink)]'
              )}
            >
              {step}
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  'w-8 h-0.5',
                  step < currentStep ? 'bg-[var(--success)]' : 'bg-[var(--paper-200)]'
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={currentStep === totalSteps}
        className="p-2 radius-bubble bg-[var(--paper-200)] text-[var(--ink)] hover:bg-[var(--paper-300)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
