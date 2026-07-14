// src/features/library/components/transcript/TranscriptLegend.tsx
export default function TranscriptLegend() {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-6 mb-6 pb-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Legend:
      </span>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
        <span className="text-xs text-gray-600">Strong moment</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-rose-500"></span>
        <span className="text-xs text-gray-600">Missed something</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 italic">Click highlights for AI explanation</span>
      </div>
    </div>
  );
}
