"use client";

import { useMemo, useState } from "react";

import { cn } from "@/shared/utils/utils";
import { Inspector } from "@/shared/layout/Inspector";

import { WhiteboardFrame } from "@/features/whiteboard/types/whiteboard";
import { DiagramNode } from "./DiagramNode";
import { DiagramEdges } from "./DiagramEdges";

const CATEGORY_COLORS = {
  entry: "var(--category-practice)",
  logic: "var(--category-concept)",
  storage: "var(--category-learn-deep)",
  network: "var(--category-neutral)",
  queue: "var(--category-live)",
} as const;

interface WhiteboardProps {
  frame: WhiteboardFrame;
  initialSelectedId?: string;
  showInspector?: boolean;
  className?: string;
}

export default function Whiteboard({
  frame,
  initialSelectedId,
  showInspector = true,
  className,
}: WhiteboardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId ?? frame.nodes[0]?.data.id ?? null
  );

  const activeNode = useMemo(
    () => frame.nodes.find((n) => n.data.id === selectedId)?.data ?? null,
    [frame, selectedId]
  );

  return (
    <div className={cn("flex flex-col xl:flex-row gap-5", className)}>
      <div className="flex-1 min-w-0">
        <div className="relative rounded-[22px] bg-[#FAF9F6] p-5 border border-[rgba(21,22,28,0.04)] min-h-[380px] overflow-hidden">

          <DiagramEdges edges={frame.edges} />

          {frame.nodes.map((node) => (
            <DiagramNode
              key={node.data.id}
              node={node.data}
              x={node.x}
              y={node.y}
              isSelected={selectedId === node.data.id}
              onClick={() => setSelectedId(node.data.id)}
            />
          ))}

          <div className="absolute bottom-4 left-4 flex gap-4 text-[11.5px] font-semibold text-[#5A5B66]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--category-practice)]" />
              Entry
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--category-concept)]" />
              Logic
            </span>

            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--category-learn-deep)]" />
              Storage
            </span>
          </div>
        </div>
      </div>

      {showInspector && (
        <div className="w-full xl:w-[300px] shrink-0">
          {activeNode ? (
            <Inspector
              title={activeNode.title}
              kind={activeNode.category.toUpperCase()}
              category={
                activeNode.category === "entry"
                  ? "practice"
                  : activeNode.category === "logic"
                  ? "concept"
                  : "neutral"
              }
              color={CATEGORY_COLORS[activeNode.category]}
              blocks={[
                {
                  label: "Role & duty",
                  content: activeNode.details.role,
                },
                {
                  label: "Deep dive",
                  content: activeNode.details.deepDive,
                },
                {
                  label: "Failure modes",
                  content: activeNode.details.failureModes,
                },
                {
                  label: "Tradeoffs",
                  content: activeNode.details.tradeoffs,
                },
              ]}
            />
          ) : (
            <div className="h-full rounded-[22px] border border-dashed border-[rgba(21,22,28,0.15)] p-6 flex flex-col justify-center items-center text-center">
              <p className="text-[13px] text-[#5A5B66] leading-relaxed">
                Select a component on the whiteboard to inspect its architecture,
                failures, and tradeoffs.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}