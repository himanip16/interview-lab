import { ReactNode } from "react";

export interface DeepDiveSystem {
  slug: string;
  name: string;
  category: string;
  eyebrow: string;
  description: string[];
  tags: string[];
  credit: string;
  creditOrg: string;
  docsUrl: string;
  scenarioSlug?: string;
  order: number;
}

export const DEEP_DIVE_SYSTEMS: DeepDiveSystem[] = [
  {
    slug: "cassandra",
    name: "Cassandra",
    category: "Wide-Column NoSQL",
    eyebrow: "WIDE-COLUMN · NoSQL",
    description: [
      "<b>Cassandra</b> is a distributed, wide-column NoSQL database. Every node in the ring is an equal peer — there's no single leader to bottleneck writes or become a point of failure.",
      "Writes go straight to a commit log and an in-memory table before being flushed, which is why write throughput is exceptional. Reads have to reconcile across replicas, which is why they're comparatively slower.",
    ],
    tags: ["Distributed", "High write throughput", "Eventually consistent"],
    credit: "Maintained by",
    creditOrg: "Apache Software Foundation",
    docsUrl: "https://cassandra.apache.org/",
    scenarioSlug: "cassandra-deep-dive",
    order: 1,
  },
  {
    slug: "redis",
    name: "Redis",
    category: "In-Memory Cache",
    eyebrow: "KEY-VALUE · CACHE",
    description: [
      "<b>Redis</b> is an in-memory data structure store. It's single-threaded, which means operations are atomic and there's no locking overhead.",
      "Because everything lives in RAM, speed is exceptional. Persistence is optional (RDB snapshots or AOF).",
    ],
    tags: ["In-memory", "Single-threaded", "Sub-millisecond latency"],
    credit: "Created by",
    creditOrg: "Salvatore Sanfilippo",
    docsUrl: "https://redis.io/",
    order: 0,
  },
  {
    slug: "kafka",
    name: "Kafka",
    category: "Event Streaming",
    eyebrow: "MESSAGE QUEUE · STREAMING",
    description: [
      "<b>Kafka</b> is a distributed event streaming platform. Topics are split into partitions, each with a leader and replicas.",
      "Consumers read from offsets, which means they can replay history. It's the backbone of event-driven architectures.",
    ],
    tags: ["Event streaming", "Partitioned", "Persistent log"],
    credit: "Maintained by",
    creditOrg: "Apache Software Foundation",
    docsUrl: "https://kafka.apache.org/",
    order: 2,
  },
  // Add more systems: MongoDB, PostgreSQL, Elasticsearch, RabbitMQ, etc.
];

export function getDeepDiveSystem(slug: string): DeepDiveSystem | undefined {
  return DEEP_DIVE_SYSTEMS.find((s) => s.slug === slug);
}

export function getPrevSystem(
  slug: string
): DeepDiveSystem | undefined {
  const system = getDeepDiveSystem(slug);
  if (!system) return undefined;

  const sorted = [...DEEP_DIVE_SYSTEMS].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((s) => s.slug === slug);

  return index > 0 ? sorted[index - 1] : undefined;
}

export function getNextSystem(
  slug: string
): DeepDiveSystem | undefined {
  const system = getDeepDiveSystem(slug);
  if (!system) return undefined;

  const sorted = [...DEEP_DIVE_SYSTEMS].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((s) => s.slug === slug);

  return index < sorted.length - 1 ? sorted[index + 1] : undefined;
}