import {
  Difficulty,
  Prisma,
  PrismaClient,
  ProblemCategory,
  LearningActionType,
} from "@prisma/client";

import { GoalsSchema, EvaluationDimensionsSchema, ConversationSchema, JsonSchema } from "@/shared/schemas/interviewSchemas";
import problemsData from "./seed/problems.json";
import templatesData from "./seed/templates.json";
import { EvaluationDimension } from "@/features/interview/data/constants";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Problems — data now lives in prisma/seed/problems.json
// ---------------------------------------------------------------------------

type ProblemSeed = {
  slug: string;
  title: string;
  description: string;
  category: ProblemCategory;
  difficulty: Difficulty;
  interviewType: string;
  cruxOfProblem?: string;
  estimatedMinutes?: number;
  concepts?: string[];
  tags?: string[];
};

const problems = problemsData as ProblemSeed[];

// ---------------------------------------------------------------------------
// Interview templates — data now lives in prisma/seed/templates.json
// ---------------------------------------------------------------------------

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

type TemplateSeed = {
  slug: string;
  name: string;
  description: string;
  whiteboardPreset?: string;
  phases: PhaseSeed[];
};

const templates = templatesData as TemplateSeed[];

// ---------------------------------------------------------------------------
// Rubric helper — unchanged, still lives here since it's short and code-like
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

