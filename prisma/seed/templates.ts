import { EvaluationDimension, PhaseId, Goal } from "../../src/features/interview/data/constants";
function rubric(good: string[], bad: string): string {
  return JSON.stringify({ good, bad });
}

const RUBRICS: Record<EvaluationDimension, string> = {
  [EvaluationDimension.Communication]: rubric(
    [
      "Explains reasoning out loud before committing to decisions",
      "Structures the conversation (states assumptions, checks in, summarizes)",
      "Responds directly to interviewer questions instead of deflecting",
      "Uses precise technical vocabulary",
    ],
    "is silent for long stretches or jumps to conclusions without narrating why"
  ),
  [EvaluationDimension.RequirementClarity]: rubric(
    [
      "Distinguishes functional vs non-functional Requirements",
      "Asks about scale, latency, and consistency expectations",
      "Confirms scope before designing",
    ],
    "starts designing before Requirements are clarified"
  ),
  [EvaluationDimension.ScopeManagement]: rubric(
    [
      "Keeps requirement gathering time-boxed and focused",
      "Avoids over-scoping into unrelated features",
    ],
    "spends excessive time on Requirements or scope-creeps the problem"
  ),
  [EvaluationDimension.Architecture]: rubric(
    [
      "Identifies the right core components and service boundaries",
      "Justifies storage/database choices",
      "Describes data flow between components clearly",
    ],
    "proposes an architecture without justifying key decisions"
  ),
  [EvaluationDimension.TechnicalReasoning]: rubric(
    [
      "Backs design choices with concrete reasoning, not buzzwords",
      "Considers more than one option before choosing",
    ],
    "name-drops technologies without explaining why they fit"
  ),
  [EvaluationDimension.TechnicalDepth]: rubric(
    [
      "Goes beyond the surface level when probed on a component",
      "Handles follow-up questions about internals confidently",
    ],
    "gives shallow answers when pushed for detail"
  ),
  [EvaluationDimension.Tradeoffs]: rubric(
    [
      "Explicitly names tradeoffs (e.g. consistency vs availability, latency vs cost)",
      "Justifies a choice given the stated Requirements",
    ],
    "presents a design as if it has no downsides"
  ),
  [EvaluationDimension.Scalability]: rubric(
    [
      "Horizontal Scaling",
      "Load Balancer",
      "Partitioning",
      "Sharding",
      "Replication",
      "Caching",
      "CDN",
      "Queue",
    ],
    "ignores scaling completely"
  ),
  [EvaluationDimension.Reliability]: rubric(
    [
      "Identifies single points of failure",
      "Discusses retries, timeouts, and graceful degradation",
      "Considers monitoring/alerting",
    ],
    "assumes components never fail"
  ),
  [EvaluationDimension.ObjectModeling]: rubric(
    [
      "Identifies the right core entities and their responsibilities",
      "Models relationships (composition vs association vs inheritance) correctly",
    ],
    "produces a single god object or unclear ownership"
  ),
  [EvaluationDimension.Abstraction]: rubric(
    [
      "Hides implementation details behind clean interfaces",
      "Avoids leaking internal state",
    ],
    "exposes internal implementation details unnecessarily"
  ),
  [EvaluationDimension.ClassDesign]: rubric(
    [
      "Defines clear method boundaries",
      "Applies encapsulation appropriately",
      "Separates concerns between classes",
    ],
    "produces classes with unclear or overlapping responsibilities"
  ),
  [EvaluationDimension.CodeQuality]: rubric(
    ["Names things clearly", "Keeps methods small and focused"],
    "writes code that is hard to follow or overly clever"
  ),
  [EvaluationDimension.DesignPatterns]: rubric(
    [
      "Applies a design pattern where it genuinely fits",
      "Explains why the pattern was chosen",
    ],
    "forces a pattern where it doesn't fit, or can't explain the choice"
  ),
  [EvaluationDimension.Maintainability]: rubric(
    [
      "Design accommodates realistic future requirement changes",
      "Includes consideration for testability",
    ],
    "produces a design that would require a rewrite for small changes"
  ),
  [EvaluationDimension.ProblemSolving]: rubric(
    [
      "Breaks the problem into a clear approach before coding",
      "Considers brute force then optimizes",
    ],
    "jumps straight to code without a stated approach"
  ),
  [EvaluationDimension.CodeCorrectness]: rubric(
    [
      "Produces working code for the stated approach",
      "Handles edge cases (empty input, single element, duplicates)",
    ],
    "leaves obvious bugs or off-by-one errors unaddressed"
  ),
  [EvaluationDimension.ComplexityAnalysis]: rubric(
    [
      "States time and space complexity accurately",
      "Recognizes when a better complexity is possible",
    ],
    "cannot state or justify the complexity of their own solution"
  ),
  [EvaluationDimension.EdgeCaseHandling]: rubric(
    [
      "Proactively identifies edge cases before being prompted",
      "Adjusts the solution to handle them",
    ],
    "only handles edge cases after being explicitly told to"
  ),
  // Reverse-mode rubrics — evaluating the interviewer's technique
  [EvaluationDimension.RapportBuilding]: rubric(
    [
      "Opens with a clear, welcoming Introduction",
      "Sets expectations for the session",
    ],
    "jumps into technical questions with no framing"
  ),
  [EvaluationDimension.RequirementElicitation]: rubric(
    [
      "Asks open-ended questions to surface functional/non-functional Requirements",
      "Doesn't spoon-feed the answer",
    ],
    "tells the candidate the Requirements instead of drawing them out"
  ),
  [EvaluationDimension.ProbingDepth]: rubric(
    [
      "Follows up on vague or surface-level answers",
      "Pushes for specifics (numbers, tradeoffs, edge cases)",
    ],
    "accepts shallow answers without pushing further"
  ),
  [EvaluationDimension.TechnicalListening]: rubric(
    [
      "Picks up on what the candidate actually said and builds the next question from it",
    ],
    "asks a pre-scripted next question ignoring the candidate's last answer"
  ),
  [EvaluationDimension.ChallengingAppropriately]: rubric(
    [
      "Introduces realistic pressure (scale, failure, edge cases) at the right moments",
    ],
    "never challenges the candidate's design, or challenges too aggressively to be useful"
  ),
  [EvaluationDimension.TimeManagement]: rubric(
    [
      "Keeps the session moving, doesn't get stuck on one topic too long",
    ],
    "lets one phase consume the entire interview"
  ),
  [EvaluationDimension.SummarizingAndWrapUp]: rubric(
    [
      "Closes with a clear summary and gives the candidate a chance to ask questions",
    ],
    "ends abruptly with no wrap-up"
  ),
};



