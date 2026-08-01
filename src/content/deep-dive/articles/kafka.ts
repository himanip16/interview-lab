// src/content/deep-dive/articles/kafka.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Terms are referenced inside sections via ConceptReferenceBlock items.
 */
const glossary: Record<string, Concept> = {
  topicPartition: {
    id: 'topicPartition',
    term: 'Topic Partition',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'An ordered, immutable sequence of records continuously appended to a structured log file. Partitions serve as the fundamental unit of parallelism and physical storage distribution across Kafka brokers.'
          }
        ]
      }
    ],
    examples: [
      'Partitioning an orders topic by userId to maintain strict sequence ordering per user',
      'Distributing 12 topic partitions evenly across a 3-node Kafka cluster'
    ],
    relatedConceptIds: ['logOffset', 'consumerGroup']
  },
  logOffset: {
    id: 'logOffset',
    term: 'Log Offset',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A monotonically increasing 64-bit integer assigned to each record upon arrival at a partition. It uniquely identifies the record’s position and serves as the marker for consumer progress.'
          }
        ]
      }
    ],
    examples: [
      'Committing offset 10523 to indicate successful processing of records up to that index',
      'Resetting a consumer offset back to 0 to replay historical event data'
    ],
    relatedConceptIds: ['topicPartition', 'sequentialLog']
  },
  consumerGroup: {
    id: 'consumerGroup',
    term: 'Consumer Group',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A set of consumer instances working cooperatively to process records from one or more topics. Each partition within a topic is assigned to exactly one consumer instance within the group.'
          }
        ]
      }
    ],
    examples: [
      'Scaling up 4 worker instances in consumer-group-analytics to read 4 partitions in parallel'
    ],
    relatedConceptIds: ['topicPartition', 'logOffset']
  },
  sequentialLog: {
    id: 'sequentialLog',
    term: 'Sequential Log I/O',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A write pattern that appends new records sequentially to the end of a physical file on disk. This minimizes disk head seeking on HDDs and leverages OS page cache prefetching on SSDs for high write throughput.'
          }
        ]
      }
    ],
    examples: [
      'Appending incoming producer messages directly to segment files on disk via OS Page Cache'
    ],
    relatedConceptIds: ['topicPartition', 'logOffset']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'kafka',
    name: 'Kafka',
    eyebrow: 'STREAMING · EVENT LOG',
    description:
      'Apache Kafka is a distributed event streaming platform built on an append-only log model. Learn how partitioning, consumer groups, and sequential disk I/O enable durable, high-throughput event processing.',
    category: 'db',
    tags: ['Streaming', 'Distributed Log', 'Event-Driven', 'Pub/Sub', 'Apache Kafka'],

    // Publishing & Operations
    published: true,
    draft: false,
    version: '2.0.0',
    publishedAt: '2024-10-18',
    updatedAt: '2026-07-27',

    // Metrics & Attribution
    estimatedReadingMinutes: 12,
    credit: 'Maintained by',
    creditOrg: 'Apache Software Foundation',
    docsUrl: 'https://kafka.apache.org/documentation/',

    // Discovery & Search Graph
    keywords: [
      'Apache Kafka',
      'Distributed Log',
      'Topic Partitions',
      'Consumer Groups',
      'Offset Management',
      'Sequential I/O',
      'Zero-Copy Reads',
      'Event Streaming'
    ],
    aliases: ['Kafka Architecture', 'Distributed Event Log'],
    learningObjectives: [
      'Understand why append-only log semantics provide high-throughput disk I/O',
      'Design topic partition topologies to maximize consumer parallel processing',
      'Analyze how consumer groups rebalance partition ownership without duplicating messages',
      'Evaluate trade-offs between distributed streaming logs and transient message queues'
    ],
    difficulty: {
      level: 2,
      prerequisites: ['sstable', 'memtable']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'KafkaIllustration',
    caption: 'Distributed log broker topology managing partitioned streams, producers, and consumer groups',
    alt: 'Diagram demonstrating producers pushing messages into partitioned Kafka topic logs read by parallel consumers',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Kafka serves as the core backbone of event-driven platforms, real-time analytics, and decoupled microservices architectures. Unlike traditional message brokers that drop messages immediately after acknowledgment, Kafka structures data as an append-only distributed log—providing continuous durability, horizontal scaling, and deterministic record replay.'
        }
      ]
    }
  ],

  sections: [
    {
      id: 'everything-is-a-log',
      number: 1,
      title: 'Everything Is a Log',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'At its core, Kafka stores messages in '
            },
            {
              type: 'bold',
              text: 'topics'
            },
            {
              type: 'text',
              text: ', which are organized as partitioned, append-only disk logs. Each incoming event receives a unique, sequential index called an '
            },
            {
              type: 'bold',
              text: 'offset'
            },
            {
              type: 'text',
              text: '. Consumers maintain their own position within the log by committing their current offset.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This append-only architecture ensures writes remain fast by leveraging sequential disk I/O. Because existing data is never modified in place, consumers can read sequentially and replay events from any point in historical time.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'logOffset'
        },
        {
          type: 'concept-ref',
          conceptId: 'sequentialLog'
        },
        {
          type: 'code',
          language: 'javascript',
          code: `// Conceptual model of a Kafka Partition Log

const partitionLog = [
  { offset: 0, key: "user_1", value: "OrderCreated", timestamp: 1770000000 },
  { offset: 1, key: "user_2", value: "PaymentFailed", timestamp: 1770000005 },
  { offset: 2, key: "user_1", value: "OrderCancelled", timestamp: 1770000012 },
];

// Consumers track execution using offsets rather than destroying records
function consumeFromOffset(consumer, targetOffset) {
  let currentOffset = targetOffset;
  while (currentOffset < partitionLog.length) {
    const record = partitionLog[currentOffset];
    processRecord(record);
    currentOffset++; // Advance state locally
  }
}`
        }
      ]
    },

    {
      id: 'partitions-for-parallelism',
      number: 2,
      title: 'Partitions for Parallelism',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'To scale beyond the hardware limits of a single machine, Kafka divides topics into multiple '
            },
            {
              type: 'bold',
              text: 'partitions'
            },
            {
              type: 'text',
              text: '. Partitions are distributed across brokers in the cluster, distributing storage load and network throughput evenly.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'The number of partitions dictates the maximum parallel processing capability of a topic. Too few partitions create throughput bottlenecks; too many increase metadata overhead, open file handles, and partition rebalancing durations.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'topicPartition'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Ordering Guarantee',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Kafka guarantees strict record ordering '
                },
                {
                  type: 'bold',
                  text: 'only within a single partition'
                },
                {
                  type: 'text',
                  text: ', not across multiple partitions in a topic. Events requiring strict sequential processing (e.g., account updates) must share the same partition key.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'consumer-groups',
      number: 3,
      title: 'Consumer Groups',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Multiple consumer instances register under a shared '
            },
            {
              type: 'bold',
              text: 'Consumer Group'
            },
            {
              type: 'text',
              text: ' identifier to coordinate partition reading. Kafka dynamically assigns partitions so that each partition is assigned to exactly one worker instance within a single group.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This architecture enables horizontal worker scaling and automatic failover rebalancing while guaranteeing that no single record is processed concurrently by multiple workers in the same group.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'consumerGroup'
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'KafkaPartitionConsumerIllustration',
          caption: 'Consumer groups map individual partition instances to specific worker threads dynamically',
          alt: 'Diagram demonstrating partitions distributed across separate worker threads inside a consumer group',
          width: 'full'
        }
      ]
    },

    {
      id: 'when-to-use',
      number: 4,
      title: 'When to Use It—and When Not To',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Kafka justifies its operational overhead when systems require long-term event retention, high write throughput, and deterministic replay capabilities. A service failure or newly deployed downstream worker can process the event history starting at offset 0 without loss or corruption.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Conversely, for transient work queues or ultra-low latency sub-millisecond RPC message routing, Kafka adds unnecessary complexity compared to lighter-weight in-memory brokers.'
            }
          ]
        },
        {
          type: 'tradeoff',
          title: 'Distributed Log Streaming vs. In-Memory Pub/Sub Queue',
          description: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Comparing persistent append-only log platforms (Kafka) against traditional transient message queues (RabbitMQ, Redis Pub/Sub).'
                }
              ]
            }
          ],
          sides: [
            {
              name: 'Distributed Event Log (Apache Kafka)',
              pros: [
                'Durable and persistent on disk; supports unlimited replayability',
                'Scales to millions of events per second via sequential I/O and zero-copy transfers',
                'Multiple independent consumer groups read the same log at their own pace'
              ],
              cons: [
                'Higher end-to-end latency compared to pure in-memory message brokers',
                'Operational complexity (managing partition counts, storage retention, rebalances)'
              ]
            },
            {
              name: 'Transient Message Queue (RabbitMQ / Redis)',
              pros: [
                'Sub-millisecond latency for real-time task distribution',
                'Flexible point-to-point routing and per-message ack/nack semantics',
                'Minimal setup overhead for basic push-based queuing needs'
              ],
              cons: [
                'Messages are typically deleted after delivery; no historical replay',
                'Harder to scale horizontally to high write throughput without dropping state'
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
      description: 'The immutable disk format sharing underlying log-structured sequential write mechanics.',
      url: '/deep-dive/sstable',
      slug: 'sstable',
      relationship: 'buildsOn'
    },
    {
      type: 'article',
      title: 'Redis Architecture',
      description: 'Compare Kafka persistent event streaming with Redis in-memory pub/sub messaging.',
      url: '/deep-dive/redis',
      slug: 'redis',
      relationship: 'contrast'
    },
    {
      type: 'article',
      title: 'Cassandra Architecture',
      description: 'Explore how Cassandra uses similar log-structured storage patterns for distributed databases.',
      url: '/deep-dive/cassandra',
      slug: 'cassandra',
      relationship: 'similar'
    },
    {
      type: 'article',
      title: 'Memtable Architecture',
      description: 'Understand the in-memory write buffers that power log-structured storage engines.',
      url: '/deep-dive/memtable',
      slug: 'memtable',
      relationship: 'buildsOn'
    }
  ]
};