// src/features/learning/data/mockData.ts

import {
  SystemDesign,
  NodeLayout,
  NodeId,
  DiagramEdge,
} from "@/features/whiteboard/types/whiteboard";

const id = (value: string) => value as NodeId;

const edge = (
  id: string,
  from: NodeId,
  to: NodeId
): DiagramEdge => ({
  id,
  from,
  to,
});

export const DESIGN: SystemDesign = {
  slug: "url-shortener",
  title: "Design a URL Shortener",

  nodes: [
    {
      id: id("client"),
      title: "Client App",
      category: "entry",
      details: {
        role: "Sends long URLs and receives short codes; handles redirects.",
        deepDive: "Local caching of frequent redirects to reduce latency.",
        failureModes: "DNS issues or client-side timeout handling.",
        tradeoffs: "Thick client vs Thin client logic distribution.",
      },
    },
    {
      id: id("gateway"),
      title: "API Gateway",
      category: "network",
      details: {
        role: "Entry point for all requests; handles auth and rate limiting.",
        deepDive: "Uses Token Bucket algorithm for per-IP rate limiting.",
        failureModes: "Single point of failure if not multi-AZ.",
        tradeoffs: "Adds 5-10ms latency but centralizes security.",
      },
    },
    {
      id: id("service"),
      title: "Shortener Service",
      category: "logic",
      details: {
        role: "Core logic for generating and resolving short codes.",
        deepDive: "Base62 encoding of a distributed counter.",
        failureModes: "Counter service unavailability prevents new links.",
        tradeoffs: "Hash-based vs Counter-based ID generation.",
      },
    },
    {
      id: id("db"),
      title: "KV Store",
      category: "storage",
      details: {
        role: "Highly available storage for mapping codes to URLs.",
        deepDive: "LSM-tree based storage for high write throughput.",
        failureModes: "Eventual consistency during partition events.",
        tradeoffs: "SQL for durability vs NoSQL for horizontal scale.",
      },
    },
  ],

  edges: [
    edge("client-gateway", id("client"), id("gateway")),
    edge("gateway-service", id("gateway"), id("service")),
    edge("service-db", id("service"), id("db")),
  ],
};

export const LAYOUT: NodeLayout[] = [
  { nodeId: id("client"), gridPos: { x: 2, y: 2 } },
  { nodeId: id("gateway"), gridPos: { x: 10, y: 2 } },
  { nodeId: id("service"), gridPos: { x: 6, y: 5 } },
  { nodeId: id("db"), gridPos: { x: 6, y: 10 } },
];