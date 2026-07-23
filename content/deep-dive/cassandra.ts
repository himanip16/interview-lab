import { DeepDiveArticle } from '@/features/deep-dive/types';

export const cassandraData: DeepDiveArticle = {
  slug: 'cassandra',
  name: 'Cassandra',
  eyebrow: 'WIDE-COLUMN · NoSQL',
  description: [
    '<b style="color:var(--ink)">Cassandra</b> is a distributed, wide-column NoSQL database built on one uncompromising priority: writes must never fail. Every node in the ring is an equal peer — there\'s no leader to bottleneck writes or become a single point of failure.',
    'That priority has a cost. Writes go straight to disk and memory with almost no work done up front — which is why they\'re so fast. Reads pay for that laziness later, by doing the reconciliation work writes skipped.'
  ],
  tags: ['Distributed', 'High write throughput', 'Eventually consistent'],
  credit: 'Maintained by',
  creditOrg: 'Apache Software Foundation',
  docsUrl: 'https://cassandra.apache.org/doc/latest/',
  title: 'Cassandra, and why writes are cheap but reads aren\'t',
  lede: 'Most databases treat a write as work: find the row, lock it, update it in place. Cassandra treats a write as a fact you\'re recording — never edited, only added to. That one decision explains almost everything else about how it behaves, including why it\'s the database people reach for when writes can never fall over: sensor data, event logs, anything append-heavy at massive scale.',

  sections: [
    {
      number: 1,
      title: 'No leader, no bottleneck',
      content: [
        [
          { type: 'text', text: 'In a primary-replica database, every write eventually funnels through one node. That node is safe, but it\'s also a ceiling — you can\'t out-write it no matter how many replicas you add.' }
        ],
        [
          { type: 'text', text: 'Cassandra has no such node. Every peer in the ring can accept a write for any key, using the same ' },
          {
            type: 'link',
            text: 'consistent hashing',
            href: { type: 'deep-dive', target: 'consistent-hashing', preview: 'How keys and nodes share one ring so only a slice moves on scale-up' }
          },
          { type: 'text', text: ' scheme to know which nodes actually own that partition.' }
        ],
        [
          { type: 'text', text: 'Add a node, and you add write capacity, close to linearly. There\'s no primary to protect, which is also why there\'s no primary to lose.' }
        ]
      ],
      illustration: {
        component: 'CassandraRingIllustration',
        caption: 'Every node is a peer — a write for any key can land on any node',
        width: 'full'
      }
    },

    {
      number: 2,
      title: 'Anatomy of a write',
      content: [
        [
          { type: 'text', text: 'If there\'s no locking and no primary coordinating things, what actually happens when data arrives? Two things, in a fixed order, and both are done before the client ever hears back:' }
        ]
      ],
      illustration: {
        component: 'CassandraWritePathIllustration',
        caption: 'Every write does exactly two things before it is acknowledged',
        width: 'full'
      },
      code: `// 1. Append to the commit log — pure sequential disk I/O,
//    write-ahead so a crash can't lose the write
commitLog.append(key, column, value, timestamp);

// 2. Insert into the memtable — an in-memory, sorted structure
memtable.put(key, column, value, timestamp);

// Acknowledge the client the instant both are done.
// No lookup of the existing row. No lock. No merge — yet.
return ACK;`,
      callout: {
        label: 'Worth remembering',
        content: [
          [
            { type: 'text', text: 'Cassandra never edits a row in place — not once, ever. An "update" is really just a ', bold: false },
            { type: 'text', text: 'newer fact appended alongside the old one', bold: true },
            { type: 'text', text: ', and later processes figure out which fact wins. That single refusal to edit in place is where almost all of Cassandra\'s write speed comes from.' }
          ]
        ]
      }
    },

    {
      number: 3,
      title: 'Why reads are slower',
      content: [
        [
          { type: 'text', text: '"Never edit in place" has to catch up with you somewhere — and it catches up at read time. Once a memtable fills up, it\'s flushed to disk as an immutable file called an ' },
          { type: 'text', text: 'SSTable', bold: true },
          { type: 'text', text: '. If a row has been written to five times across its life, those five versions can be scattered across the current memtable and several old SSTables. A read can\'t just fetch the row; it has to find every version of it and merge them, keeping only the most recent value for each column.' }
        ]
      ],
      illustration: {
        component: 'CassandraReadPathIllustration',
        caption: 'A read gathers every version of a key, then merges by timestamp',
        width: 'full'
      }
    },

    {
      number: 4,
      title: 'Walking through one key',
      content: [
        [
          { type: 'text', text: 'Concretely: you write to ' },
          { type: 'text', text: 'user:42', bold: true },
          { type: 'text', text: ' three times.' }
        ]
      ],
      code: `10:00:00  write user:42.status = "active"    → memtable
10:00:04  write user:42.status = "away"      → SSTable_1 (memtable flushed)
10:00:09  write user:42.status = "offline"   → memtable

// Read at 10:00:10:
// 1. Check the memtable            → finds "offline" @ 10:00:09
// 2. Check SSTable_1               → finds "away"    @ 10:00:04
// 3. Bloom filter rules out other SSTables that can't hold this key
// 4. Reconcile by timestamp        → "offline" wins, discard the rest

return { status: "offline" };  // newest timestamp, nothing else`
    },

    {
      number: 5,
      title: 'Compaction: paying down the read cost',
      content: [
        [
          { type: 'text', text: 'Left alone, the number of SSTables a read has to check only grows. ' },
          { type: 'text', text: 'Compaction', bold: true },
          { type: 'text', text: ' runs in the background, merging several SSTables into one, dropping every version of a key except the newest, and permanently discarding rows marked for deletion (called ' },
          { type: 'text', text: 'tombstones', bold: true },
          { type: 'text', text: '). It doesn\'t make an individual read faster than the moment it happened — it keeps reads from getting slower over time.' }
        ]
      ],
      callout: {
        label: 'Trade being made',
        content: [
          [
            { type: 'text', text: 'Compaction trades ' },
            { type: 'text', text: 'disk and CPU now', bold: true },
            { type: 'text', text: ' for ' },
            { type: 'text', text: 'fewer SSTables to reconcile later', bold: true },
            { type: 'text', text: '. It\'s the same lazy-write, pay-later idea as the write path, just running one step downstream.' }
          ]
        ]
      }
    },

    {
      number: 6,
      title: 'When to reach for it — and when not to',
      content: [
        [
          { type: 'text', text: 'All of this makes Cassandra\'s fit obvious once you see the shape of it: it\'s built for data that\'s mostly written, rarely edited, and read by a key you already know — not for data you\'ll want to slice and query in ways you haven\'t planned for. The write path forgives you for scale; the read path doesn\'t forgive you for guessing at your access patterns.' }
        ]
      ]
    }
  ],

  tradeoffs: {
    strengths: [
      'Write-heavy, append-only data (logs, events, metrics)',
      'Data naturally partitioned by a key you know in advance',
      'Can tolerate eventual consistency'
    ],
    weaknesses: [
      'Complex queries across many columns you didn\'t model for',
      'Strong consistency requirements (financial transactions)',
      'Small datasets where a single Postgres instance is simpler'
    ]
  },

  related: [
    {
      name: 'Redis',
      description: 'In-memory, single-threaded, different tradeoffs entirely',
      slug: 'redis'
    },
    {
      name: 'Kafka',
      description: 'Also append-only — but a log, not a database',
      slug: 'kafka'
    }
  ]
};
