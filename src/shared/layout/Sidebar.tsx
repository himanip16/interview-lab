// src/shared/layout/Sidebar.tsx

import React from 'react';
import { cn } from '@/shared/utils/utils';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number;
  children: React.ReactNode;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ width = 260, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex-shrink-0 border-l border-[var(--border)] overflow-y-auto',
          className
        )}
        style={{ width: `${width}px` }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Sidebar.displayName = 'Sidebar';
