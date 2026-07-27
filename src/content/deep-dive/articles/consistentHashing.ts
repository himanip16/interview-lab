// src/content/deep-dive/articles/consistentHashing.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Centralizes concepts referenced throughout the consistent hashing article.
 */
const glossary: Record<string, Concept> = {
  consistentHashRing: {
    id: 'consistentHashRing',
    term: 'Consistent Hash Ring',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A circular hash space (e.g., 0 to 2^32 - 1) where both servers (nodes) and data keys are assigned positions using a uniform hash function. Keys map to the first node encountered moving clockwise.'
          }
        ]
      }
    ],
    examples: [
      'Hash value 0x4F2A maps to Node B at position 0x6000',
      'Cassandra partition ring placement'
    ],
    relatedConceptIds: ['virtualNodes', 'hashSlots']
  },
  virtualNodes: {
    id: 'virtualNodes',
    term: 'Virtual Nodes (Vnodes)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A technique where each physical server is assigned multiple non-contiguous positions on the hash ring. This prevents hotspots by distributing key ranges more evenly across physical hardware.'
          }
        ]
      }
    ],
    examples: [
      '1 physical server = 128 virtual node tokens on the ring',
      'When a node fails, its load is split across all other physical nodes'
    ],
    relatedConceptIds: ['consistentHashRing']
  },
  hashSlots: {
    id: 'hashSlots',
    term: 'Hash Slots',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'An alternative data distribution model (used by Redis Cluster) where keys hash into a fixed number of enumerable slots (e.g., 16,384) which are then assigned to cluster nodes.'
          }
        ]
      }
    ],
    examples: [
      'CRC16(key) % 16384 -> Slot 4096 -> Node 2',
      'Rebalancing transfers discrete slots rather than continuous ring arcs'
    ],
    relatedConceptIds: ['consistentHashRing']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'consistent-hashing',
    name: 'Consistent Hashing',
    eyebrow: 'DISTRIBUTED SYSTEMS · Data Distribution',
    description:
      'Consistent hashing spreads data across servers while keeping key displacement minimal when nodes join or leave. Discover how distributed databases scale without flushing caches or triggering massive data migrations.',
    category: 'concept',
    tags: ['Distributed Systems', 'Caching', 'Hash Ring', 'Scalability'],

    // Publishing & Operations
    published: true,
    draft: false,
    version: '2.0.0',
    publishedAt: '2024-10-15',
    updatedAt: '2026-07-27',

    // Metrics & Attribution
    estimatedReadingMinutes: 13,
    credit: 'Concept introduced in',
    creditOrg: 'Amazon Dynamo Paper (DeCandia et al., 2007)',
    docsUrl: 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf',

    // Discovery & Search Graph
    keywords: [
      'Consistent Hashing',
      'Distributed Cache',
      'Hash Ring',
      'Virtual Nodes',
      'Modulo Hashing',
      'DynamoDB',
      'Cassandra',
      'Rebalancing'
    ],
    aliases: ['Hash Ring Algorithm', 'Distributed Data Sharding'],
    learningObjectives: [
      'Understand why modulo hashing fails when cluster topology changes',
      'Map keys and nodes onto a circular hash space using clockwise routing',
      'Calculate key displacement during node additions and removals',
      'Compare Dynamo-style hash rings with Redis-style fixed hash slots'
    ],
    difficulty: {
      level: 2,
      prerequisites: ['binary-search']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'ConsistentHashingIllustration',
    caption: 'Servers and keys mapped onto a single 32-bit circular hash ring',
    alt: 'Illustration of a circular ring showing servers and keys mapped around the perimeter',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Adding a server sounds simple, but naive hashing can force almost every key to move to a new location. Consistent hashing solves this by placing both servers and keys on the '
        },
        {
          type: 'bold',
          text: 'same continuous hash space'
        },
        {
          type: 'text',
          text: '.'
        }
      ]
    }
  ],

  sections: [
    {
      id: 'scaling-problem',
      number: 1,
      title: 'The Scaling Problem',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Imagine a distributed cache with 3 servers. Every client request needs to determine which server stores a given key, such as '
            },
            {
              type: 'code',
              text: 'user:123'
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
              text: 'A common initial approach is calculating '
            },
            {
              type: 'code',
              text: 'hash(key) % number_of_servers'
            },
            {
              type: 'text',
              text: '. This works well when the cluster size is static, but fails dramatically when the server count changes.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'When traffic grows and you add a 4th server, the divisor in the modulo operation changes. Because the output shifts for almost every input key, existing cache entries suddenly miss, triggering massive database stampedes while the cache rebuilds.'
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `3 servers:
hash(user1) % 3 = 1  →  Server B
hash(user2) % 3 = 2  →  Server C

Add a 4th server:
hash(user1) % 4 = 0  →  Server A
hash(user2) % 4 = 3  →  Server D

Result: Almost every key now points to a different server.`
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'ModuloIllustration',
          caption: 'Modulo hashing reshuffles almost 100% of keys when server count changes',
          alt: 'Diagram demonstrating key movement when expanding from 3 to 4 nodes with modulo sharding',
          width: 'half'
        }
      ]
    },

    {
      id: 'key-idea',
      number: 2,
      title: 'The Key Idea: Stop Depending on Server Count',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'The core flaw is not hashing itself—it is tying the storage location directly to the total number of live servers.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Consistent hashing creates a fixed, circular hash space called a '
            },
            {
              type: 'bold',
              text: 'ring'
            },
            {
              type: 'text',
              text: '. Both server identities and data keys are mapped onto this same ring using the same hash function.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'A key is owned by the '
            },
            {
              type: 'bold',
              text: 'first server encountered clockwise'
            },
            {
              type: 'text',
              text: " from the key's position on the ring."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'consistentHashRing'
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'ConsistentHashingIllustration',
          caption: 'Servers and keys mapped clockwise on the circular hash space',
          alt: 'Circular ring showing server nodes and key locations with arrows pointing clockwise to owning nodes',
          width: 'full'
        }
      ]
    },

    {
      id: 'server-joins',
      number: 3,
      title: 'What Happens When a Server Joins?',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'When a new node joins the ring, it only takes ownership of keys lying between its assigned position and the preceding server counter-clockwise.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'With '
            },
            {
              type: 'code',
              text: 'N'
            },
            {
              type: 'text',
              text: ' evenly distributed nodes, adding one more node moves roughly '
            },
            {
              type: 'bold',
              text: '1 / (N + 1)'
            },
            {
              type: 'text',
              text: ' of the overall keys. Going from 10 nodes to 11 moves only ~9% of the data—whereas modulo sharding would have reshuffled over 90%.'
            }
          ]
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'ServerJoinAnimation',
          caption: 'Adding a server only reassigns the arc immediately preceding the new node',
          alt: 'Animation showing key migration limited to a single arc on the ring',
          width: 'full'
        }
      ]
    },

    {
      id: 'finding-servers',
      number: 4,
      title: 'Finding the Right Server',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'In code, the ring is represented as a sorted array of node token positions.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'To locate the owning server for a key, hash the key and perform a '
            },
            {
              type: 'bold',
              text: 'binary search'
            },
            {
              type: 'text',
              text: ' to find the first server token position greater than or equal to the key hash in O(log N) time.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'If the search extends past the highest token position on the ring, the lookup wraps around to the first server at position 0.'
            }
          ]
        },
        {
          type: 'code',
          language: 'typescript',
          code: `function getNode(key: string, ring: NodeToken[]): Node {
  const keyHash = hash(key);

  // Binary search for the first server token >= keyHash
  let index = binarySearchCeil(ring, keyHash);

  // Wrap around to the start of the ring if key Hash > highest token
  if (index >= ring.length) {
    index = 0;
  }

  return ring[index].node;
}`
        },
        {
          type: 'concept-ref',
          conceptId: 'virtualNodes'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Production Detail: Virtual Nodes',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: "text",
                  text: 'A single position per physical server creates uneven data distribution due to random hash variance. Production systems assign each physical node ~100 to 256 '
                },
                {
                  type: 'bold',
                  text: 'virtual nodes (vnodes)'
                },
                {
                  type: 'text',
                  text: ' across the ring, ensuring load balances uniformly across physical hardware.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'replication',
      number: 5,
      title: 'Ownership vs. Fault Tolerance: Adding Replication',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Consistent hashing answers one primary question: '
            },
            {
              type: 'bold',
              text: 'Which node primary-owns this key?'
            },
            {
              type: 'text',
              text: ' It does not inherently guarantee fault tolerance if that node crashes.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Distributed databases layer replication on top of the ring. For example, Cassandra walks clockwise starting from the key's primary token position, assigning the primary node first, and then selecting the next N-1 distinct physical nodes as replicas."
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `Key: user:123 (Replication Factor = 3)

Node A  →  Primary owner
Node B  →  Replica 1 (next distinct physical node)
Node C  →  Replica 2 (next distinct physical node)

The hash ring decides ownership.
Replication walk decides durability.`
        }
      ]
    },

    {
      id: 'ring-vs-slots',
      number: 6,
      title: 'Dynamo Hash Rings vs. Redis Hash Slots',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Not all distributed platforms utilize a continuous ring architecture. Cassandra and DynamoDB use ring-based topologies with continuous token ranges.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'By contrast, Redis Cluster divides data into a fixed count of '
            },
            {
              type: 'bold',
              text: '16,384 hash slots'
            },
            {
              type: 'text',
              text: '. Keys hash directly to a slot number, and nodes own discrete subsets of those slots.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'hashSlots'
        },
        {
          type: 'comparison',
          title: 'Hash Ring vs. Fixed Hash Slots',
          columns: [
            { id: 'architecture', label: 'Architecture' },
            { id: 'space', label: 'Hash Space' },
            { id: 'routing', label: 'Routing Mechanism' },
            { id: 'resharding', label: 'Resharding Process' }
          ],
          rows: [
            {
              feature: 'Consistent Ring (Cassandra / Dynamo)',
              cells: {
                architecture: 'Peer-to-Peer Ring',
                space: 'Continuous (0 to 2^127 - 1)',
                routing: 'Clockwise binary search token lookup',
                resharding: 'Automatic range splitting via Vnodes'
              }
            },
            {
              feature: 'Hash Slots (Redis Cluster)',
              cells: {
                architecture: 'Fixed Slot Mapping',
                space: 'Discrete (16,384 slots)',
                routing: 'Direct slot-to-node lookup table',
                resharding: 'Explicit slot migration between nodes'
              }
            }
          ],
          caption: 'Both patterns prevent full cluster reshuffling during scaling'
        }
      ]
    },

    {
      id: 'summary',
      number: 7,
      title: 'Real-World Applications',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Consistent hashing is a foundational building block for modern infrastructure. You will find it in edge routing caches (Akamai, Cloudflare), distributed databases (Cassandra, Riak, DynamoDB), load balancers (HAProxy, Envoy), and microservice client-side routing.'
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
      description: 'How Apache Cassandra uses consistent hashing to manage peer-to-peer data layout',
      url: '/deep-dive/cassandra-storage-engine',
      slug: 'cassandra-storage-engine',
      relationship: 'buildsOn'
    },
    {
      type: 'article',
      title: 'Binary Search',
      description: 'The algorithmic underlying lookups along the sorted hash ring token array',
      url: '/deep-dive/binary-search',
      slug: 'binary-search',
      relationship: 'prerequisite'
    }
  ]
};