import { InterviewProfile } from "./InterviewProfile";
import { PhaseId, Goal, EvaluationDimension, goal } from "../constants";

export const LLDInterviewProfile: InterviewProfile = {
  type: "LLD",

  metadata: {
    difficulty: "Medium",
    estimatedQuestions: 15,
    maxRetries: 2,
    allowBacktracking: true,
    supportsInterruptions: true,
  },

  phases: [
    {
      id: PhaseId.Introduction,

      goals: [
        goal(Goal.CandidateUnderstandsProblem, true, 1.0),
      ],

      evaluationDimensions: [
        EvaluationDimension.Communication,
      ],

      continuousEvaluation: [
        EvaluationDimension.Communication,
      ],

      phaseEvaluation: [],

      targetDurationRatio: 0.05,

      transitionThreshold: 0.7,

      prompt: {
        objective: "Introduce the object-oriented design problem and clarify scope",
        rules: [
          "Ask the candidate to clarify the expected behaviour and scope",
        ],
        exitCriteria: [
          "Candidate understands the problem",
          "Scope is clarified",
        ],
      },

      showWhiteboard: false,
    },

    {
      id: PhaseId.Requirements,

      goals: [
        goal(Goal.LLD_UseCases, true, 0.25),
        goal(Goal.Actors, true, 0.25),
        goal(Goal.Constraints, true, 0.25),
        goal(Goal.EdgeCases, true, 0.25),
      ],

      evaluationDimensions: [
        EvaluationDimension.RequirementClarity,
        EvaluationDimension.ScopeManagement,
      ],

      continuousEvaluation: [
        EvaluationDimension.Communication,
      ],

      phaseEvaluation: [
        EvaluationDimension.RequirementClarity,
        EvaluationDimension.ScopeManagement,
      ],

      targetDurationRatio: 0.15,

      transitionThreshold: 0.75,

      prompt: {
        objective: "Evaluate whether the candidate identifies important use cases, actors, constraints, and edge cases",
        rules: [
          "Answer clarification questions",
          "Do not propose classes or interfaces",
        ],
        exitCriteria: [
          "Use cases identified",
          "Actors identified",
          "Constraints identified",
          "Edge cases identified",
        ],
      },

      showWhiteboard: false,
    },

    {
      id: PhaseId.DomainModeling,

      goals: [
        goal(Goal.CoreEntities, true, 0.33),
        goal(Goal.Responsibilities, true, 0.33),
        goal(Goal.Relationships, true, 0.34),
      ],

      evaluationDimensions: [
        EvaluationDimension.ObjectModeling,
        EvaluationDimension.Abstraction,
      ],

      continuousEvaluation: [
        EvaluationDimension.Abstraction,
      ],

      phaseEvaluation: [
        EvaluationDimension.ObjectModeling,
      ],

      targetDurationRatio: 0.2,

      transitionThreshold: 0.75,

      prompt: {
        objective: "Evaluate core entities, responsibilities, and relationships",
        rules: [
          "Ask the candidate to identify the core entities",
          "Evaluate responsibilities and relationships",
          "Challenge god objects, unclear ownership, and weak abstractions",
        ],
        exitCriteria: [
          "Core entities identified",
          "Responsibilities defined",
          "Relationships modeled correctly",
        ],
      },

      showWhiteboard: true,
    },

    {
      id: PhaseId.ClassDesign,

      goals: [
        goal(Goal.Classes, true, 0.3),
        goal(Goal.Interfaces, true, 0.3),
        goal(Goal.MethodBoundaries, false, 0.1),
        goal(Goal.Encapsulation, true, 0.3),
      ],

      evaluationDimensions: [
        EvaluationDimension.ClassDesign,
        EvaluationDimension.CodeQuality,
      ],

      continuousEvaluation: [
        EvaluationDimension.CodeQuality,
      ],

      phaseEvaluation: [
        EvaluationDimension.ClassDesign,
      ],

      targetDurationRatio: 0.3,

      transitionThreshold: 0.75,

      prompt: {
        objective: "Probe concrete class and interface design",
        rules: [
          "Evaluate method boundaries, encapsulation, and separation of concerns",
          "Ask focused questions about design decisions",
        ],
        exitCriteria: [
          "Classes defined with clear boundaries",
          "Interfaces designed appropriately",
          "Encapsulation applied correctly",
          "Separation of concerns achieved",
        ],
      },

      showWhiteboard: true,
    },

    {
      id: PhaseId.Extensibility,

      goals: [
        goal(Goal.ChangeScenarios, false, 0.2),
        goal(Goal.DesignTradeoffs, false, 0.2),
        goal(Goal.Extensibility, true, 0.3),
        goal(Goal.Testability, true, 0.3),
      ],

      evaluationDimensions: [
        EvaluationDimension.DesignPatterns,
        EvaluationDimension.Tradeoffs,
        EvaluationDimension.Maintainability,
      ],

      continuousEvaluation: [
        EvaluationDimension.Tradeoffs,
        EvaluationDimension.Maintainability,
      ],

      phaseEvaluation: [
        EvaluationDimension.DesignPatterns,
      ],

      targetDurationRatio: 0.25,

      transitionThreshold: 0.7,

      prompt: {
        objective: "Evaluate whether the design is extensible and testable",
        rules: [
          "Introduce realistic requirement changes",
          "Probe design patterns only when relevant",
          "Do not force pattern usage",
        ],
        exitCriteria: [
          "Design accommodates requirement changes",
          "Testability considered",
          "Design patterns used appropriately",
        ],
      },

      showWhiteboard: true,
    },

    {
      id: PhaseId.Closing,

      goals: [
        goal(Goal.FinalDesignSummary, true, 1.0),
      ],

      evaluationDimensions: [
        EvaluationDimension.Communication,
      ],

      continuousEvaluation: [
        EvaluationDimension.Communication,
      ],

      phaseEvaluation: [],

      targetDurationRatio: 0.05,

      transitionThreshold: 1,

      prompt: {
        objective: "Conclude the interview with a summary",
        rules: [
          "Ask the candidate to summarize their final design and major tradeoffs",
          "Conclude the interview naturally",
        ],
        exitCriteria: [
          "Final design summary provided",
          "Major tradeoffs articulated",
        ],
      },

      showWhiteboard: false,
    },
  ],
};