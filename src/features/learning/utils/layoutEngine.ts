import { 
  SystemDesign, NodeLayout, WhiteboardFrame, 
  PositionedNode, PositionedEdge, Rect 
} from "../types/whiteboard";
import { getConnectionPoint } from "./geometry";

const CANVAS = { COLS: 12, ROWS: 12, W: 1000, H: 800, NODE_W: 160, NODE_H: 80 };

export function calculateWhiteboardFrame(
  design: SystemDesign, 
  layout: NodeLayout[]
): WhiteboardFrame {
  // 1. Position Nodes
  const positionedNodes: PositionedNode[] = design.nodes.map(node => {
    const l = layout.find(lp => lp.nodeId === node.id);
    if (!l) throw new Error(`Missing layout for node: ${node.id}`);

    return {
      id: node.id,
      data: node,
      x: (l.gridPos.x / CANVAS.COLS) * CANVAS.W,
      y: (l.gridPos.y / CANVAS.ROWS) * CANVAS.H,
      width: CANVAS.NODE_W,
      height: CANVAS.NODE_H
    };
  });

  const nodeMap = new Map(positionedNodes.map(n => [n.data.id, n]));

  // 2. Position Edges (Geometry happens here, not in the component)
  const positionedEdges: PositionedEdge[] = design.edges.map(edge => {
    const s = nodeMap.get(edge.from);
    const t = nodeMap.get(edge.to);
    if (!s || !t) throw new Error(`Edge connection error: ${edge.from} -> ${edge.to}`);

    return {
      fromId: edge.from,
      toId: edge.to,
      start: getConnectionPoint(s, t),
      end: getConnectionPoint(t, s)
    };
  });

  return { nodes: positionedNodes, edges: positionedEdges };
}