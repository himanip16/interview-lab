import { InterviewProfile } from "./InterviewProfile";
import { PhaseId, Goal, EvaluationDimension, goal } from "../constants";

export const HLDInterviewProfile: InterviewProfile = {
  type: "HLD",

  metadata: {
    difficulty: "Hard",
    estimatedQuestions: 18,
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
        objective: "Introduce the problem and get the candidate to clarify their understanding",
        rules: [
          "Do not reveal requirements",
          "Ask the candidate to begin by clarifying the problem",
        ],
        exitCriteria: [
          "Candidate demonstrates understanding of the problem",
          "Candidate begins requirement discovery",
        ],
      },

      showWhiteboard: false,
    },

    {
      id: PhaseId.Requirements,

      goals: [
        goal(Goal.FunctionalRequirements, true, 0.25),
        goal(Goal.NonFunctionalRequirements, true, 0.25),
        goal(Goal.Scale, true, 0.25),
        goal(Goal.Constraints, true, 0.25),
      ],

      evaluationDimensions: [
        EvaluationDimension.RequirementClarity,
        EvaluationDimension.ScopeManagement,
        EvaluationDimension.Communication,
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
        objective: "Evaluate requirement gathering and ensure scope is well-defined",
        rules: [
          "Answer requirement questions when directly asked",
          "Do not volunteer every requirement",
          "Probe missing functional requirements, non-functional requirements, scale, and constraints",
          "Do not discuss architecture yet",
        ],
        exitCriteria: [
          "Functional requirements identified",
          "Non-functional requirements identified",
          "Scale and constraints clarified",
        ],
      },

      showWhiteboard: false,
    },

    {
      id: PhaseId.HighLevelDesign,

      goals: [
        goal(Goal.CoreComponents, true, 0.25),
        goal(Goal.ServiceBoundaries, true, 0.25),
        goal(Goal.DataFlow, true, 0.25),
        goal(Goal.StorageChoice, true, 0.25),
      ],

      evaluationDimensions: [
        EvaluationDimension.Architecture,
        EvaluationDimension.TechnicalReasoning,
      ],

      continuousEvaluation: [
        EvaluationDimension.TechnicalReasoning,
      ],

      phaseEvaluation: [
        EvaluationDimension.Architecture,
      ],

      targetDurationRatio: 0.25,

      transitionThreshold: 0.75,

      prompt: {
        objective: "Evaluate the candidate's high-level architecture proposal",
        rules: [
          "Ask the candidate to propose a high-level architecture",
          "Evaluate major components, service boundaries, data flow, and storage decisions",
          "Challenge unclear architectural choices",
          "Do not design the system for the candidate",
        ],
        exitCriteria: [
          "Major components identified",
          "Service boundaries defined",
          "Data flow described",
          "Storage decisions justified",
        ],
      },

      showWhiteboard: true,
    },

    {
      id: PhaseId.DeepDive,

      goals: [
        goal(Goal.CriticalComponent, true, 0.5),
        goal(Goal.DataModel, false, 0.15),
        goal(Goal.Consistency, false, 0.15),
        goal(Goal.TechnicalTradeoffs, true, 0.2),
      ],

      evaluationDimensions: [
        EvaluationDimension.TechnicalDepth,
        EvaluationDimension.Tradeoffs,
      ],

      continuousEvaluation: [
        EvaluationDimension.Tradeoffs,
      ],

      phaseEvaluation: [
        EvaluationDimension.TechnicalDepth,
      ],

      targetDurationRatio: 0.3,

      transitionThreshold: 0.7,

      prompt: {
        objective: "Deep dive into critical components and implementation details",
        rules: [
          "Choose important areas from the candidate's design for deeper discussion",
          "Probe implementation details, data modeling, consistency, and tradeoffs",
          "Prefer areas where the candidate's reasoning is incomplete or weak",
        ],
        exitCriteria: [
          "Critical component implementation discussed",
          "Data modeling evaluated",
          "Consistency considerations addressed",
          "Technical tradeoffs identified",
        ],
      },

      showWhiteboard: true,
    },

    {
      id: PhaseId.Scalability,

      goals: [
        goal(Goal.Bottlenecks, true, 0.4),
        goal(Goal.FailureModes, false, 0.2),
        goal(Goal.ScalingStrategy, true, 0.3),
        goal(Goal.Reliability, false, 0.1),
      ],

      evaluationDimensions: [
        EvaluationDimension.Scalability,
        EvaluationDimension.Reliability,
      ],

      continuousEvaluation: [],

      phaseEvaluation: [
        EvaluationDimension.Scalability,
        EvaluationDimension.Reliability,
      ],

      targetDurationRatio: 0.2,

      transitionThreshold: 0.7,

      prompt: {
        objective: "Evaluate scalability and reliability considerations",
        rules: [
          "Probe scalability and reliability",
          "Ask about bottlenecks, failure scenarios, capacity pressure, and scaling strategies",
          "Challenge assumptions using realistic production scenarios",
        ],
        exitCriteria: [
          "Bottlenecks identified",
          "Failure modes considered",
          "Scaling strategies proposed",
          "Reliability mechanisms discussed",
        ],
      },

      showWhiteboard: true,
    },

    {
      id: PhaseId.Closing,

      goals: [
        goal(Goal.FinalTradeoffSummary, true, 1.0),
      ],

      evaluationDimensions: [
        EvaluationDimension.Communication,
        EvaluationDimension.Tradeoffs,
      ],

      continuousEvaluation: [
        EvaluationDimension.Communication,
        EvaluationDimension.Tradeoffs,
      ],

      phaseEvaluation: [],

      targetDurationRatio: 0.05,

      transitionThreshold: 1,

      prompt: {
        objective: "Conclude the interview with a summary",
        rules: [
          "Conclude the interview naturally",
          "Ask the candidate to summarize their design and the most important tradeoffs",
          "Do not begin another technical phase",
        ],
        exitCriteria: [
          "Design summary provided",
          "Key tradeoffs articulated",
        ],
      },

      showWhiteboard: false,
    },
  ],
};
