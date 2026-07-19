import React from 'react';
import { cn } from '@/lib/utils';

interface CircleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'filled' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  withRing?: boolean;
  children: React.ReactNode;
}

/**
 * CircleButton Primitive
 * 
 * A circular button component used consistently across the app.
 * Replaces .back, .close-btn, .play-btn, .next-btn, .mic-btn, .send-btn.
 * 
 * This primitive provides:
 * - Consistent circular button styling
 * - Variant states (ghost/filled/dark)
 * - Optional breathing ring animation (withRing prop)
 * - Size variants (sm/md/lg)
 * - No business logic
 * 
 * Usage: Back buttons, close buttons, play buttons, submit buttons
 * 
 * @example
 * <CircleButton variant="ghost" size="md" withRing>
 *   <CloseIcon />
 * </CircleButton>
 */
export const CircleButton = React.forwardRef<HTMLButtonElement, CircleButtonProps>(
  ({ 
    variant = 'ghost', 
    size = 'md', 
    withRing = false,
    className, 
    children, 
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative rounded-full';
    
    const variants = {
      ghost: 'bg-transparent text-[var(--text-primary)] hover:bg-[var(--background-secondary)] focus:ring-[var(--border-default)]',
      filled: 'bg-[var(--surface-panel)] text-[var(--text-primary)] hover:bg-[var(--background-secondary)] focus:ring-[var(--border-default)]',
      dark: 'bg-[var(--category-neutral)] text-white hover:bg-[var(--category-neutral-deep)] focus:ring-[var(--category-neutral)]',
    };
    
    const sizes = {
      sm: 'w-8 h-8 p-1.5',
      md: 'w-10 h-10 p-2',
      lg: 'w-14 h-14 p-3',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {withRing && (
          <div className="breathe-ring" style={{ color: 'var(--category-live)' }} />
        )}
        {children}
      </button>
    );
  }
);

CircleButton.displayName = 'CircleButton';

// Export as IconCircle for backward compatibility
export { CircleButton as IconCircle };
