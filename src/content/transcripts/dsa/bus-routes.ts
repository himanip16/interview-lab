// src/content/transcripts/dsa/bus-routes-weighted-dijkstra.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Bus Routes, Then a Cost-Weighted Follow-Up Solved With Dijkstra",
    difficulty: Difficulty.HARD,
    duration: 40,
    template: "Coding",
    category: "DSA",
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
            "You've got a list of bus routes — routes[i] is every stop the i-th bus loops through, forever. Start at stop source, get to stop target. Minimum number of buses, or -1 if it can't be done.",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 14,
      content: [
        {
          type: "text",
          value:
            "If source and target are the same stop that's zero buses — nothing to ride. And once I'm on a bus I can get off anywhere it stops, not just the next stop in the list?",
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
          value: "Both right.",
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
            "Then it's shortest path where an edge means 'boarded one bus.' First thing that comes to mind — build a graph directly on the stops, and connect two stops whenever some route contains both, since that route lets you ride between them for free. BFS from source, and depth is the number of new routes you had to step onto.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 62,
      content: [
        {
          type: "text",
          value: "One of the routes has 100,000 stops on it. Before you code anything — how many edges does that route alone contribute to your stop graph?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 84,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-clique-blowup",
          type: "highlight",
          status: "missed",
          value: "every pair of stops on that route gets its own edge",
          explanation:
            "Wiring every stop in a route to every other stop builds a clique per route — O(n^2) edges for a route with n stops, which for n = 100,000 is on the order of 10 billion edges from a single route.",
        },
        {
          type: "text",
          value: ", so... 100,000 choose 2, that's roughly five billion, and that's just one route out of however many. This graph never gets built, it doesn't fit in memory before I even start traversing it.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 100,
      content: [
        {
          type: "text",
          value: "So the stops aren't the right nodes. What is actually moving here?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 122,
      content: [
        {
          type: "text",
          value: "Buses. What I'm really choosing between at each step isn't a stop, it's a ",
        },
        {
          id: "highlight-routes-as-nodes",
          type: "highlight",
          status: "strong",
          value: "route — make each route a node, connect two routes if they share a stop, and BFS over that",
          explanation:
            "Reframes the graph so the entities being traversed are buses, not stops. Once routes are the nodes, BFS depth becomes exactly the number of buses taken, which is the quantity the problem asks for.",
        },
        {
          type: "text",
          value:
            ", starting from every route that touches source. Depth in that BFS is buses taken, since each hop onto a new route is boarding one more bus, and I never build an edge between individual stops at all — just, for each stop, which routes pass through it.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 140,
      content: [
        {
          type: "text",
          value: "Write it.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 175,
      content: [
        {
          type: "text",
          value:
            "stop_to_routes maps each stop to the route indices passing through it. BFS on stops, but from a stop I expand into every route through it, and every stop on that route becomes reachable one bus later.",
        },
        {
          type: "code",
          id: "code-bfs-expand",
          language: "python",
          value:
            "for route_idx in stop_to_routes[stop]:\n    for next_stop in routes[route_idx]:\n        ...",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 195,
      content: [
        {
          type: "text",
          value: "Fifty routes all pass through the same interchange stop, and your BFS reaches that stop from three different directions before it's explored much else. Walk me through what happens to those fifty routes.",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 218,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-forget-visited-routes",
          type: "highlight",
          status: "missed",
          value: "each of the fifty gets expanded again from every direction I arrive from",
          explanation:
            "Without a visited_routes set, the same route is re-expanded every time BFS reaches any stop on it — for heavily-shared routes this repeats the same work many times over instead of each route contributing its stops exactly once.",
        },
        {
          type: "text",
          value:
            "... up to three times each, even though expanding a route once already tells me everything reachable through it. I'm only tracking visited stops, not visited routes. I need to mark a route done the first time it's expanded and skip it after that.",
        },
        {
          type: "code",
          id: "code-visited-routes",
          language: "python",
          value:
            "if route_idx in visited_routes:\n    continue\nvisited_routes.add(route_idx)",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 240,
      content: [
        {
          type: "text",
          value: "Put the whole thing together.",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 285,
      content: [
        {
          type: "text",
          value:
            "Build the stop-to-routes map once, then BFS with both a visited-stops set and a visited-routes set.",
        },
        {
          type: "code",
          id: "code-bfs-fixed",
          language: "python",
          value:
            "from collections import defaultdict, deque\n\ndef num_buses_to_destination(routes, source, target):\n    if source == target:\n        return 0\n\n    stop_to_routes = defaultdict(list)\n    for i, route in enumerate(routes):\n        for stop in route:\n            stop_to_routes[stop].append(i)\n\n    visited_routes = set()\n    visited_stops = {source}\n    queue = deque([(source, 0)])\n\n    while queue:\n        stop, buses = queue.popleft()\n        for route_idx in stop_to_routes[stop]:\n            if route_idx in visited_routes:\n                continue\n            visited_routes.add(route_idx)\n            for next_stop in routes[route_idx]:\n                if next_stop == target:\n                    return buses + 1\n                if next_stop not in visited_stops:\n                    visited_stops.add(next_stop)\n                    queue.append((next_stop, buses + 1))\n\n    return -1",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 312,
      content: [
        {
          type: "text",
          value: "Complexity?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 335,
      content: [
        {
          type: "text",
          value:
            "Building stop_to_routes is O(sum of route lengths). Each route gets expanded at most once because of visited_routes, and expanding a route costs time proportional to its own length — so the BFS itself is bounded by that same sum, and every stop is enqueued at most once. Overall it's O(total stops across all routes), time and space both. No quadratic anywhere.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 360,
      content: [
        {
          type: "text",
          value:
            "Follow-up — you won't find this version online. Same setup, but boarding route i now costs cost[i], paid once no matter how far you ride it. Minimum total cost from source to target instead of minimum buses.",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 385,
      content: [
        {
          type: "text",
          value: "BFS only worked because every hop cost exactly one bus. Now a cheap route and an expensive one both count as one hop, but they aren't equal anymore.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 396,
      content: [
        {
          type: "text",
          value: "So what changes?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 415,
      content: [
        {
          type: "text",
          value:
            "It's weighted shortest path now, not unweighted — Dijkstra. Same route graph as before, but the edge weight for boarding a route is cost[route] instead of a flat 1.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 428,
      content: [
        {
          type: "text",
          value: "Adapt your BFS into it.",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 460,
      content: [
        {
          type: "text",
          value: "Swap the queue for a min-heap on accumulated cost.",
        },
        {
          id: "highlight-visited-at-push",
          type: "highlight",
          status: "missed",
          value: "mark a stop visited the moment it's pushed, same as the BFS version",
          explanation:
            "Classic Dijkstra bug: marking a node visited at push time rather than pop time means the first path discovered wins, even if it isn't cheapest. A later, genuinely cheaper path to the same stop gets rejected before its cost is ever compared.",
        },
        {
          type: "code",
          id: "code-dijkstra-buggy",
          language: "python",
          value:
            "if next_stop not in visited_stops:\n    visited_stops.add(next_stop)\n    heapq.heappush(pq, (total_cost + cost[route_idx], next_stop))",
        },
        {
          type: "text",
          value: ", everything else keeps the same shape as before.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 485,
      content: [
        {
          type: "text",
          value:
            "Two routes reach stop X. Route A gets there first in heap order, costs 50. Route B reaches the same stop later, costs 5. What does your code return for anything downstream of X?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 510,
      content: [
        {
          type: "text",
          value:
            "...the expensive number. X gets marked visited the instant route A pushes it, at 50. When route B tries to reach X later at cost 5, my visited check throws it away because X already 'has' a cost, just not the right one. Everything downstream inherits 50 instead of 5. I'm treating discovery order like BFS instead of letting the heap decide who's actually cheapest.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 528,
      content: [
        {
          type: "text",
          value: "So fix the invariant, not just the symptom.",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 555,
      content: [
        {
          type: "text",
          value: "A stop's distance should only be finalized when it's popped, not when it's first pushed. Keep a real dist map, push whenever a strictly cheaper cost turns up, and ",
        },
        {
          id: "highlight-dist-array-fix",
          type: "highlight",
          status: "strong",
          value: "only trust a popped entry if it still matches the current best distance for that stop, otherwise it's stale and gets skipped",
          explanation:
            "Restores the real Dijkstra invariant — a node's shortest distance finalizes at pop time, and stale, superseded heap entries are simply discarded rather than trusted, so a later cheaper discovery is never blocked by an earlier worse one.",
        },
        {
          type: "text",
          value: ".",
        },
        {
          type: "code",
          id: "code-dijkstra-fixed",
          language: "python",
          value:
            "import heapq\nfrom collections import defaultdict\n\ndef min_cost_to_destination(routes, cost, source, target):\n    if source == target:\n        return 0\n\n    stop_to_routes = defaultdict(list)\n    for i, route in enumerate(routes):\n        for stop in route:\n            stop_to_routes[stop].append(i)\n\n    dist = defaultdict(lambda: float(\"inf\"))\n    dist[source] = 0\n    visited_routes = set()\n    pq = [(0, source)]\n\n    while pq:\n        d, stop = heapq.heappop(pq)\n        if d > dist[stop]:\n            continue  # stale entry — a cheaper path already won here\n        if stop == target:\n            return d\n\n        for route_idx in stop_to_routes[stop]:\n            if route_idx in visited_routes:\n                continue\n            visited_routes.add(route_idx)\n            for next_stop in routes[route_idx]:\n                nd = d + cost[route_idx]\n                if nd < dist[next_stop]:\n                    dist[next_stop] = nd\n                    heapq.heappush(pq, (nd, next_stop))\n\n    return -1",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 590,
      content: [
        {
          type: "text",
          value:
            "You're still marking a route visited the first time you touch it and never expanding it again — same trick as the BFS version. Now that edges carry real weights, is that still actually safe, or did you just carry over a habit that happens to compile?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 615,
      content: [
        {
          type: "text",
          value:
            "Let me not assume it and actually check. A route only ever gets expanded from a stop that's just been popped, and Dijkstra pops stops in non-decreasing order of finalized distance. So the first time a route is expanded, it's from the cheapest finalized stop on that route, out of every stop on it that will ever get finalized.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 630,
      content: [
        {
          type: "text",
          value: "Cheapest first time. Does that make every later expansion of the same route redundant, or just less useful?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 655,
      content: [
        {
          type: "text",
          value: "Redundant, and here's why — ",
        },
        {
          id: "highlight-visited-routes-still-valid",
          type: "highlight",
          status: "strong",
          value: "boarding cost is a flat charge per route, the same no matter which stop on it you board from, so the cheapest finalized stop on that route always gives every neighbor its best possible offer",
          explanation:
            "Correctly re-derives, rather than assumes, why the visited_routes optimization survives the move to weighted Dijkstra: because the route's cost is independent of the boarding stop, the earliest (cheapest) finalized touchpoint dominates every later one.",
        },
        {
          type: "text",
          value:
            ". Expanding the same route again later, from some stop with a larger finalized distance, only offers next_stop candidates a cost of bigger-distance-plus-same-route-cost, which can't beat what the first expansion already gave them. So marking a route visited after one expansion still holds here, just for a different reason than in the plain BFS version — there it was 'one bus per route, done'; here it's 'the cheapest boarding point for this route is already used, every other one is provably worse or equal.'",
        },
      ],
    },

    {
      id: "31",
      role: "takeaway",
      elapsedSeconds: 690,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Bus Routes tempts a stop-to-stop graph where every pair of co-route stops gets a direct edge, which explodes quadratically on any long route — the fix is modeling buses, not stops, as the graph's nodes, with BFS depth equal to buses taken. A visited_routes set is essential even there, since a shared stop can otherwise cause the same route to be re-expanded from every direction it's reached. The cost-weighted follow-up breaks the assumption that BFS depth equals the answer and needs Dijkstra instead, and porting the BFS code over surfaced the classic bug of marking a node visited at push time rather than pop time, which silently locks in a worse cost whenever a cheaper path to the same stop turns up later. The visited_routes trick from the unweighted version does carry over to Dijkstra, but only because boarding cost is flat per route regardless of which stop triggers it — a fact worth deriving explicitly rather than assuming just because the code still runs.",
        },
      ],
    },
  ],
};

const busRoutesWeighted: TranscriptEntry = {
  summary: {
    slug: "bus-routes-weighted-dijkstra",
    title: "Bus Routes, Then a Cost-Weighted Follow-Up Solved With Dijkstra",
    category: "dsa",
    difficulty: Difficulty.HARD,
    duration: 40,
    company: "Generic",
    tags: [
      "Graphs",
      "BFS",
      "Dijkstra",
      "Shortest Path",
      "Heap",
      "Priority Queue",
      "Hash Map",
    ],
    description:
      "Coding interview on LeetCode's Bus Routes: rejecting a quadratic stop-to-stop clique graph in favor of modeling routes as BFS nodes, catching a missing visited_routes set that caused redundant re-expansion, then extending into an original cost-weighted follow-up requiring Dijkstra — including the classic visited-at-push-time bug and a from-first-principles justification for why the visited_routes optimization still holds once edges carry real weights.",
  },

  transcript,
};

export default busRoutesWeighted;