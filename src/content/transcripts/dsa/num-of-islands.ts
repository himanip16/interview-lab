// src/content/transcripts/dsa/number-of-islands.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Island Counting with Diagonal Connectivity",
    difficulty: Difficulty.MEDIUM,
    company: "Amazon",
    duration: 44,
    template: "DSA",
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
            "You have an m by n grid of 0s for water and 1s for land. An island is a group of adjacent 1 cells connected horizontally, vertically, or diagonally, surrounded by water or the grid boundary. Count the number of distinct islands.",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 12,
      content: [
        {
          type: "text",
          value: "Just to confirm — diagonal neighbors count as connected too, not only up, down, left, right?",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 20,
      content: [
        { type: "text", value: "Yes, all 8 directions." },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 35,
      content: [
        {
          type: "text",
          value:
            "Okay — so for every unvisited land cell, I run a flood fill across all 8 directions, marking everything I reach as visited, and I count how many times I have to start a new flood fill.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 48,
      content: [
        { type: "text", value: "What's your complexity?" },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 60,
      content: [
        {
          type: "text",
          value:
            "O(rows times cols) — every cell gets visited at most once because of the visited marking, so there's no repeated work across separate flood fills.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 72,
      content: [
        { type: "text", value: "Are you sure a recursive DFS won't cause you trouble on a big grid?" },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 88,
      content: [
        {
          type: "text",
          value:
            "Good point — if the grid's, say, 1000 by 1000 and it's basically one giant connected island, my recursion depth could approach the total cell count. I should use BFS with an explicit queue, or an iterative stack, instead of relying on the call stack.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 100,
      content: [
        { type: "text", value: "What's the actual downside of the recursive version — be specific." },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 115,
      content: [
        {
          type: "text",
          value:
            "Stack overflow. The language's call stack has a fixed, fairly small limit, while a queue or an explicit stack just lives on the heap and can grow to whatever the grid needs.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 128,
      content: [
        { type: "text", value: "Take a small example — land cells only at the four corners of a 3x3 block, touching only diagonally at the center. One island or four?" },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 140,
      content: [
        {
          type: "text",
          value: "One island, since diagonal connectivity means those corner cells are all reachable from each other through the center.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 150,
      content: [
        { type: "text", value: "Why would that distinction actually matter in practice — when would you want diagonal connectivity versus not?" },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 165,
      content: [
        {
          type: "text",
          value:
            "Diagonal makes sense if you're modeling something continuous, like terrain or a satellite image, where corner-touching land is physically still one landmass. Four-directional is stricter — more like a game grid where a character can't cut through a corner to move diagonally.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 180,
      content: [
        { type: "text", value: "What are you actually using to track visited cells — mutating the grid, or a separate structure?" },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 195,
      content: [
        {
          type: "text",
          value:
            "I could flip visited land cells to 0 in place to save memory, or keep a separate boolean grid if I need to leave the input untouched.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 208,
      content: [
        { type: "text", value: "Why would you ever not just mutate in place, then?" },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 222,
      content: [
        {
          type: "text",
          value:
            "If the caller still needs the original grid afterward, mutating it destroys that. Or if something else is reading the same grid concurrently, mutating in place isn't safe.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 235,
      content: [
        { type: "text", value: "Fine — write the code for what you've got." },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 260,
      content: [
        {
          type: "code",
          language: "python",
          value:
            "from collections import deque\n\ndef numIslands(grid):\n    if not grid:\n        return 0\n\n    rows, cols = len(grid), len(grid[0])\n    visited = [[False] * cols for _ in range(rows)]\n    directions = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]\n    count = 0\n\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == 1 and not visited[r][c]:\n                count += 1\n                queue = deque([(r, c)])\n                visited[r][c] = True\n                while queue:\n                    cr, cc = queue.popleft()\n                    for dr, dc in directions:\n                        nr, nc = cr + dr, cc + dc\n                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1 and not visited[nr][nc]:\n                            visited[nr][nc] = True\n                            queue.append((nr, nc))\n\n    return count",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 280,
      content: [
        { type: "text", value: "Now imagine the grid is way bigger than memory — a satellite map, billions of cells. Still doing this exact BFS?" },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 300,
      content: [
        {
          type: "text",
          value:
            "Not as one grid in memory — I'd need to split it into tiles and process each tile on its own.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 312,
      content: [
        { type: "text", value: "And islands that cross a tile boundary?" },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 325,
      content: [
        {
          type: "text",
          value:
            "Right, that's the problem — flood-filling each tile in isolation would treat a cross-boundary island as two separate ones, so I'd... overcount, I'd count it twice instead of once.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 340,
      content: [
        { type: "text", value: "So how do you fix that?" },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 360,
      content: [
        {
          type: "text",
          value:
            "I'd process each tile locally to get its own local components, then only look at the border cells along each seam between adjacent tiles. If land cells touch across the seam, I merge those two local components. That sounds like union-find territory rather than plain counting.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 375,
      content: [
        { type: "text", value: "Walk me through exactly what the union-find is keyed on." },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 395,
      content: [
        {
          type: "text",
          value:
            "Each local land component from each tile gets its own ID. For every pair of adjacent border cells across a seam that are both land, I union their component IDs together. The final island count is just the number of distinct roots left once every seam has been checked.",
        },
        {
          id: "highlight-union-find-merge",
          type: "highlight",
          status: "strong",
          value: "union their component IDs",
          explanation:
            "Correctly reframes cross-tile island merging as a union-find problem over local component IDs rather than trying to re-flood-fill across tile boundaries directly.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 410,
      content: [
        { type: "text", value: "Now, updates: a satellite refresh flips one cell from water to land. Do you recompute everything?" },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 428,
      content: [
        {
          type: "text",
          value:
            "No, that'd be wasteful for a single cell — I'd just check that cell's up-to-8 neighbors, see which existing components they belong to, and union the new cell into all of them. That merges whatever islands the new cell happens to bridge.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 443,
      content: [
        { type: "text", value: "What if a cell flips the other way — land to water? Does your union-find handle that the same way?" },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 460,
      content: [
        {
          type: "text",
          value:
            "Hm — no, actually. Union-find doesn't support splitting cleanly. If I've already merged two components through that cell and it turns out it was the only connection between them, I can't cheaply undo that merge.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 475,
      content: [
        { type: "text", value: "So what do you actually do about it?" },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 495,
      content: [
        {
          type: "text",
          value:
            "I'd have to recompute connectivity for whatever region could've been affected — re-flood-fill the local neighborhood, or rebuild the union-find for that tile if removals happen a lot. If removals are rare compared to additions, I could just mark the affected tile 'dirty' and lazily recompute it the next time someone actually queries the island count, instead of recomputing on every single removal.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 510,
      content: [
        { type: "text", value: "Why lazy over eager — be specific about what you're actually saving." },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 528,
      content: [
        {
          type: "text",
          value:
            "Eager means paying the recompute cost on every removal, even if nobody asks for the island count in between. Lazy means the cost is only paid once, right before someone actually needs the answer — so if queries are infrequent relative to updates, I'm not doing work that nobody benefits from.",
        },
        {
          id: "highlight-lazy-recompute",
          type: "highlight",
          status: "strong",
          value: "only paid once, right before someone actually needs the answer",
          explanation:
            "Ties the lazy-vs-eager choice to the actual relative frequency of updates versus queries rather than picking the more sophisticated-sounding option by default.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 545,
      content: [
        { type: "text", value: "Good — that's what I wanted to dig into. Let's stop there." },
      ],
    },

    {
      id: "38",
      role: "takeaway",
      elapsedSeconds: 565,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the core algorithm is an 8-directional flood fill with an explicit queue instead of recursion, since a large connected island can otherwise blow a call stack. The follow-ups reward reframing a distributed constraint correctly — cross-tile islands become a union-find merge over local component IDs rather than a re-run of flood fill across boundaries — recognizing what union-find fundamentally can't do (cheaply split a merge back apart when a cell is removed), and choosing between eager and lazy recomputation based on the actual relative frequency of updates versus queries rather than defaulting to the more complex option.",
        },
      ],
    },
  ],
};

const amazonNumberOfIslands: TranscriptEntry = {
  summary: {
    slug: "amazon-number-of-islands",
    title: "Island Counting with Diagonal Connectivity",
    category: "dsa",
    difficulty: Difficulty.MEDIUM,
    duration: 44,
    company: "Amazon",
    tags: [
      "DFS/BFS",
      "Grid Traversal",
      "Union-Find",
      "Distributed Systems",
      "Incremental Updates",
    ],
    description:
      "SDE2 DSA interview on counting islands in a grid with diagonal connectivity. Covers iterative BFS over recursive DFS, visited-tracking tradeoffs, then scales to a grid larger than memory via tiling and cross-boundary union-find merges, incremental updates on land additions, and the limits of union-find when cells are removed.",
  },

  transcript,
};

export default amazonNumberOfIslands;