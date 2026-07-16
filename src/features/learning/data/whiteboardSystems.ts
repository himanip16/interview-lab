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
};

export const WHITEBOARD_SYSTEM_LIST = Object.values(WHITEBOARD_SYSTEMS).map((s) => ({
  slug: s.slug,
  label: s.label,
}));