import { DeepDiveArticle, Paragraph } from "@/features/deep-dive/types";

const p = (text: string): Paragraph => [
  {
    type: "text",
    text,
  },
];

export const RedisData: DeepDiveArticle = {
  slug: "redis",
  name: "Redis",
  eyebrow: "IN-MEMORY · KEY-VALUE",

  description: [
    p(
      "Redis is an in-memory data structure store. It keeps everything in RAM, which makes it incredibly fast for reads and writes."
    ),
    p(
      "It supports data structures like strings, hashes, lists, sets, and more. Redis is often used for caching, session management, and real-time analytics."
    ),
  ],

  tags: ["In-memory", "Key-value", "Single-threaded"],
  category: "db",
  readTime: "10 min",

  credit: "Maintained by",
  creditOrg: "Redis Ltd",
  docsUrl: "https://redis.io/docs/",

  title: "Redis, and why it's faster than you think",

  lede:
    "Redis is the Swiss Army knife of data stores—caching, queues, pub/sub, leaderboards, and more. Understanding its single-threaded architecture explains both its speed and its limitations.",

  sections: [
    {
      number: 1,
      title: "Single-threaded by design",
      content: [
        p(
          "Redis runs a single event loop that processes commands one at a time. This sounds limiting, but it eliminates context switching and lock contention."
        ),
        p(
          "Because everything is in memory and there are no locks, Redis can process millions of operations per second on modest hardware."
        ),
      ],
    },
    {
      number: 2,
      title: "Data structures, not just strings",
      content: [
        p(
          "Redis isn't just a key-value store for strings. It supports hashes, lists, sets, sorted sets, bitmaps, HyperLogLog, and more."
        ),
        p(
          "These data structures are implemented efficiently in memory, making operations like ZRANGE (retrieving the top N members of a sorted set) extremely fast."
        ),
      ],
    },
    {
      number: 3,
      title: "Persistence tradeoffs",
      content: [
        p(
          "Redis can persist to disk via RDB snapshots or AOF logs, but this adds latency. Many deployments use Redis as a pure cache, accepting that data loss is possible."
        ),
        p(
          "The choice between RDB (fast, point-in-time snapshots) and AOF (durable, append-only logging) depends on your durability requirements."
        ),
      ],
    },
    {
      number: 4,
      title: "When to use it—and when not to",
      content: [],
    },
  ],

  tradeoffs: {
    strengths: [
      "Sub-millisecond latency for most operations",
      "Rich data structures beyond simple key-value",
      "Simple to set up and operate",
    ],
    weaknesses: [
      "Limited by available RAM",
      "Single-threaded command execution (I/O can be parallelized)",
      "Not suitable as the primary data store for critical data",
    ],
  },

  related: [
    {
      name: "Cassandra",
      description: "Distributed, disk-based database with different durability guarantees",
      slug: "cassandra",
    },
    {
      name: "Kafka",
      description: "Event streaming platform instead of an in-memory cache",
      slug: "kafka",
    },
  ],
};