// src/content/deep-dive/articles/sstable.ts

import { DeepDiveArticle } from '@/features/deep-dive/types';
import { SSTableIllustration } from '@/content/deep-dive/illustrations/SSTable';

export const article: DeepDiveArticle = {
  slug: 'sstable',
  category: 'db',
  readTime: '10 min',
  name: 'SSTable',
  eyebrow: 'ON-DISK · LSM-TREE',
  description: 'An SSTable (Sorted String Table) is the immutable file a memtable turns into once it\'s flushed. It\'s how LSM-tree databases like Cassandra, RocksDB, and LevelDB keep writes sequential and reads bounded, even as data piles up.',
  heroIllustration: SSTableIllustration,

  tags: ['Immutable file', 'LSM-tree', 'Sorted on disk'],
  credit: 'Core concept in',
  creditOrg: 'Cassandra, RocksDB, LevelDB, HBase, BigTable',
  docsUrl: 'https://cassandra.apache.org/doc/latest/cassandra/architecture/storage_engine.html',
  title: 'The SSTable, and why immutability makes disk cheap again',
  lede: 'A flushed memtable has to land somewhere on disk, and how it lands matters more than where. An SSTable is written once, sequentially, sorted by key, and then never touched again. No in-place edits means no random writes later — just new files appearing, and old ones eventually disappearing. Everything about how these databases read, delete, and clean up after themselves follows from that one rule.',

  sections: [
    {
      number: 1,
      title: 'Born from a flush',
      content: [
        [
          { type: 'text', text: 'An SSTable doesn\'t start as a design decision — it starts as a ' },
          {
            type: 'link',
            text: 'memtable',
            href: { type: 'deep-dive', target: 'memtable', preview: 'The in-memory, sorted write buffer that fills up and gets flushed to disk' }
          },
          { type: 'text', text: ' that filled up. Because the memtable was already sorted in memory, writing it out is a single sequential pass: no seeking, no re-sorting, just streaming sorted key-value pairs straight to disk.' }
        ],
        [
          { type: 'text', text: 'Once that write finishes, the file is done. There\'s no API for updating a value inside an SSTable — the only ways an SSTable\'s contents ever change are by being merged with others during compaction, or by being deleted once nothing needs it anymore.' }
        ]
      ],
      illustration: {
        component: 'SSTableFlushIllustration',
        caption: 'A frozen memtable streams out as one sequential, sorted file',
        width: 'full'
      }
    },

    {
      number: 2,
      title: 'What\'s actually inside one',
      content: [
        [
          { type: 'text', text: 'An SSTable is more than a flat list of key-value pairs. Most implementations split it into a few components on disk, each solving a different part of "find this key fast without reading the whole file":' }
        ]
      ],
      code: `// Rough shape of an SSTable's components on disk

Data file      → sorted key/value pairs, written sequentially
Index file     → sparse map: key → byte offset in the data file
Bloom filter   → "definitely not here" / "maybe here" for a key,
                 checked before ever touching disk
Summary/footer → metadata: key range, file size, checksums

// A point read for a key:
if (!bloomFilter.mightContain(key)) return NOT_FOUND; // skip the file entirely
const offset = index.findNearest(key);                // narrow to a small range
return dataFile.scanFrom(offset, key);                // one small disk read`,
      callout: {
        label: 'Worth remembering',
        content: [
          [
            { type: 'text', text: 'The bloom filter is what keeps a database from having to ', bold: false },
            { type: 'text', text: 'open and scan every single SSTable', bold: true },
            { type: 'text', text: ' on every read. It can be wrong in one direction only — it might say "maybe" for a key that isn\'t there, but it never says "no" for a key that is.' }
          ]
        ]
      }
    },

    {
      number: 3,
      title: 'One key, many SSTables',
      content: [
        [
          { type: 'text', text: 'Because each SSTable is immutable, a row that\'s been written to multiple times over its life doesn\'t get consolidated automatically. Its versions end up scattered: some in the current memtable, others in whichever SSTables happened to exist when each flush ran.' }
        ],
        [
          { type: 'text', text: 'A read for that key has to check all of them and keep only the newest value per column — the same reconciliation-at-read-time pattern that shows up anywhere writes are append-only.' }
        ]
      ],
      illustration: {
        component: 'SSTableReadPathIllustration',
        caption: 'A single key can have versions spread across several SSTables, reconciled at read time',
        width: 'full'
      }
    },

    {
      number: 4,
      title: 'Deletes are just another write',
      content: [
        [
          { type: 'text', text: 'An immutable file can\'t have a row physically removed from it. So a delete doesn\'t remove anything — it writes a special marker called a ' },
          { type: 'text', text: 'tombstone', bold: true },
          { type: 'text', text: ' for that key, which flows through the exact same write path as any other value.' }
        ]
      ],
      code: `10:00:00  write  user:42.status = "active"
10:00:05  delete user:42            → tombstone written, not a removal
10:00:06  read   user:42

// Read merges across the memtable and SSTables as usual,
// finds the tombstone has the newest timestamp, and returns:
return NOT_FOUND; // the tombstone "wins" the reconciliation`
    },

    {
      number: 5,
      title: 'Compaction: fewer files, no dead weight',
      content: [
        [
          { type: 'text', text: 'Left alone, SSTables only accumulate — more files to check on every read, and tombstones that never actually free any space. ' },
          { type: 'text', text: 'Compaction', bold: true },
          { type: 'text', text: ' merges several SSTables into one new SSTable: for each key, it keeps only the newest version, and drops any tombstoned row entirely once it\'s confident no older SSTable elsewhere still needs it.' }
        ],
        [
          { type: 'text', text: 'The old SSTables that went into the merge are deleted once the new one is safely written. Nothing is ever edited in place — even cleanup happens by producing a new immutable file and discarding the old ones.' }
        ]
      ],
      callout: {
        label: 'Trade being made',
        content: [
          [
            { type: 'text', text: 'Compaction spends ' },
            { type: 'text', text: 'disk and CPU rewriting data that hasn\'t changed', bold: true },
            { type: 'text', text: ', in exchange for ' },
            { type: 'text', text: 'fewer files and reclaimed space later', bold: true },
            { type: 'text', text: '. It\'s the same lazy-write, pay-later trade the whole storage engine is built on — just running one step further downstream.' }
          ]
        ]
      }
    },

    {
      number: 6,
      title: 'Why immutability was worth it',
      content: [
        [
          { type: 'text', text: 'A file that never changes is trivially easy to reason about: safe to read concurrently without locks, safe to cache, safe to replicate or back up mid-write. The cost is deferred and paid later — by reads that must check several files instead of one, and by compaction that must periodically clean up after them. That trade is the entire storage engine in miniature.' }
        ]
      ]
    }
  ],

  tradeoffs: {
    strengths: [
      'High write throughput that must stay sequential, never random, on disk',
      'Workloads where recent data is read far more often than old data',
      'Systems that already run background compaction to bound file count'
    ],
    weaknesses: [
      'Point-in-time consistency needs without merge-time reconciliation',
      'Very frequent updates to the same small set of keys (write amplification)',
      'Storage-constrained systems that can\'t tolerate temporary duplication during compaction'
    ]
  },

  related: [
    {
      name: 'Memtable',
      description: 'The in-memory buffer that becomes an SSTable once flushed',
      slug: 'memtable'
    },
    {
      name: 'Cassandra',
      description: 'The database whose storage engine is built on SSTables',
      slug: 'cassandra'
    }
  ]
};