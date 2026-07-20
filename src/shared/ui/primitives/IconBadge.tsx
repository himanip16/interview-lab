import React from 'react';
import { cn } from '@/shared/utils/utils';

interface IconBadgeProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * IconBadge Primitive
 * 
 * A floating bobbing icon on cards.
 * Purely decorative warmth, never on more than one element cluster at a time.
 * 
 * This primitive provides:
 * - Consistent floating icon styling
 * - Float animation (from motion system)
 * - Size variants (sm/md/lg)
 * - No business logic
 * 
 * Usage: Hero illustrations, floating icons on cards
 * 
 * @example
 * <IconBadge size="lg">
 *   <HeroIcon />
 * </IconBadge>
 */
export const IconBadge: React.FC<IconBadgeProps> = ({
  children,
  size = 'md',
  className
}) => {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center animate-float',
        sizes[size],
        className
      )}
    >
      {children}
    </div>
  );
};
