// src/app/learn/diagrams/cassandra/page.tsx

"use client";

import { DeepDiveHero } from "@/features/deep-dive/components/DeepDiveHero";
import { CassandraDiagram } from "@/features/learning/components/diagrams/CassandraDiagram";

export default function CassandraPage() {
  return (
    <DeepDiveHero
      systemName="Cassandra"
      systemSlug="cassandra"
      category="Wide-Column NoSQL"
      eyebrow="WIDE-COLUMN · NOSQL"
      description={[
        <>
          <strong>Cassandra</strong> is a distributed, wide-column NoSQL
          database designed for high availability and horizontal scalability.
        </>,
        <>
          Writes are first appended to a commit log for durability before being
          stored in memory and later flushed to immutable SSTables on disk.
        </>,
      ]}
      tags={[
        "Distributed",
        "High write throughput",
        "Eventually consistent",
      ]}
      creditOrg="Apache Software Foundation"
      diagramSvg={<CassandraDiagram />}
      docsUrl="https://cassandra.apache.org/"
    />
  );
}