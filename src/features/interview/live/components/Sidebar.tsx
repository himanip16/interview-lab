// components/interview/live/Sidebar.tsx
interface SidebarProps {
  summary: string;
  phase?: string;
}

export default function Sidebar({ summary, phase }: SidebarProps) {
  return (
    <aside className="w-80 border-l border-zinc-800 bg-zinc-900 flex flex-col h-full">
      <div className="p-6 border-b border-zinc-800 bg-zinc-900">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Current Phase</h2>
        <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium inline-block capitalize">
          {phase?.replace('_', ' ') || 'Intro'}
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Design Summary</h2>
        {summary ? (
          <div className="space-y-4">
            {summary.split('\n').map((line, i) => (
              <p key={i} className="text-sm text-zinc-300 leading-relaxed">
                {line.startsWith('-') ? line : `• ${line}`}
              </p>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <div className="w-8 h-8 border-2 border-zinc-700 border-t-emerald-500 rounded-full animate-spin mb-2" />
            <p className="text-xs text-zinc-500 italic">Analyzing design requirements...</p>
          </div>
        )}
      </div>
    </aside>
  );
}