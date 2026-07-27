// Example: How the refactored Cassandra article would be structured
// This demonstrates how the new types handle the feedback points

import type {
  DeepDiveArticle,
  Section,
  ConceptExplanation,
  TradeoffAnalysis,
  Paragraph,
  ComparisonBlock,
} from "src/features/deep-dive/types";

/**
 * INTRO SECTION - Fixed introduction based on feedback #1
 * "Cassandra is built to remain writable even when individual machines fail."
 * (instead of "writes must never fail")
 */
const introductionLede: Paragraph[] = [
  {
    type: "text",
    text: "Cassandra is built to remain writable even when individual machines fail. To make this possible, every design decision in its storage engine—from the commit log to compaction—flows from a ",
  },
  {
    type: "bold",
    text: "single principle: never modify data in place.",
  },
  {
    type: "text",
    text: " This design trades complexity at read time for simplicity at write time.",
  },
];

/**
 * CONCEPT GLOSSARY - New feature allowing term definitions to be indexed
 * Addresses feedback #6 (partition key), explains consistency levels (#4)
 */
const conceptIndex: Record<string, ConceptExplanation> = {
  partitionKey: {
    term: "Partition Key",
    definition: [
      {
        type: "text",
        text: "The column(s) used to determine which replica nodes store a piece of data. Cassandra hashes the partition key to place data on the ring using consistent hashing.",
      },
    ],
    examples: [
      "In a user table: partition key = user_id",
      "In a time-series table: partition key = (sensor_id, date)",
    ],
    relatedTerms: ["clusteringColumn", "consistentHash"],
  },
  consistencyLevel: {
    term: "Consistency Level",
    definition: [
      {
        type: "text",
        text: "The number of replicas the coordinator waits for before acknowledging a read or write. Higher levels provide stronger consistency guarantees but risk unavailability.",
      },
    ],
    examples: [
      "ONE: Acknowledge after 1 replica responds (fastest, weakest)",
      "QUORUM: Acknowledge after majority of replicas respond (balanced)",
      "ALL: Acknowledge only after all replicas respond (strongest, slowest)",
    ],
    relatedTerms: ["coordinator", "capTheorem"],
  },
  coordinator: {
    term: "Coordinator",
    definition: [
      {
        type: "text",
        text: "The node that receives a client request. It becomes responsible for forwarding the write or read to the appropriate replica nodes and managing the consistency level.",
      },
    ],
    examples: [
      "Any peer in the ring can be a coordinator",
      "The coordinator role is per-request, not permanent",
    ],
    relatedTerms: ["partitionKey", "replica"],
  },
};

/**
 * WRITE PATH SECTION - Addresses feedback #3, #2 (coordinator), and #4 (consistency)
 * Now includes distributed replication, not just local writes
 */
