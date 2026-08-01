// src/features/deep-dive/components/SectionHeading.tsx

import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  number: number;
  children: React.ReactNode;
}

export function SectionHeading({ number, children }: SectionHeadingProps) {
  return (
    <h2 className={styles.h2}>
      <span className={styles.num}>{number}</span>
      {children}
    </h2>
  );
}
