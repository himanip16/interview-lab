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
  const layoutMap = new Map(layout.map(item => [item.nodeId, item]));

  const positionedNodes: PositionedNode[] = design.nodes.map(node => {
    const position = layoutMap.get(node.id);
    
    if (!position) {
      throw new Error(`[WhiteboardEngine] Missing layout coordinates for node: ${node.id}`);
    }

    return {
      id: node.id,
      data: node,

      // CENTER of node, in canvas-pixel space — this IS the SVG viewBox
      // coordinate system now. No percent conversion, no CSS involved.
      x: (position.gridPos.x / config.gridColumns) * config.canvasWidth,
      y: (position.gridPos.y / config.gridRows) * config.canvasHeight,

      width: config.defaultNodeWidth,
      height: config.defaultNodeHeight,
    };
  });

  if (config.enableCollisionDetection) {
    validateCollisions(positionedNodes);
  }

  const nodeMap = new Map(positionedNodes.map(node => [node.id, node]));

  const positionedEdges: PositionedEdge[] = [];

  for (const edge of design.edges) {
    const source = nodeMap.get(edge.from);
    const target = nodeMap.get(edge.to);

    if (!source || !target) {
      console.warn(`[WhiteboardEngine] Skipping dangling edge ${edge.id}: source or target node not found.`);
      continue;
    }

    positionedEdges.push({
      id: edge.id,
      fromId: edge.from,
      toId: edge.to,
      start: getConnectionPoint(source, target),
      end: getConnectionPoint(target, source),
    });
  }

  return {
    nodes: positionedNodes,
    edges: positionedEdges,
  };
}