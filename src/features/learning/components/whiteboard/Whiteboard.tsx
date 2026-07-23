// src/features/learning/components/whiteboard/Whiteboard.tsx

"use client";

import { useMemo, useRef, useState, useCallback, WheelEvent, PointerEvent, DragEvent } from "react";

import { cn } from "@/shared/utils/utils";
import { Inspector } from "@/shared/layout/Inspector";

import { WhiteboardFrame } from "@/features/whiteboard/types/whiteboard";
import { DEFAULT_WHITEBOARD_CONFIG } from "@/features/whiteboard/config";
import { DiagramNode } from "./DiagramNode";
import { DiagramEdges } from "./DiagramEdges";

const CATEGORY_COLORS = {
  entry: "var(--category-practice)",
  logic: "var(--category-concept)",
  storage: "var(--category-learn-deep)",
  network: "var(--category-neutral)",
  queue: "var(--category-live)",
} as const;

interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface WhiteboardProps {
  frame: WhiteboardFrame;
  initialSelectedId?: string;
  showInspector?: boolean;
  className?: string;
}

const CANVAS_W = DEFAULT_WHITEBOARD_CONFIG.canvasWidth;
const CANVAS_H = DEFAULT_WHITEBOARD_CONFIG.canvasHeight;
const MIN_VIEW_W = CANVAS_W / 5;   // most zoomed-in
const MAX_VIEW_W = CANVAS_W * 3;   // most zoomed-out

export default function Whiteboard({
  frame,
  initialSelectedId,
  showInspector = true,
  className,
}: WhiteboardProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    initialSelectedId ?? frame.nodes[0]?.data.id ?? null
  );

  const [viewBox, setViewBox] = useState<ViewBox>({
    x: 0,
    y: 0,
    width: CANVAS_W,
    height: CANVAS_H,
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const isPanning = useRef(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);

  const activeNode = useMemo(
    () => frame.nodes.find((n) => n.data.id === selectedId)?.data ?? null,
    [frame, selectedId]
  );

  // Converts a screen-space (clientX/Y) point into current viewBox coordinates.
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

  const handleWheel = useCallback((e: WheelEvent<SVGSVGElement>) => {
    e.preventDefault();

    const zoomPoint = screenToViewBox(e.clientX, e.clientY);
    const zoomFactor = e.deltaY > 0 ? 1.1 : 1 / 1.1;

    setViewBox((prev) => {
      const newWidth = Math.min(MAX_VIEW_W, Math.max(MIN_VIEW_W, prev.width * zoomFactor));
      const scale = newWidth / prev.width;
      const newHeight = prev.height * scale;

      // Keep the point under the cursor fixed while zooming.
      const newX = zoomPoint.x - (zoomPoint.x - prev.x) * scale;
      const newY = zoomPoint.y - (zoomPoint.y - prev.y) * scale;

      return { x: newX, y: newY, width: newWidth, height: newHeight };
    });
  }, [screenToViewBox]);

  const handlePointerDown = useCallback((e: PointerEvent<SVGSVGElement>) => {
    // Ignore drags starting on a node — clicking a node should select it,
    // not start a pan.
    if ((e.target as SVGElement).closest("g[role='button']")) return;

    e.preventDefault(); // stop native browser drag/text-selection from hijacking this

    isPanning.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    svgRef.current?.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: PointerEvent<SVGSVGElement>) => {
    if (!isPanning.current || !lastPointer.current) return;
    e.preventDefault();

    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return; // guard against NaN viewBox

    const dxScreen = e.clientX - lastPointer.current.x;
    const dyScreen = e.clientY - lastPointer.current.y;

    const dxView = (dxScreen / rect.width) * viewBox.width;
    const dyView = (dyScreen / rect.height) * viewBox.height;

    setViewBox((prev) => ({
      ...prev,
      x: prev.x - dxView,
      y: prev.y - dyView,
    }));

    lastPointer.current = { x: e.clientX, y: e.clientY };
  }, [viewBox.width, viewBox.height]);

  const handlePointerUp = useCallback((e: PointerEvent<SVGSVGElement>) => {
    isPanning.current = false;
    lastPointer.current = null;
    svgRef.current?.releasePointerCapture(e.pointerId);
  }, []);

  const handleDragStart = useCallback((e: DragEvent<SVGSVGElement>) => {
    // Firefox in particular treats SVG content as natively draggable,
    // which hijacks pointermove before our pan logic ever sees it.
    e.preventDefault();
  }, []);

  const resetView = useCallback(() => {
    setViewBox({ x: 0, y: 0, width: CANVAS_W, height: CANVAS_H });
  }, []);

  return (
    <div className={cn("flex flex-col xl:flex-row gap-5", className)}>
      <div className="flex-1 min-w-0">
        <div className="relative rounded-[22px] bg-[#FAF9F6] p-5 border border-[rgba(21,22,28,0.04)] min-h-[380px] overflow-hidden">

          <svg
  ref={svgRef}
  viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
  className="w-full h-[380px] touch-none select-none"
  onDragStart={handleDragStart}
  onWheel={handleWheel}
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
  onPointerLeave={handlePointerUp}
>
            <DiagramEdges edges={frame.edges} />

            {frame.nodes.map((node) => (
              <DiagramNode
                key={node.data.id}
                node={node.data}
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                isSelected={selectedId === node.data.id}
                onClick={() => setSelectedId(node.data.id)}
              />
            ))}
          </svg>

          <button
            type="button"
            onClick={resetView}
            className="absolute top-4 right-4 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white border border-[rgba(21,22,28,0.1)]"
          >
            Reset view
          </button>

          <div className="absolute bottom-4 left-4 flex gap-4 text-[11.5px] font-semibold text-[#5A5B66]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--category-practice)]" />
              Entry
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--category-concept)]" />
              Logic
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--category-learn-deep)]" />
              Storage
            </span>
          </div>
        </div>
      </div>

      {showInspector && (
        <div className="w-full xl:w-[300px] shrink-0">
          {activeNode ? (
            <Inspector
              title={activeNode.title}
              kind={activeNode.category.toUpperCase()}
              category={
                activeNode.category === "entry"
                  ? "practice"
                  : activeNode.category === "logic"
                  ? "concept"
                  : "neutral"
              }
              color={CATEGORY_COLORS[activeNode.category]}
              blocks={[
                { label: "Role & duty", content: activeNode.details.role },
                { label: "Deep dive", content: activeNode.details.deepDive },
                { label: "Failure modes", content: activeNode.details.failureModes },
                { label: "Tradeoffs", content: activeNode.details.tradeoffs },
              ]}
            />
          ) : (
            <div className="h-full rounded-[22px] border border-dashed border-[rgba(21,22,28,0.15)] p-6 flex flex-col justify-center items-center text-center">
              <p className="text-[13px] text-[#5A5B66] leading-relaxed">
                Select a component on the whiteboard to inspect its architecture,
                failures, and tradeoffs.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}