// src/content/transcripts/dsa/cheapest-flights-k-stops.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Cheapest Flights Within K Stops: State Design and Constraint Handling",
    difficulty: Difficulty.MEDIUM,
    duration: 42,
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
            "You have a graph of flights between cities. Find the minimum cost path from src to dst, but you're limited to at most k stops. What's a stop, by the way?",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 18,
      content: [
        {
          type: "text",
          value:
            "A stop is an intermediate city you land at. So if I fly src -> A -> B -> dst, that's two stops, not counting the source.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 32,
      content: [
        {
          type: "text",
          value:
            "Good. Now, could you use ordinary Dijkstra's algorithm here? You know, just find the shortest path?",
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
            "In principle yes, but there's a catch — Dijkstra finds the absolute shortest path, which might use more than k stops. The constraint is the problem.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 68,
      content: [
        {
          type: "text",
          value:
            "Right. But let me ask you this: suppose I have two paths from src to some city X. One costs 50 and uses 2 stops, the other costs 60 and uses 1 stop. Which is better?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 88,
      content: [
        {
          type: "text",
          value:
            "That depends on the budget. If k >= 2, both are candidates, and I'd prefer the 50-cost one. If k = 1, only the 60-cost one is valid.",
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
          value:
            "Exactly. So which path is 'better' isn't determined by cost alone. It depends on the number of stops. What does that tell you about the state you need to track?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 130,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-two-dimensional-state",
          type: "highlight",
          status: "strong",
          value: "you can't just track minimum cost per node — you need minimum cost per (node, stops_used) pair",
          explanation:
            "The constraint introduces a second dimension to the state space. The cost to reach a node is no longer a single value but depends on how many stops were used to get there. Different stop counts can lead to different reachable nodes, so both dimensions matter.",
        },
        {
          type: "text",
          value: ". I need a 2D state: dist[node][stops] = minimum cost to reach node using at most stops flights.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 152,
      content: [
        {
          type: "text",
          value:
            "Now, how would you compute that? Walk me through the logic without code yet.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 180,
      content: [
        {
          type: "text",
          value:
            "Start with dist[src][0] = 0 — I'm at the source with zero cost and zero stops. Then I need to iterate: for each number of stops from 0 to k, for each city I can reach, update the destination cities reachable in one more flight.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 200,
      content: [
        {
          type: "text",
          value:
            "So you're iterating by number of stops. At iteration i, what does dist[node][i] represent?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 220,
      content: [
        {
          type: "text",
          value:
            "The minimum cost to reach that node using exactly i stops... or wait, at most i stops? If I use fewer stops, that's still valid, so probably at most i stops.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 235,
      content: [
        {
          type: "text",
          value:
            "Good, at most. So when you compute dist[node][i], you need to consider all paths that could reach it in i or fewer flights. But you already computed those for i-1, right? So how do you extend?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 260,
      content: [
        {
          type: "text",
          value:
            "In iteration i, I look at every edge in the graph. For each edge from A to B with cost c, if I can reach A using at most i-1 stops with cost dist[A][i-1], then I can reach B using at most i stops with cost dist[A][i-1] + c. So I update dist[B][i] = min(dist[B][i], dist[A][i-1] + c).",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 285,
      content: [
        {
          type: "text",
          value:
            "That's it. That's Bellman-Ford adapted to this constraint. Why iterate over stops instead of repeating until convergence?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 310,
      content: [
        {
          type: "text",
          value:
            "Because we have a hard limit on stops. Bellman-Ford iterates n-1 times to guarantee finding the shortest path in n nodes. Here, we know we'll visit at most k stops before hitting the limit, so we iterate k+1 times and we're done.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 328,
      content: [
        {
          type: "text",
          value: "Write it.",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 380,
      content: [
        {
          type: "text",
          value:
            "Initialize distances, iterate by stops, update edges, return minimum cost to destination.",
        },
        {
          type: "code",
          id: "code-bellman-ford",
          language: "python",
          value:
            "def findCheapestPrice(n, flights, src, dst, k):\n    dist = [[float('inf')] * (k + 2) for _ in range(n)]\n    dist[src][0] = 0\n\n    for i in range(k + 1):\n        for u, v, price in flights:\n            if dist[u][i] != float('inf'):\n                dist[v][i + 1] = min(dist[v][i + 1], dist[u][i] + price)\n\n    return min(dist[dst][1:k + 2]) if min(dist[dst][1:k + 2]) != float('inf') else -1",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 405,
      content: [
        {
          type: "text",
          value:
            "Wait, why does dist have k+2 columns? We can use at most k stops, so wouldn't k+1 be enough?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 430,
      content: [
        {
          type: "text",
          value:
            "Let me think... dist[node][i] represents the cost using at most i stops. We iterate from i=0 to i=k, and in iteration i we update dist[v][i+1]. So we need indices from 0 to k+1, which means k+2 columns total. Yes, that's right.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 448,
      content: [
        {
          type: "text",
          value:
            "Good. Now trace through the first example. n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1.",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 490,
      content: [
        {
          type: "text",
          value:
            "Initialize: dist[0][0]=0, all others are inf. Iteration i=0: from edge [0,1,100], dist[1][1] = min(inf, 0+100) = 100. From [1,2,100], dist[1][0]=inf so skip. From [2,0,100], dist[2][0]=inf so skip. From [1,3,600], dist[1][0]=inf so skip. From [2,3,200], dist[2][0]=inf so skip. After i=0: dist[1][1]=100. Iteration i=1: from [0,1,100], dist[0][1]=inf so skip. From [1,2,100], dist[1][1]=100 so dist[2][2] = min(inf, 100+100) = 200. From [2,0,100], dist[2][1]=inf so skip. From [1,3,600], dist[1][1]=100 so dist[3][2] = min(inf, 100+600) = 700. From [2,3,200], dist[2][1]=inf so skip. After i=1: dist[2][2]=200, dist[3][2]=700. We want min(dist[3][1:k+2]) = min(dist[3][1], dist[3][2]) = min(inf, 700) = 700.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 525,
      content: [
        {
          type: "text",
          value:
            "Perfect. But I want to probe something. When you update dist[v][i+1], are you considering all possible predecessors of v at once, or one at a time?",
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
            "In each iteration i, I go through all edges. For each edge, I check if the source node has a valid distance at step i. If it does, I update the destination at step i+1. So I'm processing all edges, considering all predecessors in parallel for each stop level.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 570,
      content: [
        {
          type: "text",
          value:
            "Let me ask you a different question. What if there's a negative-cost edge? Would your algorithm still work?",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 595,
      content: [
        {
          type: "text",
          value:
            "I'm told in the constraints that prices are between 1 and 10^4, so all positive. But in theory, if there were negative edges, Bellman-Ford still works — it detects negative cycles. My adaptation here doesn't explicitly detect them, but by bounding the number of iterations to k+1, I'm preventing infinite negative cycles from reducing cost arbitrarily.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 615,
      content: [
        {
          type: "text",
          value:
            "Right. The stop constraint acts as a depth limit, which prevents negative cycles from being exploited. Good. Now, a follow-up: what if you wanted the absolute minimum cost regardless of stops, but you still needed to respect the stop limit if it exists. In other words, what if k was nullable or infinite?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 645,
      content: [
        {
          type: "text",
          value:
            "If k is infinite, then the stop constraint doesn't matter, and I'm just finding the shortest path. I could use Dijkstra instead, which is O(n log n) compared to Bellman-Ford's O(nk).",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 665,
      content: [
        {
          type: "text",
          value:
            "Could you modify your current algorithm to handle both cases dynamically?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 690,
      content: [
        {
          type: "text",
          value:
            "If k >= n-1, there's no point iterating more because the longest shortest path in a DAG-like structure uses at most n-1 edges. So I'd cap k at min(k, n-1). That way, if k is very large, I still run in O(n²) time instead of blowing up.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 710,
      content: [
        {
          type: "text",
          value:
            "Good optimization. But could you get better than O(n²) without losing the stop constraint correctness?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 735,
      content: [
        {
          type: "text",
          value:
            "Yes — use Dijkstra but track state as (node, stops_used). Use a min-heap on cost, and push (cost, node, stops) tuples. When you pop a state, if you've already visited this (node, stops) pair, skip it. Otherwise, relax all neighbors.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 760,
      content: [
        {
          type: "text",
          value:
            "Wouldn't that revisit the same (node, stops) pair multiple times if there are different costs?",
        },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 785,
      content: [
        {
          type: "text",
          value:
            "No, because Dijkstra's invariant is that the first time you pop a state, you have the minimum cost for that state. So you mark it visited and never process it again.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 800,
      content: [
        {
          type: "text",
          value:
            "Correct. Code that up quickly.",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 845,
      content: [
        {
          type: "text",
          value:
            "Dijkstra with 2D state and a visited set for (node, stops) pairs.",
        },
        {
          type: "code",
          id: "code-dijkstra",
          language: "python",
          value:
            "import heapq\nfrom collections import defaultdict\n\ndef findCheapestPrice(n, flights, src, dst, k):\n    graph = defaultdict(list)\n    for u, v, price in flights:\n        graph[u].append((v, price))\n    \n    pq = [(0, src, 0)]  # (cost, node, stops)\n    visited = set()\n    \n    while pq:\n        cost, node, stops = heapq.heappop(pq)\n        \n        if (node, stops) in visited:\n            continue\n        visited.add((node, stops))\n        \n        if node == dst:\n            return cost\n        \n        if stops < k:\n            for neighbor, price in graph[node]:\n                if (neighbor, stops + 1) not in visited:\n                    heapq.heappush(pq, (cost + price, neighbor, stops + 1))\n    \n    return -1",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 870,
      content: [
        {
          type: "text",
          value:
            "Complexity compared to the Bellman-Ford version?",
        },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 890,
      content: [
        {
          type: "text",
          value:
            "Bellman-Ford is O(k * E) where E is the number of edges. Dijkstra is O((n*k) log(n*k)) because we have n*k possible states in the heap. For dense graphs where E is close to n², Dijkstra is worse. For sparse graphs where E is small, Dijkstra is better. It depends on the input.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 912,
      content: [
        {
          type: "text",
          value:
            "Which would you choose in practice?",
        },
      ],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 935,
      content: [
        {
          type: "text",
          value:
            "For this specific problem, n <= 100 and E is at most n(n-1)/2, so both are fast. Bellman-Ford is simpler conceptually and has no data structure overhead. I'd probably go with Bellman-Ford for clarity, but Dijkstra is more elegant if you want to show you understand priority queues.",
        },
      ],
    },

    {
      id: "41",
      role: "takeaway",
      elapsedSeconds: 955,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Cheapest Flights Within K Stops is fundamentally a constrained shortest-path problem. The key insight is recognizing that standard shortest-path algorithms don't work because optimality isn't determined by cost alone — it also depends on how many stops were used. This necessitates a 2D state space: dist[node][stops_used], making it clear that reaching a node via different numbers of stops represents different optimization subproblems. Bellman-Ford naturally adapts to this: iterate k+1 times, and in each iteration, relax all edges using distances from the previous stop level. This guarantees the stop constraint is respected while finding the minimum cost for each (node, stops) pair. Dijkstra can also work by treating (node, stops) as the state space, but it requires a priority queue and visited tracking on 2D states. For this problem's constraints, Bellman-Ford is usually the simpler choice. The algorithm also illustrates how constraints transform the problem structure — without the k-stop limit, it's unconstrained shortest path; with it, the problem becomes a layered graph problem where you explicitly enumerate paths of different lengths.",
        },
      ],
    },
  ],
};

const cheapestFlightsKStops: TranscriptEntry = {
  summary: {    id: 18,

    slug: "cheapest-flights-k-stops",
    title: "Cheapest Flights Within K Stops: State Design and Constraint Handling",
    category: "dsa",
    difficulty: Difficulty.MEDIUM,
    duration: 42,
    company: "Generic",
    tags: [
      "Shortest Path",
      "Bellman-Ford",
      "Dijkstra",
      "Dynamic Programming",
      "Constrained Optimization",
      "Graph",
    ],
    description:
      "Coding interview on LeetCode's Cheapest Flights Within K Stops with Feynman-style interviewer: recognizing why standard shortest-path algorithms fail under stop constraints, deriving the 2D state space dist[node][stops], implementing Bellman-Ford adapted to iterate by stops rather than until convergence, tracing through examples, and comparing with a Dijkstra variant using (node, stops) as the state. Emphasizes understanding why constraints change the problem structure.",
  },

  transcript,
};

export default cheapestFlightsKStops;