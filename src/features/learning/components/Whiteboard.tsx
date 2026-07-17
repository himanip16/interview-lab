"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Inspector } from '@/components/layout/Inspector';
import { WhiteboardSystem } from '../types/learning';

interface WhiteboardProps {
  systemData: WhiteboardSystem;
  selectedNodeId: string;
  onSelectNode: (id: string) => void;
}

export default function Whiteboard({ 
  systemData, 
  selectedNodeId, 
  onSelectNode 
}: WhiteboardProps) {
  const selectedData = systemData.nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* 1. Diagram Stage with Horizontal Scroll Prevention */}
      <div className="flex-1 min-w-0 overflow-x-auto pb-4 custom-scrollbar">
        <div
          className={cn(
            "relative rounded-3xl bg-[#FAF9F6] p-8 border border-[rgba(21,22,28,0.04)]",
            "min-h-[560px] min-w-[760px]" // Enforced minimums to prevent node overlap
          )}
        >
          {/* SVG Wires - Scaled to the min-w/h */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M20 15 L80 15" 
              vectorEffect="non-scaling-stroke"
              stroke="rgba(21,22,28,0.12)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="6 8"
              className="animate-flow"
            />
            {/* Add logic here to render wires based on systemData.connections if needed */}
          </svg>

          {/* Dynamic Nodes */}
          {systemData.nodes.map((node) => (
            <div
              key={node.id}
              style={{ 
                top: node.position.top, 
                left: node.position.left,
                right: node.position.right,
                bottom: node.position.bottom,
                backgroundColor: node.color 
              }}
              className={cn(
                'absolute w-[160px] p-4 rounded-2xl text-white cursor-pointer transition-all duration-300 shadow-sm z-10',
                'hover:-translate-y-1 hover:shadow-lg active:scale-95',
                selectedNodeId === node.id && 'ring-4 ring-offset-2 ring-offset-[#FAF9F6] ring-opacity-40',
              )}
              onClick={() => onSelectNode(node.id)}
            >
              <div className="w-2 h-2 rounded-full bg-white/60 mb-3" />
              <div className="text-[14px] font-bold leading-tight">{node.title}</div>
              <div className="text-[11px] text-white/70 mt-1 uppercase tracking-wider font-medium">
                {node.kind.split(' · ')[0]}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-8 left-8 flex gap-5 text-[11px] font-semibold text-[#5A5B66] uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A3C]" /> Entry
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6A5AE0]" /> Logic
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00A87E]" /> Storage
            </span>
          </div>
        </div>
      </div>

      {/* 2. Inspector with Fixed Basis (The flex fix) */}
      <div className="w-full xl:w-[340px] shrink-0">
        {selectedData ? (
          <Inspector
            title={selectedData.title}
            kind={selectedData.kind}
            color={selectedData.color}
            blocks={[
              { label: 'Role & duty', content: selectedData.role },
              { label: 'Deep dive', content: selectedData.deep },
              { label: 'Failure modes', content: selectedData.failure },
              { label: 'Tradeoffs', content: selectedData.tradeoffs }
            ]}
          />
        ) : (
          <div className="h-full rounded-3xl border border-dashed border-[rgba(21,22,28,0.15)] p-8 flex flex-col justify-center items-center text-center">
            <p className="text-[13px] text-[#5A5B66] leading-relaxed">
              Select a component on the whiteboard to inspect its architecture, failures, and tradeoffs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}