// src/content/deep-dive/articles/flink.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Terms are referenced inside sections via ConceptReferenceBlock items.
 */
const glossary: Record<string, Concept> = {
  keyedState: {
    id: 'keyedState',
    term: 'Keyed State',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'State maintained and partitioned per key value. Flink routes events with the same key to the same parallel task instance, enabling local state updates without cross-network synchronization.'
          }
        ]
      }
    ],
    examples: [
      'Maintaining a running total per userId: state.get(userId)',
      'Session windows tracked per customer session ID'
    ],
    relatedConceptIds: ['rocksdbBackend', 'barrierSnapshotting']
  },
  eventTime: {
    id: 'eventTime',
    term: 'Event Time',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'The time at which an event actually occurred on the producing device, embedded as a timestamp within the record itself. Distinct from processing time (when Flink executes the operation) and ingestion time (when the event enters Flink).'
          }
        ]
      }
    ],
    examples: [
      'A mobile app event logged at 10:00:00 AM, arriving at the Flink job at 10:05:00 AM'
    ],
    relatedConceptIds: ['watermark']
  },
  watermark: {
    id: 'watermark',
    term: 'Watermark',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A control record flowing alongside data elements that signals progress in event time. A watermark with timestamp T asserts that no further events with timestamp t <= T will arrive.'
          }
        ]
      }
    ],
    examples: [
      'Watermark(10:00:00) triggers window evaluations for the 09:55:00-10:00:00 interval'
    ],
    relatedConceptIds: ['eventTime']
  },
  barrierSnapshotting: {
    id: 'barrierSnapshotting',
    term: 'Asynchronous Barrier Snapshotting (ABS)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'An algorithmic derivative of Chandy-Lamport distributed snapshots where checkpoint barriers flow inline with data records. When an operator receives a barrier, it asynchronously snapshots its state without stopping input processing.'
          }
        ]
      }
    ],
    examples: [
      'Checkpoint barriers injected into Kafka consumer partitions to trigger distributed state persistence'
    ],
    relatedConceptIds: ['keyedState', 'rocksdbBackend']
  },
  rocksdbBackend: {
    id: 'rocksdbBackend',
    term: 'RocksDB State Backend',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'An out-of-core state backend storing active keyed state in an embedded RocksDB instance. In-memory updates hit a memtable while historical data flushes to disk as SSTables, enabling state sizes that exceed heap memory.'
          }
        ]
      }
    ],
    examples: [
      'Storing hundreds of gigabytes of keyed state per node using local SSDs'
    ],
    relatedConceptIds: ['keyedState', 'barrierSnapshotting']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'flink',
    name: 'Flink',
    eyebrow: 'STREAM PROCESSING · STATEFUL',
    description:
      'Apache Flink is a distributed processing engine for unbounded data streams. Explore how Flink achieves fault tolerance, event-time semantics, and exactly-once processing on continuous streams.',
    category: 'streaming',
    tags: ['Stream Processing', 'Unbounded Data', 'Exactly-Once', 'Event Time', 'Apache Flink'],

    // Publishing & Operations
    published: true,
    draft: false,
    version: '2.0.0',
    publishedAt: '2024-11-12',
    updatedAt: '2026-07-27',

    // Metrics & Attribution
    estimatedReadingMinutes: 13,
    credit: 'Maintained by',
    creditOrg: 'Apache Software Foundation',
    docsUrl: 'https://nightlies.apache.org/flink/flink-docs-stable/',

    // Discovery & Search Graph
    keywords: [
      'Apache Flink',
      'Stream Processing',
      'Event Time',
      'Watermarks',
      'RocksDB State Backend',
      'Exactly-Once Processing',
      'Chandy-Lamport',
      'Distributed Snapshots'
    ],
    aliases: ['Flink Architecture', 'Stateful Stream Processing'],
    learningObjectives: [
      'Understand how keyed state partitioning operates across parallel execution tasks',
      'Analyze how RocksDB functions as an LSM-based state backend for streaming',
      'Apply event-time windowing using watermarks to handle out-of-order events',
      'Evaluate how Chandy-Lamport barrier checkpointing yields exactly-once guarantees'
    ],
    difficulty: {
      level: 3,
      prerequisites: ['consistent-hashing', 'memtable', 'sstable', 'kafka']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'FlinkIllustration',
    caption: 'Continuous processing topology reading unbounded streams with local state persistence',
    alt: 'Illustration depicting continuous data streams flowing into distributed stateful task operators',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Batch processing has a natural finish line: the input is a fixed file, and when you have read all of it, execution ends. A stream has no finish line—events arrive continuously, and a engine must produce accurate answers without ever seeing "all the data" at once. Flink’s architecture stems from taking that constraint seriously: state that lives as long as the job, a notion of time decoupled from wall clocks, and crash recovery that never loses or duplicates an event.'
        }
      ]
    }
  ],

  sections: [
    {
      id: 'state-outlives-events',
      number: 1,
      title: 'State That Outlives Any Single Event',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'A stateless transformation—such as filtering or mapping individual records—is simple for any stream engine. The core difficulty in stream processing lies in '
            },
            {
              type: 'bold',
              text: 'stateful operations'
            },
            {
              type: 'text',
              text: ': aggregating events per user, computing running averages, or joining distinct streams over time. State must survive between events, across parallel worker machines, and through node crashes.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Flink partitions state across parallel task instances using consistent hashing on key values. Every key’s state resides on exactly one task instance, allowing local state mutations without cross-network locking or consensus.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'keyedState'
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'FlinkKeyedStateIllustration',
          caption: 'Keyed state is deterministically partitioned and owned by single parallel task instances',
          alt: 'Diagram showing incoming key-partitioned streams mapped directly to local operator task states',
          width: 'full'
        }
      ]
    },

    {
      id: 'where-state-lives',
      number: 2,
      title: 'Where That State Actually Lives',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Keyed state must support rapid updates while handling state volumes larger than available RAM. Flink’s production state backend—'
            },
            {
              type: 'bold',
              text: 'RocksDB'
            },
            {
              type: 'text',
              text: '—utilizes an embedded Log-Structured Merge-tree (LSM-tree) architecture. Writes land in an in-memory memtable first and flush to immutable, sorted SSTable files on local disk when buffers fill.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'rocksdbBackend'
        },
        {
          type: 'code',
          language: 'javascript',
          code: `// Updating keyed state under the RocksDB backend follows the fast LSM-tree write path:

function updateState(key, newValue) {
  // 1. In-memory write to memtable (fast O(1) operation)
  rocksDbMemtable.put(key, newValue); 
  
  // 2. Automatically flushed to on-disk SSTable once memtable fills
}

// Checkpoints do not pause stream execution to snapshot state;
// they reference the state backend's underlying immutable SSTable files.`
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
                  text: 'Flink did not construct a new storage engine for large keyed state; it repurposed an LSM-tree. The same append-only, flush-later architecture that makes database writes cheap enables low-latency state updates in a continuous streaming job.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'event-time-vs-wall-clock',
      number: 3,
      title: 'Event Time Versus the Clock on the Wall',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Events rarely arrive in the order they were produced. A mobile telemetry event generated at 10:00:01 AM might arrive at 10:00:40 AM due to network latency. If processing relies on system wall-clock time, query outputs vary based on transient network conditions rather than the underlying data.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Flink resolves this by tracking '
            },
            {
              type: 'bold',
              text: 'Event Time'
            },
            {
              type: 'text',
              text: '—the timestamp embedded within the record itself. '
            },
            {
              type: 'bold',
              text: 'Watermarks'
            },
            {
              type: 'text',
              text: ' flow alongside records as control signals, asserting that no further events with earlier timestamps are expected. Operators wait for watermarks before evaluating windows, trading slight latency for deterministic correctness.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'eventTime'
        },
        {
          type: 'concept-ref',
          conceptId: 'watermark'
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'FlinkWatermarkIllustration',
          caption: 'Watermarks flow inline with records to signal event-time progression and trigger window computations',
          alt: 'Diagram demonstrating out-of-order events followed by a advancing watermark record',
          width: 'full'
        }
      ]
    },

    {
      id: 'checkpointing-mechanism',
      number: 4,
      title: 'Checkpointing: Snapshots Without Stopping the World',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Long-running streaming jobs must handle infrastructure failures. Fault recovery requires restoring operator states to a consistent checkpoint and replaying subsequent inputs. Flink accomplishes this using Asynchronous Barrier Snapshotting (derived from the Chandy-Lamport algorithm), injecting lightweight checkpoint barriers into the data flow.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'barrierSnapshotting'
        },
        {
          type: 'code',
          language: 'javascript',
          code: `// Flow of Asynchronous Barrier Snapshotting (ABS):

1. JobManager injects checkpoint barriers into stream source partitions.
2. Barriers stream downstream alongside standard data records.
3. Upon receiving a barrier, an operator:
   - Aligns incoming stream channels (if multi-input).
   - Asynchronously persists its current state to durable storage (e.g., S3).
   - Forwards the barrier to downstream operators.
4. Once all operators acknowledge the barrier, the checkpoint is marked complete.

// Recovery Path: Restore state across operators from the latest 
// completed checkpoint, then replay source inputs from the checkpoint offset.`
        }
      ]
    },

    {
      id: 'sources-and-sinks',
      number: 5,
      title: 'Where the Events Actually Come From',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Checkpointing yields end-to-end '
            },
            {
              type: 'bold',
              text: 'exactly-once'
            },
            {
              type: 'text',
              text: ' guarantees only if stream sources support offset replay and stream sinks support transactional or idempotent writes. Flink integrates naturally with systems like Apache Kafka: partition offsets provide deterministic replay boundaries, while two-phase commit sinks prevent duplicate output writes upon job restart.'
            }
          ]
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'FlinkSourceSinkIllustration',
          caption: 'End-to-end exactly-once processing requires replayable sources, stateful operators, and transactional sinks',
          alt: 'Diagram illustrating replayable Kafka source, checkpointed operator state, and transactional sink',
          width: 'full'
        }
      ]
    },

    {
      id: 'applicability',
      number: 6,
      title: 'When to Use Flink—and When to Reconsider',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Flink is well-suited for continuous, low-latency computations over unbounded streams requiring strict consistency—such as real-time fraud detection, live metrics aggregation, and dynamic sessionization. For bounded datasets or micro-batch workloads where latency tolerances span hours, scheduled batch processing offers a simpler operational model.'
            }
          ]
        },
        {
          type: 'tradeoff',
          title: 'Stateful Stream Processing vs. Micro-Batching / Scheduled Batch',
          description: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Evaluating continuously executing stream topologies against micro-batched or scheduled processing paradigms.'
                }
              ]
            }
          ],
          sides: [
            {
              name: 'Stateful Streaming (Apache Flink)',
              pros: [
                'True low-latency event-driven processing (sub-second response time)',
                'Native event-time support handling out-of-order data correctly',
                'Fine-grained, low-overhead checkpointing via asynchronous snapshots'
              ],
              cons: [
                'Higher operational overhead (managing state storage, watermarks, backpressure)',
                'Complex recovery tuning for massive state backends'
              ]
            },
            {
              name: 'Micro-Batch / Scheduled Batch',
              pros: [
                'Simpler programming model and easier debugging workflows',
                'Lower resource cost for non-realtime or periodic reporting workloads',
                'Fewer operational dependencies on long-lived state backends'
              ],
              cons: [
                'Inherent latency bounded by batch window intervals',
                'Increased complexity when processing late-arriving out-of-order records'
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
      title: 'Kafka Storage Engine',
      description: 'The append-only log platform that Flink commonly relies on for replayable ingestion and transactional sinks.',
      url: '/deep-dive/kafka',
      slug: 'kafka',
      relationship: 'prerequisite'
    },
    {
      type: 'article',
      title: 'Memtable Architecture',
      description: 'The in-memory buffer structure powering fast writes inside RocksDB state backends.',
      url: '/deep-dive/memtable',
      slug: 'memtable',
      relationship: 'buildsOn'
    },
    {
      type: 'article',
      title: 'SSTable Format',
      description: 'The immutable on-disk storage format underlying persistent RocksDB state.',
      url: '/deep-dive/sstable',
      slug: 'sstable',
      relationship: 'buildsOn'
    }
  ]
};