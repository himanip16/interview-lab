// src/shared/ui/patterns/AnimatedRing.tsx

import React from 'react';
import { cn } from '@/shared/utils/utils';

interface AnimatedRingProps {
  children: React.ReactNode;
  className?: string;
  size?: number;
  color?: string;
}

/**
 * AnimatedRing Pattern
 * 
 * A wrapper component for the breathing aura effect.
 * Used on timers, close buttons, play buttons.
 * 
 * This pattern provides:
 * - Consistent breathing ring animation
 * - Configurable size and color
 * - Reusable across different contexts
 * 
 * Usage: Wrap any element that needs a breathing aura
 * 
 * @example
 * <AnimatedRing size={58} color="var(--category-live)">
 *   <Timer />
 * </AnimatedRing>
 */
export const AnimatedRing: React.FC<AnimatedRingProps> = ({
  children,
  className,
  size = 58,
  color = 'var(--category-live)',
}) => {
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <div
        className="breathe-ring"
        style={{
          width: `${size + 20}px`,
          height: `${size + 20}px`,
          color,
        }}
      />
      {children}
    </div>
  );
};