// ---------------------------------------------------------------------------
// Concept taxonomy — unchanged
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
      for (const dim of phase.reverseEvaluationDimensions ?? []) {
        dimensions.add(dim);
      }
    }

    const saved = await prisma.interviewTemplate.upsert({
      where: { slug: template.slug },
      update: {
        name: template.name,
        description: template.description,
        isActive: true,
        whiteboardPreset: template.whiteboardPreset,
      },
      create: {
        slug: template.slug,
        name: template.name,
        description: template.description,
        whiteboardPreset: template.whiteboardPreset,
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
          goals: GoalsSchema.parse(phase.goals),
          evaluationDimensions: EvaluationDimensionsSchema.parse(phase.evaluationDimensions),
          targetDurationRatio: phase.targetDurationRatio,
          transitionThreshold: phase.transitionThreshold,
          instructions: phase.instructions,
          showWhiteboard: phase.showWhiteboard,
          reverseEvaluationDimensions: EvaluationDimensionsSchema.parse(
            phase.reverseEvaluationDimensions ?? []
          ),
        },
        create: {
          templateId: saved.id,
          phaseKey: phase.phaseKey,
          order: phase.order,
          goals: GoalsSchema.parse(phase.goals),
          evaluationDimensions: EvaluationDimensionsSchema.parse(phase.evaluationDimensions),
          targetDurationRatio: phase.targetDurationRatio,
          transitionThreshold: phase.transitionThreshold,
          instructions: phase.instructions,
          showWhiteboard: phase.showWhiteboard,
          reverseEvaluationDimensions: EvaluationDimensionsSchema.parse(
            phase.reverseEvaluationDimensions ?? []
          ),
        },
      });
    }

    for (const dimension of dimensions) {
      const content = RUBRICS[dimension as EvaluationDimension];

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

// ---------------------------------------------------------------------------
// Learning scenarios — unchanged
// ---------------------------------------------------------------------------

type SegmentSeed = {
  order: number;
  conversation: { role: "interviewer" | "candidate"; content: string }[];
  takeaway?: string;
  conceptSlugs: string[];
  actions: {
    type: LearningActionType;
    title: string;
    instructions?: string;
    content: Prisma.InputJsonValue;
  }[];
};

const PAYMENT_SCENARIO = {
  slug: "design-a-payment-system",
  title: "Design a Payment System",
  description:
    "A candidate reasons through what happens when a payment succeeds but the system never observes it.",
  segments: [
    {
      order: 1,
      conversation: [
        {
          role: "interviewer",
          content:
            "Let's say the payment succeeded, but our order service never received the event. What happens?",
        },
        {
          role: "candidate",
          content:
            "I wouldn't retry the payment itself. I'd first separate payment state from event delivery.",
        },
        { role: "interviewer", content: "Why?" },
        {
          role: "candidate",
          content:
            "Because the external side effect may already have happened. My uncertainty is whether our system observed it — not whether the charge occurred.",
        },
        { role: "interviewer", content: "Okay. So how do you recover?" },
        {
          role: "candidate",
          content:
            "I'd persist the payment result, then publish through an outbox. The consumer must also be idempotent.",
        },
      ],
      takeaway: "Separate payment state from event delivery; use outbox pattern with idempotent consumers.",
      conceptSlugs: ["data-consistency", "message-queues"],
      actions: [
        {
          type: LearningActionType.OBSERVE,
          title: "Observe the pattern",
          instructions: "Watch how someone else handles it.",
          content: {
            reflection:
              "Notice what they did? The candidate separated whether the action happened from whether the system observed it. In your interview, you combined these two concerns.",
          },
        },
      ],
    },
    {
      order: 2,
      conversation: [
        {
          role: "interviewer",
          content: "The client times out and retries the same payment request. What could go wrong?",
        },
        {
          role: "candidate",
          content:
            "If we're not careful, we'd charge the customer twice — the retry looks like a brand new request unless we can recognize it as the same one.",
        },
      ],
      takeaway: "Client retries can cause duplicate charges without idempotency keys.",
      conceptSlugs: ["rate-limiting-algorithms"],
      actions: [
        {
          type: LearningActionType.FIX,
          title: "Fix the answer",
          instructions: "Fix this answer.",
          content: {
            reflection:
              "Better. You correctly questioned the delivery guarantee. One thing is still missing: what happens between the database commit and publishing the event?",
            interviewerQuestion: "How do you maintain consistency between services?",
            flawedAnswer:
              "I'd use Kafka because Kafka guarantees message delivery and makes the system eventually consistent.",
            evaluationFocus:
              "Whether the fix identifies the gap between the database write and the event publish, not just naming a technology.",
          },
        },
      ],
    },
    {
      order: 3,
      conversation: [
        {
          role: "interviewer",
          content:
            "The database write succeeds. The service crashes before publishing to Kafka. What does the system believe happened?",
        },
      ],
      takeaway: "Database write succeeded but event never published - system drifts out of sync.",
      conceptSlugs: ["message-queues", "consistent-hashing"],
      actions: [
        {
          type: LearningActionType.PREDICT,
          title: "Predict the failure",
          instructions: "What breaks first?",
          content: {
            reflection:
              "The order was persisted, but downstream services never learn about it until the outbox relay catches up — the system silently drifts out of sync in the meantime.",
            question:
              "Order Service → Database → Kafka → Inventory Service. The database write succeeds. The service crashes before publishing to Kafka. What does the system believe happened?",
            revealExplanation:
              "The Inventory Service has no idea the order exists yet. Without an outbox pattern, this gap is invisible until someone notices inventory never decremented.",
          },
        },
        {
          type: LearningActionType.JUDGE,
          title: "Judge the answer",
          instructions: "Your turn to interview. A candidate is designing a chat system.",
          content: {
            reflection:
              "Exactly. The interesting boundary is between the database write and event publication — that's the failure mode you missed in your own interview.",
            options: [
              { id: "a", text: "Why Kafka instead of RabbitMQ?" },
              { id: "b", text: "What happens if the database write succeeds but publishing fails?" },
              { id: "c", text: "How many Kafka partitions would you use?" },
              { id: "d", text: "Would you use WebSockets?" },
            ],
            correctOptionId: "b",
          },
        },
        {
          type: LearningActionType.COMPARE,
          title: "Compare approaches",
          instructions: "Who handled this better?",
          content: {
            reflection:
              "Candidate B — not because they used a more advanced term, but because they scoped the consistency decision instead of applying one model to the entire system.",
            candidateA:
              "I'd use eventual consistency because availability is more important here.",
            candidateB:
              "I think eventual consistency is acceptable for the read model, but I wouldn't apply that assumption to payment state — those have different failure costs.",
            correctChoice: "B",
          },
        },
      ],
    },
  ] satisfies SegmentSeed[],
};

export async function seedLearningScenarios() {
  const scenario = await prisma.learningScenario.upsert({
    where: { slug: PAYMENT_SCENARIO.slug },
    update: {
      title: PAYMENT_SCENARIO.title,
      description: PAYMENT_SCENARIO.description,
      isActive: true,
    },
    create: {
      slug: PAYMENT_SCENARIO.slug,
      title: PAYMENT_SCENARIO.title,
      description: PAYMENT_SCENARIO.description,
    },
  });

  for (const segmentSeed of PAYMENT_SCENARIO.segments) {
    const segment = await prisma.learningSegment.upsert({
      where: { scenarioId_order: { scenarioId: scenario.id, order: segmentSeed.order } },
      update: {
        conversation: ConversationSchema.parse(segmentSeed.conversation),
        takeaway: segmentSeed.takeaway,
      },
      create: {
        scenarioId: scenario.id,
        order: segmentSeed.order,
        conversation: ConversationSchema.parse(segmentSeed.conversation),
        takeaway: segmentSeed.takeaway,
      },
    });

    for (const slug of segmentSeed.conceptSlugs) {
      const concept = await prisma.concept.findUnique({ where: { slug } });

      if (!concept) {
        console.warn(`Skipping unknown concept slug "${slug}" for segment order ${segmentSeed.order}.`);
        continue;
      }

      await prisma.learningSegmentConcept.upsert({
        where: { scenarioId_segmentId_conceptId: { scenarioId: scenario.id, segmentId: segment.id, conceptId: concept.id } },
        update: {},
        create: { scenarioId: scenario.id, segmentId: segment.id, conceptId: concept.id },
      });
    }

    for (const actionSeed of segmentSeed.actions) {
      const existing = await prisma.learningAction.findFirst({
        where: { segmentId: segment.id, title: actionSeed.title },
      });

      const data = {
        segmentId: segment.id,
        type: actionSeed.type,
        title: actionSeed.title,
        instructions: actionSeed.instructions,
        content: JsonSchema.parse(actionSeed.content) as Prisma.InputJsonValue,
      };

      if (existing) {
      
        await prisma.learningAction.update({ where: { id: existing.id }, data });
      } else {
        await prisma.learningAction.create({ data });
      }
    }
  }

  console.log(
    `Seeded learning scenario "${scenario.slug}" (${PAYMENT_SCENARIO.segments.length} segments).`
  );
}

async function main() {
  for (const problem of problems) {
    await prisma.problem.upsert({
      where: { slug: problem.slug },
      update: {
        title: problem.title,
        description: problem.description,
        category: problem.category,
        difficulty: problem.difficulty,
        interviewType: problem.interviewType,
        cruxOfProblem: problem.cruxOfProblem,
        estimatedMinutes: problem.estimatedMinutes,
      },
      create: {
        slug: problem.slug,
        title: problem.title,
        description: problem.description,
        category: problem.category,
        difficulty: problem.difficulty,
        interviewType: problem.interviewType,
        cruxOfProblem: problem.cruxOfProblem,
        estimatedMinutes: problem.estimatedMinutes,
      },
    });
  }

  console.log(`Seeded ${problems.length} problems.`);

  await seedTemplates();

  const conceptIdBySlug = await seedConcepts();
  await seedProblemConcepts(conceptIdBySlug);
  await seedLearningScenarios();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });