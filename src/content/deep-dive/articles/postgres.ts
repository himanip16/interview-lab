// src/content/deep-dive/articles/postgres.ts

import { DeepDiveArticle, Paragraph } from "@/features/deep-dive/types";
import { PostgresIllustration } from "@/content/deep-dive/illustrations/Postgres";

const p = (text: string): Paragraph => [
  {
    type: "text",
    text,
  },
];

export const article: DeepDiveArticle = {
  heroIllustration: PostgresIllustration,
  slug: "postgres",
  name: "Postgres",
  eyebrow: "RELATIONAL · SQL",

  description: 'PostgreSQL is a powerful, open-source relational database. It emphasizes extensibility and SQL compliance. It supports complex queries, transactions, and a wide range of data types. Postgres is often the default choice for applications requiring strong consistency.',

  tags: ["Relational", "ACID", "Extensible"],
  category: "db",
  readTime: "12 min",

  credit: "Maintained by",
  creditOrg: "PostgreSQL Global Development Group",
  docsUrl: "https://www.postgresql.org/docs/",

  title: "Postgres, and why it's still relevant",

  lede:
    "Postgres is the workhorse of the database world—reliable, feature-rich, and battle-tested. Understanding its MVCC architecture explains why it handles concurrency so well while maintaining ACID guarantees.",

  sections: [
    {
      number: 1,
      title: "MVCC for concurrency",
      content: [
        p(
          "Postgres uses Multi-Version Concurrency Control (MVCC) to handle concurrent reads and writes without locking."
        ),
        p(
          "Each transaction sees a snapshot of the database as of when it started. This means readers never block writers, and writers never block readers."
        ),
      ],
    },
    {
      number: 2,
      title: "Write-ahead logging",
      content: [
        p(
          "Changes are first written to a write-ahead log (WAL) before being applied to data files. This ensures durability and enables point-in-time recovery."
        ),
        p(
          "The WAL is also used for replication, making it easy to set up streaming replicas."
        ),
      ],
    },
    {
      number: 3,
      title: "Extensibility",
      content: [
        p(
          "Postgres supports custom data types, functions, and extensions. You can add JSONB, PostGIS for geospatial data, or even write your own extensions."
        ),
        p(
          "This extensibility makes Postgres adaptable to a wide range of use cases beyond traditional relational data."
        ),
      ],
    },
    {
      number: 4,
      title: "When to use it—and when not to",
      content: [],
    },
  ],

  tradeoffs: {
    strengths: [
      "Strong ACID guarantees",
      "Rich SQL feature set",
      "Extensible architecture",
    ],
    weaknesses: [
      "Vertical scaling limits",
      "Write performance can bottleneck",
      "Not ideal for massive write-heavy workloads",
    ],
  },

  related: [
    {
      name: "Cassandra",
      description: "Distributed NoSQL for write-heavy workloads",
      slug: "cassandra",
    },
    {
      name: "DynamoDB",
      description: "Managed NoSQL with different scaling characteristics",
      slug: "dynamodb",
    },
  ],
};