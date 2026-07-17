export type NodeCategory = 'entry' | 'logic' | 'storage' | 'queue' | 'network';

export interface DiagramNode {
  id: string;
  title: string;
  category: NodeCategory;
  // Use a 12-column grid-based system for positioning, not pixels
  gridPos: { x: number; y: number }; 
  details: {
    role: string;
    deepDive: string;
    failureModes: string;
    tradeoffs: string;
  };
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface SystemDesign {
  slug: string;
  title: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}