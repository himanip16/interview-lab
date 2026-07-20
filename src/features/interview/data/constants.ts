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
  ScalabilityReliability: "scalability_reliability",

  StructureReview: "structure_review",
  ContentReview: "content_review",
  ImprovementSuggestions: "improvement_suggestions",

  RequirementAnalysis: "requirement_analysis",
  DependencyAnalysis: "dependency_analysis",
  TaskDecomposition: "task_decomposition",
  ExecutionPlanning: "execution_planning",
} as const;

export type PhaseId = (typeof PhaseId)[keyof typeof PhaseId];

// ---------------------------------------------------------------------------
// Goals
// ---------------------------------------------------------------------------

export const Goal = {
  // Common goals
  CandidateUnderstandsProblem: "candidate_understands_problem",
  
  // HLD goals
  FunctionalRequirements: "functional_Requirements",
  NonFunctionalRequirements: "non_functional_Requirements",
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
  LLD_UseCases: "use_cases",
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
  PR_Dependencies: "dependencies",
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
  DeepDive_UseCases: "use_cases",
  SystemComponents: "system_components",
  DeepDive_DataFlow: "data_flow",
  DesignDecisions: "design_decisions",
  ImplementationApproach: "implementation_approach",
  PerformanceConsiderations: "performance_considerations",
  ScalingChallenges: "scaling_challenges",
  DeepDive_FailureModes: "failure_modes",
  OperationalConsiderations: "operational_considerations",
  TopicSummary: "topic_summary",
  KeyTakeaways: "key_takeaways",
  
  // Tech Doc Review goals
  CandidateUnderstandsDocContext: "candidate_understands_doc_context",
  DocPurpose: "doc_purpose",
  TargetAudience: "target_audience",
  DocScope: "scope",
  Organization: "organization",
  Flow: "flow",
  Navigation: "navigation",
  Clarity: "clarity",
  Completeness: "completeness",
  Accuracy: "accuracy",
  ActionableFeedback: "actionable_feedback",
  PriorityRanking: "priority_ranking",
  KeyImprovements: "key_improvements",
  
  // Task Breakdown goals
  CandidateUnderstandsTask: "candidate_understands_task",
  Task_FunctionalRequirements: "functional_Requirements",
  Task_Constraints: "constraints",
  SuccessCriteria: "success_criteria",
  Dependencies: "dependencies",
  BlockingTasks: "blocking_tasks",
  ParallelOpportunities: "parallel_opportunities",
  SubtaskDefinition: "subtask_definition",
  Independence: "independence",
  Estimation: "estimation",
  Sequencing: "sequencing",
  RiskMitigation: "risk_mitigation",
  ResourceAllocation: "resource_allocation",
  BreakdownSummary: "breakdown_summary",
  CriticalPath: "critical_path",
} as const;

export type Goal = (typeof Goal)[keyof typeof Goal];

// ---------------------------------------------------------------------------
// Helper function for creating goal definitions
// ---------------------------------------------------------------------------

export function goal(
  id: Goal,
  required: boolean = true,
  weight: number = 1.0
): { id: Goal; required: boolean; weight: number } {
  return { id, required, weight };
}
