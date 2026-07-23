// src/shared/layout/Footer.tsx

import React from 'react';
import { cn } from '@/shared/utils/utils';

interface FooterProps extends React.HTMLAttributes<HTMLDivElement> {
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}

export const Footer = React.forwardRef<HTMLDivElement, FooterProps>(
  ({ left, right, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between mt-5', className)}
        {...props}
      >
        {left && <div className="flex items-center gap-5 body-s text-[var(--ink-400)]">{left}</div>}
        {right && <div className="flex items-center gap-4">{right}</div>}
        {children}
      </div>
    );
  }
);

Footer.displayName = 'Footer';
