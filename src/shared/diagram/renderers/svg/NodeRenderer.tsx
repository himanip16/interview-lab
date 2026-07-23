// src/shared/diagram/renderers/svg/NodeRenderer.tsx
//
// Renders a single DiagramNode as an SVG shape. Knows nothing about
// Cassandra, Kafka, or any specific illustration — only how to draw a
// box/circle/cylinder/diamond with a title and optional subtitle.

import React from 'react';
import type { DiagramNode } from '../../types';

const VARIANT_COLORS: Record<NonNullable<DiagramNode['variant']>, { fill: string; stroke: string; text: string }> = {
  default: { fill: 'var(--diagram-node-fill, #1c1c1e)', stroke: 'var(--diagram-node-stroke, #3a3a3d)', text: 'var(--diagram-node-text, #f5f5f5)' },
  primary: { fill: 'var(--diagram-node-primary-fill, #2b3a55)', stroke: 'var(--diagram-node-primary-stroke, #5c7cb0)', text: 'var(--diagram-node-text, #f5f5f5)' },
  muted: { fill: 'var(--diagram-node-muted-fill, #232323)', stroke: 'var(--diagram-node-muted-stroke, #333)', text: 'var(--diagram-node-muted-text, #999)' },
  danger: { fill: 'var(--diagram-node-danger-fill, #4a2222)', stroke: 'var(--diagram-node-danger-stroke, #9a4a4a)', text: 'var(--diagram-node-text, #f5f5f5)' },
};

export interface NodeRendererProps {
  node: DiagramNode;
}

export function NodeRenderer({ node }: NodeRendererProps) {
  const width = node.width ?? 120;
  const height = node.height ?? 56;
  const colors = VARIANT_COLORS[node.variant ?? 'default'];

  return (
    <g transform={`translate(${node.x - width / 2}, ${node.y - height / 2})`}>
      {renderShape(node.type, width, height, colors)}
      <foreignObject x={0} y={0} width={width} height={height}>
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '4px 8px',
            color: colors.text,
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.25,
            fontFamily: 'inherit',
          }}
        >
          <span>{node.title}</span>
          {node.subtitle && (
            <span style={{ fontSize: 11, fontWeight: 400, opacity: 0.75, marginTop: 2 }}>{node.subtitle}</span>
          )}
        </div>
      </foreignObject>
    </g>
  );
}

function renderShape(
  type: DiagramNode['type'],
  width: number,
  height: number,
  colors: { fill: string; stroke: string }
) {
  const common = { fill: colors.fill, stroke: colors.stroke, strokeWidth: 1.5 };

  switch (type) {
    case 'circle': {
      const r = Math.min(width, height) / 2;
      return <circle cx={width / 2} cy={height / 2} r={r} {...common} />;
    }
    case 'diamond': {
      const points = `${width / 2},0 ${width},${height / 2} ${width / 2},${height} 0,${height / 2}`;
      return <polygon points={points} {...common} />;
    }
    case 'cylinder': {
      const capHeight = Math.min(16, height / 4);
      return (
        <g>
          <path
            d={`M0,${capHeight} L0,${height - capHeight} A${width / 2},${capHeight} 0 0 0 ${width},${height - capHeight} L${width},${capHeight}`}
            {...common}
          />
          <ellipse cx={width / 2} cy={capHeight} rx={width / 2} ry={capHeight} {...common} />
        </g>
      );
    }
    case 'box':
    default:
      return <rect x={0} y={0} width={width} height={height} rx={8} {...common} />;
  }
}