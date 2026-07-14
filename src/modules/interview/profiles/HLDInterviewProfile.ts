import { InterviewProfile } from "./InterviewProfile";
import { PhaseId, Goal, EvaluationDimension } from "../constants";

export const HLDInterviewProfile: InterviewProfile = {
  type: "HLD",

  phases: [
    {
      id: PhaseId.Introduction,

      goals: [
        Goal.CandidateUnderstandsProblem,
      ],

      evaluationDimensions: [
        EvaluationDimension.Communication,
      ],

      targetDurationRatio: 0.05,

      transitionThreshold: 0.7,

      instructions: `
Introduce the problem briefly.

Do not reveal requirements.

Ask the candidate to begin by clarifying the problem.

Move forward once the candidate demonstrates that they understand the problem and begins requirement discovery.
`.trim(),

      showWhiteboard: false,
    },

    {
      id: PhaseId.Requirements,

      goals: [
        Goal.FunctionalRequirements,
        Goal.NonFunctionalRequirements,
        Goal.Scale,
        Goal.Constraints,
      ],

      evaluationDimensions: [
        EvaluationDimension.RequirementClarity,
        EvaluationDimension.ScopeManagement,
        EvaluationDimension.Communication,
      ],

      targetDurationRatio: 0.15,

      transitionThreshold: 0.75,

      instructions: `
Evaluate requirement gathering.

Answer requirement questions when directly asked.

Do not volunteer every requirement.

Probe missing functional requirements, non-functional requirements, scale, and constraints.

Do not discuss architecture yet.
`.trim(),

      showWhiteboard: false,
    },

    {
      id: PhaseId.HighLevelDesign,

      goals: [
        Goal.CoreComponents,
        Goal.ServiceBoundaries,
        Goal.DataFlow,
        Goal.StorageChoice,
      ],

      evaluationDimensions: [
        EvaluationDimension.Architecture,
        EvaluationDimension.TechnicalReasoning,
      ],

      targetDurationRatio: 0.25,

      transitionThreshold: 0.75,

      instructions: `
Ask the candidate to propose a high-level architecture.

Evaluate major components, service boundaries, data flow, and storage decisions.

Challenge unclear architectural choices.

Do not design the system for the candidate.
`.trim(),

      showWhiteboard: true,
    },

    {
      id: PhaseId.DeepDive,

      goals: [
        Goal.CriticalComponent,
        Goal.DataModel,
        Goal.Consistency,
        Goal.TechnicalTradeoffs,
      ],

      evaluationDimensions: [
        EvaluationDimension.TechnicalDepth,
        EvaluationDimension.Tradeoffs,
      ],

      targetDurationRatio: 0.3,

      transitionThreshold: 0.7,

      instructions: `
Choose important areas from the candidate's design for deeper discussion.

Probe implementation details, data modeling, consistency, and tradeoffs.

Prefer areas where the candidate's reasoning is incomplete or weak.
`.trim(),

      showWhiteboard: true,
    },

    {
      id: PhaseId.Scalability,

      goals: [
        Goal.Bottlenecks,
        Goal.FailureModes,
        Goal.ScalingStrategy,
        Goal.Reliability,
      ],

      evaluationDimensions: [
        EvaluationDimension.Scalability,
        EvaluationDimension.Reliability,
      ],

      targetDurationRatio: 0.2,

      transitionThreshold: 0.7,

      instructions: `
Probe scalability and reliability.

Ask about bottlenecks, failure scenarios, capacity pressure, and scaling strategies.

Challenge assumptions using realistic production scenarios.
`.trim(),

      showWhiteboard: true,
    },

    {
      id: PhaseId.Closing,

      goals: [
        Goal.FinalTradeoffSummary,
      ],

      evaluationDimensions: [
        EvaluationDimension.Communication,
        EvaluationDimension.Tradeoffs,
      ],

      targetDurationRatio: 0.05,

      transitionThreshold: 1,

      instructions: `
Conclude the interview naturally.

Ask the candidate to summarize their design and the most important tradeoffs.

Do not begin another technical phase.
`.trim(),

      showWhiteboard: false,
    },
  ],
};
