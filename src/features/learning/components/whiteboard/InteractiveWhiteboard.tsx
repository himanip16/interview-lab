// src/features/learning/components/whiteboard/InteractiveWhiteboard.tsx

"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { cn } from "@/shared/utils/utils";

import { WhiteboardFrame, NodeId, Scenario } from "@/features/whiteboard/types/whiteboard";
import { DEFAULT_WHITEBOARD_CONFIG } from "@/features/whiteboard/config";

const CATEGORY_COLORS = {
  entry: "#FF5A3C",
  logic: "#6A5AE0",
  storage: "#00A87E",
  queue: "#E8940A",
  network: "#15161C",
} as const;

import { DetailsPanel } from "./DetailsPanel";

import { BackgroundLayer } from "./canvas/BackgroundLayer";
import { EdgesLayer } from "./canvas/EdgesLayer";
import { NodesLayer } from "./canvas/NodesLayer";
import { FocusEffectsLayer } from "./canvas/FocusEffectsLayer";
import { NavigationHintsLayer } from "./canvas/NavigationHintsLayer";

import { useCanvasViewport } from "./hooks/useCanvasViewport";
import { useWhiteboardController } from "./hooks/useWhiteboardController";
import { useNodeInteraction } from "./hooks/useNodeInteraction";


interface InteractiveWhiteboardProps {
  diagram: WhiteboardFrame;
  learning: { scenarios: Scenario[] };
  className?: string;
  systemTitle?: string;
  systemDescription?: string;
}

const CANVAS_W = DEFAULT_WHITEBOARD_CONFIG.canvasWidth;
const CANVAS_H = DEFAULT_WHITEBOARD_CONFIG.canvasHeight;

type WhiteboardMode = 'explore' | 'flows';

