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
              <rect width={node.width} height={node.height} rx={16} />
            </clipPath>

            {/* Subtle shadow for depth */}
            <defs>
              <filter id={`shadow-${node.data.id}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Node background with shadow */}
            <rect
              width={node.width}
              height={node.height}
              rx={16}
              fill={color}
              stroke={color}
              opacity={isActive ? 1 : isFocused ? 0.95 : 0.9}
              filter={`url(#shadow-${node.data.id})`}
              className={cn(
                "transition-all duration-300",
                !isFocused && !isActive && "hover:opacity-100 hover:scale-105"
              )}
            />

            {/* Node content */}
            <g clipPath={`url(#${clipId})`}>
              <text
                x={16}
                y={28}
                fontSize="16"
                fontWeight="700"
                fill="white"
              >
                {node.data.title}
              </text>
              <text
                x={16}
                y={node.height - 16}
                fontSize="12"
                fontWeight="700"
                fill="white"
                opacity="0.8"
                style={{ textTransform: "uppercase" }}
              >
                {node.data.category}
              </text>
            </g>

            {/* Hover glow effect */}
            {!isFocused && !isActive && (
              <rect
                x={-2}
                y={-2}
                width={node.width + 4}
                height={node.height + 4}
                rx={18}
                fill="none"
                stroke={color}
                strokeOpacity="0"
                strokeWidth="3"
                className="hover:stroke-opacity-30 transition-all duration-300"
              />
            )}

            {/* Focus ring */}
            {(isFocused || isActive) && (
              <rect
                x={-4}
                y={-4}
                width={node.width + 8}
                height={node.height + 8}
                rx={20}
                fill="none"
                stroke={isActive ? "var(--mint)" : "var(--ink)"}
                strokeOpacity="0.4"
                strokeWidth="4"
                className="transition-all duration-300"
              />
            )}

            {/* Active glow effect */}
            {isActive && (
              <>
                <rect
                  x={-8}
                  y={-8}
                  width={node.width + 16}
                  height={node.height + 16}
                  rx={24}
                  fill="none"
                  stroke="var(--mint)"
                  strokeOpacity="0.3"
                  strokeWidth="2"
                  className="animate-pulse transition-all duration-300"
                />
                <rect
                  x={-12}
                  y={-12}
                  width={node.width + 24}
                  height={node.height + 24}
                  rx={28}
                  fill="none"
                  stroke="var(--mint)"
                  strokeOpacity="0.15"
                  strokeWidth="1"
                  className="animate-pulse transition-all duration-500"
                />
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}
