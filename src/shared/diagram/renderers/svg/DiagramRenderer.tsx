// src/shared/diagram/renderers/svg/DiagramRenderer.tsx
//
// The generic renderer: <Diagram data={cassandraWritePath} />. It has no
// idea what a "Cassandra" or "Kafka" is — it only knows how to turn a
// Diagram object into SVG. Any illustration becomes "load JSON, pass it
// here" instead of "write a new .tsx component."

import React, { useMemo } from 'react';
import type { Diagram as DiagramData } from '../../types';
import { NodeRenderer } from './NodeRenderer';
import { EdgeRenderer } from './EdgeRenderer';

export interface DiagramProps {
  data: DiagramData;
  className?: string;
  /** Render at a fixed pixel size instead of scaling to the container. */
  maxWidth?: number;
}

let instanceCounter = 0;

export function Diagram({ data, className, maxWidth }: DiagramProps) {
  // Unique marker id per instance so multiple diagrams on one page don't
  // collide over the same <marker> definition.
  const markerId = useMemo(() => `diagram-arrow-${++instanceCounter}`, []);

  const nodesById = useMemo(() => new Map(data.nodes.map((n) => [n.id, n])), [data.nodes]);

  return (
    <svg
      viewBox={`0 0 ${data.width} ${data.height}`}
      width={maxWidth}
      className={className}
      style={{ maxWidth: '100%', height: 'auto' }}
      role="img"
      aria-label={data.metadata.title ?? 'Diagram'}
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX={9}
          refY={5}
          markerWidth={7}
          markerHeight={7}
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="var(--diagram-edge-stroke, #666)" />
        </marker>
      </defs>

      {/* Edges first so nodes render on top of connector lines. */}
      <g>
        {data.edges.map((edge, i) => (
          <EdgeRenderer key={edge.id ?? `${edge.from}-${edge.to}-${i}`} edge={edge} nodesById={nodesById} markerId={markerId} />
        ))}
      </g>

      <g>
        {data.nodes.map((node) => (
          <NodeRenderer key={node.id} node={node} />
        ))}
      </g>

      {data.labels?.map((label) => (
        <text
          key={label.id}
          x={label.x}
          y={label.y}
          fontSize={label.variant === 'heading' ? 15 : 11}
          fontWeight={label.variant === 'heading' ? 600 : 400}
          fill="var(--diagram-label, #999)"
        >
          {label.text}
        </text>
      ))}
    </svg>
  );
}