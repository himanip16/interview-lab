// src/content/transcripts/system-design/load-balancer-hld-lld.ts

import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Load Balancer — High-Level and Low-Level Design",
    difficulty: Difficulty.HARD,
    duration: 45,
    template: "System Design",
    category: "System Design",
    company: "Amazon",
  },

  messages: [
    {
      id: "1",
      role: "interviewer",
      elapsedSeconds: 0,
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
      elapsedSeconds: 15,
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
      role: "interviewer",
      elapsedSeconds: 28,
      content: [
        {
          type: "text",
          value:
            "Assume ~500 backend servers, 100K requests/sec, and yes — some clients need session affinity.",
        },
      ],
    },
    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 45,
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
      id: "5",
      role: "interviewer",
      elapsedSeconds: 70,
      content: [
        {
          type: "text",
          value: "L4 or L7? Walk me through the difference for this use case.",
        },
      ],
    },
    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 90,
      content: [
        {
          type: "text",
          value:
            "L4 balances at the TCP/UDP level — it looks at IP and port only, doesn't parse HTTP, so it's fast and protocol-agnostic. L7 terminates the connection, reads the HTTP request — headers, path, cookies — and can route on that, do SSL termination, and inspect content. Since we need session affinity and probably path-based routing eventually, I'd go L7, accepting the extra CPU cost of terminating TLS and parsing HTTP at the LB.",
        },
      ],
    },
    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 115,
      content: [
        {
          type: "text",
          value:
            "You said 'session affinity'. Two clients hash to the same backend today. Tomorrow I add 50 more servers. What happens to them?",
        },
      ],
    },
    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 140,
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
      id: "9",
      role: "interviewer",
      elapsedSeconds: 165,
      content: [
        {
          type: "text",
          value: "Draw the ring for me. How many points per server?",
        },
      ],
    },
    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 190,
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
      id: "11",
      role: "interviewer",
      elapsedSeconds: 225,
      content: [
        {
          type: "text",
          value: "Health checks. How does the LB know a server is down before a request fails?",
        },
      ],
    },
    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 245,
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
      id: "13",
      role: "interviewer",
      elapsedSeconds: 270,
      content: [
        {
          type: "text",
          value: "What if the health check itself is wrong — server is fine but the health endpoint is slow?",
        },
      ],
    },
    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 288,
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
      id: "15",
      role: "interviewer",
      elapsedSeconds: 310,
      content: [
        {
          type: "text",
          value: "HLD's solid. Let's go low-level. Design the classes.",
        },
      ],
    },
    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 340,
      content: [
        {
          type: "text",
          value:
            "Core pieces: a `Server` holding host, port, health status, and current load. A `ServerPool` that owns the collection and handles add/remove safely. A `LoadBalancingStrategy` interface so the algorithm is swappable — round robin, least connections, consistent hash — without touching the pool or the request path.",
        },
        {
          id: "highlight-strategy-pattern",
          type: "highlight",
          status: "strong",
          value: "Separates algorithm selection from pool management via Strategy pattern",
          explanation:
            "Keeps the balancing policy pluggable and testable independent of concurrency concerns in the pool.",
        },
      ],
    },
    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 365,
      content: [
        {
          type: "text",
          value:
            "Write the Strategy interface and a round-robin implementation. Plain Java, no streams.",
        },
      ],
    },
    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 400,
      content: [
        {
          type: "code",
          language: "java",
          value:
            "public interface LoadBalancingStrategy {\n    Server selectServer(List<Server> healthyServers);\n}\n\npublic class RoundRobinStrategy implements LoadBalancingStrategy {\n    private final AtomicInteger index = new AtomicInteger(0);\n\n    @Override\n    public Server selectServer(List<Server> healthyServers) {\n        if (healthyServers.isEmpty()) {\n            throw new NoHealthyServerException(\"No healthy servers available\");\n        }\n        int i = Math.abs(index.getAndIncrement() % healthyServers.size());\n        return healthyServers.get(i);\n    }\n}",
        },
        {
          type: "text",
          value: "AtomicInteger for the counter so concurrent requests don't corrupt the index.",
        },
      ],
    },
    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 425,
      content: [
        {
          type: "text",
          value:
            "index.getAndIncrement() runs forever. What happens when it overflows Integer.MAX_VALUE?",
        },
      ],
    },
    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 445,
      content: [
        {
          type: "text",
          value:
            "It wraps to Integer.MIN_VALUE, which is negative — that's exactly why I have the Math.abs() there. But actually Math.abs(Integer.MIN_VALUE) is still negative, that's a known JVM quirk since there's no positive counterpart in two's complement. Safer fix: mask with `& Integer.MAX_VALUE` instead of Math.abs, or just let index wrap and take `((index % size) + size) % size` to always land positive.",
        },
        {
          id: "highlight-integer-overflow-bug",
          type: "highlight",
          status: "strong",
          value: "Finds that Math.abs(Integer.MIN_VALUE) does not fix the overflow case",
          explanation:
            "A genuinely obscure but real Java bug — Math.abs has one input value it can't fix due to two's-complement asymmetry. Candidate catches it and gives two working alternatives.",
        },
        {
          type: "code",
          language: "java",
          value:
            "int i = (int) (Long.remainderUnsigned(index.getAndIncrement(), healthyServers.size()));",
        },
      ],
    },
    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 470,
      content: [
        {
          type: "text",
          value:
            "Fine. Now — servers get added and removed constantly, but requests are also reading the list to pick a target. How do you keep that safe without stalling every request behind a lock?",
        },
      ],
    },
    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 500,
      content: [
        {
          type: "text",
          value:
            "Reads massively outnumber writes here — server list changes rarely compared to request volume. I'd use `CopyOnWriteArrayList` for the healthy-server list: reads never block, and writes pay the cost of copying the array, which is fine since add/remove is rare. A `ReentrantReadWriteLock` would also work but adds contention on the read side that CopyOnWriteArrayList avoids entirely for this read-heavy pattern.",
        },
        {
          id: "highlight-concurrency-choice",
          type: "highlight",
          status: "strong",
          value: "Picks CopyOnWriteArrayList and justifies it against the read/write ratio",
          explanation:
            "Concurrency structure choice is tied explicitly to the access pattern (read-heavy, rare writes) rather than picked by habit.",
        },
        {
          type: "code",
          language: "java",
          value:
            "public class ServerPool {\n    private final CopyOnWriteArrayList<Server> healthyServers = new CopyOnWriteArrayList<>();\n\n    public void markHealthy(Server server) {\n        healthyServers.addIfAbsent(server);\n    }\n\n    public void markUnhealthy(Server server) {\n        healthyServers.remove(server);\n    }\n\n    public List<Server> getHealthyServers() {\n        return healthyServers;\n    }\n}",
        },
      ],
    },
    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 530,
      content: [
        {
          type: "text",
          value:
            "Two health-check threads both detect the same server failing at the same instant, both call markUnhealthy(). Problem?",
        },
      ],
    },
    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 550,
      content: [
        {
          type: "text",
          value:
            "No real problem — `remove()` on an already-absent element is a no-op, it won't throw or corrupt state. Same reasoning is why I used `addIfAbsent` on markHealthy, so a duplicate health-check success doesn't add the server twice. The operations are idempotent by construction, so I don't need extra locking around the double-detection case.",
        },
        {
          id: "highlight-idempotent-ops",
          type: "highlight",
          status: "strong",
          value: "Recognizes idempotency removes the need for extra synchronization here",
          explanation:
            "Rather than reaching for more locking, candidate identifies the operations are already safe under duplicate calls — a cleaner answer than adding unnecessary coordination.",
        },
      ],
    },
    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 575,
      content: [
        {
          type: "text",
          value: "Wire the least-connections strategy now. What does it need that round robin doesn't?",
        },
      ],
    },
    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 610,
      content: [
        {
          type: "code",
          language: "java",
          value:
            "public class LeastConnectionsStrategy implements LoadBalancingStrategy {\n    @Override\n    public Server selectServer(List<Server> healthyServers) {\n        if (healthyServers.isEmpty()) {\n            throw new NoHealthyServerException(\"No healthy servers available\");\n        }\n        Server chosen = healthyServers.get(0);\n        int minConnections = chosen.getActiveConnections();\n        for (int i = 1; i < healthyServers.size(); i++) {\n            Server candidate = healthyServers.get(i);\n            int connections = candidate.getActiveConnections();\n            if (connections < minConnections) {\n                chosen = candidate;\n                minConnections = connections;\n            }\n        }\n        return chosen;\n    }\n}",
        },
        {
          type: "text",
          value:
            "It needs each Server to track its own active connection count, incremented when a request routes there, decremented when it completes. That counter has to be an AtomicInteger too, since requests complete on different threads than the ones that started them.",
        },
      ],
    },
    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 640,
      content: [
        {
          type: "text",
          value:
            "This loop is O(n) per request, scanning all 500 servers. At 100K req/sec, is that a problem?",
        },
      ],
    },
    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 665,
      content: [
        {
          type: "text",
          value:
            "500 comparisons per request is genuinely cheap — nanoseconds, not the bottleneck at 100K req/sec. I wouldn't optimize this without measuring first. If it ever did matter, a min-heap keyed on connection count would get selection to O(log n), but that adds complexity — re-heapifying on every connection change — for a cost that's not actually shown to be a problem yet. I'd hold off unless profiling says otherwise.",
        },
        {
          id: "highlight-premature-optimization",
          type: "highlight",
          status: "strong",
          value: "Declines to over-engineer without a measured bottleneck",
          explanation:
            "Interviewer sets a trap toward premature optimization; candidate names the theoretically better structure but explicitly declines it without evidence of need — a sign of engineering judgment, not just algorithm knowledge.",
        },
      ],
    },
    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 690,
      content: [
        {
          type: "text",
          value: "Last one — how would you test the ServerPool concurrency logic?",
        },
      ],
    },
    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 720,
      content: [
        {
          type: "text",
          value:
            "Single-threaded tests first — add, remove, addIfAbsent duplicate, remove-nonexistent — to lock down expected behavior. Then a concurrency test: spin up, say, 50 threads hammering markHealthy/markUnhealthy on overlapping servers simultaneously with a CountDownLatch to start them together, then assert the final healthy set matches what the last operations should produce, and that no exception or corrupted state occurs. I wouldn't try to assert exact intermediate states under concurrency — that's inherently racy — just the invariants that must hold regardless of interleaving.",
        },
        {
          id: "highlight-concurrency-testing",
          type: "highlight",
          status: "strong",
          value: "Distinguishes testable invariants from non-deterministic intermediate states",
          explanation:
            "Good concurrency-testing instinct: asserting on final invariants rather than trying to pin down a specific thread interleaving, which would make the test flaky.",
        },
      ],
    },
    {
      id: "31",
      role: "takeaway",
      elapsedSeconds: 745,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the design moves from HLD to LLD without the two feeling disconnected — every low-level decision (CopyOnWriteArrayList, Strategy pattern, idempotent pool operations) traces back to a constraint established at the high level (100K req/sec, session affinity, 500 servers). Three moments stand out: recognizing that naive mod-based hashing forces a mass remap when the server count changes, catching the Math.abs(Integer.MIN_VALUE) overflow edge case in the round-robin counter — a genuinely obscure Java gotcha most candidates miss — and declining to prematurely optimize the O(n) least-connections scan without a measured need. The candidate also handles two pushback scenarios well: flapping health checks (answered with gradual traffic ramp-up on recovery, not instant full trust) and concurrent duplicate health-check detection (answered by recognizing the pool operations are already idempotent, avoiding unnecessary locking). LLD code stays in plain Java without streams or lambdas throughout, matching interview-under-pressure constraints rather than showcasing language features.",
        },
      ],
    },
  ],
};

