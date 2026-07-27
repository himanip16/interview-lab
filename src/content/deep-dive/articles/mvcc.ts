// src/content/deep-dive/articles/mvcc.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Terms are referenced inside sections via ConceptReferenceBlock items.
 */
const glossary: Record<string, Concept> = {
  rowVersionStamping: {
    id: 'rowVersionStamping',
    term: 'xmin / xmax Row Versioning',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'System metadata fields attached to every physical tuple. xmin records the transaction ID that inserted the version, while xmax records the transaction ID that deleted or superseded it.'
          }
        ]
      }
    ],
    examples: [
      'An UPDATE statement populates xmax on the current tuple with the active transaction ID and inserts a new tuple with xmin set to that same ID.'
    ],
    relatedConceptIds: ['snapshotIsolation', 'vacuumGC']
  },
  snapshotIsolation: {
    id: 'snapshotIsolation',
    term: 'Snapshot Isolation',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A concurrency control state where a transaction sees a completely consistent view of the database as of the instant the transaction (or query) began, unaffected by concurrent uncommitted or later-committed writes.'
          }
        ]
      }
    ],
    examples: [
      'A long-running analytical query reading from a snapshot ignores concurrent updates made by online transaction processing (OLTP) workers.'
    ],
    relatedConceptIds: ['rowVersionStamping', 'writeSkew']
  },
  vacuumGC: {
    id: 'vacuumGC',
    term: 'Vacuum / Dead Tuple Garbage Collection',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'The process of scanning data pages to identify dead row versions—tuples where xmax is older than the oldest active transaction snapshot—and marking that physical storage as reusable.'
          }
        ]
      }
    ],
    examples: [
      'PostgreSQL autovacuum worker scanning heap pages to reclaim dead tuples and update visibility maps.'
    ],
    relatedConceptIds: ['tableBloat', 'rowVersionStamping']
  },
  tableBloat: {
    id: 'tableBloat',
    term: 'Table & Index Bloat',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'The accumulation of obsolete row versions and un-reclaimed dead space inside database heap files and B-tree indexes, leading to degraded sequential scan and index lookup performance.'
          }
        ]
      }
    ],
    examples: [
      'A high-frequency UPDATE table swelling from 1 GB of active data to 10 GB due to delayed autovacuum processing.'
    ],
    relatedConceptIds: ['vacuumGC']
  },
  writeSkew: {
    id: 'writeSkew',
    term: 'Write Skew Anomaly',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A concurrency anomaly under standard Snapshot Isolation where two concurrent transactions read overlapping datasets, satisfy a common domain invariant locally, and execute non-conflicting writes that collectively violate the invariant.'
          }
        ]
      }
    ],
    examples: [
      'Two doctors simultaneously requesting off-call duty when the constraint requires at least one doctor on call; both read the snapshot showing 2 active, and both successfully take off.'
    ],
    relatedConceptIds: ['snapshotIsolation']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'mvcc',
    name: 'MVCC',
    eyebrow: 'CONCURRENCY CONTROL · SNAPSHOTS',
    description:
      'Multi-Version Concurrency Control (MVCC) enables high-throughput concurrent reads and writes without mutual blocking. Learn how tuple versioning, xmin/xmax metadata, snapshot visibility, and background vacuuming work under the hood.',
    category: 'db',
    tags: ['Snapshot Isolation', 'No Read Locks', 'Row Versioning', 'Garbage Collection', 'PostgreSQL', 'InnoDB'],

    // Publishing & Operations
    published: true,
    draft: false,
    version: '2.0.0',
    publishedAt: '2024-11-10',
    updatedAt: '2026-07-27',

    // Metrics & Attribution
    estimatedReadingMinutes: 11,
    credit: 'Core concept in',
    creditOrg: 'PostgreSQL, MySQL (InnoDB), Oracle, SQL Server',
    docsUrl: 'https://www.postgresql.org/docs/current/mvcc.html',

    // Discovery & Search Graph
    keywords: [
      'MVCC Architecture',
      'Multi-Version Concurrency Control',
      'Snapshot Isolation',
      'xmin xmax PostgreSQL',
      'Dead Tuple Vacuuming',
      'Table Bloat',
      'Write Skew Anomaly',
      'InnoDB Undo Logs'
    ],
    aliases: ['Multi Version Concurrency Control', 'Snapshot Concurrency'],
    learningObjectives: [
      'Evaluate the architectural differences between traditional lock-based concurrency control and MVCC',
      'Trace how xmin and xmax header stamps determine row tuple visibility across transactions',
      'Construct transaction snapshot bounds to verify tuple visibility rules during concurrent mutations',
      'Identify vacuum garbage collection mechanics and diagnose common causes of table bloat'
    ],
    difficulty: {
      level: 2,
      prerequisites: ['sstable', 'cassandra']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'MVCCIllustration',
    caption: 'MVCC decouples concurrent readers and writers by maintaining version chains rather than in-place updates',
    alt: 'Diagram demonstrating multi-version row pointers separating active readers from active writers',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'The traditional approach to preventing concurrent data corruption is locking: readers block writers, writers block readers, and execution serializes. MVCC approaches concurrency differently: readers and writers never operate on the exact same snapshot of data. By maintaining historic row versions, readers access consistent snapshots while writers create new versions concurrently without mutual blocking.'
        }
      ]
    }
  ],

  sections: [
    {
      id: 'problem-with-locking-reads',
      number: 1,
      title: 'The Problem with Locking Reads',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'In a lock-based system, a long-running read query holds shared locks across target rows for its duration. Any writer attempting to mutate those rows must wait—not because data integrity is actively compromised, but because lock systems cannot distinguish between inspecting state and mutating state.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'MVCC eliminates read-write lock contention. Instead of forcing a writer to wait for active readers to release locks, the database engine creates a new physical version of the row. Existing readers continue processing the older version from their snapshot.'
            }
          ]
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'MVCCLockVsVersionIllustration',
          caption: 'Locking forces writers to wait on active readers; MVCC creates parallel versions so both execute without delay',
          alt: 'Visual comparison showing write blocking under shared locks versus non-blocking append under MVCC version chains',
          width: 'full'
        }
      ]
    },

    {
      id: 'row-as-version-chain',
      number: 2,
      title: 'Every Row Is Really a Chain of Versions',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Under MVCC, a logical table row is not an in-place mutable memory location. It is a linked sequence of physical row versions (tuples), each stamped with the transaction lifecycle that governs its visibility. PostgreSQL, for instance, embeds two hidden metadata columns in every tuple: '
            },
            {
              type: 'bold',
              text: 'xmin'
            },
            {
              type: 'text',
              text: ' (the transaction ID that created the version) and '
            },
            {
              type: 'bold',
              text: 'xmax'
            },
            {
              type: 'text',
              text: ' (the transaction ID that expired or deleted it).'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'rowVersionStamping'
        },
        {
          type: 'code',
          language: 'typescript',
          code: `// A row's lifecycle as a version chain (Postgres-style xmin/xmax)

// 1. Inserted by Transaction 100
{ id: 42, status: "active", xmin: 100, xmax: null }

// 2. Updated by Transaction 105:
// Rather than overwriting the slot, T105 closes the active version
// and appends a new physical tuple.
{ id: 42, status: "active", xmin: 100, xmax: 105 }  // Superseded tuple
{ id: 42, status: "away",   xmin: 105, xmax: null }  // Active current tuple

// A transaction started before T105 reads the xmin:100 / xmax:105 tuple ("active").
// A transaction started after T105 reads the xmin:105 / xmax:null tuple ("away").`
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Worth Remembering',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'An UPDATE operation in an MVCC database is functionally a DELETE followed by an INSERT: '
                },
                {
                  type: 'bold',
                  text: 'mark the old version closed, then append a new version'
                },
                {
                  type: 'text',
                  text: '. This append-only pattern mirrors LSM-tree write paths to achieve non-blocking concurrency.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'what-a-snapshot-is',
      number: 3,
      title: 'How Snapshot Visibility Works',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'When a transaction initiates a read under Snapshot Isolation, the engine captures a snapshot array consisting of active transaction IDs, low-water marks, and high-water marks. Every physical tuple encountered during page scans is evaluated against this snapshot state.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'A row version is visible to a snapshot if its creating transaction (xmin) was committed before snapshot creation AND its expiring transaction (xmax) is either unassigned or was uncommitted at the time of snapshot creation.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'snapshotIsolation'
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'MVCCSnapshotIllustration',
          caption: 'Transactions evaluate tuple visibility by checking xmin/xmax fields against their initial snapshot state',
          alt: 'Diagram showing transaction snapshot bounds comparing tuple xmin/xmax identifiers for visibility evaluation',
          width: 'full'
        }
      ]
    },

    {
      id: 'walking-through-one-row',
      number: 4,
      title: 'Trace: Concurrent Reader and Writer',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Consider a scenario where Transaction A initiates a long analytical read, after which Transaction B updates the target row and commits before Transaction A finishes.'
            }
          ]
        },
        {
          type: 'code',
          language: 'typescript',
          code: `// Timeline of concurrent execution under MVCC Snapshot Isolation

T1: Transaction A starts -> Captures Snapshot (active_txs: [])
T2: Transaction B (TxID 200) updates row 42 ("active" -> "away") and commits
    -> Tuple 1 (status: "active") updated to xmax: 200
    -> Tuple 2 (status: "away")   inserted with xmin: 200, xmax: null
T3: Transaction A executes SELECT status WHERE id = 42

// Evaluation by Transaction A:
// Tuple 2 has xmin = 200. Since TxID 200 was not committed when A took its snapshot at T1,
// Tuple 2 is invisible.
// Tuple 1 has xmin = 100 and xmax = 200. Since xmax (200) was not committed at T1,
// Tuple 1 remains visible to A.

return { status: "active" }; // Transaction A reads the consistent pre-update snapshot value`
        }
      ]
    },

    {
      id: 'garbage-collection-and-vacuum',
      number: 5,
      title: 'Old Versions Don\'t Clean Themselves Up',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Because updates append new versions rather than mutating data in place, historical tuples accumulate in heap files. Once no active transaction snapshot requires access to a historical version, that tuple becomes dead space.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Engine processes (such as PostgreSQL\'s '
            },
            {
              type: 'bold',
              text: 'autovacuum'
            },
            {
              type: 'text',
              text: ' or MySQL InnoDB\'s purge threads) clean up dead tuples asynchronously, marking page bytes as reusable for future inserts.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'vacuumGC'
        },
        {
          type: 'concept-ref',
          conceptId: 'tableBloat'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Trade-off Analysis',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'MVCC trades '
                },
                {
                  type: 'bold',
                  text: 'storage amplification and background garbage collection overhead'
                },
                {
                  type: 'text',
                  text: ' in exchange for '
                },
                {
                  type: 'bold',
                  text: 'non-blocking concurrent readers and writers'
                },
                {
                  type: 'text',
                  text: '. If background vacuuming lags behind high-frequency updates, tables experience severe bloat.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'when-to-use-and-limitations',
      number: 6,
      title: 'When to Reach for MVCC—and Its Anomalies',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'MVCC is the default concurrency model in modern relational databases because mixed OLTP and reporting workloads predominate. However, Snapshot Isolation does not eliminate all concurrent anomalies.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Two concurrent transactions under Snapshot Isolation can experience '
            },
            {
              type: 'bold',
              text: 'write skew'
            },
            {
              type: 'text',
              text: ', where each transaction reads overlapping snapshots, satisfies local conditions, and performs disjoint writes that violate global domain constraints. Resolving write skew requires explicit row locking (e.g., SELECT ... FOR UPDATE) or true Serializable Isolation.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'writeSkew'
        },
        {
          type: 'tradeoff',
          title: 'MVCC Snapshot Isolation vs. Lock-Based Strict Serializability',
          description: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Trade-offs between multi-version concurrency and strict pessimistic locking.'
                }
              ]
            }
          ],
          sides: [
            {
              name: 'MVCC (Snapshot Isolation)',
              pros: [
                'Concurrent reads and writes do not block each other',
                'Predictable latency for long-running analytical reporting queries',
                'High throughput across high-concurrency mixed OLTP workloads'
              ],
              cons: [
                'Requires background garbage collection (vacuum/purge) to reclaim dead space',
                'Susceptible to snapshot anomalies like write skew unless serializable checking is active'
              ]
            },
            {
              name: 'Strict 2-Phase Locking (2PL)',
              pros: [
                'Prevents all concurrency anomalies including write skew by default',
                'No storage bloat or tuple version chain overhead'
              ],
              cons: [
                'Shared read locks block incoming exclusive write locks',
                'High risk of deadlocks under severe concurrent access'
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
      title: 'SSTable Architecture',
      description: 'Explore append-only immutable storage files and version compaction in LSM engines.',
      url: '/deep-dive/sstable',
      slug: 'sstable',
      relationship: 'similar'
    },
    {
      type: 'article',
      title: 'Cassandra Architecture',
      description: 'Contrast MVCC snapshots with timestamp-based reconciliation and tombstones.',
      url: '/deep-dive/cassandra',
      slug: 'cassandra',
      relationship: 'similar'
    },
    {
      type: 'article',
      title: 'PostgreSQL Architecture',
      description: 'Deep dive into PostgreSQL page layouts, visibility maps, and autovacuum tuning.',
      url: '/deep-dive/postgres',
      slug: 'postgres',
      relationship: 'related'
    }
  ]
};