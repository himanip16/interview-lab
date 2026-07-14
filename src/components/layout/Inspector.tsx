import React from 'react';
import { cn } from '@/lib/utils';

interface InspectorBlock {
  label: string;
  content: string;
}

interface InspectorProps {
  title: string;
  kind: string;
  color: string;
  blocks: InspectorBlock[];
  empty?: boolean;
  emptyMessage?: string;
  className?: string;
}

export const Inspector: React.FC<InspectorProps> = ({
  title,
  kind,
  color,
  blocks,
  empty = false,
  emptyMessage = 'Select a component to see details',
  className
}) => {
  if (empty) {
    return (
      <div className={cn('radius-card border border-[var(--border)] p-6 flex flex-col', className)}>
        <div className="m-auto text-center text-[var(--ink-400)] body-s">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('radius-card border border-[var(--border)] p-6 flex flex-col', className)}>
      <div className="flex items-center gap-2.5 mb-4.5">
        <div
          className="w-8.5 h-8.5 radius-small flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          <div className="w-4 h-4 rounded-full border-2 border-current" />
        </div>
        <div>
          <h3 className="heading-s">{title}</h3>
          <div className="caption text-[var(--ink-400)]">{kind}</div>
        </div>
      </div>

      {blocks.map((block, index) => (
        <div key={index} className="mb-4">
          <div className="label text-[var(--mint-deep)] mb-1.5">{block.label}</div>
          <div className="body-s text-[var(--ink-400)] leading-relaxed">{block.content}</div>
        </div>
      ))}
    </div>
  );
};
