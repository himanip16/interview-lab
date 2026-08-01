import type { ReactNode } from 'react';
import Link from 'next/link';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  accent?: string;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function Card({
  children,
  accent,
  hover = true,
  className = '',
  onClick,
  href,
}: CardProps) {
  const style = accent
    ? ({ '--card-accent': accent } as React.CSSProperties)
    : undefined;

  const cardClassName = `${styles.card} ${hover ? styles.hoverable : ''} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cardClassName} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <div className={cardClassName} style={style} onClick={onClick}>
      {children}
    </div>
  );
}
