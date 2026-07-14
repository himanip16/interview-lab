// ---------------------------------------------------------------------------
// Evaluation Dimensions
// ---------------------------------------------------------------------------

export const EvaluationDimension = {
  Communication: "communication",
  RequirementClarity: "requirement_clarity",
  ScopeManagement: "scope_management",
  Architecture: "architecture",
  TechnicalReasoning: "technical_reasoning",
  TechnicalDepth: "technical_depth",
  Tradeoffs: "tradeoffs",
  Scalability: "scalability",
  Reliability: "reliability",
  ObjectModeling: "object_modeling",
  Abstraction: "abstraction",
  ClassDesign: "class_design",
  CodeQuality: "code_quality",
  DesignPatterns: "design_patterns",
  Maintainability: "maintainability",
  ProblemSolving: "problem_solving",
  CodeCorrectness: "code_correctness",
  ComplexityAnalysis: "complexity_analysis",
  EdgeCaseHandling: "edge_case_handling",
  // Reverse-mode evaluation dimensions
  RapportBuilding: "rapport_building",
  RequirementElicitation: "requirement_elicitation",
  ProbingDepth: "probing_depth",
  TechnicalListening: "technical_listening",
  ChallengingAppropriately: "challenging_appropriately",
  TimeManagement: "time_management",
  SummarizingAndWrapUp: "summarizing_and_wrap_up",
} as const;

export type EvaluationDimension = (typeof EvaluationDimension)[keyof typeof EvaluationDimension];

// ---------------------------------------------------------------------------
// Phase IDs
// ---------------------------------------------------------------------------

export const PhaseId = {
  Introduction: "introduction",
  Requirements: "requirements",
  HighLevelDesign: "high_level_design",
  DeepDive: "deep_dive",
  Scalability: "scalability",
  Closing: "closing",
  DomainModeling: "domain_modeling",
  ClassDesign: "class_design",
  Extensibility: "extensibility",
  Clarification: "clarification",
  Approach: "approach",
  Implementation: "implementation",
  Testing: "testing",
  ContextUnderstanding: "context_understanding",
  CodeReview: "code_review",
  DesignReview: "design_review",
  FeedbackDelivery: "feedback_delivery",
  KnowledgeAssessment: "knowledge_assessment",
  ArchitectureExploration: "architecture_exploration",
  ImplementationDetails: "implementation_details",
} as const;

export type PhaseId = (typeof PhaseId)[keyof typeof PhaseId];

// ---------------------------------------------------------------------------
// Goals
// ---------------------------------------------------------------------------

export const Goal = {
  // Common goals
  CandidateUnderstandsProblem: "candidate_understands_problem",
  
  // HLD goals
  FunctionalRequirements: "functional_requirements",
  NonFunctionalRequirements: "non_functional_requirements",
  Scale: "scale",
  Constraints: "constraints",
  CoreComponents: "core_components",
  ServiceBoundaries: "service_boundaries",
  DataFlow: "data_flow",
  StorageChoice: "storage_choice",
  CriticalComponent: "critical_component",
  DataModel: "data_model",
  Consistency: "consistency",
  TechnicalTradeoffs: "technical_tradeoffs",
  Bottlenecks: "bottlenecks",
  FailureModes: "failure_modes",
  ScalingStrategy: "scaling_strategy",
  Reliability: "reliability",
  FinalTradeoffSummary: "final_tradeoff_summary",
  
  // LLD goals
  UseCases: "use_cases",
  Actors: "actors",
  EdgeCases: "edge_cases",
  CoreEntities: "core_entities",
  Responsibilities: "responsibilities",
  Relationships: "relationships",
  Classes: "classes",
  Interfaces: "interfaces",
  MethodBoundaries: "method_boundaries",
  Encapsulation: "encapsulation",
  ChangeScenarios: "change_scenarios",
  DesignTradeoffs: "design_tradeoffs",
  Extensibility: "extensibility",
  Testability: "testability",
  FinalDesignSummary: "final_design_summary",
  
  // DSA goals
  InputConstraints: "input_constraints",
  EdgeCasesIdentified: "edge_cases_identified",
  BruteForceStated: "brute_force_stated",
  OptimizationDirection: "optimization_direction",
  WorkingCode: "working_code",
  CleanStructure: "clean_structure",
  DryRun: "dry_run",
  EdgeCaseVerification: "edge_case_verification",
  FinalComplexitySummary: "final_complexity_summary",
  
  // PR Review goals
  CandidateUnderstandsPrContext: "candidate_understands_pr_context",
  PrPurpose: "pr_purpose",
  AffectedAreas: "affected_areas",
  Dependencies: "dependencies",
  Correctness: "correctness",
  CodeQuality: "code_quality",
  DesignPatterns: "design_patterns",
  ArchitectureImpact: "architecture_impact",
  Maintainability: "maintainability",
  ConstructiveFeedback: "constructive_feedback",
  ActionableSuggestions: "actionable_suggestions",
  ReviewSummary: "review_summary",
  
  // Deep Dive goals
  CandidateUnderstandsTopic: "candidate_understands_topic",
  CoreConcepts: "core_concepts",
  Internals: "internals",
  SystemComponents: "system_components",
  ImplementationApproach: "implementation_approach",
  PerformanceConsiderations: "performance_considerations",
} as const;

export type Goal = (typeof Goal)[keyof typeof Goal];
