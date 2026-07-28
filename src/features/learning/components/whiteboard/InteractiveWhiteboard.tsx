// src/features/learning/components/whiteboard/InteractiveWhiteboard.tsx

"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/shared/utils/utils";

import { WhiteboardFrame, NodeId } from "@/features/whiteboard/types/whiteboard";
import { ScenarioController } from "@/features/whiteboard/controller/ScenarioController";
import { DEFAULT_WHITEBOARD_CONFIG } from "@/features/whiteboard/config";

import { ScenarioSelector } from "./ScenarioSelector";
import { DetailsPanel } from "./DetailsPanel";
import { WalkthroughCallout } from "./WalkthroughCallout";

import { BackgroundLayer } from "./canvas/BackgroundLayer";
import { EdgesLayer } from "./canvas/EdgesLayer";
import { NodesLayer } from "./canvas/NodesLayer";
import { FocusEffectsLayer } from "./canvas/FocusEffectsLayer";
import { NavigationHintsLayer } from "./canvas/NavigationHintsLayer";

interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface InteractiveWhiteboardProps {
  frame: WhiteboardFrame;
  className?: string;
}

const CANVAS_W = DEFAULT_WHITEBOARD_CONFIG.canvasWidth;
const CANVAS_H = DEFAULT_WHITEBOARD_CONFIG.canvasHeight;
const MIN_VIEW_W = CANVAS_W / 5;
const MAX_VIEW_W = CANVAS_W * 3;

