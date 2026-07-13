// components/interview/live/Sidebar.tsx
interface SidebarProps {
  summary: string | null;
  phase?: string;
  isSummaryLoading?: boolean;
}

export default function Sidebar({ summary, phase, isSummaryLoading = false }: SidebarProps) {
  return (
    <aside className="w-80 border-l border-border bg-card flex flex-col h-full">
      <div className="p-6 border-b border-border bg-card">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Current Phase</h2>
        <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium inline-block capitalize">
          {phase?.replace('_', ' ') || 'Intro'}
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Design Summary</h2>
        {isSummaryLoading || !summary ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin mb-2" />
            <p className="text-xs text-muted-foreground italic">Analyzing design requirements...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {summary.split('\n').map((line, i) => (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                {line.startsWith('-') ? line : `• ${line}`}
              </p>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}