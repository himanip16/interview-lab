import { InterviewProfile } from "./InterviewProfile";

export const HLDInterviewProfile: InterviewProfile = {
  type: "HLD",

  phases: [
    {
      id: "introduction",

      goals: [
        "candidate_understands_problem",
      ],

      evaluationDimensions: [
        "communication",
      ],

      targetDurationRatio: 0.05,

      transitionThreshold: 0.7,

      instructions: `
Introduce the problem briefly.

Do not reveal requirements.

Ask the candidate to begin by clarifying the problem.

Move forward once the candidate demonstrates that they understand the problem and begins requirement discovery.
`.trim(),
    },

    {
      id: "requirements",

      goals: [
        "functional_requirements",
        "non_functional_requirements",
        "scale",
        "constraints",
      ],

      evaluationDimensions: [
        "requirement_clarity",
        "scope_management",
        "communication",
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
    },

    {
      id: "high_level_design",

      goals: [
        "core_components",
        "service_boundaries",
        "data_flow",
        "storage_choice",
      ],

      evaluationDimensions: [
        "architecture",
        "technical_reasoning",
      ],

      targetDurationRatio: 0.25,

      transitionThreshold: 0.75,

      instructions: `
Ask the candidate to propose a high-level architecture.

Evaluate major components, service boundaries, data flow, and storage decisions.

Challenge unclear architectural choices.

Do not design the system for the candidate.
`.trim(),
    },

    {
      id: "deep_dive",

      goals: [
        "critical_component",
        "data_model",
        "consistency",
        "technical_tradeoffs",
      ],

      evaluationDimensions: [
        "technical_depth",
        "tradeoffs",
      ],

      targetDurationRatio: 0.3,

      transitionThreshold: 0.7,

      instructions: `
Choose important areas from the candidate's design for deeper discussion.

Probe implementation details, data modeling, consistency, and tradeoffs.

Prefer areas where the candidate's reasoning is incomplete or weak.
`.trim(),
    },

    {
      id: "scalability",

      goals: [
        "bottlenecks",
        "failure_modes",
        "scaling_strategy",
        "reliability",
      ],

      evaluationDimensions: [
        "scalability",
        "reliability",
      ],

      targetDurationRatio: 0.2,

      transitionThreshold: 0.7,

      instructions: `
Probe scalability and reliability.

Ask about bottlenecks, failure scenarios, capacity pressure, and scaling strategies.

Challenge assumptions using realistic production scenarios.
`.trim(),
    },

    {
      id: "closing",

      goals: [
        "final_tradeoff_summary",
      ],

      evaluationDimensions: [
        "communication",
        "tradeoffs",
      ],

      targetDurationRatio: 0.05,

      transitionThreshold: 1,

      instructions: `
Conclude the interview naturally.

Ask the candidate to summarize their design and the most important tradeoffs.

Do not begin another technical phase.
`.trim(),
    },
  ],
};
