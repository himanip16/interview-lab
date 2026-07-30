// src/features/learning/data/whiteboardSystems.ts

import { Scenario, SystemDesign, NodeLayout, NodeId } from "@/features/whiteboard/types/whiteboard";
import { UBER_SCENARIOS, URL_SHORTENER_SCENARIOS } from "./scenarios";

function createNodeId(id: string): NodeId {
  return id as NodeId;
}

// System metadata (separate from topology)
export interface WhiteboardSystemMetadata {
  slug: string;
  label: string;
  title: string;
  oneLiner: string;
  comps: number;
  flows: number;
  mark: string;
  scenarios?: Scenario[];
}

// ============================================================================
// URL SHORTENER SYSTEM
// ============================================================================

export const URL_SHORTENER_DESIGN: SystemDesign = {
  slug: "url-shortener",
  title: "URL Shortener",
  nodes: [
    {
      id: createNodeId("client"),
      title: "Client app",
      category: "entry",
      details: {
        role: "Sends a long URL, gets back a short code, and redirects when that code is visited later.",
        deepDive: "Caches the last few redirects locally so repeat visits skip the network round trip.",
        failureModes: "If the gateway is unreachable, falls back to a \"try again\" state rather than a blank redirect.",
        tradeoffs: "Could resolve short codes locally for speed, but that would mean shipping the whole mapping to every client — not worth it at this scale."
      }
    },
    {
      id: createNodeId("gateway"),
      title: "API gateway",
      category: "network",
      details: {
        role: "Single entry point for reads and writes — validates the request and routes to the shortener service.",
        deepDive: "Rate-limits by IP to stop one client from generating millions of codes.",
        failureModes: "Stateless, so any instance can go down without losing in-flight requests — the load balancer just stops sending it traffic.",
        tradeoffs: "Centralizing here adds a hop, but keeping auth and rate-limiting in one place beats duplicating it in every service."
      }
    },
    {
      id: createNodeId("service"),
      title: "Shortener service",
      category: "logic",
      details: {
        role: "Generates a unique short code and writes the mapping; resolves a code back to the original URL on read.",
        deepDive: "Uses base62 encoding over an auto-incrementing counter, so codes stay short and collisions are structurally impossible.",
        failureModes: "If code generation fails mid-write, the write is retried with a fresh counter value rather than silently returning a broken link.",
        tradeoffs: "Hash-based codes would avoid a shared counter, but base62-over-counter is simpler and collisions become the harder problem to solve."
      }
    },
    {
      id: createNodeId("db"),
      title: "Key-value store",
      category: "storage",
      details: {
        role: "Stores the short-code to long-URL mapping and serves reads with very low latency.",
        deepDive: "Reads are cached in front of the store, since the access pattern is extremely read-heavy relative to writes.",
        failureModes: "Replicated across zones — losing one replica costs latency, not data.",
        tradeoffs: "A relational database would make analytics easier, but a key-value store is a better match for how this data is actually accessed: by exact key, constantly."
      }
    }
  ],
  edges: [
    { id: "url-shortener-e1", from: createNodeId("client"), to: createNodeId("gateway") },
    { id: "url-shortener-e2", from: createNodeId("gateway"), to: createNodeId("service") },
    { id: "url-shortener-e3", from: createNodeId("service"), to: createNodeId("db") }
  ]
};

export const URL_SHORTENER_LAYOUT: NodeLayout[] = [
  { nodeId: createNodeId("client"), gridPos: { x: 2, y: 5 } },
  { nodeId: createNodeId("gateway"), gridPos: { x: 5, y: 5 } },
  { nodeId: createNodeId("service"), gridPos: { x: 8, y: 5 } },
  { nodeId: createNodeId("db"), gridPos: { x: 8, y: 8 } }
];

// ============================================================================
// UBER SYSTEM
// ============================================================================

