// src/content/deep-dive/articles/redis.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Terms are referenced inside sections via ConceptReferenceBlock items.
 */
const glossary: Record<string, Concept> = {
  eventLoopArchitecture: {
    id: 'eventLoopArchitecture',
    term: 'Single-Threaded Event Loop',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'An execution model where a single main thread processes incoming client requests sequentially using I/O multiplexing (e.g., epoll/kqueue). This eliminates OS thread context switching and lock contention over shared memory structures.'
          }
        ]
      }
    ],
    examples: [
      'Executing sequential INCR or ZADD commands without requiring thread synchronization primitives or mutexes.'
    ],
    relatedConceptIds: ['inMemoryDataStructures', 'appendOnlyFile']
  },
  inMemoryDataStructures: {
    id: 'inMemoryDataStructures',
    term: 'In-Memory Data Structures',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Specialized C data types—such as SkipLists for Sorted Sets, ZipLists/Listpacks for compact memory layout, and IntSets—optimized specifically for fast RAM access and minimal memory overhead.'
          }
        ]
      }
    ],
    examples: [
      'Using a SkipList under ZSETs to achieve O(log N) insertions and O(log N + M) range queries.'
    ],
    relatedConceptIds: ['eventLoopArchitecture']
  },
  rdbSnapshots: {
    id: 'rdbSnapshots',
    term: 'RDB (Redis Database) Persistence',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A persistence mechanism that creates point-in-time binary snapshots of the entire dataset on disk using the fork() system call and copy-on-write (COW) memory mechanics.'
          }
        ]
      }
    ],
    examples: [
      'Background BGSAVE worker dumping the current in-memory state to dump.rdb at regular time intervals.'
    ],
    relatedConceptIds: ['appendOnlyFile']
  },
  appendOnlyFile: {
    id: 'appendOnlyFile',
    term: 'Append-Only File (AOF)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A persistence log that appends every write command received by the server to disk. AOF offers higher durability than RDB snapshots by flushing logs periodically (e.g., every second).'
          }
        ]
      }
    ],
    examples: [
      'Replaying a sequential AOF log on server startup to reconstruct the exact database state.'
    ],
    relatedConceptIds: ['rdbSnapshots']
  },
  evictionPolicies: {
    id: 'evictionPolicies',
    term: 'Key Eviction Policies',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Rules dictating how Redis reclaims memory when memory limits (maxmemory) are reached, using algorithms like LRU (Least Recently Used), LFU (Least Frequently Used), or TTL expiration.'
          }
        ]
      }
    ],
    examples: [
      'Configuring maxmemory-policy volatile-lru to automatically drop keys with expiration times when memory is full.'
    ],
    relatedConceptIds: ['inMemoryDataStructures']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'redis',
    name: 'Redis',
    eyebrow: 'IN-MEMORY · KEY-VALUE',
    description:
      'Redis is an in-memory data structure store engineered for sub-millisecond operations. Learn how single-threaded event loops, RAM-native data structures, RDB/AOF persistence trade-offs, and memory eviction policies operate.',
    category: 'db',
    tags: ['In-memory', 'Key-Value', 'Single-Threaded', 'Caching', 'Redis', 'Pub/Sub'],

    // Publishing & Operations
    published: true,
    draft: false,
    version: '2.0.0',
    publishedAt: '2024-11-01',
    updatedAt: '2026-07-27',

    // Metrics & Attribution
    estimatedReadingMinutes: 10,
    credit: 'Maintained by',
    creditOrg: 'Redis Ltd',
    docsUrl: 'https://redis.io/docs/',

    // Discovery & Search Graph
    keywords: [
      'Redis Architecture',
      'Single-Threaded Event Loop',
      'Redis Data Structures',
      'RDB vs AOF Persistence',
      'Redis Memory Eviction',
      'Redis SkipList ZSET',
      'Sub-Millisecond Caching',
      'In-Memory Key-Value'
    ],
    aliases: ['Redis Cache', 'Redis In-Memory Store'],
    learningObjectives: [
      'Analyze how single-threaded I/O multiplexing eliminates lock contention and context-switching overhead',
      'Differentiate between RDB point-in-time snapshots and AOF append-only logging persistence strategies',
      'Evaluate internal RAM data structures including SkipLists, ZipLists, and Hashes for memory optimization',
      'Formulate key eviction strategies (LRU, LFU, TTL) for memory-bounded caching scenarios'
    ],
    difficulty: {
      level: 2,
      prerequisites: ['sstable', 'postgres']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'RedisIllustration',
    caption: 'Redis architecture combining an in-memory event loop, rich data structures, and asynchronous background persistence',
    alt: 'Diagram demonstrating Redis client event loop processing requests against in-memory key-value data structures',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Redis is the versatile Swiss Army knife of data stores—powering caching, distributed locks, session management, queues, and real-time leaderboards. Understanding its single-threaded event loop and RAM-first architecture reveals both the foundation of its sub-millisecond execution speeds and its operational limits.'
        }
      ]
    }
  ],

  sections: [
    {
      id: 'single-threaded-design',
      number: 1,
      title: 'Single-Threaded by Design',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Redis runs a single event loop that processes commands sequentially. While single-threaded processing might seem like a bottleneck, it eliminates CPU context switching, thread synchronization locks, and race conditions.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Because data resides entirely in system RAM and operations require no multi-threaded locking, Redis routinely processes hundreds of thousands to millions of operations per second on standard server hardware.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'eventLoopArchitecture'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Blocking Operation Risk',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Because command execution is single-threaded, long-running operations with high time complexities (such as KEYS * or heavy O(N) lua scripts) block all incoming requests on the instance until completion.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'rich-data-structures',
      number: 2,
      title: 'Data Structures Beyond Strings',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Redis is far more than a simple key-value string store. It natively implements hashes, linked lists, sets, sorted sets (ZSETs), bitmaps, HyperLogLogs, and geospatial indexes.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'These data structures are implemented using highly optimized memory representations (such as SkipLists for sorted sets and Listpacks for compact collections), allowing complex operations like range queries ('
            },
            {
              type: 'bold',
              text: 'ZRANGE'
            },
            {
              type: 'text',
              text: ') to complete in logarithmic time.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'inMemoryDataStructures'
        },
        {
          type: 'code',
          language: 'bash',
          code: `# Interacting with native Redis Sorted Sets (ZSET)
# Add members with scores in O(log N) time
ZADD leaderboard 1500 "user_alpha"
ZADD leaderboard 2200 "user_beta"
ZADD leaderboard 1800 "user_gamma"

# Retrieve top 2 users by score in descending order
ZREVRANGE leaderboard 0 1 WITHSCORES`
        }
      ]
    },

    {
      id: 'persistence-tradeoffs',
      number: 3,
      title: 'Persistence Options and Trade-offs',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'While dataset updates occur primarily in RAM, Redis supports configurable disk persistence via Point-in-Time RDB Snapshots or Append-Only File (AOF) logging.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'RDB offers fast recovery and compact backups by periodically dumping state via background copy-on-write forks, whereas AOF logs write commands continuously for maximum durability.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'rdbSnapshots'
        },
        {
          type: 'concept-ref',
          conceptId: 'appendOnlyFile'
        },
        {
          type: 'concept-ref',
          conceptId: 'evictionPolicies'
        }
      ]
    },

    {
      id: 'when-to-use-redis',
      number: 4,
      title: 'When to Use Redis—and When Not To',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Redis is ideal when sub-millisecond response time is required for caching, real-time counters, pub/sub messaging, or session management. It should not serve as a primary database for critical records unless paired with appropriate persistence and replication strategies.'
            }
          ]
        },
        {
          type: 'tradeoff',
          title: 'In-Memory Store vs. Disk-Backed Database',
          description: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Comparing pure in-memory execution against traditional persistent disk databases.'
                }
              ]
            }
          ],
          sides: [
            {
              name: 'In-Memory Store (Redis)',
              pros: [
                'Sub-millisecond read and write latency across operations',
                'Rich native data structures (Sorted Sets, Hashes, Bitmaps)',
                'Eliminates lock contention through a single-threaded event loop'
              ],
              cons: [
                'Total dataset capacity is bounded by available physical server RAM',
                'Single-threaded execution can be blocked by O(N) bulk commands',
                'Persistence models (RDB/AOF) trade throughput for durability guarantees'
              ]
            },
            {
              name: 'Disk-Backed Store (e.g., PostgreSQL / Cassandra)',
              pros: [
                'Dataset sizes can scale far beyond available physical RAM using disk storage',
                'Strict physical WAL durability guaranteed across system restarts',
                'Complex query engines supporting multi-table joins and ad-hoc filters'
              ],
              cons: [
                'Higher I/O access latency compared to direct RAM access',
                'Concurrency management requires locking or complex versioning (MVCC)'
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
      title: 'Cassandra Architecture',
      description: 'Explore distributed disk-based partitioning and append-only log storage.',
      url: '/deep-dive/cassandra',
      slug: 'cassandra',
      relationship: 'similar'
    },
    {
      type: 'article',
      title: 'Kafka Architecture',
      description: 'Compare Redis in-memory Pub/Sub with persistent event-streaming logs in Kafka.',
      url: '/deep-dive/kafka',
      slug: 'kafka',
      relationship: 'similar'
    },
    {
      type: 'article',
      title: 'PostgreSQL Architecture',
      description: 'Review relational disk storage and WAL persistence mechanics.',
      url: '/deep-dive/postgres',
      slug: 'postgres',
      relationship: 'related'
    }
  ]
};