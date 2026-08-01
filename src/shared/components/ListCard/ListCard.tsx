import type { ReactNode } from 'react';
import styles from './ListCard.module.css';

interface ListCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  onClick?: () => void;
  accent?: string;
  className?: string;
  as?: 'div' | 'a' | 'button';
  href?: string;
}

export function ListCard({
  title,
  subtitle,
  icon,
  rightElement,
  onClick,
  accent,
  className = '',
  as = 'div',
  href,
}: ListCardProps) {
  const Component = as;

  const style = accent
    ? ({ '--card-accent': accent } as React.CSSProperties)
    : undefined;

  const props = {
    className: `${styles.card} ${className}`,
    style,
    ...(onClick && { onClick }),
    ...(href && { href }),
  };

  return (
    <Component {...props}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      {rightElement && <div className={styles.right}>{rightElement}</div>}
    </Component>
  );
}
