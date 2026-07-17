import { SystemDesign, NodeLayout, NodeId } from "../types/whiteboard";

export class DesignValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DesignValidationError";
  }
}

export function validateDesignIntegrity(design: SystemDesign, layout: NodeLayout[]): void {
  const nodeIds = new Set(design.nodes.map(n => n.id));

  // 1. Check for Duplicate Node IDs
  if (nodeIds.size !== design.nodes.length) {
    throw new DesignValidationError("Duplicate Node IDs found in design.");
  }

  // 2. Check for Missing Layouts
  for (const node of design.nodes) {
    if (!layout.find(l => l.nodeId === node.id)) {
      throw new DesignValidationError(`Missing layout coordinates for node: ${node.id}`);
    }
  }

  // 3. Check for Orphaned Layouts (Extra layouts with no nodes)
  if (layout.length > design.nodes.length) {
    console.warn("Whiteboard: Orphaned layout entries detected.");
  }

  // 4. Check for Broken Edges
  for (const edge of design.edges) {
    if (!nodeIds.has(edge.from)) throw new DesignValidationError(`Edge source invalid: ${edge.from}`);
    if (!nodeIds.has(edge.to)) throw new DesignValidationError(`Edge target invalid: ${edge.to}`);
  }
}