type TemplateSeed = {
  slug: string;
  name: string;
  description: string;
  whiteboardPreset?: string;
  phases: PhaseSeed[];
};

type PhaseSeed = {
  phaseKey: string;
  order: number;
  goals: string[];
  evaluationDimensions: string[];
  targetDurationRatio: number;
  transitionThreshold: number;
  instructions: string;
  showWhiteboard?: boolean;
  reverseEvaluationDimensions?: string[];
};

const templates: TemplateSeed[] = [
  {
    slug: "hld",
    name: "High Level Design",
    description: "Design scalable distributed systems.",
    whiteboardPreset: "hld",
    phases: [
      {
        phaseKey: PhaseId.Introduction,
        order: 0,
        goals: [Goal.CandidateUnderstandsProblem],
        evaluationDimensions: [EvaluationDimension.Communication],
        targetDurationRatio: 0.05,
        transitionThreshold: 0.7,
        instructions:
          "Introduce the problem briefly. Do not reveal Requirements. Ask the candidate to begin by clarifying the problem. Move forward once the candidate demonstrates that they understand the problem and begins requirement discovery.",
        reverseEvaluationDimensions: [EvaluationDimension.RapportBuilding],
      },
      {
        phaseKey: PhaseId.Requirements,
        order: 1,
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
        instructions:
          "Evaluate requirement gathering. Answer requirement questions when directly asked. Do not volunteer every requirement. Probe missing functional Requirements, non-functional Requirements, scale, and constraints. Do not discuss architecture yet.",
        reverseEvaluationDimensions: [EvaluationDimension.RequirementElicitation, EvaluationDimension.TechnicalListening],
      },
      {
        phaseKey: PhaseId.HighLevelDesign,
        order: 2,
        goals: [
          Goal.CoreComponents,
          Goal.ServiceBoundaries,
          Goal.DataFlow,
          Goal.StorageChoice,
        ],
        evaluationDimensions: [EvaluationDimension.Architecture, EvaluationDimension.TechnicalReasoning],
        targetDurationRatio: 0.25,
        transitionThreshold: 0.75,
        instructions:
          "Ask the candidate to propose a high-level architecture. Evaluate major components, service boundaries, data flow, and storage decisions. Challenge unclear architectural choices. Do not design the system for the candidate.",
        showWhiteboard: true,
        reverseEvaluationDimensions: [EvaluationDimension.TechnicalListening, EvaluationDimension.TimeManagement],
      },
      {
        phaseKey: PhaseId.DeepDive,
        order: 3,
        goals: [
          Goal.CriticalComponent,
          Goal.DataModel,
          Goal.Consistency,
          Goal.TechnicalTradeoffs,
        ],
        evaluationDimensions: [EvaluationDimension.TechnicalDepth, EvaluationDimension.Tradeoffs],
        targetDurationRatio: 0.3,
        transitionThreshold: 0.7,
        instructions:
          "Choose important areas from the candidate's design for deeper discussion. Probe implementation details, data modeling, consistency, and tradeoffs. Prefer areas where the candidate's reasoning is incomplete or weak.",
        showWhiteboard: true,
        reverseEvaluationDimensions: [EvaluationDimension.ProbingDepth, EvaluationDimension.ChallengingAppropriately],
      },
      {
        phaseKey: PhaseId.Scalability,
        order: 4,
        goals: [
          Goal.Bottlenecks,
          Goal.FailureModes,
          Goal.ScalingStrategy,
          Goal.Reliability,
        ],
        evaluationDimensions: [EvaluationDimension.Scalability, EvaluationDimension.Reliability],
        targetDurationRatio: 0.2,
        transitionThreshold: 0.7,
        instructions:
          "Probe scalability and reliability. Ask about bottlenecks, failure scenarios, capacity pressure, and scaling strategies. Challenge assumptions using realistic production scenarios.",
        showWhiteboard: true,
        reverseEvaluationDimensions: [EvaluationDimension.ChallengingAppropriately, EvaluationDimension.ProbingDepth],
      },
      {
        phaseKey: PhaseId.Closing,
        order: 5,
        goals: [Goal.FinalTradeoffSummary],
        evaluationDimensions: [EvaluationDimension.Communication, EvaluationDimension.Tradeoffs],
        targetDurationRatio: 0.05,
        transitionThreshold: 1,
        instructions:
          "Conclude the interview naturally. Ask the candidate to summarize their design and the most important tradeoffs. Do not begin another technical phase.",
        reverseEvaluationDimensions: [EvaluationDimension.SummarizingAndWrapUp],
      },
    ],
  },
  {
    slug: "lld",
    name: "Low Level Design",
    description: "Object-oriented design and patterns.",
    whiteboardPreset: "lld",
    phases: [
      {
        phaseKey: PhaseId.Introduction,
        order: 0,
        goals: [Goal.CandidateUnderstandsProblem],
        evaluationDimensions: [EvaluationDimension.Communication],
        targetDurationRatio: 0.05,
        transitionThreshold: 0.7,
        instructions:
          "Introduce the object-oriented design problem. Ask the candidate to clarify the expected behaviour and scope.",
        reverseEvaluationDimensions: [EvaluationDimension.RapportBuilding],
      },
      {
        phaseKey: PhaseId.Requirements,
        order: 1,
        goals: [Goal.LLD_UseCases, Goal.Actors, Goal.Constraints, Goal.EdgeCases],
        evaluationDimensions: [EvaluationDimension.RequirementClarity, EvaluationDimension.ScopeManagement],
        targetDurationRatio: 0.15,
        transitionThreshold: 0.75,
        instructions:
          "Evaluate whether the candidate identifies important use cases, actors, constraints, and edge cases. Answer clarification questions. Do not propose classes or interfaces.",
        reverseEvaluationDimensions: [EvaluationDimension.RequirementElicitation, EvaluationDimension.TechnicalListening],
      },
      {
        phaseKey: PhaseId.DomainModeling,
        order: 2,
        goals: [Goal.CoreEntities, Goal.Responsibilities, Goal.Relationships],
        evaluationDimensions: [EvaluationDimension.ObjectModeling, EvaluationDimension.Abstraction],
        targetDurationRatio: 0.2,
        transitionThreshold: 0.75,
        instructions:
          "Ask the candidate to identify the core entities. Evaluate responsibilities and relationships. Challenge god objects, unclear ownership, and weak abstractions.",
        showWhiteboard: true,
        reverseEvaluationDimensions: [EvaluationDimension.TechnicalListening, EvaluationDimension.TimeManagement],
      },
      {
        phaseKey: PhaseId.ClassDesign,
        order: 3,
        goals: [
          Goal.Classes,
          Goal.Interfaces,
          Goal.MethodBoundaries,
          Goal.Encapsulation,
        ],
        evaluationDimensions: [EvaluationDimension.ClassDesign, EvaluationDimension.CodeQuality],
        targetDurationRatio: 0.3,
        transitionThreshold: 0.75,
        instructions:
          "Probe concrete class and interface design. Evaluate method boundaries, encapsulation, and separation of concerns. Ask focused questions about design decisions.",
        showWhiteboard: true,
        reverseEvaluationDimensions: [EvaluationDimension.ProbingDepth, EvaluationDimension.ChallengingAppropriately],
      },
      {
        phaseKey: PhaseId.Extensibility,
        order: 4,
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
        instructions:
          "Introduce realistic requirement changes. Evaluate whether the design is extensible and testable. Probe design patterns only when relevant. Do not force pattern usage.",
        showWhiteboard: true,
        reverseEvaluationDimensions: [EvaluationDimension.ChallengingAppropriately, EvaluationDimension.ProbingDepth],
      },
      {
        phaseKey: PhaseId.Closing,
        order: 5,
        goals: [Goal.FinalDesignSummary],
        evaluationDimensions: [EvaluationDimension.Communication],
        targetDurationRatio: 0.05,
        transitionThreshold: 1,
        instructions:
          "Ask the candidate to summarize their final design and major tradeoffs. Conclude the interview naturally.",
        reverseEvaluationDimensions: [EvaluationDimension.SummarizingAndWrapUp],
      },
    ],
  },
  {
    // Proof of extensibility: this entire interview type is new data, zero
    // new code paths, zero new enum values, zero new resolver branches.
    slug: "dsa",
    name: "Data Structures & Algorithms",
    description: "Coding interview focused on problem solving and complexity analysis.",
    phases: [
      {
        phaseKey: PhaseId.Clarification,
        order: 0,
        goals: [Goal.InputConstraints, Goal.EdgeCasesIdentified],
        evaluationDimensions: [EvaluationDimension.Communication, EvaluationDimension.EdgeCaseHandling],
        targetDurationRatio: 0.15,
        transitionThreshold: 0.7,
        instructions:
          "Present the problem statement. Ask the candidate to restate the problem and clarify input size, constraints, and edge cases before coding.",
      },
      {
        phaseKey: PhaseId.Approach,
        order: 1,
        goals: [Goal.BruteForceStated, Goal.OptimizationDirection],
        evaluationDimensions: [EvaluationDimension.ProblemSolving, EvaluationDimension.ComplexityAnalysis],
        targetDurationRatio: 0.2,
        transitionThreshold: 0.7,
        instructions:
          "Ask the candidate to describe their approach and its complexity before writing code. Push for a brute-force baseline if skipped, then an optimization direction.",
      },
      {
        phaseKey: PhaseId.Implementation,
        order: 2,
        goals: [Goal.WorkingCode, Goal.CleanStructure],
        evaluationDimensions: [EvaluationDimension.CodeCorrectness, EvaluationDimension.Communication],
        targetDurationRatio: 0.45,
        transitionThreshold: 0.75,
        instructions:
          "Let the candidate implement their approach. Ask clarifying questions about their code as they write it. Do not write code for them.",
      },
      {
        phaseKey: PhaseId.Testing,
        order: 3,
        goals: [Goal.DryRun, Goal.EdgeCaseVerification],
        evaluationDimensions: [EvaluationDimension.EdgeCaseHandling, EvaluationDimension.CodeCorrectness],
        targetDurationRatio: 0.15,
        transitionThreshold: 0.7,
        instructions:
          "Ask the candidate to dry-run their solution against a normal case and at least one edge case.",
      },
      {
        phaseKey: PhaseId.Closing,
        order: 4,
        goals: [Goal.FinalComplexitySummary],
        evaluationDimensions: [EvaluationDimension.ComplexityAnalysis],
        targetDurationRatio: 0.05,
        transitionThreshold: 1,
        instructions:
          "Ask the candidate to state the final time and space complexity of their solution. Conclude the interview naturally.",
      },
    ],
  },
  {
    slug: "pr_review",
    name: "PR Review",
    description: "Review a pull request with focus on code quality, design patterns, and maintainability.",
    phases: [
      {
        phaseKey: PhaseId.Introduction,
        order: 0,
        goals: [Goal.CandidateUnderstandsPrContext],
        evaluationDimensions: [EvaluationDimension.Communication],
        targetDurationRatio: 0.05,
        transitionThreshold: 0.7,
        instructions:
          "Introduce the PR context briefly. Ask the candidate to begin by understanding the purpose and scope of the changes.",
        reverseEvaluationDimensions: [EvaluationDimension.RapportBuilding],
      },
      {
        phaseKey: PhaseId.ContextUnderstanding,
        order: 1,
        goals: [Goal.PrPurpose, Goal.AffectedAreas, Goal.PR_Dependencies],
        evaluationDimensions: [EvaluationDimension.RequirementClarity, EvaluationDimension.Communication],
        targetDurationRatio: 0.15,
        transitionThreshold: 0.75,
        instructions:
          "Evaluate whether the candidate understands the PR's purpose, affected areas, and dependencies. Answer clarification questions about the codebase context.",
        reverseEvaluationDimensions: [EvaluationDimension.RequirementElicitation, EvaluationDimension.TechnicalListening],
      },
      {
        phaseKey: PhaseId.CodeReview,
        order: 2,
        goals: [Goal.Correctness, Goal.CodeQuality, Goal.DesignPatterns],
        evaluationDimensions: [EvaluationDimension.CodeCorrectness, EvaluationDimension.CodeQuality, EvaluationDimension.DesignPatterns],
        targetDurationRatio: 0.35,
        transitionThreshold: 0.75,
        instructions:
          "Ask the candidate to review the code changes. Evaluate their ability to identify bugs, code quality issues, and design pattern usage. Challenge missed issues.",
        showWhiteboard: true,
        reverseEvaluationDimensions: [EvaluationDimension.ProbingDepth, EvaluationDimension.TechnicalListening],
      },
      {
        phaseKey: PhaseId.DesignReview,
        order: 3,
        goals: [Goal.ArchitectureImpact, Goal.Extensibility, Goal.Maintainability],
        evaluationDimensions: [EvaluationDimension.Architecture, EvaluationDimension.Maintainability, EvaluationDimension.Tradeoffs],
        targetDurationRatio: 0.25,
        transitionThreshold: 0.7,
        instructions:
          "Probe the architectural impact of the changes. Evaluate whether the candidate considers extensibility, maintainability, and design tradeoffs.",
        showWhiteboard: true,
        reverseEvaluationDimensions: [EvaluationDimension.ProbingDepth, EvaluationDimension.ChallengingAppropriately],
      },
      {
        phaseKey: PhaseId.FeedbackDelivery,
        order: 4,
        goals: [Goal.ConstructiveFeedback, Goal.ActionableSuggestions],
        evaluationDimensions: [EvaluationDimension.Communication, EvaluationDimension.Tradeoffs],
        targetDurationRatio: 0.15,
        transitionThreshold: 0.7,
        instructions:
          "Ask the candidate to provide feedback as if they were reviewing this PR. Evaluate the constructiveness and actionability of their feedback.",
        reverseEvaluationDimensions: [EvaluationDimension.TechnicalListening, EvaluationDimension.TimeManagement],
      },
      {
        phaseKey: PhaseId.Closing,
        order: 5,
        goals: [Goal.ReviewSummary],
        evaluationDimensions: [EvaluationDimension.Communication],
        targetDurationRatio: 0.05,
        transitionThreshold: 1,
        instructions:
          "Ask the candidate to summarize their review and the most important issues found. Conclude the interview naturally.",
        reverseEvaluationDimensions: [EvaluationDimension.SummarizingAndWrapUp],
      },
    ],
  },
  {
    slug: "deep_dive",
    name: "Deep Dive",
    description: "Deep technical exploration of a specific system or technology.",
    phases: [
      {
        phaseKey: PhaseId.Introduction,
        order: 0,
        goals: [Goal.CandidateUnderstandsTopic],
        evaluationDimensions: [EvaluationDimension.Communication],
        targetDurationRatio: 0.05,
        transitionThreshold: 0.7,
        instructions:
          "Introduce the deep dive topic. Ask the candidate to begin by explaining their understanding of the system or technology.",
        reverseEvaluationDimensions: [EvaluationDimension.RapportBuilding],
      },
      {
        phaseKey: PhaseId.KnowledgeAssessment,
        order: 1,
        goals: [Goal.CoreConcepts, Goal.Internals, Goal.DeepDive_UseCases],
        evaluationDimensions: [EvaluationDimension.TechnicalDepth, EvaluationDimension.TechnicalReasoning],
        targetDurationRatio: 0.2,
        transitionThreshold: 0.75,
        instructions:
          "Assess the candidate's depth of knowledge. Probe core concepts, internal workings, and practical use cases. Challenge superficial answers.",
        reverseEvaluationDimensions: [EvaluationDimension.ProbingDepth, EvaluationDimension.TechnicalListening],
      },
      {
        phaseKey: PhaseId.ArchitectureExploration,
        order: 2,
        goals: [Goal.SystemComponents, Goal.DataFlow, Goal.DesignDecisions],
        evaluationDimensions: [EvaluationDimension.Architecture, EvaluationDimension.TechnicalReasoning],
        targetDurationRatio: 0.25,
        transitionThreshold: 0.75,
        instructions:
          "Explore the architecture and design decisions. Evaluate understanding of component interactions, data flow, and key design choices.",
        showWhiteboard: true,
        reverseEvaluationDimensions: [EvaluationDimension.TechnicalListening, EvaluationDimension.ChallengingAppropriately],
      },
      {
        phaseKey: PhaseId.ImplementationDetails,
        order: 3,
        goals: [Goal.ImplementationApproach, Goal.PerformanceConsiderations, Goal.EdgeCases],
        evaluationDimensions: [EvaluationDimension.TechnicalDepth, EvaluationDimension.Tradeoffs],
        targetDurationRatio: 0.3,
        transitionThreshold: 0.7,
        instructions:
          "Dive into implementation details. Probe performance considerations, edge cases, and practical implementation challenges.",
        showWhiteboard: true,
        reverseEvaluationDimensions: [EvaluationDimension.ProbingDepth, EvaluationDimension.ChallengingAppropriately],
      },
      {
        phaseKey: PhaseId.ScalabilityReliability,
        order: 4,
        goals: [Goal.ScalingChallenges, Goal.DeepDive_FailureModes, Goal.OperationalConsiderations],
        evaluationDimensions: [EvaluationDimension.Scalability, EvaluationDimension.Reliability],
        targetDurationRatio: 0.15,
        transitionThreshold: 0.7,
        instructions:
          "Discuss scalability and reliability aspects. Ask about scaling challenges, failure modes, and operational considerations.",
        reverseEvaluationDimensions: [EvaluationDimension.ChallengingAppropriately, EvaluationDimension.ProbingDepth],
      },
      {
        phaseKey: PhaseId.Closing,
        order: 5,
        goals: [Goal.TopicSummary, Goal.KeyTakeaways],
        evaluationDimensions: [EvaluationDimension.Communication],
        targetDurationRatio: 0.05,
        transitionThreshold: 1,
        instructions:
          "Ask the candidate to summarize the key takeaways from the deep dive. Conclude the interview naturally.",
        reverseEvaluationDimensions: [EvaluationDimension.SummarizingAndWrapUp],
      },
    ],
  },
  {
    slug: "tech_doc_review",
    name: "Tech Doc Review",
    description: "Review technical documentation with focus on clarity, completeness, and accuracy.",
    phases: [
      {
        phaseKey: PhaseId.Introduction,
        order: 0,
        goals: [Goal.CandidateUnderstandsDocContext],
        evaluationDimensions: [EvaluationDimension.Communication],
        targetDurationRatio: 0.05,
        transitionThreshold: 0.7,
        instructions:
          "Introduce the technical document briefly. Ask the candidate to begin by understanding the purpose and audience of the documentation.",
        reverseEvaluationDimensions: [EvaluationDimension.RapportBuilding],
      },
      {
        phaseKey: PhaseId.ContextUnderstanding,
        order: 1,
        goals: [Goal.DocPurpose, Goal.TargetAudience, Goal.DocScope],
        evaluationDimensions: [EvaluationDimension.RequirementClarity, EvaluationDimension.Communication],
        targetDurationRatio: 0.15,
        transitionThreshold: 0.75,
        instructions:
          "Evaluate whether the candidate understands the document's purpose, target audience, and scope. Answer clarification questions about the technical context.",
        reverseEvaluationDimensions: [EvaluationDimension.RequirementElicitation, EvaluationDimension.TechnicalListening],
      },
      {
        phaseKey: PhaseId.StructureReview,
        order: 2,
        goals: [Goal.Organization, Goal.Flow, Goal.Navigation],
        evaluationDimensions: [EvaluationDimension.Architecture, EvaluationDimension.TechnicalReasoning],
        targetDurationRatio: 0.2,
        transitionThreshold: 0.75,
        instructions:
          "Ask the candidate to review the document structure. Evaluate organization, logical flow, and ease of navigation. Challenge structural issues.",
        showWhiteboard: true,
        reverseEvaluationDimensions: [EvaluationDimension.TechnicalListening, EvaluationDimension.TimeManagement],
      },
      {
        phaseKey: PhaseId.ContentReview,
        order: 3,
        goals: [Goal.Clarity, Goal.Completeness, Goal.Accuracy],
        evaluationDimensions: [EvaluationDimension.TechnicalDepth, EvaluationDimension.Communication],
        targetDurationRatio: 0.35,
        transitionThreshold: 0.7,
        instructions:
          "Dive into content review. Evaluate clarity, completeness, and accuracy of technical information. Probe missing sections, unclear explanations, and potential errors.",
        showWhiteboard: true,
        reverseEvaluationDimensions: [EvaluationDimension.ProbingDepth, EvaluationDimension.ChallengingAppropriately],
      },
      {
        phaseKey: PhaseId.ImprovementSuggestions,
        order: 4,
        goals: [Goal.ActionableFeedback, Goal.PriorityRanking],
        evaluationDimensions: [EvaluationDimension.Tradeoffs, EvaluationDimension.Communication],
        targetDurationRatio: 0.2,
        transitionThreshold: 0.7,
        instructions:
          "Ask the candidate to provide improvement suggestions with priorities. Evaluate the actionability and impact of their recommendations.",
        reverseEvaluationDimensions: [EvaluationDimension.TechnicalListening, EvaluationDimension.TimeManagement],
      },
      {
        phaseKey: PhaseId.Closing,
        order: 5,
        goals: [Goal.ReviewSummary, Goal.KeyImprovements],
        evaluationDimensions: [EvaluationDimension.Communication],
        targetDurationRatio: 0.05,
        transitionThreshold: 1,
        instructions:
          "Ask the candidate to summarize their review and the most important improvements. Conclude the interview naturally.",
        reverseEvaluationDimensions: [EvaluationDimension.SummarizingAndWrapUp],
      },
    ],
  },
  {
    slug: "task_breakdown",
    name: "Task Breakdown",
    description: "Break down a large task into small, independent, executable subtasks.",
    phases: [
      {
        phaseKey: PhaseId.Introduction,
        order: 0,
        goals: [Goal.CandidateUnderstandsTask],
        evaluationDimensions: [EvaluationDimension.Communication],
        targetDurationRatio: 0.05,
        transitionThreshold: 0.7,
        instructions:
          "Introduce the large task briefly. Ask the candidate to begin by understanding the Requirements and constraints.",
        reverseEvaluationDimensions: [EvaluationDimension.RapportBuilding],
      },
      {
        phaseKey: PhaseId.RequirementAnalysis,
        order: 1,
        goals: [Goal.Task_FunctionalRequirements, Goal.Task_Constraints, Goal.SuccessCriteria],
        evaluationDimensions: [EvaluationDimension.RequirementClarity, EvaluationDimension.ScopeManagement],
        targetDurationRatio: 0.15,
        transitionThreshold: 0.75,
        instructions:
          "Evaluate requirement gathering. Probe functional Requirements, constraints, and success criteria. Ensure scope is well-defined.",
        reverseEvaluationDimensions: [EvaluationDimension.RequirementElicitation, EvaluationDimension.TechnicalListening],
      },
      {
        phaseKey: PhaseId.DependencyAnalysis,
        order: 2,
        goals: [Goal.Dependencies, Goal.BlockingTasks, Goal.ParallelOpportunities],
        evaluationDimensions: [EvaluationDimension.Architecture, EvaluationDimension.TechnicalReasoning],
        targetDurationRatio: 0.2,
        transitionThreshold: 0.75,
        instructions:
          "Ask the candidate to analyze dependencies. Evaluate identification of blocking tasks and opportunities for parallel execution.",
        showWhiteboard: true,
        reverseEvaluationDimensions: [EvaluationDimension.TechnicalListening, EvaluationDimension.TimeManagement],
      },
      {
        phaseKey: PhaseId.TaskDecomposition,
        order: 3,
        goals: [Goal.SubtaskDefinition, Goal.Independence, Goal.Estimation],
        evaluationDimensions: [EvaluationDimension.TechnicalDepth, EvaluationDimension.ProblemSolving],
        targetDurationRatio: 0.35,
        transitionThreshold: 0.7,
        instructions:
          "Dive into task decomposition. Evaluate whether subtasks are small, independent, and properly estimated. Challenge overly large or dependent tasks.",
        showWhiteboard: true,
        reverseEvaluationDimensions: [EvaluationDimension.ProbingDepth, EvaluationDimension.ChallengingAppropriately],
      },
      {
        phaseKey: PhaseId.ExecutionPlanning,
        order: 4,
        goals: [Goal.Sequencing, Goal.RiskMitigation, Goal.ResourceAllocation],
        evaluationDimensions: [EvaluationDimension.Tradeoffs, EvaluationDimension.TechnicalReasoning],
        targetDurationRatio: 0.2,
        transitionThreshold: 0.7,
        instructions:
          "Discuss execution planning. Evaluate task sequencing, risk mitigation strategies, and resource allocation decisions.",
        reverseEvaluationDimensions: [EvaluationDimension.ChallengingAppropriately, EvaluationDimension.ProbingDepth],
      },
      {
        phaseKey: PhaseId.Closing,
        order: 5,
        goals: [Goal.BreakdownSummary, Goal.CriticalPath],
        evaluationDimensions: [EvaluationDimension.Communication],
        targetDurationRatio: 0.05,
        transitionThreshold: 1,
        instructions:
          "Ask the candidate to summarize their breakdown and identify the critical path. Conclude the interview naturally.",
        reverseEvaluationDimensions: [EvaluationDimension.SummarizingAndWrapUp],
      },
    ],
  },
];
