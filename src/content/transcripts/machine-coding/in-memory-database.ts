// src/content/transcripts/machine-coding/in-memory-database.ts

import { TranscriptData } from "@/features/library/types/transcript";
import { Difficulty } from "@prisma/client";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Design an In-Memory Database",
    difficulty: Difficulty.HARD,
    duration: 60,
    template: "Machine Coding",
    category: "Machine Coding",
  },

  messages: [
    {
      id: "1",
      role: "interviewer",
      elapsedSeconds: 0,
      content: [
        {
          type: "text",
          value:
            "Let's design a small in-memory database. I'd like support for CREATE TABLE, INSERT, and SELECT with simple WHERE clauses. After that we'll extend it.",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 18,
      content: [
        {
          type: "text",
          value:
            "Sounds good. Before jumping into implementation, I'd like to clarify the SQL subset. Should I assume fixed schemas, primitive data types, and equality predicates for WHERE clauses?",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 42,
      content: [
        {
          type: "text",
          value:
            "Yes. Ignore parsing complexity. Focus on storage and execution.",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 58,
      content: [
        {
          type: "text",
          value:
            "In that case I'd separate parsing from execution. The parser produces logical operations like CreateTable, Insert and Select, while the storage engine manages tables and query execution.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 92,
      content: [
        {
          type: "text",
          value:
            "How would you represent a table in memory?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 110,
      content: [
        {
          type: "text",
          value:
            "Initially I thought about storing rows as arrays or objects, but since the follow-up questions seem to be heading toward analytical workloads, I'd actually store data column-wise instead.",
        },
        {
          id: "highlight-column-store",
          type: "highlight",
          status: "strong",
          value: "Choose a column-oriented layout.",
          explanation:
            "Recognizes that analytical queries usually read a subset of columns across many rows, making column stores significantly more efficient.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 154,
      content: [
        {
          type: "text",
          value:
            "Why not a traditional row store?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 174,
      content: [
        {
          type: "text",
          value:
            "Row stores are excellent for OLTP workloads because entire rows are read and written together. Analytical queries often touch only a few columns across millions of rows, so reading contiguous column data improves cache locality and reduces unnecessary memory access.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 222,
      content: [
        {
          type: "text",
          value:
            "Walk me through CREATE TABLE.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 238,
      content: [
        {
          type: "text",
          value:
            "CREATE TABLE registers metadata describing the schema. I'd create an object containing the column definitions and initialize one in-memory vector for every column.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 272,
      content: [
        {
          type: "text",
          value:
            "How does INSERT work with that representation?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 288,
      content: [
        {
          type: "text",
          value:
            "Instead of appending a row object, each value is appended to its corresponding column vector. Every column therefore always has the same logical row count.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 326,
      content: [
        {
          type: "text",
          value:
            "Now implement SELECT with a WHERE clause.",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 344,
      content: [
        {
          type: "text",
          value:
            "I'd first scan the predicate column to determine matching row IDs. Once I have those row IDs, I fetch only the requested columns for those positions and assemble the result set.",
        },
        {
          id: "highlight-vectorized-scan",
          type: "highlight",
          status: "strong",
          value: "Filter first, project later.",
          explanation:
            "Separates predicate evaluation from projection, reducing unnecessary reads in a column-oriented engine.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 392,
      content: [
        {
          type: "text",
          value:
            "Interesting. Let's make it a little harder. Add JOIN support.",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 408,
      content: [
        {
          type: "text",
          value:
            "The simplest implementation would be a nested loop join. For every row in the left table I'd scan every row in the right table and emit matching pairs.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 440,
      content: [
        {
          type: "text",
          value:
            "Complexity?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 450,
      content: [
        {
          type: "text",
          value:
            "O(n × m), so it becomes prohibitively expensive for larger tables.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 470,
      content: [
        {
          type: "text",
          value:
            "Can you do better?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 482,
      content: [
        {
          type: "text",
          value:
            "Yes. Depending on the characteristics of the data I'd consider either a hash join or a sort-merge join.",
        },
      ],
    },
        {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 505,
      content: [
        {
          type: "text",
          value:
            "Walk me through the hash join first.",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 520,
      content: [
        {
          type: "text",
          value:
            "I'd build a hash table on the smaller input using the join key. Then I'd scan the larger table and probe the hash table for matching rows. That reduces the average complexity from quadratic to roughly linear with respect to the input sizes.",
        },
        {
          id: "highlight-hash-join",
          type: "highlight",
          status: "strong",
          value: "Hash the smaller table and probe with the larger one.",
          explanation:
            "Correctly identifies the classic build-and-probe algorithm that avoids the quadratic behavior of nested-loop joins.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 566,
      content: [
        {
          type: "text",
          value:
            "Why specifically hash the smaller table?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 582,
      content: [
        {
          type: "text",
          value:
            "The build phase consumes memory proportional to the table being indexed. Building on the smaller relation minimizes memory usage and usually improves cache locality while the larger relation is streamed during the probe phase.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 622,
      content: [
        {
          type: "text",
          value:
            "Suppose neither table fits comfortably in memory.",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 640,
      content: [
        {
          type: "text",
          value:
            "Then I'd partition both tables using the same hash function so that matching keys land in the same partition. Each partition pair can then be processed independently without requiring the entire relation to reside in memory.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 682,
      content: [
        {
          type: "text",
          value:
            "Good. When would you choose a sort-merge join instead?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 698,
      content: [
        {
          type: "text",
          value:
            "If both inputs are already sorted on the join key—or indexes can produce rows in sorted order—a sort-merge join becomes attractive. It walks both inputs simultaneously, much like merging two sorted arrays, without building a large hash table.",
        },
        {
          id: "highlight-sort-merge",
          type: "highlight",
          status: "strong",
          value: "Sort-Merge Join for ordered inputs.",
          explanation:
            "Recognizes that preserving ordering can make merge joins more efficient than hashing.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 742,
      content: [
        {
          type: "text",
          value:
            "So is hash join always the better choice?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 758,
      content: [
        {
          type: "text",
          value:
            "Not necessarily. Hash joins are usually faster for equality joins on unsorted data, but they require additional memory. Merge joins work well when data is already ordered, preserve sorted output, and are often preferable for very large datasets that can be processed sequentially.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 808,
      content: [
        {
          type: "text",
          value:
            "Would your database hardcode one algorithm?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 824,
      content: [
        {
          type: "text",
          value:
            "I'd have the query planner choose. It can estimate table sizes, available indexes, ordering and memory before selecting the cheapest execution plan.",
        },
        {
          id: "highlight-query-planner",
          type: "highlight",
          status: "strong",
          value: "Join strategy belongs in the query planner.",
          explanation:
            "Modern databases use cost-based optimization instead of always choosing a fixed join algorithm.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 870,
      content: [
        {
          type: "text",
          value:
            "Nice. Let's make the database transactional.",
        },
      ],
    },
        {
      id: "34",
      role: "candidate",
      elapsedSeconds: 886,
      content: [
        {
          type: "text",
          value:
            "Sure. The biggest addition would be ensuring that multiple operations execute atomically while allowing concurrent readers and writers without corrupting data.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 912,
      content: [
        {
          type: "text",
          value:
            "Let's start with durability. Suppose the process crashes halfway through a transaction. How do you recover?",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 930,
      content: [
        {
          type: "text",
          value:
            "I'd introduce a Write-Ahead Log. Before modifying any table pages, every change is first appended to a durable sequential log. Only after the log entry is safely persisted do we apply the change to the actual data structures.",
        },
        {
          id: "highlight-wal",
          type: "highlight",
          status: "strong",
          value: "Write changes to the log before data pages.",
          explanation:
            "Correctly explains the write-ahead logging rule that guarantees durability after crashes.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 980,
      content: [
        {
          type: "text",
          value:
            "Why not just write directly to the table?",
        },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 998,
      content: [
        {
          type: "text",
          value:
            "Because a crash could leave only part of the transaction applied. The WAL becomes the source of truth during recovery. After restarting, the database replays committed log records and ignores incomplete transactions.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 1042,
      content: [
        {
          type: "text",
          value:
            "Durability is one part of ACID. What about isolation? Multiple transactions are running at the same time.",
        },
      ],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 1064,
      content: [
        {
          type: "text",
          value:
            "Rather than blocking every reader with locks, I'd use Multi-Version Concurrency Control. Instead of overwriting rows, updates create new versions. Readers continue seeing the version that was committed when their transaction started, while writers create newer versions independently.",
        },
        {
          id: "highlight-mvcc",
          type: "highlight",
          status: "strong",
          value: "Readers see snapshots while writers create new versions.",
          explanation:
            "Correctly describes the core idea behind MVCC without forcing readers and writers to block each other.",
        },
      ],
    },

    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 1120,
      content: [
        {
          type: "text",
          value:
            "How does a reader know which version is visible?",
        },
      ],
    },

    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 1142,
      content: [
        {
          type: "text",
          value:
            "Each row version would carry transaction metadata such as its creating transaction and whether it has been committed. A transaction reads the newest committed version that's visible in its snapshot.",
        },
      ],
    },

    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 1186,
      content: [
        {
          type: "text",
          value:
            "What happens to all the old versions over time?",
        },
      ],
    },

    {
      id: "44",
      role: "candidate",
      elapsedSeconds: 1202,
      content: [
        {
          type: "text",
          value:
            "Once no active transaction can observe an old version anymore, a background vacuum or garbage collection process can safely reclaim that memory.",
        },
      ],
    },

    {
      id: "45",
      role: "interviewer",
      elapsedSeconds: 1236,
      content: [
        {
          type: "text",
          value:
            "Can you explain exactly how snapshot visibility works internally?",
        },
      ],
    },

    {
      id: "46",
      role: "candidate",
      elapsedSeconds: 1258,
      content: [
        {
          type: "text",
          value:
            "At a high level, each transaction operates against a consistent snapshot of committed data. I understand the general mechanism—transactions determine visibility using version metadata—but I have to admit I don't remember every implementation detail around snapshot construction and visibility rules off the top of my head.",
        },
        {
          id: "highlight-mvcc-depth",
          type: "highlight",
          status: "missed",
          value: "",
          explanation:
            "Explains MVCC conceptually but doesn't go into version chains, transaction IDs, snapshot creation, or precise visibility rules.",
        },
      ],
    },

    {
      id: "47",
      role: "interviewer",
      elapsedSeconds: 1320,
      content: [
        {
          type: "text",
          value:
            "That's okay. I mainly wanted to understand how far you've explored database internals.",
        },
      ],
    },

    {
      id: "48",
      role: "candidate",
      elapsedSeconds: 1334,
      content: [
        {
          type: "text",
          value:
            "I enjoyed this problem because every optimization uncovered another layer—from storage layout to query execution, then joins, and finally transaction processing. It definitely gave me a much greater appreciation for how much work happens underneath a simple SQL query.",
        },
      ],
    },

    {
      id: "49",
      role: "takeaway",
      elapsedSeconds: 1370,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Good database design starts with choosing the right storage model for the workload. Column-oriented storage improves analytical scans, while query execution benefits from separating filtering from projection and selecting join algorithms based on data characteristics rather than hardcoding one approach. Hash joins, merge joins and cost-based planning all contribute to efficient execution. Beyond query processing, ACID guarantees require durability through Write-Ahead Logging and concurrency through MVCC, where readers operate on consistent snapshots while writers create new versions. Every answer in the interview naturally led deeper into database internals, reinforcing that understanding trade-offs is often more important than memorizing implementations.",
        },
      ],
    },
  ],
};

const inMemoryDatabase: TranscriptEntry = {
  summary: {
    slug: "in-memory-database",
    title: "Design an In-Memory Database",
    category: "machine-coding",
    difficulty: Difficulty.HARD,
    duration: 60,
    company: "General",
    tags: [
      "Machine Coding",
      "Database Internals",
      "Column Store",
      "Query Execution",
      "Hash Join",
      "Sort Merge Join",
      "Cost Based Optimizer",
      "Write Ahead Logging",
      "MVCC",
      "ACID",
    ],
    description:
      "Machine coding interview focused on building an in-memory SQL database, progressing from storage engine design and query execution to join optimization, query planning, transactions, WAL, MVCC, and ACID guarantees.",
  },

  transcript,
};

export default inMemoryDatabase;