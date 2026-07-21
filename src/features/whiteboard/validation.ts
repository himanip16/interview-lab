import { NodeLayout, SystemDesign } from "@/features/whiteboard/types/whiteboard";
import { WhiteboardConfig } from "./config";
import { WhiteboardError } from "./errors";


export function validateDesign(
  design: SystemDesign,
  layout: NodeLayout[],
  config: WhiteboardConfig
) {

  const nodeIds = new Set<string>();

  for (const node of design.nodes) {

    if (nodeIds.has(node.id)) {
      throw new WhiteboardError(
        `Duplicate node id: ${node.id}`,
        "DUPLICATE_NODE_ID"
      );
    }

    nodeIds.add(node.id);
  }


  const layoutMap = new Map(
    layout.map(item => [item.nodeId, item])
  );


  for (const node of design.nodes) {

    const position = layoutMap.get(node.id);

    if (!position) {
      throw new WhiteboardError(
        `Missing layout for node ${node.id}`,
        "MISSING_LAYOUT",
        {
          nodeId: node.id
        }
      );
    }


    if (
      position.gridPos.x < 0 ||
      position.gridPos.x > config.gridColumns ||
      position.gridPos.y < 0 ||
      position.gridPos.y > config.gridRows
    ) {

      throw new WhiteboardError(
        `Invalid grid position for ${node.id}`,
        "INVALID_POSITION",
        {
          position: position.gridPos
        }
      );
    }
  }


  for (const edge of design.edges) {

    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {

      throw new WhiteboardError(
        `Invalid edge ${edge.from} -> ${edge.to}`,
        "INVALID_EDGE"
      );
    }
  }
}