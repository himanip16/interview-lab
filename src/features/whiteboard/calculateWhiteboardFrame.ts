// src/features/whiteboard/calculateWhiteboardFrame.ts

import {
  SystemDesign,
  NodeLayout,
  WhiteboardFrame,
  PositionedNode,
  PositionedEdge,
} from "./types/whiteboard";

import { getConnectionPoint } from "@/features/whiteboard/geometry";

import {
  DEFAULT_WHITEBOARD_CONFIG,
  WhiteboardConfig,
} from "@/features/whiteboard/config";

import { validateDesign } from "@/features/whiteboard/validation";
import { validateCollisions } from "@/features/whiteboard/collision";

export function calculateWhiteboardFrame(
  design: SystemDesign,
  layout: NodeLayout[],
  config: WhiteboardConfig = DEFAULT_WHITEBOARD_CONFIG
): WhiteboardFrame {
  console.log('[calculateWhiteboardFrame] Function called');
  console.log('[calculateWhiteboardFrame] design:', design);
  console.log('[calculateWhiteboardFrame] layout:', layout);
  console.log('[calculateWhiteboardFrame] config:', config);
  
  const layoutMap = new Map(layout.map(item => [item.nodeId, item]));
  console.log('[calculateWhiteboardFrame] layoutMap created with keys:', Array.from(layoutMap.keys()));

  const positionedNodes: PositionedNode[] = design.nodes.map(node => {
    const position = layoutMap.get(node.id);
    
    if (!position) {
      throw new Error(`[WhiteboardEngine] Missing layout coordinates for node: ${node.id}`);
    }

    const positionedNode = {
      id: node.id,
      data: node,

      // CENTER of node, in canvas-pixel space — this IS the SVG viewBox
      // coordinate system now. No percent conversion, no CSS involved.
      x: (position.gridPos.x / config.gridColumns) * config.canvasWidth,
      y: (position.gridPos.y / config.gridRows) * config.canvasHeight,

      width: config.defaultNodeWidth,
      height: config.defaultNodeHeight,
    };
    console.log('[calculateWhiteboardFrame] Positioned node:', positionedNode);
    return positionedNode;
  });
  
  console.log('[calculateWhiteboardFrame] Total positionedNodes:', positionedNodes.length);

  if (config.enableCollisionDetection) {
    validateCollisions(positionedNodes);
  }

  const nodeMap = new Map(positionedNodes.map(node => [node.id, node]));
  console.log('[calculateWhiteboardFrame] nodeMap created with keys:', Array.from(nodeMap.keys()));

  const positionedEdges: PositionedEdge[] = [];

  for (const edge of design.edges) {
    const source = nodeMap.get(edge.from);
    const target = nodeMap.get(edge.to);

    if (!source || !target) {
      console.warn(`[WhiteboardEngine] Skipping dangling edge ${edge.id}: source or target node not found.`);
      continue;
    }

    const positionedEdge = {
      id: edge.id,
      fromId: edge.from,
      toId: edge.to,
      start: getConnectionPoint(source, target),
      end: getConnectionPoint(target, source),
    };
    positionedEdges.push(positionedEdge);
    console.log('[calculateWhiteboardFrame] Positioned edge:', positionedEdge);
  }
  
  console.log('[calculateWhiteboardFrame] Total positionedEdges:', positionedEdges.length);

  const result = {
    nodes: positionedNodes,
    edges: positionedEdges,
  };
  console.log('[calculateWhiteboardFrame] Final result:', result);
  return result;
}