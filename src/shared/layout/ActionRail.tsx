// src/shared/layout/ActionRail.tsx

import React from 'react';
import { cn } from '@/shared/utils/utils';

interface ActionRailProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  gap?: number;
  children: React.ReactNode;
}

export const ActionRail = React.forwardRef<HTMLDivElement, ActionRailProps>(
  ({ orientation = 'horizontal', gap = 26, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          className
        )}
        style={{ gap: `${gap}px` }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ActionRail.displayName = 'ActionRail';
