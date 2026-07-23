import { Paragraph } from '@/features/deep-dive/types';
import { ContentRenderer } from '@/features/deep-dive/components/ContentRenderer';

interface CalloutProps {
  label: string;
  content: Paragraph[];
}

export function Callout({ label, content }: CalloutProps) {
  return (
    <div className="callout">
      <div className="lbl">{label}</div>
      <ContentRenderer content={content} />
    </div>
  );
}