export const UBER_DESIGN: SystemDesign = {
  slug: "uber",
  title: "Uber",
  nodes: [
    {
      id: createNodeId("rider-app"),
      title: "Rider App",
      category: "entry",
      details: {
        role: "Rider's mobile app for requesting rides, viewing driver details, and tracking trip progress.",
        deepDive: "Uses location services for pickup/dropoff, stores ride history locally, and handles real-time updates via websockets.",
        failureModes: "If network fails, app queues requests and retries when connection is restored. Shows cached driver data when offline.",
        tradeoffs: "Native apps provide better performance but require separate development for iOS/Android. Web version would be universal but less performant."
      }
    },
    {
      id: createNodeId("driver-app"),
      title: "Driver App",
      category: "entry",
      details: {
        role: "Driver's mobile app for receiving ride requests, navigation, and trip management.",
        deepDive: "Continuously streams driver location to backend, receives ride offers with surge pricing info, and integrates with mapping for navigation.",
        failureModes: "If location service fails, driver can't receive ride requests. App falls back to manual status updates until location is restored.",
        tradeoffs: "Background location tracking drains battery, but is essential for real-time matching. App optimizes by batching location updates."
      }
    },
    {
      id: createNodeId("api-gateway"),
      title: "API Gateway",
      category: "network",
      details: {
        role: "Single entry point for all API requests - handles authentication, rate limiting, and routing to appropriate services.",
        deepDive: "Implements JWT authentication, per-user rate limits to prevent abuse, and routes requests based on API version and endpoint.",
        failureModes: "Stateless design allows horizontal scaling. If one instance fails, load balancer redirects traffic to healthy instances.",
        tradeoffs: "Adds a network hop but centralizes cross-cutting concerns like auth and rate limiting, avoiding duplication across services."
      }
    },
    {
      id: createNodeId("dispatch-service"),
      title: "Dispatch Service",
      category: "logic",
      details: {
        role: "Real-time driver matching algorithm - finds nearby drivers, ranks them, and sends ride offers.",
        deepDive: "Uses geospatial queries to find drivers within radius, ranks by distance/rating/acceptance rate, and handles offer expiration.",
        failureModes: "If dispatch fails, ride service retries matching. Failed matches are logged for analysis and potential algorithm improvements.",
        tradeoffs: "Centralized matching is simpler but can become bottleneck. Could use distributed matching but adds complexity."
      }
    },
    {
      id: createNodeId("location-service"),
      title: "Location Service",
      category: "logic",
      details: {
        role: "Manages real-time location tracking for drivers and provides geospatial queries for matching.",
        deepDive: "Uses geospatial database (PostGIS) for efficient radius queries, maintains driver location cache, and handles location update streams.",
        failureModes: "Location data is ephemeral - temporary loss is acceptable. Service recovers by re-subscribing to driver location streams.",
        tradeoffs: "In-memory cache provides fast reads but needs periodic persistence. Could use dedicated geospatial DB but adds operational complexity."
      }
    },
    {
      id: createNodeId("pricing-service"),
      title: "Pricing Service",
      category: "logic",
      details: {
        role: "Calculates dynamic pricing based on distance, time, and real-time supply-demand (surge pricing).",
        deepDive: "Integrates with mapping service for distance/time estimates, calculates base fare, applies surge multiplier based on area demand.",
        failureModes: "If pricing service is down, falls back to standard pricing. Surge pricing failures don't block ride requests.",
        tradeoffs: "Real-time surge pricing can maximize revenue but may alienate customers. Could use ML for smarter pricing but adds complexity."
      }
    },
    {
      id: createNodeId("payment-service"),
      title: "Payment Service",
      category: "storage",
      details: {
        role: "Handles payment processing, refunds, and financial transactions for rides.",
        deepDive: "Integrates with payment gateways (Stripe, PayPal), manages payment methods, handles webhook callbacks for payment status updates.",
        failureModes: "If payment fails mid-transaction, system retries with exponential backoff. Failed payments are logged for manual review.",
        tradeoffs: "Could use third-party payment service entirely, but in-house service gives more control over fees and user experience."
      }
    }
  ],
  edges: [
    { id: "uber-e1", from: createNodeId("rider-app"), to: createNodeId("api-gateway") },
    { id: "uber-e2", from: createNodeId("driver-app"), to: createNodeId("api-gateway") },
    { id: "uber-e3", from: createNodeId("api-gateway"), to: createNodeId("dispatch-service") },
    { id: "uber-e4", from: createNodeId("api-gateway"), to: createNodeId("location-service") },
    { id: "uber-e5", from: createNodeId("api-gateway"), to: createNodeId("payment-service") },
    { id: "uber-e6", from: createNodeId("dispatch-service"), to: createNodeId("pricing-service") }
  ]
};

export const UBER_LAYOUT: NodeLayout[] = [
  { nodeId: createNodeId("rider-app"), gridPos: { x: 2, y: 2 } },
  { nodeId: createNodeId("driver-app"), gridPos: { x: 10, y: 2 } },
  { nodeId: createNodeId("api-gateway"), gridPos: { x: 6, y: 4 } },
  { nodeId: createNodeId("dispatch-service"), gridPos: { x: 3, y: 7 } },
  { nodeId: createNodeId("location-service"), gridPos: { x: 6, y: 7 } },
  { nodeId: createNodeId("pricing-service"), gridPos: { x: 9, y: 7 } },
  { nodeId: createNodeId("payment-service"), gridPos: { x: 6, y: 10 } }
];

// ============================================================================
// SYSTEM REGISTRY
// ============================================================================

export const SYSTEM_DESIGNS: Record<string, SystemDesign> = {
  "url-shortener": URL_SHORTENER_DESIGN,
  "uber": UBER_DESIGN
};

export const SYSTEM_LAYOUTS: Record<string, NodeLayout[]> = {
  "url-shortener": URL_SHORTENER_LAYOUT,
  "uber": UBER_LAYOUT
};

