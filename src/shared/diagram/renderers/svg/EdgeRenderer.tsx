// src/shared/diagram/renderers/svg/EdgeRenderer.tsx
//
// Renders a single DiagramEdge. Edges are stored as node-id references
// (from/to), so this component looks up the actual node positions and
// draws a line clipped to each node's boundary (not its center), with an
// optional arrowhead and label.

import React from 'react';
import type { DiagramEdge, DiagramNode } from '../../types';

export interface EdgeRendererProps {
  edge: DiagramEdge;
  nodesById: Map<string, DiagramNode>;
  markerId: string;
}

export function EdgeRenderer({ edge, nodesById, markerId }: EdgeRendererProps) {
  const from = nodesById.get(edge.from);
  const to = nodesById.get(edge.to);
  if (!from || !to) return null;

  const start = pointOnBoundary(from, to);
  const end = pointOnBoundary(to, from);

  const direction = edge.direction ?? 'forward';
  const dashed = edge.style === 'dashed';

  return (
    <g>
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="var(--diagram-edge-stroke, #666)"
        strokeWidth={1.5}
        strokeDasharray={dashed ? '4 3' : undefined}
        markerEnd={direction !== 'none' ? `url(#${markerId})` : undefined}
        markerStart={direction === 'bidirectional' ? `url(#${markerId})` : undefined}
      />
      {edge.label && (
        <text
          x={(start.x + end.x) / 2}
          y={(start.y + end.y) / 2 - 6}
          textAnchor="middle"
          fontSize={11}
          fill="var(--diagram-edge-label, #999)"
        >
          {edge.label}
        </text>
      )}
    </g>
  );
}

/**
 * Returns the point where the line from `node` toward `toward` crosses
 * node's bounding box — so arrows touch the edge of a box, not its middle.
 */
function pointOnBoundary(node: DiagramNode, toward: DiagramNode) {
  const w = (node.width ?? 120) / 2;
  const h = (node.height ?? 56) / 2;
  const dx = toward.x - node.x;
  const dy = toward.y - node.y;

  if (dx === 0 && dy === 0) return { x: node.x, y: node.y };

  const scaleX = dx !== 0 ? w / Math.abs(dx) : Infinity;
  const scaleY = dy !== 0 ? h / Math.abs(dy) : Infinity;
  const scale = Math.min(scaleX, scaleY);

  return { x: node.x + dx * scale, y: node.y + dy * scale };
}