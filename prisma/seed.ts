import {
  Difficulty,
  Prisma,
  PrismaClient,
  ProblemCategory,
} from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Problems (unchanged)
// ---------------------------------------------------------------------------

const problems = [
  {
    slug: "url-shortener",
    title: "Design a URL Shortener",
    description: "Design a scalable URL shortening service like TinyURL.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.MEDIUM,
  },
  {
    slug: "rate-limiter",
    title: "Design a Rate Limiter",
    description: "Design a distributed rate limiting system.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.MEDIUM,
  },
  {
    slug: "news-feed",
    title: "Design a News Feed",
    description: "Design a scalable social media news feed.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
  },
  {
    slug: "chat-system",
    title: "Design a Chat System",
    description: "Design a real-time messaging platform.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
  },
  {
    slug: "file-storage",
    title: "Design File Storage",
    description: "Design a distributed cloud file storage system.",
    category: ProblemCategory.DISTRIBUTED_SYSTEMS,
    difficulty: Difficulty.HARD,
  },
  {
    slug: "design-uber",
    title: "Design Uber",
    description: "Design a large-scale ride sharing platform.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
  },
  {
    slug: "design-youtube",
    title: "Design YouTube",
    description: "Design a global video streaming platform.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
  },
];

// ---------------------------------------------------------------------------
// Rubric helper — mirrors the format of the original data/rubrics/*.md files
// ---------------------------------------------------------------------------

function rubric(criteria: string[], deductFor: string): string {
  return `
Score from 0-10.

Give points for:

${criteria.map((c) => `- ${c}`).join("\n")}

Deduct points if the candidate ${deductFor}.

Return reasoning.
`.trim();
}

