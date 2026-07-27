// src/content/deep-dive/articles/sstable.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Terms are referenced inside sections via ConceptReferenceBlock items.
 */
const glossary: Record<string, Concept> = {
  sstable: {
    id: 'sstable',
    term: 'Sorted String Table (SSTable)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'An immutable, on-disk file containing sorted key-value pairs organized into data blocks with accompanying index blocks. SSTables are created when an in-memory memtable is flushed to disk.'
          }
        ]
      }
    ],
    examples: [
      'Flushing a 64 MB sorted memtable to disk creates a immutable SSTable file with a sparse key index and Bloom filter.'
    ],
    relatedConceptIds: ['memtable', 'compaction', 'bloomFilter']
  },
  memtable: {
    id: 'memtable',
    term: 'Memtable',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'An in-memory write buffer (typically implemented as a SkipList or ConcurrentSkipListMap) that buffers mutations in sorted order prior to flushing them sequentially to disk as an SSTable.'
          }
        ]
      }
    ],
    examples: [
      'Buffering incoming write mutations in RAM to preserve sequential I/O patterns when writing to persistent storage.'
    ],
    relatedConceptIds: ['sstable', 'tombstone']
  },
  bloomFilter: {
    id: 'bloomFilter',
    term: 'Bloom Filter',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A space-efficient probabilistic data structure that tests set membership. It can return false positives ("key might exist in SSTable") but never false negatives ("key definitely does not exist in SSTable").'
          }
        ]
      }
    ],
    examples: [
      'Checking an in-memory Bloom filter before reading an SSTable from disk to avoid unnecessary I/O for missing keys.'
    ],
    relatedConceptIds: ['sstable']
  },
  tombstone: {
    id: 'tombstone',
    term: 'Tombstone',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A specialized deletion marker appended with a timestamp to record the removal of a record in an append-only, immutable storage architecture.'
          }
        ]
      }
    ],
    examples: [
      'Writing a deletion record user:42 -> DELETED(timestamp: T2) so that read-time reconciliation masks older values.'
    ],
    relatedConceptIds: ['sstable', 'compaction']
  },
  compaction: {
    id: 'compaction',
    term: 'Compaction',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A background process that merges multiple immutable SSTables into new consolidated SSTables, discarding overwritten key versions and expired tombstones.'
          }
        ]
      }
    ],
    examples: [
      'Executing Size-Tiered or Leveled Compaction to combine overlapping SSTable files into a single merged file.'
    ],
    relatedConceptIds: ['sstable', 'tombstone']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'sstable',
    name: 'SSTable',
    eyebrow: 'ON-DISK · LSM-TREE',
    description:
      'An SSTable (Sorted String Table) is the immutable file a memtable becomes upon flushing. Discover how LSM-tree storage engines in Cassandra, RocksDB, and LevelDB maintain sequential write throughput, bounded reads, and background compaction.',
    category: 'db',
    tags: ['Immutable file', 'LSM-tree', 'Sorted on disk', 'SSTable', 'Storage Engine', 'Cassandra', 'RocksDB'],

    // Publishing & Operations
    published: true,
    draft: false,
    version: '2.0.0',
    publishedAt: '2024-11-01',
    updatedAt: '2026-07-27',

    // Metrics & Attribution
    estimatedReadingMinutes: 10,
    credit: 'Core concept in',
    creditOrg: 'Cassandra, RocksDB, LevelDB, HBase, BigTable',
    docsUrl: 'https://cassandra.apache.org/doc/latest/cassandra/architecture/storage_engine.html',

    // Discovery & Search Graph
    keywords: [
      'SSTable Architecture',
      'Sorted String Table',
      'LSM Tree Storage Engine',
      'Memtable Flush Mechanics',
      'Bloom Filter Optimization',
      'Tombstone Deletion Markers',
      'SSTable Compaction Algorithm',
      'Immutable Disk Files'
    ],
    aliases: ['Sorted String Table', 'LSM SSTable'],
    learningObjectives: [
      'Analyze how memtable flushes construct sequential, sorted immutable files on disk',
      'Evaluate the internal components of an SSTable including Data Files, Index Files, and Bloom Filters',
      'Trace read-time reconciliation mechanics across multiple SSTables for versioned keys',
      'Examine tombstone deletion lifecycles and background compaction merge algorithms'
    ],
    difficulty: {
      level: 2,
      prerequisites: ['memtable']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'SSTableIllustration',
    caption: 'SSTable disk architecture showing immutable key-value data blocks, sparse index offsets, and Bloom filter lookup paths',
    alt: 'Diagram demonstrating SSTable structure with data components, index files, and Bloom filter lookup paths',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'A flushed memtable has to land somewhere on disk, and how it lands matters more than where. An SSTable is written once, sequentially, sorted by key, and then never touched again. Eliminating in-place updates converts expensive random writes into fast sequential streams—shaping how LSM databases read, delete, and clean up data.'
        }
      ]
    }
  ],

  sections: [
    {
      id: 'born-from-a-flush',
      number: 1,
      title: 'Born from a Flush',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "An SSTable isn't a complex design choice—it is the direct output of a filled "
            },
            {
              type: 'bold',
              text: 'memtable'
            },
            {
              type: 'text',
              text: ' flushing to disk. Because the memtable keeps mutations sorted in RAM, writing it to storage requires a single sequential pass: no disk seeks, no re-sorting, just streaming key-value pairs straight to disk.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Once written, the SSTable file is frozen. There is no API for mutating values inside an existing SSTable. The file's contents only change when merged into a new SSTable during compaction, or deleted once obsolete."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'memtable'
        },
        {
          type: 'concept-ref',
          conceptId: 'sstable'
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'SSTableFlushIllustration',
          caption: 'A frozen in-memory memtable streams out sequentially as an immutable sorted SSTable file',
          alt: 'Diagram demonstrating a memtable in RAM streaming sorted key-value pairs sequentially into an SSTable on disk',
          width: 'full'
        }
      ]
    },

    {
      id: 'whats-inside-an-sstable',
      number: 2,
      title: "What's Actually Inside One",
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'An SSTable consists of more than just a raw list of key-value records. Most implementations partition the physical file into distinct structures on disk to solve a fundamental problem: finding keys rapidly without scanning the entire file.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'bloomFilter'
        },
        {
          type: 'code',
          language: 'typescript',
          code: `// Rough shape of an SSTable's components on disk

Data file      → sorted key/value pairs, written sequentially
Index file     → sparse map: key → byte offset in the data file
Bloom filter   → "definitely not here" / "maybe here" for a key,
                 checked before ever touching disk
Summary/footer → metadata: key range, file size, checksums

// Point read execution path for a target key:
if (!bloomFilter.mightContain(key)) return NOT_FOUND; // skip disk I/O entirely
const offset = index.findNearest(key);                // locate block offset
return dataFile.scanFrom(offset, key);                // single small disk read`
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Worth Remembering',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'The '
                },
                {
                  type: 'bold',
                  text: 'Bloom filter'
                },
                {
                  type: 'text',
                  text: ' prevents the database engine from scanning every on-disk SSTable during point queries. It is strictly one-sided: it may yield false positives ("key might exist"), but it never yields false negatives ("key definitely does not exist").'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'one-key-many-sstables',
      number: 3,
      title: 'One Key, Many SSTables',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Because SSTables are immutable, updating a single key multiple times produces multiple versions distributed across different SSTable files created by successive flush cycles.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'To resolve reads, the storage engine inspects relevant SSTables alongside the active memtable, executing read-time reconciliation to select the record with the newest timestamp.'
            }
          ]
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'SSTableReadPathIllustration',
          caption: 'Multiple versions of a key scattered across immutable SSTables reconciled during read execution',
          alt: 'Diagram demonstrating read reconciliation taking timestamped key versions across multiple SSTables',
          width: 'full'
        }
      ]
    },

    {
      id: 'deletes-are-just-another-write',
      number: 4,
      title: 'Deletes Are Just Another Write',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Since records cannot be physically edited or removed from an immutable file, deletions are handled by appending a marker known as a '
            },
            {
              type: 'bold',
              text: 'tombstone'
            },
            {
              type: 'text',
              text: '. Tombstones follow the exact same sequential write path as normal insertions.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'tombstone'
        },
        {
          type: 'code',
          language: 'typescript',
          code: `10:00:00  write  user:42.status = "active"
10:00:05  delete user:42            → tombstone written, not an immediate removal
10:00:06  read   user:42

// Read merges state across memtable and SSTables:
// The tombstone contains the latest timestamp (10:00:05) and overrides older values:
return NOT_FOUND; // Tombstone wins reconciliation`
        }
      ]
    },

    {
      id: 'compaction-fewer-files',
      number: 5,
      title: 'Compaction: Fewer Files, No Dead Weight',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Unchecked SSTable accumulation degrades read latency and accumulates stale tombstones. '
            },
            {
              type: 'bold',
              text: 'Compaction'
            },
            {
              type: 'text',
              text: ' merges overlapping SSTables in the background, consolidating key versions and discarding tombstones whose threshold ages have expired.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'compaction'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Trade Being Made',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Compaction trades background '
                },
                {
                  type: 'bold',
                  text: 'CPU and I/O write amplification'
                },
                {
                  type: 'text',
                  text: ' to gain '
                },
                {
                  type: 'bold',
                  text: 'bounded file descriptors, smaller storage footprint, and lower read latency'
                },
                {
                  type: 'text',
                  text: '. It defers the cost of maintaining clean indexes to asynchronous background tasks.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'why-immutability-was-worth-it',
      number: 6,
      title: 'Why Immutability Was Worth It',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Immutable files simplify concurrent storage engines: they are inherently thread-safe to read without shared locking, easily cached in OS page caches, and straightforward to stream for backup or replication.'
            }
          ]
        },
        {
          type: 'tradeoff',
          title: 'Immutable LSM SSTables vs. In-Place Update B-Trees',
          description: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Evaluating append-only immutable files against traditional in-place mutable page structures.'
                }
              ]
            }
          ],
          sides: [
            {
              name: 'Immutable SSTables (LSM-Tree)',
              pros: [
                'High write throughput using pure sequential disk I/O',
                'Lock-free reads against frozen disk structures',
                'Simple crash recovery with no fragmented partial page writes'
              ],
              cons: [
                'Read operations may need to query multiple SSTables (read amplification)',
                'Background compaction generates ongoing disk write amplification'
              ]
            },
            {
              name: 'In-Place Updates (B-Tree)',
              pros: [
                'Fast point reads hitting single target data pages',
                'No read-time reconciliation required across multiple files'
              ],
              cons: [
                'Random disk I/O writes when mutating scattered pages',
                'Requires complex page-level locking and write-ahead logging overhead'
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
      title: 'Memtable Architecture',
      description: 'Learn how in-memory write buffers collect and sort mutations before flushing SSTables.',
      url: '/deep-dive/memtable',
      slug: 'memtable',
      relationship: 'prerequisite'
    },
    {
      type: 'article',
      title: 'Cassandra Architecture',
      description: 'Explore how Apache Cassandra utilizes SSTables and compaction strategies at scale.',
      url: '/deep-dive/cassandra',
      slug: 'cassandra',
      relationship: 'similar'
    },
    {
      type: 'article',
      title: 'PostgreSQL Architecture',
      description: 'Compare append-only SSTable immutability with heap file and B-Tree page layouts.',
      url: '/deep-dive/postgres',
      slug: 'postgres',
      relationship: 'related'
    }
  ]
};