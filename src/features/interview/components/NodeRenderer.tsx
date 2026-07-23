// src/features/interview/components/NodeRenderer.tsx

import { DialogueNode } from '../types/dialogue';

export function NodeRenderer({ node }: { node: DialogueNode; isLast: boolean }) {
  if (node.type === 'takeaway') {
    return (
      <div className="bg-emerald-50/50 border-l-4 border-emerald-500 p-6 rounded-r-xl my-8">
        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 block">Takeaway</span>
        <p className="text-gray-700 italic font-medium leading-relaxed">"{node.text}"</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">
        {node.roleLabel}
      </span>
      
      <div className={`p-6 rounded-2xl ${
        node.type === 'interviewer' 
          ? "bg-transparent border border-gray-100" 
          : "bg-white shadow-sm border border-gray-200"
      }`}>
        <div className="text-gray-800 leading-relaxed text-[15px]">
          {node.content ? node.content.map((part, i) => (
            part.highlight ? (
              <span key={i} className={`group relative cursor-help border-b-2 px-1 ${
                part.highlight === 'strong' ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'
              }`}>
                {part.text}
                <span className="invisible group-hover:visible absolute top-full left-0 mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg z-50 shadow-xl">
                  {part.explanation}
                </span>
              </span>
            ) : (
              <span key={i}>{part.text}</span>
            )
          )) : node.text}
        </div>
      </div>
    </div>
  );
}