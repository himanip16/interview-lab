// src/content/deep-dive/articles/memtable.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Terms are referenced inside sections via ConceptReferenceBlock items.
 */
const glossary: Record<string, Concept> = {
  memtable: {
    id: 'memtable',
    term: 'Memtable',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'An in-memory, sorted write buffer used in Log-Structured Merge-tree (LSM-tree) storage engines. It buffers incoming mutations, keeps keys sorted in real time, and serves recent reads before periodically flushing to an on-disk SSTable.'
          }
        ]
      }
    ],
    examples: [
      'Cassandra active memtable buffering user profile updates before flushing to disk',
      'RocksDB write buffer absorbing 100,000 key-value writes/sec in RAM'
    ],
    relatedConceptIds: ['commitLog', 'sstable', 'lsmTree']
  },
  commitLog: {
    id: 'commitLog',
    term: 'Commit Log (Write-Ahead Log)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'An append-only, durable log on disk where every mutation is written sequentially before or alongside insertion into the volatile memtable. It enables full state recovery if the database crashes before a flush.'
          }
        ]
      }
    ],
    examples: [
      'Replaying un-flushed commit log segments after a hardware power outage'
    ],
    relatedConceptIds: ['memtable', 'lsmTree']
  },
  sstable: {
    id: 'sstable',
    term: 'SSTable (Sorted String Table)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'An immutable file on disk holding key-value pairs sorted strictly by key. Flushed sequentially from frozen memtables, SSTables form the persistent disk hierarchy of an LSM-tree.'
          }
        ]
      }
    ],
    examples: [
      'A 64MB immutable SSTable created when a frozen memtable flushes sequentially to disk'
    ],
    relatedConceptIds: ['memtable', 'lsmTree']
  },
  lsmTree: {
    id: 'lsmTree',
    term: 'LSM-Tree (Log-Structured Merge-Tree)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A data structure optimized for write-heavy workloads. It converts random writes into high-throughput sequential writes by buffering updates in RAM (memtable) and flushing them as sorted, immutable disk files (SSTables).'
          }
        ]
      }
    ],
    examples: [
      'Storage engine strategy backing RocksDB, LevelDB, Apache Cassandra, and ScyllaDB'
    ],
    relatedConceptIds: ['memtable', 'sstable', 'commitLog']
  },
  skipList: {
    id: 'skipList',
    term: 'Skip List / Concurrent Skip List',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A probabilistic, sorted data structure offering O(log n) search, insertion, and deletion. Because it avoids rebalancing operations required by red-black trees, it enables efficient lock-free concurrent writes in multi-threaded memtables.'
          }
        ]
      }
    ],
    examples: [
      'ConcurrentSkipListMap driving concurrent memtable mutations in Java-based databases'
    ],
    relatedConceptIds: ['memtable', 'lsmTree']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'memtable',
    name: 'Memtable',
    eyebrow: 'IN-MEMORY · LSM-TREE',
    description:
      'A memtable is the in-memory, sorted write buffer in LSM-tree databases like Cassandra and RocksDB. Discover how it converts random writes into high-speed RAM inserts and sequential SSTable disk flushes.',
    category: 'db',
    tags: ['Write Buffer', 'LSM-Tree', 'Volatile Storage', 'Storage Engine', 'RocksDB', 'Cassandra'],

    // Publishing & Operations
    published: true,
    draft: false,
    version: '2.0.0',
    publishedAt: '2024-10-25',
    updatedAt: '2026-07-27',

    // Metrics & Attribution
    estimatedReadingMinutes: 9,
    credit: 'Core concept in',
    creditOrg: 'Cassandra, RocksDB, LevelDB, HBase',
    docsUrl: 'https://cassandra.apache.org/doc/latest/cassandra/architecture/storage_engine.html',

    // Discovery & Search Graph
    keywords: [
      'Memtable',
      'LSM-Tree',
      'Write-Ahead Log',
      'Commit Log',
      'SSTable',
      'Skip List',
      'Write Amplification',
      'Storage Engine'
    ],
    aliases: ['Memory Table', 'LSM Write Buffer'],
    learningObjectives: [
      'Understand how memtables convert random writes into fast, in-memory sorted inserts',
      'Analyze the interplay between volatile memtables and durable disk commit logs',
      'Trace the lifecycle of a memtable from active buffering to frozen SSTable flushing',
      'Evaluate read path overheads when data is split across memtables and immutable disk SSTables'
    ],
    difficulty: {
      level: 2,
      prerequisites: ['sstable']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'MemtableIllustration',
    caption: 'The memtable sits on the write path, keeping key-value data sorted in memory before sequential flush',
    alt: 'Diagram demonstrating incoming writes appending to a commit log and sorting inside an in-memory memtable',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Writing directly to arbitrary disk locations is slow due to random I/O overhead. Writing is fast when it simply appends to memory or the end of a log. The memtable acts as the primary write buffer in LSM-tree databases—holding new mutations in sorted RAM so they can later be flushed to disk in a single, high-speed sequential pass.'
        }
      ]
    }
  ],

  sections: [
    {
      id: 'write-first-stop',
      number: 1,
      title: "A Write's First Stop",
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'When a write arrives, an LSM-tree database does not perform in-place disk updates. There is no read-before-write, no row-level disk lock, and no random seeking. Instead, every incoming write lands simultaneously in two append-only structures.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'The first location is the '
            },
            {
              type: 'bold',
              text: 'Commit Log'
            },
            {
              type: 'text',
              text: ' (or Write-Ahead Log) on disk, ensuring durability across system crashes. The second is the '
            },
            {
              type: 'bold',
              text: 'Memtable'
            },
            {
              type: 'text',
              text: ', an in-memory structure that maintains keys in sorted order so subsequent reads and SSTable flushes can scan them sequentially.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'memtable'
        },
        {
          type: 'concept-ref',
          conceptId: 'commitLog'
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'MemtableWritePathIllustration',
          caption: 'Every write lands in two places before acknowledgment: the disk commit log and the in-memory memtable',
          alt: 'Diagram showing incoming write split sequentially into a persistent commit log and a sorted memtable',
          width: 'full'
        }
      ]
    },

    {
      id: 'why-memory-is-cheap',
      number: 2,
      title: 'Why Memory Makes This Cheap',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Memtables are backed by concurrent sorted data structures—most commonly a '
            },
            {
              type: 'bold',
              text: 'Skip List'
            },
            {
              type: 'text',
              text: ' or Red-Black Tree. Because operation occurs purely in RAM, maintaining key order requires only fast pointer manipulation without disk latency.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'skipList'
        },
        {
          type: 'code',
          language: 'javascript',
          code: `// Simplified write execution path in an LSM storage engine

function write(key, column, value, timestamp) {
  // 1. Sequential disk append for crash recovery durability
  commitLog.append(key, column, value, timestamp);
  
  // 2. Fast O(log N) sorted insertion in RAM
  memtable.put(key, column, value, timestamp);
  
  return ACK;
}

// Subsequent mutations to the same key do not overwrite data in place;
// they append new timestamped versions to the sorted structure:
write("user:42", "status", "active", t0);
write("user:42", "status", "away", t1);   // both entries coexist in RAM
write("user:42", "status", "offline", t2); // until a flush consolidates state`
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
                  text: 'The memtable never mutates existing values in place. Multi-version concurrency control (MVCC) is maintained by piling up timestamped version entries. Conflict resolution and version merging are deferred to read time or compaction.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'when-it-fills-up',
      number: 3,
      title: 'What Happens When It Fills Up',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'A memtable operates under configured memory limits (e.g., 64MB or 128MB). Once this threshold is reached, the active memtable is marked as frozen (read-only), and a new empty memtable takes over write duties instantly so ingestion never stalls.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'A background thread flushes the frozen memtable to disk as an immutable '
            },
            {
              type: 'bold',
              text: 'SSTable'
            },
            {
              type: 'text',
              text: '. Because data was kept sorted in memory, writing the SSTable is a single, highly efficient sequential write pass. Upon completion, the frozen memtable and its associated commit log segment are garbage collected.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'sstable'
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'MemtableFlushIllustration',
          caption: 'When full, an active memtable freezes, flushes sequentially to an immutable disk SSTable, and releases memory',
          alt: 'Diagram demonstrating frozen memtable flushing sequentially to an immutable SSTable file on disk',
          width: 'full'
        }
      ]
    },

    {
      id: 'reading-split-data',
      number: 4,
      title: 'Reading While Data Is Split Across Memory and Disk',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'The primary trade-off of a memtable is increased read path complexity. Because data is spread across active RAM, frozen memtables, and multiple disk SSTables, a read query must check every active tier and merge candidate keys by timestamp to resolve the latest value.'
            }
          ]
        },
        {
          type: 'code',
          language: 'javascript',
          code: `// Multi-tier read execution path

function read(key) {
  // 1. Search active memtable in RAM
  const activeVal = activeMemtable.get(key);
  
  // 2. Search frozen memtables awaiting background flush
  const frozenVal = frozenMemtables.search(key);
  
  // 3. Search disk SSTables (assisted by Bloom Filters & Indexes)
  const diskVals = sstableSet.search(key);
  
  // 4. Merge versions by timestamp; latest timestamp wins
  return mergeLatestTimestamp([activeVal, frozenVal, ...diskVals]);
}`
        }
      ]
    },

    {
      id: 'losing-memory',
      number: 5,
      title: 'Losing Memory Means Losing the Memtable',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Memtables reside in volatile RAM. A sudden server failure or process restart clears all active memtable content. To preserve durability, the database reads the commit log on startup, replaying mutations recorded since the last completed SSTable flush to rebuild the memtable prior to accepting traffic.'
            }
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'The Essential Trade-Off',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'The memtable trades raw volatility for write throughput. It relies completely on the commit log for durability, allowing RAM pointer operations to stay on the critical fast path.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'why-this-design',
      number: 6,
      title: 'Why This Design—and What It Costs Later',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Buffering mutations in a sorted, in-memory structure transforms unpredictable random writes into predictable, sequential disk passes. However, generating many small SSTables increases read latency over time, requiring background compaction threads to merge overlapping files back together.'
            }
          ]
        },
        {
          type: 'tradeoff',
          title: 'In-Memory Write Buffering vs. Direct In-Place Disk Updates',
          description: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Analyzing the performance trade-offs between LSM memtable architectures and traditional B-Tree in-place update storage engines.'
                }
              ]
            }
          ],
          sides: [
            {
              name: 'LSM Memtable Engine (Cassandra, RocksDB)',
              pros: [
                'Extremely high write throughput via O(1) sequential commit log appends and RAM pointer updates',
                'Eliminates random disk write seeks completely during write execution',
                'Efficient storage layout due to immutable, sequentially compressed SSTables'
              ],
              cons: [
                'Higher read amplification (must check RAM memtables plus multiple disk SSTables)',
                'Compaction overhead required downstream to clean up obsolete timestamp versions'
              ]
            },
            {
              name: 'In-Place Storage Engine (B-Tree Databases)',
              pros: [
                'Fast point lookups by reading a single page in a unified index structure',
                'No downstream compaction needed; keys are updated directly on dedicated disk pages'
              ],
              cons: [
                'High write amplification and random I/O bottlenecks when updating arbitrary disk pages',
                'Risk of page fragmentation and complex lock contention under heavy parallel writes'
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
      description: 'The immutable on-disk file format flushed directly from frozen memtables.',
      url: '/deep-dive/sstable',
      slug: 'sstable',
      relationship: 'prerequisite'
    },
    {
      type: 'article',
      title: 'Cassandra Deep Dive',
      description: 'See how memtables and commit logs power distributed distributed NoSQL storage engines.',
      url: '/deep-dive/cassandra',
      slug: 'cassandra',
      relationship: 'similar'
    },
    {
      type: 'article',
      title: 'Flink State Backends',
      description: 'How RocksDB utilizes embedded memtables to provide low-latency state updates for streaming.',
      url: '/deep-dive/flink',
      slug: 'flink',
      relationship: 'buildsOn'
    }
  ]
};