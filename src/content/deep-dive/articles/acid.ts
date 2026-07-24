// src/content/deep-dive/articles/acid.ts

import { DeepDiveArticle } from '@/features/deep-dive/types';
import { AcidIllustration } from '@/content/deep-dive/illustrations/Acid';

export const article: DeepDiveArticle = {
    heroIllustration: AcidIllustration,
  slug: 'acid',
  category: 'db',
  readTime: '10 min',
  name: 'ACID',
  eyebrow: 'TRANSACTIONS · GUARANTEES',
  description: 'ACID is a set of four guarantees a transactional database makes about its transactions. It\'s the main mechanism relational databases use to deliver isolation. None of the four properties is free. Each one exists because, left unguaranteed, some ordinary sequence of events would otherwise break the data in a specific, predictable way.',
  tags: ['Transactions', 'Strong guarantees', 'Relational databases'],
  credit: 'Formalized for',
  creditOrg: 'PostgreSQL, MySQL, Oracle, SQL Server, SQLite',
  docsUrl: 'https://www.postgresql.org/docs/current/tutorial-transactions.html',
  title: 'ACID, and the four ways a transaction can go wrong without it',
  lede: 'A transaction is a promise: do all of these steps together, as if they were one single step. That promise is easy to state and surprisingly hard to keep — a crash can happen halfway through, another transaction can be reading the same row at the same instant, a rule the data must obey can get violated for a moment mid-update. ACID isn\'t one mechanism; it\'s four separate answers to four separate ways that promise can break, and most of what a transactional database actually does is enforcing them.',

  sections: [
    {
      number: 1,
      title: 'Atomicity: all of it, or none of it',
      content: [
        [
          { type: 'text', text: 'A transaction is usually more than one write. Transferring money means debiting one account and crediting another — two operations that have to succeed or fail as a single unit. If the process crashes after the debit but before the credit, atomicity is what guarantees the debit gets rolled back too, rather than money simply vanishing.' }
        ],
        [
          { type: 'text', text: 'Databases typically get this from a write-ahead log: every change is recorded before it\'s applied, so on restart, the database can replay a transaction\'s log entries to finish it, or undo them to erase it — but it never leaves a transaction half-applied.' }
        ]
      ],
      illustration: {
        component: 'ACIDAtomicityIllustration',
        caption: 'A crash mid-transaction rolls back everything already applied, not just what\'s left',
        width: 'full'
      }
    },

    {
      number: 2,
      title: 'Consistency: never a broken rule, even for a moment',
      content: [
        [
          { type: 'text', text: 'Consistency here means something narrower than the everyday word: every transaction must take the database from one state that obeys its declared rules — constraints, foreign keys, uniqueness — to another state that also obeys them. It says nothing about what those rules are; it just says a committed transaction can never leave one broken.' }
        ]
      ],
      code: `// A constraint the database enforces at commit time
ALTER TABLE accounts ADD CONSTRAINT no_negative_balance
  CHECK (balance >= 0);

BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 'A'; -- balance would go to -20
COMMIT;
-- ERROR: new row for relation "accounts" violates check constraint
-- The whole transaction is rejected — the rule was never actually broken`,
      callout: {
        label: 'Worth remembering',
        content: [
          [
            { type: 'text', text: 'Consistency is the odd one out of the four — it\'s not something the database engine invents on its own. It\'s ', bold: false },
            { type: 'text', text: 'whatever rules you declare', bold: true },
            { type: 'text', text: ', enforced automatically. The other three properties exist so consistency actually holds in practice, not just on paper.' }
          ]
        ]
      }
    },

    {
      number: 3,
      title: 'Isolation: pretend you\'re the only one running',
      content: [
        [
          { type: 'text', text: 'Two transactions running at the same time could, in principle, see each other\'s half-finished work — a reader glimpsing an account mid-transfer, after the debit but before the credit. Isolation is the guarantee that concurrent transactions behave as if they ran one after another, even though the database is actually interleaving or parallelizing them for performance.' }
        ],
        [
          { type: 'text', text: 'This is the one property that comes in degrees. Databases offer a spectrum of isolation levels — read committed, repeatable read, serializable — trading strictness for concurrency. Most implementations lean on ' },
          {
            type: 'link',
            text: 'MVCC',
            href: { type: 'deep-dive', target: 'mvcc', preview: 'How readers and writers avoid blocking each other by keeping multiple row versions' }
          },
          { type: 'text', text: ' to get much of this isolation without forcing transactions to queue up and wait.' }
        ]
      ],
      illustration: {
        component: 'ACIDIsolationIllustration',
        caption: 'Isolation levels trade strictness for concurrency along a spectrum',
        width: 'full'
      }
    },

    {
      number: 4,
      title: 'Durability: once it\'s confirmed, it survives anything',
      content: [
        [
          { type: 'text', text: 'The moment a database tells a client "committed," durability is the promise that the change will still be there after a power loss, a crash, a kernel panic — anything short of the storage medium itself being destroyed. This is usually the most literal of the four: it means the change has actually been forced to durable storage, not just handed to an operating system write buffer that might still be sitting in RAM.' }
        ]
      ],
      code: `// What "committed" actually requires under durability
function commit(transaction) {
  writeAheadLog.append(transaction.changes);
  writeAheadLog.fsync();        // force to disk — not just to OS cache
  return "COMMITTED";           // only now is the promise real
}

// Skipping fsync makes commits faster and durability a lie:
// a crash before the OS flushes its buffer loses the "committed" write`
    },

    {
      number: 5,
      title: 'Walking through one transaction',
      content: [
        [
          { type: 'text', text: 'Concretely: transferring 100 from account A to account B.' }
        ]
      ],
      code: `BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 'A'; -- Atomicity: paired with the next line
  UPDATE accounts SET balance = balance + 100 WHERE id = 'B'; -- or neither happens
COMMIT;                                                       -- Durability: now survives a crash

// While this runs:
// - Consistency: neither balance can go negative if a CHECK forbids it
// - Isolation:   another transaction reading A or B mid-transfer sees
//                either the state before, or the state after — never
//                a moment where only one side of the transfer happened`
    },

    {
      number: 6,
      title: 'What ACID costs, and when it\'s worth it',
      content: [
        [
          { type: 'text', text: 'All four guarantees cost something real: fsyncs are slow, isolation limits how much work can truly run in parallel, and enforcing constraints on every write is extra CPU on the hot path. Systems that relax ACID — many distributed and NoSQL databases among them — do it deliberately, trading strict guarantees for throughput and availability, often replacing strong consistency with eventual consistency and reconciliation at read time instead.' }
        ],
        [
          { type: 'text', text: 'That trade-off is a real design decision, not a shortcut: it\'s the right one for data where a brief window of staleness is harmless, and the wrong one for anything where "probably correct" isn\'t good enough — money, inventory, anything with a rule that must never be violated, even momentarily.' }
        ]
      ]
    }
  ],

  tradeoffs: {
    strengths: [
      'Financial transactions and anything where partial updates are unacceptable',
      'Data with hard invariants that must never be violated, even briefly',
      'Systems where correctness matters more than raw write throughput'
    ],
    weaknesses: [
      'Massive-scale, geographically distributed writes where fsyncs and locking cap throughput',
      'Workloads that can tolerate eventual consistency in exchange for availability',
      'Append-heavy data (logs, events, metrics) with no cross-row invariants to protect'
    ]
  },

  related: [
    {
      name: 'MVCC',
      description: 'The main mechanism relational databases use to deliver isolation',
      slug: 'mvcc'
    },
    {
      name: 'Cassandra',
      description: 'Deliberately gives up strict ACID guarantees for write throughput and availability',
      slug: 'cassandra'
    }
  ]
};