import { DeepDiveArticle } from '@/features/deep-dive/types';

export const consistentHashingData: DeepDiveArticle = {
  slug: 'consistent-hashing',
  name: 'Consistent hashing',
  eyebrow: 'DISTRIBUTED SYSTEMS · Data distribution',
  description: [
    '<b style="color:var(--text)">Consistent hashing</b> is a technique for spreading data across servers while keeping movement of data small when the system changes.',
    'It is widely used in distributed caches and databases because servers can join or leave without forcing the entire dataset to move.'
  ],
  tags: ['Distributed systems', 'Caching', '8 min read'],
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
          { type: 'text', text: 'A key belongs to the first server found while moving clockwise around the ring.' }
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
          { type: 'text', text: 'This means adding capacity affects only a small portion of the dataset instead of forcing a complete reshuffle.' }
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
          ]
        ]
      }
    },

    {
      number: 5,
      title: 'Where this appears in real systems',
      content: [],
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
      description: 'Uses hash slots to distribute keys across nodes',
      slug: 'redis'
    }
  ]
};
