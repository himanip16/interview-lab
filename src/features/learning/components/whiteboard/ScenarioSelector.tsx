// src/features/learning/components/whiteboard/ScenarioSelector.tsx

import React from "react";
import { Scenario } from "@/features/whiteboard/types/whiteboard";
import { cn } from "@/shared/utils/utils";

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  activeScenarioId: string | null;
  onSelectScenario: (scenarioId: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  user: "bg-blue-100 text-blue-700 border-blue-200",
  driver: "bg-green-100 text-green-700 border-green-200",
  system: "bg-purple-100 text-purple-700 border-purple-200",
  failure: "bg-red-100 text-red-700 border-red-200",
};

export function ScenarioSelector({
  scenarios,
  activeScenarioId,
  onSelectScenario,
}: ScenarioSelectorProps) {
  if (scenarios.length === 0) {
    return null;
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
  const categoryColor = CATEGORY_COLORS[scenario.category] || CATEGORY_COLORS.system;

  return (
    <button
      onClick={onClick}
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
            isActive ? "bg-white" : categoryColor.split(" ")[0]
          )}
        />
        <span>{scenario.question}</span>
      </div>
    </button>
  );
}
