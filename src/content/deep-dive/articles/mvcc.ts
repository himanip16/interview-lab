// src/content/deep-dive/articles/mvcc.ts (Rewritten for Reader Experience)

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Terms are referenced inside sections via ConceptReferenceBlock items.
 */
const glossary: Record<string, Concept> = {
  rowVersionStamping: {
    id: 'rowVersionStamping',
    term: 'xmin / xmax Row Versioning (PostgreSQL Implementation Detail)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'PostgreSQL attaches two hidden metadata fields to every row version (a tuple is PostgreSQL\'s internal representation of one row version). xmin records the transaction ID that created this version; xmax records the transaction ID that ended it. These stamps enable the database to determine which row versions are visible to which transactions.'
          }
        ]
      }
    ],
    examples: [
      'A row inserted by transaction 100 has xmin=100, xmax=null. When transaction 105 updates it, the old version gets xmax=105, and a new version is created with xmin=105, xmax=null.'
    ],
    relatedConceptIds: ['snapshotIsolation', 'vacuumGC']
  },
  snapshotIsolation: {
    id: 'snapshotIsolation',
    term: 'Snapshot Isolation (MVCC Concept)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A transaction sees a consistent view of the database frozen at the moment the transaction started. Later updates by other transactions remain invisible to that snapshot, even if they commit. Different transactions can read different versions of the same row without blocking each other.'
          }
        ]
      }
    ],
    examples: [
      'An analytical query running for 10 minutes reads data as it existed when the query began, ignoring all updates that committed after that moment.'
    ],
    relatedConceptIds: ['rowVersionStamping', 'writeSkew']
  },
  vacuumGC: {
    id: 'vacuumGC',
    term: 'Vacuum / Garbage Collection (MVCC Concept)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'The cleanup process that identifies old row versions nobody needs anymore and reclaims the storage space. A version becomes unused when its xmax timestamp is older than the longest-running transaction snapshot.'
          }
        ]
      }
    ],
    examples: [
      'PostgreSQL\'s autovacuum worker scans pages and marks dead tuples as reusable; MySQL InnoDB\'s purge thread reclaims old undo logs.'
    ],
    relatedConceptIds: ['tableBloat', 'rowVersionStamping']
  },
  tableBloat: {
    id: 'tableBloat',
    term: 'Table Bloat (MVCC Trade-off)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'When garbage collection cannot keep up with updates, old row versions accumulate on disk, consuming storage and slowing down scans. The table grows even though the active data hasn\'t changed.'
          }
        ]
      }
    ],
    examples: [
      'An inventory table storing only 5 GB of current data but occupying 20 GB on disk due to millions of unreclaimed update versions.'
    ],
    relatedConceptIds: ['vacuumGC']
  },
  writeSkew: {
    id: 'writeSkew',
    term: 'Write Skew Anomaly (MVCC Limitation)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Two transactions read overlapping data from the same snapshot, each thinks a constraint is satisfied, then execute non-overlapping writes that collectively break the constraint. Snapshot Isolation cannot prevent this because the writes don\'t conflict.'
          }
        ]
      }
    ],
    examples: [
      'Two on-call doctors simultaneously request off-duty. Each reads the snapshot showing 2 doctors available, each thinks "there\'s still one left," and both go off-duty. Now zero doctors are available—the invariant is violated.'
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
      'Multi-Version Concurrency Control (MVCC) lets thousands of users read and update the same data simultaneously without waiting. Learn how version chains, transaction snapshots, and cleanup work together.',
    category: 'db',
    tags: ['Snapshot Isolation', 'No Read Locks', 'Row Versioning', 'Garbage Collection', 'PostgreSQL', 'InnoDB'],

    // Publishing & Operations
    published: true,
    draft: false,
    version: '3.0.0',
    publishedAt: '2024-11-10',
    updatedAt: '2026-07-31',

    // Metrics & Attribution
    estimatedReadingMinutes: 12,
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
      'Understand why MVCC solves the reader-blocking problem',
      'Trace how transaction snapshots and version timestamps determine what each reader sees',
      'Recognize why garbage collection is necessary and what happens if it falls behind',
      'Identify cases where MVCC snapshot isolation is sufficient vs. when serializable isolation is required'
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
    caption: 'MVCC: Readers work on old versions while writers create new ones, without blocking each other.',
    alt: 'Diagram showing multiple row versions in a chain, with different transactions accessing different versions simultaneously',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'A database faces a simple problem: thousands of users can read and update the same data at the same time. Locking solves correctness but creates waiting. A writer holds an exclusive lock; a reader must wait. MVCC solves the waiting problem differently: readers and writers work on different versions of the data simultaneously. Nobody waits.'
        }
      ]
    }
  ],

  sections: [
    {
      id: 'why-locking-fails',
      number: 1,
      title: 'Why Locking Creates Waiting',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Imagine a bank account. A long-running reporting query reads the balance for financial statements. At the same time, deposits and withdrawals need to update the same row.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Under traditional locking: the reader holds a shared read lock while examining the balance. The writer (deposit/withdrawal) arrives and needs an exclusive write lock. It must wait. The writer cannot proceed until the reader releases its lock. If the report takes 10 minutes, the deposit waits 10 minutes.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This waiting is frustrating but unnecessary. The reader doesn\'t need the absolute latest balance—it needs '
            },
            {
              type: 'bold',
              text: 'a consistent snapshot'
            },
            {
              type: 'text',
              text: ' from the moment the report started. The writer doesn\'t need to mutate the current value. It can '
            },
            {
              type: 'bold',
              text: 'create a new version'
            },
            {
              type: 'text',
              text: ' and leave the old version alone. Both proceed concurrently.'
            }
          ]
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'LockingVsVersioning',
          caption: 'Locking: writer waits for reader. MVCC: both proceed with different versions.',
          alt: 'Timeline showing write blocking under shared locks vs. non-blocking concurrent versions under MVCC',
          width: 'full'
        } as any // DiagramBlock
      ]
    },

    {
      id: 'the-mental-model',
      number: 2,
      title: 'The Core Idea: Applications See One Row, Databases Store Many',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'To your application, a row is a single object. You query row 42, you get one "customer" record. Internally, the database is storing multiple '
            },
            {
              type: 'bold',
              text: 'physical versions'
            },
            {
              type: 'text',
              text: ' of that row, each with a timestamp attached. When you read row 42, the database picks which version to show you based on when your transaction started.'
            }
          ]
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'RowVsVersions',
          caption: 'Logical view (one row) vs. physical reality (multiple versions).',
          alt: 'Diagram showing application seeing single row vs. storage layer containing version chain',
          width: 'full'
        } as any, // DiagramBlock
        {
          type: 'subsection',
          dotColor: undefined,
          title: 'A Simple Example: Delivery Order Status',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'A food delivery system tracks order status. Over 10 minutes:'
                }
              ]
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'code',
                  language: 'typescript',
                  code: `// Logical row: Order #5042
{ id: 5042, status: "pending", total: 12.50 }

// Physical reality: Three versions stored in the database

Version 1: Created at 2:00 PM
{ id: 5042, status: "pending", total: 12.50, created_by_tx: 100, ended_by_tx: null }

Version 2: Created at 2:02 PM (restaurant accepted)
{ id: 5042, status: "accepted", total: 12.50, created_by_tx: 105, ended_by_tx: null }

Version 3: Created at 2:08 PM (order delivered)
{ id: 5042, status: "delivered", total: 12.50, created_by_tx: 110, ended_by_tx: null }

// A reporting query that started at 2:03 PM reads Version 2 ("accepted")
// because that's the latest version that existed when the query began.
// The query does not see Version 3 ("delivered"), even though it was
// created before the query ends.`
                } as any // CodeBlock
              ]
            }
          ]
        } as any // SubsectionBlock
      ]
    },

    {
      id: 'how-versions-get-created',
      number: 3,
      title: 'How Updates Create Versions, Not Mutations',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'In traditional databases, UPDATE means: find the row, overwrite the bytes in place. The old value disappears forever.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'In MVCC, UPDATE means: mark the old version closed, then append a new version. This is append-only—similar to how log-structured engines work. The old version lives on, waiting to be garbage collected later.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'rowVersionStamping'
        } as any,
        {
          type: 'code',
          language: 'typescript',
          code: `// UPDATE order #5042 SET status = "accepted"
// This happens in two steps:

STEP 1: Close the old version
Version 1 (old):
{ id: 5042, status: "pending", 
  xmin: 100,      // Transaction 100 created it
  xmax: 105 }     // Transaction 105 closed it <-- NEW

STEP 2: Create a new version
Version 2 (new):
{ id: 5042, status: "accepted",
  xmin: 105,      // Transaction 105 created it
  xmax: null }    // Still active (not closed)`
            } as any,
        {
          type: 'table',
          headers: ['Field', 'Meaning', 'Example'],
          rows: [
            ['xmin', 'Transaction ID that created this version', '105'],
            ['xmax', 'Transaction ID that ended this version', '110 (or null if still active)'],
            ['version chain', 'All versions of one logical row', 'v1, v2, v3 linked together']
          ]
        } as any,
        {
          type: 'callout',
          variant: 'info',
          title: 'Key Insight',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'An UPDATE is really a DELETE + INSERT: "mark old closed, add new." This append-only pattern is why MVCC achieves non-blocking concurrency—writers are not overwriting data readers are accessing.'
                }
              ]
            }
          ]
        } as any
      ]
    },

    {
      id: 'how-snapshots-work',
      number: 4,
      title: 'Transaction Snapshots: The Rule for Which Versions You See',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'When a transaction starts, the database captures a snapshot: a frozen list of which transactions are still running at that moment. Every time you query a row, the database evaluates all versions and asks: "Which versions are valid for my snapshot?"'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'The rule is simple:'
            }
          ]
        },
        {
          type: 'callout',
          variant: 'concept',
          title: 'Visibility Rule',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'A version is visible to your snapshot if: (1) the transaction that created it (xmin) was committed before your snapshot started, AND (2) the transaction that closed it (xmax) is either absent or was not committed when your snapshot started.'
                }
              ]
            }
          ]
        },
        {
          type: 'subsection',
          title: 'Concrete Timeline: Two Concurrent Transactions',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Let\'s say an order row has two versions: pending and accepted. Two transactions run at the same time.'
                }
              ]
            },
            {
              type: 'code',
              language: 'typescript',
              code: `// Versions on disk:
v1: { status: "pending", xmin: 100, xmax: 105 }
v2: { status: "accepted", xmin: 105, xmax: null }

// Timeline:
T1: Transaction A starts (captures snapshot at T1)
T2: Transaction B updates the row (xmax=105, creates v2)
T3: Transaction B commits
T4: Transaction A queries the row

// What does A see?
// A's snapshot says: "Tx 100 is old, commit before me? Yes.
//                    Tx 105 is running when I started? Yes (not committed yet).
// Evaluation of v1: xmin (100) committed before A? YES
//                  xmax (105) committed before A? NO -> v1 IS VISIBLE
// Evaluation of v2: xmin (105) committed before A? NO -> v2 IS NOT VISIBLE

// Result: Transaction A reads "pending" even though accepted was committed first`
            } as any
          ]
        } as any,
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'SnapshotVisibilityTimeline',
          caption: 'Transaction A\'s snapshot determines which versions it sees.',
          alt: 'Timeline diagram showing two transactions with snapshot boundaries and version visibility decisions',
          width: 'full'
        },
        {
          type: 'concept-ref',
          conceptId: 'snapshotIsolation'
        }
      ]
    },

    {
      id: 'why-cleanup-is-necessary',
      number: 5,
      title: 'Old Versions Don\'t Disappear by Themselves',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Every UPDATE creates a new version and leaves the old one behind. Hours or days later, that old version becomes invisible to all snapshots. But storage space isn\'t automatically reclaimed.'
            }
          ]
        },
        {
          type: 'subsection',
          title: 'The Garbage Collection Problem',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'MVCC is like keeping old documents in an archive because someone might still be reading them. Garbage collection is the cleanup worker that removes documents nobody can access anymore.'
                }
              ]
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'A version can be safely deleted when its xmax timestamp is older than the oldest active transaction snapshot. At that point, no transaction will ever ask for that version again.'
                }
              ]
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'vacuumGC'
        },
        {
          type: 'subsection',
          title: 'Real Example: Inventory Updates',
          content: [
            {
              type: 'code',
              language: 'typescript',
              code: `// Inventory table: 1 row (product SKU: ABC123)
// Peak shopping hour: 1000 updates/minute for 60 minutes

Initial state: 5 GB (active product data)
After 60 minutes of updates: 20 GB on disk
  - 5 GB: current product data (qty, price, description)
  - 15 GB: old version accumulation (deleted prices, old quantities)

If garbage collection runs every 5 minutes:
  -> Result: stays ~5-6 GB. Old versions cleaned quickly.

If garbage collection runs every hour:
  -> Result: swells to 20 GB. Old versions pile up.
             Disk scans are 4x slower.
             This is "table bloat."`
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'tableBloat'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'The Trade-off',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'MVCC trades storage space and background cleanup overhead for the ability to read and write concurrently without locks. If garbage collection falls behind (autovacuum is too slow), tables bloat and performance degrades.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'when-mvcc-is-not-enough',
      number: 6,
      title: 'When Snapshot Isolation Breaks Down',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'MVCC snapshot isolation solves most problems. But it does not prevent all anomalies. There is one category of bugs that even snapshot isolation cannot catch.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'writeSkew'
        },
        {
          type: 'subsection',
          title: 'Write Skew: When Independent Writes Break Global Constraints',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Two transactions read overlapping data, each thinks a constraint is satisfied, then make non-overlapping updates that collectively violate the constraint.'
                }
              ]
            },
            {
              type: 'code',
              language: 'typescript',
              code: `// Constraint: At least one doctor must be on-call

Initial state: doctors = [Alice (on-call), Bob (on-call)]

Timeline:
T1: Doctor A starts transaction (snapshot: Alice=on, Bob=on)
T2: Doctor B starts transaction (snapshot: Alice=on, Bob=on)
T3: Doctor A reads: "2 on-call. I can go off." Commits.
T4: Doctor B reads: "2 on-call. I can go off." Commits.

Final state: doctors = [Alice (off), Bob (off)]

Problem: Nobody reads the other's update. Each wrote to a different row.
Snapshot isolation sees no conflict and allows both.
Result: Constraint violated. Zero doctors on-call.`
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Snapshot isolation cannot prevent write skew because there is no actual row-level conflict—each transaction writes to its own row. Fixing write skew requires either explicit row locking (SELECT ... FOR UPDATE) or true Serializable Isolation.'
            }
          ]
        }
      ]
    },

    {
      id: 'mvcc-vs-locking',
      number: 7,
      title: 'MVCC vs. Traditional Locking: Trade-offs',
      blocks: [
        {
          type: 'tradeoff',
          title: 'MVCC Snapshot Isolation vs. 2-Phase Locking (2PL)',
          description: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Both prevent dirty reads and lost updates. But they make different trade-offs.'
                }
              ]
            }
          ],
          sides: [
            {
              name: 'MVCC (Snapshot Isolation)',
              pros: [
                'Readers and writers do not block each other',
                'Long-running queries (reports, backups) do not stall concurrent updates',
                'Predictable, low latency for user-facing transactions',
                'High throughput under mixed read/write workloads'
              ],
              cons: [
                'Requires background garbage collection to reclaim old versions',
                'Storage overhead: multiple versions consume more disk space',
                'Risk of table bloat if garbage collection falls behind',
                'Cannot prevent write skew without additional locking or serializable mode'
              ]
            },
            {
              name: 'Strict 2-Phase Locking (2PL)',
              pros: [
                'Prevents all concurrency anomalies by default (including write skew)',
                'No storage overhead from multiple versions',
                'No background cleanup needed'
              ],
              cons: [
                'Shared read locks block exclusive write locks',
                'Writers must wait for active readers to finish',
                'High contention and deadlocks under concurrent access',
                'Long-running queries harm write latency significantly'
              ]
            }
          ],
          verdict: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Modern databases (PostgreSQL, MySQL, Oracle) default to MVCC because it handles mixed OLTP and reporting workloads better. When write skew is a concern, applications add explicit locking. When strict serializability is required, databases offer a serializable isolation level on top of MVCC.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'the-mental-model-closing',
      number: 8,
      title: 'The Core Mental Model',
      blocks: [
        {
          type: 'callout',
          variant: 'note',
          title: 'Remember This',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'MVCC does not make old data disappear. It delays deletion until no active transaction needs that version anymore. Readers ask not "what is the latest value?" but "which version existed in my snapshot?" Writers append new versions without erasing old ones. The entire system balances three forces: concurrency (readers and writers don\'t block), storage (old versions consume space), and cleanup (garbage collection reclaims dead space).'
                }
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
      description: 'Explore append-only immutable storage and version compaction—the storage pattern MVCC mirrors.',
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
      relationship: 'contrast'
    },
    {
      type: 'article',
      title: 'PostgreSQL Architecture',
      description: 'Deep dive into PostgreSQL page layouts, visibility maps, and autovacuum tuning.',
      url: '/deep-dive/postgres',
      slug: 'postgres',
      relationship: 'related'
    },
    {
      type: 'article',
      title: 'ACID Properties',
      description: 'Understand how MVCC provides isolation guarantees within the broader ACID transaction framework.',
      url: '/deep-dive/acid',
      slug: 'acid',
      relationship: 'prerequisite'
    },
    {
      type: 'article',
      title: 'Redis Architecture',
      description: 'Compare in-memory single-threaded Redis with disk-based MVCC databases for different use cases.',
      url: '/deep-dive/redis',
      slug: 'redis',
      relationship: 'contrast'
    },
    {
      type: 'article',
      title: 'Memtable Architecture',
      description: 'Learn how in-memory write buffers collect mutations before flushing to SSTables in MVCC-based systems.',
      url: '/deep-dive/memtable',
      slug: 'memtable',
      relationship: 'buildsOn'
    },
    {
      type: 'article',
      title: 'MongoDB Architecture',
      description: 'Explore MongoDB\'s document model and compare its concurrency control with traditional MVCC.',
      url: '/deep-dive/mongodb',
      slug: 'mongodb',
      relationship: 'similar'
    },
    {
      type: 'article',
      title: 'DynamoDB Architecture',
      description: 'Compare DynamoDB\'s single-table design and optimistic concurrency with MVCC approaches.',
      url: '/deep-dive/dynamodb',
      slug: 'dynamodb',
      relationship: 'similar'
    }
  ]
};