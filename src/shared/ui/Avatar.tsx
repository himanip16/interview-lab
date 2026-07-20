import React from 'react';
import { cn } from '@/shared/utils/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, size = 'md', fallback, className, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
    };

    if (src && !imageError) {
      return (
        <div
          ref={ref}
          className={cn('relative overflow-hidden radius-pill bg-[var(--paper-200)]', sizes[size], className)}
          {...props}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center radius-pill bg-[var(--brand)] text-white font-medium',
          sizes[size],
          className
        )}
        {...props}
      >
        {fallback}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
