// src/shared/diagram/domain/__tests__/Diagram.test.ts

// src/modules/diagram/domain/__tests__/Diagram.test.ts

import { describe, it, expect } from "vitest";
import {
  DiagramDocument,
  Diagram,
  NodeType,
  createNodeId,
  createEdgeId,
  createFlowId,
  DiagramValidationError,
} from "../Diagram";

describe("DiagramDocument", () => {
  const validDiagram: Diagram = {
    id: "test-diagram",
    metadata: {
      title: "Test Diagram",
      description: "A test diagram for unit testing",
    },
    nodes: [
      {
        id: createNodeId("node-1"),
        name: "Client",
        type: NodeType.CLIENT,
        details: {
          roleAndDuty: "Client application",
          extremeDeepDive: "Deep dive details",
          failureScenarios: "Failure scenarios",
          designTradeoffs: "Tradeoffs",
        },
      },
      {
        id: createNodeId("node-2"),
        name: "Service",
        type: NodeType.SERVICE,
        details: {
          roleAndDuty: "Backend service",
          extremeDeepDive: "Deep dive details",
          failureScenarios: "Failure scenarios",
          designTradeoffs: "Tradeoffs",
        },
      },
    ],
    edges: [
      {
        id: createEdgeId("edge-1"),
        from: createNodeId("node-1"),
        to: createNodeId("node-2"),
        label: "HTTP",
      },
    ],
    flows: [
      {
        id: createFlowId("flow-1"),
        name: "Request Flow",
        steps: [
          {
            nodeId: createNodeId("node-1"),
            description: "Client makes request",
          },
          {
            nodeId: createNodeId("node-2"),
            description: "Service processes request",
          },
        ],
      },
    ],
  };

  describe("create", () => {
    it("should create a valid diagram document", () => {
      const doc = DiagramDocument.create(validDiagram);
      expect(doc.id).toBe("test-diagram");
      expect(doc.nodes.length).toBe(2);
      expect(doc.edges.length).toBe(1);
      expect(doc.flows.length).toBe(1);
    });

    it("should throw on duplicate node IDs", () => {
      const invalidDiagram: Diagram = {
        ...validDiagram,
        nodes: [
          validDiagram.nodes[0],
          { ...validDiagram.nodes[0] }, // Duplicate ID
        ],
      };
      expect(() => DiagramDocument.create(invalidDiagram)).toThrow(
        DiagramValidationError
      );
      expect(() => DiagramDocument.create(invalidDiagram)).toThrow(
        "Duplicate node ID"
      );
    });

    it("should throw on duplicate edge IDs", () => {
      const invalidDiagram: Diagram = {
        ...validDiagram,
        edges: [
          validDiagram.edges[0],
          { ...validDiagram.edges[0] }, // Duplicate ID
        ],
      };
      expect(() => DiagramDocument.create(invalidDiagram)).toThrow(
        DiagramValidationError
      );
      expect(() => DiagramDocument.create(invalidDiagram)).toThrow(
        "Duplicate edge ID"
      );
    });

    it("should throw on duplicate flow IDs", () => {
      const invalidDiagram: Diagram = {
        ...validDiagram,
        flows: [
          validDiagram.flows[0],
          { ...validDiagram.flows[0] }, // Duplicate ID
        ],
      };
      expect(() => DiagramDocument.create(invalidDiagram)).toThrow(
        DiagramValidationError
      );
      expect(() => DiagramDocument.create(invalidDiagram)).toThrow(
        "Duplicate flow ID"
      );
    });

    it("should throw on edge with non-existent source node", () => {
      const invalidDiagram: Diagram = {
        ...validDiagram,
        edges: [
          {
            id: createEdgeId("edge-1"),
            from: createNodeId("non-existent"),
            to: createNodeId("node-2"),
          },
        ],
      };
      expect(() => DiagramDocument.create(invalidDiagram)).toThrow(
        DiagramValidationError
      );
      expect(() => DiagramDocument.create(invalidDiagram)).toThrow(
        "non-existent source node"
      );
    });

    it("should throw on edge with non-existent target node", () => {
      const invalidDiagram: Diagram = {
        ...validDiagram,
        edges: [
          {
            id: createEdgeId("edge-1"),
            from: createNodeId("node-1"),
            to: createNodeId("non-existent"),
          },
        ],
      };
      expect(() => DiagramDocument.create(invalidDiagram)).toThrow(
        DiagramValidationError
      );
      expect(() => DiagramDocument.create(invalidDiagram)).toThrow(
        "non-existent target node"
      );
    });

    it("should throw on flow step with non-existent node", () => {
      const invalidDiagram: Diagram = {
        ...validDiagram,
        flows: [
          {
            id: createFlowId("flow-1"),
            name: "Invalid Flow",
            steps: [
              {
                nodeId: createNodeId("non-existent"),
              },
            ],
          },
        ],
      };
      expect(() => DiagramDocument.create(invalidDiagram)).toThrow(
        DiagramValidationError
      );
      expect(() => DiagramDocument.create(invalidDiagram)).toThrow(
        "non-existent node"
      );
    });
  });

  describe("fromJSON", () => {
    it("should create diagram from JSON", () => {
      const json = JSON.stringify(validDiagram);
      const parsed = JSON.parse(json);
      const doc = DiagramDocument.fromJSON(parsed);
      expect(doc.id).toBe("test-diagram");
      expect(doc.nodes.length).toBe(2);
    });

    it("should validate JSON during deserialization", () => {
      const invalidJson = {
        ...validDiagram,
        nodes: [
          validDiagram.nodes[0],
          { ...validDiagram.nodes[0] }, // Duplicate
        ],
      };
      expect(() => DiagramDocument.fromJSON(invalidJson)).toThrow(
        DiagramValidationError
      );
    });
  });

  describe("toJSON", () => {
    it("should serialize to JSON", () => {
      const doc = DiagramDocument.create(validDiagram);
      const json = doc.toJSON();
      expect(json.id).toBe("test-diagram");
      expect(json.nodes).toHaveLength(2);
      expect(json.edges).toHaveLength(1);
      expect(json.flows).toHaveLength(1);
    });

    it("should return a copy, not the original data", () => {
      const doc = DiagramDocument.create(validDiagram);
      const json = doc.toJSON();
      json.id = "modified";
      expect(doc.id).toBe("test-diagram"); // Original unchanged
    });
  });

  describe("query methods", () => {
    it("should find node by ID", () => {
      const doc = DiagramDocument.create(validDiagram);
      const node = doc.getNodeById(createNodeId("node-1"));
      expect(node).toBeDefined();
      expect(node?.name).toBe("Client");
    });

    it("should return undefined for non-existent node", () => {
      const doc = DiagramDocument.create(validDiagram);
      const node = doc.getNodeById(createNodeId("non-existent"));
      expect(node).toBeUndefined();
    });

    it("should find edge by ID", () => {
      const doc = DiagramDocument.create(validDiagram);
      const edge = doc.getEdgeById(createEdgeId("edge-1"));
      expect(edge).toBeDefined();
      expect(edge?.label).toBe("HTTP");
    });

    it("should find flow by ID", () => {
      const doc = DiagramDocument.create(validDiagram);
      const flow = doc.getFlowById(createFlowId("flow-1"));
      expect(flow).toBeDefined();
      expect(flow?.name).toBe("Request Flow");
    });

    it("should get edges from node", () => {
      const doc = DiagramDocument.create(validDiagram);
      const edges = doc.getEdgesFromNode(createNodeId("node-1"));
      expect(edges).toHaveLength(1);
      expect(edges[0].from).toBe(createNodeId("node-1"));
    });

    it("should get edges to node", () => {
      const doc = DiagramDocument.create(validDiagram);
      const edges = doc.getEdgesToNode(createNodeId("node-2"));
      expect(edges).toHaveLength(1);
      expect(edges[0].to).toBe(createNodeId("node-2"));
    });

    it("should return immutable node array", () => {
      const doc = DiagramDocument.create(validDiagram);
      const nodes = doc.nodes;
      expect(() => {
        (nodes as any).push({} as any);
      }).not.toThrow();
      expect(doc.nodes.length).toBe(2); // Original unchanged
    });
  });

  describe("metadata", () => {
    it("should return metadata", () => {
      const doc = DiagramDocument.create(validDiagram);
      const metadata = doc.metadata;
      expect(metadata.title).toBe("Test Diagram");
      expect(metadata.description).toBe("A test diagram for unit testing");
    });

    it("should return a copy of metadata", () => {
      const doc = DiagramDocument.create(validDiagram);
      const metadata = doc.metadata;
      metadata.title = "Modified";
      expect(doc.metadata.title).toBe("Test Diagram"); // Original unchanged
    });
  });

  describe("edge cases", () => {
    it("should handle empty diagram", () => {
      const emptyDiagram: Diagram = {
        id: "empty",
        metadata: { title: "Empty" },
        nodes: [],
        edges: [],
        flows: [],
      };
      const doc = DiagramDocument.create(emptyDiagram);
      expect(doc.nodes).toHaveLength(0);
      expect(doc.edges).toHaveLength(0);
      expect(doc.flows).toHaveLength(0);
    });

    it("should handle diagram with optional viewport", () => {
      const diagramWithViewport: Diagram = {
        ...validDiagram,
        metadata: {
          ...validDiagram.metadata,
          viewport: { x: 100, y: 200, zoom: 1.5 },
        },
      };
      const doc = DiagramDocument.create(diagramWithViewport);
      expect(doc.metadata.viewport).toEqual({ x: 100, y: 200, zoom: 1.5 });
    });

    it("should handle edge without label", () => {
      const diagramWithoutLabel: Diagram = {
        ...validDiagram,
        edges: [
          {
            id: createEdgeId("edge-1"),
            from: createNodeId("node-1"),
            to: createNodeId("node-2"),
          },
        ],
      };
      const doc = DiagramDocument.create(diagramWithoutLabel);
      expect(doc.edges[0].label).toBeUndefined();
    });

    it("should handle flow step without description", () => {
      const diagramWithoutDesc: Diagram = {
        ...validDiagram,
        flows: [
          {
            id: createFlowId("flow-1"),
            name: "Flow",
            steps: [
              {
                nodeId: createNodeId("node-1"),
              },
            ],
          },
        ],
      };
      const doc = DiagramDocument.create(diagramWithoutDesc);
      expect(doc.flows[0].steps[0].description).toBeUndefined();
    });
  });
});
