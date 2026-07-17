"use client";

import React, { useState, useMemo } from "react";
import { Inspector } from "@/components/layout/Inspector";
import { WhiteboardFrame, DiagramNode } from "../types/whiteboard";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS = {
  entry: "#FF5A3C", logic: "#6A5AE0", storage: "#00A87E", 
  network: "#15161C", queue: "#E8940A"
} as const;

export default function WhiteboardView({ frame }: { frame: WhiteboardFrame }) {
  const [selectedId, setSelectedId] = useState<string | null>(frame.nodes[0]?.data.id || null);

  // O(1) lookup for the inspector
  const activeNode = useMemo(() => 
    frame.nodes.find(n => n.data.id === selectedId)?.data || null, 
  [selectedId, frame]);

  return (
    <div className="flex flex-col xl:flex-row gap-8 h-[700px] animate-in fade-in duration-500">
      <div className="flex-1 relative overflow-auto rounded-panel border bg-paper shadow-inner border-ink/5">
        <div className="relative w-[1100px] h-[900px] p-12">
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            {frame.edges.map((edge, i) => (
              <line key={`${edge.fromId}-${edge.toId}-${i}`} 
                x1={edge.start.x} y1={edge.start.y} x2={edge.end.x} y2={edge.end.y}
                stroke="currentColor" className="text-ink animate-flow"
                strokeWidth="2" strokeDasharray="6,6" />
            ))}
          </svg>

          {frame.nodes.map((node) => (
            <button
              key={node.data.id}
              onClick={() => setSelectedId(node.data.id)}
              style={{ transform: `translate(calc(${node.x}px - 50%), calc(${node.y}px - 50%))` }}
              className={cn(
                "absolute left-0 top-0 w-40 p-4 rounded-xl text-white text-left transition-all",
                "hover:scale-105 focus:outline-none focus:ring-4 shadow-md",
                `category-bg-${node.data.category}`, // Ensure these are in safeList or mapped
                selectedId === node.data.id ? "ring-4 ring-ink/20 z-30 scale-105" : "z-20 opacity-90"
              )}
            >
              <span className="block text-xs font-bold truncate">{node.data.title}</span>
              <span className="block text-[10px] opacity-70 uppercase font-extrabold tracking-tighter">
                {node.data.category}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      <aside className="w-full xl:w-[340px] shrink-0">
         {activeNode && (
           <Inspector 
             title={activeNode.title}
             kind={activeNode.category.toUpperCase()}
             color={CATEGORY_COLORS[activeNode.category]}
             blocks={[
               { label: "Role", content: activeNode.details.role },
               { label: "Deep Dive", content: activeNode.details.deepDive },
               { label: "Failures", content: activeNode.details.failureModes },
               { label: "Tradeoffs", content: activeNode.details.tradeoffs },
             ]}
           />
         )}
      </aside>
    </div>
  );
}