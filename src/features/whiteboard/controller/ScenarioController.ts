// src/features/whiteboard/controller/ScenarioController.ts

import {
  Scenario,
  ScenarioStep,
  DiagramNode,
  FocusState,
  ScenarioControllerState,
  NodeId,
} from "@/features/whiteboard/types/whiteboard";

/**
 * ScenarioController - Manages walkthrough state and logic
 * 
 * Separation of concerns:
 * - Controller owns the walkthrough logic
 * - Renderer simply renders the state given to it
 * - This allows features like autoplay, branching, search without touching rendering
 */
export class ScenarioController {
  private state: ScenarioControllerState;
  private scenarios: Map<string, Scenario>;
  private nodes: Map<string, DiagramNode>;

  constructor(scenarios: Scenario[], nodes: DiagramNode[]) {
    this.scenarios = new Map(scenarios.map((s) => [s.id, s]));
    this.nodes = new Map(nodes.map((n) => [n.id as string, n]));
    this.state = {
      currentScenario: null,
      currentStep: null,
      focusState: { type: "idle" },
      progress: { current: 0, total: 0 },
    };
  }

  /**
   * Start a scenario walkthrough
   */
  startScenario(scenarioId: string): void {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) throw new Error(`Scenario not found: ${scenarioId}`);

    const startStep = scenario.steps.find((s) => s.id === scenario.startStepId);
    if (!startStep) throw new Error(`Start step not found: ${scenario.startStepId}`);

    this.state = {
      currentScenario: scenario,
      currentStep: startStep,
      focusState: {
        type: "scenario",
        nodeId: startStep.nodeId,
        scenarioId,
        stepId: startStep.id,
      },
      progress: { current: 1, total: scenario.steps.length },
    };
  }

  /**
   * Advance to the next step in the scenario
   */
  nextStep(): void {
    if (!this.state.currentStep) return;

    const nextStepId = this.state.currentStep.nextStepId;
    if (!nextStepId) return; // End of scenario

    const nextStep = this.state.currentScenario?.steps.find(
      (s) => s.id === nextStepId
    );
    if (!nextStep) return;

    this.state.currentStep = nextStep;
    this.state.focusState = {
      type: "scenario",
      nodeId: nextStep.nodeId,
      scenarioId: this.state.currentScenario!.id,
      stepId: nextStep.id,
    };
    this.state.progress.current++;
  }

  /**
   * Go back to the previous step
   */
  previousStep(): void {
    if (!this.state.currentScenario || !this.state.currentStep) return;

    const currentIndex = this.state.currentScenario.steps.findIndex(
      (s) => s.id === this.state.currentStep!.id
    );
    if (currentIndex <= 0) return;

    const prevStep = this.state.currentScenario.steps[currentIndex - 1];
    this.state.currentStep = prevStep;
    this.state.focusState = {
      type: "scenario",
      nodeId: prevStep.nodeId,
      scenarioId: this.state.currentScenario.id,
      stepId: prevStep.id,
    };
    this.state.progress.current--;
  }

  /**
   * Jump directly to a specific step
   */
  jumpToStep(stepId: string): void {
    const step = this.state.currentScenario?.steps.find((s) => s.id === stepId);
    if (!step) return;

    this.state.currentStep = step;
    this.state.focusState = {
      type: "scenario",
      nodeId: step.nodeId,
      scenarioId: this.state.currentScenario!.id,
      stepId: step.id,
    };
    const currentIndex = this.state.currentScenario!.steps.findIndex(
      (s) => s.id === stepId
    );
    this.state.progress.current = currentIndex + 1;
  }

  /**
   * Manually focus a node (outside of scenario)
   */
  focusNode(nodeId: NodeId): void {
    this.state.focusState = { type: "focused", nodeId };
  }

  /**
   * Clear all focus
   */
  clearFocus(): void {
    this.state.focusState = { type: "idle" };
  }

  /**
   * Exit the current scenario
   */
  exitScenario(): void {
    this.state = {
      currentScenario: null,
      currentStep: null,
      focusState: { type: "idle" },
      progress: { current: 0, total: 0 },
    };
  }

  /**
   * Get the current controller state
   */
  getState(): ScenarioControllerState {
    return this.state;
  }

  /**
   * Get the currently focused node
   */
  getFocusedNode(): DiagramNode | null {
    const nodeId =
      this.state.focusState.type === "idle"
        ? null
        : this.state.focusState.nodeId;
    return nodeId ? (this.nodes.get(nodeId as string) || null) : null;
  }

  /**
   * Check if a specific step is the current step
   */
  isCurrentStep(stepId: string): boolean {
    return this.state.currentStep?.id === stepId;
  }

  /**
   * Check if a specific node is focused
   */
  isNodeFocused(nodeId: NodeId): boolean {
    return (
      this.state.focusState.type !== "idle" &&
      this.state.focusState.nodeId === nodeId
    );
  }

  /**
   * Get all scenarios
   */
  getAllScenarios(): Scenario[] {
    return Array.from(this.scenarios.values());
  }

  /**
   * Get a specific scenario by ID
   */
  getScenario(scenarioId: string): Scenario | undefined {
    return this.scenarios.get(scenarioId);
  }
}
