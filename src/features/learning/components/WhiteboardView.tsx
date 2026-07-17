"use client";

import React, { useState, useRef, useMemo } from "react";
import { Inspector } from "@/components/layout/Inspector";
import { getConnectionPoint, Point, Rect } from "../utils/geometry";
import { cn } from "@/lib/utils";

/**
 * 1. INTERNAL TYPES
 */
export interface DiagramNode {
  id: string;
  title: string;
  category: 'entry' | 'logic' | 'storage';
  gridPos: { x: number; y: number };
  details: {
    role: string;
    deepDive: string;
    failureModes: string;
    tradeoffs: string;
  };
}

export interface DiagramEdge {
  from: string;
  to: string;
}

interface NodeProps {
  node: DiagramNode;
  position: Rect;
  isSelected: boolean;
  onClick: () => void;
}

/**
 * 2. CONFIG & CONSTANTS
 */
const GRID_CONFIG = { 
  COLS: 12, 
  ROWS: 8, 
  NODE_WIDTH: 160, 
  NODE_HEIGHT: 80 
};

const CATEGORY_MAP = {
  entry: "bg-coral border-coral/20 focus:ring-coral/40",
  logic: "bg-violet border-violet/20 focus:ring-violet/40",
  storage: "bg-mint-deep border-mint-deep/20 focus:ring-mint-deep/40",
} as const;

/**
 * 3. ATOMIC NODE COMPONENT
 */
const Node: React.FC<NodeProps> = ({ node, position, isSelected, onClick }) => (
  <button
    role="button"
    aria-pressed={isSelected}
    onClick={onClick}
    style={{ 
      transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))` 
    }}
    className={cn(
      "absolute left-0 top-0 w-[160px] p-4 rounded-xl text-white text-left transition-all",
      "hover:scale-105 focus:outline-none focus:ring-4",
      CATEGORY_MAP[node.category],
      isSelected ? "ring-4 ring-ink/20 scale-105 z-30 shadow-lg" : "z-20 opacity-90 shadow-sm"
    )}
  >
    <span className="block text-xs font-bold truncate">{node.title}</span>
    <span className="block text-[10px] opacity-70 uppercase font-bold tracking-wider">
      {node.category}
    </span>
  </button>
);

/**
 * 4. MAIN ORCHESTRATOR
 */
export default function WhiteboardView({ 
  design, 
  edges 
}: { 
  design: DiagramNode[], 
  edges: DiagramEdge[] 
}) {
  const [selectedId, setSelectedId] = useState<string | null>(design[0]?.id || null);
  const containerRef = useRef<HTMLDivElement>(null);

  // O(1) Data Lookup
  const nodeMap = useMemo(() => 
    new Map<string, DiagramNode>(design.map(n => [n.id, n])), 
  [design]);

  // Layout Projection (Grid -> Pixels)
  const layout = useMemo<Rect[]>(() => {
    return design.map((node) => ({
      id: node.id,
      x: (node.gridPos.x / GRID_CONFIG.COLS) * 1000,
      y: (node.gridPos.y / GRID_CONFIG.ROWS) * 600,
      width: GRID_CONFIG.NODE_WIDTH,
      height: GRID_CONFIG.NODE_HEIGHT
    }));
  }, [design]);

  const layoutMap = useMemo(() => 
    new Map<string, Rect>(layout.map((l: any) => [l.id, l])), 
  [layout]);

  const activeNode = selectedId ? nodeMap.get(selectedId) : null;

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-full min-h-[600px]">
      {/* WHITEBOARD CANVAS */}
      <div className="flex-1 relative overflow-auto rounded-panel bg-paper border border-[rgba(21,22,28,0.06)] custom-scrollbar">
        <div className="relative w-[1100px] h-[700px] p-12">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map((edge) => {
              const s = layoutMap.get(edge.from);
              const t = layoutMap.get(edge.to);
              
              if (!s || !t) return null;

              const start = getConnectionPoint(s, t);
              const end = getConnectionPoint(t, s);

              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={start.x} y1={start.y} x2={end.x} y2={end.y}
                  stroke="currentColor" 
                  className="text-ink/10 animate-flow"
                  strokeWidth="2" 
                  strokeDasharray="6,6"
                />
              );
            })}
          </svg>

          {design.map((node) => {
            const pos = layoutMap.get(node.id);
            if (!pos) return null;

            return (
              <Node
                key={node.id}
                node={node}
                position={pos}
                isSelected={selectedId === node.id}
                onClick={() => setSelectedId(node.id)}
              />
            );
          })}
        </div>
      </div>
      
      {/* INSPECTOR PANEL */}
      <aside className="w-full xl:w-[340px] shrink-0">
         {activeNode ? (
           <Inspector 
             title={activeNode.title}
             kind={activeNode.category.toUpperCase()}
             // Colors match the Node styles for visual consistency
             color={
               activeNode.category === 'entry' ? 'var(--coral)' : 
               activeNode.category === 'logic' ? 'var(--violet)' : 'var(--mint-deep)'
             }
             blocks={[
               { label: "Role & Duty", content: activeNode.details.role },
               { label: "Deep Dive", content: activeNode.details.deepDive },
               { label: "Failure Modes", content: activeNode.details.failureModes },
               { label: "Tradeoffs", content: activeNode.details.tradeoffs },
             ]}
           />
         ) : (
           <div className="h-full rounded-card border border-dashed border-ink/10 p-8 flex items-center justify-center text-center text-ink/40 text-sm">
             Select a component on the whiteboard to view architectural details.
           </div>
         )}
      </aside>
    </div>
  );
}