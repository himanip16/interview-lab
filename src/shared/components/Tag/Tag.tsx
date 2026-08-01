import styles from './Tag.module.css';

interface TagProps {
  children: string;
  variant?: 'default' | 'accent' | 'outline';
  size?: 'sm' | 'md';
  accent?: string;
  className?: string;
}

export function Tag({
  children,
  variant = 'default',
  size = 'md',
  accent,
  className = '',
}: TagProps) {
  const style = accent
    ? ({ '--tag-accent': accent } as React.CSSProperties)
    : undefined;

  return (
    <span
      className={`${styles.tag} ${styles[variant]} ${styles[size]} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
