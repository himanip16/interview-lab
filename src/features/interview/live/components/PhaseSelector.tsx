// src/features/interview/live/components/PhaseSelector.tsx

'use client';

import React from 'react';

interface Phase {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface PhaseSelectorProps {
  phases: Phase[];
  currentPhase: string;
  onPhaseChange?: (phaseId: string) => void;
}

export const PhaseSelector: React.FC<PhaseSelectorProps> = ({
  phases,
  currentPhase,
}) => {
  return (
    <div className="flex items-center gap-6 px-6 py-4 border-b border-gray-200 bg-white overflow-x-auto">
      {phases.map((phase) => {
        const isCompleted = phase.status === 'completed';
        const isCurrent = phase.id === currentPhase;

        return (
          <button
            key={phase.id}
            className="flex items-center gap-2 whitespace-nowrap transition-all"
            disabled={!isCompleted && !isCurrent}
          >
            {/* Indicator circle */}
            <div className="flex items-center justify-center w-5 h-5 rounded-full border-2">
              {isCompleted ? (
                // Completed: filled green circle
                <div className="w-5 h-5 rounded-full bg-green-600 border-green-600" />
              ) : isCurrent ? (
                // Current: filled black circle
                <div className="w-5 h-5 rounded-full bg-black border-black" />
              ) : (
                // Upcoming: empty circle
                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
              )}
            </div>

            {/* Phase name */}
            <span
              className={`text-sm font-medium ${
                isCurrent
                  ? 'text-gray-900'
                  : isCompleted
                  ? 'text-gray-600'
                  : 'text-gray-400'
              }`}
            >
              {phase.name}
            </span>
          </button>
        );
      })}
    </div>
  );
};