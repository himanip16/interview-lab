// src/features/learning/data/scenarios.ts

import { Scenario, NodeId } from "@/features/whiteboard/types/whiteboard";

// Helper function to create NodeId values
function createNodeId(id: string): NodeId {
  return id as NodeId;
}

export const URL_SHORTENER_SCENARIOS: Scenario[] = [
  {
    id: "create-short-url",
    question: "How does a user create a short URL?",
    category: "user",
    prerequisiteNodeIds: [
      createNodeId("client"),
      createNodeId("gateway"),
      createNodeId("service"),
      createNodeId("db"),
    ],
    relatedScenarioIds: ["redirect-short-url", "handle-failure"],
    steps: [
      {
        id: "step-1",
        nodeId: createNodeId("client"),
        narration: "User opens the app and enters a long URL they want to shorten. The client app validates the input format.",
        waitForUser: true,
        nextStepId: "step-2",
      },
      {
        id: "step-2",
        nodeId: createNodeId("gateway"),
        narration: "The client sends a POST request to the API gateway. The gateway validates the request, applies rate limiting, and routes it to the shortener service.",
        waitForUser: true,
        nextStepId: "step-3",
      },
      {
        id: "step-3",
        nodeId: createNodeId("service"),
        narration: "The shortener service generates a unique short code using base62 encoding over an auto-incrementing counter. This ensures no collisions while keeping codes short.",
        waitForUser: true,
        nextStepId: "step-4",
      },
      {
        id: "step-4",
        nodeId: createNodeId("db"),
        narration: "The service persists the mapping between the short code and the original URL in the key-value store. The data is replicated across zones for durability.",
        waitForUser: true,
      },
    ],
    startStepId: "step-1",
  },
  {
    id: "redirect-short-url",
    question: "How does a redirect work?",
    category: "user",
    prerequisiteNodeIds: [
      createNodeId("client"),
      createNodeId("gateway"),
      createNodeId("service"),
      createNodeId("db"),
    ],
    relatedScenarioIds: ["create-short-url", "cache-miss"],
    steps: [
      {
        id: "redirect-1",
        nodeId: createNodeId("client"),
        narration: "User visits a short URL. The client app makes a GET request to resolve the original URL.",
        waitForUser: true,
        nextStepId: "redirect-2",
      },
      {
        id: "redirect-2",
        nodeId: createNodeId("gateway"),
        narration: "The request hits the API gateway, which routes it to the shortener service for resolution.",
        waitForUser: true,
        nextStepId: "redirect-3",
      },
      {
        id: "redirect-3",
        nodeId: createNodeId("service"),
        narration: "The service looks up the short code in the key-value store. If found, it returns the original URL with a 301 redirect response.",
        waitForUser: true,
        nextStepId: "redirect-4",
      },
      {
        id: "redirect-4",
        nodeId: createNodeId("client"),
        narration: "The client receives the redirect and automatically navigates to the original URL. The browser may cache the redirect for future visits.",
        waitForUser: true,
      },
    ],
    startStepId: "redirect-1",
  },
  {
    id: "handle-failure",
    question: "What happens if the database is down?",
    category: "failure",
    prerequisiteNodeIds: [createNodeId("service"), createNodeId("db")],
    relatedScenarioIds: ["create-short-url", "redirect-short-url"],
    steps: [
      {
        id: "failure-1",
        nodeId: createNodeId("service"),
        narration: "The shortener service attempts to write to the database but receives a connection error. The service has a retry mechanism with exponential backoff.",
        waitForUser: true,
        nextStepId: "failure-2",
      },
      {
        id: "failure-2",
        nodeId: createNodeId("service"),
        narration: "After several failed retries, the service returns a 503 Service Unavailable response to the client with a clear error message.",
        waitForUser: true,
        nextStepId: "failure-3",
      },
      {
        id: "failure-3",
        nodeId: createNodeId("db"),
        narration: "The database is replicated across zones. If the primary fails, a replica is promoted to maintain service. Data from the failed primary is recovered from the replication log.",
        waitForUser: true,
      },
    ],
    startStepId: "failure-1",
  },
];
