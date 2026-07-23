// src/features/interview/application/services/studyplan/StudyResources.ts

/**
 * Static mapping of concepts to study resources and advice.
 * This is deliberately maintained as a static map rather than LLM-generated
 * to ensure resource quality and avoid hallucination.
 */

export interface ConceptResource {
  advice: string;
  resources: string[];
}

export const CONCEPT_RESOURCES: Record<string, ConceptResource> = {
  "horizontal-scaling": {
    advice: "Review horizontal vs vertical scaling tradeoffs. Practice identifying bottlenecks and designing stateless services.",
    resources: [
      "System Design Primer — Horizontal Scaling",
      "Designing Data-Intensive Applications, ch. 6",
    ],
  },
  "load-balancing": {
    advice: "Understand different load balancing algorithms (round-robin, least connections, consistent hashing) and when to use each.",
    resources: [
      "System Design Primer — Load Balancing",
      "NGINX Load Balancing Documentation",
    ],
  },
  "caching-strategy": {
    advice: "Learn cache eviction policies (LRU, LFU), cache invalidation strategies, and distributed caching challenges.",
    resources: [
      "System Design Primer — Caching",
      "Designing Data-Intensive Applications, ch. 5",
    ],
  },
  "database-sharding": {
    advice: "Review partitioning strategies and how to handle resharding without downtime. Understand consistent hashing for shard key distribution.",
    resources: [
      "System Design Primer — Sharding",
      "Designing Data-Intensive Applications, ch. 6",
    ],
  },
  "cdn": {
    advice: "Understand CDN caching hierarchies, cache invalidation, and edge computing patterns.",
    resources: [
      "System Design Primer — CDN",
      "Cloudflare CDN Documentation",
    ],
  },
  "consistent-hashing": {
    advice: "Practice explaining virtual nodes and how they reduce rebalancing cost. Understand the ring topology and key distribution.",
    resources: [
      "System Design Primer — Consistent Hashing",
      "Dynamo Paper (Amazon)",
    ],
  },
  "cap-theorem": {
    advice: "Deepen understanding of consistency vs availability tradeoffs. Practice classifying systems by their CAP properties.",
    resources: [
      "System Design Primer — CAP Theorem",
      "Designing Data-Intensive Applications, ch. 9",
    ],
  },
  "message-queues": {
    advice: "Learn message queue patterns (pub/sub, point-to-point), delivery guarantees, and backpressure handling.",
    resources: [
      "System Design Primer — Message Queues",
      "RabbitMQ Documentation",
      "Kafka Documentation",
    ],
  },
  "data-consistency": {
    advice: "Study strong vs eventual consistency models, conflict resolution strategies, and distributed transactions.",
    resources: [
      "System Design Primer — Data Consistency",
      "Designing Data-Intensive Applications, ch. 9",
    ],
  },
  "rate-limiting-algorithms": {
    advice: "Implement and compare token bucket, leaky bucket, and fixed window algorithms. Understand distributed rate limiting challenges.",
    resources: [
      "System Design Primer — Rate Limiting",
      "Redis Rate Limiting Patterns",
    ],
  },
  "api-design": {
    advice: "Study REST vs GraphQL, API versioning strategies, authentication/authorization patterns, and error handling.",
    resources: [
      "REST API Design Best Practices",
      "GraphQL Documentation",
      "API Security Best Practices (OWASP)",
    ],
  },
  "database-indexing": {
    advice: "Learn B-tree vs hash indexes, composite indexes, index selectivity, and query optimization basics.",
    resources: [
      "PostgreSQL Index Documentation",
      "Database Indexing — Use the Index, Luke",
    ],
  },
  "object-modeling": {
    advice: "Practice identifying entities, relationships, and responsibilities. Study composition vs inheritance tradeoffs.",
    resources: [
      "Domain-Driven Design — Eric Evans",
      "Clean Architecture — Robert Martin",
    ],
  },
  "design-patterns": {
    advice: "Study GoF patterns with concrete examples. Understand when patterns help vs when they add unnecessary complexity.",
    resources: [
      "Design Patterns — Gang of Four",
      "Refactoring Guru — Design Patterns",
    ],
  },
  "encapsulation": {
    advice: "Practice hiding implementation details behind clean interfaces. Study information hiding principles and access modifiers.",
    resources: [
      "Clean Code — Robert Martin",
      "Effective Java — Joshua Bloch",
    ],
  },
  "complexity-analysis": {
    advice: "Practice analyzing time and space complexity for common algorithms. Learn to recognize O(n log n) patterns and optimize hot paths.",
    resources: [
      "Introduction to Algorithms — CLRS",
      "Cracking the Coding Interview — Complexity Analysis",
    ],
  },
  "edge-case-handling": {
    advice: "Develop a checklist of common edge cases (empty, null, single element, duplicates, boundaries). Practice defensive programming.",
    resources: [
      "Clean Code — Defensive Programming",
      "The Pragmatic Programmer — Defensive Programming",
    ],
  },
};

/**
 * Derive study plan items from a list of concept slugs.
 * Returns only items that have resources defined in CONCEPT_RESOURCES.
 */
export function deriveStudyPlan(
  conceptSlugs: string[]
): Array<{ topic: string; advice: string; resources: string[] }> {
  const plan: Array<{ topic: string; advice: string; resources: string[] }> = [];

  for (const slug of conceptSlugs) {
    const resource = CONCEPT_RESOURCES[slug];
    if (resource) {
      plan.push({
        topic: slug,
        advice: resource.advice,
        resources: resource.resources,
      });
    }
  }

  return plan;
}
