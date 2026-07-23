// src/shared/diagram/layouts/pipeline.ts
//
// Auto-layout for the "pipeline" template: an ordered left-to-right (or
// top-to-bottom) chain of nodes, each connected to the next.
//
// This is the piece that makes "no code" diagram authoring actually work.
// Without it, "store diagram data instead of JSX" just moves the manual
// coordinate-fiddling from .tsx files into JSON files. With it, an author
// (or a future visual editor) only supplies content + order; layout is
// derived.

import type { Diagram, DiagramEdge, DiagramMetadata, UnpositionedNode } from '../types';

export interface PipelineLayoutOptions {
  direction?: 'horizontal' | 'vertical';
  nodeWidth?: number;
  nodeHeight?: number;
  gap?: number;
  padding?: number;
}

const DEFAULTS: Required<PipelineLayoutOptions> = {
  direction: 'horizontal',
  nodeWidth: 120,
  nodeHeight: 56,
  gap: 64,
  padding: 32,
};

/**
 * Lays out an ordered list of nodes in a straight chain and connects each
 * node to the next with an edge (unless explicitEdges is provided, in which
 * case those are used verbatim — useful for pipelines with branches).
 */
export function layoutPipeline(
  orderedNodes: UnpositionedNode[],
  options: PipelineLayoutOptions = {},
  explicitEdges?: DiagramEdge[],
  metadata?: Partial<DiagramMetadata>
): Diagram {
  const { direction, nodeWidth, nodeHeight, gap, padding } = { ...DEFAULTS, ...options };

  const nodes = orderedNodes.map((node, index) => {
    const stride = (direction === 'horizontal' ? nodeWidth : nodeHeight) + gap;
    const center = padding + (direction === 'horizontal' ? nodeWidth : nodeHeight) / 2 + index * stride;

    return {
      ...node,
      width: node.width ?? nodeWidth,
      height: node.height ?? nodeHeight,
      x: direction === 'horizontal' ? center : padding + nodeWidth / 2,
      y: direction === 'horizontal' ? padding + nodeHeight / 2 : center,
    };
  });

  const edges: DiagramEdge[] =
    explicitEdges ??
    orderedNodes.slice(0, -1).map((node, index) => ({
      from: node.id,
      to: orderedNodes[index + 1].id,
      direction: 'forward' as const,
    }));

  const lastNode = nodes[nodes.length - 1];
  const width =
    direction === 'horizontal'
      ? (lastNode?.x ?? 0) + nodeWidth / 2 + padding
      : nodeWidth + padding * 2;
  const height =
    direction === 'horizontal'
      ? nodeHeight + padding * 2
      : (lastNode?.y ?? 0) + nodeHeight / 2 + padding;

  return {
    width,
    height,
    nodes,
    edges,
    metadata: { template: 'pipeline', ...metadata },
  };
}