// src/features/learning/components/whiteboard/WhiteboardModeBar.tsx

import React from "react";
import { Scenario } from "@/features/whiteboard/types/whiteboard";
import { cn } from "@/shared/utils/utils";

interface WhiteboardModeBarProps {
  scenarios: Scenario[];
  activeScenarioId: string | null;
  onSelectScenario: (scenarioId: string) => void;
}

const CATEGORY_DOTS: Record<string, string> = {
  user: "bg-blue-500",
  driver: "bg-green-500",
  system: "bg-purple-500",
  failure: "bg-red-500",
};

export function WhiteboardModeBar({
  scenarios,
  activeScenarioId,
  onSelectScenario,
}: WhiteboardModeBarProps) {
  if (scenarios.length === 0) {
    return null;
  }

  // When a scenario is active, show progress instead of hiding all scenarios
  if (activeScenarioId) {
    const activeScenario = scenarios.find(s => s.id === activeScenarioId);
    if (!activeScenario) return null;

    return (
      <div className="border-b border-gray-200 bg-white">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => onSelectScenario("")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h2 className="text-sm font-semibold text-gray-900">
              {activeScenario.title}
            </h2>
          </div>
          {/* Progress indicator */}
          <div className="flex items-center gap-1 text-xs text-gray-500 overflow-x-auto">
            {activeScenario.steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {index > 0 && <span className="text-gray-300">→</span>}
                <span className={index === 0 ? "text-gray-900 font-medium" : ""}>
                  {step.nodeId}
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">
          Learning Scenarios
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {scenarios.map((scenario) => (
            <ScenarioButton
              key={scenario.id}
              scenario={scenario}
              isActive={activeScenarioId === scenario.id}
              onClick={() => onSelectScenario(scenario.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ScenarioButtonProps {
  scenario: Scenario;
  isActive: boolean;
  onClick: () => void;
}

function ScenarioButton({ scenario, isActive, onClick }: ScenarioButtonProps) {
  const categoryDot = CATEGORY_DOTS[scenario.category] || CATEGORY_DOTS.system;

  return (
    <button
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      aria-label={`Select scenario: ${scenario.title}`}
      className={cn(
        "flex-shrink-0 px-4 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap",
        isActive
          ? "bg-gray-900 text-white border-gray-900 shadow-md"
          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "w-2 h-2 rounded-full",
            isActive ? "bg-white" : categoryDot
          )}
        />
        <span>{scenario.title}</span>
      </div>
    </button>
  );
}
