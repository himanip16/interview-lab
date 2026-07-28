// src/features/learning/components/whiteboard/canvas/FocusEffectsLayer.tsx

import React from "react";
import { PositionedNode, NodeId } from "@/features/whiteboard/types/whiteboard";

interface FocusEffectsLayerProps {
  nodes: PositionedNode[];
  activeNodeId: NodeId | null;
}

export function FocusEffectsLayer({ nodes, activeNodeId }: FocusEffectsLayerProps) {
  if (!activeNodeId) {
    return null;
  }

  return (
    <g className="focus-effects-layer">
      {/* Dim inactive nodes */}
      {nodes.map((node) => {
        if (node.data.id === activeNodeId) {
          return null;
        }

        const left = node.x - node.width / 2;
        const top = node.y - node.height / 2;

        return (
          <rect
            key={`dim-${node.data.id}`}
            x={left}
            y={top}
            width={node.width}
            height={node.height}
            rx={12}
            fill="black"
            opacity={0.3}
            className="transition-opacity duration-500"
          />
        );
      })}
    </g>
  );
}
