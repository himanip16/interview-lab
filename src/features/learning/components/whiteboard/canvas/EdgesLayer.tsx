// src/features/learning/components/whiteboard/canvas/EdgesLayer.tsx

import React from "react";
import { PositionedEdge } from "@/features/whiteboard/types/whiteboard";

interface EdgesLayerProps {
  edges: PositionedEdge[];
  activeEdgeId?: string;
  previousNodeId?: string;
  activeNodeId?: string;
}

export function EdgesLayer({
  edges,
  activeEdgeId,
  previousNodeId,
  activeNodeId,
}: EdgesLayerProps) {
  return (
    <g className="edges-layer">
      {edges.map((edge) => {
        const isActive =
          edge.id === activeEdgeId ||
          (edge.fromId === previousNodeId && edge.toId === activeNodeId);

        return (
          <line
            key={edge.id}
            x1={edge.start.x}
            y1={edge.start.y}
            x2={edge.end.x}
            y2={edge.end.y}
            stroke={isActive ? "rgba(0, 217, 163, 0.6)" : "rgba(21, 22, 28, 0.16)"}
            strokeWidth={isActive ? "3" : "2"}
            strokeDasharray={isActive ? "0" : "5 6"}
            className={isActive ? "animate-flow" : ""}
          />
        );
      })}
    </g>
  );
}