export const WHITEBOARD_SYSTEMS: Record<string, WhiteboardSystemMetadata> = {
  "url-shortener": {
    slug: "url-shortener",
    label: "URL shortener",
    title: "Design a URL shortener",
    oneLiner: "Unique ID generation, redirect performance, and scalability.",
    comps: 4,
    flows: 2,
    mark: `<circle cx="12" cy="32" r="6" fill="#FF5A3C"/><circle cx="52" cy="32" r="6" fill="#FF5A3C"/><circle cx="32" cy="14" r="6" fill="#15161C"/><circle cx="32" cy="50" r="6" fill="#6A5AE0"/><path d="M12 32L32 14M52 32L32 14M32 14L32 50" stroke="#15161C" stroke-width="1.5" opacity=".25"/>`,
    scenarios: URL_SHORTENER_SCENARIOS
  },
  "uber": {
    slug: "uber",
    label: "Uber",
    title: "Design Uber",
    oneLiner: "Real-time matching, geospatial indexing, surge pricing.",
    comps: 7,
    flows: 3,
    mark: `<circle cx="12" cy="32" r="6" fill="#FF5A3C"/><circle cx="52" cy="32" r="6" fill="#FF5A3C"/><circle cx="32" cy="14" r="6" fill="#15161C"/><circle cx="32" cy="50" r="6" fill="#6A5AE0"/><path d="M12 32L32 14M52 32L32 14M32 14L32 50" stroke="#15161C" stroke-width="1.5" opacity=".25"/>`,
    scenarios: UBER_SCENARIOS
  },
  "twitter": {
    slug: "twitter",
    label: "Twitter / X",
    title: "Design Twitter / X",
    oneLiner: "Timeline fanout and eventual consistency.",
    comps: 6,
    flows: 2,
    mark: `<circle cx="32" cy="12" r="6" fill="#FF5A3C"/><circle cx="14" cy="32" r="5" fill="#6A5AE0"/><circle cx="50" cy="32" r="5" fill="#6A5AE0"/><circle cx="14" cy="52" r="4.5" fill="#00A87E"/><circle cx="50" cy="52" r="4.5" fill="#00A87E"/><path d="M32 12L14 32M32 12L50 32M14 32L14 52M50 32L50 52" stroke="#15161C" stroke-width="1.5" opacity=".25"/>`
  },
  "netflix": {
    slug: "netflix",
    label: "Netflix",
    title: "Design Netflix",
    oneLiner: "Video streaming, CDN distribution, recommendations.",
    comps: 6,
    flows: 2,
    mark: `<rect x="10" y="10" width="44" height="44" rx="10" stroke="#6A5AE0" stroke-width="2" fill="none"/><circle cx="32" cy="32" r="9" fill="#FF5A3C"/><path d="M32 23v-9M32 41v9M23 32h-9M41 32h9" stroke="#00A87E" stroke-width="2.5" stroke-linecap="round"/>`
  },
  "whatsapp": {
    slug: "whatsapp",
    label: "WhatsApp",
    title: "Design WhatsApp",
    oneLiner: "Real-time messaging, delivery guarantees, E2E encryption.",
    comps: 6,
    flows: 2,
    mark: `<circle cx="32" cy="14" r="6" fill="#15161C"/><circle cx="14" cy="42" r="5" fill="#00D9A3"/><circle cx="50" cy="42" r="5" fill="#00D9A3"/><circle cx="32" cy="42" r="5" fill="#00A87E"/><path d="M32 14L14 42M32 14L32 42M32 14L50 42" stroke="#15161C" stroke-width="1.5" opacity=".25"/>`
  },
  "dropbox": {
    slug: "dropbox",
    label: "Dropbox",
    title: "Design Dropbox",
    oneLiner: "Block-level sync, metadata service, S3-backed storage.",
    comps: 6,
    flows: 2,
    mark: `<circle cx="16" cy="20" r="5" fill="#FF5A3C"/><circle cx="48" cy="20" r="5" fill="#6A5AE0"/><circle cx="16" cy="44" r="5" fill="#00A87E"/><circle cx="48" cy="44" r="5" fill="#00A87E"/><path d="M16 20L48 20M16 20L16 44M48 20L48 44" stroke="#15161C" stroke-width="1.5" opacity=".25"/>`
  },
  "instagram": {
    slug: "instagram",
    label: "Instagram",
    title: "Design Instagram",
    oneLiner: "Feed ranking, media pipeline, ephemeral stories.",
    comps: 6,
    flows: 2,
    mark: `<circle cx="32" cy="32" r="18" stroke="#FF5A3C" stroke-width="2" fill="none"/><circle cx="32" cy="32" r="7" fill="#6A5AE0"/><circle cx="44" cy="20" r="3" fill="#00A87E"/>`
  }
};

export const WHITEBOARD_SYSTEM_LIST = Object.values(WHITEBOARD_SYSTEMS).map((s) => ({
  slug: s.slug,
  label: s.label
}));