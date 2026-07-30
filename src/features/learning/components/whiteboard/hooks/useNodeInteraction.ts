// src/features/learning/components/whiteboard/hooks/useNodeInteraction.ts

import { useState, useCallback } from "react";
import { NodeId } from "@/features/whiteboard/types/whiteboard";

interface UseNodeInteractionReturn {
  hoveredNodeId: string | null;
  annotPosition: { x: number; y: number } | null;
  hoveredEdgeId: string | undefined;
  handleNodeHover: (nodeId: string | null, position?: { x: number; y: number }) => void;
  handleEdgeHover: (edgeId: string | null) => void;
  clearHover: () => void;
}

export function useNodeInteraction(mode: 'explore' | 'flows'): UseNodeInteractionReturn {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [annotPosition, setAnnotPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | undefined>();

  const handleNodeHover = useCallback((nodeId: string | null, position?: { x: number; y: number }) => {
    if (mode !== 'explore') return;
    setHoveredNodeId(nodeId);
    if (nodeId && position) {
      setAnnotPosition(position);
    } else {
      setAnnotPosition(null);
    }
  }, [mode]);

  const handleEdgeHover = useCallback((edgeId: string | null) => {
    setHoveredEdgeId(edgeId || undefined);
  }, []);

  const clearHover = useCallback(() => {
    setHoveredNodeId(null);
    setAnnotPosition(null);
    setHoveredEdgeId(undefined);
  }, []);

  return {
    hoveredNodeId,
    annotPosition,
    hoveredEdgeId,
    handleNodeHover,
    handleEdgeHover,
    clearHover,
  };
}
