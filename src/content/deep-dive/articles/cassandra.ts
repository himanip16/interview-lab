// src/content/deep-dive/articles/cassandra.ts

import type { DeepDiveArticle, Concept } from "@/features/deep-dive/types";

/**
 * Top-Level Glossary (Single Source of Truth)
 * Terms are referenced inside sections via ConceptReferenceBlock items.
 */
const glossary: Record<string, Concept> = {
  partitionKey: {
    id: "partitionKey",
    term: "Partition Key",
    definition: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "The column(s) used to determine which replica nodes store a piece of data. Cassandra hashes the partition key to place data on the ring using consistent hashing.",
          },
        ],
      },
    ],
    examples: [
      "In a user table: partition key = user_id",
      "In a time-series table: partition key = (sensor_id, date)",
    ],
    relatedConceptIds: ["clusteringColumn", "consistencyLevel"],
  },
  clusteringColumn: {
    id: "clusteringColumn",
    term: "Clustering Column",
    definition: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Additional columns that define sort order within a partition. They don't affect which replica stores the data, but they determine how data is ordered on disk.",
          },
        ],
      },
    ],
    examples: [
      "Partition key: user_id | Clustering: timestamp (for time-series data)",
    ],
    relatedConceptIds: ["partitionKey"],
  },
  consistencyLevel: {
    id: "consistencyLevel",
    term: "Consistency Level",
    definition: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "The number of replicas the coordinator waits for before acknowledging a read or write. Higher levels provide stronger consistency guarantees but risk unavailability.",
          },
        ],
      },
    ],
    examples: [
      "ONE: Acknowledge after 1 replica responds (fastest, weakest)",
      "QUORUM: Acknowledge after majority of replicas respond (balanced)",
      "ALL: Acknowledge only after all replicas respond (strongest, slowest)",
    ],
    relatedConceptIds: ["coordinator"],
  },
  coordinator: {
    id: "coordinator",
    term: "Coordinator",
    definition: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "The node that receives a client request. It becomes responsible for forwarding the write or read to the appropriate replica nodes and managing the consistency level.",
          },
        ],
      },
    ],
    examples: [
      "Any peer in the ring can be a coordinator",
      "The coordinator role is per-request, not permanent",
    ],
    relatedConceptIds: ["partitionKey", "consistencyLevel"],
  },
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: "cassandra-storage-engine",
    name: "Cassandra",
    eyebrow: "DISTRIBUTED DATABASES",
    description:
      "Why Cassandra appends instead of modifies, and how that single choice shapes its entire storage engine—from commit logs to compaction.",
    category: "db",
    tags: ["database", "distributed-systems", "storage-engine", "cassandra"],

    // Publishing & Operations
    published: true,
    draft: false,
    version: "2.0.0",
    publishedAt: "2024-12-01",
    updatedAt: "2026-07-27",

    // Metrics & Attribution
    estimatedReadingMinutes: 15,
    credit: "Written by",
    creditOrg: "Himani Prasad (based on production experience at Uber)",
    docsUrl: "https://cassandra.apache.org/doc/latest/",

    // Discovery & Search Graph
    keywords: [
      "Cassandra",
      "NoSQL",
      "Storage Engine",
      "LSM Tree",
      "SSTable",
      "Commit Log",
      "Read Repair",
      "Consistency Level",
    ],
    aliases: ["Apache Cassandra", "Cassandra Architecture"],
    learningObjectives: [
      "Understand the never-modify-in-place append-only architecture",
      "Trace client writes across the coordinator node and replica ring",
      "Analyze read repair mechanisms and quorum-based consistency levels",
      "Compare size-tiered, leveled, and time-window compaction strategies",
    ],
    difficulty: {
      level: 3,
      prerequisites: ["lsm-trees", "consistent-hashing"],
    },
  },

  heroDiagram: {
    type: "diagram",
    renderEngine: "component",
    componentName: "CassandraOverviewIllustration",
    caption:
      "Cassandra distributed ring topology with client-coordinator write routing",
    alt: "Diagram showing a client sending requests to a coordinator node on a ring of 6 nodes",
    width: "full",
  },

  lede: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Cassandra is built to remain writable even when individual machines fail. To make this possible, every design decision in its storage engine flows from a ",
        },
        {
          type: "bold",
          text: "single principle: never modify data in place.",
        },
        {
          type: "text",
          text: " This design trades complexity at read time for simplicity at write time. Everything else—commit logs, memtables, SSTables, compaction, reconciliation—follows naturally.",
        },
      ],
    },
  ],

  sections: [
    {
      id: "write-path",
      number: 1,
      title: "The Write Path: Append-Only Design",
      lede: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "When a client sends a write request to Cassandra, it routes to any node in the ring. That node becomes the ",
            },
            {
              type: "bold",
              text: "coordinator",
            },
            {
              type: "text",
              text: " and orchestrates replication across the cluster.",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Writes are appended to the commit log and inserted into the memtable without reading or modifying existing data.",
            },
          ],
        },
        {
          type: "concept-ref",
          conceptId: "coordinator",
        },
        {
          type: "concept-ref",
          conceptId: "consistencyLevel",
        },
        {
          type: "diagram",
          renderEngine: "flowchart",
          definition: "cassandra-write-distributed-flow.json",
          caption: "Write path across three replicas",
          alt: "Client sends write to coordinator node, which forwards to 3 replica nodes, each writing to commit log then memtable",
          width: "full",
        },
        {
          type: "callout",
          variant: "info",
          title: "What is the Coordinator?",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "The node receiving the request becomes the coordinator for that request. It isn't a permanent leader—it simply forwards the write to the replica nodes and waits for the configured consistency level. Once enough replicas acknowledge, the coordinator confirms to the client.",
                },
              ],
            },
          ],
        },
        {
          type: "comparison",
          title: "Consistency Level Tradeoffs",
          columns: [
            { id: "level", label: "Level" },
            { id: "speed", label: "Speed" },
            { id: "safety", label: "Durability" },
            { id: "useCase", label: "When to Use" },
          ],
          rows: [
            {
              feature: "ONE",
              cells: {
                level: "ONE",
                speed: "Fastest",
                safety: "Weakest (1 replica)",
                useCase: "Non-critical data, high throughput",
              },
            },
            {
              feature: "QUORUM",
              cells: {
                level: "QUORUM",
                speed: "Balanced",
                safety: "Moderate (majority)",
                useCase: "Most applications",
              },
            },
            {
              feature: "ALL",
              cells: {
                level: "ALL",
                speed: "Slowest",
                safety: "Strongest (all replicas)",
                useCase: "Critical data only",
              },
            },
          ],
          caption:
            "Higher consistency levels trade write speed for stronger guarantees",
        },
      ],
    },

    {
      id: "data-distribution",
      number: 2,
      title: "Data Distribution: Partition Keys and Consistent Hashing",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Everything in Cassandra starts with the partition key. It determines which nodes store the data.",
            },
          ],
        },
        {
          type: "concept-ref",
          conceptId: "partitionKey",
        },
        {
          type: "concept-ref",
          conceptId: "clusteringColumn",
        },
        {
          type: "callout",
          variant: "warning",
          title: "Data Modeling Starts with Queries",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Cassandra requires designing your schema around how you query data, not just what data you store. The partition key choice directly impacts query performance and data distribution.",
                },
              ],
            },
          ],
        },
      ],
    },

    {
      id: "read-repair",
      number: 3,
      title: "Read Reconciliation and Repair",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "When Cassandra reads from multiple replicas, it's possible they return different values—some may be stale because their replica was offline. Cassandra resolves this using the timestamp on each version and merges all values.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "After discovering the newest version, Cassandra can repair stale replicas in the background, a process called ",
            },
            {
              type: "bold",
              text: "read repair",
            },
            {
              type: "text",
              text: ".",
            },
          ],
        },
        {
          type: "diagram",
          renderEngine: "flowchart",
          definition: "cassandra-read-repair-flow.json",
          caption: "Read repair: reconcile stale replicas after read",
          alt: "Read from 3 replicas: replica A offline, replica B stale (v1), replica C newest (v2). Cassandra returns v2, then repairs A and B in background.",
          width: "full",
        },
        {
          type: "callout",
          variant: "concept",
          title: "Why Read Repair?",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Writes are one-way: they never read existing data. But this means stale data can accumulate on replicas that were briefly offline. Read repair heals these inconsistencies without forcing writes to verify current state.",
                },
              ],
            },
          ],
        },
      ],
    },

    {
      id: "read-path",
      number: 4,
      title: "The Read Path: Assembling Data from Many Sources",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Cassandra reads check multiple sources in order: memtable, then Bloom filters and SSTables. Bloom filters prevent unnecessary disk reads for data that doesn't exist.",
            },
          ],
        },
        {
          type: "diagram",
          renderEngine: "flowchart",
          definition: "cassandra-read-order.json",
          caption: "Read order: memtable → Bloom filter → SSTables → merge",
          alt: "Read checks memtable first, then bloom filter to determine if key is in SSTable range, then fetches from relevant SSTables, then merges results",
          width: "full",
        },
        {
          type: "callout",
          variant: "concept",
          title: "Why Bloom Filters Matter",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Bloom filters answer 'is this key definitely not in this SSTable?' cheaply. They prevent reading thousands of disk blocks for a key that doesn't exist, which is critical when you have many SSTables from old compactions.",
                },
              ],
            },
          ],
        },
      ],
    },

    {
      id: "compaction",
      number: 5,
      title: "Compaction: Cleaning Up Multiple Copies",
      lede: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Over time, SSTables accumulate. Compaction merges them, discards old versions, and maintains the range structure for efficient reads.",
            },
          ],
        },
      ],
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Cassandra offers several compaction strategies, each with different tradeoffs:",
            },
          ],
        },
        {
          type: "comparison",
          title: "Compaction Strategy Comparison",
          columns: [
            { id: "strategy", label: "Strategy" },
            { id: "writeAmp", label: "Write Amplification" },
            { id: "spaceAmp", label: "Space Efficiency" },
            { id: "readAmp", label: "Read Amplification" },
            { id: "useCase", label: "Best For" },
          ],
          rows: [
            {
              feature: "Size-Tiered",
              cells: {
                strategy: "Size-Tiered",
                writeAmp: "High",
                spaceAmp: "Moderate",
                readAmp: "Moderate",
                useCase: "Write-heavy workloads",
              },
            },
            {
              feature: "Leveled",
              cells: {
                strategy: "Leveled",
                writeAmp: "Very High",
                spaceAmp: "Excellent",
                readAmp: "Low",
                useCase: "Read-heavy workloads",
              },
            },
            {
              feature: "Time-Window",
              cells: {
                strategy: "Time-Window",
                writeAmp: "Low",
                spaceAmp: "Good",
                readAmp: "Moderate",
                useCase: "Time-series data with TTL",
              },
            },
          ],
          caption:
            "No perfect strategy: choose based on your read/write ratio and retention needs",
        },
      ],
    },

    {
      id: "summary",
      number: 6,
      title: "Why This Design Matters",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Cassandra assumes writes are urgent and cleanup can wait. Every major component—the commit log, memtable, SSTables, tombstones, and compaction—exists to protect that assumption. Reads become more complicated because writes were intentionally kept simple. Understanding this tradeoff is key to knowing when to reach for Cassandra versus other databases.",
            },
          ],
        },
        {
          type: "tradeoff",
          title: "Cassandra and the CAP Theorem",
          description: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Cassandra chooses availability and partition tolerance over immediate consistency. During a network partition, Cassandra remains writable. Applications recover stronger consistency by choosing higher consistency levels or running explicit repair operations.",
                },
              ],
            },
          ],
          sides: [
            {
              name: "Strong Consistency (e.g., PostgreSQL)",
              pros: [
                "Every read sees the latest write",
                "Simple application reasoning and transaction guarantees",
              ],
              cons: [
                "Network partitions make system unavailable for writes",
                "Coordination overhead on every commit",
              ],
            },
            {
              name: "High Availability (e.g., Cassandra)",
              pros: [
                "Writes succeed even during network partitions",
                "Zero central coordination bottleneck",
                "Scales linearly across multiple data centers",
              ],
              cons: [
                "Reads may glimpse stale data briefly",
                "Applications must accommodate eventual consistency",
                "Background compaction and repair consume disk and memory resources",
              ],
            },
          ],
          verdict: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Use Cassandra when write availability across multiple regions is non-negotiable. Reach for traditional relational databases when cross-row immediate consistency and ACID transactions are hard requirements.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  glossary,

  resources: [
    {
      type: "article",
      title: "LSM Trees",
      description:
        "The log-structured merge tree that powers Cassandra's storage engine",
      url: "/deep-dive/lsm-trees",
      slug: "lsm-trees",
      relationship: "buildsOn",
    },
    {
      type: "article",
      title: "Consistent Hashing",
      description: "How Cassandra distributes data across the cluster ring",
      url: "/deep-dive/consistent-hashing",
      slug: "consistent-hashing",
      relationship: "buildsOn",
    },
    {
      type: "article",
      title: "Bloom Filters",
      description:
        "Probabilistic data structure for efficient read optimization",
      url: "/deep-dive/bloom-filters",
      slug: "bloom-filters",
      relationship: "buildsOn",
    },
  ],
};