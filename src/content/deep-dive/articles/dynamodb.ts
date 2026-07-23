import { DeepDiveArticle } from '@/features/deep-dive/types';

export const dynamodbData: DeepDiveArticle = {
  slug: 'dynamodb',
  name: 'DynamoDB',
  eyebrow: 'MANAGED · KEY-VALUE',
  category: 'db',
  readTime: '14 min',
  description: [
    [
      { type: 'text', text: 'DynamoDB', bold: true },
      {
        type: 'text',
        text: ' is a fully managed NoSQL database from AWS, directly descended from the same Dynamo paper that popularized consistent hashing. It offers predictable, single-digit-millisecond latency at any scale.'
      }
    ],
    [
      {
        type: 'text',
        text: 'The trade is real, though: "fully managed" means AWS is making decisions on your behalf that a self-hosted database would leave to you — and those decisions show up as constraints on how you\'re allowed to model and query your data.'
      }
    ]
  ],
  tags: ['Managed', 'Serverless', 'Key-value'],
  credit: 'Provided by',
  creditOrg: 'Amazon Web Services',
  docsUrl: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/',
  title: 'DynamoDB, and the price of "fully managed"',
  lede: 'DynamoDB is what happens when you take a distributed database and remove all operational complexity. You never shard, never rebalance, never diagnose a hot node at 3am — AWS does that. What it can\'t remove is the modeling discipline that scaling requires; it just moves that work earlier, into how you design your keys and your queries.',

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
      title: 'How DynamoDB actually stores an item',
      content: [
        [
          { type: 'text', text: 'Every item lives in a table and is addressed by a ' },
          { type: 'text', text: 'primary key', bold: true },
          { type: 'text', text: ', which is either a partition key alone, or a partition key plus a sort key. The partition key decides which physical partition the item lives on. The sort key, if you have one, decides the order items are stored in within that partition.' }
        ],
        [
          { type: 'text', text: 'Items that share a partition key are physically stored together, sorted by sort key. That single fact is what makes range queries possible: "give me every order for this user" is really "give me every item under this partition key," which DynamoDB can serve as one fast, contiguous read.' }
        ]
      ],
      code: `Table: Orders
PK (partition key): userId
SK (sort key):      orderId

// Two items sharing a partition key, stored together, sorted by SK
{ userId: "u_42", orderId: "ORDER#001", total: 58.00 }
{ userId: "u_42", orderId: "ORDER#002", total: 12.50 }

// One partition-key query returns both, already in order
Query: userId = "u_42"`
    },

    {
      number: 3,
      title: 'Partition key design is the one thing left to you',
      content: [
        [
          { type: 'text', text: 'DynamoDB\'s design descends from the original Dynamo paper, which introduced ideas like ' },
          {
            type: 'link',
            text: 'consistent hashing',
            href: { type: 'deep-dive', target: 'consistent-hashing', preview: 'How keys and nodes share one hash ring so scaling moves only a slice of data' }
          },
          { type: 'text', text: ' and quorum-based replication. AWS hides the physical partitioning layer entirely, but those same distribution principles still decide how your data spreads: your partition key is hashed, and that hash determines which physical partition holds the item. Every item with the same partition key value always lands on the same partition.' }
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
      number: 4,
      title: 'Query-first modeling: the real mindset shift',
      content: [
        [
          { type: 'text', text: 'A relational schema is designed once, then queried however you need afterward — joins let you ask new questions later. DynamoDB inverts that order: you enumerate your access patterns ' },
          { type: 'text', text: 'first', bold: true },
          { type: 'text', text: ', and shape your keys around them. There\'s no join to fall back on if you guessed wrong.' }
        ],
        [
          { type: 'text', text: 'This is why teams reach for ' },
          { type: 'text', text: 'single-table design', bold: true },
          { type: 'text', text: ': storing several different entity types in one table, using generically-named partition and sort keys so related items collocate under the same partition, regardless of what kind of entity they are.' }
        ],
        [
          { type: 'text', text: 'The payoff is that "get this user\'s profile and their last 20 orders" becomes one query against one partition key, instead of a join across tables you don\'t have.' }
        ]
      ],
      code: `PK              SK
USER#123        PROFILE
USER#123        ORDER#456
ORDER#456       ITEM#789

// One query, one partition key, gets the user's profile
// and every order they've placed — no join required
Query: PK = "USER#123"`
    },

    {
      number: 5,
      title: 'Secondary indexes: paying for the access pattern you didn\'t plan for',
      content: [
        [
          { type: 'text', text: 'Your primary key answers exactly the query it was designed for, and nothing else. If a new requirement shows up — "look up a user by email" when your primary key is an internal user ID — you add a ' },
          { type: 'text', text: 'Global Secondary Index', bold: true },
          { type: 'text', text: ' (GSI): a reprojection of your table under a different key, kept in sync in the background.' }
        ],
        [
          { type: 'text', text: 'The tradeoff is that every GSI is another maintained access path. It consumes its own write capacity to stay current with the base table, and it exists because you planned for that query ahead of time — not because DynamoDB can improvise one later. Flexibility here comes from anticipation, not from the database.' }
        ]
      ],
      code: `Base table primary key:
PK = userId

New requirement: find a user by email

GSI:
PK = email  →  projects userId`
    },

    {
      number: 6,
      title: 'Consistency: choosing per read, not globally',
      content: [
        [
          { type: 'text', text: 'DynamoDB replicates every item to multiple storage nodes. By default, reads are ' },
          { type: 'text', text: 'eventually consistent', bold: true },
          { type: 'text', text: ': a read may return from a replica that hasn\'t yet received the most recent write, and show stale data for a short window — usually well under a second, purely a function of replication lag, not distance. In exchange, eventually consistent reads cost half as many read capacity units.' }
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
      number: 7,
      title: 'Transactions exist, but they\'re the exception',
      content: [
        [
          { type: 'text', text: 'It\'s a common assumption that "NoSQL" means no transactions. DynamoDB actually supports ACID transactions across up to 100 items via ' },
          { type: 'text', text: 'TransactWriteItems', bold: true },
          { type: 'text', text: ' and ' },
          { type: 'text', text: 'TransactGetItems', bold: true },
          { type: 'text', text: ': either every item in the transaction commits, or none do.' }
        ],
        [
          { type: 'text', text: 'They\'re intentionally limited compared to a relational database\'s transactions, and that\'s by design — they exist for the genuinely atomic case (debit one item, credit another) rather than as a substitute for modeling your access patterns correctly up front.' }
        ]
      ]
    },

    {
      number: 8,
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
      'Per-request consistency choice (eventual vs strong)',
      'ACID transactions available for the rare multi-item case'
    ],
    weaknesses: [
      'Can become expensive for workloads with unpredictable access patterns or high storage/query duplication',
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