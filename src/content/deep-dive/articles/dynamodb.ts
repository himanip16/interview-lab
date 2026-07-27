// src/content/deep-dive/articles/dynamodb.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Terms are referenced inside sections via ConceptReferenceBlock items.
 */
const glossary: Record<string, Concept> = {
  primaryKey: {
    id: 'primaryKey',
    term: 'Primary Key',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'The unique identifier for an item in a DynamoDB table. It can either be a simple Partition Key (PK) or a composite key composed of a Partition Key (PK) and a Sort Key (SK).'
          }
        ]
      }
    ],
    examples: [
      'Simple PK: userId = "u_12345"',
      'Composite PK + SK: PK = "USER#123", SK = "ORDER#456"'
    ],
    relatedConceptIds: ['hotPartition', 'singleTableDesign']
  },
  hotPartition: {
    id: 'hotPartition',
    term: 'Hot Partition',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A performance bottleneck caused when a disproportionately high volume of read or write requests targets items with the same partition key value, exhausting the provisioned throughput of that single physical partition.'
          }
        ]
      }
    ],
    examples: [
      'A viral product ID used as the partition key for incoming orders',
      'Using a static value like "GLOBAL_LOGS" as a partition key'
    ],
    relatedConceptIds: ['primaryKey']
  },
  singleTableDesign: {
    id: 'singleTableDesign',
    term: 'Single-Table Design',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'An advanced data modeling strategy in DynamoDB where multiple distinct entity types (e.g., Users, Orders, Products) reside within a single physical table, utilizing generic key attributes (PK/SK) to collocate related records in a single partition query.'
          }
        ]
      }
    ],
    examples: [
      'Storing PK="USER#100", SK="METADATA" alongside PK="USER#100", SK="ORDER#2026-001"'
    ],
    relatedConceptIds: ['primaryKey', 'gsi']
  },
  gsi: {
    id: 'gsi',
    term: 'Global Secondary Index (GSI)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'An index created with a partition key and sort key that can differ from those on the base table. GSIs allow querying across attributes that are not part of the base primary key, kept asynchronously in sync by AWS.'
          }
        ]
      }
    ],
    examples: [
      'Base table PK: userId. GSI PK: email (to look up users by email address)'
    ],
    relatedConceptIds: ['primaryKey', 'singleTableDesign']
  },
  eventualConsistency: {
    id: 'eventualConsistency',
    term: 'Eventually Consistent Reads',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A read mode where DynamoDB returns data immediately from whichever replica answers first. It might reflect stale data for a brief window (~millisecond replication lag), but costs half as many Read Capacity Units (RCUs).'
          }
        ]
      }
    ],
    examples: [
      'Fetching social feed posts where 100ms update lag is acceptable'
    ],
    relatedConceptIds: ['primaryKey']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'dynamodb',
    name: 'DynamoDB',
    eyebrow: 'MANAGED · KEY-VALUE',
    description:
      'DynamoDB is a fully managed NoSQL database from AWS descended from the Dynamo paper. Discover how removing operational overhead shifts the engineering burden into query-first data modeling.',
    category: 'db',
    tags: ['Managed', 'Serverless', 'Key-Value', 'AWS', 'NoSQL'],

    // Publishing & Operations
    published: true,
    draft: false,
    version: '2.0.0',
    publishedAt: '2024-11-10',
    updatedAt: '2026-07-27',

    // Metrics & Attribution
    estimatedReadingMinutes: 14,
    credit: 'Provided by',
    creditOrg: 'Amazon Web Services',
    docsUrl: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/',

    // Discovery & Search Graph
    keywords: [
      'DynamoDB',
      'AWS NoSQL',
      'Single-Table Design',
      'Partition Key',
      'Hot Partition',
      'Global Secondary Index',
      'TransactWriteItems',
      'Consistent Hashing'
    ],
    aliases: ['Amazon DynamoDB', 'DynamoDB Architecture'],
    learningObjectives: [
      'Analyze what operational mechanics AWS manages versus what developers retain',
      'Understand how composite primary keys (PK + SK) collocate items on disk',
      'Apply query-first access modeling and single-table design principles',
      'Evaluate consistency options and global secondary index tradeoffs'
    ],
    difficulty: {
      level: 2,
      prerequisites: ['consistent-hashing', 'cassandra-storage-engine']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'DynamoDBIllustration',
    caption: 'Managed storage layer abstracting physical partitions into scalable table abstraction',
    alt: 'Illustration showing clients interacting with a managed table layer that route to physical partition nodes',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'DynamoDB is what happens when you take a distributed database and remove all operational complexity. You never shard, never rebalance, and never diagnose a hot node at 3 AM—AWS handles that. What it cannot remove is the '
        },
        {
          type: 'bold',
          text: 'modeling discipline'
        },
        {
          type: 'text',
          text: ' that scaling requires; it simply moves that work upfront into how you design your keys and queries.'
        }
      ]
    }
  ],

  sections: [
    {
      id: 'what-managed-removes',
      number: 1,
      title: 'What "Managed" Actually Removes',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'In a self-hosted distributed database like Apache Cassandra, you own the ring: adding nodes, rebalancing partition ranges, and monitoring nodes that handle disproportionate traffic. DynamoDB removes all of that from your operations. You never manage a node, execute a rebalance, or patch an OS.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'What remains is capacity and schema. You provision Read/Write Capacity Units (RCUs/WCUs) or choose On-Demand billing, and AWS dynamically manages physical partitions in the background without requiring manual intervention.'
            }
          ]
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'DynamoManagedLayerIllustration',
          caption: 'AWS owns the physical partition/node layer; developers interact purely with the table API',
          alt: 'Diagram demonstrating the abstraction boundary between the AWS managed infrastructure and developer schema',
          width: 'full'
        }
      ]
    },

    {
      id: 'storing-an-item',
      number: 2,
      title: 'How DynamoDB Actually Stores an Item',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Every item in a table is addressed by a '
            },
            {
              type: 'bold',
              text: 'primary key'
            },
            {
              type: 'text',
              text: ', which consists of either a Partition Key (PK) alone or a composite Partition Key (PK) and Sort Key (SK). The partition key determines which physical partition stores the data, while the sort key dictates the physical ordering within that partition.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Items sharing a partition key are physically stored together, sorted by the sort key. This makes contiguous range queries extremely efficient: requesting "all orders for a user" becomes a single, fast disk read under one partition key.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'primaryKey'
        },
        {
          type: 'code',
          language: 'typescript',
          code: `// Table: Orders
// PK (partition key): userId
// SK (sort key):      orderId

// Two items sharing a partition key, stored sequentially on disk
{ userId: "u_42", orderId: "ORDER#001", total: 58.00 }
{ userId: "u_42", orderId: "ORDER#002", total: 12.50 }

// Querying PK = "u_42" returns both items in a single contiguous disk read
Query: userId = "u_42"`
        }
      ]
    },

    {
      id: 'partition-key-design',
      number: 3,
      title: 'Partition Key Design Is the One Thing Left to You',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'DynamoDB descends directly from the original Amazon Dynamo paper, which popularized consistent hashing and quorum replication. While AWS hides the physical partitioning mechanics, hash distribution rules still apply: your partition key is hashed, and that hash determines which physical partition holds the item.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'AWS manages the hardware, but you decide the key. Selecting keys with high cardinality ensures uniform load distribution. Selecting poorly creates a '
            },
            {
              type: 'bold',
              text: 'hot partition'
            },
            {
              type: 'text',
              text: '—a performance bottleneck no amount of managed infrastructure can automatically remedy.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'hotPartition'
        },
        {
          type: 'code',
          language: 'typescript',
          code: `// Storing messages by conversation

// BAD: Low cardinality creates a hot partition
partitionKey = "global-announcements"
// Every write hits the exact same physical partition node

// BETTER: High cardinality spreads load across the hash space
partitionKey = conversationId  // e.g. "conv_9f21a"
sortKey      = messageTimestamp`
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Worth Remembering',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'A hot partition is not a database bug—it is the inevitable outcome of targeting a single hash value with disproportionate traffic. Managed infrastructure changes operational responsibility, but it cannot alter the math of hash distribution.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'query-first-modeling',
      number: 4,
      title: 'Query-First Modeling: The Real Mindset Shift',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'In relational databases, you normalize data first and query with joins later. DynamoDB inverts this paradigm: you enumerate access patterns '
            },
            {
              type: 'bold',
              text: 'first'
            },
            {
              type: 'text',
              text: ' and design primary keys specifically to satisfy those access patterns.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This requirement drives '
            },
            {
              type: 'bold',
              text: 'single-table design'
            },
            {
              type: 'text',
              text: ': storing multiple entity types within a single table using generic partition and sort key names (e.g., PK and SK) to collocate heterogeneous records within the same partition.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'singleTableDesign'
        },
        {
          type: 'code',
          language: 'typescript',
          code: `PK              SK
USER#123        PROFILE
USER#123        ORDER#456
ORDER#456       ITEM#789

// A single query for PK = "USER#123" fetches the user profile 
// and all recent orders in one network round-trip without relational JOINs
Query: PK = "USER#123"`
        }
      ]
    },

    {
      id: 'secondary-indexes',
      number: 5,
      title: 'Secondary Indexes: Paying for Unplanned Access Patterns',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'A primary key answers only the query it was engineered for. When new requirements arise—such as looking up a user by email when the primary key is user ID—you add a '
            },
            {
              type: 'bold',
              text: 'Global Secondary Index (GSI)'
            },
            {
              type: 'text',
              text: '.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'A GSI creates an asynchronous, re-projected copy of your base table under a different primary key. However, GSIs consume additional Write Capacity Units (WCUs) on every update and introduce storage overhead.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'gsi'
        },
        {
          type: 'code',
          language: 'typescript',
          code: `Base Table Primary Key:
PK = userId

New Requirement: Look up user by email address

Global Secondary Index (GSI):
GSI_PK = email  →  projects userId`
        }
      ]
    },

    {
      id: 'consistency-model',
      number: 6,
      title: 'Consistency: Choosing Per Read, Not Globally',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'DynamoDB replicates items across three Availability Zones. By default, reads use '
            },
            {
              type: 'bold',
              text: 'eventual consistency'
            },
            {
              type: 'text',
              text: ', returning data from any available replica at half the read capacity cost.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'For workloads requiring immediate read-after-write accuracy, '
            },
            {
              type: 'bold',
              text: 'strongly consistent reads'
            },
            {
              type: 'text',
              text: ' can be specified per request. This queries the storage nodes to guarantee returning the latest confirmed write, doubling RCU consumption.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'eventualConsistency'
        },
        {
          type: 'code',
          language: 'typescript',
          code: `await ddb.putItem({ TableName: "Orders", Item: order });

// Eventual Consistency: Half cost (0.5 RCU), slight replication lag potential
const stale = await ddb.getItem({
  TableName: "Orders",
  Key: { orderId },
  ConsistentRead: false
});

// Strong Consistency: Full cost (1.0 RCU), guaranteed latest write
const fresh = await ddb.getItem({
  TableName: "Orders",
  Key: { orderId },
  ConsistentRead: true
});`
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'DynamoConsistencyIllustration',
          caption: 'Write operations commit to storage replicas; eventual reads may hit a replica before propagation finishes',
          alt: 'Replication diagram illustrating write propagation across replicas and eventual read behavior',
          width: 'full'
        }
      ]
    },

    {
      id: 'transactions',
      number: 7,
      title: 'Transactions: ACID Guarantees with Specific Boundaries',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'DynamoDB provides coordinated ACID transactions across up to 100 items or 4 MB of data via '
            },
            {
              type: 'code',
              text: 'TransactWriteItems'
            },
            {
              type: 'text',
              text: ' and '
            },
            {
              type: 'code',
              text: 'TransactGetItems'
            },
            {
              type: 'text',
              text: '.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Transactions execute all operations atomically or abort entirely. They are designed for multi-item invariants (e.g., balance transfers) rather than serving as a replacement for disciplined single-table key design.'
            }
          ]
        }
      ]
    },

    {
      id: 'summary',
      number: 8,
      title: 'When to Use DynamoDB—and When to Reconsider',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'DynamoDB excels when access patterns are known in advance and rely on primary key lookups—such as user sessions, shopping carts, and high-throughput IoT state logging. It becomes inefficient when applications demand ad-hoc analytics or complex relational joins across un-indexed attributes.'
            }
          ]
        },
        {
          type: 'tradeoff',
          title: 'Managed DynamoDB vs. Self-Hosted Cassandra',
          description: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Both databases share consistent hashing roots, but trade operational effort against runtime flexibility and vendor control.'
                }
              ]
            }
          ],
          sides: [
            {
              name: 'Fully Managed (DynamoDB)',
              pros: [
                'Zero server management, node patching, or manual rebalancing',
                'Predictable single-digit millisecond response times at scale',
                'Seamless serverless scaling via On-Demand capacity'
              ],
              cons: [
                'Strict key and index design requirements',
                'High write amplification costs when over-using GSIs',
                'AWS cloud vendor lock-in'
              ]
            },
            {
              name: 'Self-Hosted (Cassandra)',
              pros: [
                'Complete control over ring topology, compaction, and disk choice',
                'Multi-cloud and on-premise deployment portability',
                'No per-request AWS throughput billing caps'
              ],
              cons: [
                'Substantial operational burden (node repairs, JVM tuning, compactions)',
                'Manual cluster capacity planning and rebalancing'
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
      title: 'Cassandra Storage Engine',
      description: 'Self-hosted peer-to-peer NoSQL database sharing the Dynamo paper lineage',
      url: '/deep-dive/cassandra-storage-engine',
      slug: 'cassandra-storage-engine',
      relationship: 'buildsOn'
    },
    {
      type: 'article',
      title: 'Consistent Hashing',
      description: 'The core partition distribution algorithm behind DynamoDB and Cassandra',
      url: '/deep-dive/consistent-hashing',
      slug: 'consistent-hashing',
      relationship: 'prerequisite'
    }
  ]
};