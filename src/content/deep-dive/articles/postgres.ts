// src/content/deep-dive/articles/postgres.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Terms are referenced inside sections via ConceptReferenceBlock items.
 */
const glossary: Record<string, Concept> = {
  writeAheadLogging: {
    id: 'writeAheadLogging',
    term: 'Write-Ahead Logging (WAL)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A append-only log where changes are recorded sequentially to disk before being applied to the main database data pages. WAL guarantees ACID durability and enables point-in-time recovery (PITR) and streaming replication.'
          }
        ]
      }
    ],
    examples: [
      'Committing a transaction appends WAL records to disk via fsync before dirty heap pages are flushed by the background writer.'
    ],
    relatedConceptIds: ['mvccPostgres', 'streamingReplication']
  },
  mvccPostgres: {
    id: 'mvccPostgres',
    term: 'MVCC (Multi-Version Concurrency Control)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A concurrency architecture where transactions read isolated snapshots of database tuples. Postgres implements MVCC by attaching hidden xmin and xmax header fields to every physical tuple, ensuring readers and writers do not block each other.'
          }
        ]
      }
    ],
    examples: [
      'An UPDATE statement inserts a new row version with xmin set to the current transaction ID while closing the old tuple xmax.'
    ],
    relatedConceptIds: ['writeAheadLogging']
  },
  jsonb: {
    id: 'jsonb',
    term: 'JSONB Data Type',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A decomposed binary format for storing semi-structured JSON documents. Unlike raw JSON text, JSONB parses JSON once and supports GIN (Generalized Inverted Index) indexing for fast attribute lookups.'
          }
        ]
      }
    ],
    examples: [
      'Indexing document attributes using CREATE INDEX idx_user_prefs ON users USING gin (preferences jsonb_path_ops);'
    ],
    relatedConceptIds: ['postgresExtensions']
  },
  postgresExtensions: {
    id: 'postgresExtensions',
    term: 'Extension Architecture',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A modular plugin mechanism allowing custom C-based routines, spatial types, vector index algorithms, and custom background workers to integrate natively into Postgres engine execution paths.'
          }
        ]
      }
    ],
    examples: [
      'Loading PostGIS for geospatial analysis or pgvector for high-dimensional vector similarity searches.'
    ],
    relatedConceptIds: ['jsonb']
  },
  streamingReplication: {
    id: 'streamingReplication',
    term: 'Streaming Replication',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A high-throughput replication mechanism where the primary server streams WAL records byte-for-byte over network sockets to standby replicas, which continuously replay the WAL logs.'
          }
        ]
      }
    ],
    examples: [
      'Connecting a read-replica standby server via WAL sender processes to offload analytical read queries.'
    ],
    relatedConceptIds: ['writeAheadLogging']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'postgres',
    name: 'Postgres',
    eyebrow: 'RELATIONAL · SQL',
    description:
      'Postgres is a versatile open-source relational database emphasizing SQL compliance, extensibility, and strict ACID guarantees. Explore how MVCC tuple visibility, Write-Ahead Logging (WAL), JSONB indexing, and extensions work under the hood.',
    category: 'db',
    tags: ['Relational', 'ACID', 'Extensible', 'MVCC', 'WAL', 'SQL', 'Postgres'],

    // Publishing & Operations
    published: true,
    draft: false,
    version: '2.0.0',
    publishedAt: '2024-11-01',
    updatedAt: '2026-07-27',

    // Metrics & Attribution
    estimatedReadingMinutes: 12,
    credit: 'Maintained by',
    creditOrg: 'PostgreSQL Global Development Group',
    docsUrl: 'https://www.postgresql.org/docs/',

    // Discovery & Search Graph
    keywords: [
      'PostgreSQL Architecture',
      'Postgres MVCC',
      'Write Ahead Logging WAL',
      'JSONB Indexing GIN',
      'Postgres Extensions pgvector',
      'Streaming Replication',
      'ACID Guarantees',
      'Postgres Relational Engine'
    ],
    aliases: ['PostgreSQL', 'PostgresDB'],
    learningObjectives: [
      'Analyze how Postgres implements non-blocking concurrent reads and writes using MVCC xmin/xmax header metadata',
      'Trace how Write-Ahead Logs (WAL) guarantee physical durability and enable streaming replication',
      'Evaluate JSONB binary document storage and GIN indexing performance compared to traditional document stores',
      'Formulate extension strategies using PostGIS or pgvector to handle multi-model database workloads'
    ],
    difficulty: {
      level: 2,
      prerequisites: ['mvcc', 'sstable']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'PostgresIllustration',
    caption: 'Postgres core architecture bridging MVCC snapshot isolation, Write-Ahead Logging (WAL), and native extension hooks',
    alt: 'Diagram demonstrating Postgres primary process architecture connecting shared buffers, WAL logs, and background writers',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Postgres is the workhorse of relational databases—reliable, highly extensible, and battle-tested. Understanding its MVCC snapshot engine, Write-Ahead Logging (WAL), and modular extension architecture explains why it excels at handling complex multi-model workloads while maintaining strict ACID guarantees.'
        }
      ]
    }
  ],

  sections: [
    {
      id: 'mvcc-concurrency',
      number: 1,
      title: 'MVCC for Concurrency',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Postgres uses Multi-Version Concurrency Control (MVCC) to handle concurrent reads and writes without shared table locks. Every transaction operates against an isolated snapshot determined at the start of its query or transaction boundary.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Instead of mutating rows in place, updates append a new tuple stamped with '
            },
            {
              type: 'bold',
              text: 'xmin'
            },
            {
              type: 'text',
              text: ' (creating transaction) and '
            },
            {
              type: 'bold',
              text: 'xmax'
            },
            {
              type: 'text',
              text: ' (expiring transaction) metadata. Readers never block writers, and writers never block readers.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'mvccPostgres'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Deep Dive Connection',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'For a comprehensive analysis of row versioning, snapshot visibility evaluation, and autovacuum garbage collection, refer to our dedicated '
                },
                {
                  type: 'bold',
                  text: 'MVCC Deep Dive'
                },
                {
                  type: 'text',
                  text: ' article.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'write-ahead-logging',
      number: 2,
      title: 'Write-Ahead Logging (WAL) and Durability',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'All mutations are written sequentially to a Write-Ahead Log (WAL) on disk before the corresponding heap or index data pages are updated in shared memory buffer pools. This guarantees durability across hardware crashes.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Because WAL entries capture sequential physical byte modifications, they are also streamed across network sockets to standby nodes for real-time streaming replication and point-in-time recovery (PITR).'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'writeAheadLogging'
        },
        {
          type: 'concept-ref',
          conceptId: 'streamingReplication'
        },
        {
          type: 'code',
          language: 'sql',
          code: `-- Configuring strict physical WAL durability and replication streams
ALTER SYSTEM SET wal_level = 'replica';
ALTER SYSTEM SET synchronous_commit = 'on'; -- Waits for WAL fsync prior to transaction commit
SELECT pg_reload_conf();`
        }
      ]
    },

    {
      id: 'extensibility-jsonb',
      number: 3,
      title: 'Extensibility and JSONB',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Postgres provides exceptional extensibility, supporting custom data types, index access methods, and C-based procedural language bindings. Its native binary document format, '
            },
            {
              type: 'bold',
              text: 'JSONB'
            },
            {
              type: 'text',
              text: ', allows developers to store and index semi-structured document payloads alongside standard normalized relational tables.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'jsonb'
        },
        {
          type: 'concept-ref',
          conceptId: 'postgresExtensions'
        },
        {
          type: 'code',
          language: 'sql',
          code: `-- Hybrid document-relational querying with GIN indexing
CREATE TABLE customer_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  payload JSONB NOT NULL
);

-- Accelerating JSONB key lookup via Generalized Inverted Index (GIN)
CREATE INDEX idx_events_payload ON customer_events USING gin (payload);

-- Fast document attribute search inside SQL
SELECT * FROM customer_events 
WHERE payload @> '{"event_type": "checkout", "status": "completed"}';`
        }
      ]
    },

    {
      id: 'when-to-use-postgres',
      number: 4,
      title: 'When to Use Postgres—and When Not To',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Postgres is the default primary database for applications requiring strict ACID compliance, relational integrity, and complex multi-table joins. It scales vertically with high efficiency, but extremely distributed write workloads across multiple geographical locations can strain a single primary node architecture.'
            }
          ]
        },
        {
          type: 'tradeoff',
          title: 'Postgres Relational Engine vs. Distributed NoSQL Engine',
          description: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Evaluating Postgres against horizontally partitioned masterless distributed databases.'
                }
              ]
            }
          ],
          sides: [
            {
              name: 'PostgreSQL',
              pros: [
                'Full ACID compliance with strong transactional isolation',
                'Rich SQL query engine supporting CTEs, window functions, and complex joins',
                'Multi-model flexibility with JSONB, PostGIS, and pgvector extensions'
              ],
              cons: [
                'Write scaling is fundamentally tied to a single primary node capacity',
                'Vacuuming MVCC dead tuples adds background I/O maintenance overhead'
              ]
            },
            {
              name: 'Distributed NoSQL (e.g., Cassandra / DynamoDB)',
              pros: [
                'Linear horizontal scale for write-heavy multi-region workloads',
                'Masterless or partitioned architecture eliminates single-node primary write bottlenecks'
              ],
              cons: [
                'Limited transactional scope and lack of native multi-table joins',
                'Eventual consistency trade-offs require application-level conflict handling'
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
      title: 'MVCC Architecture',
      description: 'Explore xmin/xmax tuple version chains and visibility snapshots in depth.',
      url: '/deep-dive/mvcc',
      slug: 'mvcc',
      relationship: 'prerequisite'
    },
    {
      type: 'article',
      title: 'MongoDB Architecture',
      description: 'Compare Postgres JSONB capabilities head-to-head with MongoDB document collections.',
      url: '/deep-dive/mongodb',
      slug: 'mongodb',
      relationship: 'similar'
    },
    {
      type: 'article',
      title: 'Cassandra Architecture',
      description: 'Evaluate distributed write-heavy partitioning models vs single-primary relational databases.',
      url: '/deep-dive/cassandra',
      slug: 'cassandra',
      relationship: 'similar'
    }
  ]
};