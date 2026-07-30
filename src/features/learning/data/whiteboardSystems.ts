// src/features/learning/data/whiteboardSystems.ts

import { Scenario } from "@/features/whiteboard/types/whiteboard";
import { UBER_SCENARIOS, URL_SHORTENER_SCENARIOS } from "./scenarios";

export interface WhiteboardNode {
  id: string;
  title: string;
  kind: string;
  color: string;
  role: string;
  deep: string;
  failure: string;
  tradeoffs: string;
  position: { top?: string; bottom?: string; left?: string; right?: string; transform?: string };
}

export interface WhiteboardSystem {
  slug: string;
  label: string;
  title: string;
  oneLiner: string;
  comps: number;
  flows: number;
  mark: string;
  nodes: WhiteboardNode[];
  scenarios?: Scenario[];
}

// TODO: this static map is a placeholder until whiteboard systems are
// modeled in Prisma (see WhiteboardSystem model + /api/whiteboard route).
// Do not add more systems here — add them to the DB seed instead.
export const WHITEBOARD_SYSTEMS: Record<string, WhiteboardSystem> = {
  "url-shortener": {
    slug: "url-shortener",
    label: "URL shortener",
    title: "Design a URL shortener",
    oneLiner: "Unique ID generation, redirect performance, and scalability.",
    comps: 4,
    flows: 2,
    mark: `<circle cx="12" cy="32" r="6" fill="#FF5A3C"/><circle cx="52" cy="32" r="6" fill="#FF5A3C"/><circle cx="32" cy="14" r="6" fill="#15161C"/><circle cx="32" cy="50" r="6" fill="#6A5AE0"/><path d="M12 32L32 14M52 32L32 14M32 14L32 50" stroke="#15161C" stroke-width="1.5" opacity=".25"/>`,
    scenarios: URL_SHORTENER_SCENARIOS,
    nodes: [
      {
        id: "client",
        title: "Client app",
        kind: "Client · entry point",
        color: "var(--coral)",
        role: "Sends a long URL, gets back a short code, and redirects when that code is visited later.",
        deep: "Caches the last few redirects locally so repeat visits skip the network round trip.",
        failure: "If the gateway is unreachable, falls back to a \"try again\" state rather than a blank redirect.",
        tradeoffs: "Could resolve short codes locally for speed, but that would mean shipping the whole mapping to every client — not worth it at this scale.",
        position: { top: "100px", left: "200px" },
      },
      {
        id: "gateway",
        title: "API gateway",
        kind: "Gateway · routing",
        color: "var(--ink)",
        role: "Single entry point for reads and writes — validates the request and routes to the shortener service.",
        deep: "Rate-limits by IP to stop one client from generating millions of codes.",
        failure: "Stateless, so any instance can go down without losing in-flight requests — the load balancer just stops sending it traffic.",
        tradeoffs: "Centralizing here adds a hop, but keeping auth and rate-limiting in one place beats duplicating it in every service.",
        position: { top: "100px", right: "200px" },
      },
      {
        id: "service",
        title: "Shortener service",
        kind: "Service · core logic",
        color: "var(--violet)",
        role: "Generates a unique short code and writes the mapping; resolves a code back to the original URL on read.",
        deep: "Uses base62 encoding over an auto-incrementing counter, so codes stay short and collisions are structurally impossible.",
        failure: "If code generation fails mid-write, the write is retried with a fresh counter value rather than silently returning a broken link.",
        tradeoffs: "Hash-based codes would avoid a shared counter, but base62-over-counter is simpler and collisions become the harder problem to solve.",
        position: { top: "500px", left: "50%", transform: "translateX(-50%)" },
      },
      {
        id: "db",
        title: "Key-value store",
        kind: "Storage · key-value",
        color: "var(--mint-deep)",
        role: "Stores the short-code to long-URL mapping and serves reads with very low latency.",
        deep: "Reads are cached in front of the store, since the access pattern is extremely read-heavy relative to writes.",
        failure: "Replicated across zones — losing one replica costs latency, not data.",
        tradeoffs: "A relational database would make analytics easier, but a key-value store is a better match for how this data is actually accessed: by exact key, constantly.",
        position: { bottom: "200px", left: "50%", transform: "translateX(-50%)" },
      },
    ],
  },
  "uber": {
    slug: "uber",
    label: "Uber",
    title: "Design Uber",
    oneLiner: "Real-time matching, geospatial indexing, surge pricing.",
    comps: 7,
    flows: 3,
    mark: `<circle cx="12" cy="32" r="6" fill="#FF5A3C"/><circle cx="52" cy="32" r="6" fill="#FF5A3C"/><circle cx="32" cy="14" r="6" fill="#15161C"/><circle cx="32" cy="50" r="6" fill="#6A5AE0"/><path d="M12 32L32 14M52 32L32 14M32 14L32 50" stroke="#15161C" stroke-width="1.5" opacity=".25"/>`,
    scenarios: UBER_SCENARIOS,
    nodes: [
      {
        id: "user-app",
        title: "User app",
        kind: "Client · entry point",
        color: "var(--coral)",
        role: "Rider's mobile app for requesting rides, viewing driver details, and tracking trip progress.",
        deep: "Uses location services for pickup/dropoff, stores ride history locally, and handles real-time updates via websockets.",
        failure: "If network fails, app queues requests and retries when connection is restored. Shows cached driver data when offline.",
        tradeoffs: "Native apps provide better performance but require separate development for iOS/Android. Web version would be universal but less performant.",
        position: { top: "100px", left: "200px" },
      },
      {
        id: "driver-app",
        title: "Driver app",
        kind: "Client · entry point",
        color: "var(--coral)",
        role: "Driver's mobile app for receiving ride requests, navigation, and trip management.",
        deep: "Continuously streams driver location to backend, receives ride offers with surge pricing info, and integrates with mapping for navigation.",
        failure: "If location service fails, driver can't receive ride requests. App falls back to manual status updates until location is restored.",
        tradeoffs: "Background location tracking drains battery, but is essential for real-time matching. App optimizes by batching location updates.",
        position: { top: "100px", right: "200px" },
      },
      {
        id: "api-gateway",
        title: "API gateway",
        kind: "Gateway · routing",
        color: "var(--ink)",
        role: "Single entry point for all API requests - handles authentication, rate limiting, and routing to appropriate services.",
        deep: "Implements JWT authentication, per-user rate limits to prevent abuse, and routes requests based on API version and endpoint.",
        failure: "Stateless design allows horizontal scaling. If one instance fails, load balancer redirects traffic to healthy instances.",
        tradeoffs: "Adds a network hop but centralizes cross-cutting concerns like auth and rate limiting, avoiding duplication across services.",
        position: { top: "300px", left: "50%", transform: "translateX(-50%)" },
      },
      {
        id: "ride-service",
        title: "Ride service",
        kind: "Service · core logic",
        color: "var(--violet)",
        role: "Core business logic for ride lifecycle - creates ride requests, matches drivers, tracks trip state, and handles payments.",
        deep: "Manages ride state machine (requested, matched, arrived, in_progress, completed), integrates with payment gateway, and stores ride history.",
        failure: "If service crashes during active ride, state is recovered from database. In-memory state is periodically persisted for crash recovery.",
        tradeoffs: "Could split into separate services (matching, payments), but keeping ride lifecycle together simplifies transaction management.",
        position: { top: "500px", left: "300px" },
      },
      {
        id: "dispatch-service",
        title: "Dispatch service",
        kind: "Service · core logic",
        color: "var(--violet)",
        role: "Real-time driver matching algorithm - finds nearby drivers, ranks them, and sends ride offers.",
        deep: "Uses geospatial queries to find drivers within radius, ranks by distance/rating/acceptance rate, and handles offer expiration.",
        failure: "If dispatch fails, ride service retries matching. Failed matches are logged for analysis and potential algorithm improvements.",
        tradeoffs: "Centralized matching is simpler but can become bottleneck. Could use distributed matching but adds complexity.",
        position: { top: "500px", right: "300px" },
      },
      {
        id: "location-service",
        title: "Location service",
        kind: "Service · infrastructure",
        color: "var(--violet)",
        role: "Manages real-time location tracking for drivers and provides geospatial queries for matching.",
        deep: "Uses geospatial database (PostGIS) for efficient radius queries, maintains driver location cache, and handles location update streams.",
        failure: "Location data is ephemeral - temporary loss is acceptable. Service recovers by re-subscribing to driver location streams.",
        tradeoffs: "In-memory cache provides fast reads but needs periodic persistence. Could use dedicated geospatial DB but adds operational complexity.",
        position: { top: "700px", left: "50%", transform: "translateX(-50%)" },
      },
      {
        id: "pricing-service",
        title: "Pricing service",
        kind: "Service · core logic",
        color: "var(--violet)",
        role: "Calculates dynamic pricing based on distance, time, and real-time supply-demand (surge pricing).",
        deep: "Integrates with mapping service for distance/time estimates, calculates base fare, applies surge multiplier based on area demand.",
        failure: "If pricing service is down, falls back to standard pricing. Surge pricing failures don't block ride requests.",
        tradeoffs: "Real-time surge pricing can maximize revenue but may alienate customers. Could use ML for smarter pricing but adds complexity.",
        position: { top: "900px", left: "300px" },
      },
      {
        id: "database",
        title: "Database",
        kind: "Storage · relational",
        color: "var(--mint-deep)",
        role: "Persistent storage for ride history, user profiles, driver information, and transaction records.",
        deep: "Uses relational database for ACID transactions on ride bookings, with read replicas for analytics queries.",
        failure: "Multi-region replication ensures durability. If primary fails, replica is promoted with minimal downtime.",
        tradeoffs: "Relational DB provides strong consistency but may limit horizontal scaling. Could use NoSQL for specific workloads.",
        position: { top: "900px", right: "300px" },
      },
    ],
  },
  "twitter": {
    slug: "twitter",
    label: "Twitter / X",
    title: "Design Twitter / X",
    oneLiner: "Timeline fanout and eventual consistency.",
    comps: 6,
    flows: 2,
    mark: `<circle cx="32" cy="12" r="6" fill="#FF5A3C"/><circle cx="14" cy="32" r="5" fill="#6A5AE0"/><circle cx="50" cy="32" r="5" fill="#6A5AE0"/><circle cx="14" cy="52" r="4.5" fill="#00A87E"/><circle cx="50" cy="52" r="4.5" fill="#00A87E"/><path d="M32 12L14 32M32 12L50 32M14 32L14 52M50 32L50 52" stroke="#15161C" stroke-width="1.5" opacity=".25"/>`,
    nodes: [],
  },
  "netflix": {
    slug: "netflix",
    label: "Netflix",
    title: "Design Netflix",
    oneLiner: "Video streaming, CDN distribution, recommendations.",
    comps: 6,
    flows: 2,
    mark: `<rect x="10" y="10" width="44" height="44" rx="10" stroke="#6A5AE0" stroke-width="2" fill="none"/><circle cx="32" cy="32" r="9" fill="#FF5A3C"/><path d="M32 23v-9M32 41v9M23 32h-9M41 32h9" stroke="#00A87E" stroke-width="2.5" stroke-linecap="round"/>`,
    nodes: [],
  },
  "whatsapp": {
    slug: "whatsapp",
    label: "WhatsApp",
    title: "Design WhatsApp",
    oneLiner: "Real-time messaging, delivery guarantees, E2E encryption.",
    comps: 6,
    flows: 2,
    mark: `<circle cx="32" cy="14" r="6" fill="#15161C"/><circle cx="14" cy="42" r="5" fill="#00D9A3"/><circle cx="50" cy="42" r="5" fill="#00D9A3"/><circle cx="32" cy="42" r="5" fill="#00A87E"/><path d="M32 14L14 42M32 14L32 42M32 14L50 42" stroke="#15161C" stroke-width="1.5" opacity=".25"/>`,
    nodes: [],
  },
  "dropbox": {
    slug: "dropbox",
    label: "Dropbox",
    title: "Design Dropbox",
    oneLiner: "Block-level sync, metadata service, S3-backed storage.",
    comps: 6,
    flows: 2,
    mark: `<circle cx="16" cy="20" r="5" fill="#FF5A3C"/><circle cx="48" cy="20" r="5" fill="#6A5AE0"/><circle cx="16" cy="44" r="5" fill="#00A87E"/><circle cx="48" cy="44" r="5" fill="#00A87E"/><path d="M16 20L48 20M16 20L16 44M48 20L48 44" stroke="#15161C" stroke-width="1.5" opacity=".25"/>`,
    nodes: [],
  },
  "instagram": {
    slug: "instagram",
    label: "Instagram",
    title: "Design Instagram",
    oneLiner: "Feed ranking, media pipeline, ephemeral stories.",
    comps: 6,
    flows: 2,
    mark: `<circle cx="32" cy="32" r="18" stroke="#FF5A3C" stroke-width="2" fill="none"/><circle cx="32" cy="32" r="7" fill="#6A5AE0"/><circle cx="44" cy="20" r="3" fill="#00A87E"/>`,
    nodes: [],
  },
};

export const WHITEBOARD_SYSTEM_LIST = Object.values(WHITEBOARD_SYSTEMS).map((s) => ({
  slug: s.slug,
  label: s.label,
}));