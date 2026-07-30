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
  notes?: string;  // Additional context not in role/deepDive
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
  scenarios?: Scenario[];
}

// ==========================================================================
// SCENARIO & WALKTHROUGH TYPES
// ==========================================================================

/**
 * Single focus state for the whiteboard
 * - idle: No node focused
 * - focused: User manually selected a node
 * - scenario: Node is focused as part of an active walkthrough
 */
export type FocusState =
  | { type: 'idle' }
  | { type: 'focused', nodeId: NodeId }
  | { type: 'scenario', nodeId: NodeId, scenarioId: string, stepId: string };

/**
 * Individual step in a learning scenario
 * Contains only scenario-specific narration, not node data (to avoid duplication)
 */
export interface ScenarioStep {
  id: string;
  nodeId: NodeId;  // Node being explained
  fromNodeId?: NodeId;  // Source node for request/flow
  toNodeId?: NodeId;  // Target node for request/flow
  narration: string;  // What happens in this step (context-specific)
  waitForUser: boolean;  // true = manual advance, false = auto
  nextStepId?: string;  // For branching scenarios
}

/**
 * Learning scenario - a guided walkthrough of the system
 */
export interface Scenario {
  id: string;
  title: string;  // "Driver cancels ride"
  category: 'user' | 'driver' | 'system' | 'failure';
  difficulty?: 'easy' | 'medium' | 'hard';
  duration?: string;  // "3 min"
  actor?: 'user' | 'driver' | 'system';
  
  // Learning path
  prerequisiteNodeIds: NodeId[];  // Required components
  relatedScenarioIds: string[];   // Suggested next scenarios
  
  // Ordered steps (linear for now, branching via nextStepId)
  steps: ScenarioStep[];
  startStepId: string;
}

/**
 * Controller state (separation of concerns)
 */
export interface ScenarioControllerState {
  currentScenario: Scenario | null;
  currentStep: ScenarioStep | null;
  focusState: FocusState;
  progress: { current: number; total: number };
}

// ==========================================================================
// GENERIC WHITEBOARD DATA MODEL
// ==========================================================================

/**
 * Generic whiteboard node for data-driven architecture
 */
export interface WhiteboardNode {
  id: string;
  label: string;
  kind: string;
  color: string;

  purpose: string;
  calledBy: string;
  calls: string;
  contract: string;

  failureMode: string;
  isSpof: boolean;

  improvements: string[];
}

/**
 * Individual step in a flow journey
 */
export interface FlowStep {
  from?: string;
  to?: string;
  text: string;
  note?: boolean;  // for steps that are explanation only
}

/**
 * Phase containing multiple flow steps
 */
export interface FlowPhase {
  title: string;
  steps: FlowStep[];
}

/**
 * Complete journey through the system
 */
export interface Journey {
  name: string;
  phases: FlowPhase[];
}

/**
 * Complete whiteboard system with nodes, edges, and journeys
 */
export interface WhiteboardSystem {
  slug: string;
  nodes: WhiteboardNode[];
  edges: DiagramEdge[];
  journeys: Journey[];
}