const RUBRICS: Record<string, string> = {
  communication: rubric(
    [
      "Explains reasoning out loud before committing to decisions",
      "Structures the conversation (states assumptions, checks in, summarizes)",
      "Responds directly to interviewer questions instead of deflecting",
      "Uses precise technical vocabulary",
    ],
    "is silent for long stretches or jumps to conclusions without narrating why"
  ),
  requirement_clarity: rubric(
    [
      "Distinguishes functional vs non-functional requirements",
      "Asks about scale, latency, and consistency expectations",
      "Confirms scope before designing",
    ],
    "starts designing before requirements are clarified"
  ),
  scope_management: rubric(
    [
      "Keeps requirement gathering time-boxed and focused",
      "Avoids over-scoping into unrelated features",
    ],
    "spends excessive time on requirements or scope-creeps the problem"
  ),
  architecture: rubric(
    [
      "Identifies the right core components and service boundaries",
      "Justifies storage/database choices",
      "Describes data flow between components clearly",
    ],
    "proposes an architecture without justifying key decisions"
  ),
  technical_reasoning: rubric(
    [
      "Backs design choices with concrete reasoning, not buzzwords",
      "Considers more than one option before choosing",
    ],
    "name-drops technologies without explaining why they fit"
  ),
  technical_depth: rubric(
    [
      "Goes beyond the surface level when probed on a component",
      "Handles follow-up questions about internals confidently",
    ],
    "gives shallow answers when pushed for detail"
  ),
  tradeoffs: rubric(
    [
      "Explicitly names tradeoffs (e.g. consistency vs availability, latency vs cost)",
      "Justifies a choice given the stated requirements",
    ],
    "presents a design as if it has no downsides"
  ),
  scalability: rubric(
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
  reliability: rubric(
    [
      "Identifies single points of failure",
      "Discusses retries, timeouts, and graceful degradation",
      "Considers monitoring/alerting",
    ],
    "assumes components never fail"
  ),
  object_modeling: rubric(
    [
      "Identifies the right core entities and their responsibilities",
      "Models relationships (composition vs association vs inheritance) correctly",
    ],
    "produces a single god object or unclear ownership"
  ),
  abstraction: rubric(
    [
      "Hides implementation details behind clean interfaces",
      "Avoids leaking internal state",
    ],
    "exposes internal implementation details unnecessarily"
  ),
  class_design: rubric(
    [
      "Defines clear method boundaries",
      "Applies encapsulation appropriately",
      "Separates concerns between classes",
    ],
    "produces classes with unclear or overlapping responsibilities"
  ),
  code_quality: rubric(
    ["Names things clearly", "Keeps methods small and focused"],
    "writes code that is hard to follow or overly clever"
  ),
  design_patterns: rubric(
    [
      "Applies a design pattern where it genuinely fits",
      "Explains why the pattern was chosen",
    ],
    "forces a pattern where it doesn't fit, or can't explain the choice"
  ),
  maintainability: rubric(
    [
      "Design accommodates realistic future requirement changes",
      "Includes consideration for testability",
    ],
    "produces a design that would require a rewrite for small changes"
  ),
  problem_solving: rubric(
    [
      "Breaks the problem into a clear approach before coding",
      "Considers brute force then optimizes",
    ],
    "jumps straight to code without a stated approach"
  ),
  code_correctness: rubric(
    [
      "Produces working code for the stated approach",
      "Handles edge cases (empty input, single element, duplicates)",
    ],
    "leaves obvious bugs or off-by-one errors unaddressed"
  ),
  complexity_analysis: rubric(
    [
      "States time and space complexity accurately",
      "Recognizes when a better complexity is possible",
    ],
    "cannot state or justify the complexity of their own solution"
  ),
  edge_case_handling: rubric(
    [
      "Proactively identifies edge cases before being prompted",
      "Adjusts the solution to handle them",
    ],
    "only handles edge cases after being explicitly told to"
  ),
};

// ---------------------------------------------------------------------------
// Interview templates — this is the part that used to be hardcoded across
// the InterviewType enum, InterviewProfileResolver, HLDInterviewProfile.ts and
// LLDInterviewProfile.ts. Adding "DSA" below is the entire cost of adding a
// new interview type now.
// ---------------------------------------------------------------------------

type PhaseSeed = {
  phaseKey: string;
  order: number;
  goals: string[];
  evaluationDimensions: string[];
  targetDurationRatio: number;
  transitionThreshold: number;
  instructions: string;
};

type TemplateSeed = {
  slug: string;
  name: string;
  description: string;
  phases: PhaseSeed[];
};

const templates: TemplateSeed[] = [
  {
    slug: "hld",
    name: "High Level Design",
    description: "Design scalable distributed systems.",
    phases: [
      {
        phaseKey: "introduction",
        order: 0,
        goals: ["candidate_understands_problem"],
        evaluationDimensions: ["communication"],
        targetDurationRatio: 0.05,
        transitionThreshold: 0.7,
        instructions:
          "Introduce the problem briefly. Do not reveal requirements. Ask the candidate to begin by clarifying the problem. Move forward once the candidate demonstrates that they understand the problem and begins requirement discovery.",
      },
      {
        phaseKey: "requirements",
        order: 1,
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
        instructions:
          "Evaluate requirement gathering. Answer requirement questions when directly asked. Do not volunteer every requirement. Probe missing functional requirements, non-functional requirements, scale, and constraints. Do not discuss architecture yet.",
      },
      {
        phaseKey: "high_level_design",
        order: 2,
        goals: [
          "core_components",
          "service_boundaries",
          "data_flow",
          "storage_choice",
        ],
        evaluationDimensions: ["architecture", "technical_reasoning"],
        targetDurationRatio: 0.25,
        transitionThreshold: 0.75,
        instructions:
          "Ask the candidate to propose a high-level architecture. Evaluate major components, service boundaries, data flow, and storage decisions. Challenge unclear architectural choices. Do not design the system for the candidate.",
      },
      {
        phaseKey: "deep_dive",
        order: 3,
        goals: [
          "critical_component",
          "data_model",
          "consistency",
          "technical_tradeoffs",
        ],
        evaluationDimensions: ["technical_depth", "tradeoffs"],
        targetDurationRatio: 0.3,
        transitionThreshold: 0.7,
        instructions:
          "Choose important areas from the candidate's design for deeper discussion. Probe implementation details, data modeling, consistency, and tradeoffs. Prefer areas where the candidate's reasoning is incomplete or weak.",
      },
      {
        phaseKey: "scalability",
        order: 4,
        goals: [
          "bottlenecks",
          "failure_modes",
          "scaling_strategy",
          "reliability",
        ],
        evaluationDimensions: ["scalability", "reliability"],
        targetDurationRatio: 0.2,
        transitionThreshold: 0.7,
        instructions:
          "Probe scalability and reliability. Ask about bottlenecks, failure scenarios, capacity pressure, and scaling strategies. Challenge assumptions using realistic production scenarios.",
      },
      {
        phaseKey: "closing",
        order: 5,
        goals: ["final_tradeoff_summary"],
        evaluationDimensions: ["communication", "tradeoffs"],
        targetDurationRatio: 0.05,
        transitionThreshold: 1,
        instructions:
          "Conclude the interview naturally. Ask the candidate to summarize their design and the most important tradeoffs. Do not begin another technical phase.",
      },
    ],
  },
  {
    slug: "lld",
    name: "Low Level Design",
    description: "Object-oriented design and patterns.",
    phases: [
      {
        phaseKey: "introduction",
        order: 0,
        goals: ["candidate_understands_problem"],
        evaluationDimensions: ["communication"],
        targetDurationRatio: 0.05,
        transitionThreshold: 0.7,
        instructions:
          "Introduce the object-oriented design problem. Ask the candidate to clarify the expected behaviour and scope.",
      },
      {
        phaseKey: "requirements",
        order: 1,
        goals: ["use_cases", "actors", "constraints", "edge_cases"],
        evaluationDimensions: ["requirement_clarity", "scope_management"],
        targetDurationRatio: 0.15,
        transitionThreshold: 0.75,
        instructions:
          "Evaluate whether the candidate identifies important use cases, actors, constraints, and edge cases. Answer clarification questions. Do not propose classes or interfaces.",
      },
      {
        phaseKey: "domain_modeling",
        order: 2,
        goals: ["core_entities", "responsibilities", "relationships"],
        evaluationDimensions: ["object_modeling", "abstraction"],
        targetDurationRatio: 0.2,
        transitionThreshold: 0.75,
        instructions:
          "Ask the candidate to identify the core entities. Evaluate responsibilities and relationships. Challenge god objects, unclear ownership, and weak abstractions.",
      },
      {
        phaseKey: "class_design",
        order: 3,
        goals: [
          "classes",
          "interfaces",
          "method_boundaries",
          "encapsulation",
        ],
        evaluationDimensions: ["class_design", "code_quality"],
        targetDurationRatio: 0.3,
        transitionThreshold: 0.75,
        instructions:
          "Probe concrete class and interface design. Evaluate method boundaries, encapsulation, and separation of concerns. Ask focused questions about design decisions.",
      },
      {
        phaseKey: "extensibility",
        order: 4,
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
        instructions:
          "Introduce realistic requirement changes. Evaluate whether the design is extensible and testable. Probe design patterns only when relevant. Do not force pattern usage.",
      },
      {
        phaseKey: "closing",
        order: 5,
        goals: ["final_design_summary"],
        evaluationDimensions: ["communication"],
        targetDurationRatio: 0.05,
        transitionThreshold: 1,
        instructions:
          "Ask the candidate to summarize their final design and major tradeoffs. Conclude the interview naturally.",
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
        phaseKey: "clarification",
        order: 0,
        goals: ["input_constraints", "edge_cases_identified"],
        evaluationDimensions: ["communication", "edge_case_handling"],
        targetDurationRatio: 0.15,
        transitionThreshold: 0.7,
        instructions:
          "Present the problem statement. Ask the candidate to restate the problem and clarify input size, constraints, and edge cases before coding.",
      },
      {
        phaseKey: "approach",
        order: 1,
        goals: ["brute_force_stated", "optimization_direction"],
        evaluationDimensions: ["problem_solving", "complexity_analysis"],
        targetDurationRatio: 0.2,
        transitionThreshold: 0.7,
        instructions:
          "Ask the candidate to describe their approach and its complexity before writing code. Push for a brute-force baseline if skipped, then an optimization direction.",
      },
      {
        phaseKey: "implementation",
        order: 2,
        goals: ["working_code", "clean_structure"],
        evaluationDimensions: ["code_correctness", "communication"],
        targetDurationRatio: 0.45,
        transitionThreshold: 0.75,
        instructions:
          "Let the candidate implement their approach. Ask clarifying questions about their code as they write it. Do not write code for them.",
      },
      {
        phaseKey: "testing",
        order: 3,
        goals: ["dry_run", "edge_case_verification"],
        evaluationDimensions: ["edge_case_handling", "code_correctness"],
        targetDurationRatio: 0.15,
        transitionThreshold: 0.7,
        instructions:
          "Ask the candidate to dry-run their solution against a normal case and at least one edge case.",
      },
      {
        phaseKey: "closing",
        order: 4,
        goals: ["final_complexity_summary"],
        evaluationDimensions: ["complexity_analysis"],
        targetDurationRatio: 0.05,
        transitionThreshold: 1,
        instructions:
          "Ask the candidate to state the final time and space complexity of their solution. Conclude the interview naturally.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Concept taxonomy. This is the vocabulary EvidenceEvaluator tags evidence
// against — deliberately small to start. Expand as real transcripts surface
// concepts that don't fit anywhere yet; don't try to pre-populate a complete
// taxonomy up front.
// ---------------------------------------------------------------------------

type ConceptSeed = {
  slug: string;
  name: string;
  category: string;
  description?: string;
};

const concepts: ConceptSeed[] = [
  { slug: "horizontal-scaling", name: "Horizontal Scaling", category: "scalability" },
  { slug: "load-balancing", name: "Load Balancing", category: "scalability" },
  { slug: "caching-strategy", name: "Caching Strategy", category: "scalability" },
  { slug: "database-sharding", name: "Database Sharding", category: "scalability" },
  { slug: "cdn", name: "CDN", category: "scalability" },
  { slug: "consistent-hashing", name: "Consistent Hashing", category: "distributed_systems" },
  { slug: "cap-theorem", name: "CAP Theorem Tradeoffs", category: "distributed_systems" },
  { slug: "message-queues", name: "Message Queues", category: "distributed_systems" },
  { slug: "data-consistency", name: "Data Consistency Models", category: "distributed_systems" },
  { slug: "rate-limiting-algorithms", name: "Rate Limiting Algorithms", category: "backend" },
  { slug: "api-design", name: "API Design", category: "backend" },
  { slug: "database-indexing", name: "Database Indexing", category: "databases" },
  { slug: "object-modeling", name: "Object Modeling", category: "lld" },
  { slug: "design-patterns", name: "Design Patterns", category: "lld" },
  { slug: "encapsulation", name: "Encapsulation", category: "lld" },
  { slug: "complexity-analysis", name: "Time/Space Complexity", category: "dsa" },
  { slug: "edge-case-handling", name: "Edge Case Handling", category: "dsa" },
];

// problemSlug -> [{ conceptSlug, weight }]. Weight = how central the concept
// is to that problem. Only a starter set is mapped — expand per problem as
// you go rather than guessing weights for problems you haven't seeded evidence for.
const problemConcepts: Record<string, { conceptSlug: string; weight: number }[]> = {
  "url-shortener": [
    { conceptSlug: "database-sharding", weight: 0.9 },
    { conceptSlug: "caching-strategy", weight: 0.8 },
    { conceptSlug: "api-design", weight: 0.6 },
  ],
  "rate-limiter": [
    { conceptSlug: "rate-limiting-algorithms", weight: 1.0 },
    { conceptSlug: "consistent-hashing", weight: 0.5 },
  ],
  "news-feed": [
    { conceptSlug: "caching-strategy", weight: 0.9 },
    { conceptSlug: "message-queues", weight: 0.7 },
    { conceptSlug: "database-sharding", weight: 0.6 },
  ],
  "chat-system": [
    { conceptSlug: "message-queues", weight: 0.9 },
    { conceptSlug: "data-consistency", weight: 0.7 },
    { conceptSlug: "horizontal-scaling", weight: 0.6 },
  ],
  "file-storage": [
    { conceptSlug: "database-sharding", weight: 0.7 },
    { conceptSlug: "cdn", weight: 0.8 },
    { conceptSlug: "data-consistency", weight: 0.6 },
  ],
  "design-uber": [
    { conceptSlug: "consistent-hashing", weight: 0.8 },
    { conceptSlug: "data-consistency", weight: 0.7 },
    { conceptSlug: "load-balancing", weight: 0.6 },
  ],
  "design-youtube": [
    { conceptSlug: "cdn", weight: 0.9 },
    { conceptSlug: "database-sharding", weight: 0.7 },
    { conceptSlug: "caching-strategy", weight: 0.6 },
  ],
};

async function seedConcepts() {
  const savedBySlug = new Map<string, string>();

  for (const concept of concepts) {
    const saved = await prisma.concept.upsert({
      where: { slug: concept.slug },
      update: {
        name: concept.name,
        category: concept.category,
        description: concept.description,
      },
      create: {
        slug: concept.slug,
        name: concept.name,
        category: concept.category,
        description: concept.description,
      },
    });

    savedBySlug.set(concept.slug, saved.id);
  }

  console.log(`Seeded ${concepts.length} concepts.`);

  return savedBySlug;
}

async function seedProblemConcepts(conceptIdBySlug: Map<string, string>) {
  let count = 0;

  for (const [problemSlug, links] of Object.entries(problemConcepts)) {
    const problem = await prisma.problem.findUnique({
      where: { slug: problemSlug },
    });

    if (!problem) {
      console.warn(`Skipping problem-concept links for unknown problem "${problemSlug}".`);
      continue;
    }

    for (const link of links) {
      const conceptId = conceptIdBySlug.get(link.conceptSlug);

      if (!conceptId) {
        console.warn(`Skipping unknown concept slug "${link.conceptSlug}".`);
        continue;
      }

      await prisma.problemConcept.upsert({
        where: {
          problemId_conceptId: {
            problemId: problem.id,
            conceptId,
          },
        },
        update: { weight: link.weight },
        create: {
          problemId: problem.id,
          conceptId,
          weight: link.weight,
        },
      });

      count++;
    }
  }

  console.log(`Seeded ${count} problem-concept links.`);
}

async function seedTemplates() {
  for (const template of templates) {
    const dimensions = new Set<string>();

    for (const phase of template.phases) {
      for (const dim of phase.evaluationDimensions) {
        dimensions.add(dim);
      }
    }

    const saved = await prisma.interviewTemplate.upsert({
      where: { slug: template.slug },
      update: {
        name: template.name,
        description: template.description,
        isActive: true,
      },
      create: {
        slug: template.slug,
        name: template.name,
        description: template.description,
      },
    });

    for (const phase of template.phases) {
      await prisma.interviewPhaseTemplate.upsert({
        where: {
          templateId_phaseKey: {
            templateId: saved.id,
            phaseKey: phase.phaseKey,
          },
        },
        update: {
          order: phase.order,
          goals: phase.goals as Prisma.InputJsonValue,
          evaluationDimensions:
            phase.evaluationDimensions as Prisma.InputJsonValue,
          targetDurationRatio: phase.targetDurationRatio,
          transitionThreshold: phase.transitionThreshold,
          instructions: phase.instructions,
        },
        create: {
          templateId: saved.id,
          phaseKey: phase.phaseKey,
          order: phase.order,
          goals: phase.goals as Prisma.InputJsonValue,
          evaluationDimensions:
            phase.evaluationDimensions as Prisma.InputJsonValue,
          targetDurationRatio: phase.targetDurationRatio,
          transitionThreshold: phase.transitionThreshold,
          instructions: phase.instructions,
        },
      });
    }

    for (const dimension of dimensions) {
      const content = RUBRICS[dimension];

      if (!content) {
        console.warn(
          `No rubric authored for dimension "${dimension}" (template "${template.slug}") — evaluation will fall back to a generic rubric.`
        );
        continue;
      }

      await prisma.rubricTemplate.upsert({
        where: {
          templateId_dimension: {
            templateId: saved.id,
            dimension,
          },
        },
        update: { content },
        create: {
          templateId: saved.id,
          dimension,
          content,
        },
      });
    }

    console.log(
      `Seeded template "${template.slug}" (${template.phases.length} phases, ${dimensions.size} dimensions).`
    );
  }
}


async function main() {
  for (const problem of problems) {
    await prisma.problem.upsert({
      where: { slug: problem.slug },
      update: problem,
      create: problem,
    });
  }

  console.log(`Seeded ${problems.length} problems.`);

  await seedTemplates();

  const conceptIdBySlug = await seedConcepts();
  await seedProblemConcepts(conceptIdBySlug);
}
main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });