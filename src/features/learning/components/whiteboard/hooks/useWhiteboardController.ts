// src/features/learning/components/whiteboard/hooks/useWhiteboardController.ts

import { useRef, useEffect, useState } from "react";
import { ScenarioController } from "@/features/whiteboard/controller/ScenarioController";
import { ScenarioControllerState, Scenario, DiagramNode } from "@/features/whiteboard/types/whiteboard";

interface UseWhiteboardControllerReturn {
  controller: ScenarioController;
  state: ScenarioControllerState;
  startScenario: (scenarioId: string) => void;
  nextStep: () => void;
  previousStep: () => void;
  jumpToStep: (stepId: string) => void;
  exitScenario: () => void;
  focusNode: (nodeId: string) => void;
  clearFocus: () => void;
  getAllScenarios: () => Scenario[];
  getFocusedNode: () => DiagramNode | null;
}

export function useWhiteboardController(
  scenarios: Scenario[],
  nodes: DiagramNode[]
): UseWhiteboardControllerReturn {
  // Use useRef to prevent controller recreation on every render
  const controllerRef = useRef<ScenarioController | null>(null);

  // Initialize controller only once
  if (!controllerRef.current) {
    controllerRef.current = new ScenarioController(scenarios, nodes);
  }

  const controller = controllerRef.current;

  // Subscribe to controller state changes instead of polling
  const [state, setState] = useState<ScenarioControllerState>(controller.getState());

  useEffect(() => {
    const unsubscribe = controller.subscribe(setState);
    return unsubscribe;
  }, [controller]);

  // Wrapper functions that trigger state updates through the subscription
  const startScenario = (scenarioId: string) => {
    controller.startScenario(scenarioId);
  };

  const nextStep = () => {
    controller.nextStep();
  };

  const previousStep = () => {
    controller.previousStep();
  };

  const jumpToStep = (stepId: string) => {
    controller.jumpToStep(stepId);
  };

  const exitScenario = () => {
    controller.exitScenario();
  };

  const focusNode = (nodeId: string) => {
    controller.focusNode(nodeId as any);
  };

  const clearFocus = () => {
    controller.clearFocus();
  };

  const getAllScenarios = () => {
    return controller.getAllScenarios();
  };

  const getFocusedNode = () => {
    return controller.getFocusedNode();
  };

  return {
    controller,
    state,
    startScenario,
    nextStep,
    previousStep,
    jumpToStep,
    exitScenario,
    focusNode,
    clearFocus,
    getAllScenarios,
    getFocusedNode,
  };
}
