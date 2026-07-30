// src/features/learning/components/whiteboard/canvas/FocusEffectsLayer.tsx

import React, { useMemo } from "react";
import { PositionedNode, NodeId } from "@/features/whiteboard/types/whiteboard";
import {
  FOCUS_EFFECTS,
  WHITEBOARD_COLORS,
} from "@/features/whiteboard/theme";

interface FocusEffectsLayerProps {
  nodes: PositionedNode[];
  activeNodeId: NodeId | null;
}

export function FocusEffectsLayer({ nodes, activeNodeId }: FocusEffectsLayerProps) {
  if (!activeNodeId) {
    return null;
  }

  // Find active node for mask optimization
  const activeNode = useMemo(
    () => nodes.find((n) => n.data.id === activeNodeId),
    [nodes, activeNodeId]
  );

  if (!activeNode) {
    return null;
  }

  // For large boards (100+ nodes), use single overlay with mask for better performance
  // For smaller boards, individual rects are acceptable
  const useOptimizedOverlay = nodes.length > 100;

  if (useOptimizedOverlay) {
    // Optimized approach: single overlay with mask to cut out active node
    const activeLeft = activeNode.x - activeNode.width / 2;
    const activeTop = activeNode.y - activeNode.height / 2;

    return (
      <g className="focus-effects-layer">
        <defs>
          <mask id="focus-mask">
            {/* White = visible, Black = hidden */}
            <rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              fill="white"
            />
            {/* Cut out the active node area */}
            <rect
              x={activeLeft}
              y={activeTop}
              width={activeNode.width}
              height={activeNode.height}
              rx={FOCUS_EFFECTS.nodeBorderRadius}
              fill="black"
            />
          </mask>
        </defs>
        {/* Single dim overlay with mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill={WHITEBOARD_COLORS.dimOverlay}
          style={{
            opacity: FOCUS_EFFECTS.dimOpacity,
            transition: `opacity ${FOCUS_EFFECTS.transitionDuration}ms ease-in-out`,
          }}
          mask="url(#focus-mask)"
          className="transition-opacity"
        />
      </g>
    );
  }

  // Standard approach for smaller boards: individual dim rects
  return (
    <g className="focus-effects-layer">
      {nodes.map((node) => {
        const left = node.x - node.width / 2;
        const top = node.y - node.height / 2;
        const isActive = node.data.id === activeNodeId;

        if (isActive) {
          // Add highlight ring around active node
          const ringPadding = 8;
          return (
            <rect
              key={`highlight-${node.data.id}`}
              x={left - ringPadding}
              y={top - ringPadding}
              width={node.width + ringPadding * 2}
              height={node.height + ringPadding * 2}
              rx={FOCUS_EFFECTS.nodeBorderRadius + ringPadding / 2}
              fill="none"
              stroke={WHITEBOARD_COLORS.edgeActive}
              strokeWidth={2}
              style={{
                opacity: 0.8,
                transition: `opacity ${FOCUS_EFFECTS.transitionDuration}ms ease-in-out`,
              }}
              className="transition-opacity"
            />
          );
        }

        return (
          <rect
            key={`dim-${node.data.id}`}
            x={left}
            y={top}
            width={node.width}
            height={node.height}
            rx={FOCUS_EFFECTS.nodeBorderRadius}
            fill={WHITEBOARD_COLORS.dimOverlay}
            style={{
              opacity: FOCUS_EFFECTS.dimOpacity,
              transition: `opacity ${FOCUS_EFFECTS.transitionDuration}ms ease-in-out`,
            }}
            className="transition-opacity"
          />
        );
      })}
    </g>
  );
}
