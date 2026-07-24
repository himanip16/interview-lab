// src/content/deep-dive/articles/mongodb.ts

import { DeepDiveArticle } from '@/features/deep-dive/types';
import { MongoDBIllustration } from '@/content/deep-dive/illustrations/MongoDB';

export const article: DeepDiveArticle = {
  heroIllustration: MongoDBIllustration,
  slug: 'mongodb',
  name: 'MongoDB',
  eyebrow: 'DOCUMENT · NoSQL',
  category: 'db',
  readTime: '12 min',
  description: 'MongoDB is a document store that stores data as documents, not rows. That one decision changes how writes land on disk, how reads get consistent, and what "transaction" even means here. It is not "no consistency." It is consistency you dial in, per operation, and pay for exactly what you ask for.',
  
  tags: ['Document store', 'WiredTiger', 'Replica sets', 'Sharded'],
  credit: 'Maintained by',
  creditOrg: 'MongoDB Inc.',
  docsUrl: 'https://www.mongodb.com/docs/',
  title: 'What actually happens when you write to MongoDB',
  lede: 'Say you call insertOne() and it returns success. Has your document survived a crash yet? Maybe not. That gap — between "acknowledged" and "durable" — is where most of MongoDB\'s design decisions live, and once you see it, everything else about the system starts making sense.',
  sections: [
    {
      number: 1,
      title: 'The write that returns before it\'s safe',
      content: [
        [
          {
            type: 'text',
            text: 'When you insert a document, MongoDB updates it in memory and hands your client a success response almost instantly. But the document hasn\'t hit disk yet — not really. It\'s sitting in a cache, and separately, a note of the operation is queued to be written to a journal (a write-ahead log) on disk.'
          }
        ],
        [
          {
            type: 'text',
            text: 'Here\'s the part people miss: that journal write doesn\'t happen immediately either. By default, MongoDB batches journal writes and flushes them every 100ms. Why not just flush instantly, every time? Because an fsync — the disk operation that actually guarantees "this is safe" — costs a few milliseconds. Do that on every single write and your throughput collapses to a few hundred writes per second. Batch 100ms worth of writes into one fsync, and you can push tens of thousands. It\'s the same trade every log-structured system makes — Kafka does it with a batching delay, Postgres does it with its WAL writer.'
          }
        ],
        [
          {
            type: 'text',
            text: 'So the honest answer to "is my write safe" is: it depends what you asked for when you wrote it. That\'s the next section.'
          }
        ]
      ],
      callout: {
        label: 'Worth remembering',
        content: [
          [
            {
              type: 'text',
              text: 'If your server crashes 50ms after an insert returns "success," and you used the default write settings, that document can be gone. The client already moved on, believing it worked.'
            }
          ]
        ]
      }
    },
    {
      number: 2,
      title: 'You get to choose how much you trust the write',
      content: [
        [
          {
            type: 'text',
            text: 'MongoDB doesn\'t force one answer to "how durable should this write be" — it lets you pick, per operation, through '
          },
          { type: 'text', text: 'write concern', bold: true },
          { type: 'text', text: '.' }
        ],
        [
          { type: 'text', text: 'Ask for ' },
          { type: 'text', text: 'w:1', bold: true },
          {
            type: 'text',
            text: ' and you get an acknowledgment as soon as the primary has it in memory — fast, but as we just saw, vulnerable to a crash before the next journal flush. Ask for '
          },
          { type: 'text', text: 'w:majority', bold: true },
          {
            type: 'text',
            text: ' and MongoDB waits until most of the replica set has the write too — slower, but now the write survives even if the primary dies the next second, because a majority already has it.'
          }
        ],
        [
          {
            type: 'text',
            text: 'This is the actual design philosophy of MongoDB, in one sentence: nothing is durable or consistent by default, everything is durable or consistent if you ask for it, and you pay in latency for what you ask for.'
          }
        ]
      ]
    },
    {
      number: 3,
      title: 'What a secondary actually sees, and when',
      content: [
        [
          {
            type: 'text',
            text: 'Every write to the primary gets recorded, in order, into a special collection called the '
          },
          { type: 'text', text: 'oplog', bold: true },
          {
            type: 'text',
            text: '. Secondaries don\'t get pushed writes — they continuously pull the oplog and replay it themselves. Which means a secondary is always slightly behind. How far behind is not a theoretical question — it\'s a number you can watch:'
          }
        ]
      ],
      callout: {
        label: 'A real timeline',
        content: [
          [{ type: 'text', text: '10:00:00.000 — primary receives the write and applies it in memory.' }],
          [{ type: 'text', text: '10:00:00.004 — client gets a success response (w:1).' }],
          [{ type: 'text', text: '10:00:00.022 — secondary pulls the oplog entry.' }],
          [{ type: 'text', text: '10:00:00.026 — secondary applies it and is now caught up.' }],
          [
            {
              type: 'text',
              text: 'For 22 milliseconds, a read on the secondary would have returned the old value. Route your reads there for scale, and that gap is the price.'
            }
          ]
        ]
      }
    },
    {
      number: 4,
      title: 'When the primary dies, who decides what happened?',
      content: [
        [
          {
            type: 'text',
            text: 'If the primary goes down mid-write, two things could have happened: the write reached a majority of the replica set before the crash, or it didn\'t. MongoDB has to figure out which, and it does this through '
          },
          { type: 'text', text: 'read concern', bold: true },
          { type: 'text', text: ' at read time rather than guessing at write time.' }
        ],
        [
          { type: 'text', text: 'Read with ' },
          { type: 'text', text: 'local', bold: true },
          {
            type: 'text',
            text: ' concern and you might see a value that later gets rolled back — data the old primary had but never replicated anywhere else. Read with '
          },
          { type: 'text', text: 'majority', bold: true },
          {
            type: 'text',
            text: ' concern and you only ever see writes that a majority of nodes already agreed on, which means they can never disappear, even across a failover.'
          }
        ],
        [
          {
            type: 'text',
            text: 'The remaining nodes then hold an election to pick a new primary — this is not instant. Default election timeout is around 10 seconds, and during that window, the replica set has no primary at all. Writes simply fail. This is the real cost of automatic failover: not data loss, usually, but a window of unavailability you have to design your application to tolerate.'
          }
        ]
      ]
    },
    {
      number: 5,
      title: 'Can two documents be changed atomically together?',
      content: [
        [
          {
            type: 'text',
            text: 'A single document write is always atomic in MongoDB — even if that document has ten nested fields changing at once, it\'s all-or-nothing. This covers more than people expect, because a document is often already scoped to one logical thing: one order, one user profile, one cart.'
          }
        ],
        [
          {
            type: 'text',
            text: 'But what if you need to move money between two documents — debit one account, credit another, and guarantee both happen or neither does? That\'s a multi-document transaction, and MongoDB has supported this since version 4.0. Under the hood it uses snapshot isolation: the transaction sees a frozen, consistent view of the data, and commits across every document involved at once, or rolls all of it back.'
          }
        ],
        [
          {
            type: 'text',
            text: 'The catch is cost. A transaction that stays open under heavy concurrent writes can hit conflicts and get retried, and there\'s a hard 60-second default limit before it\'s killed. MongoDB\'s own guidance is telling: keep transactions short, and prefer designing your documents so you rarely need one. The transaction is a safety net for the exception, not the pattern you build around.'
          }
        ]
      ]
    },
    {
      number: 6,
      title: 'What happens when one machine isn\'t enough',
      content: [
        [
          {
            type: 'text',
            text: 'Once a collection outgrows a single replica set, MongoDB splits it across many, by '
          },
          { type: 'text', text: 'sharding', bold: true },
          {
            type: 'text',
            text: ' on a key you choose — say, user ID. Data is broken into ranges of that key called chunks, and a background process called the balancer moves chunks between shards to keep the load even.'
          }
        ],
        [
          {
            type: 'text',
            text: 'The shard key choice is where most sharding pain comes from. Pick something that increases monotonically — like a timestamp — and every new write lands on whichever shard holds the newest range. One shard takes all the traffic, the rest sit idle, and you\'ve built a distributed system that behaves like a single machine anyway.'
          }
        ],
        [
          {
            type: 'text',
            text: 'This is why the shard key decision matters as much as picking a primary key in a relational schema — get it wrong on a large, live collection, and fixing it later is a genuinely expensive operation, not a config change.'
          }
        ]
      ]
    },
    {
      number: 7,
      title: 'When to reach for it — and when not to',
      content: [
        [
          {
            type: 'text',
            text: 'Everything above adds up to a database that hands you dials instead of defaults — durability, consistency, and even schema are choices you make per operation and per collection, not settings baked in for you.'
          }
        ],
        [
          {
            type: 'text',
            text: 'That\'s a good trade when your data already has a natural document shape and you want that flexibility. It\'s a worse trade when you\'d rather the database enforce guarantees for you automatically. The tradeoffs below are the concrete version of that call.'
          }
        ]
      ]
    }
  ],
  tradeoffs: {
    strengths: [
      'Data has a natural document shape — one order, one profile, one cart — that you\'d otherwise split across many joined tables',
      'You want to choose durability and consistency per operation, not accept one fixed guarantee for everything',
      'Write-heavy workloads that need horizontal scale via sharding',
      'Schema changes often, and migrations on every change are a real cost you want to avoid'
    ],
    weaknesses: [
      'Your queries constantly cut across many collections in ways you didn\'t design the documents for',
      'You want strong consistency by default, without remembering to ask for it on every read and write',
      'Multi-document transactions are your main pattern, not the occasional exception',
      'The team needs schema enforced by the database, not by application code'
    ]
  },
  related: [
    {
      name: 'DynamoDB',
      description: 'Also document-capable, but partition-key first — a different scaling model entirely',
      slug: 'dynamodb'
    },
    {
      name: 'Postgres',
      description: 'JSONB gives you document flexibility with full ACID and real joins — worth comparing head to head',
      slug: 'postgres'
    }
  ]
};