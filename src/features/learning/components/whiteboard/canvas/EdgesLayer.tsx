// src/features/learning/components/whiteboard/canvas/EdgesLayer.tsx

import React, { useMemo, useCallback } from "react";
import { PositionedEdge } from "@/features/whiteboard/types/whiteboard";
import {
  WHITEBOARD_COLORS,
  EDGE_STYLES,
  ARROW_CONFIG,
  INTERACTION_TARGETS,
} from "@/features/whiteboard/theme";

interface EdgeStyle {
  stroke: string;
  strokeWidth: string;
  strokeDasharray: string;
  opacity?: number;
}

interface EdgesLayerProps {
  edges: PositionedEdge[];
  activeEdgeId?: string;
  previousNodeId?: string;
  activeNodeId?: string;
  onEdgeClick?: (edgeId: string) => void;
  onEdgeHover?: (edgeId: string | null) => void;
  hoveredEdgeId?: string;
  showAnimation?: boolean;
}

// Check if edge is active (bidirectional matching)
const isEdgeActive = (
  edge: PositionedEdge,
  activeEdgeId: string | undefined,
  previousNodeId: string | undefined,
  activeNodeId: string | undefined
): boolean => {
  if (edge.id === activeEdgeId) return true;
  
  // Bidirectional matching: check both A → B and B → A
  const isForward = edge.fromId === previousNodeId && edge.toId === activeNodeId;
  const isReverse = edge.fromId === activeNodeId && edge.toId === previousNodeId;
  
  return isForward || isReverse;
};

// Get edge style based on state
const getEdgeStyle = (isActive: boolean, isHovered: boolean): EdgeStyle => {
  if (isActive) {
    return {
      stroke: WHITEBOARD_COLORS.edgeActive,
      strokeWidth: String(EDGE_STYLES.active.strokeWidth),
      strokeDasharray: EDGE_STYLES.active.strokeDasharray,
    };
  }
  if (isHovered) {
    return {
      stroke: WHITEBOARD_COLORS.edgeHover,
      strokeWidth: String(EDGE_STYLES.hover.strokeWidth),
      strokeDasharray: EDGE_STYLES.hover.strokeDasharray,
    };
  }
  return {
    stroke: WHITEBOARD_COLORS.edgeNormal,
    strokeWidth: String(EDGE_STYLES.normal.strokeWidth),
    strokeDasharray: EDGE_STYLES.normal.strokeDasharray,
  };
};

export function EdgesLayer({
  edges,
  activeEdgeId,
  previousNodeId,
  activeNodeId,
  onEdgeClick,
  onEdgeHover,
  hoveredEdgeId,
  showAnimation = false,
}: EdgesLayerProps) {
  // Memoize active edge calculations for performance
  const edgeStates = useMemo(() => {
    return edges.map((edge) => ({
      edge,
      isActive: isEdgeActive(edge, activeEdgeId, previousNodeId, activeNodeId),
      isHovered: edge.id === hoveredEdgeId,
    }));
  }, [edges, activeEdgeId, previousNodeId, activeNodeId, hoveredEdgeId]);

  const handleEdgeClick = useCallback(
    (edgeId: string) => {
      onEdgeClick?.(edgeId);
    },
    [onEdgeClick]
  );

  const handleEdgeHover = useCallback(
    (edgeId: string | null) => {
      onEdgeHover?.(edgeId);
    },
    [onEdgeHover]
  );

  return (
    <g className="edges-layer">
      {/* Arrow marker definition */}
      <defs>
        <marker
          id="arrowhead-active"
          markerWidth={ARROW_CONFIG.markerWidth}
          markerHeight={ARROW_CONFIG.markerHeight}
          refX={ARROW_CONFIG.refX}
          refY={ARROW_CONFIG.refY}
          orient="auto"
        >
          <polygon
            points={`0,0 ${ARROW_CONFIG.markerWidth},${ARROW_CONFIG.markerHeight / 2} 0,${ARROW_CONFIG.markerHeight}`}
            fill={WHITEBOARD_COLORS.edgeActive}
          />
        </marker>
        <marker
          id="arrowhead-normal"
          markerWidth={ARROW_CONFIG.markerWidth}
          markerHeight={ARROW_CONFIG.markerHeight}
          refX={ARROW_CONFIG.refX}
          refY={ARROW_CONFIG.refY}
          orient="auto"
        >
          <polygon
            points={`0,0 ${ARROW_CONFIG.markerWidth},${ARROW_CONFIG.markerHeight / 2} 0,${ARROW_CONFIG.markerHeight}`}
            fill={WHITEBOARD_COLORS.edgeNormal}
          />
        </marker>
      </defs>

      {edgeStates.map(({ edge, isActive, isHovered }) => {
        const style = getEdgeStyle(isActive, isHovered);
        const markerId = isActive ? "url(#arrowhead-active)" : "url(#arrowhead-normal)";

        return (
          <g key={edge.id} className="edge-group">
            {/* Invisible click target for easier interaction */}
            <line
              x1={edge.start.x}
              y1={edge.start.y}
              x2={edge.end.x}
              y2={edge.end.y}
              stroke="transparent"
              strokeWidth={INTERACTION_TARGETS.clickTargetStrokeWidth}
              style={{ opacity: INTERACTION_TARGETS.clickTargetOpacity }}
              onClick={() => handleEdgeClick(edge.id)}
              onMouseEnter={() => handleEdgeHover(edge.id)}
              onMouseLeave={() => handleEdgeHover(null)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`Edge from ${edge.fromId} to ${edge.toId}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleEdgeClick(edge.id);
                }
              }}
            />

            {/* Visible edge line */}
            <line
              x1={edge.start.x}
              y1={edge.start.y}
              x2={edge.end.x}
              y2={edge.end.y}
              stroke={style.stroke}
              strokeWidth={style.strokeWidth}
              strokeDasharray={style.strokeDasharray}
              markerEnd={markerId}
              className={isActive ? "animate-flow" : ""}
              pointerEvents="none"
            />

            {/* Animated moving dot for active edges */}
            {isActive && showAnimation && (
              <>
                <circle
                  r="11"
                  fill="rgba(106,90,224,0.28)"
                  cx={edge.start.x}
                  cy={edge.start.y}
                >
                  <animateMotion
                    dur="1.1s"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.3 0 0.15 1"
                    path={`M${edge.start.x},${edge.start.y} L${edge.end.x},${edge.end.y}`}
                  />
                </circle>
                <circle
                  r="6"
                  fill="var(--violet)"
                  cx={edge.start.x}
                  cy={edge.start.y}
                >
                  <animateMotion
                    dur="1.1s"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.3 0 0.15 1"
                    path={`M${edge.start.x},${edge.start.y} L${edge.end.x},${edge.end.y}`}
                  />
                </circle>
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}
