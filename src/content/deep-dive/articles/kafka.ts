// src/content/deep-dive/articles/kafka.ts

import { DeepDiveArticle } from '@/features/deep-dive/types';
import { KafkaIllustration } from '@/content/deep-dive/illustrations/Kafka';

export const article: DeepDiveArticle = {
  heroIllustration: KafkaIllustration,
  slug: 'kafka',
  name: 'Kafka',
  eyebrow: 'STREAMING · EVENT LOG',
  category: 'db',
  readTime: '12 min',
  description: 'Kafka is a distributed event streaming platform. It treats data as an append-only log of events. Producers write to topics, consumers read from topics, and everything is durable and replayable. This makes it ideal for event-driven architectures.'
    ,
  tags: ['Streaming', 'Distributed log', 'Event-driven'],
  credit: 'Maintained by',
  creditOrg: 'Apache Software Foundation',
  docsUrl: 'https://kafka.apache.org/documentation/',
  title: 'Kafka, and why logs are powerful',
  lede: 'Kafka is the backbone of modern data pipelines — event sourcing, real-time analytics, and microservices communication. Its log-based architecture provides durability, scalability, and replayability that traditional queues cannot match.',
  sections: [
    {
      number: 1,
      title: 'Everything is a log',
      content: [
        [
          {
            type: 'text',
            text: 'Kafka stores data in topics, which are partitioned logs. Each message has an offset, and consumers track their position in the log.'
          }
        ],
        [
          {
            type: 'text',
            text: 'This append-only design means writes are always fast (sequential I/O), and consumers can replay events from any point in time.'
          }
        ]
      ]
    },
    {
      number: 2,
      title: 'Partitions for parallelism',
      content: [
        [
          {
            type: 'text',
            text: 'Topics are split into partitions, which can be distributed across brokers. This allows parallel consumption and horizontal scaling.'
          }
        ],
        [
          {
            type: 'text',
            text: 'The number of partitions determines maximum parallelism — too few and you\'re bottlenecked, too many and you add overhead.'
          }
        ]
      ]
    },
    {
      number: 3,
      title: 'Consumer groups',
      content: [
        [
          {
            type: 'text',
            text: 'Consumers join consumer groups to divide partition ownership. Each partition is consumed by exactly one consumer in the group.'
          }
        ],
        [
          {
            type: 'text',
            text: 'This enables load balancing while ensuring each message is processed exactly once per consumer group.'
          }
        ]
      ]
    },
    {
      number: 4,
      title: 'When to use it — and when not to',
      content: [
        [
          {
            type: 'text',
            text: 'Kafka earns its complexity when you need durability and replay — an outage or a new consumer shouldn\'t mean lost data, and being able to reprocess history from any offset is worth the operational overhead.'
          }
        ],
        [
          {
            type: 'text',
            text: 'It\'s the wrong tool when all you need is a simple task queue or in-memory pub/sub — the tradeoffs below make the call concrete.'
          }
        ]
      ]
    }
  ],
  tradeoffs: {
    strengths: [
      'High throughput for streaming data',
      'Durable, replayable event log',
      'Scales horizontally with partitions'
    ],
    weaknesses: [
      'Higher latency than in-memory systems',
      'Complex operational requirements',
      'Overkill for simple queue use cases'
    ]
  },
  related: [
    {
      name: 'Cassandra',
      description: 'Also append-only, but for database storage',
      slug: 'cassandra'
    },
    {
      name: 'Redis',
      description: 'In-memory pub/sub, not durable streaming',
      slug: 'redis'
    }
  ]
};