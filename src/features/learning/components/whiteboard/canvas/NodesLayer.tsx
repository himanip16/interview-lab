// src/features/learning/components/whiteboard/canvas/NodesLayer.tsx

import React from "react";
import { PositionedNode, NodeId } from "@/features/whiteboard/types/whiteboard";
import { cn } from "@/shared/utils/utils";

interface NodesLayerProps {
  nodes: PositionedNode[];
  focusedNodeId: NodeId | null;
  activeNodeId: NodeId | null;
  onSelectNode: (nodeId: NodeId) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  entry: "var(--category-practice)",
  logic: "var(--category-concept)",
  storage: "var(--category-learn-deep)",
  queue: "var(--category-live)",
  network: "var(--category-neutral)",
};

export function NodesLayer({
  nodes,
  focusedNodeId,
  activeNodeId,
  onSelectNode,
}: NodesLayerProps) {
  return (
    <g className="nodes-layer">
      {nodes.map((node) => {
        const isFocused = node.data.id === focusedNodeId;
        const isActive = node.data.id === activeNodeId;
        const color = CATEGORY_COLORS[node.data.category] || CATEGORY_COLORS.network;
        const left = node.x - node.width / 2;
        const top = node.y - node.height / 2;
        const clipId = `clip-${node.data.id}`;

        return (
          <g
            key={node.data.id}
            transform={`translate(${left}, ${top})`}
            onClick={() => onSelectNode(node.data.id)}
            role="button"
            aria-label={`Inspect ${node.data.title}`}
            aria-pressed={isFocused || isActive}
            tabIndex={0}
            style={{ cursor: "pointer" }}
            className={cn(
              "transition-all duration-300",
              isActive && "scale-110"
            )}
          >
            <clipPath id={clipId}>
              <rect width={node.width} height={node.height} rx={12} />
            </clipPath>

            {/* Node background */}
            <rect
              width={node.width}
              height={node.height}
              rx={12}
              fill={color}
              stroke={color}
              opacity={isActive ? 1 : isFocused ? 0.95 : 0.9}
            />

            {/* Node content */}
            <g clipPath={`url(#${clipId})`}>
              <text
                x={12}
                y={22}
                fontSize="12"
                fontWeight="700"
                fill="white"
              >
                {node.data.title}
              </text>
              <text
                x={12}
                y={node.height - 12}
                fontSize="9"
                fontWeight="700"
                fill="white"
                opacity="0.7"
                style={{ textTransform: "uppercase" }}
              >
                {node.data.category}
              </text>
            </g>

            {/* Focus ring */}
            {(isFocused || isActive) && (
              <rect
                x={-4}
                y={-4}
                width={node.width + 8}
                height={node.height + 8}
                rx={16}
                fill="none"
                stroke={isActive ? "var(--mint)" : "var(--ink)"}
                strokeOpacity="0.3"
                strokeWidth="4"
              />
            )}

            {/* Active glow effect */}
            {isActive && (
              <rect
                x={-6}
                y={-6}
                width={node.width + 12}
                height={node.height + 12}
                rx={18}
                fill="none"
                stroke="var(--mint)"
                strokeOpacity="0.2"
                strokeWidth="2"
                className="animate-pulse"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}
