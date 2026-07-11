import { Interview } from "@/src/modules/interview/types/interview";

export const interviews: Interview[] = [
  {
    id: "hld",
    title: "High Level Design",
    description: "Design scalable distributed systems.",
    duration: 45,
    difficulty: "Medium",
  },
  {
    id: "lld",
    title: "Low Level Design",
    description: "Object-oriented design and patterns.",
    duration: 60,
    difficulty: "Medium",
  },
  {
    id: "backend",
    title: "Backend Fundamentals",
    description: "REST APIs, caching, databases and scaling.",
    duration: 45,
    difficulty: "Medium",
  },
  {
    id: "java",
    title: "Java Core",
    description: "Collections, JVM, concurrency and streams.",
    duration: 30,
    difficulty: "Medium",
  },
  {
    id: "sql",
    title: "SQL & Databases",
    description: "Queries, indexing, normalization and transactions.",
    duration: 30,
    difficulty: "Easy",
  },
  {
    id: "distributed",
    title: "Distributed Systems",
    description: "Kafka, Redis, CAP theorem and replication.",
    duration: 60,
    difficulty: "Hard",
  },
];

console.log("Interview type:", interviews[0].id);