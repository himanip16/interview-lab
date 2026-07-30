// src/features/learning/components/whiteboard/WalkthroughCallout.tsx

import React from "react";
import { ScenarioStep, DiagramNode } from "@/features/whiteboard/types/whiteboard";

interface WalkthroughCalloutProps {
  step: ScenarioStep;
  node: DiagramNode;
  progress: { current: number; total: number };
  onPrevious: () => void;
  onNext: () => void;
  onExit: () => void;
  position: { x: number; y: number };
}

export function WalkthroughCallout({
  step,
  node,
  progress,
  onPrevious,
  onNext,
  onExit,
  position,
}: WalkthroughCalloutProps) {
  return (
    <div
      className="absolute bg-white rounded-xl shadow-2xl border border-gray-200 w-72 z-50"
      style={{
        left: position.x + 16,
        top: position.y,
        transform: "translateY(-100%)",
        marginTop: -12,
      }}
    >
      {/* Header with node title */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-900">{node.title}</h3>
          <button
            onClick={onExit}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
            aria-label="Close walkthrough"
          >
            ×
          </button>
        </div>
      </div>

      {/* Narration */}
      <div className="p-3">
        <p className="text-sm text-gray-700 leading-relaxed">
          {step.narration}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="px-3 pb-3 flex items-center gap-2">
        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 transition-all duration-300"
            style={{
              width: `${(progress.current / progress.total) * 100}%`,
            }}
          />
        </div>
        <span className="text-xs text-gray-500">
          {progress.current}/{progress.total}
        </span>
      </div>
    </div>
  );
}
