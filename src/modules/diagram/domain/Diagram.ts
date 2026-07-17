// src/modules/diagram/domain/Diagram.ts

/**
 * Canonical domain model for architecture diagrams.
 * This model is independent of React and rendering concerns.
 */

export type NodeId = string & { readonly __brand: unique symbol };
export type EdgeId = string & { readonly __brand: unique symbol };
export type FlowId = string & { readonly __brand: unique symbol };

/**
 * Node types supported in the diagram system
 */
export enum NodeType {
  CLIENT = "client",
  SERVICE = "service",
  STORAGE = "storage",
  GATEWAY = "gateway",
  QUEUE = "queue",
  CACHE = "cache",
  LOAD_BALANCER = "load_balancer",
  DATABASE = "database",
}

/**
 * Detailed information about a node component
 */
export interface NodeDetails {
  roleAndDuty: string;
  extremeDeepDive: string;
  failureScenarios: string;
  designTradeoffs: string;
}

/**
 * Represents a single node in the diagram
 */
export interface Node {
  id: NodeId;
  name: string;
  type: NodeType;
  details: NodeDetails;
}

/**
 * Represents a connection between two nodes
 */
export interface Edge {
  id: EdgeId;
  from: NodeId;
  to: NodeId;
  label?: string;
}

/**
 * Represents a step in a data flow
 */
export interface FlowStep {
  nodeId: NodeId;
  description?: string;
}

/**
 * Represents a complete data flow through the system
 */
export interface Flow {
  id: FlowId;
  name: string;
  steps: FlowStep[];
}

/**
 * Viewport/metadata for the diagram
 */
export interface DiagramMetadata {
  title: string;
  description?: string;
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}

/**
 * Complete diagram document - the canonical model
 */
export interface Diagram {
  id: string;
  metadata: DiagramMetadata;
  nodes: Node[];
  edges: Edge[];
  flows: Flow[];
}

/**
 * Validation errors that can occur when constructing a diagram
 */
export class DiagramValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DiagramValidationError";
  }
}

/**
 * Immutable Diagram class with validation
 */
export class DiagramDocument {
  private constructor(private readonly data: Diagram) {}

  static create(data: Diagram): DiagramDocument {
    this.validate(data);
    return new DiagramDocument(data);
  }

  static fromJSON(json: unknown): DiagramDocument {
    const data = json as Diagram;
    this.validate(data);
    return new DiagramDocument(data);
  }

  toJSON(): Diagram {
    return { ...this.data };
  }

  get id(): string {
    return this.data.id;
  }

  get metadata(): DiagramMetadata {
    return { ...this.data.metadata };
  }

  get nodes(): readonly Node[] {
    return this.data.nodes;
  }

  get edges(): readonly Edge[] {
    return this.data.edges;
  }

  get flows(): readonly Flow[] {
    return this.data.flows;
  }

  getNodeById(id: NodeId): Node | undefined {
    return this.data.nodes.find((node) => node.id === id);
  }

  getEdgeById(id: EdgeId): Edge | undefined {
    return this.data.edges.find((edge) => edge.id === id);
  }

  getFlowById(id: FlowId): Flow | undefined {
    return this.data.flows.find((flow) => flow.id === id);
  }

  getEdgesFromNode(nodeId: NodeId): Edge[] {
    return this.data.edges.filter((edge) => edge.from === nodeId);
  }

  getEdgesToNode(nodeId: NodeId): Edge[] {
    return this.data.edges.filter((edge) => edge.to === nodeId);
  }

  private static validate(data: Diagram): void {
    // Validate duplicate node IDs
    const nodeIds = new Set<string>();
    for (const node of data.nodes) {
      if (nodeIds.has(node.id)) {
        throw new DiagramValidationError(`Duplicate node ID: ${node.id}`);
      }
      nodeIds.add(node.id);
    }

    // Validate duplicate edge IDs
    const edgeIds = new Set<string>();
    for (const edge of data.edges) {
      if (edgeIds.has(edge.id)) {
        throw new DiagramValidationError(`Duplicate edge ID: ${edge.id}`);
      }
      edgeIds.add(edge.id);
    }

    // Validate duplicate flow IDs
    const flowIds = new Set<string>();
    for (const flow of data.flows) {
      if (flowIds.has(flow.id)) {
        throw new DiagramValidationError(`Duplicate flow ID: ${flow.id}`);
      }
      flowIds.add(flow.id);
    }

    // Validate edge references
    for (const edge of data.edges) {
      if (!nodeIds.has(edge.from)) {
        throw new DiagramValidationError(
          `Edge ${edge.id} references non-existent source node: ${edge.from}`
        );
      }
      if (!nodeIds.has(edge.to)) {
        throw new DiagramValidationError(
          `Edge ${edge.id} references non-existent target node: ${edge.to}`
        );
      }
    }

    // Validate flow step references
    for (const flow of data.flows) {
      for (const step of flow.steps) {
        if (!nodeIds.has(step.nodeId)) {
          throw new DiagramValidationError(
            `Flow ${flow.id} step references non-existent node: ${step.nodeId}`
          );
        }
      }
    }
  }
}

/**
 * Utility functions for creating typed IDs
 */
export function createNodeId(id: string): NodeId {
  return id as NodeId;
}

export function createEdgeId(id: string): EdgeId {
  return id as EdgeId;
}

export function createFlowId(id: string): FlowId {
  return id as FlowId;
}
