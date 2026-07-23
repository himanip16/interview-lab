// src/shared/diagram/types.ts
//
// The data model for a diagram. This is the "storage format" — anything
// that renders a diagram (SVG today, Canvas/PDF/Excalidraw later) consumes
// this shape and nothing else. Nothing in here is renderer-specific.

export type NodeShape = 'box' | 'circle' | 'cylinder' | 'diamond';

export type NodeVariant = 'default' | 'primary' | 'muted' | 'danger';

export interface DiagramNode {
  id: string;
  type: NodeShape;
  /** Center x/y in diagram units. Populated by a layout function, not authored by hand. */
  x: number;
  y: number;
  width?: number;
  height?: number;
  title: string;
  subtitle?: string;
  variant?: NodeVariant;
}

export type EdgeStyle = 'solid' | 'dashed';
export type EdgeDirection = 'forward' | 'bidirectional' | 'none';

export interface DiagramEdge {
  id?: string;
  from: string;
  to: string;
  label?: string;
  style?: EdgeStyle;
  direction?: EdgeDirection;
}

export interface DiagramLabel {
  id: string;
  x: number;
  y: number;
  text: string;
  variant?: 'caption' | 'heading';
}

// The set of layout strategies we support. Each template maps a list of
// nodes/edges (with NO x/y yet) onto a concrete layout. This is what makes
// "no code" diagram creation possible: the author picks a template, the
// template computes coordinates, nobody hand-places boxes.
export type DiagramTemplate =
  | 'pipeline'
  | 'ring'
  | 'cluster'
  | 'timeline'
  | 'tree'
  | 'cache'
  | 'queue'
  | 'freeform'; // freeform = coordinates were authored/dragged by hand (editor output)

export interface DiagramMetadata {
  template: DiagramTemplate;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Diagram {
  width: number;
  height: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  labels?: DiagramLabel[];
  metadata: DiagramMetadata;
}

// Input shape for a layout function: nodes without positions yet.
export type UnpositionedNode = Omit<DiagramNode, 'x' | 'y'>;