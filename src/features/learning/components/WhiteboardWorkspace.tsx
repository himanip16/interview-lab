"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Panel } from '@/components/ui/Panel';
import { Inspector } from '@/components/layout/Inspector';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { WHITEBOARD_SYSTEMS, WHITEBOARD_SYSTEM_LIST } from '../data/whiteboardSystems';
import { useRouter } from 'next/navigation';

export default function WhiteboardWorkspace({ initialSlug }: { initialSlug: string }) {
  const router = useRouter();
  const [currentSlug, setCurrentSlug] = useState(initialSlug);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const system = WHITEBOARD_SYSTEMS[currentSlug] || WHITEBOARD_SYSTEMS['url-shortener'];
  const activeNode = system.nodes.find(n => n.id === selectedNodeId);

  // Categorized colors based on DESIGN_SPECIFICATION.md
  const getCategoryColor = (kind: string) => {
    const k = kind.toLowerCase();
    if (k.includes('client')) return '#FF5A3C'; // var(--coral)
    if (k.includes('gateway')) return '#15161C'; // var(--ink)
    if (k.includes('service')) return '#6A5AE0'; // var(--violet)
    if (k.includes('storage') || k.includes('database')) return '#00A87E'; // var(--mint-deep)
    return '#5A5B66';
  };

  return (
    <Panel variant="default" className="max-w-[1080px] mx-auto p-[30px_36px_36px] bg-white">
      {/* Navigation */}
      <div className="mb-8">
        <Breadcrumb
          items={[
            { label: 'Learn', href: '/learn' },
            { label: 'Whiteboarding', active: true }
          ]}
          onBack={() => router.push('/learn')}
        />
      </div>

      {/* Header & System Pills */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="heading-m font-semibold text-[var(--ink)]">{system.title}</h1>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--mint)] animate-pulse" />
          </div>
          <p className="body-s text-[var(--ink-400)]">Click nodes to inspect architectural tradeoffs</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {WHITEBOARD_SYSTEM_LIST.map((sys) => (
            <button
              key={sys.slug}
              onClick={() => {
                setCurrentSlug(sys.slug);
                setSelectedNodeId(null);
              }}
              className={cn(
                "px-4 py-1.5 radius-pill text-xs font-semibold transition-all border",
                currentSlug === sys.slug 
                  ? "bg-[var(--ink)] text-white border-[var(--ink)]" 
                  : "bg-white text-[var(--ink-400)] border-[var(--border)] hover:border-[var(--ink-200)]"
              )}
            >
              {sys.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Stage */}
      <div className="flex flex-col xl:flex-row gap-6 min-h-[500px]">
        {/* Diagram Area */}
        <div className="flex-1 relative bg-[#FAF9F6] radius-panel border border-[rgba(21,22,28,0.04)] overflow-hidden min-h-[400px]">
          {/* Animated Wires Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(21,22,28,0.15)" />
              </marker>
            </defs>
            {/* Horizontal flow line example from spec */}
            <path 
              d="M 50,50 Q 540,50 900,50" 
              fill="none" 
              stroke="rgba(21,22,28,0.1)" 
              strokeWidth="2" 
              strokeDasharray="6 8"
              className="animate-flow"
            />
          </svg>

          {/* Interactive Nodes */}
          {system.nodes.map((node) => (
            <div
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              style={{
                top: node.position.top,
                left: node.position.left,
                right: node.position.right,
                bottom: node.position.bottom,
                transform: node.position.transform,
                backgroundColor: node.color || getCategoryColor(node.kind)
              }}
              className={cn(
                "absolute w-[150px] p-4 radius-card text-white cursor-pointer transition-all duration-300 shadow-sm z-20 hover:-translate-y-1",
                selectedNodeId === node.id ? "ring-4 ring-offset-4 ring-offset-[#FAF9F6] ring-[rgba(0,217,163,0.35)]" : "opacity-95"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-white/40 mb-3" />
              <div className="text-[13.5px] font-semibold leading-tight">{node.title}</div>
              <div className="text-[10.5px] text-white/70 mt-1 uppercase font-bold tracking-tighter">
                {node.kind.split(' · ')[0]}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-6 left-6 flex gap-4">
            {[
              { label: 'Entry', color: '#FF5A3C' },
              { label: 'Logic', color: '#6A5AE0' },
              { label: 'Storage', color: '#00A87E' }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-[11px] font-bold text-[var(--ink-400)] uppercase tracking-wider">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Inspector Panel */}
        <div className="w-full xl:w-[300px] shrink-0">
          {activeNode ? (
            <Inspector
              title={activeNode.title}
              kind={activeNode.kind}
              color={activeNode.color || getCategoryColor(activeNode.kind)}
              className="h-full border-none shadow-none bg-transparent p-0"
              blocks={[
                { label: 'Role & Duty', content: activeNode.role },
                { label: 'Extreme Deep-Dive', content: activeNode.deep },
                { label: 'Failure Scenarios', content: activeNode.failure },
                { label: 'Design Tradeoffs', content: activeNode.tradeoffs }
              ]}
            />
          ) : (
            <div className="h-full radius-card border border-dashed border-[var(--border)] p-8 flex flex-col justify-center items-center text-center">
              <p className="body-s text-[var(--ink-400)]">
                Select a component on the whiteboard to inspect its architecture.
              </p>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}