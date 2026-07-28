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
      className="absolute bg-white rounded-xl shadow-2xl border border-gray-200 w-80 z-50"
      style={{
        left: position.x + 20,
        top: position.y,
        transform: "translateY(-50%)",
      }}
    >
      {/* Header with node title */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{node.title}</h3>
          <button
            onClick={onExit}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close walkthrough"
          >
            ×
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${(progress.current / progress.total) * 100}%`,
              }}
            />
          </div>
          <span className="text-xs text-gray-500">
            Step {progress.current} of {progress.total}
          </span>
        </div>
      </div>

      {/* Narration */}
      <div className="p-4 border-b border-gray-100">
        <p className="text-sm text-gray-700 leading-relaxed">
          {step.narration}
        </p>
      </div>

      {/* Node details */}
      <div className="p-4 border-b border-gray-100">
        <div className="space-y-3">
          {/* Role */}
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Role
            </span>
            <p className="text-xs text-gray-600 mt-1">{node.details.role}</p>
          </div>

          {/* Failure Modes */}
          {node.details.failureModes && (
            <div>
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
                Failure Modes
              </span>
              <p className="text-xs text-gray-600 mt-1">
                {node.details.failureModes}
              </p>
            </div>
          )}

          {/* Tradeoffs */}
          {node.details.tradeoffs && (
            <div>
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                Tradeoffs
              </span>
              <p className="text-xs text-gray-600 mt-1">{node.details.tradeoffs}</p>
            </div>
          )}

          {/* Notes */}
          {node.details.notes && (
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                Notes
              </span>
              <p className="text-xs text-gray-600 mt-1">{node.details.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Deep Dive Link */}
      {node.details.deepDive && (
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <a
            href="#"
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
          >
            <span>→</span>
            <span>Deep Dive</span>
          </a>
        </div>
      )}

      {/* Navigation */}
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={onPrevious}
          disabled={progress.current === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>
        <button
          onClick={onNext}
          disabled={progress.current === progress.total}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {progress.current === progress.total ? "Finish" : "Next →"}
        </button>
      </div>
    </div>
  );
}
