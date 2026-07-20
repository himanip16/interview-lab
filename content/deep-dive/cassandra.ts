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
        'In a primary-replica database, every write eventually funnels through one node. That node is safe, but it\'s also a ceiling — you can\'t out-write it no matter how many replicas you add.',
        'Cassandra has no such node. Every peer in the ring can accept a write for any key, and simply forwards it to whichever nodes actually own that partition. Add a node, and you add write capacity, close to linearly. There\'s no primary to protect, which is also why there\'s no primary to lose.'
      ]
    },
    {
      number: 2,
      title: 'Why writes are fast',
      content: [
        'That raises the obvious question: if there\'s no locking, no primary coordinating things, what actually happens when data arrives? Two things, in a fixed order: it\'s appended to a <b>commit log</b> on disk — pure sequential I/O, about as cheap as disk access gets — and inserted into an in-memory table called a <b>memtable</b>. The write is acknowledged the moment both are done. No read-before-write, no row lookup, no lock to wait on.'
      ],
      callout: {
        label: 'Worth remembering',
        content: 'Cassandra never edits a row in place — not once, ever. An "update" is really just a newer fact appended alongside the old one, and later processes figure out which fact wins. That single refusal to edit in place is where almost all of Cassandra\'s write speed comes from.'
      }
    },
    {
      number: 3,
      title: 'Why reads are slower',
      content: [
        'But "never edit in place" has to catch up with you somewhere — and it catches up at read time. If a row has been written to five times, those five versions can be scattered across the memtable and several immutable files on disk called <b>SSTables</b>. A read can\'t just fetch the row; it has to go find every version of it and merge them, keeping only the most recent value for each column.',
        'Concretely: you write to `user:42` at 10:00:00, 10:00:04, and 10:00:09. Nothing is overwritten — all three writes exist somewhere on disk. When you read `user:42` at 10:00:10, Cassandra checks the memtable and every SSTable that might hold that key, then reconciles the three versions into one answer. Bloom filters help by ruling out SSTables that definitely don\'t contain the key, and background <b>compaction</b> periodically merges old SSTables together so there\'s less to reconcile — but the fundamental shape of a read is "gather, then merge," in a way a B-tree-indexed row store never has to do.'
      ]
    },
    {
      number: 4,
      title: 'When to reach for it — and when not to',
      content: [
        'All of this makes Cassandra\'s fit obvious once you see the shape of it: it\'s built for data that\'s mostly written, rarely edited, and read by a key you already know — not for data you\'ll want to slice and query in ways you haven\'t planned for. The write path forgives you for scale; the read path doesn\'t forgive you for guessing at your access patterns.'
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
      'Strong consistency Requirements (financial transactions)',
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