// src/content/deep-dive/articles/acid.ts

import type { DeepDiveArticle } from "@/features/deep-dive/types";

export const article: DeepDiveArticle = {
  metadata: {
    slug: "acid",
    name: "ACID",
    eyebrow: "TRANSACTIONS · GUARANTEES",
    description:
      "ACID is a set of four guarantees a transactional database makes about its transactions. It's the main mechanism relational databases use to deliver isolation.",
    category: "db",
    tags: ["Transactions", "Strong guarantees", "Relational databases"],

    // Operations
    published: true,
    draft: false,
    version: "1.0.0",
    publishedAt: "2026-01-15",
    updatedAt: "2026-07-27",

    // Metrics & Attribution
    estimatedReadingMinutes: 10,
    credit: "Formalized for",
    creditOrg: "PostgreSQL, MySQL, Oracle, SQL Server, SQLite",
    docsUrl:
      "https://www.postgresql.org/docs/current/tutorial-transactions.html",

    // Discovery & Graph
    keywords: [
      "ACID",
      "Transactions",
      "Atomicity",
      "Consistency",
      "Isolation",
      "Durability",
      "MVCC",
    ],
    aliases: ["ACID Guarantees", "Database Transactions"],
    learningObjectives: [
      "Understand the four guarantees of ACID and why each exists",
      "Learn how databases implement write-ahead logging for atomicity and durability",
      "Identify trade-offs between ACID guarantees and high-throughput distributed systems",
    ],
    difficulty: {
      level: 2,
      prerequisites: ["relational-databases", "sql-basics"],
    },
  },

  heroDiagram: {
    type: "diagram",
    renderEngine: "component",
    componentName: "AcidIllustration",
    caption: "The four pillars of database transaction guarantees",
    alt: "Diagram illustrating Atomicity, Consistency, Isolation, and Durability",
    width: "full",
  },

  lede: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "A transaction is a promise: do all of these steps together, as if they were one single step. That promise is easy to state and surprisingly hard to keep — a crash can happen halfway through, another transaction can be reading the same row at the same instant, or a rule the data must obey can get violated for a moment mid-update. ACID isn't one mechanism; it's four separate answers to four separate ways that promise can break.",
        },
      ],
    },
  ],

  sections: [
    {
      id: "atomicity",
      number: 1,
      title: "Atomicity: all of it, or none of it",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "A transaction is usually more than one write. Transferring money means debiting one account and crediting another — two operations that have to succeed or fail as a single unit. If the process crashes after the debit but before the credit, atomicity is what guarantees the debit gets rolled back too, rather than money simply vanishing.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Databases typically get this from a write-ahead log: every change is recorded before it's applied, so on restart, the database can replay a transaction's log entries to finish it, or undo them to erase it — but it never leaves a transaction half-applied.",
            },
          ],
        },
        {
          type: "diagram",
          renderEngine: "component",
          componentName: "ACIDAtomicityIllustration",
          caption:
            "A crash mid-transaction rolls back everything already applied, not just what's left",
          alt: "Illustration of transaction rollback state during crash recovery",
          width: "full",
        },
      ],
    },

    {
      id: "consistency",
      number: 2,
      title: "Consistency: never a broken rule, even for a moment",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Consistency here means something narrower than the everyday word: every transaction must take the database from one state that obeys its declared rules — constraints, foreign keys, uniqueness — to another state that also obeys them. It says nothing about what those rules are; it just says a committed transaction can never leave one broken.",
            },
          ],
        },
        {
          type: "code",
          language: "sql",
          title: "Database Check Constraint",
          code: `-- A constraint the database enforces at commit time
ALTER TABLE accounts ADD CONSTRAINT no_negative_balance
  CHECK (balance >= 0);

BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 'A'; -- balance would go to -20
COMMIT;
-- ERROR: new row for relation "accounts" violates check constraint
-- The whole transaction is rejected — the rule was never actually broken`,
        },
        {
          type: "callout",
          variant: "note",
          label: "Worth remembering",
          title: "Consistency relies on invariants",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Consistency is the odd one out of the four — it's not something the database engine invents on its own. It's ",
                },
                {
                  type: "bold",
                  text: "whatever rules you declare",
                },
                {
                  type: "text",
                  text: ", enforced automatically. The other three properties exist so consistency actually holds in practice, not just on paper.",
                },
              ],
            },
          ],
        },
      ],
    },

    {
      id: "isolation",
      number: 3,
      title: "Isolation: pretend you're the only one running",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Two transactions running at the same time could, in principle, see each other's half-finished work — a reader glimpsing an account mid-transfer, after the debit but before the credit. Isolation is the guarantee that concurrent transactions behave as if they ran one after another, even though the database is actually interleaving or parallelizing them for performance.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "This is the one property that comes in degrees. Databases offer a spectrum of isolation levels — read committed, repeatable read, serializable — trading strictness for concurrency. Most implementations lean on ",
            },
            {
              type: "link",
              text: "MVCC",
              ref: {
                kind: "deep-dive",
                target: "mvcc",
                preview:
                  "How readers and writers avoid blocking each other by keeping multiple row versions",
              },
            },
            {
              type: "text",
              text: " to get much of this isolation without forcing transactions to queue up and wait.",
            },
          ],
        },
        {
          type: "diagram",
          renderEngine: "component",
          componentName: "ACIDIsolationIllustration",
          caption:
            "Isolation levels trade strictness for concurrency along a spectrum",
          alt: "Spectrum chart showing isolation levels vs concurrency performance",
          width: "full",
        },
      ],
    },

    {
      id: "durability",
      number: 4,
      title: "Durability: once it's confirmed, it survives anything",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The moment a database tells a client 'committed,' durability is the promise that the change will still be there after a power loss, a crash, or a kernel panic — anything short of the storage medium itself being destroyed. This means the change has actually been forced to durable storage, not just handed to an operating system write buffer that might still be sitting in RAM.",
            },
          ],
        },
        {
          type: "code",
          language: "typescript",
          title: "Durability Commit Flow",
          code: `// What "committed" actually requires under durability
function commit(transaction) {
  writeAheadLog.append(transaction.changes);
  writeAheadLog.fsync();        // force to disk — not just to OS cache
  return "COMMITTED";           // only now is the promise real
}

// Skipping fsync makes commits faster and durability a lie:
// a crash before the OS flushes its buffer loses the "committed" write`,
        },
      ],
    },

    {
      id: "walkthrough",
      number: 5,
      title: "Walking through one transaction",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Concretely: transferring 100 from account A to account B.",
            },
          ],
        },
        {
          type: "code",
          language: "sql",
          title: "Complete Transaction Example",
          code: `BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 'A'; -- Atomicity: paired with the next line
  UPDATE accounts SET balance = balance + 100 WHERE id = 'B'; -- or neither happens
COMMIT;                                                       -- Durability: now survives a crash

-- While this runs:
-- - Consistency: neither balance can go negative if a CHECK forbids it
-- - Isolation:   another transaction reading A or B mid-transfer sees
--                either the state before, or the state after — never
--                a moment where only one side of the transfer happened`,
        },
      ],
    },

    {
      id: "tradeoffs",
      number: 6,
      title: "What ACID costs, and when it's worth it",
      blocks: [
        {
          type: "tradeoff",
          title: "ACID vs. Eventual Consistency Tradeoff",
          description: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "All four guarantees cost something real: fsyncs are slow, isolation limits parallelism, and enforcing constraints on every write adds CPU overhead on the hot path.",
                },
              ],
            },
          ],
          sides: [
            {
              name: "Strong ACID Guarantees",
              pros: [
                "Guaranteed correctness and zero partial state corruption",
                "Simplifies application logic by keeping constraint logic inside the DB",
                "Essential for financial transactions, billing, and inventory",
              ],
              cons: [
                "Throughput is capped by fsync disk I/O and row locking",
                "Harder to scale horizontally across geographic regions",
              ],
            },
            {
              name: "Eventual Consistency / Relaxed Guarantees",
              pros: [
                "High availability and low latency on global, distributed writes",
                "Scales horizontally without central lock bottlenecks",
              ],
              cons: [
                "Requires application-level conflict resolution and reconciliation",
                "Brief windows of stale or inconsistent reads are visible to users",
              ],
            },
          ],
          verdict: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Relaxing ACID is a deliberate architectural decision. It is right for data where brief staleness is harmless (e.g., social feeds, metrics) and wrong where 'probably correct' isn't acceptable (e.g., banking, core domain ledgers).",
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  resources: [
    {
      type: "article",
      title: "MVCC Architecture",
      description: "The main mechanism relational databases use to deliver isolation without read-write blocking.",
      url: "/deep-dive/mvcc",
      slug: "mvcc",
      relationship: "buildsOn",
    },
    {
      type: "article",
      title: "PostgreSQL Architecture",
      description: "How PostgreSQL implements full ACID compliance with MVCC and write-ahead logging.",
      url: "/deep-dive/postgres",
      slug: "postgres",
      relationship: "buildsOn",
    },
    {
      type: "article",
      title: "Cassandra Architecture",
      description: "Deliberately gives up strict ACID guarantees for write throughput and high availability.",
      url: "/deep-dive/cassandra",
      slug: "cassandra",
      relationship: "contrast",
    },
    {
      type: "article",
      title: "Redis Architecture",
      description: "Compare Redis single-threaded atomic operations with full ACID transaction guarantees.",
      url: "/deep-dive/redis",
      slug: "redis",
      relationship: "contrast",
    },
    {
      type: "article",
      title: "DynamoDB Architecture",
      description: "Explore DynamoDB's conditional writes and eventual consistency trade-offs vs ACID.",
      url: "/deep-dive/dynamodb",
      slug: "dynamodb",
      relationship: "contrast",
    }
  ],
};