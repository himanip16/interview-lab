import styles from './FilterPill.module.css';

interface FilterPillProps {
  children: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FilterPill({
  children,
  active = false,
  onClick,
  className = '',
}: FilterPillProps) {
  return (
    <button
      className={`${styles.pill} ${active ? styles.active : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
