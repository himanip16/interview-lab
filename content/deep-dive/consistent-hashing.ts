import { DeepDiveArticle } from '@/features/deep-dive/types';

export const consistentHashingData: DeepDiveArticle = {
  slug: 'consistent-hashing',
  name: 'Consistent hashing',
  eyebrow: 'DISTRIBUTED SYSTEMS · Load balancing',
  description: [
    '<b style="color:var(--text)">Consistent hashing</b> solves a fundamental problem in distributed systems: how to distribute data across servers without causing massive reshuffling when servers are added or removed.',
    'Unlike traditional modulo hashing, consistent hashing ensures that adding or removing a server only affects a small fraction of keys, making it ideal for distributed caches, load balancers, and databases.'
  ],
  tags: ['Distributed', 'Load balancing', '8 min read'],
  credit: 'Concept from',
  creditOrg: 'Amazon Dynamo paper',
  docsUrl: 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf',
  title: 'Consistent hashing, and why adding one server shouldn\'t break everything',
  lede: 'Naive hashing (<code class="mono">hash(key) % N</code>) means adding one server reshuffles almost every key. Consistent hashing fixes this with one idea: put servers and keys on the same ring.',
  sections: [
    {
      number: 1,
      title: 'The problem with modulo',
      content: [
        'With <code class="mono">% N</code>, the server for a key depends on the total count <b>N</b>. Change N by one and almost every key\'s assigned server changes — which means a mass cache miss or a mass data migration, right when you\'re trying to scale up.'
      ],
      illustration: {
        component: 'ModuloIllustration',
        caption: 'Modulo hashing: adding a node reshuffles nearly everything',
        width: 'half'
      }
    },
    {
      number: 2,
      title: 'The ring, live',
      content: [
        'Both servers and keys get hashed onto the same circular space. A key belongs to the first server found going clockwise. Try it:'
      ],
      illustration: {
        component: 'ConsistentHashingIllustration',
        caption: 'Interactive consistent hashing ring',
        width: 'full'
      }
    },
    {
      number: 3,
      title: 'Watch it happen',
      content: [
        'A 45-second walkthrough of the same ring, including what happens when a node joins mid-traffic.'
      ],
      video: {
        caption: 'Consistent hashing, visualized',
        duration: '0:45'
      }
    },
    {
      number: 4,
      title: 'How lookup actually works',
      content: [
        'Servers\' hash positions are kept in a sorted array. Finding a key\'s server is a binary search for the first position ≥ the key\'s hash — wrapping to the start if none is found.'
      ],
      code: `function getNode(key) {
  const h = hash(key);
  const idx = binarySearchCeil(ring, h);
  // wrap around if key hashes past the last node
  return ring[idx % ring.length];
}`.replace(/≥/g, '&ge;'),
      callout: {
        label: 'Worth remembering',
        content: 'A real ring uses <b>virtual nodes</b> — each physical server gets hashed to dozens of points, not one. Otherwise one unlucky placement gives a server way more (or less) than its fair share of keys.'
      }
    },
    {
      number: 5,
      title: 'Go deeper',
      content: [],
      resources: [
        {
          icon: 'book',
          title: 'Official docs — Dynamo paper (Amazon)',
          subtitle: 'The original write-up this pattern comes from',
          chips: [{ label: 'Accessible', variant: 'ok' }, { label: 'Public', variant: 'ok' }]
        },
        {
          icon: 'message',
          title: 'Community discussion thread',
          subtitle: 'Real debugging stories from people who hit this in production',
          chips: [{ label: 'Accessible', variant: 'ok' }, { label: 'Public', variant: 'ok' }]
        },
        {
          icon: 'code',
          title: 'Q&A thread — "virtual nodes, how many?"',
          subtitle: 'A well-answered question on picking vnode counts',
          chips: [{ label: 'Accessible', variant: 'ok' }, { label: 'Public', variant: 'ok' }]
        }
      ]
    }
  ],
  related: [
    {
      name: 'Cassandra',
      description: 'Uses consistent hashing for data distribution',
      slug: 'cassandra'
    },
    {
      name: 'Redis',
      description: 'Redis Cluster uses consistent hashing for sharding',
      slug: 'redis'
    }
  ]
};