export function InteractiveWhiteboard({ diagram, learning, className, systemTitle, systemDescription }: InteractiveWhiteboardProps) {
  console.log('[InteractiveWhiteboard] Component rendered');
  console.log('[InteractiveWhiteboard] diagram:', diagram);
  console.log('[InteractiveWhiteboard] learning:', learning);
  console.log('[InteractiveWhiteboard] diagram.nodes:', diagram.nodes);
  console.log('[InteractiveWhiteboard] diagram.edges:', diagram.edges);
  
  const [mode, setMode] = useState<WhiteboardMode>('explore');
  const [selectedJourneyIndex, setSelectedJourneyIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const scenarios = learning.scenarios || [];
  const nodes = diagram.nodes.map((n) => n.data);
  console.log('[InteractiveWhiteboard] scenarios:', scenarios);
  console.log('[InteractiveWhiteboard] nodes:', nodes);
  
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
    setDiagramBounds,
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
  }, [startScenario, exitScenario]);

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
        fitToScreen([{
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
        }]);
      }
    }
  }, [activeNodeId, nodesById, fitToScreen]);

  // Calculate diagram bounds for intelligent viewport clamping
  useEffect(() => {
    if (diagram.nodes.length > 0) {
      const minX = Math.min(...diagram.nodes.map(n => n.x - n.width / 2));
      const maxX = Math.max(...diagram.nodes.map(n => n.x + n.width / 2));
      const minY = Math.min(...diagram.nodes.map(n => n.y - n.height / 2));
      const maxY = Math.max(...diagram.nodes.map(n => n.y + n.height / 2));
      
      setDiagramBounds({ minX, maxX, minY, maxY });
    } else {
      setDiagramBounds(null);
    }
  }, [diagram.nodes, setDiagramBounds]);

  // Initial fit to screen when diagram loads - only fit if nodes exist
  useEffect(() => {
    if (diagram.nodes.length > 0) {
      // Small delay to ensure SVG is mounted
      const timer = setTimeout(() => {
        fitToScreen(diagram.nodes.map(node => ({
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
        })));
      }, 100);
      return () => clearTimeout(timer);
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
    setIsPlaying(false); // Reset play state when switching scenarios
  }, [handleSelectScenario]);

  // Auto-advance timer for flow playback
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      const canAdvance = controllerState.progress.current < controllerState.progress.total;
      if (canAdvance) {
        nextStep();
      } else {
        setIsPlaying(false);
      }
    }, 2500);

    return () => clearInterval(timer);
  }, [isPlaying, nextStep, controllerState.progress]);

  return (
    <div className={cn("flex h-screen w-screen overflow-hidden bg-white", className)}>
      {/* Main Stage */}
      <main className="flex-1 relative flex flex-col min-w-0">
        {/* Bottom Sheet Overlay */}
        {focusedNodeId && (
          <div
            className="fixed inset-0 z-30 bg-black/20"
            onClick={handleCloseDetails}
          />
        )}
        {/* Title Row */}
        <div className="px-5 py-4 flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {systemTitle || 'System Architecture'}
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animation: 'pulse 1.8s ease-in-out infinite' }}></span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {mode === 'explore' 
                ? 'Hover a component for a quick note, tap for the full breakdown.' 
                : 'Follow a real journey through the system, phase by phase.'}
            </p>
          </div>
        </div>

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
            <BackgroundLayer width={CANVAS_W} height={CANVAS_H} />

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
              edgeAnnotation={currentStep?.edgeAnnotation}
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
          <div className="flex gap-1.5 bg-[#FAF9F6] p-1 rounded-full">
            <button
              onClick={() => setMode('explore')}
              className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
                mode === 'explore' 
                  ? 'bg-[#15161C] text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => setMode('flows')}
              className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
                mode === 'flows' 
                  ? 'bg-[#15161C] text-white' 
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
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A3C]"></span>
              Client
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#15161C]"></span>
              Gateway
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6A5AE0]"></span>
              Logic
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00A87E]"></span>
              Integration
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
            <div className="bg-white rounded-full px-6 py-3 border border-gray-100 shadow-sm max-w-md mx-auto flex items-center justify-between gap-4">
              <button
                onClick={previousStep}
                disabled={controllerState.progress.current === 1}
                className="text-xs font-semibold px-4 py-2 rounded-full border cursor-pointer bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <div className="flex gap-1.5">
                {Array.from({ length: controllerState.progress.total }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
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
                onClick={() => setIsPlaying(!isPlaying)}
                className={`text-xs font-semibold px-4 py-2 rounded-full border cursor-pointer ${
                  isPlaying 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : 'bg-emerald-600 text-white border-emerald-600'
                }`}
              >
                {isPlaying ? 'Pause' : 'Play ▶'}
              </button>
              <button
                onClick={nextStep}
                disabled={controllerState.progress.current === controllerState.progress.total}
                className="text-xs font-semibold px-4 py-2 rounded-full border cursor-pointer bg-white text-gray-700 border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Hover Annotation Tooltip */}
        {hoveredNodeId && annotPosition && mode === 'explore' && (
          <div
            className="absolute z-20 bg-[#15161C] text-white rounded-xl px-4 py-3 shadow-xl pointer-events-auto"
            style={{
              left: annotPosition.x + 14,
              top: annotPosition.y,
              transform: 'translateY(0)',
              opacity: 1,
              transition: 'opacity 0.18s ease, transform 0.18s ease',
            }}
          >
            <div className="text-xs font-bold mb-1">
              {nodesById.get(hoveredNodeId as any)?.data.title}
            </div>
            <div className="text-[9.5px] text-white/50 uppercase tracking-wider mb-1.5">
              {nodesById.get(hoveredNodeId as any)?.data.category || 'Component'}
            </div>
            <div className="text-[11.5px] text-white/75 leading-relaxed mb-2">
              {nodesById.get(hoveredNodeId as any)?.data.details.role || 'System component'}
            </div>
            <div className="text-[9.5px] font-bold px-2 py-1 rounded-full inline-block mb-2 bg-emerald-500/20 text-emerald-400">
              Not a SPOF
            </div>
            <div 
              className="text-xs font-bold text-emerald-400 cursor-pointer"
              onClick={() => handleSelectNode(hoveredNodeId as any)}
            >
              See full breakdown →
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Bottom Sheet */}
      {focusedNodeId && (
        <div 
          className="fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-3xl shadow-2xl border-t border-gray-200 max-h-[78vh] overflow-y-auto max-w-[520px] mx-auto left-0 right-0 transform transition-transform duration-[350ms] cubic-bezier(0.34,1.1,0.64,1) translate-y-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-9 h-1 bg-gray-300 rounded-full mx-auto my-4" />
          <div className="px-6 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[focusedNode?.category as keyof typeof CATEGORY_COLORS] || '#15161C' }}
              >
                <div className="w-4 h-4 rounded-full border-2 border-current opacity-80" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base">{focusedNode?.title}</h3>
                <p className="text-xs text-gray-500 font-medium">
                  {focusedNode?.category}
                </p>
              </div>
              <button
                onClick={handleCloseDetails}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                aria-label="Close details"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                  Purpose
                </span>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {focusedNode?.details.role}
                </p>
              </div>
              {focusedNode?.details.deepDive && (
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                    Why we need it
                  </span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {focusedNode.details.deepDive}
                  </p>
                </div>
              )}
              {focusedNode?.details.failureModes && (
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                    If it fails
                  </span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {focusedNode.details.failureModes}
                  </p>
                </div>
              )}
              {focusedNode?.details.tradeoffs && (
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                    Tradeoffs
                  </span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {focusedNode.details.tradeoffs}
                  </p>
                </div>
              )}
              {focusedNode?.details.notes && (
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                    Notes
                  </span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {focusedNode.details.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