const section1WritePath: Section = {
  number: 1,
  title: "The Write Path: Append-Only Design",
  lede: [
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
  content: [
    {
      type: "text",
      text: "Writes are appended to the commit log and inserted into the memtable without reading or modifying existing data.",
    },
  ],

  // Explains the role of coordinator (feedback #2)
  concepts: [
    conceptIndex.coordinator,
    conceptIndex.consistencyLevel,
    conceptIndex.partitionKey,
  ],

  // Shows replication happening across multiple nodes (feedback #3)
  diagrams: [
    {
      type: "dataflow",
      caption: "Write path across three replicas",
      alt: "Client sends write to coordinator node, which forwards to 3 replica nodes, each writing to commit log then memtable",
      source: "cassandra-write-distributed-flow.json",
      width: "full",
    },
  ],

  // Callout explaining coordinator role (feedback #2)
  callouts: [
    {
      type: "info",
      title: "What is the Coordinator?",
      content: [
        {
          type: "text",
          text: "The node receiving the request becomes the coordinator for that request. It isn't a permanent leader—it simply forwards the write to the replica nodes and waits for the configured consistency level. Once enough replicas acknowledge, the coordinator confirms to the client.",
        },
      ],
    },
  ],

  // Comparison of consistency levels (feedback #4)
  comparisons: [
    {
      title: "Consistency Level Tradeoffs",
      columnHeaders: {
        level: "Level",
        speed: "Speed",
        safety: "Durability",
        useCase: "When to Use",
      },
      rows: [
        {
          feature: "ONE",
          columns: {
            level: "ONE",
            speed: "Fastest",
            safety: "Weakest (1 replica)",
            useCase: "Non-critical data, high throughput",
          },
        },
        {
          feature: "QUORUM",
          columns: {
            level: "QUORUM",
            speed: "Balanced",
            safety: "Moderate (majority)",
            useCase: "Most applications",
          },
        },
        {
          feature: "ALL",
          columns: {
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

  resources: [
    {
      type: "article",
      title: "Consistent Hashing",
      description: "How Cassandra maps partition keys to nodes",
      slug: "consistent-hashing",
      url: "/deep-dives/consistent-hashing",
    },
  ],
};

/**
 * READ REPAIR SECTION - Addresses feedback #5
 */
const section3ReadRepair: Section = {
  number: 3,
  title: "Read Reconciliation and Repair",
  content: [
    {
      type: "text",
      text: "When Cassandra reads from multiple replicas, it's possible they return different values—some may be stale because their replica was offline. Cassandra resolves this using the timestamp on each version and merges all values.",
    },
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

  diagrams: [
    {
      type: "dataflow",
      caption: "Read repair: reconcile stale replicas after read",
      alt: "Read from 3 replicas: replica A offline, replica B stale (v1), replica C newest (v2). Cassandra returns v2, then repairs A and B in background.",
      source: "cassandra-read-repair-flow.json",
      width: "full",
    },
  ],

  callouts: [
    {
      type: "concept",
      title: "Why Read Repair?",
      content: [
        {
          type: "text",
          text: "Writes are one-way: they never read existing data. But this means stale data can accumulate on replicas that were briefly offline. Read repair heals these inconsistencies without forcing writes to verify current state.",
        },
      ],
    },
  ],
};

/**
 * ARTICLE-LEVEL TRADEOFF - Addresses feedback #9 (CAP theorem)
 */
const articleTradeoff: TradeoffAnalysis = {
  title: "Cassandra and the CAP Theorem",
  description: [
    {
      type: "text",
      text: "Cassandra chooses ",
    },
    {
      type: "bold",
      text: "availability and partition tolerance",
    },
    {
      type: "text",
      text: " over immediate consistency. During a network partition, Cassandra remains writable. Applications recover stronger consistency by choosing higher consistency levels or running explicit repair operations.",
    },
  ],
  sides: [
    {
      name: "Strong Consistency (like PostgreSQL)",
      pros: [
        "Every read sees the latest write",
        "Simple application logic",
      ],
      cons: [
        "Network partitions make system unavailable",
        "Coordination overhead on every write",
      ],
    },
    {
      name: "High Availability (like Cassandra)",
      pros: [
        "Writes succeed even during partitions",
        "No coordination bottleneck",
        "Better horizontal scaling",
      ],
      cons: [
        "Reads may see stale data",
        "Applications must handle eventual consistency",
        "Repair operations add background load",
      ],
    },
  ],
};

/**
 * MISSING SECTIONS ADDRESSED BY FEEDBACK
 */
const section2PartitionKeyAndReplication: Section = {
  number: 2,
  title: "Data Distribution: Partition Keys and Consistent Hashing",
  content: [
    {
      type: "text",
      text: "Everything in Cassandra starts with the partition key. It determines which nodes store the data.",
    },
  ],
  concepts: [
    conceptIndex.partitionKey,
    {
      term: "Clustering Column",
      definition: [
        {
          type: "text",
          text: "Additional columns that define sort order within a partition. They don't affect which replica stores the data, but they determine how data is ordered on disk.",
        },
      ],
      examples: [
        "Partition key: user_id | Clustering: timestamp (for time-series data)",
      ],
      relatedTerms: ["partitionKey"],
    },
  ],
  callouts: [
    {
      type: "warning",
      title: "Data Modeling Starts with Queries",
      content: [
        {
          type: "text",
          text: "Cassandra requires designing your schema around how you query data, not just what data you store. The partition key choice directly impacts query performance and data distribution.",
        },
      ],
    },
  ],
};

const section4ReadPath: Section = {
  number: 4,
  title: "The Read Path: Assembling Data from Many Sources",
  content: [
    {
      type: "text",
      text: "Cassandra reads check multiple sources in order: memtable, then Bloom filters and SSTables. Bloom filters prevent unnecessary disk reads for data that doesn't exist.",
    },
  ],
  diagrams: [
    {
      type: "flowchart",
      caption: "Read order: memtable → Bloom filter → SSTables → merge",
      alt: "Read checks memtable first, then bloom filter to determine if key is in SSTable range, then fetches from relevant SSTables, then merges results",
      source: "cassandra-read-order.json",
      width: "full",
    },
  ],
  callouts: [
    {
      type: "concept",
      title: "Why Bloom Filters Matter",
      content: [
        {
          type: "text",
          text: "Bloom filters answer 'is this key definitely not in this SSTable?' cheaply. They prevent reading thousands of disk blocks for a key that doesn't exist, which is critical when you have many SSTables from old compactions.",
        },
      ],
    },
  ],
};

const section5Compaction: Section = {
  number: 5,
  title: "Compaction: Cleaning Up Multiple Copies",
  lede: [
    {
      type: "text",
      text: "Over time, SSTables accumulate. Compaction merges them, discards old versions, and maintains the range structure for efficient reads.",
    },
  ],
  content: [
    {
      type: "text",
      text: "Cassandra offers several compaction strategies, each with different tradeoffs:",
    },
  ],
  comparisons: [
    {
      title: "Compaction Strategy Comparison",
      columnHeaders: {
        strategy: "Strategy",
        writeAmp: "Write Amplification",
        spaceAmp: "Space Efficiency",
        readAmp: "Read Amplification",
        useCase: "Best For",
      },
      rows: [
        {
          feature: "Size-Tiered",
          columns: {
            strategy: "Size-Tiered",
            writeAmp: "High",
            spaceAmp: "Moderate",
            readAmp: "Moderate",
            useCase: "Write-heavy workloads",
          },
        },
        {
          feature: "Leveled",
          columns: {
            strategy: "Leveled",
            writeAmp: "Very High",
            spaceAmp: "Excellent",
            readAmp: "Low",
            useCase: "Read-heavy workloads",
          },
        },
        {
          feature: "Time-Window",
          columns: {
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
  resources: [
    {
      type: "article",
      title: "LSM Trees and Compaction",
      description: "Deep dive into log-structured merge trees",
      slug: "lsm-trees",
      url: "/deep-dives/lsm-trees",
    },
    {
      type: "article",
      title: "Bloom Filters Explained",
      description: "How Bloom filters optimize reads in LSM systems",
      slug: "bloom-filters",
      url: "/deep-dives/bloom-filters",
    },
  ],
};

/**
 * COMPLETE ARTICLE STRUCTURE
 */
export const cassandraArticle: DeepDiveArticle = {
  slug: "cassandra-storage-engine",
  name: "Cassandra",
  eyebrow: "Distributed Databases",
  title: "How Cassandra Handles Writes: The Never-Modify-In-Place Principle",
  description:
    "Why Cassandra appends instead of modifies, and how that shapes every component",
  tags: ["database", "distributed-systems", "storage-engine", "cassandra"],
  category: "db",
  readTime: "15 min",
  credit: "Written by Himani Prasad",
  creditOrg: "Based on production experience at Uber",
  difficulty: "intermediate",

  lede: [
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

  sections: [
    section1WritePath,
    section2PartitionKeyAndReplication,
    section3ReadRepair,
    section4ReadPath,
    section5Compaction,
    {
      number: 6,
      title: "Why This Design Matters",
      content: [
        {
          type: "text",
          text: "Cassandra assumes writes are urgent and cleanup can wait. Every major component—the commit log, memtable, SSTables, tombstones, and compaction—exists to protect that assumption. Reads become more complicated because writes were intentionally kept simple. Understanding this tradeoff is key to knowing when to reach for Cassandra versus other databases.",
        },
      ],
    },
  ],

  concepts: conceptIndex,
  tradeoffs: [articleTradeoff],
  relatedArticles: [
    {
      slug: "lsm-trees",
      name: "LSM Trees",
      description:
        "The log-structured merge tree that powers Cassandra's storage engine",
      relationship: "buildsOn",
    },
    {
      slug: "consistent-hashing",
      name: "Consistent Hashing",
      description: "How Cassandra distributes data across the cluster",
      relationship: "buildsOn",
    },
    {
      slug: "bloom-filters",
      name: "Bloom Filters",
      description: "Probabilistic data structure for efficient read optimization",
      relationship: "buildsOn",
    },
  ],

  lastUpdated: "2024-12",
};