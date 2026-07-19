/**
 * WhiteboardInterpreter converts structured whiteboard JSON into a concise
 * textual description that can be consumed by the AI interview engine.
 * 
 * Instead of passing raw canvas JSON to the LLM, we generate a human-readable
 * description like: "Client → Load Balancer → API → Redis → Database, with cache lookup before the database."
 * 
 * This keeps prompts small, avoids repeated work, and ensures the AI can consistently
 * reference what the candidate has drawn.
 */

export interface WhiteboardNode {
  id: string;
  title: string;
  kind: string;
  role: string;
  deep?: string;
  failure?: string;
  tradeoffs?: string;
  position?: { top?: string; bottom?: string; left?: string; right?: string; transform?: string };
}

export interface WhiteboardEdge {
  from: string;
  to: string;
}

export interface WhiteboardState {
  nodes: WhiteboardNode[];
  edges: WhiteboardEdge[];
}

export class WhiteboardInterpreter {
  /**
   * Convert whiteboard JSON to a concise textual description.
   * 
   * @param whiteboardState - The raw whiteboard JSON from the frontend
   * @returns A concise description of the architecture
   */
  interpret(whiteboardState: WhiteboardState | null): string {
    if (!whiteboardState || !whiteboardState.nodes || whiteboardState.nodes.length === 0) {
      return "";
    }

    const { nodes, edges } = whiteboardState;

    // Build a map of node ID to node for quick lookup
    const nodeMap = new Map<string, WhiteboardNode>();
    nodes.forEach(node => nodeMap.set(node.id, node));

    // Build adjacency list for the graph
    const adjacencyList = new Map<string, string[]>();
    edges.forEach(edge => {
      if (!adjacencyList.has(edge.from)) {
        adjacencyList.set(edge.from, []);
      }
      adjacencyList.get(edge.from)!.push(edge.to);
    });

    // Find entry nodes (nodes with no incoming edges)
    const incomingEdges = new Set<string>();
    edges.forEach(edge => incomingEdges.add(edge.to));
    const entryNodes = nodes.filter(node => !incomingEdges.has(node.id));

    // If no clear entry points, use all nodes
    const startNodes = entryNodes.length > 0 ? entryNodes : nodes;

    // Generate description by traversing from entry points
    const descriptions: string[] = [];
    
    for (const startNode of startNodes) {
      const path = this.buildPath(startNode.id, adjacencyList, nodeMap, new Set());
      if (path) {
        descriptions.push(path);
      }
    }

    // Add details about key components
    const keyComponents = nodes
      .filter(node => node.role && node.role.length > 0)
      .slice(0, 5) // Limit to top 5 to keep description concise
      .map(node => `- ${node.title}: ${node.role}`)
      .join("\n");

    let fullDescription = descriptions.join("\n");
    
    if (keyComponents) {
      fullDescription += "\n\nKey components:\n" + keyComponents;
    }

    return fullDescription;
  }

  /**
   * Build a path description starting from a given node.
   * Uses DFS to follow edges and build a readable flow.
   */
  private buildPath(
    nodeId: string,
    adjacencyList: Map<string, string[]>,
    nodeMap: Map<string, WhiteboardNode>,
    visited: Set<string>
  ): string {
    if (visited.has(nodeId)) {
      return "";
    }
    
    visited.add(nodeId);
    const node = nodeMap.get(nodeId);
    if (!node) return "";

    const neighbors = adjacencyList.get(nodeId) || [];
    
    if (neighbors.length === 0) {
      return node.title;
    }

    const childPaths = neighbors
      .map(neighborId => this.buildPath(neighborId, adjacencyList, nodeMap, visited))
      .filter(path => path.length > 0);

    if (childPaths.length === 0) {
      return node.title;
    }

    // Build flow description
    const flow = childPaths.join(" → ");
    return `${node.title} → ${flow}`;
  }

  /**
   * Generate a simpler, one-line description for quick reference.
   */
  interpretSimple(whiteboardState: WhiteboardState | null): string {
    if (!whiteboardState || !whiteboardState.nodes || whiteboardState.nodes.length === 0) {
      return "";
    }

    const { nodes, edges } = whiteboardState;
    const nodeTitles = nodes.map(n => n.title).join(", ");
    return `Architecture with ${nodes.length} components: ${nodeTitles}`;
  }
}
