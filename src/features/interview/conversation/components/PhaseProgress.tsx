'use client';

import React from 'react';

interface PhaseProgressProps {
  currentPhase: string;
  isCompleted: boolean;
}

/**
 * PhaseProgress
 *
 * Shows which phase the interview is in
 * 
 * Phases are defined in the template and managed by the backend.
 * This component just displays the current phase name.
 *
 * Common phases:
 * - intro
 * - Requirements
 * - high-level-design
 * - deep-dive
 * - scalability
 * - closing
 *
 * Phase order and transitions are owned by InterviewEngine
 */
export function PhaseProgress({
  currentPhase,
  isCompleted,
}: PhaseProgressProps) {
  // Format phase name (e.g., "high-level-design" → "High-level design")
  const formatPhaseName = (phase: string) => {
    return phase
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
          Current Phase
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-gray-900 text-white text-sm font-medium">
          {isCompleted ? 'Completed' : formatPhaseName(currentPhase)}
        </div>
      </div>
    </div>
  );
}