// src/features/learning/components/whiteboard/InteractiveWhiteboard.tsx

"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { cn } from "@/shared/utils/utils";

import { WhiteboardFrame, NodeId, Scenario } from "@/features/whiteboard/types/whiteboard";
import { DEFAULT_WHITEBOARD_CONFIG } from "@/features/whiteboard/config";

import { DetailsPanel } from "./DetailsPanel";
import { WalkthroughCallout } from "./WalkthroughCallout";

import { BackgroundLayer } from "./canvas/BackgroundLayer";
import { EdgesLayer } from "./canvas/EdgesLayer";
import { NodesLayer } from "./canvas/NodesLayer";
import { FocusEffectsLayer } from "./canvas/FocusEffectsLayer";
import { NavigationHintsLayer } from "./canvas/NavigationHintsLayer";

import { useCanvasViewport } from "./hooks/useCanvasViewport";
import { useWhiteboardController } from "./hooks/useWhiteboardController";
import { useScenarioPlayback } from "./hooks/useScenarioPlayback";
import { useNodeInteraction } from "./hooks/useNodeInteraction";


interface InteractiveWhiteboardProps {
  diagram: WhiteboardFrame;
  learning: { scenarios: Scenario[] };
  className?: string;
  systemTitle?: string;
  systemDescription?: string;
}

const CANVAS_W = DEFAULT_WHITEBOARD_CONFIG.canvasWidth;

type WhiteboardMode = 'explore' | 'flows';

