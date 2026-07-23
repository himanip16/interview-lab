// src/features/learning/data/whiteboardSystems.ts

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
        position: { top: "24px", left: "24px" },
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
        position: { top: "24px", right: "24px" },
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
        position: { top: "200px", left: "50%", transform: "translateX(-50%)" },
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
        position: { bottom: "24px", left: "50%", transform: "translateX(-50%)" },
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
    nodes: [],
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