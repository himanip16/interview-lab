"use client";

import { DeepDiveHero } from "@/features/learning/components/DeepDiveHero";
import { CassandraDiagram } from "@/features/learning/components/diagrams/CassandraDiagram";
import { useRouter } from "next/navigation";

export default function CassandraPage() {
  const router = useRouter();

  return (
    <DeepDiveHero
      systemName="Cassandra"
      category="Wide-Column NoSQL"
      eyebrow="WIDE-COLUMN · NoSQL"
      description={[
        "<b>Cassandra</b> is a distributed, wide-column NoSQL database...",
        "Writes go straight to a commit log...",
      ]}
      tags={["Distributed", "High write throughput", "Eventually consistent"]}
      credit="Maintained by"
      creditOrg="Apache Software Foundation"
      diagramSvg={<CassandraDiagram />}
      prevSystem={{ name: "Redis", slug: "redis" }}
      nextSystem={{ name: "Kafka", slug: "kafka" }}
      onReadMore={() => router.push("/learn/scenarios/cassandra")}
      onDocuments={() => window.open("https://cassandra.apache.org/", "_blank")}
    />
  );
}