export function InteractiveWhiteboard({ diagram, learning, className, systemTitle, systemDescription }: InteractiveWhiteboardProps) {
  const [mode, setMode] = useState<WhiteboardMode>('explore');
  const [selectedJourneyIndex, setSelectedJourneyIndex] = useState(0);
  
  const scenarios = learning.scenarios || [];
  const nodes = diagram.nodes.map((n) => n.data);
  
  // Performance optimization: Create Map for O(1) node lookups
  const nodesById = useMemo(
    () => new Map(diagram.nodes.map(n => [n.data.id, n])),
    [diagram.nodes]
  );
  
  // Controller hook - prevents recreation with useRef
  const {
    state: controllerState,
    startScenario,
    nextStep,
    previousStep,
    jumpToStep,
    exitScenario,
    focusNode,
    clearFocus,
    getAllScenarios,
    getFocusedNode,
  } = useWhiteboardController(scenarios, nodes);

  // Viewport hook - handles pan/zoom
  const {
    viewBox,
    svgRef,
    handlers: viewportHandlers,
    resetView,
    fitToScreen,
    zoomIn,
    zoomOut,
  } = useCanvasViewport();

  // Node interaction hook
  const {
    hoveredNodeId,
    annotPosition,
    hoveredEdgeId,
    handleNodeHover,
    handleEdgeHover,
    clearHover,
  } = useNodeInteraction(mode);

  // Playback hook
  const { isPlaying, playPause, stop: stopPlayback } = useScenarioPlayback(
    nextStep,
    () => controllerState.currentStep !== null,
    2100
  );

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

  const focusedNode = getFocusedNode();
  const currentStep = controllerState.currentStep;

  // Calculate active edge from current step
  const activeEdgeId = useMemo(() => {
    if (!currentStep?.fromNodeId || !currentStep?.toNodeId) return undefined;
    const edge = diagram.edges.find(
      e => e.fromId === currentStep.fromNodeId && e.toId === currentStep.toNodeId
    );
    return edge?.id;
  }, [currentStep, diagram.edges]);

  // Calculate callout position - use nodesById for performance
  const calloutPosition = useMemo(() => {
    if (!activeNodeId || !currentStep) return null;
    const node = nodesById.get(activeNodeId);
    if (!node) return null;

    // Convert viewBox coordinates to screen coordinates
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();

    const screenX = ((node.x - viewBox.x) / viewBox.width) * rect.width + rect.left;
    const screenY = ((node.y - viewBox.y) / viewBox.height) * rect.height + rect.top;

    return { x: screenX, y: screenY };
  }, [activeNodeId, currentStep, nodesById, viewBox]);

  // Node selection
  const handleSelectNode = useCallback((nodeId: NodeId) => {
    focusNode(nodeId);
    clearHover();
  }, [focusNode, clearHover]);

  // Scenario controls
  const handleSelectScenario = useCallback((scenarioId: string) => {
    if (scenarioId === "") {
      exitScenario();
    } else {
      startScenario(scenarioId);
    }
    stopPlayback();
  }, [startScenario, exitScenario, stopPlayback]);

  const handleCloseDetails = useCallback(() => {
    clearFocus();
  }, [clearFocus]);

  // Edge interaction handlers
  const handleEdgeClick = useCallback((edgeId: string) => {
    const edge = diagram.edges.find((e) => e.id === edgeId);
    if (edge) {
      handleSelectNode(edge.toId);
    }
  }, [diagram.edges, handleSelectNode]);

  // Auto-pan to focused node - use nodesById for performance
  useEffect(() => {
    if (activeNodeId) {
      const node = nodesById.get(activeNodeId);
      if (node) {
        fitToScreen([node]);
      }
    }
  }, [activeNodeId, nodesById, fitToScreen]);

  // Initial fit to screen when diagram loads
  useEffect(() => {
    if (diagram.nodes.length > 0) {
      fitToScreen(diagram.nodes);
    }
  }, [diagram.nodes, fitToScreen]);

  // Get next node ID for navigation hints
  const nextNodeId = useMemo(() => {
    if (!currentStep?.nextStepId) return undefined;
    const nextStep = controllerState.currentScenario?.steps.find(
      (s) => s.id === currentStep.nextStepId
    );
    return nextStep?.nodeId;
  }, [currentStep, controllerState.currentScenario]);

  // Handle scenario selection with journey index update
  const handleSelectScenarioWithIndex = useCallback((scenarioId: string, index: number) => {
    setSelectedJourneyIndex(index);
    handleSelectScenario(scenarioId);
  }, [handleSelectScenario]);

  return (
    <div className={cn("flex h-screen w-screen overflow-hidden bg-white", className)}>
      {/* Main Stage */}
      <main className="flex-1 relative flex flex-col min-w-0">
        {/* Canvas Container */}
        <div className="flex-1 relative overflow-hidden">
          <svg
            ref={svgRef}
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            className="w-full h-full touch-none select-none"
            onWheel={viewportHandlers.onWheel}
            onPointerDown={viewportHandlers.onPointerDown}
            onPointerMove={viewportHandlers.onPointerMove}
            onPointerUp={viewportHandlers.onPointerUp}
            onPointerLeave={viewportHandlers.onPointerLeave}
          >
            {/* Layer 1: Background */}
            <BackgroundLayer width={CANVAS_W} height={CANVAS_W} />

            {/* Layer 2: Edges */}
            <EdgesLayer
              edges={diagram.edges}
              activeEdgeId={activeEdgeId}
              activeNodeId={activeNodeId || undefined}
              previousNodeId={currentStep?.fromNodeId}
              onEdgeClick={handleEdgeClick}
              onEdgeHover={handleEdgeHover}
              hoveredEdgeId={hoveredEdgeId}
              showAnimation={mode === 'flows'}
            />

            {/* Layer 3: Nodes */}
            <NodesLayer
            nodes={diagram.nodes}
            focusedNodeId={focusedNodeId}
            activeNodeId={activeNodeId}
            onSelectNode={handleSelectNode}
            onNodeHover={handleNodeHover}
          />

          {/* Layer 4: Focus Effects */}
          <FocusEffectsLayer nodes={diagram.nodes} activeNodeId={activeNodeId} />

          {/* Layer 5: Navigation Hints */}
          <NavigationHintsLayer
            nodes={diagram.nodes}
            activeNodeId={activeNodeId}
            nextNodeId={nextNodeId}
          />
        </svg>

        {/* View Controls */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
          <div className="flex gap-1.5 bg-gray-50 p-1 rounded-full">
            <button
              onClick={() => setMode('explore')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                mode === 'explore' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => setMode('flows')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                mode === 'flows' 
                  ? 'bg-gray-900 text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Flows
            </button>
          </div>
          <div className="text-xs font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-100">
            {Math.round((CANVAS_W / viewBox.width) * 100)}%
          </div>
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={zoomIn}
            className="w-8 h-8 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer text-gray-900 font-bold hover:bg-gray-50 transition-colors"
          >
            +
          </button>
          <button
            type="button"
            onClick={zoomOut}
            className="w-8 h-8 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer text-gray-900 font-bold hover:bg-gray-50 transition-colors"
          >
            −
          </button>
          <button
            type="button"
            onClick={resetView}
            className="w-8 h-8 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer text-gray-900 font-bold text-[9px] hover:bg-gray-50 transition-colors"
          >
            RST
          </button>
        </div>

        {/* Interaction Hints */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-medium text-gray-600 shadow-sm z-10">
          Drag or scroll to pan · Ctrl+scroll to zoom
        </div>

        {/* Legend */}
        {mode === 'explore' && (
          <div className="absolute bottom-4 right-4 flex gap-3 text-[10.5px] text-gray-500 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full z-10">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              Entry
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-900"></span>
              Network
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
              Logic
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Storage
            </span>
          </div>
        )}

        {/* Flow Controls Top Overlay */}
        {mode === 'flows' && (
          <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-gray-50 to-transparent">
            {/* Integrated Scenario Selector */}
            <div className="flex gap-2 mb-2">
              {getAllScenarios().map((scenario, index) => (
                <button
                  key={scenario.id}
                  onClick={() => handleSelectScenarioWithIndex(scenario.id, index)}
                  className={`text-xs font-semibold px-4 py-2 rounded-full border cursor-pointer transition-colors ${
                    selectedJourneyIndex === index
                      ? 'bg-violet-500 text-white border-violet-500'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {scenario.title}
                </button>
              ))}
            </div>
            {/* Phase Timeline */}
            {controllerState.currentScenario && (
              <div className="flex items-center gap-1 overflow-x-auto">
                {controllerState.currentScenario.steps.map((step, index) => {
                  const isCurrentStep = currentStep?.id === step.id;
                  const isPastStep = controllerState.progress.current > index + 1;
                  return (
                    <React.Fragment key={step.id}>
                      {index > 0 && <span className="text-gray-400 opacity-40 text-xs">→</span>}
                      <button
                        onClick={() => jumpToStep(step.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer whitespace-nowrap transition-colors ${
                          isCurrentStep
                            ? 'bg-gray-900 text-white border-gray-900'
                            : isPastStep
                            ? 'text-emerald-600 border-emerald-200 bg-white'
                            : 'text-gray-500 border-gray-200 bg-white'
                        }`}
                      >
                        {step.nodeId}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Flow Controls Bottom Overlay */}
        {mode === 'flows' && controllerState.currentScenario && (
          <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-gray-50 to-transparent">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm max-w-lg mx-auto">
              <div className="text-[10.5px] font-bold text-violet-500 uppercase tracking-wider mb-1">
                Step {controllerState.progress.current} of {controllerState.progress.total}
              </div>
              <p className="text-sm text-gray-700 mb-3">
                {currentStep?.narration || 'Follow the journey through the system.'}
              </p>
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={previousStep}
                  className="text-xs font-semibold px-4 py-2 rounded-full border cursor-pointer bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                >
                  ← Prev
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: controllerState.progress.total }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i < controllerState.progress.current - 1
                          ? 'bg-emerald-600'
                          : i === controllerState.progress.current - 1
                          ? 'bg-violet-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={playPause}
                  className={`text-xs font-semibold px-4 py-2 rounded-full cursor-pointer ${
                    isPlaying
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {isPlaying ? 'Pause' : 'Play ▶'}
                </button>
                <button
                  onClick={nextStep}
                  className="text-xs font-semibold px-4 py-2 rounded-full border cursor-pointer bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hover Annotation Tooltip */}
        {hoveredNodeId && annotPosition && mode === 'explore' && (
          <div
            className="absolute z-20 bg-gray-900 text-white rounded-lg px-3 py-2 shadow-xl pointer-events-none"
            style={{
              left: annotPosition.x + 12,
              top: annotPosition.y - 8,
              transform: 'translateY(-100%)',
            }}
          >
            <div className="text-xs font-semibold">
              {nodesById.get(hoveredNodeId as any)?.data.title}
            </div>
            <div className="text-[10px] text-white/70 mt-0.5 max-w-[200px] truncate">
              {nodesById.get(hoveredNodeId as any)?.data.details.role || 'Component'}
            </div>
          </div>
        )}

        {/* Walkthrough Callout (HTML overlay) */}
        {currentStep && focusedNode && calloutPosition && (
          <WalkthroughCallout
            step={currentStep}
            node={focusedNode}
            progress={controllerState.progress}
            onPrevious={previousStep}
            onNext={nextStep}
            onExit={exitScenario}
            position={calloutPosition}
          />
        )}
        </div>
      </main>

      {/* Side Inspector */}
      <aside className="w-80 lg:w-96 border-l border-gray-200 bg-white shrink-0 z-20">
        <DetailsPanel
          node={focusedNode}
          isOpen={focusedNodeId !== null}
          onClose={handleCloseDetails}
          systemTitle={systemTitle}
          systemDescription={systemDescription}
          scenarioCount={getAllScenarios().length}
        />
      </aside>
    </div>
  );
}
