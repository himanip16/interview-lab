// src/features/learning/components/whiteboard/canvas/NodesLayer.tsx

import React from "react";
import { PositionedNode, NodeId } from "@/features/whiteboard/types/whiteboard";
import { cn } from "@/shared/utils/utils";

interface NodesLayerProps {
  nodes: PositionedNode[];
  focusedNodeId: NodeId | null;
  activeNodeId: NodeId | null;
  onSelectNode: (nodeId: NodeId) => void;
  onNodeHover?: (nodeId: string | null, position?: { x: number; y: number }) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  entry: "var(--category-practice)",
  logic: "var(--category-concept)",
  storage: "var(--category-learn-deep)",
  queue: "var(--category-live)",
  network: "var(--category-neutral)",
};

const NODE_ICONS: Record<string, string> = {
  "rider-app": `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>`,
  "driver-app": `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>`,
  "api-gateway": `<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>`,
  "dispatch-service": `<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>`,
  "location-service": `<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>`,
  "pricing-service": `<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>`,
  "payment-service": `<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>`,
};

export function NodesLayer({
  nodes,
  focusedNodeId,
  activeNodeId,
  onSelectNode,
  onNodeHover,
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
            onMouseEnter={() => onNodeHover?.(node.data.id, { x: node.x + node.width / 2, y: node.y })}
            onMouseLeave={() => onNodeHover?.(null)}
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
              {/* Icon */}
              <g
                transform={`translate(${node.width / 2 - 12}, ${node.height / 2 - 28})`}
                fill="white"
                fillOpacity="0.9"
              >
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <g dangerouslySetInnerHTML={{ __html: NODE_ICONS[node.data.id] || "" }} />
                </svg>
              </g>
              {/* Title */}
              <text
                x={node.width / 2}
                y={node.height / 2 + 8}
                fontSize="12.5"
                fontWeight="700"
                fill="white"
                textAnchor="middle"
              >
                {node.data.title}
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
