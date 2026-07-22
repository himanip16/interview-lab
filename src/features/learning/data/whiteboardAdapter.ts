import { WHITEBOARD_SYSTEMS, WhiteboardSystem as LegacySystem } from './whiteboardSystems';
import { SystemDesign, NodeLayout, NodeId } from "@/features/whiteboard/types/whiteboard";
import { DEFAULT_WHITEBOARD_CONFIG, WhiteboardConfig } from "@/features/whiteboard/config";

/**
 * Adapter to convert legacy whiteboard data to the new SystemDesign format
 * This bridges the gap between the old whiteboardSystems.ts structure and the new grid-based system
 */

function createNodeId(id: string): NodeId {
  return id as NodeId;
}

export function convertLegacyToSystemDesign(legacy: LegacySystem): SystemDesign {
  const nodes = legacy.nodes.map(node => ({
    id: createNodeId(node.id),
    title: node.title,
    category: inferCategory(node.kind),
    details: {
      role: node.role,
      deepDive: node.deep,
      failureModes: node.failure,
      tradeoffs: node.tradeoffs
    }
  }));

  const edges: { id: string; from: NodeId; to: NodeId }[] = [];
  let edgeCounter = 0;
  const nextEdgeId = () => `${legacy.slug}-edge-${edgeCounter++}`;

  if (nodes.length > 1) {
    const clientNode = nodes.find(n => n.category === 'entry');
    const gatewayNode = nodes.find(n => n.title.toLowerCase().includes('gateway'));
    const serviceNodes = nodes.filter(n => n.category === 'logic');
    const storageNodes = nodes.filter(n => n.category === 'storage');

    if (clientNode && gatewayNode) {
      edges.push({ id: nextEdgeId(), from: clientNode.id, to: gatewayNode.id });
    }

    if (gatewayNode && serviceNodes.length > 0) {
      serviceNodes.forEach(s => {
        edges.push({ id: nextEdgeId(), from: gatewayNode.id, to: s.id });
      });
    } else if (clientNode && serviceNodes.length > 0) {
      serviceNodes.forEach(s => {
        edges.push({ id: nextEdgeId(), from: clientNode.id, to: s.id });
      });
    }

    serviceNodes.forEach(s => {
      storageNodes.forEach(st => {
        edges.push({ id: nextEdgeId(), from: s.id, to: st.id });
      });
    });
  }

  return {
    slug: legacy.slug,
    title: legacy.title,
    nodes,
    edges
  };
}

export function convertLegacyToLayout(
  legacy: LegacySystem,
  config: WhiteboardConfig = DEFAULT_WHITEBOARD_CONFIG
): NodeLayout[] {
  return legacy.nodes.map(node => {
    const pos = node.position;
    let gridPos = { x: 0, y: 0 };

    // Uses config.canvasWidth/canvasHeight instead of hardcoded 1000/800 —
    // was silently drifting from DEFAULT_WHITEBOARD_CONFIG if that ever changes.
    if (pos.left && pos.top && pos.left !== '50%') {
      const left = parseInt(pos.left) || 0;
      const top = parseInt(pos.top) || 0;
      gridPos = {
        x: Math.round((left / config.canvasWidth) * config.gridColumns),
        y: Math.round((top / config.canvasHeight) * config.gridRows)
      };
    } else if (pos.left === '50%' && pos.top) {
      const top = parseInt(pos.top) || 0;
      gridPos = {
        x: config.gridColumns / 2,
        y: Math.round((top / config.canvasHeight) * config.gridRows)
      };
    } else if (pos.bottom && pos.left === '50%') {
      gridPos = {
        x: config.gridColumns / 2,
        y: config.gridRows - Math.round((parseInt(pos.bottom) || 0) / config.canvasHeight * config.gridRows)
      };
    } else if (pos.right && pos.top) {
      const top = parseInt(pos.top) || 0;
      gridPos = {
        x: config.gridColumns - Math.round((parseInt(pos.right) || 0) / config.canvasWidth * config.gridColumns),
        y: Math.round((top / config.canvasHeight) * config.gridRows)
      };
    }

    return {
      nodeId: createNodeId(node.id),
      gridPos
    };
  });
}

function inferCategory(kind: string): 'entry' | 'logic' | 'storage' | 'network' | 'queue' {
  const k = kind.toLowerCase();
  if (k.includes('client') || k.includes('entry')) return 'entry';
  if (k.includes('gateway') || k.includes('network')) return 'network';
  if (k.includes('service') || k.includes('logic')) return 'logic';
  if (k.includes('storage') || k.includes('database') || k.includes('store')) return 'storage';
  if (k.includes('queue') || k.includes('kafka') || k.includes('message')) return 'queue';
  return 'logic';
}

export const SYSTEM_DESIGNS: Record<string, SystemDesign> = {};
export const SYSTEM_LAYOUTS: Record<string, NodeLayout[]> = {};

Object.entries(WHITEBOARD_SYSTEMS).forEach(([slug, legacy]) => {
  SYSTEM_DESIGNS[slug] = convertLegacyToSystemDesign(legacy);
  SYSTEM_LAYOUTS[slug] = convertLegacyToLayout(legacy);
});