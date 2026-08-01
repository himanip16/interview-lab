// src/content/transcripts/technical/number-of-islands-dynamic-connectivity.ts

import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Number of Islands — Dynamic Connectivity Variation",
    difficulty: Difficulty.HARD,
    duration: 40,
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
            "Variation on Number of Islands. You start with an m x n grid, all water. Land gets added one cell at a time, in a given order. After each addition, report the current number of islands.",
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
            "Before I pick an approach, a few assumptions I want to confirm. Connectivity is 4-directional — up, down, left, right — not diagonal, same as classic Number of Islands, right? And can the same cell be added as land more than once in the operations list?",
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
          value: "4-directional, correct. And yes, duplicates can appear in the operations list.",
        },
      ],
    },
    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 48,
      content: [
        {
          type: "text",
          value:
            "Okay, that's an important edge case then — if a cell is already land and gets 'added' again, the island count shouldn't change at all for that operation, I just re-emit the previous count. Other edge cases: m or n could be 0, meaning an empty grid — every addition would be a no-op since there's nowhere to add land, or actually the operations list would be empty too in that case. And the operations list itself could be empty, meaning I return an empty result array, no islands ever reported.",
        },
        {
          id: "highlight-duplicate-edge-case",
          type: "highlight",
          status: "strong",
          value: "Surfaces the duplicate-addition edge case before writing any code",
          explanation:
            "This is stated up front as an assumption check, not discovered later as a bug — the candidate is explicitly following an 'edge cases first' approach here.",
        },
      ],
    },
    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 75,
      content: [
        {
          type: "text",
          value: "Good. Give me your brute-force approach and its complexity before you write anything.",
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
            "Brute force: after every single land addition, run a full BFS or DFS over the whole grid to recount islands from scratch — treat it as a fresh Number of Islands problem each time. Each full scan is O(m*n). If there are k operations, total time is O(k * m * n). That's clearly wasteful — I'm redoing almost all the same work on every step just because one cell changed.",
        },
        {
          id: "highlight-complexity-before-coding",
          type: "highlight",
          status: "strong",
          value: "States brute-force time complexity explicitly before proposing any code",
          explanation:
            "Complexity analysis happens before implementation starts, framing the cost of the naive approach so the later optimization has a clear baseline to beat.",
        },
      ],
    },
    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 125,
      content: [
        {
          type: "text",
          value: "Right, that's too slow for large k. Can you do better?",
        },
      ],
    },
    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 150,
      content: [
        {
          type: "text",
          value:
            "Yes — the key insight is each addition only ever affects the local neighborhood of the new cell, not the whole grid. So instead of recomputing from scratch, I want a structure that lets me merge the new land cell with any adjacent land cells incrementally. That's exactly a Union-Find — Disjoint Set Union — problem. Each land cell starts as its own component. When I add a cell, I check its up to 4 neighbors; for each neighbor that's already land, I union the new cell's component with that neighbor's component. Islands count starts at 0, increments by 1 every time I add a genuinely new land cell, and decrements by 1 every time a union actually merges two previously separate components.",
        },
        {
          id: "highlight-union-find-choice",
          type: "highlight",
          status: "strong",
          value: "Reframes the problem as incremental component merging, arrives at Union-Find",
          explanation:
            "Candidate connects the specific weakness of the brute-force approach — redoing global work for a local change — directly to why Union-Find fits, rather than naming the pattern from memorized recognition alone.",
        },
      ],
    },
    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 180,
      content: [
        {
          type: "text",
          value: "Walk me through why 'decrement only on an actual merge' is correct, not just 'decrement on every union call'.",
        },
      ],
    },
    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 205,
      content: [
        {
          type: "text",
          value:
            "Because a new land cell can be adjacent to two neighbors that are already in the same component — say both above and to the left are land, and they're already connected to each other through some other path. Calling union on cells already in the same set shouldn't reduce the island count again; that would double-count the merge. So union() has to check the two roots first: if they're already equal, do nothing and return false; only if the roots differ do I actually link them and return true, and only on a true result do I decrement the island counter.",
        },
        {
          id: "highlight-double-merge-bug",
          type: "highlight",
          status: "strong",
          value: "Catches the double-decrement bug where two already-connected neighbors both trigger a union",
          explanation:
            "This is the subtle bug variant of this problem — a new cell can touch two neighbors that are already unified, and naively decrementing per neighbor-union-call overcounts the merge.",
        },
      ],
    },
    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 235,
      content: [
        {
          type: "text",
          value: "Alright. Code the Union-Find structure. Plain Java, please.",
        },
      ],
    },
    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 275,
      content: [
        {
          type: "code",
          language: "java",
          value:
            "public class UnionFind {\n    private final int[] parent;\n    private final int[] rank;\n    private int count;\n\n    public UnionFind(int size) {\n        parent = new int[size];\n        rank = new int[size];\n        count = 0;\n        for (int i = 0; i < size; i++) {\n            parent[i] = -1;\n        }\n    }\n\n    public void addComponent(int x) {\n        parent[x] = x;\n        rank[x] = 0;\n        count++;\n    }\n\n    public int find(int x) {\n        if (parent[x] != x) {\n            parent[x] = find(parent[x]);\n        }\n        return parent[x];\n    }\n\n    public boolean union(int x, int y) {\n        int rootX = find(x);\n        int rootY = find(y);\n        if (rootX == rootY) {\n            return false;\n        }\n        if (rank[rootX] < rank[rootY]) {\n            parent[rootX] = rootY;\n        } else if (rank[rootX] > rank[rootY]) {\n            parent[rootY] = rootX;\n        } else {\n            parent[rootY] = rootX;\n            rank[rootX]++;\n        }\n        count--;\n        return true;\n    }\n\n    public int getCount() {\n        return count;\n    }\n}",
        },
        {
          type: "text",
          value:
            "Path compression in find(), union by rank in union(). parent[x] = -1 means 'not land yet' — I use that as the not-added marker.",
        },
      ],
    },
    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 300,
      content: [
        {
          type: "text",
          value: "You initialize parent[x] to -1 for un-added cells. What breaks if find() gets called on one of those?",
        },
      ],
    },
    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 322,
      content: [
        {
          type: "text",
          value:
            "That would corrupt things — find(-1's index) would try parent[-1], which throws ArrayIndexOutOfBoundsException, or if I structured it differently it could silently produce garbage. I need to guard against ever calling find/union on a cell that hasn't been added as land yet. In the main addLand logic, I only call union between the new cell and a neighbor after confirming the neighbor is already land — I never call find on a water cell in the first place, so the guard is really 'check land status before touching Union-Find at all', not inside Union-Find itself.",
        },
        {
          id: "highlight-uninitialized-node-bug",
          type: "highlight",
          status: "strong",
          value: "Identifies the failure mode of calling find/union on an unadded (-1) node and where the guard belongs",
          explanation:
            "Interviewer probes a concrete misuse of the sentinel value; candidate correctly locates the fix at the call site (never invoke union on a non-land cell) rather than adding defensive checks inside find() itself.",
        },
      ],
    },
    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 350,
      content: [
        {
          type: "text",
          value: "Now write addLand — the piece that actually processes one operation.",
        },
      ],
    },
    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 400,
      content: [
        {
          type: "code",
          language: "java",
          value:
            "public List<Integer> numIslands2(int m, int n, int[][] positions) {\n    UnionFind uf = new UnionFind(m * n);\n    boolean[][] isLand = new boolean[m][n];\n    List<Integer> result = new ArrayList<>();\n    int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};\n\n    for (int[] pos : positions) {\n        int row = pos[0];\n        int col = pos[1];\n\n        if (isLand[row][col]) {\n            result.add(uf.getCount());\n            continue;\n        }\n\n        isLand[row][col] = true;\n        int index = row * n + col;\n        uf.addComponent(index);\n\n        for (int[] dir : directions) {\n            int newRow = row + dir[0];\n            int newCol = col + dir[1];\n            if (newRow >= 0 && newRow < m && newCol >= 0 && newCol < n && isLand[newRow][newCol]) {\n                int neighborIndex = newRow * n + newCol;\n                uf.union(index, neighborIndex);\n            }\n        }\n\n        result.add(uf.getCount());\n    }\n\n    return result;\n}",
        },
        {
          type: "text",
          value:
            "The `isLand[row][col]` check up top handles the duplicate-addition edge case we talked about — just re-emit the current count and skip everything else.",
        },
      ],
    },
    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 425,
      content: [
        {
          type: "text",
          value: "What's the time complexity now, and does the answer change with path compression plus union by rank?",
        },
      ],
    },
    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 450,
      content: [
        {
          type: "text",
          value:
            "With both path compression and union by rank together, each find/union call is amortized O(α(m*n)) — inverse Ackermann, which for any realistic input size is essentially constant, like under 5. Each of the k operations does a constant number of neighbor checks — at most 4 — each involving one or two find calls. So total time is O(k * α(m*n)), which for practical purposes is O(k). That's a real improvement over O(k*m*n) — we've decoupled the per-operation cost from the grid size entirely.",
        },
        {
          id: "highlight-complexity-comparison",
          type: "highlight",
          status: "strong",
          value: "States the optimized complexity and explicitly contrasts it against the brute-force baseline",
          explanation:
            "Ties back to the earlier stated brute-force complexity, making the improvement concrete rather than just asserting 'it's faster'.",
        },
      ],
    },
    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 475,
      content: [
        {
          type: "text",
          value:
            "Now break your own assumption. What if operations could also remove land, not just add it?",
        },
      ],
    },
    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 505,
      content: [
        {
          type: "text",
          value:
            "That's a real problem for Union-Find, because it doesn't support splitting a component back apart — once you union two sets, there's no cheap undo. If deletions were needed, I'd look at whether the whole operation sequence is known upfront. If it is, a common trick is to process operations in reverse: start from the final grid state and treat each 'removal' as an 'addition' when walking backward, then reverse the result list at the end. That converts a hard deletion problem into the addition-only problem we already solved. If operations must be processed strictly online, in real time, without seeing the future — that's a genuinely harder problem, and I'd probably fall back to localized BFS/DFS around the removed cell to recheck connectivity of its former neighbors, since Union-Find alone can't do it efficiently.",
        },
        {
          id: "highlight-deletion-limitation",
          type: "highlight",
          status: "strong",
          value: "Names Union-Find's core limitation and gives the offline-reversal trick as a concrete alternative",
          explanation:
            "Rather than forcing Union-Find to do something it fundamentally can't (undo a merge), candidate recognizes the boundary of the data structure and proposes a known technique that fits within it, while being honest that the online version is genuinely harder.",
        },
      ],
    },
    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 535,
      content: [
        {
          type: "text",
          value: "Good. Test cases — concrete ones.",
        },
      ],
    },
    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 565,
      content: [
        {
          type: "text",
          value:
            "m=3, n=3, positions=[[0,0],[0,1],[1,2],[2,1]] should give [1,1,2,3] — each addition isolated except the first two, which are adjacent. Adding [0,0] again right after should repeat the same count as before that operation, not increment. positions=[] on any grid size should return an empty list. m=0 or n=0 should also just return an empty list, since no valid positions exist. And a case where one new cell bridges two existing separate islands into one — like land at [0,0] and [0,2] already placed, then [0,1] added — should show the count actually decrease by one on that step, confirming the merge-detection logic.",
        },
        {
          id: "highlight-bridging-test",
          type: "highlight",
          status: "strong",
          value: "Includes a bridging test case that specifically exercises the merge-of-two-existing-islands path",
          explanation:
            "This test targets the exact logic discussed earlier — decrementing only on genuine merges — rather than only covering the straightforward addition cases.",
        },
      ],
    },
    {
      id: "23",
      role: "takeaway",
      elapsedSeconds: 590,
      content: [
        {
          type: "text",
          value:
            "Takeaway: this session works because the candidate front-loads assumptions and complexity before any code exists — clarifying 4-directional connectivity and the duplicate-addition edge case up front, then stating the O(k*m*n) brute-force cost explicitly before proposing anything better. The optimization path is well-motivated: the brute-force weakness (redoing global work for a local change) directly points at Union-Find as an incremental merge structure, rather than pattern-matching to 'graph problem, use Union-Find' on sight. Two real bugs get caught along the way: double-decrementing the island count when a new cell touches two neighbors already in the same component, and the failure mode of calling find/union on an unadded (-1) sentinel node, correctly fixed at the call site rather than with a defensive check buried inside Union-Find. The strongest moment is the interviewer's follow-up breaking the candidate's own no-deletion assumption — the candidate names Union-Find's real limitation (no cheap undo of a merge) instead of forcing it to do something it can't, and offers the standard offline-reversal trick as a concrete, correct alternative for the batch case, while being honest that the online case is genuinely harder.",
        },
      ],
    },
  ],
};