export function InteractiveWhiteboard({ frame, className }: InteractiveWhiteboardProps) {
  // Initialize controller
  const controller = useMemo(() => {
    const scenarios = frame.scenarios || [];
    return new ScenarioController(scenarios, frame.nodes.map((n) => n.data));
  }, [frame]);

  const [controllerState, setControllerState] = useState(controller.getState());

  // Subscribe to controller state changes
  useEffect(() => {
    const interval = setInterval(() => {
      setControllerState(controller.getState());
    }, 100);
    return () => clearInterval(interval);
  }, [controller]);

  // ViewBox state for pan/zoom
  const [viewBox, setViewBox] = useState<ViewBox>({
    x: 0,
    y: 0,
    width: CANVAS_W,
    height: CANVAS_H,
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const isPanning = useRef(false);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);

  // Get current focus state
  const focusedNodeId =
    controllerState.focusState.type === "idle"
      ? null
      : controllerState.focusState.type === "scenario"
      ? controllerState.focusState.nodeId
      : controllerState.focusState.type === "focused"
      ? controllerState.focusState.nodeId
      : null;
  const activeNodeId =
    controllerState.focusState.type === "scenario"
      ? controllerState.focusState.nodeId
      : null;

  const focusedNode = controller.getFocusedNode();
  const currentStep = controllerState.currentStep;

  // Calculate callout position
  const calloutPosition = useMemo(() => {
    if (!activeNodeId || !currentStep) return null;
    const node = frame.nodes.find((n) => n.data.id === activeNodeId);
    if (!node) return null;

    // Convert viewBox coordinates to screen coordinates
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();

    const screenX = ((node.x - viewBox.x) / viewBox.width) * rect.width + rect.left;
    const screenY = ((node.y - viewBox.y) / viewBox.height) * rect.height + rect.top;

    return { x: screenX, y: screenY };
  }, [activeNodeId, currentStep, frame.nodes, viewBox]);

  // Pan/zoom handlers
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
      return { x: newX, y: newY, width: newWidth, height: newHeight };
    });
  }, [screenToViewBox]);

  const handlePointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if ((e.target as SVGElement).closest("g[role='button']")) return;
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

    setViewBox((prev) => ({
      ...prev,
      x: prev.x - dxView,
      y: prev.y - dyView,
    }));
    lastPointer.current = { x: e.clientX, y: e.clientY };
  }, [viewBox.width, viewBox.height]);

  const handlePointerUp = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    isPanning.current = false;
    lastPointer.current = null;
    svgRef.current?.releasePointerCapture(e.pointerId);
  }, []);

  const resetView = useCallback(() => {
    setViewBox({ x: 0, y: 0, width: CANVAS_W, height: CANVAS_H });
  }, []);

  // Node selection
  const handleSelectNode = useCallback((nodeId: NodeId) => {
    controller.focusNode(nodeId);
    setControllerState(controller.getState());
  }, [controller]);

  // Scenario controls
  const handleSelectScenario = useCallback((scenarioId: string) => {
    controller.startScenario(scenarioId);
    setControllerState(controller.getState());
  }, [controller]);

  const handleNextStep = useCallback(() => {
    controller.nextStep();
    setControllerState(controller.getState());
  }, [controller]);

  const handlePreviousStep = useCallback(() => {
    controller.previousStep();
    setControllerState(controller.getState());
  }, [controller]);

  const handleExitScenario = useCallback(() => {
    controller.exitScenario();
    setControllerState(controller.getState());
  }, [controller]);

  const handleCloseDetails = useCallback(() => {
    controller.clearFocus();
    setControllerState(controller.getState());
  }, [controller]);

  // Auto-pan to focused node
  useEffect(() => {
    if (activeNodeId) {
      const node = frame.nodes.find((n) => n.data.id === activeNodeId);
      if (node) {
        setViewBox((prev) => {
          const targetX = node.x - prev.width / 2;
          const targetY = node.y - prev.height / 2;
          return {
            ...prev,
            x: targetX,
            y: targetY,
          };
        });
      }
    }
  }, [activeNodeId, frame.nodes]);

  // Get next node ID for navigation hints
  const nextNodeId = useMemo(() => {
    if (!currentStep?.nextStepId) return undefined;
    const nextStep = controllerState.currentScenario?.steps.find(
      (s) => s.id === currentStep.nextStepId
    );
    return nextStep?.nodeId;
  }, [currentStep, controllerState.currentScenario]);

  return (
    <div className={cn("flex flex-col h-screen", className)}>
      {/* Scenario Selector */}
      <ScenarioSelector
        scenarios={controller.getAllScenarios()}
        activeScenarioId={controllerState.currentScenario?.id || null}
        onSelectScenario={handleSelectScenario}
      />

      {/* Canvas Container */}
      <div className="flex-1 relative overflow-hidden">
        <svg
          ref={svgRef}
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          className="w-full h-full touch-none select-none"
          onWheel={handleWheel}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Layer 1: Background */}
          <BackgroundLayer width={CANVAS_W} height={CANVAS_H} />

          {/* Layer 2: Edges */}
          <EdgesLayer
            edges={frame.edges}
            activeNodeId={activeNodeId || undefined}
            previousNodeId={
              controllerState.focusState.type === "scenario"
                ? controllerState.focusState.nodeId
                : controllerState.focusState.type === "focused"
                ? controllerState.focusState.nodeId
                : undefined
            }
          />

          {/* Layer 3: Nodes */}
          <NodesLayer
            nodes={frame.nodes}
            focusedNodeId={focusedNodeId}
            activeNodeId={activeNodeId}
            onSelectNode={handleSelectNode}
          />

          {/* Layer 4: Focus Effects */}
          <FocusEffectsLayer nodes={frame.nodes} activeNodeId={activeNodeId} />

          {/* Layer 5: Navigation Hints */}
          <NavigationHintsLayer
            nodes={frame.nodes}
            activeNodeId={activeNodeId}
            nextNodeId={nextNodeId}
          />
        </svg>

        {/* Reset View Button */}
        <button
          type="button"
          onClick={resetView}
          className="absolute top-4 right-4 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm z-10"
        >
          Reset view
        </button>

        {/* Walkthrough Callout (HTML overlay) */}
        {currentStep && focusedNode && calloutPosition && (
          <WalkthroughCallout
            step={currentStep}
            node={focusedNode}
            progress={controllerState.progress}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            onExit={handleExitScenario}
            position={calloutPosition}
          />
        )}
      </div>

      {/* Details Panel */}
      <DetailsPanel
        node={focusedNode}
        isOpen={focusedNodeId !== null && controllerState.currentScenario === null}
        onClose={handleCloseDetails}
      />
    </div>
  );
}
