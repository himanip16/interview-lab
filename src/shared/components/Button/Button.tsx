import type { ReactNode } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  as?: 'button' | 'a';
  href?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  className = '',
  as = 'button',
  href,
}: ButtonProps) {
  const Component = as;

  const props = {
    className: `${styles.button} ${styles[variant]} ${styles[size]} ${className}`,
    ...(onClick && { onClick }),
    ...(disabled && { disabled }),
    ...(href && { href }),
  };

  return (
    <Component {...props}>
      {icon && iconPosition === 'left' && <span className={styles.icon}>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className={styles.icon}>{icon}</span>}
    </Component>
  );
}
