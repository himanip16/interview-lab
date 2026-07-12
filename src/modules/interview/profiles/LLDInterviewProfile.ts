import { InterviewProfile } from "./InterviewProfile";

export const LLDInterviewProfile: InterviewProfile = {
  type: "LLD",

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
Introduce the object-oriented design problem.

Ask the candidate to clarify the expected behaviour and scope.
`.trim(),
    },

    {
      id: "requirements",

      goals: [
        "use_cases",
        "actors",
        "constraints",
        "edge_cases",
      ],

      evaluationDimensions: [
        "requirement_clarity",
        "scope_management",
      ],

      targetDurationRatio: 0.15,

      transitionThreshold: 0.75,

      instructions: `
Evaluate whether the candidate identifies important use cases, actors, constraints, and edge cases.

Answer clarification questions.

Do not propose classes or interfaces.
`.trim(),
    },

    {
      id: "domain_modeling",

      goals: [
        "core_entities",
        "responsibilities",
        "relationships",
      ],

      evaluationDimensions: [
        "object_modeling",
        "abstraction",
      ],

      targetDurationRatio: 0.2,

      transitionThreshold: 0.75,

      instructions: `
Ask the candidate to identify the core entities.

Evaluate responsibilities and relationships.

Challenge god objects, unclear ownership, and weak abstractions.
`.trim(),
    },

    {
      id: "class_design",

      goals: [
        "classes",
        "interfaces",
        "method_boundaries",
        "encapsulation",
      ],

      evaluationDimensions: [
        "class_design",
        "code_quality",
      ],

      targetDurationRatio: 0.3,

      transitionThreshold: 0.75,

      instructions: `
Probe concrete class and interface design.

Evaluate method boundaries, encapsulation, and separation of concerns.

Ask focused questions about design decisions.
`.trim(),
    },

    {
      id: "extensibility",

      goals: [
        "change_scenarios",
        "design_tradeoffs",
        "extensibility",
        "testability",
      ],

      evaluationDimensions: [
        "design_patterns",
        "tradeoffs",
        "maintainability",
      ],

      targetDurationRatio: 0.25,

      transitionThreshold: 0.7,

      instructions: `
Introduce realistic requirement changes.

Evaluate whether the design is extensible and testable.

Probe design patterns only when relevant.

Do not force pattern usage.
`.trim(),
    },

    {
      id: "closing",

      goals: [
        "final_design_summary",
      ],

      evaluationDimensions: [
        "communication",
      ],

      targetDurationRatio: 0.05,

      transitionThreshold: 1,

      instructions: `
Ask the candidate to summarize their final design and major tradeoffs.

Conclude the interview naturally.
`.trim(),
    },
  ],
};