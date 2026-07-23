import { DeepDiveArticle } from '@/features/deep-dive/types';

export const dynamodbData: DeepDiveArticle = {
  slug: 'dynamodb',
  name: 'DynamoDB',
  eyebrow: 'MANAGED · KEY-VALUE',
  description: [
    '<b style="color:var(--ink)">DynamoDB</b> is a fully managed NoSQL database from AWS, directly descended from the same Dynamo paper that popularized consistent hashing. It offers predictable, single-digit-millisecond latency at any scale.',
    'The trade is real, though: "fully managed" means AWS is making decisions on your behalf that a self-hosted database would leave to you — and those decisions show up as constraints on how you\'re allowed to model and query your data.'
  ],
  tags: ['Managed', 'Serverless', 'Key-value'],
  credit: 'Provided by',
  creditOrg: 'Amazon Web Services',
  docsUrl: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/',
  title: 'DynamoDB, and the price of "fully managed"',
  lede: 'DynamoDB is what happens when you take a distributed database and remove all operational complexity. You never shard, never rebalance, never diagnose a hot node at 3am — AWS does that. What it can\'t remove is the modeling discipline that scaling requires; it just moves that work earlier, into how you design your keys.',

  sections: [
    {
      number: 1,
      title: 'What "managed" actually removes',
      content: [
        [
          { type: 'text', text: 'In a self-hosted distributed database like ' },
          {
            type: 'link',
            text: 'Cassandra',
            href: { type: 'deep-dive', target: 'cassandra', preview: 'Peer-to-peer NoSQL where you own the ring, the compaction, the rebalancing' }
          },
          { type: 'text', text: ', you own the ring: adding a node, rebalancing partitions, watching for a node that\'s taking disproportionate traffic. DynamoDB removes all of that from your job. You never see a node, never run a rebalance, never patch an OS.' }
        ],
        [
          { type: 'text', text: 'What\'s left is capacity and schema. You either provision read/write capacity units up front or use on-demand pricing, and AWS scales the underlying partitions to match — invisibly, automatically, without you shard-planning anything.' }
        ]
      ],
      illustration: {
        component: 'DynamoManagedLayerIllustration',
        caption: 'AWS owns the partition/node layer entirely; you only see the table',
        width: 'full'
      }
    },

    {
      number: 2,
      title: 'Partition key design is the one thing left to you',
      content: [
        [
          { type: 'text', text: 'DynamoDB places items using the same core idea as ' },
          {
            type: 'link',
            text: 'consistent hashing',
            href: { type: 'deep-dive', target: 'consistent-hashing', preview: 'How keys and nodes share one hash ring so scaling moves only a slice of data' }
          },
          { type: 'text', text: ': your partition key is hashed, and the hash determines which physical partition holds the item. Every item with the same partition key value always lands on the same partition.' }
        ],
        [
          { type: 'text', text: 'That last sentence is the whole game. AWS decides the partition; you decide the key. Pick a key with high cardinality and even access, and load spreads naturally. Pick one badly, and you\'ve built a hot partition — a problem no amount of "managed" fixes for you.' }
        ]
      ],
      code: `// A chat app storing messages by conversation

// BAD: one hot value dominates traffic
partitionKey = "global-announcements"
// every write to this popular channel hits the same partition —
// AWS can't split a single key across partitions to help you

// BETTER: high-cardinality key, spread naturally
partitionKey = conversationId  // e.g. "conv_9f21a"
sortKey      = messageTimestamp`,
      callout: {
        label: 'Worth remembering',
        content: [
          [
            { type: 'text', text: 'A hot partition isn\'t a DynamoDB bug — it\'s the ' },
            { type: 'text', text: 'inevitable result', bold: true },
            { type: 'text', text: ' of one key value getting disproportionate traffic. Managed infrastructure changes who operates the database. It doesn\'t change the math of how hashing distributes load.' }
          ]
        ]
      }
    },

    {
      number: 3,
      title: 'Consistency: choosing per read, not globally',
      content: [
        [
          { type: 'text', text: 'DynamoDB replicates every item to multiple storage nodes. By default, reads are ' },
          { type: 'text', text: 'eventually consistent', bold: true },
          { type: 'text', text: ': they may hit a replica that hasn\'t received the latest write yet, and return stale data for a short window — usually well under a second. In exchange, eventually consistent reads cost half as many read capacity units and can be served from the nearest replica.' }
        ],
        [
          { type: 'text', text: 'You can request ' },
          { type: 'text', text: 'strongly consistent', bold: true },
          { type: 'text', text: ' reads instead, per-request, which always reflect the most recent successful write — at roughly double the read cost and slightly higher latency, since DynamoDB has to confirm it\'s reading the current value rather than whichever replica answered first.' }
        ]
      ],
      code: `await ddb.putItem({ TableName: "Orders", Item: order });

// Right after the write — eventual consistency can still show the old value
const stale = await ddb.getItem({
  TableName: "Orders",
  Key: { orderId },
  ConsistentRead: false  // default
});

// Strong consistency guarantees you see the write you just made
const fresh = await ddb.getItem({
  TableName: "Orders",
  Key: { orderId },
  ConsistentRead: true
});`,
      illustration: {
        component: 'DynamoConsistencyIllustration',
        caption: 'A write lands on one replica first — eventual reads may hit a different one before it catches up',
        width: 'full'
      }
    },

    {
      number: 4,
      title: 'When to use it — and when not to',
      content: [
        [
          { type: 'text', text: 'DynamoDB earns its keep when your access patterns are known ahead of time and expressible as key lookups — user sessions, shopping carts, IoT device state, anything read and written by an ID you already have. It stops paying off the moment you need ad-hoc queries across attributes you didn\'t index for; at that point you\'re either bolting on a Global Secondary Index for every new access pattern, or you\'ve picked the wrong database for the job.' }
        ]
      ]
    }
  ],

  tradeoffs: {
    strengths: [
      'Zero operational overhead — no nodes, no patching, no rebalancing',
      'Predictable single-digit-millisecond latency at any scale',
      'Per-request consistency choice (eventual vs strong)'
    ],
    weaknesses: [
      'Expensive at scale compared to self-managed alternatives',
      'Query flexibility limited to what your keys and indexes anticipate',
      'Vendor lock-in to AWS'
    ]
  },

  related: [
    {
      name: 'Cassandra',
      description: 'Same lineage, self-managed — you own the ring instead of AWS',
      slug: 'cassandra'
    },
    {
      name: 'Postgres',
      description: 'Relational database with different tradeoffs',
      slug: 'postgres'
    }
  ]
};
