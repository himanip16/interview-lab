'use client';

import { useState } from 'react';
import { DialogueNode } from '../types/dialogue';
import { NodeRenderer } from './NodeRenderer';

export default function LiveInterviewClient({ initialTranscript }: { initialTranscript: DialogueNode[] }) {
  const [visibleCount, setVisibleCount] = useState(1);

  const showNext = () => {
    if (visibleCount < initialTranscript.length) {
      setVisibleCount(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Legend */}
      <div className="flex gap-6 mb-12 text-xs font-medium text-gray-500 border-b pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Strong moment
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500" /> Missed something
        </div>
      </div>

      <div className="space-y-10">
        {initialTranscript.slice(0, visibleCount).map((node, idx) => (
          <NodeRenderer key={node.id} node={node} isLast={idx === visibleCount - 1} />
        ))}
      </div>

      {visibleCount < initialTranscript.length && (
        <button 
          onClick={showNext}
          className="mt-12 w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-all font-medium"
        >
          Tap to continue conversation...
        </button>
      )}
    </div>
  );
}