const numberOfIslandsDynamicConnectivity: TranscriptEntry = {
  summary: {    id: 30,

    slug: "number-of-islands-dynamic-connectivity",
    title: "Number of Islands — Dynamic Connectivity Variation",
    category: "dsa",
    difficulty: Difficulty.HARD,
    duration: 40,
    tags: [
      "Graph",
      "Union-Find",
      "Disjoint Set",
      "DSA",
      "Complexity Analysis",
      "Edge Cases",
      "Java",
    ],
    description:
      "Graph variation of Number of Islands (LeetCode 200 lineage, dynamic-connectivity style similar to LeetCode 305): land is added one cell at a time to an all-water grid, and the island count must be reported after each addition. Candidate states assumptions (4-directional connectivity, possible duplicate additions) and the O(k*m*n) brute-force complexity explicitly before writing any code, then motivates a Union-Find approach from the specific weakness of the brute force rather than pattern recognition alone. Catches a double-decrement bug when a new cell bridges two neighbors already in the same component, and correctly places the guard against calling find/union on an unadded sentinel node at the call site. Plain Java implementation (path compression + union by rank) with amortized O(k * α(mn)) complexity contrasted directly against the brute-force baseline. Interviewer follow-up breaks the no-deletion assumption; candidate names Union-Find's real limitation and proposes the offline-reversal technique for the batch case while being honest the online case is harder. Closes with concrete test cases including one that specifically exercises the island-merging path.",
  },

  transcript,
};

export default numberOfIslandsDynamicConnectivity;