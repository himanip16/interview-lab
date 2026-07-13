import {
  Difficulty,
  Prisma,
  PrismaClient,
  ProblemCategory,
  LearningActionType,
} from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Problems - Expanded to 50+ focused problems by interview type
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

const problems: ProblemSeed[] = [
  // HLD - High-Level Design Problems
  {
    slug: "real-time-dashboard",
    title: "Design a Real-Time Analytics Dashboard",
    description: "Build a system that displays live metrics with sub-second updates for thousands of concurrent users.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
    interviewType: "hld",
    cruxOfProblem: "WebSocket scaling + efficient aggregation",
    estimatedMinutes: 45,
    concepts: ["websockets", "redis", "time-series"],
    tags: ["real-time", "analytics", "high-concurrency"],
  },
  {
    slug: "recommendation-service",
    title: "Design a Recommendation Service",
    description: "Build a service that suggests personalized content to millions of users with low latency.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
    interviewType: "hld",
    cruxOfProblem: "Collaborative filtering + real-time ranking",
    estimatedMinutes: 45,
    concepts: ["machine-learning", "caching-strategy", "database-sharding"],
    tags: ["recommendations", "personalization", "ml"],
  },
  {
    slug: "analytics-pipeline",
    title: "Design an Analytics Pipeline",
    description: "Build a system that processes billions of events daily and generates aggregated reports.",
    category: ProblemCategory.DISTRIBUTED_SYSTEMS,
    difficulty: Difficulty.HARD,
    interviewType: "hld",
    cruxOfProblem: "Event batching + time-window aggregation",
    estimatedMinutes: 60,
    concepts: ["message-queues", "data-consistency", "batch-processing"],
    tags: ["analytics", "big-data", "aggregation"],
  },
  {
    slug: "notification-system",
    title: "Design a Notification System",
    description: "Build a system that delivers push notifications to millions of devices reliably.",
    category: ProblemCategory.DISTRIBUTED_SYSTEMS,
    difficulty: Difficulty.HARD,
    interviewType: "hld",
    cruxOfProblem: "Queue-based delivery + deduplication",
    estimatedMinutes: 45,
    concepts: ["message-queues", "rate-limiting-algorithms", "data-consistency"],
    tags: ["notifications", "push", "reliability"],
  },
  {
    slug: "feed-ranking",
    title: "Design a Feed Ranking System",
    description: "Build a system that ranks and personalizes social media feeds for millions of users.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
    interviewType: "hld",
    cruxOfProblem: "Ranking algorithms + personalized scoring",
    estimatedMinutes: 45,
    concepts: ["caching-strategy", "database-sharding", "machine-learning"],
    tags: ["social", "ranking", "personalization"],
  },
  {
    slug: "click-tracking",
    title: "Design a Click Tracking System",
    description: "Build a system that tracks and aggregates millions of click events in real-time.",
    category: ProblemCategory.DISTRIBUTED_SYSTEMS,
    difficulty: Difficulty.HARD,
    interviewType: "hld",
    cruxOfProblem: "High-volume ingestion + real-time aggregation",
    estimatedMinutes: 45,
    concepts: ["message-queues", "time-series", "database-sharding"],
    tags: ["analytics", "high-volume", "real-time"],
  },
  {
    slug: "url-shortener",
    title: "Design a URL Shortener",
    description: "Design a scalable URL shortening service like TinyURL.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.MEDIUM,
    interviewType: "hld",
    cruxOfProblem: "Unique ID generation + redirect performance",
    estimatedMinutes: 30,
    concepts: ["database-sharding", "caching-strategy", "api-design"],
    tags: ["storage", "redirection", "scalability"],
  },
  {
    slug: "rate-limiter",
    title: "Design a Rate Limiter",
    description: "Design a distributed rate limiting system.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.MEDIUM,
    interviewType: "hld",
    cruxOfProblem: "Distributed state + sliding window",
    estimatedMinutes: 30,
    concepts: ["rate-limiting-algorithms", "consistent-hashing", "redis"],
    tags: ["rate-limiting", "distributed", "throttling"],
  },
  {
    slug: "news-feed",
    title: "Design a News Feed",
    description: "Design a scalable social media news feed.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
    interviewType: "hld",
    cruxOfProblem: "Fanout on write vs read + timeline pagination",
    estimatedMinutes: 45,
    concepts: ["caching-strategy", "message-queues", "database-sharding"],
    tags: ["social", "feed", "scalability"],
  },
  {
    slug: "chat-system",
    title: "Design a Chat System",
    description: "Design a real-time messaging platform.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
    interviewType: "hld",
    cruxOfProblem: "Message ordering + presence + delivery guarantees",
    estimatedMinutes: 45,
    concepts: ["websockets", "message-queues", "data-consistency"],
    tags: ["messaging", "real-time", "communication"],
  },
  {
    slug: "file-storage",
    title: "Design File Storage",
    description: "Design a distributed cloud file storage system.",
    category: ProblemCategory.DISTRIBUTED_SYSTEMS,
    difficulty: Difficulty.HARD,
    interviewType: "hld",
    cruxOfProblem: "Block-level storage + consistency + durability",
    estimatedMinutes: 60,
    concepts: ["database-sharding", "cdn", "data-consistency"],
    tags: ["storage", "cloud", "distributed"],
  },
  {
    slug: "design-uber",
    title: "Design Uber",
    description: "Design a large-scale ride sharing platform.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
    interviewType: "hld",
    cruxOfProblem: "Real-time matching + location indexing + ETA calculation",
    estimatedMinutes: 60,
    concepts: ["consistent-hashing", "data-consistency", "load-balancing"],
    tags: ["ride-sharing", "location", "real-time"],
  },
  {
    slug: "design-youtube",
    title: "Design YouTube",
    description: "Design a global video streaming platform.",
    category: ProblemCategory.SYSTEM_DESIGN,
    difficulty: Difficulty.HARD,
    interviewType: "hld",
    cruxOfProblem: "Video upload + transcoding + CDN distribution",
    estimatedMinutes: 60,
    concepts: ["cdn", "database-sharding", "caching-strategy"],
    tags: ["streaming", "video", "cdn"],
  },

  // LLD - Low-Level Design Problems
  {
    slug: "post-comment-threading",
    title: "Design Post/Comment Threading",
    description: "Design a system for nested comments with efficient retrieval and pagination.",
    category: ProblemCategory.LOW_LEVEL_DESIGN,
    difficulty: Difficulty.MEDIUM,
    interviewType: "lld",
    cruxOfProblem: "Tree traversal + pagination + N+1 prevention",
    estimatedMinutes: 30,
    concepts: ["object-modeling", "database-indexing", "encapsulation"],
    tags: ["social", "comments", "threading"],
  },
  {
    slug: "like-reaction-system",
    title: "Design a Like/Reaction System",
    description: "Design a system for handling likes and reactions on posts with real-time counts.",
    category: ProblemCategory.LOW_LEVEL_DESIGN,
    difficulty: Difficulty.MEDIUM,
    interviewType: "lld",
    cruxOfProblem: "Efficient counting + denormalization + consistency",
    estimatedMinutes: 30,
    concepts: ["caching-strategy", "denormalization", "redis"],
    tags: ["social", "reactions", "counting"],
  },
  {
    slug: "user-authentication",
    title: "Design User Authentication",
    description: "Design a secure user authentication system with sessions and tokens.",
    category: ProblemCategory.LOW_LEVEL_DESIGN,
    difficulty: Difficulty.MEDIUM,
    interviewType: "lld",
    cruxOfProblem: "Session management + token security + password hashing",
    estimatedMinutes: 30,
    concepts: ["encapsulation", "design-patterns", "api-design"],
    tags: ["security", "auth", "sessions"],
  },
  {
    slug: "video-upload-pipeline",
    title: "Design a Video Upload Pipeline",
    description: "Design a system for uploading and processing large video files.",
    category: ProblemCategory.LOW_LEVEL_DESIGN,
    difficulty: Difficulty.HARD,
    interviewType: "lld",
    cruxOfProblem: "Multipart upload + state machine + error handling",
    estimatedMinutes: 45,
    concepts: ["design-patterns", "state-machine", "error-handling"],
    tags: ["video", "upload", "processing"],
  },
  {
    slug: "search-indexing",
    title: "Design Search Indexing",
    description: "Design an inverted index system for full-text search with ranking.",
    category: ProblemCategory.LOW_LEVEL_DESIGN,
    difficulty: Difficulty.HARD,
    interviewType: "lld",
    cruxOfProblem: "Inverted index + ranking + relevance scoring",
    estimatedMinutes: 45,
    concepts: ["database-indexing", "algorithms", "data-structures"],
    tags: ["search", "indexing", "ranking"],
  },
  {
    slug: "permissions-access-control",
    title: "Design Permissions & Access Control",
    description: "Design a flexible permission system for role-based access control.",
    category: ProblemCategory.LOW_LEVEL_DESIGN,
    difficulty: Difficulty.MEDIUM,
    interviewType: "lld",
    cruxOfProblem: "Role hierarchy + permission inheritance + performance",
    estimatedMinutes: 30,
    concepts: ["design-patterns", "object-modeling", "encapsulation"],
    tags: ["security", "permissions", "rbac"],
  },
  {
    slug: "shopping-cart",
    title: "Design a Shopping Cart",
    description: "Design a shopping cart system that handles persistence and concurrency.",
    category: ProblemCategory.LOW_LEVEL_DESIGN,
    difficulty: Difficulty.EASY,
    interviewType: "lld",
    cruxOfProblem: "Cart persistence + price consistency + session handling",
    estimatedMinutes: 30,
    concepts: ["object-modeling", "encapsulation", "design-patterns"],
    tags: ["e-commerce", "cart", "persistence"],
  },
  {
    slug: "booking-system",
    title: "Design a Booking System",
    description: "Design a system for booking appointments with availability management.",
    category: ProblemCategory.LOW_LEVEL_DESIGN,
    difficulty: Difficulty.MEDIUM,
    interviewType: "lld",
    cruxOfProblem: "Availability checking + concurrency + double-booking prevention",
    estimatedMinutes: 30,
    concepts: ["design-patterns", "data-consistency", "encapsulation"],
    tags: ["booking", "scheduling", "availability"],
  },
  {
    slug: "file-versioning",
    title: "Design File Versioning",
    description: "Design a system for tracking and managing different versions of files.",
    category: ProblemCategory.LOW_LEVEL_DESIGN,
    difficulty: Difficulty.MEDIUM,
    interviewType: "lld",
    cruxOfProblem: "Version storage + diff generation + rollback",
    estimatedMinutes: 30,
    concepts: ["object-modeling", "design-patterns", "data-structures"],
    tags: ["versioning", "files", "storage"],
  },
  {
    slug: "cache-invalidation",
    title: "Design Cache Invalidation",
    description: "Design a cache invalidation strategy for a distributed system.",
    category: ProblemCategory.LOW_LEVEL_DESIGN,
    difficulty: Difficulty.HARD,
    interviewType: "lld",
    cruxOfProblem: "Invalidation propagation + consistency + performance",
    estimatedMinutes: 45,
    concepts: ["caching-strategy", "design-patterns", "data-consistency"],
    tags: ["caching", "invalidation", "consistency"],
  },
  {
    slug: "event-sourcing",
    title: "Design Event Sourcing",
    description: "Design an event-sourced system for audit trails and replay.",
    category: ProblemCategory.LOW_LEVEL_DESIGN,
    difficulty: Difficulty.HARD,
    interviewType: "lld",
    cruxOfProblem: "Event storage + snapshotting + replay performance",
    estimatedMinutes: 45,
    concepts: ["design-patterns", "message-queues", "data-consistency"],
    tags: ["event-sourcing", "audit", "replay"],
  },
  {
    slug: "api-rate-limiter",
    title: "Design API Rate Limiter",
    description: "Design a rate limiter for API endpoints with different tiers.",
    category: ProblemCategory.LOW_LEVEL_DESIGN,
    difficulty: Difficulty.MEDIUM,
    interviewType: "lld",
    cruxOfProblem: "Token bucket + sliding window + distributed coordination",
    estimatedMinutes: 30,
    concepts: ["rate-limiting-algorithms", "design-patterns", "encapsulation"],
    tags: ["rate-limiting", "api", "throttling"],
  },
  {
    slug: "retry-mechanism",
    title: "Design a Retry Mechanism",
    description: "Design a retry mechanism for handling transient failures.",
    category: ProblemCategory.LOW_LEVEL_DESIGN,
    difficulty: Difficulty.MEDIUM,
    interviewType: "lld",
    cruxOfProblem: "Exponential backoff + idempotency + dead letter queue",
    estimatedMinutes: 30,
    concepts: ["design-patterns", "error-handling", "message-queues"],
    tags: ["retry", "resilience", "error-handling"],
  },

  // DSA - Data Structures & Algorithms Problems
  {
    slug: "binary-search-variations",
    title: "Binary Search Variations",
    description: "Implement various binary search patterns including finding first/last occurrence and search in rotated arrays.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.MEDIUM,
    interviewType: "dsa",
    cruxOfProblem: "Search space reduction + boundary conditions",
    estimatedMinutes: 30,
    concepts: ["algorithms", "complexity-analysis", "edge-case-handling"],
    tags: ["binary-search", "algorithms", "searching"],
  },
  {
    slug: "graph-traversals",
    title: "Graph Traversals",
    description: "Implement BFS and DFS for various graph problems including shortest path and cycle detection.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.MEDIUM,
    interviewType: "dsa",
    cruxOfProblem: "Traversal order + visited tracking + cycle detection",
    estimatedMinutes: 45,
    concepts: ["algorithms", "data-structures", "complexity-analysis"],
    tags: ["graph", "bfs", "dfs"],
  },
  {
    slug: "dynamic-programming-patterns",
    title: "Dynamic Programming Patterns",
    description: "Solve DP problems using memoization and tabulation for knapsack, LCS, and palindrome problems.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.HARD,
    interviewType: "dsa",
    cruxOfProblem: "State definition + recurrence relation + optimal substructure",
    estimatedMinutes: 60,
    concepts: ["algorithms", "complexity-analysis", "problem-solving"],
    tags: ["dynamic-programming", "optimization", "algorithms"],
  },
  {
    slug: "two-pointers",
    title: "Two Pointers Technique",
    description: "Solve array problems using two pointers for sorting, searching, and partitioning.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.EASY,
    interviewType: "dsa",
    cruxOfProblem: "Pointer movement + termination conditions",
    estimatedMinutes: 30,
    concepts: ["algorithms", "edge-case-handling", "complexity-analysis"],
    tags: ["two-pointers", "arrays", "algorithms"],
  },
  {
    slug: "sliding-window",
    title: "Sliding Window",
    description: "Solve subarray problems using fixed and variable size sliding windows.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.MEDIUM,
    interviewType: "dsa",
    cruxOfProblem: "Window expansion + contraction + state maintenance",
    estimatedMinutes: 30,
    concepts: ["algorithms", "complexity-analysis", "edge-case-handling"],
    tags: ["sliding-window", "arrays", "subarrays"],
  },
  {
    slug: "heap-priority-queue",
    title: "Heap and Priority Queue",
    description: "Solve problems using heaps for top-k elements, merge k-sorted lists, and task scheduling.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.MEDIUM,
    interviewType: "dsa",
    cruxOfProblem: "Heap property + efficient insertion/extraction",
    estimatedMinutes: 45,
    concepts: ["data-structures", "algorithms", "complexity-analysis"],
    tags: ["heap", "priority-queue", "data-structures"],
  },
  {
    slug: "trie-prefix-tree",
    title: "Trie Prefix Tree",
    description: "Implement a trie for autocomplete, spell checking, and word search problems.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.MEDIUM,
    interviewType: "dsa",
    cruxOfProblem: "Trie node structure + prefix traversal + memory optimization",
    estimatedMinutes: 30,
    concepts: ["data-structures", "algorithms", "string-manipulation"],
    tags: ["trie", "prefix", "strings"],
  },
  {
    slug: "union-find",
    title: "Union Find (Disjoint Set)",
    description: "Implement union-find for connectivity problems, cycle detection, and Kruskal's algorithm.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.MEDIUM,
    interviewType: "dsa",
    cruxOfProblem: "Path compression + union by rank + time complexity",
    estimatedMinutes: 30,
    concepts: ["data-structures", "algorithms", "graph"],
    tags: ["union-find", "disjoint-set", "graph"],
  },
  {
    slug: "backtracking",
    title: "Backtracking Patterns",
    description: "Solve permutation, combination, and constraint satisfaction problems using backtracking.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.HARD,
    interviewType: "dsa",
    cruxOfProblem: "State space exploration + pruning + base cases",
    estimatedMinutes: 45,
    concepts: ["algorithms", "problem-solving", "complexity-analysis"],
    tags: ["backtracking", "recursion", "combinatorics"],
  },
  {
    slug: "greedy-algorithms",
    title: "Greedy Algorithms",
    description: "Solve interval scheduling, Huffman coding, and activity selection using greedy approaches.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.MEDIUM,
    interviewType: "dsa",
    cruxOfProblem: "Greedy choice property + optimal substructure",
    estimatedMinutes: 30,
    concepts: ["algorithms", "problem-solving", "complexity-analysis"],
    tags: ["greedy", "optimization", "algorithms"],
  },
  {
    slug: "linked-lists",
    title: "Linked List Manipulation",
    description: "Solve problems involving linked list reversal, cycle detection, and intersection.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.EASY,
    interviewType: "dsa",
    cruxOfProblem: "Pointer manipulation + cycle detection + dummy nodes",
    estimatedMinutes: 30,
    concepts: ["data-structures", "pointers", "edge-case-handling"],
    tags: ["linked-list", "pointers", "data-structures"],
  },
  {
    slug: "stack-queue",
    title: "Stack and Queue Applications",
    description: "Solve problems using stacks for parentheses matching and queues for level-order traversal.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.EASY,
    interviewType: "dsa",
    cruxOfProblem: "LIFO/FIFO semantics + appropriate data structure choice",
    estimatedMinutes: 30,
    concepts: ["data-structures", "algorithms", "problem-solving"],
    tags: ["stack", "queue", "data-structures"],
  },
  {
    slug: "hash-maps",
    title: "Hash Map Applications",
    description: "Solve problems using hash maps for counting, frequency analysis, and two-sum variants.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.EASY,
    interviewType: "dsa",
    cruxOfProblem: "Hash function + collision handling + O(1) operations",
    estimatedMinutes: 30,
    concepts: ["data-structures", "algorithms", "complexity-analysis"],
    tags: ["hash-map", "hashing", "data-structures"],
  },
  {
    slug: "tree-traversals",
    title: "Tree Traversals",
    description: "Implement inorder, preorder, postorder traversals and solve tree problems recursively.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.MEDIUM,
    interviewType: "dsa",
    cruxOfProblem: "Recursive vs iterative + traversal order + base cases",
    estimatedMinutes: 30,
    concepts: ["data-structures", "recursion", "algorithms"],
    tags: ["tree", "traversal", "recursion"],
  },
  {
    slug: "binary-search-tree",
    title: "Binary Search Tree Operations",
    description: "Implement BST operations including insertion, deletion, search, and validation.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.MEDIUM,
    interviewType: "dsa",
    cruxOfProblem: "BST property + rebalancing + edge cases",
    estimatedMinutes: 45,
    concepts: ["data-structures", "algorithms", "recursion"],
    tags: ["bst", "binary-search-tree", "data-structures"],
  },
  {
    slug: "string-algorithms",
    title: "String Algorithms",
    description: "Solve string problems including KMP pattern matching, longest substring, and anagrams.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.MEDIUM,
    interviewType: "dsa",
    cruxOfProblem: "Pattern matching + substring search + character counting",
    estimatedMinutes: 45,
    concepts: ["algorithms", "strings", "complexity-analysis"],
    tags: ["strings", "pattern-matching", "algorithms"],
  },
  {
    slug: "bit-manipulation",
    title: "Bit Manipulation",
    description: "Solve problems using bit operations for XOR, bit counting, and single number detection.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.MEDIUM,
    interviewType: "dsa",
    cruxOfProblem: "Bitwise operations + bit masks + optimization",
    estimatedMinutes: 30,
    concepts: ["algorithms", "bit-manipulation", "optimization"],
    tags: ["bits", "bitwise", "optimization"],
  },
  {
    slug: "interval-problems",
    title: "Interval Problems",
    description: "Solve interval merging, overlapping, and scheduling problems efficiently.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.MEDIUM,
    interviewType: "dsa",
    cruxOfProblem: "Sorting + sweeping + interval comparison",
    estimatedMinutes: 30,
    concepts: ["algorithms", "sorting", "problem-solving"],
    tags: ["intervals", "sorting", "scheduling"],
  },
  {
    slug: "matrix-problems",
    title: "Matrix Problems",
    description: "Solve matrix rotation, search in 2D matrix, and dynamic programming on grids.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.MEDIUM,
    interviewType: "dsa",
    cruxOfProblem: "2D traversal + boundary handling + optimization",
    estimatedMinutes: 45,
    concepts: ["algorithms", "data-structures", "problem-solving"],
    tags: ["matrix", "2d", "grid"],
  },
  {
    slug: "design-linked-list",
    title: "Design Linked List",
    description: "Design and implement a linked list with operations from scratch.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.EASY,
    interviewType: "dsa",
    cruxOfProblem: "Node structure + pointer management + edge cases",
    estimatedMinutes: 30,
    concepts: ["data-structures", "pointers", "implementation"],
    tags: ["linked-list", "implementation", "data-structures"],
  },
  {
    slug: "design-stack",
    title: "Design Stack",
    description: "Design a stack using arrays and linked lists with O(1) operations.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.EASY,
    interviewType: "dsa",
    cruxOfProblem: "LIFO semantics + dynamic resizing + error handling",
    estimatedMinutes: 30,
    concepts: ["data-structures", "implementation", "algorithms"],
    tags: ["stack", "implementation", "data-structures"],
  },
  {
    slug: "design-queue",
    title: "Design Queue",
    description: "Design a queue using arrays and linked lists with O(1) operations.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.EASY,
    interviewType: "dsa",
    cruxOfProblem: "FIFO semantics + circular buffer + error handling",
    estimatedMinutes: 30,
    concepts: ["data-structures", "implementation", "algorithms"],
    tags: ["queue", "implementation", "data-structures"],
  },
  {
    slug: "lru-cache",
    title: "Design LRU Cache",
    description: "Design an LRU cache with get and put operations in O(1) time.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.MEDIUM,
    interviewType: "dsa",
    cruxOfProblem: "Hash map + doubly linked list + eviction policy",
    estimatedMinutes: 45,
    concepts: ["data-structures", "design-patterns", "algorithms"],
    tags: ["cache", "lru", "data-structures"],
  },
  {
    slug: "design-hashmap",
    title: "Design Hash Map",
    description: "Design a hash map from scratch with collision resolution.",
    category: ProblemCategory.JAVA,
    difficulty: Difficulty.MEDIUM,
    interviewType: "dsa",
    cruxOfProblem: "Hash function + collision resolution + resizing",
    estimatedMinutes: 45,
    concepts: ["data-structures", "algorithms", "implementation"],
    tags: ["hash-map", "implementation", "data-structures"],
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
  // Reverse-mode rubrics — evaluating the interviewer's technique
  rapport_building: rubric(
    [
      "Opens with a clear, welcoming introduction",
      "Sets expectations for the session",
    ],
    "jumps into technical questions with no framing"
  ),
  requirement_elicitation: rubric(
    [
      "Asks open-ended questions to surface functional/non-functional requirements",
      "Doesn't spoon-feed the answer",
    ],
    "tells the candidate the requirements instead of drawing them out"
  ),
  probing_depth: rubric(
    [
      "Follows up on vague or surface-level answers",
      "Pushes for specifics (numbers, tradeoffs, edge cases)",
    ],
    "accepts shallow answers without pushing further"
  ),
  technical_listening: rubric(
    [
      "Picks up on what the candidate actually said and builds the next question from it",
    ],
    "asks a pre-scripted next question ignoring the candidate's last answer"
  ),
  challenging_appropriately: rubric(
    [
      "Introduces realistic pressure (scale, failure, edge cases) at the right moments",
    ],
    "never challenges the candidate's design, or challenges too aggressively to be useful"
  ),
  time_management: rubric(
    [
      "Keeps the session moving, doesn't get stuck on one topic too long",
    ],
    "lets one phase consume the entire interview"
  ),
  summarizing_and_wrap_up: rubric(
    [
      "Closes with a clear summary and gives the candidate a chance to ask questions",
    ],
    "ends abruptly with no wrap-up"
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

const templates: TemplateSeed[] = [
  {
    slug: "hld",
    name: "High Level Design",
    description: "Design scalable distributed systems.",
    whiteboardPreset: "hld",
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
        reverseEvaluationDimensions: ["rapport_building"],
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
        reverseEvaluationDimensions: ["requirement_elicitation", "technical_listening"],
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
        showWhiteboard: true,
        reverseEvaluationDimensions: ["technical_listening", "time_management"],
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
        showWhiteboard: true,
        reverseEvaluationDimensions: ["probing_depth", "challenging_appropriately"],
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
        showWhiteboard: true,
        reverseEvaluationDimensions: ["challenging_appropriately", "probing_depth"],
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
        reverseEvaluationDimensions: ["summarizing_and_wrap_up"],
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
        phaseKey: "introduction",
        order: 0,
        goals: ["candidate_understands_problem"],
        evaluationDimensions: ["communication"],
        targetDurationRatio: 0.05,
        transitionThreshold: 0.7,
        instructions:
          "Introduce the object-oriented design problem. Ask the candidate to clarify the expected behaviour and scope.",
        reverseEvaluationDimensions: ["rapport_building"],
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
        reverseEvaluationDimensions: ["requirement_elicitation", "technical_listening"],
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
        showWhiteboard: true,
        reverseEvaluationDimensions: ["technical_listening", "time_management"],
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
        showWhiteboard: true,
        reverseEvaluationDimensions: ["probing_depth", "challenging_appropriately"],
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
        showWhiteboard: true,
        reverseEvaluationDimensions: ["challenging_appropriately", "probing_depth"],
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
        reverseEvaluationDimensions: ["summarizing_and_wrap_up"],
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
  {
    slug: "pr_review",
    name: "PR Review",
    description: "Review a pull request with focus on code quality, design patterns, and maintainability.",
    phases: [
      {
        phaseKey: "introduction",
        order: 0,
        goals: ["candidate_understands_pr_context"],
        evaluationDimensions: ["communication"],
        targetDurationRatio: 0.05,
        transitionThreshold: 0.7,
        instructions:
          "Introduce the PR context briefly. Ask the candidate to begin by understanding the purpose and scope of the changes.",
        reverseEvaluationDimensions: ["rapport_building"],
      },
      {
        phaseKey: "context_understanding",
        order: 1,
        goals: ["pr_purpose", "affected_areas", "dependencies"],
        evaluationDimensions: ["requirement_clarity", "communication"],
        targetDurationRatio: 0.15,
        transitionThreshold: 0.75,
        instructions:
          "Evaluate whether the candidate understands the PR's purpose, affected areas, and dependencies. Answer clarification questions about the codebase context.",
        reverseEvaluationDimensions: ["requirement_elicitation", "technical_listening"],
      },
      {
        phaseKey: "code_review",
        order: 2,
        goals: ["correctness", "code_quality", "design_patterns"],
        evaluationDimensions: ["code_correctness", "code_quality", "design_patterns"],
        targetDurationRatio: 0.35,
        transitionThreshold: 0.75,
        instructions:
          "Ask the candidate to review the code changes. Evaluate their ability to identify bugs, code quality issues, and design pattern usage. Challenge missed issues.",
        showWhiteboard: true,
        reverseEvaluationDimensions: ["probing_depth", "technical_listening"],
      },
      {
        phaseKey: "design_review",
        order: 3,
        goals: ["architecture_impact", "extensibility", "maintainability"],
        evaluationDimensions: ["architecture", "maintainability", "tradeoffs"],
        targetDurationRatio: 0.25,
        transitionThreshold: 0.7,
        instructions:
          "Probe the architectural impact of the changes. Evaluate whether the candidate considers extensibility, maintainability, and design tradeoffs.",
        showWhiteboard: true,
        reverseEvaluationDimensions: ["probing_depth", "challenging_appropriately"],
      },
      {
        phaseKey: "feedback_delivery",
        order: 4,
        goals: ["constructive_feedback", "actionable_suggestions"],
        evaluationDimensions: ["communication", "tradeoffs"],
        targetDurationRatio: 0.15,
        transitionThreshold: 0.7,
        instructions:
          "Ask the candidate to provide feedback as if they were reviewing this PR. Evaluate the constructiveness and actionability of their feedback.",
        reverseEvaluationDimensions: ["technical_listening", "time_management"],
      },
      {
        phaseKey: "closing",
        order: 5,
        goals: ["review_summary"],
        evaluationDimensions: ["communication"],
        targetDurationRatio: 0.05,
        transitionThreshold: 1,
        instructions:
          "Ask the candidate to summarize their review and the most important issues found. Conclude the interview naturally.",
        reverseEvaluationDimensions: ["summarizing_and_wrap_up"],
      },
    ],
  },
  {
    slug: "deep_dive",
    name: "Deep Dive",
    description: "Deep technical exploration of a specific system or technology.",
    phases: [
      {
        phaseKey: "introduction",
        order: 0,
        goals: ["candidate_understands_topic"],
        evaluationDimensions: ["communication"],
        targetDurationRatio: 0.05,
        transitionThreshold: 0.7,
        instructions:
          "Introduce the deep dive topic. Ask the candidate to begin by explaining their understanding of the system or technology.",
        reverseEvaluationDimensions: ["rapport_building"],
      },
      {
        phaseKey: "knowledge_assessment",
        order: 1,
        goals: ["core_concepts", "internals", "use_cases"],
        evaluationDimensions: ["technical_depth", "technical_reasoning"],
        targetDurationRatio: 0.2,
        transitionThreshold: 0.75,
        instructions:
          "Assess the candidate's depth of knowledge. Probe core concepts, internal workings, and practical use cases. Challenge superficial answers.",
        reverseEvaluationDimensions: ["probing_depth", "technical_listening"],
      },
      {
        phaseKey: "architecture_exploration",
        order: 2,
        goals: ["system_components", "data_flow", "design_decisions"],
        evaluationDimensions: ["architecture", "technical_reasoning"],
        targetDurationRatio: 0.25,
        transitionThreshold: 0.75,
        instructions:
          "Explore the architecture and design decisions. Evaluate understanding of component interactions, data flow, and key design choices.",
        showWhiteboard: true,
        reverseEvaluationDimensions: ["technical_listening", "challenging_appropriately"],
      },
      {
        phaseKey: "implementation_details",
        order: 3,
        goals: ["implementation_approach", "performance_considerations", "edge_cases"],
        evaluationDimensions: ["technical_depth", "tradeoffs"],
        targetDurationRatio: 0.3,
        transitionThreshold: 0.7,
        instructions:
          "Dive into implementation details. Probe performance considerations, edge cases, and practical implementation challenges.",
        showWhiteboard: true,
        reverseEvaluationDimensions: ["probing_depth", "challenging_appropriately"],
      },
      {
        phaseKey: "scalability_reliability",
        order: 4,
        goals: ["scaling_challenges", "failure_modes", "operational_considerations"],
        evaluationDimensions: ["scalability", "reliability"],
        targetDurationRatio: 0.15,
        transitionThreshold: 0.7,
        instructions:
          "Discuss scalability and reliability aspects. Ask about scaling challenges, failure modes, and operational considerations.",
        reverseEvaluationDimensions: ["challenging_appropriately", "probing_depth"],
      },
      {
        phaseKey: "closing",
        order: 5,
        goals: ["topic_summary", "key_takeaways"],
        evaluationDimensions: ["communication"],
        targetDurationRatio: 0.05,
        transitionThreshold: 1,
        instructions:
          "Ask the candidate to summarize the key takeaways from the deep dive. Conclude the interview naturally.",
        reverseEvaluationDimensions: ["summarizing_and_wrap_up"],
      },
    ],
  },
  {
    slug: "tech_doc_review",
    name: "Tech Doc Review",
    description: "Review technical documentation with focus on clarity, completeness, and accuracy.",
    phases: [
      {
        phaseKey: "introduction",
        order: 0,
        goals: ["candidate_understands_doc_context"],
        evaluationDimensions: ["communication"],
        targetDurationRatio: 0.05,
        transitionThreshold: 0.7,
        instructions:
          "Introduce the technical document briefly. Ask the candidate to begin by understanding the purpose and audience of the documentation.",
        reverseEvaluationDimensions: ["rapport_building"],
      },
      {
        phaseKey: "context_understanding",
        order: 1,
        goals: ["doc_purpose", "target_audience", "scope"],
        evaluationDimensions: ["requirement_clarity", "communication"],
        targetDurationRatio: 0.15,
        transitionThreshold: 0.75,
        instructions:
          "Evaluate whether the candidate understands the document's purpose, target audience, and scope. Answer clarification questions about the technical context.",
        reverseEvaluationDimensions: ["requirement_elicitation", "technical_listening"],
      },
      {
        phaseKey: "structure_review",
        order: 2,
        goals: ["organization", "flow", "navigation"],
        evaluationDimensions: ["architecture", "technical_reasoning"],
        targetDurationRatio: 0.2,
        transitionThreshold: 0.75,
        instructions:
          "Ask the candidate to review the document structure. Evaluate organization, logical flow, and ease of navigation. Challenge structural issues.",
        showWhiteboard: true,
        reverseEvaluationDimensions: ["technical_listening", "time_management"],
      },
      {
        phaseKey: "content_review",
        order: 3,
        goals: ["clarity", "completeness", "accuracy"],
        evaluationDimensions: ["technical_depth", "communication"],
        targetDurationRatio: 0.35,
        transitionThreshold: 0.7,
        instructions:
          "Dive into content review. Evaluate clarity, completeness, and accuracy of technical information. Probe missing sections, unclear explanations, and potential errors.",
        showWhiteboard: true,
        reverseEvaluationDimensions: ["probing_depth", "challenging_appropriately"],
      },
      {
        phaseKey: "improvement_suggestions",
        order: 4,
        goals: ["actionable_feedback", "priority_ranking"],
        evaluationDimensions: ["tradeoffs", "communication"],
        targetDurationRatio: 0.2,
        transitionThreshold: 0.7,
        instructions:
          "Ask the candidate to provide improvement suggestions with priorities. Evaluate the actionability and impact of their recommendations.",
        reverseEvaluationDimensions: ["technical_listening", "time_management"],
      },
      {
        phaseKey: "closing",
        order: 5,
        goals: ["review_summary", "key_improvements"],
        evaluationDimensions: ["communication"],
        targetDurationRatio: 0.05,
        transitionThreshold: 1,
        instructions:
          "Ask the candidate to summarize their review and the most important improvements. Conclude the interview naturally.",
        reverseEvaluationDimensions: ["summarizing_and_wrap_up"],
      },
    ],
  },
  {
    slug: "task_breakdown",
    name: "Task Breakdown",
    description: "Break down a large task into small, independent, executable subtasks.",
    phases: [
      {
        phaseKey: "introduction",
        order: 0,
        goals: ["candidate_understands_task"],
        evaluationDimensions: ["communication"],
        targetDurationRatio: 0.05,
        transitionThreshold: 0.7,
        instructions:
          "Introduce the large task briefly. Ask the candidate to begin by understanding the requirements and constraints.",
        reverseEvaluationDimensions: ["rapport_building"],
      },
      {
        phaseKey: "requirement_analysis",
        order: 1,
        goals: ["functional_requirements", "constraints", "success_criteria"],
        evaluationDimensions: ["requirement_clarity", "scope_management"],
        targetDurationRatio: 0.15,
        transitionThreshold: 0.75,
        instructions:
          "Evaluate requirement gathering. Probe functional requirements, constraints, and success criteria. Ensure scope is well-defined.",
        reverseEvaluationDimensions: ["requirement_elicitation", "technical_listening"],
      },
      {
        phaseKey: "dependency_analysis",
        order: 2,
        goals: ["dependencies", "blocking_tasks", "parallel_opportunities"],
        evaluationDimensions: ["architecture", "technical_reasoning"],
        targetDurationRatio: 0.2,
        transitionThreshold: 0.75,
        instructions:
          "Ask the candidate to analyze dependencies. Evaluate identification of blocking tasks and opportunities for parallel execution.",
        showWhiteboard: true,
        reverseEvaluationDimensions: ["technical_listening", "time_management"],
      },
      {
        phaseKey: "task_decomposition",
        order: 3,
        goals: ["subtask_definition", "independence", "estimation"],
        evaluationDimensions: ["technical_depth", "problem_solving"],
        targetDurationRatio: 0.35,
        transitionThreshold: 0.7,
        instructions:
          "Dive into task decomposition. Evaluate whether subtasks are small, independent, and properly estimated. Challenge overly large or dependent tasks.",
        showWhiteboard: true,
        reverseEvaluationDimensions: ["probing_depth", "challenging_appropriately"],
      },
      {
        phaseKey: "execution_planning",
        order: 4,
        goals: ["sequencing", "risk_mitigation", "resource_allocation"],
        evaluationDimensions: ["tradeoffs", "technical_reasoning"],
        targetDurationRatio: 0.2,
        transitionThreshold: 0.7,
        instructions:
          "Discuss execution planning. Evaluate task sequencing, risk mitigation strategies, and resource allocation decisions.",
        reverseEvaluationDimensions: ["challenging_appropriately", "probing_depth"],
      },
      {
        phaseKey: "closing",
        order: 5,
        goals: ["breakdown_summary", "critical_path"],
        evaluationDimensions: ["communication"],
        targetDurationRatio: 0.05,
        transitionThreshold: 1,
        instructions:
          "Ask the candidate to summarize their breakdown and identify the critical path. Conclude the interview naturally.",
        reverseEvaluationDimensions: ["summarizing_and_wrap_up"],
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
          goals: phase.goals as Prisma.InputJsonValue,
          evaluationDimensions:
            phase.evaluationDimensions as Prisma.InputJsonValue,
          targetDurationRatio: phase.targetDurationRatio,
          transitionThreshold: phase.transitionThreshold,
          instructions: phase.instructions,
          showWhiteboard: phase.showWhiteboard,
          reverseEvaluationDimensions:
            phase.reverseEvaluationDimensions as Prisma.InputJsonValue,
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
          showWhiteboard: phase.showWhiteboard,
          reverseEvaluationDimensions:
            phase.reverseEvaluationDimensions as Prisma.InputJsonValue,
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


// Additions for prisma/seed.ts — call seedLearningScenarios() from main(),
// after seedConcepts()/seedProblemConcepts() since segments reference concept
// slugs that must already exist.
//
// This seeds exactly the "Design a Payment System" example from the design
// doc: one scenario, three segments, and one action of each type, wired to
// whichever segment its concept actually belongs to.

type SegmentSeed = {
  order: number;
  conversation: { role: "interviewer" | "candidate"; content: string }[];
  takeaway?: string;
  conceptSlugs: string[]; // must already exist via seedConcepts()
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
        conversation: segmentSeed.conversation as Prisma.InputJsonValue,
        takeaway: segmentSeed.takeaway,
      },
      create: {
        scenarioId: scenario.id,
        order: segmentSeed.order,
        conversation: segmentSeed.conversation as Prisma.InputJsonValue,
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
        content: actionSeed.content as Prisma.InputJsonValue,
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