const loadBalancerHldLld: TranscriptEntry = {
  summary: {
    slug: "load-balancer-hld-lld",
    title: "Load Balancer — High-Level and Low-Level Design",
    category: "hld",
    difficulty: Difficulty.HARD,
    duration: 45,
    tags: [
      "System Design",
      "Load Balancing",
      "Consistent Hashing",
      "Concurrency",
      "Strategy Pattern",
      "LLD",
      "Java",
    ],
    description:
      "Combined HLD-to-LLD system design interview for a load balancer, Amazon style. HLD covers L4 vs L7 tradeoffs, why the load balancer itself must not be a single point of failure, consistent hashing (with virtual nodes) to avoid mass remapping when servers are added, and a two-layer health check strategy combining active polling with passive failure detection plus gradual traffic ramp-up on recovery to avoid flapping. LLD covers Server/ServerPool/LoadBalancingStrategy class design in plain Java (no streams or lambdas), a CopyOnWriteArrayList concurrency choice justified against a read-heavy access pattern, idempotent pool operations that need no extra locking under concurrent duplicate health-check detection, a genuine Integer.MIN_VALUE overflow bug caught in a round-robin counter, and a deliberate decision not to prematurely optimize an O(n) least-connections scan without measured evidence of a bottleneck. Closes with a concurrency-testing approach focused on final invariants rather than racy intermediate-state assertions.",
  },

  transcript,
};

export default loadBalancerHldLld;