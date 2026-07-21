import { WHITEBOARD_SYSTEMS, WhiteboardSystem as LegacySystem, WhiteboardNode as LegacyNode } from './whiteboardSystems';
import { SystemDesign, NodeLayout, NodeId } from "@/features/whiteboard/types/whiteboard";

/**
 * Adapter to convert legacy whiteboard data to the new SystemDesign format
 * This bridges the gap between the old whiteboardSystems.ts structure and the new grid-based system
 */

// Helper to create typed NodeId
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

  // Create edges based on typical system architecture patterns
  // This is a simplified approach - in production, edges should be explicitly defined
  const edges: { from: NodeId; to: NodeId }[] = [];
  
  if (nodes.length > 1) {
    // Create a simple flow: client -> gateway -> service -> storage
    const clientNode = nodes.find(n => n.category === 'entry');
    const gatewayNode = nodes.find(n => n.title.toLowerCase().includes('gateway'));
    const serviceNodes = nodes.filter(n => n.category === 'logic');
    const storageNodes = nodes.filter(n => n.category === 'storage');

    if (clientNode && gatewayNode) {
      edges.push({ from: clientNode.id, to: gatewayNode.id });
    }

    if (gatewayNode && serviceNodes.length > 0) {
      serviceNodes.forEach(s => {
        edges.push({ from: gatewayNode.id, to: s.id });
      });
    } else if (clientNode && serviceNodes.length > 0) {
      serviceNodes.forEach(s => {
        edges.push({ from: clientNode.id, to: s.id });
      });
    }

    serviceNodes.forEach(s => {
      storageNodes.forEach(st => {
        edges.push({ from: s.id, to: st.id });
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

export function convertLegacyToLayout(legacy: LegacySystem): NodeLayout[] {
  return legacy.nodes.map(node => {
    const pos = node.position;
    let gridPos = { x: 0, y: 0 };

    // Convert CSS position to grid coordinates (12x12 grid)
    if (pos.left && pos.top) {
      // Parse pixel values and convert to grid
      const left = parseInt(pos.left) || 0;
      const top = parseInt(pos.top) || 0;
      gridPos = {
        x: Math.round((left / 1000) * 12), // Assuming 1000px canvas width
        y: Math.round((top / 800) * 12)    // Assuming 800px canvas height
      };
    } else if (pos.left === '50%' && pos.top) {
      // Centered horizontally
      const top = parseInt(pos.top) || 0;
      gridPos = {
        x: 6,
        y: Math.round((top / 800) * 12)
      };
    } else if (pos.bottom && pos.left === '50%') {
      // Bottom center
      gridPos = {
        x: 6,
        y: 10
      };
    } else if (pos.right && pos.top) {
      // Right side
      const top = parseInt(pos.top) || 0;
      gridPos = {
        x: 10,
        y: Math.round((top / 800) * 12)
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
  return 'logic'; // Default fallback
}

// Pre-computed designs for all legacy systems
export const SYSTEM_DESIGNS: Record<string, SystemDesign> = {};
export const SYSTEM_LAYOUTS: Record<string, NodeLayout[]> = {};

Object.entries(WHITEBOARD_SYSTEMS).forEach(([slug, legacy]) => {
  SYSTEM_DESIGNS[slug] = convertLegacyToSystemDesign(legacy);
  SYSTEM_LAYOUTS[slug] = convertLegacyToLayout(legacy);
});
