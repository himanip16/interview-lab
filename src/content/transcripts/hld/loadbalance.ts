// src/content/transcripts/system-design/load-balancer-hld.ts
//
// NOTE ON SCHEMA: this file introduces a new message role, "context", used
// for narrator-style beats inserted between interviewer/candidate turns.
// If your TranscriptEntry / message role union type only allows
// "interviewer" | "candidate" | "takeaway", add "context" to it before
// this compiles. Everything else (content item shapes: text/highlight/
// whiteboard) is unchanged from your existing schema.

import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Design a Load Balancer",
    difficulty: Difficulty.MEDIUM,
    duration: 25,
    template: "System Design",
    category: "System Design",
    company: "Amazon",
  },

  messages: [
    {
      id: "0",
      role: "interviewer",
      elapsedSeconds: 0,
      content: [
        {
          type: "text",
          value:
            "Picture a single web server handling every visitor to a site. It's fine at first. Then traffic grows, and one day that one server can't keep up — pages time out, or worse, the server crashes and the whole site goes down. The obvious fix is to run several copies of the server. But now someone has to decide, for every incoming request, which copy handles it. That decision-maker is the load balancer — and it turns out to be a surprisingly deep problem on its own.",
        },
      ],
    },
    {
      id: "1",
      role: "interviewer",
      elapsedSeconds: 15,
      content: [
        {
          type: "text",
          value:
            "Design a load balancer. Before anything else — what's the traffic pattern and scale you're designing for?",
        },
      ],
    },
    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 30,
      content: [
        {
          type: "text",
          value:
            "I'd ask: how many backend servers, expected requests per second, and does traffic need to stick to the same backend — like session affinity — or is every request independent?",
        },
      ],
    },
    {
      id: "3",
      role: "takeaway",
      elapsedSeconds: 40,
      content: [
        {
          type: "text",
          value:
            "Before the numbers land, notice what the candidate is doing: not designing yet, just figuring out which version of the problem this is. \"100 servers, no affinity\" and \"500 servers, affinity required\" are different systems. That question — clarify before you build — is itself part of what's being evaluated here.",
        },
      ],
    },
    {
      id: "4",
      role: "interviewer",
      elapsedSeconds: 55,
      content: [
        {
          type: "text",
          value:
            "Assume ~500 backend servers, 100K requests/sec, and yes — some clients need session affinity.",
        },
      ],
    },
    {
      id: "5",
      role: "candidate",
      elapsedSeconds: 75,
      content: [
        {
          type: "text",
          value:
            "Okay. At the high level: clients hit the load balancer, it picks a healthy backend using some algorithm, forwards the request, and a background health checker keeps the server list current. For 100K req/sec, a single LB instance is a bottleneck and a single point of failure, so I'd run multiple LB instances behind DNS or an anycast IP, not just one.",
        },
        {
          id: "highlight-lb-not-spof",
          type: "highlight",
          status: "strong",
          value: "Identifies the load balancer itself as a single point of failure",
          explanation:
            "A common gap in LB designs is treating the LB as infallible. Candidate flags it immediately at the HLD stage instead of only designing the thing it balances for.",
        },
      ],
    },
    {
      id: "6",
      role: "takeaway",
      elapsedSeconds: 90,
      content: [
        {
          type: "text",
          value:
            "Worth sitting with that last line. We built the load balancer to fix the \"one server can go down\" problem — and immediately created a new single point of failure in its place. That pattern repeats constantly in system design: solving one bottleneck by introducing a new component, which then needs its own redundancy.",
        },
      ],
    },
    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 105,
      content: [
        {
          type: "text",
          value: "L4 or L7? Walk me through the difference for this use case.",
        },
      ],
    },
    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 125,
      content: [
        {
          type: "text",
          value:
            "L4 balances at the TCP/UDP level — it looks at IP and port only, doesn't parse HTTP, so it's fast and protocol-agnostic. L7 terminates the connection, reads the HTTP request — headers, path, cookies — and can route on that, do SSL termination, and inspect content. Since we need session affinity and probably path-based routing eventually, I'd go L7, accepting the extra CPU cost of terminating TLS and parsing HTTP at the LB.",
        },
      ],
    },
    {
      id: "9",
      role: "takeaway",
      elapsedSeconds: 140,
      content: [
        {
          type: "text",
          value:
            "The choice here isn't arbitrary — it falls straight out of the requirement. If nobody needed session affinity or content-based routing, L4 would be the better default: cheaper, faster, doesn't need to understand HTTP at all. L7 is the more expensive option, chosen only because the earlier requirement (session affinity) demands it.",
        },
      ],
    },
    {
      id: "10",
      role: "takeaway",
      elapsedSeconds: 155,
      content: [
        {
          type: "text",
          value:
            "Here's the scenario the interviewer is about to build toward. Say you have 10 servers, and you decide which one handles a client with a simple formula: hash(userId) % 10. That works fine — until traffic grows and you add 10 more servers. Now the formula becomes hash(userId) % 20, and the divisor changed. Almost every user's result changes too, even though most servers didn't actually go anywhere. In practice that means: sessions break, and caches that were warm for a user are suddenly on the wrong machine — everyone's requests miss and have to be rebuilt from scratch. This is the exact problem the next few questions are circling.",
        },
      ],
    },
    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 175,
      content: [
        {
          type: "text",
          value:
            "You said 'session affinity'. Two clients hash to the same backend today. Tomorrow I add 50 more servers. What happens to them?",
        },
      ],
    },
    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 200,
      content: [
        {
          type: "text",
          value:
            "Depends how I hash. If I do `hash(client_id) % server_count`, adding servers changes server_count, and almost every client remaps to a different backend — that's a mass cache/session invalidation. I should use consistent hashing instead: servers and clients both map onto a hash ring, and adding a server only remaps the clients between the new server and its neighbor, not everyone.",
        },
        {
          id: "highlight-consistent-hashing",
          type: "highlight",
          status: "strong",
          value: "Catches the mod-based hashing remap problem, proposes consistent hashing",
          explanation:
            "This is the classic reason consistent hashing exists. Candidate is forced to discover the problem via a concrete 'add 50 servers' scenario instead of just naming the algorithm.",
        },
      ],
    },
    {
      id: "13",
      role: "takeaway",
      elapsedSeconds: 215,
      content: [
        {
          type: "text",
          value:
            "The core idea of a hash ring: instead of a formula that depends on how many servers currently exist, place both servers and clients as fixed points on a circle. A client is always routed to \"the next server point clockwise from it.\" Adding a server just inserts one new point on the circle — it only steals the clients between it and its neighbor. Everyone else's next-clockwise-server stays exactly the same. That's the whole trick: growth becomes a local change instead of a global one.",
        },
      ],
    },
    {
      id: "14",
      role: "interviewer",
      elapsedSeconds: 235,
      content: [
        {
          type: "text",
          value: "Draw the ring for me. How many points per server?",
        },
      ],
    },
    {
      id: "15",
      role: "candidate",
      elapsedSeconds: 260,
      content: [
        {
          type: "whiteboard",
          value:
            "<svg viewBox=\"0 0 320 320\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"160\" cy=\"160\" r=\"120\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><circle cx=\"160\" cy=\"40\" r=\"5\" fill=\"currentColor\"/><text x=\"170\" y=\"35\" font-size=\"12\">S1-a</text><circle cx=\"260\" cy=\"110\" r=\"5\" fill=\"currentColor\"/><text x=\"268\" y=\"110\" font-size=\"12\">S2-a</text><circle cx=\"240\" cy=\"230\" r=\"5\" fill=\"currentColor\"/><text x=\"248\" y=\"235\" font-size=\"12\">S1-b</text><circle cx=\"100\" cy=\"265\" r=\"5\" fill=\"currentColor\"/><text x=\"70\" y=\"282\" font-size=\"12\">S3-a</text><circle cx=\"50\" cy=\"150\" r=\"5\" fill=\"currentColor\"/><text x=\"10\" y=\"150\" font-size=\"12\">S2-b</text></svg>",
          caption:
            "Hash ring: each physical server placed at multiple points (virtual nodes) to spread load evenly",
        },
        {
          type: "text",
          value:
            "Single point per server isn't enough — if a server has one point, it could end up owning a disproportionate arc of the ring by bad luck, so load is uneven. I'd use maybe 100-150 virtual nodes per physical server, hashed with different salts, so each server's total ring coverage averages out close to its fair share.",
        },
      ],
    },
    {
      id: "16",
      role: "takeaway",
      elapsedSeconds: 280,
      content: [
        {
          type: "text",
          value:
            "One server, one point on the ring, would mean that server's \"share\" of the circle is whatever random arc it happened to land in — could be huge, could be tiny. Multiple points per server (virtual nodes) is the fix: spread across enough points, luck averages out, and every physical server ends up owning roughly an equal slice of total traffic.",
        },
      ],
    },
    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 300,
      content: [
        {
          type: "text",
          value: "Health checks. How does the LB know a server is down before a request fails?",
        },
      ],
    },
    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 320,
      content: [
        {
          type: "text",
          value:
            "A background thread pings each backend on an interval — say every 5 seconds — hitting a lightweight `/health` endpoint. If a server misses N consecutive checks, mark it unhealthy and pull it from the routable set. I'd also do passive health checking: if live requests to a server start timing out or erroring above some threshold, pull it immediately rather than waiting for the next active check cycle.",
        },
        {
          id: "highlight-active-passive-health",
          type: "highlight",
          status: "strong",
          value: "Combines active polling with passive failure detection from live traffic",
          explanation:
            "Active-only health checks have a detection lag equal to the check interval. Candidate adds passive detection to shrink that window without being asked.",
        },
      ],
    },
    {
      id: "19",
      role: "takeaway",
      elapsedSeconds: 335,
      content: [
        {
          type: "text",
          value:
            "Why not just rely on the 5-second ping? Because a server can die at second 1 of that window, and every real request in the next 4 seconds gets sent to a dead machine and fails before the next check ever notices. Passive checking closes that gap: the LB is watching its own live traffic for failures, not just its own scheduled pings.",
        },
      ],
    },
    {
      id: "20",
      role: "interviewer",
      elapsedSeconds: 350,
      content: [
        {
          type: "text",
          value: "What if the health check itself is wrong — server is fine but the health endpoint is slow?",
        },
      ],
    },
    {
      id: "21",
      role: "candidate",
      elapsedSeconds: 370,
      content: [
        {
          type: "text",
          value:
            "That's a real failure mode — flapping. If a server briefly gets marked unhealthy and comes back, then gets marked unhealthy again, it should get pulled and re-added carefully, not instantly re-trusted at full weight. I'd bring it back gradually — start it at low traffic weight and ramp up if it stays healthy, rather than dumping full load on it immediately.",
        },
        {
          id: "highlight-flapping",
          type: "highlight",
          status: "strong",
          value: "Addresses flapping and gradual traffic ramp-up on recovery",
          explanation:
            "Interviewer pushes past the happy-path health check into a realistic operational failure mode; candidate proposes a slow-start recovery instead of binary in/out.",
        },
      ],
    },
    {
      id: "22",
      role: "takeaway",
      elapsedSeconds: 385,
      content: [
        {
          type: "text",
          value:
            "This is why \"just mark it healthy again\" is the wrong instinct. A server that was briefly flagged and comes back could still be shaky. Dumping full production traffic on it immediately is how one recovering server gets hammered right back into failure. Slow-start avoids re-triggering the same problem it just recovered from.",
        },
      ],
    },
    {
      id: "23",
      role: "takeaway",
      elapsedSeconds: 400,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the whole HLD traces back to one starting fact — 100K req/sec across 500 servers, with some clients needing session affinity. Every decision after that is a consequence, not a free choice: L7 over L4 because affinity requires reading the request; consistent hashing over modulo hashing because the fleet will grow and a mass remap would break every active session; virtual nodes because a single ring point per server distributes load unevenly; and a two-layer health check (active + passive) with gradual recovery because a server can fail faster than a polling interval catches it, and can be untrustworthy for a moment even after it comes back. None of these are memorized best practices — each one is the direct answer to a concrete failure scenario the interviewer built on top of the last.",
        },
      ],
    },
  ],
};

const loadBalancerHld: TranscriptEntry = {
  summary: {    id: 42,

    slug: "load-balancer-hld",
    title: "Load Balancer — High-Level Design",
    category: "hld",
    difficulty: Difficulty.MEDIUM,
    duration: 25,
    tags: [
      "System Design",
      "Load Balancing",
      "Consistent Hashing",
      "Health Checks",
      "L4 vs L7",
    ],
    description:
      "High-level system design interview for a load balancer, Amazon style, framed for learners rather than practitioners. Opens with the motivating problem (one server can't survive scale or failure) before introducing scale requirements. Covers why the load balancer itself must not become a new single point of failure, the L4 vs L7 tradeoff as a direct consequence of needing session affinity, the concrete before/after scenario that motivates consistent hashing (naive modulo hashing causing a mass remap when the fleet grows, breaking sessions and invalidating caches), virtual nodes on the hash ring to even out load distribution, and a two-layer health check strategy — active polling plus passive failure detection from live traffic — with gradual traffic ramp-up on recovery to avoid re-triggering flapping. Narrator-style context beats are interleaved between interviewer/candidate turns to explain what's being tested and why, rather than leaving the reasoning implicit.",
  },

  transcript,
};

export default loadBalancerHld;