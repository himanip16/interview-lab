import { Interview } from "@/src/features/interview/types/interview";

export const interviews: Interview[] = [
  {
    id: "SYSTEM_DESIGN",
    title: "High Level Design",
    description: "Design scalable distributed systems.",
    duration: 45,
    difficulty: "Medium",
  },
  {
    id: "LOW_LEVEL_DESIGN",
    title: "Low Level Design",
    description: "Object-oriented design and patterns.",
    duration: 60,
    difficulty: "Medium",
  },
  {
    id: "LOW_LEVEL_DESIGN",
    title: "Backend Fundamentals",
    description: "REST APIs, caching, databases and scaling.",
    duration: 45,
    difficulty: "Medium",
  },
  {
    id: "LOW_LEVEL_DESIGN",
    title: "Java Core",
    description: "Collections, JVM, concurrency and streams.",
    duration: 30,
    difficulty: "Medium",
  },
  {
    id: "LOW_LEVEL_DESIGN",
    title: "SQL & Databases",
    description: "Queries, indexing, normalization and transactions.",
    duration: 30,
    difficulty: "Easy",
  },
  {
    id: "LOW_LEVEL_DESIGN",
    title: "Distributed Systems",
    description: "Kafka, Redis, CAP theorem and replication.",
    duration: 60,
    difficulty: "Hard",
  },
];

console.log("Interview type:", interviews[0].id);