// src/features/learning/components/whiteboard/canvas/NavigationHintsLayer.tsx

import React, { useMemo } from "react";
import { PositionedNode, NodeId } from "@/features/whiteboard/types/whiteboard";
import {
  NAVIGATION_HINTS,
  ARROW_CONFIG,
  WHITEBOARD_COLORS,
} from "@/features/whiteboard/theme";

interface NavigationHintsLayerProps {
  nodes: PositionedNode[];
  activeNodeId: NodeId | null;
  nextNodeId?: NodeId;
}

// Calculate intersection point with rectangle boundary
const getRectangleIntersection = (
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  rectWidth: number,
  rectHeight: number,
  centerX: number,
  centerY: number,
  padding: number
): { x: number; y: number } => {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance === 0) {
    return { x: fromX, y: fromY };
  }

  const halfWidth = rectWidth / 2 + padding;
  const halfHeight = rectHeight / 2 + padding;
  
  // Calculate intersection with each side
  const tLeft = (centerX - halfWidth - fromX) / dx;
  const tRight = (centerX + halfWidth - fromX) / dx;
  const tTop = (centerY - halfHeight - fromY) / dy;
  const tBottom = (centerY + halfHeight - fromY) / dy;

  // Find the smallest positive t
  const tValues = [tLeft, tRight, tTop, tBottom].filter(t => t > 0);
  const t = Math.min(...tValues);

  return {
    x: fromX + dx * t,
    y: fromY + dy * t,
  };
};

export function NavigationHintsLayer({
  nodes,
  activeNodeId,
  nextNodeId,
}: NavigationHintsLayerProps) {
  // Memoize node lookup to avoid repeated searches
  const nodeLookup = useMemo(() => {
    const lookup = new Map<string, PositionedNode>();
    nodes.forEach((node) => lookup.set(node.data.id, node));
    return lookup;
  }, [nodes]);

  if (!activeNodeId || !nextNodeId) {
    return null;
  }

  const activeNode = nodeLookup.get(activeNodeId);
  const nextNode = nodeLookup.get(nextNodeId);

  if (!activeNode || !nextNode) {
    return null;
  }

  // Calculate arrow from active to next
  const dx = nextNode.x - activeNode.x;
  const dy = nextNode.y - activeNode.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Guard against divide-by-zero
  if (distance === 0) {
    return null;
  }

  const angle = Math.atan2(dy, dx);

  // Calculate intersection points with node boundaries
  const startPoint = getRectangleIntersection(
    activeNode.x,
    activeNode.y,
    nextNode.x,
    nextNode.y,
    activeNode.width,
    activeNode.height,
    activeNode.x,
    activeNode.y,
    NAVIGATION_HINTS.padding
  );

  const endPoint = getRectangleIntersection(
    nextNode.x,
    nextNode.y,
    activeNode.x,
    activeNode.y,
    nextNode.width,
    nextNode.height,
    nextNode.x,
    nextNode.y,
    NAVIGATION_HINTS.padding
  );

  return (
    <g className="navigation-hints-layer">
      {/* Animated arrow with moving dash pattern */}
      <g>
        <style jsx>{`
          @keyframes dash-flow {
            to {
              stroke-dashoffset: -8;
            }
          }
          .animated-dash {
            animation: dash-flow 0.5s linear infinite;
          }
        `}</style>
        <line
          x1={startPoint.x}
          y1={startPoint.y}
          x2={endPoint.x}
          y2={endPoint.y}
          stroke={WHITEBOARD_COLORS.navigationArrow}
          strokeWidth={NAVIGATION_HINTS.strokeWidth}
          strokeDasharray={NAVIGATION_HINTS.strokeDasharray}
          opacity={NAVIGATION_HINTS.opacity}
          className="animated-dash"
        />
        
        {/* Arrow head */}
        <polygon
          points={`
            ${endPoint.x},${endPoint.y}
            ${endPoint.x - ARROW_CONFIG.headSize * Math.cos(angle - Math.PI / 6)},${endPoint.y - ARROW_CONFIG.headSize * Math.sin(angle - Math.PI / 6)}
            ${endPoint.x - ARROW_CONFIG.headSize * Math.cos(angle + Math.PI / 6)},${endPoint.y - ARROW_CONFIG.headSize * Math.sin(angle + Math.PI / 6)}
          `}
          fill={WHITEBOARD_COLORS.navigationArrow}
          opacity={NAVIGATION_HINTS.opacity}
        />
      </g>
    </g>
  );
}
