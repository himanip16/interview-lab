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
            "You're given a list of bus routes — routes[i] is the list of stops the i-th bus visits, in a loop, forever. You start at stop source and want to reach stop target. Return the minimum number of buses you must take, or -1 if it's not possible.",
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
            "If source and target are the same stop, that's 0 buses, right — I'm already there? And once I'm on a bus, I can get off at any stop that bus visits, not just adjacent ones in the list?",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 30,
      content: [
        {
          type: "text",
          value: "Correct on both.",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 50,
      content: [
        {
          type: "text",
          value:
            "Okay — feels like shortest path, where 'edge' means 'took one bus.' First idea: build a graph on the stops themselves. Two stops are connected if some route contains both of them, since you can ride that bus between them for free. Then BFS from source to target, and the number of times I cross onto a new route is the answer.",
        },
        {
          id: "highlight-clique-blowup",
          type: "highlight",
          status: "missed",
          value: "connect every pair of stops within the same route directly, one edge per pair",
          explanation:
            "Wiring every stop in a route to every other stop in that route builds a clique per route. A single route with n stops contributes O(n^2) edges — for a route with 100,000 stops that's on the order of 10 billion edges before BFS even starts, which is infeasible regardless of how efficient the traversal itself is.",
        },
        {
          type: "text",
          value: ", so a route with a bunch of stops just becomes a fully connected cluster in the stop graph.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 78,
      content: [
        {
          type: "text",
          value: "One of the routes has 100,000 stops on it. How many edges does that route alone add to your graph?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 100,
      content: [
        {
          type: "text",
          value:
            "...every pair from that one route, so on the order of 100,000 choose 2 — roughly five billion edges, from a single route, before I've even looked at the rest of the input. That's not going to fit in memory, let alone traverse. I can't materialize a stop-to-stop graph like that.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 122,
      content: [
        {
          type: "text",
          value: "So what's the actual unit of movement here?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 148,
      content: [
        {
          type: "text",
          value: "The thing I'm really choosing between isn't stops, it's ",
        },
        {
          id: "highlight-routes-as-nodes",
          type: "highlight",
          status: "strong",
          value: "routes — treat each bus route as a node, and connect two routes if they share at least one stop",
          explanation:
            "Reframes the graph so the entities being traversed are buses, not stops — this is the key modeling insight for the problem: the quantity being minimized (number of buses) becomes the BFS depth only once routes, not stops, are the nodes doing the moving.",
        },
        {
          type: "text",
          value:
            ". BFS over that route graph, starting from every route that contains the source stop. Depth in that BFS is literally the number of buses taken, since each hop to a new route is boarding one more bus. I never need to materialize edges between every pair of stops — I just need, for each stop, which routes pass through it, so I can jump from a route to its neighboring routes.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 176,
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
      elapsedSeconds: 224,
      content: [
        {
          type: "text",
          value:
            "stop_to_routes maps a stop to every route index that passes through it. Then BFS on stops, but when I'm at a stop, I expand into every route through that stop, and every other stop on that route becomes reachable one bus later.",
        },
        {
          id: "highlight-forget-visited-routes",
          type: "highlight",
          status: "missed",
          value: "expand every route reachable from a stop without tracking which routes have already been expanded",
          explanation:
            "Without a visited_routes set, the same route gets re-expanded every time BFS reaches a different stop that happens to sit on it. For routes that overlap heavily with many others, this multiplies work — the same set of neighbor stops gets rediscovered and re-enqueued repeatedly instead of each route contributing its stops exactly once.",
        },
        {
          type: "code",
          id: "code-bfs-first-pass",
          language: "python",
          value:
            "from collections import defaultdict, deque\n\ndef num_buses_to_destination(routes, source, target):\n    if source == target:\n        return 0\n\n    stop_to_routes = defaultdict(list)\n    for i, route in enumerate(routes):\n        for stop in route:\n            stop_to_routes[stop].append(i)\n\n    visited_stops = {source}\n    queue = deque([(source, 0)])\n\n    while queue:\n        stop, buses = queue.popleft()\n        for route_idx in stop_to_routes[stop]:\n            for next_stop in routes[route_idx]:\n                if next_stop == target:\n                    return buses + 1\n                if next_stop not in visited_stops:\n                    visited_stops.add(next_stop)\n                    queue.append((next_stop, buses + 1))\n\n    return -1",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 256,
      content: [
        {
          type: "text",
          value:
            "Say fifty different routes all pass through the same busy interchange stop, and you reach that stop from three different directions during the BFS before you've explored much else. What happens to those fifty routes?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 284,
      content: [
        {
          type: "text",
          value:
            "...they'd get re-expanded up to three times each, once per direction I arrived from, even though expanding a route the first time already tells me everything it can reach. I'm not tracking which routes I've already fully processed, only which stops I've seen — so a heavily shared route gets redone. I need a visited_routes set too, and skip a route entirely once it's been expanded once.",
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
      id: "13",
      role: "interviewer",
      elapsedSeconds: 312,
      content: [
        {
          type: "text",
          value: "Complexity now?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 338,
      content: [
        {
          type: "text",
          value:
            "Building stop_to_routes is O(sum of route lengths). In the BFS, every route is expanded at most once thanks to visited_routes, and expanding a route costs time proportional to its length — so across the whole BFS that's also bounded by the sum of route lengths. Every stop is enqueued at most once. So overall it's O(total stops across all routes), both time and space — no quadratic blowup anywhere.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 366,
      content: [
        {
          type: "text",
          value:
            "Follow-up, and this one's not the version on LeetCode. Same setup, but now every route has a cost — cost[i] is what it costs to board route i, paid once no matter how far you ride it or how many stops you pass through. Find the minimum total cost from source to target.",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 392,
      content: [
        {
          type: "text",
          value:
            "BFS assumed every 'bus taken' cost exactly 1, so depth was the answer. That's not true anymore — boarding a cheap route and an expensive route both count as one hop in BFS, but they're not equal anymore. I need shortest path with weighted edges, not unweighted — that's Dijkstra. Same route graph as before, but the edge weight to reach any stop on a newly-boarded route is cost[route], instead of always 1.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 418,
      content: [
        {
          type: "text",
          value: "Go ahead and adapt your BFS into it.",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 466,
      content: [
        {
          type: "text",
          value:
            "Swap the queue for a min-heap keyed on accumulated cost, push (cost, stop) instead of (buses, stop), everything else the same shape.",
        },
        {
          id: "highlight-visited-at-push",
          type: "highlight",
          status: "missed",
          value: "mark a stop visited the moment it's pushed onto the heap, same as the BFS version did",
          explanation:
            "This is a textbook Dijkstra bug: marking a node visited at push time — not pop time — means the first path discovered to a stop wins even if it isn't the cheapest. If a costly route reaches a stop early and gets it marked visited, a genuinely cheaper path to the same stop discovered later through a different route gets silently discarded because the visited check rejects it before its cost is ever compared.",
        },
        {
          type: "code",
          id: "code-dijkstra-buggy",
          language: "python",
          value:
            "import heapq\nfrom collections import defaultdict\n\ndef min_cost_to_destination(routes, cost, source, target):\n    if source == target:\n        return 0\n\n    stop_to_routes = defaultdict(list)\n    for i, route in enumerate(routes):\n        for stop in route:\n            stop_to_routes[stop].append(i)\n\n    visited_routes = set()\n    visited_stops = {source}\n    pq = [(0, source)]\n\n    while pq:\n        total_cost, stop = heapq.heappop(pq)\n        if stop == target:\n            return total_cost\n        for route_idx in stop_to_routes[stop]:\n            if route_idx in visited_routes:\n                continue\n            visited_routes.add(route_idx)\n            for next_stop in routes[route_idx]:\n                if next_stop not in visited_stops:\n                    visited_stops.add(next_stop)\n                    heapq.heappush(pq, (total_cost + cost[route_idx], next_stop))\n\n    return -1",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 498,
      content: [
        {
          type: "text",
          value:
            "Two routes both reach stop X. Route A gets there first in your heap order but costs 50. Route B reaches the same stop later but only costs 5. What does your code return for anything downstream of X?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 528,
      content: [
        {
          type: "text",
          value:
            "...the expensive one. X gets marked visited the instant route A's expansion pushes it, at cost 50. When route B's expansion later tries to reach X at cost 5, my visited_stops check throws that away, because X already 'has' a cost — just not the right one. Everything downstream of X inherits the inflated 50 instead of the true 5. That's exactly the bug: I'm treating discovery order like BFS instead of letting the heap actually decide who's cheapest.",
        },
        {
          type: "text",
          value: "Fix is to ",
        },
        {
          id: "highlight-dist-array-fix",
          type: "highlight",
          status: "strong",
          value: "keep a real dist map, push every time a strictly cheaper cost is found, and only trust a popped entry if it matches the current best distance for that stop",
          explanation:
            "Restores the actual Dijkstra invariant: a node's shortest distance is only finalized when it's popped from the heap, not when it's first pushed. Stale, superseded heap entries are simply skipped rather than treated as ground truth, so a later cheaper discovery is never blocked by an earlier, worse one.",
        },
        {
          type: "text",
          value: " — never mark a stop as done just because it's been seen once.",
        },
        {
          type: "code",
          id: "code-dijkstra-fixed",
          language: "python",
          value:
            "import heapq\nfrom collections import defaultdict\n\ndef min_cost_to_destination(routes, cost, source, target):\n    if source == target:\n        return 0\n\n    stop_to_routes = defaultdict(list)\n    for i, route in enumerate(routes):\n        for stop in route:\n            stop_to_routes[stop].append(i)\n\n    dist = defaultdict(lambda: float(\"inf\"))\n    dist[source] = 0\n    visited_routes = set()\n    pq = [(0, source)]\n\n    while pq:\n        d, stop = heapq.heappop(pq)\n        if d > dist[stop]:\n            continue  # stale entry — a cheaper path to this stop already won\n        if stop == target:\n            return d\n\n        for route_idx in stop_to_routes[stop]:\n            if route_idx in visited_routes:\n                continue\n            visited_routes.add(route_idx)\n            for next_stop in routes[route_idx]:\n                nd = d + cost[route_idx]\n                if nd < dist[next_stop]:\n                    dist[next_stop] = nd\n                    heapq.heappush(pq, (nd, next_stop))\n\n    return -1",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 560,
      content: [
        {
          type: "text",
          value:
            "You're still marking a route visited the first time you touch it and never expanding it again, same trick as the BFS version. Now that edges have real weights, is that still safe, or did you just carry over a habit that happens to still compile?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 604,
      content: [
        {
          type: "text",
          value:
            "Good question — let me actually justify it instead of assuming. Routes only ever get expanded from a stop that's just been popped off the heap, and Dijkstra pops stops in non-decreasing order of their finalized distance. So the first time any route gets expanded, it's necessarily from the cheapest finalized stop that touches it, out of all the stops on that route that will ever get finalized before or at that point.",
        },
        {
          id: "highlight-visited-routes-still-valid",
          type: "highlight",
          status: "strong",
          value: "boarding a given route costs the same fixed amount no matter which of its stops you board from, so the cheapest finalized stop on that route always produces the best possible reach for every other stop on it",
          explanation:
            "Correctly re-derives, rather than assumes, why the visited_routes optimization survives the move from unweighted BFS to weighted Dijkstra: because the route's cost is a flat per-boarding charge independent of which stop triggers it, the earliest (cheapest) finalized touchpoint dominates every later one, so re-expanding the same route from a costlier stop could never improve any of its neighbors.",
        },
        {
          type: "text",
          value:
            " — expanding that same route again later, from some other stop with a larger finalized distance, would only ever offer next_stop candidates a cost of (bigger distance + same route cost), which can't beat what the first expansion already offered. So marking a route visited after its first expansion isn't a leftover BFS habit here, it actually still holds, but for a different reason than in the unweighted version — there it was 'one bus per route, done'; here it's 'the cheapest boarding point for this route has already been used, and every other boarding point on it is provably worse or equal.'",
        },
      ],
    },

    {
      id: "23",
      role: "takeaway",
      elapsedSeconds: 640,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Bus Routes tempts a stop-to-stop graph where every pair of co-route stops gets a direct edge, which explodes quadratically on any long route — the fix is modeling buses, not stops, as the graph nodes, with BFS depth equal to buses taken. A visited_routes set is essential even there, since a shared stop can otherwise cause the same route to be re-expanded from every direction it's reached from. The cost-weighted follow-up breaks the BFS-depth-equals-answer assumption entirely and needs Dijkstra, and porting the BFS code over surfaced the classic bug of marking a node visited at push time instead of pop time, which silently locks in a worse cost whenever a cheaper path to the same stop is found later. The visited_routes trick from the unweighted version does still carry over to Dijkstra, but only because boarding cost is flat per route regardless of stop — so the cheapest finalized touchpoint on a route always dominates every later one, which is a fact worth re-deriving explicitly rather than assuming just because the code still runs.",
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