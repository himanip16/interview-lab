// src/content/deep-dive/articles/mongodb.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Terms are referenced inside sections via ConceptReferenceBlock items.
 */
const glossary: Record<string, Concept> = {
  wiredTigerJournal: {
    id: 'wiredTigerJournal',
    term: 'WiredTiger Journal',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'An write-ahead transaction log on disk used by MongoDB’s default storage engine, WiredTiger. It records incoming mutations sequentially prior to flushing data files, ensuring durability across unexpected crashes.'
          }
        ]
      }
    ],
    examples: [
      'Batching in-memory mutations and committing them to the journal on disk every 100ms'
    ],
    relatedConceptIds: ['writeConcern', 'oplog']
  },
  writeConcern: {
    id: 'writeConcern',
    term: 'Write Concern',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A configurable guarantee level requested by a client that dictates when MongoDB acknowledges a write operation. Options range from w:1 (acknowledged by primary in RAM) to w:majority (persisted across a majority of replica set nodes).'
          }
        ]
      }
    ],
    examples: [
      'w:1 for high-throughput logging',
      'w:majority with j:true for financial updates requiring disk durability across a majority'
    ],
    relatedConceptIds: ['wiredTigerJournal', 'readConcern', 'oplog']
  },
  oplog: {
    id: 'oplog',
    term: 'Oplog (Operations Log)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A capped collection on the primary node that records a sequential stream of all data-modifying operations. Secondary nodes continuously tail and replay the oplog to maintain replica synchronicity.'
          }
        ]
      }
    ],
    examples: [
      'Secondaries tailing primary oplog entries over the network to catch up on replication lag'
    ],
    relatedConceptIds: ['writeConcern', 'readConcern']
  },
  readConcern: {
    id: 'readConcern',
    term: 'Read Concern',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A setting controlling the isolation and consistency guarantees of data returned by read queries. Controls whether queries return uncommitted local data ("local") or data confirmed as durable by a cluster majority ("majority").'
          }
        ]
      }
    ],
    examples: [
      'readConcern: "majority" to prevent dirty reads from uncommitted primary state that might roll back'
    ],
    relatedConceptIds: ['writeConcern', 'oplog']
  },
  shardKey: {
    id: 'shardKey',
    term: 'Shard Key',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'An indexed field or compound fields chosen to partition documents across shards in a distributed cluster. The shard key determines document distribution efficiency and prevents query routing bottlenecks.'
          }
        ]
      }
    ],
    examples: [
      'Hashing tenant_id as a shard key to evenly distribute tenant document chunks across shards'
    ],
    relatedConceptIds: ['writeConcern']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'mongodb',
    name: 'MongoDB',
    eyebrow: 'DOCUMENT · NoSQL',
    description:
      'MongoDB is a document store that trades default rigid guarantees for tuneable consistency per operation. Explore how WiredTiger journaling, write concerns, oplog replication, and sharding work under the hood.',
    category: 'db',
    tags: ['Document Store', 'WiredTiger', 'Replica Sets', 'Sharded Cluster', 'Write Concern', 'NoSQL'],

    // Publishing & Operations
    published: true,
    draft: false,
    version: '2.0.0',
    publishedAt: '2024-11-05',
    updatedAt: '2026-07-27',

    // Metrics & Attribution
    estimatedReadingMinutes: 12,
    credit: 'Maintained by',
    creditOrg: 'MongoDB Inc.',
    docsUrl: 'https://www.mongodb.com/docs/',

    // Discovery & Search Graph
    keywords: [
      'MongoDB Architecture',
      'WiredTiger Storage Engine',
      'Write Concern',
      'Read Concern',
      'Oplog Replication',
      'Replica Set Elections',
      'Multi-Document Transactions',
      'Shard Key Strategy'
    ],
    aliases: ['Mongo Architecture', 'Document Store Persistence'],
    learningObjectives: [
      'Differentiate between memory acknowledgment, journal durability, and majority replication',
      'Analyze the oplog tailing mechanics powering primary-to-secondary replication lag',
      'Evaluate read concern levels to eliminate dirty reads during node failover',
      'Formulate effective shard key strategies to eliminate write hotspots in sharded clusters'
    ],
    difficulty: {
      level: 2,
      prerequisites: ['kafka', 'memtable']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'MongoDBIllustration',
    caption: 'MongoDB write and replication lifecycle across WiredTiger memory, disk journal, and replica set oplogs',
    alt: 'Diagram demonstrating write flow from primary in-memory cache to journal log and secondary oplogs',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'When insertOne() returns a success acknowledgment, has your document survived a hardware crash? Not necessarily. The operational gap between "acknowledged in memory" and "durable on disk" forms the core of MongoDB’s architecture. Once you understand this spectrum of durability trade-offs, every design decision in MongoDB becomes clear.'
        }
      ]
    }
  ],

  sections: [
    {
      id: 'write-before-safe',
      number: 1,
      title: "The Write That Returns Before It's Safe",
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'When a write occurs, MongoDB updates the document in the WiredTiger internal cache and returns a success response almost instantly. The document sits in volatile memory while a record of the mutation is queued for the disk journal (a write-ahead log).'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'By default, MongoDB batches journal writes and flushes them to disk every 100ms. Instantaneous disk fsync calls per write would limit throughput to a few hundred writes per second. Batching disk writes into 100ms intervals allows throughput to reach tens of thousands of writes per second.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'wiredTigerJournal'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Worth Remembering',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'If a server crashes 50ms after an insert returns success under default write settings, that document can be lost despite the client having received a success response.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'choose-trust-level',
      number: 2,
      title: 'You Choose How Much You Trust the Write',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'MongoDB allows applications to specify durability requirements per operation using '
            },
            {
              type: 'bold',
              text: 'Write Concern'
            },
            {
              type: 'text',
              text: '.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Requesting '
            },
            {
              type: 'bold',
              text: 'w:1'
            },
            {
              type: 'text',
              text: ' triggers an acknowledgment as soon as the primary node applies the write in memory—fast, but vulnerable to crash loss before the next journal flush. Requesting '
            },
            {
              type: 'bold',
              text: 'w:majority'
            },
            {
              type: 'text',
              text: ' causes MongoDB to wait until a majority of replica set nodes acknowledge the update in memory or journal, ensuring survival even if the primary node crashes immediately after.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'writeConcern'
        },
        {
          type: 'code',
          language: 'javascript',
          code: `// Customizing durability per operation

// 1. Fast, memory-acknowledged write (higher throughput, risk of crash loss)
await db.collection('logs').insertOne(
  { event: 'page_view', ts: new Date() },
  { writeConcern: { w: 1, j: false } }
);

// 2. Strict durable write (waits for majority replication & journal flush)
await db.collection('orders').insertOne(
  { orderId: 'ord_9981', amount: 149.99 },
  { writeConcern: { w: 'majority', j: true, wtimeoutMS: 5000 } }
);`
        }
      ]
    },

    {
      id: 'secondary-visibility',
      number: 3,
      title: 'What a Secondary Sees—and When',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Every mutation on the primary is recorded sequentially in a special capped collection known as the '
            },
            {
              type: 'bold',
              text: 'oplog'
            },
            {
              type: 'text',
              text: '. Secondaries do not receive pushed writes directly; instead, they continuously pull and apply new oplog entries asynchronously.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'oplog'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Replication Lag Timeline Example',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '10:00:00.000 — Primary receives write and updates memory.\n10:00:00.004 — Client receives success response (w:1).\n10:00:00.022 — Secondary fetches the oplog entry over network.\n10:00:00.026 — Secondary applies mutation locally and catches up.\n\nDuring that 22-millisecond replication window, a query routed to the secondary node returns stale state.'
                }
              ]
            }
          ]
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'MongoDBReplicationIllustration',
          caption: 'Primary records writes to the oplog, which secondaries asynchronously tail and apply',
          alt: 'Diagram demonstrating oplog stream tailing from primary to secondary replica set nodes',
          width: 'full'
        }
      ]
    },

    {
      id: 'failover-and-read-concern',
      number: 4,
      title: 'When the Primary Dies: Read Isolation During Failover',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'If a primary node crashes mid-write, operations fall into two categories: those replicated to a majority before the crash, and those that were not. MongoDB resolves un-replicated write conflicts through '
            },
            {
              type: 'bold',
              text: 'Read Concern'
            },
            {
              type: 'text',
              text: ' settings.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Reading with '
            },
            {
              type: 'bold',
              text: '"local"'
            },
            {
              type: 'text',
              text: ' concern can return documents that might subsequently be rolled back if the old primary dies before replicating them. Reading with '
            },
            {
              type: 'bold',
              text: '"majority"'
            },
            {
              type: 'text',
              text: ' concern guarantees queries return only records confirmed by a majority of cluster nodes, eliminating dirty reads across failovers.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'readConcern'
        }
      ]
    },

    {
      id: 'multi-document-transactions',
      number: 5,
      title: 'Multi-Document Atomicity and Transactions',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Single-document updates are inherently atomic in MongoDB—even when updating nested sub-documents or array fields. Because document schemas embed related items inside a single record, single-document atomicity covers most standard CRUD operations.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'For operations spanning multiple collections or documents, MongoDB supports multi-document ACID transactions using snapshot isolation. Transactions enforce all-or-nothing execution across documents but incur locking and performance overhead. Transactions should be reserved for specific multi-document edge cases rather than primary application patterns.'
            }
          ]
        }
      ]
    },

    {
      id: 'sharding-and-scaling',
      number: 6,
      title: 'Horizontal Scale via Sharding',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'When dataset sizes or write throughput exceed single-replica capacity, MongoDB partitions collections across multiple replica sets (shards) using a defined '
            },
            {
              type: 'bold',
              text: 'Shard Key'
            },
            {
              type: 'text',
              text: '.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Choosing an effective shard key is critical. Selecting a monotonically increasing key (such as an auto-incrementing ID or timestamp) causes all new writes to target the single shard holding the latest range, creating write bottlenecks across the cluster.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'shardKey'
        }
      ]
    },

    {
      id: 'when-to-use',
      number: 7,
      title: 'When to Use MongoDB—and When to Avoid It',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'MongoDB provides flexible per-operation trade-offs across consistency, durability, and schema enforcement. It is well-suited for document-shaped domain models but adds overhead when rigid relational guarantees are required by default.'
            }
          ]
        },
        {
          type: 'tradeoff',
          title: 'Tuneable Document Store vs. Traditional Relational Database',
          description: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Comparing MongoDB’s per-operation consistency model with standard relational databases (e.g., PostgreSQL).'
                }
              ]
            }
          ],
          sides: [
            {
              name: 'Document Store (MongoDB)',
              pros: [
                'Schema flexibility allowing natural embedding of nested domain objects (orders, carts)',
                'Configurable per-operation durability and read isolation (Write & Read Concerns)',
                'Built-in horizontal partitioning (sharding) for large-scale datasets'
              ],
              cons: [
                'Uncommitted default reads (local concern) can suffer rollbacks during primary failover',
                'Multi-document transactions add higher latency overhead than relational joins'
              ]
            },
            {
              name: 'Relational Store (PostgreSQL)',
              pros: [
                'ACID transaction guarantees enforced strictly by default',
                'Powerful relational joins across deeply normalized table schemas',
                'Native JSONB support offers hybrid relational/document capability'
              ],
              cons: [
                'Schema migrations require explicit DDL updates across live collections',
                'Horizontal scaling requires manual application-level sharded routing'
              ]
            }
          ]
        }
      ]
    }
  ],

  glossary,

  resources: [
    {
      type: 'article',
      title: 'Kafka Architecture',
      description: 'Compare log-structured batch disk flushes between Kafka and WiredTiger journals.',
      url: '/deep-dive/kafka',
      slug: 'kafka',
      relationship: 'similar'
    },
    {
      type: 'article',
      title: 'Memtable Architecture',
      description: 'Explore write-ahead logs and volatile in-memory buffering mechanics.',
      url: '/deep-dive/memtable',
      slug: 'memtable',
      relationship: 'prerequisite'
    },
    {
      type: 'article',
      title: 'Cassandra Architecture',
      description: 'Analyze masterless distributed replication compared to MongoDB primary-secondary replica sets.',
      url: '/deep-dive/cassandra',
      slug: 'cassandra',
      relationship: 'similar'
    }
  ]
};