// src/features/learning/components/whiteboard/canvas/NavigationHintsLayer.tsx

import React from "react";
import { PositionedNode, NodeId } from "@/features/whiteboard/types/whiteboard";

interface NavigationHintsLayerProps {
  nodes: PositionedNode[];
  activeNodeId: NodeId | null;
  nextNodeId?: NodeId;
}

export function NavigationHintsLayer({
  nodes,
  activeNodeId,
  nextNodeId,
}: NavigationHintsLayerProps) {
  if (!activeNodeId || !nextNodeId) {
    return null;
  }

  const activeNode = nodes.find((n) => n.data.id === activeNodeId);
  const nextNode = nodes.find((n) => n.data.id === nextNodeId);

  if (!activeNode || !nextNode) {
    return null;
  }

  // Calculate arrow from active to next
  const dx = nextNode.x - activeNode.x;
  const dy = nextNode.y - activeNode.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  // Arrow parameters
  const arrowLength = 30;
  const arrowHeadSize = 10;
  const startX = activeNode.x + (dx / distance) * (activeNode.width / 2 + 10);
  const startY = activeNode.y + (dy / distance) * (activeNode.height / 2 + 10);
  const endX = nextNode.x - (dx / distance) * (nextNode.width / 2 + 10);
  const endY = nextNode.y - (dy / distance) * (nextNode.height / 2 + 10);

  return (
    <g className="navigation-hints-layer">
      {/* Animated arrow */}
      <g className="animate-pulse">
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="var(--mint)"
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity="0.6"
        />
        
        {/* Arrow head */}
        <polygon
          points={`
            ${endX},${endY}
            ${endX - arrowHeadSize * Math.cos(angle - Math.PI / 6)},${endY - arrowHeadSize * Math.sin(angle - Math.PI / 6)}
            ${endX - arrowHeadSize * Math.cos(angle + Math.PI / 6)},${endY - arrowHeadSize * Math.sin(angle + Math.PI / 6)}
          `}
          fill="var(--mint)"
          opacity="0.6"
        />
      </g>
    </g>
  );
}
