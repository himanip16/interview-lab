// src/features/learning/components/whiteboard/hooks/useCanvasViewport.ts

import { useRef, useState, useCallback, useEffect } from "react";
import { DEFAULT_WHITEBOARD_CONFIG } from "@/features/whiteboard/config";

const CANVAS_W = DEFAULT_WHITEBOARD_CONFIG.canvasWidth;
const CANVAS_H = DEFAULT_WHITEBOARD_CONFIG.canvasHeight;
const MIN_VIEW_W = CANVAS_W / 5;
const MAX_VIEW_W = CANVAS_W * 3;
const PADDING = 200; // Prevent dragging into infinite empty space

interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DiagramBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface UseCanvasViewportReturn {
  viewBox: ViewBox;
  svgRef: React.RefObject<SVGSVGElement | null>;
  handlers: {
    onWheel: (e: React.WheelEvent<SVGSVGElement>) => void;
    onPointerDown: (e: React.PointerEvent<SVGSVGElement>) => void;
    onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => void;
    onPointerUp: (e: React.PointerEvent<SVGSVGElement>) => void;
    onPointerLeave: (e: React.PointerEvent<SVGSVGElement>) => void;
  };
  resetView: () => void;
  fitToScreen: (nodes: Array<{ x: number; y: number; width: number; height: number }>) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setDiagramBounds: (bounds: DiagramBounds | null) => void;
}

