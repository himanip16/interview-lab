"use client";

import React, { useState, useMemo } from 'react';
import { cn } from '@/shared/utils/utils';
import { Inspector } from '@/shared/layout/Inspector';
import { WhiteboardFrame, DiagramNode as NodeType } from '../../types/whiteboard';
import { DiagramNode } from './DiagramNode';
import { DiagramEdges } from './DiagramEdges';

const CATEGORY_COLORS: Record<string, string> = {
  entry: '#FF5A3C',
  logic: '#6A5AE0',
  storage: '#00A87E',
  network: '#15161C',
  queue: '#E8940A',
} as const;

interface WhiteboardProps {
  frame: WhiteboardFrame;
  initialSelectedId?: string;
  showInspector?: boolean;
  className?: string;
}

/**
 * Unified Whiteboard Component
 * 
 * Consolidates three duplicate implementations into a single, design-spec-compliant component.
 * 
 * Features:
 * - Grid-based positioning from whiteboard.ts types
 * - Design spec compliance (colors, spacing, animations from whiteboard.html)
 * - Reusable with/without inspector panel
 * - Responsive layout (stacks on mobile)
 * - Animated wire connections
 * 
 * @example
 * <Whiteboard frame={calculatedFrame} initialSelectedId="client" />
 */
export default function Whiteboard({ 
  frame, 
  initialSelectedId,
  showInspector = true,
  className 
}: WhiteboardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId || frame.nodes[0]?.data.id || null
  );

  // O(1) lookup for the inspector
  const activeNode = useMemo(() => 
    frame.nodes.find(n => n.data.id === selectedId)?.data || null, 
    [selectedId, frame]
  );

  return (
    <div className={cn(
      "flex flex-col xl:flex-row gap-5",
      className
    )}>
      {/* Diagram Stage */}
      <div className="flex-1 min-w-0">
        <div className="relative rounded-[22px] bg-[#FAF9F6] p-5 border border-[rgba(21,22,28,0.04)] min-h-[380px] overflow-hidden">
          
          {/* Animated Wires */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            {frame.edges.map((edge, i) => (
              <line
                key={`${edge.fromId}-${edge.toId}-${i}`}
                x1={`${(edge.start.x / 100) * 100}%`}
                y1={`${(edge.start.y / 100) * 100}%`}
                x2={`${(edge.end.x / 100) * 100}%`}
                y2={`${(edge.end.y / 100) * 100}%`}
                stroke="rgba(21,22,28,0.16)"
                strokeWidth="2"
                strokeDasharray="5 6"
                className="animate-flow"
              />
            ))}
          </svg>

          {/* Interactive Nodes */}
          {frame.nodes.map((node) => (
            <DiagramNode
              key={node.data.id}
              node={node.data}
              isSelected={selectedId === node.data.id}
              onClick={() => setSelectedId(node.data.id)}
              x={node.x}
              y={node.y}
            />
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex gap-4 text-[11.5px] font-semibold text-[#5A5B66]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF5A3C]" /> Entry
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#6A5AE0]" /> Logic
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00A87E]" /> Storage
            </span>
          </div>
        </div>
      </div>

      {/* Inspector Panel */}
      {showInspector && (
        <div className="w-full xl:w-[300px] shrink-0">
          {activeNode ? (
            <Inspector
              title={activeNode.title}
              kind={activeNode.category.toUpperCase()}
              category={activeNode.category === 'entry' ? 'practice' : 
                       activeNode.category === 'logic' ? 'concept' : 
                       activeNode.category === 'storage' ? 'neutral' : 'neutral'}
              color={CATEGORY_COLORS[activeNode.category]}
              blocks={[
                { label: 'Role & duty', content: activeNode.details.role },
                { label: 'Deep dive', content: activeNode.details.deepDive },
                { label: 'Failure modes', content: activeNode.details.failureModes },
                { label: 'Tradeoffs', content: activeNode.details.tradeoffs }
              ]}
            />
          ) : (
            <div className="h-full rounded-[22px] border border-dashed border-[rgba(21,22,28,0.15)] p-6 flex flex-col justify-center items-center text-center">
              <p className="text-[13px] text-[#5A5B66] leading-relaxed">
                Select a component on the whiteboard to inspect its architecture, failures, and tradeoffs.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
