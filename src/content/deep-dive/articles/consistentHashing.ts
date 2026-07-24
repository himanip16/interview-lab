// src/content/deep-dive/articles/consistentHashing.ts

import { DeepDiveArticle } from '@/features/deep-dive/types';
import { ConsistentHashingIllustration } from '@/content/deep-dive/illustrations/ConsistentHashing';

export const article: DeepDiveArticle = {
  heroIllustration: ConsistentHashingIllustration,
  slug: 'consistent-hashing',
  name: 'Consistent hashing',
  eyebrow: 'DISTRIBUTED SYSTEMS · Data distribution',
  category: 'concept',
  readTime: '13 min',
  description: 'Consistent hashing is a technique for spreading data across servers while keeping movement of data small when the system changes. It is widely used in distributed caches and databases because servers can join or leave without forcing a complete reshuffling of key ownership.',

  tags: ['Distributed systems', 'Caching', 'Hash ring'],
  credit: 'Concept introduced in',
  creditOrg: 'Amazon Dynamo paper',
  docsUrl: 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf',
  title: 'Consistent hashing: how distributed systems scale without moving everything',
  lede: 'Adding a server sounds simple, but naive hashing can move almost every key to a new location. Consistent hashing solves this by making servers and keys live on the same hash space.',

  sections: [
    {
      number: 1,
      title: 'The scaling problem',
      content: [
        [
          { type: 'text', text: 'Imagine a cache with 3 servers. Every request needs to know which server stores a particular key, like ' },
          { type: 'text', text: 'user:123' },
          { type: 'text', text: '.' }
        ],
        [
          { type: 'text', text: 'A common approach is to calculate ' },
          { type: 'text', text: 'hash(key) % number_of_servers' },
          { type: 'text', text: '. It works well until the number of servers changes.' }
        ],
        [
          { type: 'text', text: 'When traffic grows and you add a new server, the calculation changes for almost every key. Suddenly, most cached data appears to be missing and the system has to rebuild its state.' }
        ]
      ],
      code: `3 servers:
hash(user1) % 3 = 1  →  Server B
hash(user2) % 3 = 2  →  Server C

Add a 4th server:
hash(user1) % 4 = 0  →  Server A
hash(user2) % 4 = 3  →  Server D

Almost every key now points to a different server.`,
      illustration: {
        component: 'ModuloIllustration',
        caption: 'Changing the number of servers changes almost every key assignment',
        width: 'half'
      }
    },

    {
      number: 2,
      title: 'The key idea: stop depending on server count',
      content: [
        [
          { type: 'text', text: 'The problem is not hashing itself. The problem is that the hash result is directly tied to the number of servers.' }
        ],
        [
          { type: 'text', text: 'Consistent hashing creates a fixed circular hash space called a ring. Both servers and keys are placed on this same ring.' }
        ],
        [
          { type: 'text', text: 'The key is assigned to the first server clockwise from the key\'s position on the ring.' }
        ],
        [
          { type: 'text', text: 'This is why Cassandra can add a node without copying its entire dataset, and why distributed caches can grow without flushing everything they\'ve already cached.' }
        ]
      ],
      illustration: {
        component: 'ConsistentHashingIllustration',
        caption: 'Servers and keys mapped onto the same hash ring',
        width: 'full'
      }
    },

    {
      number: 3,
      title: 'What happens when a server joins?',
      content: [
        [
          { type: 'text', text: 'A new server does not require moving everything. It only takes ownership of keys between its position and the previous server on the ring.' }
        ],
        [
          { type: 'text', text: 'With N evenly distributed nodes, adding one more moves roughly ' },
          { type: 'text', text: '1/N', bold: true },
          { type: 'text', text: ' of the keys. Go from 10 nodes to 11, and only around 10% of keys change hands — a modulo scheme would have reshuffled nearly all of them for the same change.' }
        ]
      ],
      video: {
        caption: 'Adding a server to a consistent hashing ring',
        duration: '0:45'
      }
    },

    {
      number: 4,
      title: 'Finding the right server',
      content: [
        [
          { type: 'text', text: 'In practice, servers are stored by their hash positions in sorted order.' }
        ],
        [
          { type: 'text', text: 'To find where a key belongs, hash the key and perform a ' },
          {
            type: 'link',
            text: 'binary search',
            href: { type: 'deep-dive', target: 'binary-search', preview: 'How binary search narrows a sorted range in O(log n)' }
          },
          { type: 'text', text: ' for the first server position greater than or equal to that value.' }
        ],
        [
          { type: 'text', text: 'If the search reaches the end of the ring, the lookup wraps back to the first server.' }
        ]
      ],
      code: `function getNode(key) {
  const hash = hash(key);

  // Find the first server clockwise from the key
  const index = binarySearchCeil(ring, hash);

  // Wrap around when reaching the end
  return ring[index % ring.length];
}`,

      callout: {
        label: 'Production detail',
        content: [
          [
            { type: 'text', text: 'A single hash position per server can create uneven distribution. Real systems use ' },
            {
              type: 'link',
              text: 'virtual nodes',
              bold: true,
              href: { type: 'deep-dive', target: 'virtual-nodes', preview: 'Why one physical server owns many ring positions' }
            },
            { type: 'text', text: ', where each physical server owns many positions on the ring.' }
          ],
          [
            { type: 'text', text: 'Without them, random placement can hand one server a huge arc of the ring and another a tiny sliver — pure luck of where the hash landed. Giving each physical server around 100 positions instead of one averages that luck out, so load balances evenly across servers instead of depending on chance.' }
          ]
        ]
      }
    },

    {
      number: 5,
      title: 'Ownership vs. fault tolerance: where replication comes in',
      content: [
        [
          { type: 'text', text: 'Consistent hashing answers exactly one question: which node owns this key? It says nothing about what happens if that node disappears.' }
        ],
        [
          { type: 'text', text: 'Distributed databases layer replication on top of the ring to answer that second question. Cassandra, for example, walks clockwise from a key\'s ring position, assigns the first node it finds as the primary, and continues walking to assign the next distinct nodes as replicas.' }
        ]
      ],
      code: `User123

Node A  →  primary
Node B  →  replica
Node C  →  replica

The ring decides ownership.
Replication decides what survives a node going down.`
    },

    {
      number: 6,
      title: 'Dynamo-style rings vs. Redis-style hash slots',
      content: [
        [
          { type: 'text', text: 'Not every distributed system solves this with a ring. ' },
          {
            type: 'link',
            text: 'Cassandra',
            href: { type: 'deep-dive', target: 'cassandra', preview: 'Peer-to-peer NoSQL where you own the ring, the compaction, the rebalancing' }
          },
          { type: 'text', text: ' and ' },
          {
            type: 'link',
            text: 'DynamoDB',
            href: { type: 'deep-dive', target: 'dynamodb', preview: 'Fully managed key-value database descended from the Dynamo paper' }
          },
          { type: 'text', text: ' are ring-based: partitions sit at points on a continuous hash space, and virtual nodes spread ownership around it.' }
        ],
        [
          { type: 'text', text: 'Redis Cluster solves the same problem differently, with a fixed set of 16,384 hash slots. A key hashes to one of those slots, and each slot is assigned to a node — there\'s no ring and no clockwise walk, just a lookup table mapping slots to nodes.' }
        ],
        [
          { type: 'text', text: 'Both approaches keep resharding cheap; they just disagree on whether the address space is continuous, like a ring, or a fixed, enumerable set, like slots.' }
        ]
      ],
      code: `Redis Cluster:
16384 hash slots
key → hash slot → node

Cassandra / DynamoDB:
key → hash → position on ring
position → first node clockwise`
    },

    {
      number: 7,
      title: 'Where this appears in real systems',
      content: [
        [
          { type: 'text', text: 'Consistent hashing is easy to spot once you know the shape: any system that lets you add or remove capacity without a full data migration is very likely built on some version of this idea.' }
        ]
      ],
      resources: [
        {
          icon: 'book',
          title: 'Amazon Dynamo paper',
          subtitle: 'The distributed database paper that popularized this technique',
          chips: [
            { label: 'Accessible', variant: 'ok' },
            { label: 'Public', variant: 'ok' }
          ]
        },
        {
          icon: 'code',
          title: 'Virtual nodes and load distribution',
          subtitle: 'Understanding why production systems use multiple positions per server',
          chips: [
            { label: 'Accessible', variant: 'ok' },
            { label: 'Public', variant: 'ok' }
          ]
        }
      ]
    }
  ],

  related: [
    {
      name: 'Cassandra',
      description: 'Uses consistent hashing to distribute data across nodes',
      slug: 'cassandra'
    },
    {
      name: 'Redis Cluster',
      description: 'Uses hash slots, not a ring, to distribute keys across nodes',
      slug: 'redis'
    }
  ]
};