// src/features/deep-dive/components/SectionHeading.tsx

interface SectionHeadingProps {
  number: number;
  children: React.ReactNode;
}

export function SectionHeading({ number, children }: SectionHeadingProps) {
  return (
    <h2>
      <span className="num">{number}</span>
      {children}
    </h2>
  );
}
