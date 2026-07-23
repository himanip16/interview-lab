// src/features/whiteboard/types/whiteboard.ts

import { Point, Rect } from "@/features/whiteboard/geometry";

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
  id: string; // stable identity — required so multiple edges between
              // the same two nodes (e.g. request + response) don't
              // collide on a derived key like `${from}-${to}`.
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
 * Render layer objects.
 * Generated from SystemDesign + NodeLayout.
 * x/y are CENTER of node, in canvas-pixel units (config.canvasWidth/Height),
 * NOT percent. This is the SVG viewBox coordinate space used by
 * Whiteboard.tsx for pan/zoom — everything (nodes, edges, connection
 * points) has to live in one consistent unit for that to work.
 */
export interface PositionedNode extends Rect {
  id: NodeId;
  data: DiagramNode;
}

export interface PositionedEdge {
  id: string;
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