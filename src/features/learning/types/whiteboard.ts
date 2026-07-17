
export type NodeId = string & { readonly __brand: unique symbol };

export interface DiagramConfig {
  readonly CANVAS_W: number;
  readonly CANVAS_H: number;
  readonly GRID_COLS: number;
  readonly GRID_ROWS: number;
  readonly NODE_W: number;
  readonly NODE_H: number;
}

export const DEFAULT_CONFIG: DiagramConfig = {
  CANVAS_W: 1000,
  CANVAS_H: 800,
  GRID_COLS: 12,
  GRID_ROWS: 12,
  NODE_W: 160,
  NODE_H: 80,
};

export interface DiagramNode {
  id: NodeId;
  title: string;
  category: 'entry' | 'logic' | 'storage' | 'network' | 'queue';
  details: { role: string; deepDive: string; failureModes: string; tradeoffs: string; };
}

export interface DiagramEdge { from: NodeId; to: NodeId; }

export interface SystemDesign {
  slug: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

// Fixed-structure Layout (Prevents orphaned IDs)
export interface NodeLayout {
  nodeId: NodeId;
  gridPos: { x: number; y: number };
}

export interface Point { x: number; y: number; }
export interface Rect extends Point { width: number; height: number; }

// The "Calculated Frame" - Renderer only cares about these
export interface PositionedNode extends Rect { data: DiagramNode; }
export interface PositionedEdge { start: Point; end: Point; fromId: NodeId; toId: NodeId; }

export interface WhiteboardFrame {
  nodes: PositionedNode[];
  edges: PositionedEdge[];
}