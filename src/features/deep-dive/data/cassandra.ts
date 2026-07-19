import { DeepDiveArticle } from '../types';

export const cassandraData: DeepDiveArticle = {
  slug: 'cassandra',
  name: 'Cassandra',
  eyebrow: 'WIDE-COLUMN · NoSQL',
  description: [
    '<b style="color:var(--ink)">Cassandra</b> is a distributed, wide-column NoSQL database. Every node in the ring is an equal peer — there\'s no single leader to bottleneck writes or become a point of failure.',
    'Writes go straight to a commit log and an in-memory table before being flushed, which is why write throughput is exceptional. Reads have to reconcile across replicas, which is why they\'re comparatively slower.'
  ],
  tags: ['Distributed', 'High write throughput', 'Eventually consistent'],
  credit: 'Maintained by',
  creditOrg: 'Apache Software Foundation',
  docsUrl: 'https://cassandra.apache.org/doc/latest/',
  title: 'Cassandra, and why writes are cheap but reads aren\'t',
  lede: 'Cassandra is the database people reach for when writes have to never fall over — sensor data, event logs, anything append-heavy at massive scale. Understanding why it\'s shaped that way makes the "when to use it" question answer itself.',
  sections: [
    {
      number: 1,
      title: 'No leader, no bottleneck',
      content: [
        'Every node in a Cassandra ring is a peer. There\'s no primary to route writes through and no single node that becomes the ceiling on throughput. A write can land on <b>any</b> node, which forwards it to the replicas actually responsible for that data\'s partition.',
        'This is the opposite of a traditional primary-replica setup, where writes fight for one primary\'s attention. It\'s also why Cassandra scales writes almost linearly — add nodes, get more write capacity, close to proportionally.'
      ]
    },
    {
      number: 2,
      title: 'Why writes are fast',
      content: [
        'A write does two things, in order: append to a <b>commit log</b> on disk (sequential I/O, cheap), then insert into an in-memory structure called a <b>memtable</b>. The write is acknowledged as soon as both are done — no read-before-write, no lock contention, no random disk seeks.'
      ],
      callout: {
        label: 'Worth remembering',
        content: 'When the memtable fills up, it\'s flushed to disk as an immutable <b>SSTable</b>. Cassandra never edits data in place — it only ever appends. That single decision is responsible for most of its write performance.'
      }
    },
    {
      number: 3,
      title: 'Why reads are slower',
      content: [
        'Because writes are append-only, a single row\'s data can be scattered across the memtable and several SSTables — a read has to check all of them and merge the results, picking the most recent version of each column along the way.',
        'Cassandra mitigates this with bloom filters (to skip SSTables that definitely don\'t contain the key) and periodic <b>compaction</b> (merging SSTables back together) — but the fundamental shape is still "gather and reconcile," which a B-tree-indexed row store doesn\'t have to do.'
      ]
    },
    {
      number: 4,
      title: 'When to reach for it — and when not to',
      content: []
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
