// src/content/deep-dive/articles/memtable.ts

import { DeepDiveArticle } from '@/features/deep-dive/types';
import { MemtableIllustration } from '@/content/deep-dive/illustrations/MemTable';

export const article: DeepDiveArticle = {
    heroIllustration: MemtableIllustration,
  slug: 'memtable',
  category: 'db',
  readTime: '9 min',
  name: 'Memtable',
  eyebrow: 'IN-MEMORY · LSM-TREE',
  description: 'A memtable is the in-memory, sorted buffer that every write hits first in an LSM-tree database like Cassandra, RocksDB, or LevelDB. It is the reason writes are fast: nothing touches disk in a random-access way until much later. A memtable is temporary by design. It fills up, gets frozen, flushed to disk as an immutable file, and thrown away — over and over, for as long as the database is running.',
  
  tags: ['Write buffer', 'LSM-tree', 'Volatile'],
  credit: 'Core concept in',
  creditOrg: 'Cassandra, RocksDB, LevelDB, HBase',
  docsUrl: 'https://cassandra.apache.org/doc/latest/cassandra/architecture/storage_engine.html',
  title: 'The memtable, and why writes are fast until memory runs out',
  lede: 'Writing to disk is slow when it means finding a specific spot and updating it. It\'s fast when it just means appending to the end of a list. The memtable is what lets a database pretend, for a little while, that every write is the second kind — holding new data in memory, sorted and ready, until there\'s enough of it to flush to disk in one efficient pass.',

  sections: [
    {
      number: 1,
      title: 'A write\'s first stop',
      content: [
        [
          { type: 'text', text: 'When a write arrives, the database doesn\'t go looking for the row it might be updating. There\'s no read-before-write, no lock, no in-place edit. The write goes to two places, both fast for the same reason: they only ever append.' }
        ],
        [
          { type: 'text', text: 'One is the commit log on disk — a write-ahead log that exists purely so a crash can\'t lose the write. The other is the memtable, an in-memory structure kept sorted by key, so that later reads and later flushes can walk it in order without re-sorting anything.' }
        ]
      ],
      illustration: {
        component: 'MemtableWritePathIllustration',
        caption: 'Every write lands in two places before it is acknowledged: the commit log and the memtable',
        width: 'full'
      }
    },

    {
      number: 2,
      title: 'Why memory makes this cheap',
      content: [
        [
          { type: 'text', text: 'A memtable is usually backed by a structure like a skip list or a red-black tree — something that keeps keys sorted while supporting fast inserts. Because it lives in RAM, insertion is just pointer manipulation, not disk seeks.' }
        ]
      ],
      code: `// Simplified shape of a write hitting the memtable
function write(key, column, value, timestamp) {
  commitLog.append(key, column, value, timestamp); // durability
  memtable.put(key, column, value, timestamp);      // sorted, in-memory
  return ACK;
}

// A later write to the same key doesn't overwrite anything —
// it's just another sorted entry with a newer timestamp.
write("user:42", "status", "active", t0);
write("user:42", "status", "away", t1);   // both entries live in the memtable
write("user:42", "status", "offline", t2); // until it's flushed`,
      callout: {
        label: 'Worth remembering',
        content: [
          [
            { type: 'text', text: 'The memtable never edits an existing entry in place — even repeated writes to the same key just ', bold: false },
            { type: 'text', text: 'pile up as separate, timestamped versions', bold: true },
            { type: 'text', text: '. Reconciling those versions is deferred to read time or flush time, never done eagerly on write.' }
          ]
        ]
      }
    },

    {
      number: 3,
      title: 'What happens when it fills up',
      content: [
        [
          { type: 'text', text: 'A memtable has a size threshold. Once it\'s hit, the active memtable is frozen — no more writes go into it — and a brand-new, empty memtable takes over immediately. Writes never have to pause and wait for a flush.' }
        ],
        [
          { type: 'text', text: 'The frozen memtable is then serialized to disk as an ' },
          { type: 'text', text: 'SSTable', bold: true },
          { type: 'text', text: ' (sorted string table): an immutable file, written in one sequential pass because the data was already sorted in memory. Once that flush finishes, the frozen memtable — and the portion of the commit log it covered — can be discarded.' }
        ]
      ],
      illustration: {
        component: 'MemtableFlushIllustration',
        caption: 'A full memtable is frozen, flushed to an immutable SSTable, then discarded',
        width: 'full'
      }
    },

    {
      number: 4,
      title: 'Reading while data is split across memory and disk',
      content: [
        [
          { type: 'text', text: 'This is where the memtable\'s cost shows up. A row\'s most recent value might be sitting in the active memtable, or it might already be flushed into one or more SSTables on disk. A read has to check the memtable first, then check the relevant SSTables, and merge whatever it finds by timestamp.' }
        ]
      ],
      code: `// Read for "user:42" arriving right after the writes above,
// but after a flush has already happened once:

// 1. Check the active memtable      → may or may not have this key
// 2. Check older, flushed SSTables  → older versions, if any
// 3. Merge everything by timestamp  → newest write wins

return { status: "offline" }; // whichever version has the latest timestamp`
    },

    {
      number: 5,
      title: 'Losing memory means losing the memtable',
      content: [
        [
          { type: 'text', text: 'The memtable is volatile. If the process crashes before a flush, everything in the active memtable disappears — which is exactly why the commit log exists. On restart, the database replays the commit log entries written since the last successful flush, rebuilding the memtable\'s contents before accepting new traffic.' }
        ]
      ],
      callout: {
        label: 'Trade being made',
        content: [
          [
            { type: 'text', text: 'The memtable trades ' },
            { type: 'text', text: 'durability for speed', bold: true },
            { type: 'text', text: ' on its own — it only survives a crash because the ' },
            { type: 'text', text: 'commit log pays that cost separately', bold: true },
            { type: 'text', text: ', on every write, so the fast path never has to.' }
          ]
        ]
      }
    },

    {
      number: 6,
      title: 'Why this design, and what it costs later',
      content: [
        [
          { type: 'text', text: 'Buffering writes in a sorted, in-memory structure is what turns "write anywhere" into "write sequentially" once it hits disk — that\'s the whole trick. The bill comes due downstream: more memtables flushed means more SSTables, which means more places a read has to check, and eventually more work for compaction to merge them back down.' }
        ]
      ]
    }
  ],

  tradeoffs: {
    strengths: [
      'Absorbing high write throughput without random disk I/O',
      'Keeping recently written data sorted and ready for a cheap flush',
      'Databases that already pair it with a write-ahead log for durability'
    ],
    weaknesses: [
      'Deployments with very limited RAM relative to write volume',
      'Workloads needing every write durable on disk before acknowledgment',
      'Read-heavy access patterns where checking memory plus many SSTables adds latency'
    ]
  },

  related: [
    {
      name: 'Cassandra',
      description: 'The database this write path and flush behavior belongs to',
      slug: 'cassandra'
    },
    {
      name: 'Redis',
      description: 'Also in-memory, but with no flush-to-immutable-file step',
      slug: 'redis'
    }
  ]
};