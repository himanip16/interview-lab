// src/shared/layout/shells/WorkspaceShell.tsx

import React from 'react';
import { cn } from '@/shared/utils/utils';

interface WorkspaceShellProps {
  children: React.ReactNode;
  className?: string;
  sidebarWidth?: number;
  sidebarPosition?: 'left' | 'right';
}

/**
 * Workspace Shell
 * 
 * One of the four page shells used across the application.
 * 
 * Usage: Panel with internal split (sidebar/report + tabbed main area).
 * Used for: Bug hunting and live-interview both use this exact structure.
 * 
 * This shell provides:
 * - Fixed-width side column (sidebar/inspector)
 * - Flexible main area
 * - Tab or step navigation support
 * - Consistent panel styling
 * 
 * @example
 * <WorkspaceShell sidebarWidth={260} sidebarPosition="right">
 *   <WorkspaceShell.Main>
 *     <YourMainContent />
 *   </WorkspaceShell.Main>
 *   <WorkspaceShell.Sidebar>
 *     <YourSidebarContent />
 *   </WorkspaceShell.Sidebar>
 * </WorkspaceShell>
 */
export const WorkspaceShell: React.FC<WorkspaceShellProps> & {
  Main: React.FC<{ children: React.ReactNode; className?: string }>;
  Sidebar: React.FC<{ children: React.ReactNode; className?: string }>;
} = ({ children, className, sidebarWidth = 260, sidebarPosition = 'right' }) => {
  return (
    <div
      className={cn(
        'flex gap-6',
        sidebarPosition === 'right' ? 'flex-row' : 'flex-row-reverse',
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as any, { sidebarWidth, sidebarPosition });
        }
        return child;
      })}
    </div>
  );
};

const Main: React.FC<{ children: React.ReactNode; className?: string; sidebarWidth?: number; sidebarPosition?: 'left' | 'right' }> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('flex-1 min-w-0', className)}>
      {children}
    </div>
  );
};

const Sidebar: React.FC<{ children: React.ReactNode; className?: string; sidebarWidth?: number; sidebarPosition?: 'left' | 'right' }> = ({
  children,
  className,
  sidebarWidth = 260,
}) => {
  return (
    <div
      className={cn('shrink-0', className)}
      style={{ width: `${sidebarWidth}px` }}
    >
      {children}
    </div>
  );
};

WorkspaceShell.Main = Main;
WorkspaceShell.Sidebar = Sidebar;
