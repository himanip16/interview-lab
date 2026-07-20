import React from 'react';
import { cn } from '@/shared/utils/utils';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
  onBack?: () => void;
}

export const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({ title, subtitle, actions, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between', className)}
        {...props}
      >
        <div className="flex flex-col">
          {title && <h2 className="heading-m">{title}</h2>}
          {subtitle && <p className="body-s text-[var(--ink-400)] mt-1">{subtitle}</p>}
          {children}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    );
  }
);

Header.displayName = 'Header';
