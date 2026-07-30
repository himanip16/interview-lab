// src/features/learning/components/whiteboard/hooks/useCanvasViewport.ts

import { useRef, useState, useCallback } from "react";
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
}

export function useCanvasViewport(): UseCanvasViewportReturn {
  const [viewBox, setViewBox] = useState<ViewBox>({
    x: 0,
    y: 0,
    width: CANVAS_W,
    height: CANVAS_H,
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const isPanning = useRef(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);

  const screenToViewBox = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
    const ratioX = (clientX - rect.left) / rect.width;
    const ratioY = (clientY - rect.top) / rect.height;
    return {
      x: viewBox.x + ratioX * viewBox.width,
      y: viewBox.y + ratioY * viewBox.height,
    };
  }, [viewBox]);

  const clampViewBox = useCallback((x: number, y: number, width: number, height: number): ViewBox => {
    // Clamp to prevent dragging into infinite empty space
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
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const zoomPoint = screenToViewBox(e.clientX, e.clientY);
    const zoomFactor = e.deltaY > 0 ? 1.1 : 1 / 1.1;

    setViewBox((prev) => {
      const newWidth = Math.min(MAX_VIEW_W, Math.max(MIN_VIEW_W, prev.width * zoomFactor));
      const scale = newWidth / prev.width;
      const newHeight = prev.height * scale;
      const newX = zoomPoint.x - (zoomPoint.x - prev.x) * scale;
      const newY = zoomPoint.y - (zoomPoint.y - prev.y) * scale;
      return clampViewBox(newX, newY, newWidth, newHeight);
    });
  }, [screenToViewBox, clampViewBox]);

  const handlePointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    // Allow panning on background, but not on nodes
    const target = e.target as SVGElement;
    if (target.closest("g[role='button']") || target.closest("g.nodes-layer")) return;
    
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
    const dxView = (dxScreen / rect.width) * viewBox.width;
    const dyView = (dyScreen / rect.height) * viewBox.height;

    setViewBox((prev) => {
      const clamped = clampViewBox(
        prev.x - dxView,
        prev.y - dyView,
        prev.width,
        prev.height
      );
      return clamped;
    });
    lastPointer.current = { x: e.clientX, y: e.clientY };
  }, [viewBox.width, viewBox.height, clampViewBox]);

  const handlePointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    isPanning.current = false;
    lastPointer.current = null;
    svgRef.current?.releasePointerCapture(e.pointerId);
  }, []);

  const resetView = useCallback(() => {
    setViewBox({ x: 0, y: 0, width: CANVAS_W, height: CANVAS_H });
  }, []);

  const fitToScreen = useCallback((nodes: Array<{ x: number; y: number; width: number; height: number }>) => {
    if (nodes.length === 0) return;
    
    const padding = 100;
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
    
    setViewBox({
      x: centerX - newWidth / 2,
      y: centerY - newHeight / 2,
      width: newWidth,
      height: newHeight,
    });
  }, []);

  const zoomIn = useCallback(() => {
    setViewBox(prev => ({
      ...prev,
      width: Math.max(MIN_VIEW_W, prev.width * 0.85),
      height: prev.height * 0.85,
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setViewBox(prev => ({
      ...prev,
      width: Math.min(MAX_VIEW_W, prev.width * 1.15),
      height: prev.height * 1.15,
    }));
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
  };
}
