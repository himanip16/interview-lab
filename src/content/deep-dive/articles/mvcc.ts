// src/content/deep-dive/articles/mvcc.ts

import { DeepDiveArticle } from '@/features/deep-dive/types';
import { MVCCIllustration } from '@/content/deep-dive/illustrations/MVCC';

export const article: DeepDiveArticle = {
    heroIllustration: MVCCIllustration,
  slug: 'mvcc',
  category: 'db',
  readTime: '11 min',
  name: 'MVCC',
  eyebrow: 'CONCURRENCY CONTROL · SNAPSHOTS',
  description: 'MVCC (Multi-Version Concurrency Control) is how databases let reads and writes happen at the same time without blocking each other. The trick: never overwrite a row, just keep multiple versions of it around.',
  tags: ['Snapshot isolation', 'No read locks', 'Row versioning'],
  credit: 'Core concept in',
  creditOrg: 'PostgreSQL, MySQL (InnoDB), Oracle, SQL Server',
  docsUrl: 'https://www.postgresql.org/docs/current/mvcc.html',
  title: 'MVCC, and why nobody has to wait for anybody',
  lede: 'The oldest way to keep concurrent transactions from corrupting each other is locking: a reader blocks a writer, a writer blocks a reader, everyone takes turns. MVCC asks a different question — what if a reader and a writer just never needed the same copy of the data in the first place? Keep the old version around long enough for the reader to finish with it, let the writer create a new version alongside it, and neither one ever has to wait.',

  sections: [
    {
      number: 1,
      title: 'The problem with locking reads',
      content: [
        [
          { type: 'text', text: 'In a lock-based system, a long-running read can hold a shared lock on a row for its entire duration. Any writer that wants to touch that row has to wait — not because the data is actually in danger, but because the locking scheme can\'t tell the difference between "someone is looking at this" and "someone might interfere with this."' }
        ],
        [
          { type: 'text', text: 'MVCC sidesteps the question entirely. Instead of making a writer wait for a reader to finish with the current version of a row, it lets the writer create a new version. The reader keeps seeing the old one, unaware anything happened.' }
        ]
      ],
      illustration: {
        component: 'MVCCLockVsVersionIllustration',
        caption: 'Locking makes writers wait on readers — MVCC gives each a version instead',
        width: 'full'
      }
    },

    {
      number: 2,
      title: 'Every row is really a chain of rows',
      content: [
        [
          { type: 'text', text: 'A table row under MVCC isn\'t a single mutable slot — it\'s a series of row versions, each tagged with the range of transactions that can see it. Postgres, for example, stamps every row with two hidden columns: ' },
          { type: 'text', text: 'xmin', bold: true },
          { type: 'text', text: ' (the transaction that created this version) and ' },
          { type: 'text', text: 'xmax', bold: true },
          { type: 'text', text: ' (the transaction that made it obsolete, if any).' }
        ]
      ],
      code: `// A row's life as a chain of versions (Postgres-style xmin/xmax)

// Insert by transaction 100
{ id: 42, status: "active", xmin: 100, xmax: null }

// Update by transaction 105 doesn't edit the row —
// it closes the old version and inserts a new one:
{ id: 42, status: "active", xmin: 100, xmax: 105 }  // now closed
{ id: 42, status: "away",   xmin: 105, xmax: null }  // now current

// A transaction that started before 105 still sees "active".
// A transaction that starts after 105 sees "away".`,
      callout: {
        label: 'Worth remembering',
        content: [
          [
            { type: 'text', text: 'An "update" under MVCC is never an edit — it\'s ', bold: false },
            { type: 'text', text: 'close the old version, insert a new one', bold: true },
            { type: 'text', text: '. The same append-only instinct that makes an LSM-tree write fast shows up here for a completely different reason: letting readers and writers ignore each other.' }
          ]
        ]
      }
    },

    {
      number: 3,
      title: 'What a snapshot actually is',
      content: [
        [
          { type: 'text', text: 'When a transaction starts, it takes a snapshot: a record of which transaction IDs were already committed at that instant. From then on, every row version it looks at gets checked against that snapshot — visible if its creator had committed in time and its closer either doesn\'t exist yet or hadn\'t committed yet.' }
        ],
        [
          { type: 'text', text: 'This is why a long-running read never blocks a writer and is never blocked by one: it\'s not asking "what is the value right now," it\'s asking "what was the value according to my snapshot," and that answer doesn\'t change no matter what happens after the snapshot was taken.' }
        ]
      ],
      illustration: {
        component: 'MVCCSnapshotIllustration',
        caption: 'Each transaction checks row visibility against the snapshot it took at the start',
        width: 'full'
      }
    },

    {
      number: 4,
      title: 'Walking through one row',
      content: [
        [
          { type: 'text', text: 'Concretely: transaction A starts a long read, then transaction B updates the same row and commits, all before A finishes.' }
        ]
      ],
      code: `T1  Transaction A starts, snapshot taken (sees only committed data up to T1)
T2  Transaction B updates row 42: "active" → "away", commits at T2
T3  Transaction A reads row 42

// A's snapshot was taken at T1, before B committed.
// The "away" version has xmin = B's transaction ID, which
// wasn't committed yet as of A's snapshot — so it's invisible to A.

return { status: "active" }; // A sees the pre-update value, consistently`
    },

    {
      number: 5,
      title: 'Old versions don\'t clean themselves up',
      content: [
        [
          { type: 'text', text: 'Every update leaves the old row version lying around, because some snapshot somewhere might still need it. Once no active transaction could possibly need a version anymore, it\'s dead weight — taking up space and slowing down scans that have to skip past it.' }
        ],
        [
          { type: 'text', text: 'Postgres calls the process that reclaims this space ' },
          { type: 'text', text: 'vacuum', bold: true },
          { type: 'text', text: ': a background job that finds row versions no snapshot can see anymore and physically removes them, freeing the space for reuse.' }
        ]
      ],
      callout: {
        label: 'Trade being made',
        content: [
          [
            { type: 'text', text: 'MVCC trades ' },
            { type: 'text', text: 'extra storage and background cleanup work', bold: true },
            { type: 'text', text: ' for ' },
            { type: 'text', text: 'readers and writers that never block each other', bold: true },
            { type: 'text', text: '. Skip vacuum for too long, under enough write load, and old versions pile up — a problem often called table or index bloat.' }
          ]
        ]
      }
    },

    {
      number: 6,
      title: 'When to reach for it — and what it doesn\'t give you',
      content: [
        [
          { type: 'text', text: 'MVCC is the default in most general-purpose relational databases today precisely because read-heavy, write-heavy, mixed workloads are the common case, and blocking either side on the other doesn\'t scale. It doesn\'t remove the need for locking entirely, though — two writers updating the same row still have to serialize, and snapshot isolation alone doesn\'t prevent every anomaly (write skew is the classic example), which is why some systems layer serializable isolation on top rather than relying on snapshots alone.' }
        ]
      ]
    }
  ],

  tradeoffs: {
    strengths: [
      'Mixed read/write workloads where long reads shouldn\'t block writers',
      'Applications that need consistent, repeatable-read snapshots for reports',
      'Systems already tolerant of background maintenance (vacuum/GC) for cleanup'
    ],
    weaknesses: [
      'Extremely write-heavy tables where version churn outpaces cleanup',
      'Workloads needing every serialization anomaly prevented without extra isolation work',
      'Storage-constrained systems that can\'t absorb temporary bloat from old versions'
    ]
  },

  related: [
    {
      name: 'SSTable',
      description: 'A different setting, same instinct — never edit, always append a new version',
      slug: 'sstable'
    },
    {
      name: 'Cassandra',
      description: 'Solves concurrent writes with timestamps and reconciliation instead of snapshots',
      slug: 'cassandra'
    }
  ]
};