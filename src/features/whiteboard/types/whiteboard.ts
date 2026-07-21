export type NodeId = string & {
  readonly __brand: unique symbol;
};

export type NodeCategory =
  | "entry"
  | "logic"
  | "storage"
  | "network"
  | "queue";

export interface NodeDetails {
  role: string;
  deepDive: string;
  failureModes: string;
  tradeoffs: string;
}

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


/**
 * Logical architecture model.
 * Contains only system information.
 * No UI positioning.
 */
export interface DiagramNode {
  id: NodeId;
  title: string;
  category: NodeCategory;
  details: NodeDetails;
}

export interface DiagramEdge {
  from: NodeId;
  to: NodeId;
}


export interface SystemDesign {
  slug: string;
  title: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}


/**
 * Layout configuration.
 * Separates positioning from architecture.
 */
export interface NodeLayout {
  nodeId: NodeId;
  gridPos: Point;
}


/**
 * Geometry primitives.
 */
export interface Point {
  x: number;
  y: number;
}

export interface Rect extends Point {
  width: number;
  height: number;
}


/**
 * Render layer objects.
 * Generated from SystemDesign + NodeLayout.
 */
export interface PositionedNode extends Rect {
  id: NodeId;
  data: DiagramNode;
}

export interface PositionedEdge {
  start: Point;
  end: Point;
  fromId: NodeId;
  toId: NodeId;
}


/**
 * Final object consumed by React components.
 */
export interface WhiteboardFrame {
  nodes: PositionedNode[];
  edges: PositionedEdge[];
}