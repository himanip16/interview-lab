import React from 'react';
import { cn } from '@/lib/utils';

interface ImmersiveShellProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
}

/**
 * Immersive/Hero Shell
 * 
 * One of the four page shells used across the application.
 * 
 * Usage: Full-bleed gradient background, no panel container.
 * Used for: Discovery or landing moments (e.g., Cassandra landing page).
 * 
 * This shell provides:
 * - Full-bleed gradient background
 * - No panel container
 * - Immersive, focused experience
 * - Rare usage - only for special discovery/landing moments
 * 
 * @example
 * <ImmersiveShell gradient="linear-gradient(165deg, #FFB930, #E8940A)">
 *   <YourHeroContent />
 * </ImmersiveShell>
 */
export const ImmersiveShell: React.FC<ImmersiveShellProps> = ({
  children,
  className,
  gradient = 'linear-gradient(165deg, var(--category-concept), var(--category-concept-deep))',
}) => {
  return (
    <main
      className={cn('min-h-screen w-full', className)}
      style={{ background: gradient }}
    >
      {children}
    </main>
  );
};
