// src/features/learning/types/learning.ts

export interface WhiteboardNode {
  id: string;
  title: string;
  kind: string;
  color: string;
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  role: string;
  deep: string;
  failure: string;
  tradeoffs: string;
}

export interface WhiteboardSystem {
  slug: string;
  title: string;
  nodes: WhiteboardNode[];
}