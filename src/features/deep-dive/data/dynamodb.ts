import { DeepDiveArticle } from '../types';

export const dynamodbData: DeepDiveArticle = {
  slug: 'dynamodb',
  name: 'DynamoDB',
  eyebrow: 'MANAGED · KEY-VALUE',
  description: [
    '<b style="color:var(--ink)">DynamoDB</b> is a fully managed NoSQL database service by AWS. It offers predictable performance at any scale.',
    'It\'s a key-value and document database that delivers single-digit millisecond latency at any scale. No servers to manage, no scaling to worry about.'
  ],
  tags: ['Managed', 'Serverless', 'Key-value'],
  credit: 'Provided by',
  creditOrg: 'Amazon Web Services',
  docsUrl: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/',
  title: 'DynamoDB, and why managed is powerful',
  lede: 'DynamoDB is what happens when you take a distributed database and remove all operational complexity. It\'s the default choice for serverless applications and anyone who wants to pay for performance rather than manage it.',
  sections: [
    {
      number: 1,
      title: 'Fully managed scaling',
      content: [
        'DynamoDB scales horizontally without you doing anything. You specify read/write capacity units (or use on-demand), and AWS handles the rest.',
        'This means you don\'t need to shard, rebalance, or worry about hot partitions — the service handles it automatically.'
      ]
    },
    {
      number: 2,
      title: 'Partition key design',
      content: [
        'Data is distributed across partitions based on the partition key. Choosing the right partition key is critical for even distribution.',
        'A bad partition key leads to hot partitions and throttling. A good one distributes reads and writes evenly across all partitions.'
      ]
    },
    {
      number: 3,
      title: 'Consistency models',
      content: [
        'DynamoDB offers eventual consistency by default (faster reads) and strong consistency as an option (slower but always current).',
        'You can choose per-operation which consistency level you need, trading off latency for correctness.'
      ]
    },
    {
      number: 4,
      title: 'When to use it — and when not to',
      content: []
    }
  ],
  tradeoffs: {
    strengths: [
      'Zero operational overhead',
      'Predictable performance at any scale',
      'Built-in security and backup'
    ],
    weaknesses: [
      'Expensive at scale compared to self-managed',
      'Limited query flexibility without secondary indexes',
      'Vendor lock-in to AWS'
    ]
  },
  related: [
    {
      name: 'Cassandra',
      description: 'Self-managed distributed NoSQL',
      slug: 'cassandra'
    },
    {
      name: 'Postgres',
      description: 'Relational database with different tradeoffs',
      slug: 'postgres'
    }
  ]
};
