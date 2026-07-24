// src/content/deep-dive/articles/flink.ts

import { DeepDiveArticle } from '@/features/deep-dive/types';
import { FlinkIllustration } from '@/content/deep-dive/illustrations/Flink';

export const article: DeepDiveArticle = {
    heroIllustration: FlinkIllustration,
  slug: 'flink',
  category: 'streaming',
  readTime: '13 min',
  name: 'Flink',
  eyebrow: 'STREAM PROCESSING · STATEFUL',
  description: 'Flink is a distributed engine for processing data that never stops arriving. Instead of running a job over a fixed dataset and finishing, a Flink job runs continuously — reading events as they show up, keeping running state, and producing results as it goes. The hard part was never reading a stream fast. It\'s making a continuously running, distributed computation behave as if it never crashes, never double-counts, and never loses track of what it\'s already seen.',
  tags: ['Unbounded data', 'Exactly-once', 'Event time'],
  credit: 'Maintained by',
  creditOrg: 'Apache Software Foundation',
  docsUrl: 'https://nightlies.apache.org/flink/flink-docs-stable/',
  title: 'Flink, and how a stream that never ends stays exactly-once',
  lede: 'Batch processing has a natural finish line: the input is a fixed file, and when you\'ve read all of it, you\'re done. A stream has no finish line — events keep arriving, forever, and a job has to produce correct, complete-enough answers without ever getting to see "all the data" at once. Flink\'s whole design follows from taking that constraint seriously: state that lives as long as the job does, a notion of time that doesn\'t depend on when the engine happens to be running, and a way to recover from a crash without silently losing or duplicating a single event.',

  sections: [
    {
      number: 1,
      title: 'State that outlives any single event',
      content: [
        [
          { type: 'text', text: 'A stateless transformation — filter this, map that — is straightforward for any stream engine. What makes Flink\'s core hard is state: counting events per user, computing a running average, joining two streams over time. That state has to survive between events, survive parallel execution across many machines, and survive a crash.' }
        ],
        [
          { type: 'text', text: 'Flink partitions state the same way many distributed systems partition anything by key — hash the key, and use ' },
          {
            type: 'link',
            text: 'consistent hashing',
            href: { type: 'deep-dive', target: 'consistent-hashing', preview: 'How keys and nodes share one ring so only a slice moves on scale-up' }
          },
          { type: 'text', text: '-style partitioning to decide which parallel task instance owns which keys. Every key\'s state lives on exactly one task, so operators never have to coordinate across the network just to update a counter.' }
        ]
      ],
      illustration: {
        component: 'FlinkKeyedStateIllustration',
        caption: 'Each key\'s state is owned by exactly one parallel task instance',
        width: 'full'
      }
    },

    {
      number: 2,
      title: 'Where that state actually lives',
      content: [
        [
          { type: 'text', text: 'Keyed state has to be both fast to update and large enough to hold far more than fits comfortably in memory — a job tracking millions of users can\'t assume it all sits in RAM. Flink\'s most common production state backend, RocksDB, solves this with the same shape as an embedded ' },
          {
            type: 'link',
            text: 'LSM-tree',
            href: { type: 'deep-dive', target: 'sstable', preview: 'The immutable, on-disk file an LSM-tree flushes memory into' }
          },
          { type: 'text', text: ' database: writes land in an in-memory ' },
          {
            type: 'link',
            text: 'memtable',
            href: { type: 'deep-dive', target: 'memtable', preview: 'The in-memory, sorted write buffer that fills up and gets flushed to disk' }
          },
          { type: 'text', text: ' first, and get flushed to immutable, sorted files on disk once that buffer fills up.' }
        ]
      ],
      code: `// Conceptually, updating keyed state under the RocksDB backend
// is the same fast path a memtable gives any LSM-tree write:

function updateState(key, newValue) {
  rocksDbMemtable.put(key, newValue); // in-memory, sorted, fast
  // flushed to an on-disk SSTable later, same as any LSM-tree
}

// A checkpoint doesn't have to freeze the whole job to snapshot this —
// it can lean on the state backend's own on-disk files.`,
      callout: {
        label: 'Worth remembering',
        content: [
          [
            { type: 'text', text: 'Flink didn\'t invent a new storage engine for large keyed state — it reused one. The ', bold: false },
            { type: 'text', text: 'same append-only, flush-later design', bold: true },
            { type: 'text', text: ' that makes writes cheap in a database makes state updates cheap in a streaming job, for exactly the same reason.' }
          ]
        ]
      }
    },

    {
      number: 3,
      title: 'Event time versus the clock on the wall',
      content: [
        [
          { type: 'text', text: 'Events don\'t arrive in the order they happened. A mobile event generated at 10:00:01 might not reach the job until 10:00:40, stuck behind a spotty connection. If a job used wall-clock arrival time to decide what "the last five minutes" means, the same query would give different answers depending on network conditions — not on the data itself.' }
        ],
        [
          { type: 'text', text: 'Flink instead tracks ' },
          { type: 'text', text: 'event time', bold: true },
          { type: 'text', text: ': the timestamp embedded in the event itself. A ' },
          { type: 'text', text: 'watermark', bold: true },
          { type: 'text', text: ' flows through the job alongside the data, asserting "no more events older than this timestamp should show up now." Windows and aggregations wait for the watermark before finalizing a result, trading a little latency for an answer that doesn\'t depend on arrival order.' }
        ]
      ],
      illustration: {
        component: 'FlinkWatermarkIllustration',
        caption: 'Watermarks flow with the data, telling operators when a window is safe to close',
        width: 'full'
      }
    },

    {
      number: 4,
      title: 'Checkpointing: a snapshot without stopping the world',
      content: [
        [
          { type: 'text', text: 'A job that runs forever will eventually crash — a machine dies, a deploy restarts things, a network partition happens. Recovering means restoring every operator\'s state to a consistent point and replaying only what came after it. Flink does this with periodic checkpoints, using an algorithm derived from Chandy-Lamport distributed snapshots: special markers flow through the job alongside normal data, and each operator snapshots its own state exactly when a marker passes through it.' }
        ]
      ],
      code: `// Simplified checkpoint barrier flow
1. Job manager injects a checkpoint barrier at each source
2. Barrier flows downstream, interleaved with regular events
3. Each operator, on receiving the barrier:
     - snapshots its current state (e.g. to the RocksDB backend, then durable storage)
     - forwards the barrier to downstream operators
4. Once every operator has acknowledged, the checkpoint is complete

// On recovery: restore every operator's state from the last
// completed checkpoint, then replay source data from that point`
    },

    {
      number: 5,
      title: 'Where the events actually come from',
      content: [
        [
          { type: 'text', text: 'Checkpointing only delivers exactly-once results if the source can replay from an exact position and the sink can avoid double-writing on recovery. This is why Flink pairs so naturally with ' },
          {
            type: 'link',
            text: 'Kafka',
            href: { type: 'deep-dive', target: 'kafka', preview: 'The append-only log Flink jobs most commonly read from and write to' }
          },
          { type: 'text', text: ': Kafka\'s offsets give Flink an exact replay position per partition, and transactional writes back to Kafka (or an idempotent write to a database) let the sink side avoid duplicating output after a restart.' }
        ]
      ],
      illustration: {
        component: 'FlinkSourceSinkIllustration',
        caption: 'Exactly-once needs a replayable source and a deduplicating sink, not just checkpointing in the middle',
        width: 'full'
      }
    },

    {
      number: 6,
      title: 'When to reach for it — and when not to',
      content: [
        [
          { type: 'text', text: 'Flink earns its complexity when a computation genuinely needs to run continuously over unbounded data with correctness guarantees — fraud detection, real-time aggregation, sessionization, anything where "rerun the batch job tonight" isn\'t good enough. For data that arrives in convenient, bounded chunks, or where a short delay before results is completely fine, a scheduled batch job is simpler to write, simpler to debug, and cheaper to run.' }
        ]
      ]
    }
  ],

  tradeoffs: {
    strengths: [
      'Continuous computations over unbounded, real-time data streams',
      'Workloads needing exactly-once state consistency across failures',
      'Event-time semantics that must stay correct regardless of arrival order'
    ],
    weaknesses: [
      'Simple periodic batch jobs where a scheduled run is sufficient',
      'Small-scale pipelines where the operational overhead outweighs the benefit',
      'Teams without the operational maturity for checkpoint storage and backpressure tuning'
    ]
  },

  related: [
    {
      name: 'Kafka',
      description: 'The replayable, append-only log Flink most commonly reads from and writes to',
      slug: 'kafka'
    },
    {
      name: 'SSTable',
      description: 'The on-disk format underlying RocksDB, Flink\'s most common state backend',
      slug: 'sstable'
    },
    {
      name: 'Memtable',
      description: 'The in-memory write buffer that makes keyed state updates fast',
      slug: 'memtable'
    }
  ]
};