import { InterviewProfile } from "./InterviewProfile";
import { PhaseId, Goal, EvaluationDimension } from "../constants";

export const LLDInterviewProfile: InterviewProfile = {
  type: "LLD",

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
Introduce the object-oriented design problem.

Ask the candidate to clarify the expected behaviour and scope.
`.trim(),

      showWhiteboard: false,
    },

    {
      id: PhaseId.Requirements,

      goals: [
        Goal.UseCases,
        Goal.Actors,
        Goal.Constraints,
        Goal.EdgeCases,
      ],

      evaluationDimensions: [
        EvaluationDimension.RequirementClarity,
        EvaluationDimension.ScopeManagement,
      ],

      targetDurationRatio: 0.15,

      transitionThreshold: 0.75,

      instructions: `
Evaluate whether the candidate identifies important use cases, actors, constraints, and edge cases.

Answer clarification questions.

Do not propose classes or interfaces.
`.trim(),

      showWhiteboard: false,
    },

    {
      id: PhaseId.DomainModeling,

      goals: [
        Goal.CoreEntities,
        Goal.Responsibilities,
        Goal.Relationships,
      ],

      evaluationDimensions: [
        EvaluationDimension.ObjectModeling,
        EvaluationDimension.Abstraction,
      ],

      targetDurationRatio: 0.2,

      transitionThreshold: 0.75,

      instructions: `
Ask the candidate to identify the core entities.

Evaluate responsibilities and relationships.

Challenge god objects, unclear ownership, and weak abstractions.
`.trim(),

      showWhiteboard: true,
    },

    {
      id: PhaseId.ClassDesign,

      goals: [
        Goal.Classes,
        Goal.Interfaces,
        Goal.MethodBoundaries,
        Goal.Encapsulation,
      ],

      evaluationDimensions: [
        EvaluationDimension.ClassDesign,
        EvaluationDimension.CodeQuality,
      ],

      targetDurationRatio: 0.3,

      transitionThreshold: 0.75,

      instructions: `
Probe concrete class and interface design.

Evaluate method boundaries, encapsulation, and separation of concerns.

Ask focused questions about design decisions.
`.trim(),

      showWhiteboard: true,
    },

    {
      id: PhaseId.Extensibility,

      goals: [
        Goal.ChangeScenarios,
        Goal.DesignTradeoffs,
        Goal.Extensibility,
        Goal.Testability,
      ],

      evaluationDimensions: [
        EvaluationDimension.DesignPatterns,
        EvaluationDimension.Tradeoffs,
        EvaluationDimension.Maintainability,
      ],

      targetDurationRatio: 0.25,

      transitionThreshold: 0.7,

      instructions: `
Introduce realistic requirement changes.

Evaluate whether the design is extensible and testable.

Probe design patterns only when relevant.

Do not force pattern usage.
`.trim(),

      showWhiteboard: true,
    },

    {
      id: PhaseId.Closing,

      goals: [
        Goal.FinalDesignSummary,
      ],

      evaluationDimensions: [
        EvaluationDimension.Communication,
      ],

      targetDurationRatio: 0.05,

      transitionThreshold: 1,

      instructions: `
Ask the candidate to summarize their final design and major tradeoffs.

Conclude the interview naturally.
`.trim(),

      showWhiteboard: false,
    },
  ],
};