export function useCanvasViewport(): UseCanvasViewportReturn {
  const [viewBox, setViewBox] = useState<ViewBox>({
    x: 0,
    y: 0,
    width: CANVAS_W,
    height: CANVAS_H,
  });

  // Diagram bounds for intelligent clamping
  const [diagramBounds, setDiagramBoundsState] = useState<DiagramBounds | null>(null);

  // Ref-based state for high-frequency updates
  const viewBoxRef = useRef<ViewBox>(viewBox);
  const svgRef = useRef<SVGSVGElement>(null);
  const isPanning = useRef(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const rafPending = useRef(false);

  // Sync ref to state
  useEffect(() => {
    viewBoxRef.current = viewBox;
  }, [viewBox]);

  const screenToViewBox = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
    const ratioX = (clientX - rect.left) / rect.width;
    const ratioY = (clientY - rect.top) / rect.height;
    return {
      x: viewBoxRef.current.x + ratioX * viewBoxRef.current.width,
      y: viewBoxRef.current.y + ratioY * viewBoxRef.current.height,
    };
  }, []);

  // Schedule React state update via rAF
  const scheduleUpdate = useCallback(() => {
    if (rafPending.current) return;
    rafPending.current = true;
    requestAnimationFrame(() => {
      setViewBox(viewBoxRef.current);
      rafPending.current = false;
    });
  }, []);

  const clampViewBox = useCallback((x: number, y: number, width: number, height: number): ViewBox => {
    // Use diagram bounds if available, otherwise fall back to canvas bounds
    if (diagramBounds) {
      const minX = diagramBounds.minX - PADDING;
      const maxX = diagramBounds.maxX + PADDING - width;
      const minY = diagramBounds.minY - PADDING;
      const maxY = diagramBounds.maxY + PADDING - height;

      return {
        x: Math.max(minX, Math.min(maxX, x)),
        y: Math.max(minY, Math.min(maxY, y)),
        width,
        height,
      };
    }

    // Fallback to canvas bounds (prevents dragging into infinite empty space)
    const minX = -PADDING;
    const maxX = CANVAS_W + PADDING - width;
    const minY = -PADDING;
    const maxY = CANVAS_H + PADDING - height;

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
      width,
      height,
    };
  }, [diagramBounds]);

  const handleWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const zoomPoint = screenToViewBox(e.clientX, e.clientY);
    const zoomFactor = e.deltaY > 0 ? 1.1 : 1 / 1.1;

    const current = viewBoxRef.current;
    const newWidth = Math.min(MAX_VIEW_W, Math.max(MIN_VIEW_W, current.width * zoomFactor));
    const scale = newWidth / current.width;
    const newHeight = current.height * scale;
    const newX = zoomPoint.x - (zoomPoint.x - current.x) * scale;
    const newY = zoomPoint.y - (zoomPoint.y - current.y) * scale;
    
    viewBoxRef.current = clampViewBox(newX, newY, newWidth, newHeight);
    scheduleUpdate();
  }, [screenToViewBox, clampViewBox, scheduleUpdate]);

  const handlePointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    // Decouple from DOM inspection - only pan if on background
    const target = e.target as SVGElement;
    const isBackground = target === e.currentTarget || 
      (target as unknown as HTMLElement)?.dataset?.canvasBackground === "true";
    
    if (!isBackground) return;
    
    e.preventDefault();
    isPanning.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    svgRef.current?.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!isPanning.current || !lastPointer.current) return;
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dxScreen = e.clientX - lastPointer.current.x;
    const dyScreen = e.clientY - lastPointer.current.y;
    const current = viewBoxRef.current;
    const dxView = (dxScreen / rect.width) * current.width;
    const dyView = (dyScreen / rect.height) * current.height;

    viewBoxRef.current = clampViewBox(
      current.x - dxView,
      current.y - dyView,
      current.width,
      current.height
    );
    scheduleUpdate();
    lastPointer.current = { x: e.clientX, y: e.clientY };
  }, [clampViewBox, scheduleUpdate]);

  const handlePointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    isPanning.current = false;
    lastPointer.current = null;
    svgRef.current?.releasePointerCapture(e.pointerId);
  }, []);

  const resetView = useCallback(() => {
    viewBoxRef.current = { x: 0, y: 0, width: CANVAS_W, height: CANVAS_H };
    scheduleUpdate();
  }, [scheduleUpdate]);

  const fitToScreen = useCallback((nodes: Array<{ x: number; y: number; width: number; height: number }>) => {
    if (nodes.length === 0) return;
    
    const padding = 100;
    // Fix coordinate math: use explicit top-left anchor extents
    // Nodes are positioned by center (x, y), so convert to top-left for bounds
    const minX = Math.min(...nodes.map(n => n.x - n.width / 2)) - padding;
    const maxX = Math.max(...nodes.map(n => n.x + n.width / 2)) + padding;
    const minY = Math.min(...nodes.map(n => n.y - n.height / 2)) - padding;
    const maxY = Math.max(...nodes.map(n => n.y + n.height / 2)) + padding;
    
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    
    const scaleX = rect.width / contentWidth;
    const scaleY = rect.height / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1.5);
    
    const newWidth = CANVAS_W / scale;
    const newHeight = CANVAS_H / scale;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    
    viewBoxRef.current = {
      x: centerX - newWidth / 2,
      y: centerY - newHeight / 2,
      width: newWidth,
      height: newHeight,
    };
    scheduleUpdate();
  }, [scheduleUpdate]);

  const zoomIn = useCallback(() => {
    const current = viewBoxRef.current;
    const newWidth = Math.max(MIN_VIEW_W, current.width * 0.85);
    const scale = newWidth / current.width;
    const newHeight = current.height * scale;
    const centerX = current.x + current.width / 2;
    const centerY = current.y + current.height / 2;
    
    viewBoxRef.current = {
      x: centerX - newWidth / 2,
      y: centerY - newHeight / 2,
      width: newWidth,
      height: newHeight,
    };
    scheduleUpdate();
  }, [scheduleUpdate]);

  const zoomOut = useCallback(() => {
    const current = viewBoxRef.current;
    const newWidth = Math.min(MAX_VIEW_W, current.width * 1.15);
    const scale = newWidth / current.width;
    const newHeight = current.height * scale;
    const centerX = current.x + current.width / 2;
    const centerY = current.y + current.height / 2;
    
    viewBoxRef.current = {
      x: centerX - newWidth / 2,
      y: centerY - newHeight / 2,
      width: newWidth,
      height: newHeight,
    };
    scheduleUpdate();
  }, [scheduleUpdate]);

  const setDiagramBounds = useCallback((bounds: DiagramBounds | null) => {
    setDiagramBoundsState(bounds);
  }, []);

  return {
    viewBox,
    svgRef,
    handlers: {
      onWheel: handleWheel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerLeave: handlePointerUp,
    },
    resetView,
    fitToScreen,
    zoomIn,
    zoomOut,
    setDiagramBounds,
  };
}
