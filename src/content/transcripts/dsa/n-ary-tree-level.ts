// src/content/transcripts/dsa/nary-tree-level-count.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "N-ary Tree: Nodes at a Level, Then Making Level Counts O(1) Under Insert/Remove",
    difficulty: Difficulty.HARD,
    duration: 38,
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
            "You're given the root of an N-ary tree — each node can have any number of children. Given a level number, return the list of nodes at that level.",
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
          value: "Is the root level 0 or level 1, and can the target level be deeper than the tree actually goes?",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 24,
      content: [
        {
          type: "text",
          value: "Root is level 0. If the level doesn't exist, empty list back.",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 40,
      content: [
        {
          type: "text",
          value:
            "Straightforward then — DFS from root carrying the current depth. When depth matches the target, collect the node and don't bother recursing into its children, since they'd only be deeper.",
        },
        {
          type: "code",
          id: "code-dfs-level",
          language: "python",
          value:
            "def nodes_at_level(root, target_level):\n    result = []\n\n    def dfs(node, level):\n        if node is None:\n            return\n        if level == target_level:\n            result.append(node)\n            return\n        for child in node.children:\n            dfs(child, level + 1)\n\n    dfs(root, 0)\n    return result",
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
          value: "That's fine. Any reason you'd prefer BFS instead?",
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
          value:
            "If I only care about one level and the tree is wide but not that deep, BFS lets me stop as soon as I finish processing the target level, without ever touching anything below it. DFS as written still has to walk every branch down to at least the target depth even if most of the tree is below that level and irrelevant. Neither one is asymptotically better in the worst case — both are bounded by however many nodes sit at or above the target level — but BFS avoids descending past the level I actually want.",
        },
        {
          type: "code",
          id: "code-bfs-level",
          language: "python",
          value:
            "from collections import deque\n\ndef nodes_at_level_bfs(root, target_level):\n    if root is None:\n        return []\n\n    queue = deque([root])\n    level = 0\n    while queue:\n        if level == target_level:\n            return list(queue)\n        next_queue = deque()\n        for node in queue:\n            next_queue.extend(node.children)\n        queue = next_queue\n        level += 1\n\n    return []",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 116,
      content: [
        {
          type: "text",
          value:
            "Okay, follow-up. Now the tree changes over time — nodes get added and removed. I don't want the list of nodes at a level anymore, just the count. And I want to query that count in O(1). Design it.",
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
          value:
            "That part's easy — keep a running counter per level, a dict from level to count. Every time a node's inserted, bump the count at its level. Query is just a dict lookup, O(1).",
        },
        {
          id: "highlight-easy-insert",
          type: "highlight",
          status: "strong",
          value: "maintain level → count incrementally instead of recomputing it by walking the tree on every query",
          explanation:
            "Correctly reframes the problem as incremental maintenance rather than recomputation — the query becomes a hash lookup only because the count is kept up to date on every mutation instead of derived on demand.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 172,
      content: [
        {
          type: "text",
          value: "And when a node is removed?",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 190,
      content: [
        {
          type: "text",
          value: "Symmetric — ",
        },
        {
          id: "highlight-naive-remove",
          type: "highlight",
          status: "missed",
          value: "look up the node's level and decrement that one count by one",
          explanation:
            "Treats removal as the mirror image of insertion without asking what happens to the removed node's children. In a tree, deleting an internal node is never just one node leaving — its whole subtree is affected, either by also being removed or by being reattached at a different depth.",
        },
        {
          type: "text",
          value: ", same dict, O(1).",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 210,
      content: [
        {
          type: "text",
          value: "The node you're removing has forty descendants. What happens to them?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 236,
      content: [
        {
          type: "text",
          value:
            "...right, I skipped that. I need to actually ask which behavior you want — does removing a node take its whole subtree with it, or does the node get spliced out and its children get promoted up to their grandparent?",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 256,
      content: [
        {
          type: "text",
          value: "Let's do both. Start with: removing a node removes its entire subtree.",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 284,
      content: [
        {
          type: "text",
          value:
            "Then every one of those forty descendants is also leaving its own level, so every one of those counts has to be decremented too, not just the removed node's own level. I'll walk the subtree — stack-based, avoid recursion depth issues — and for each node visited, decrement the count at its level and drop it from a level-lookup map I'm keeping so I know each node's current level in O(1).",
        },
        {
          type: "code",
          id: "code-remove-subtree",
          language: "python",
          value:
            "from collections import defaultdict\n\nclass DynamicNaryTree:\n    def __init__(self):\n        self.level_counts = defaultdict(int)\n        self.node_level = {}  # node -> its current level\n\n    def insert(self, node, parent):\n        level = 0 if parent is None else self.node_level[parent] + 1\n        node.children = getattr(node, \"children\", [])\n        self.node_level[node] = level\n        if parent is not None:\n            parent.children.append(node)\n        self.level_counts[level] += 1\n\n    def remove_subtree(self, node, parent):\n        if parent is not None:\n            parent.children.remove(node)\n\n        stack = [node]\n        while stack:\n            curr = stack.pop()\n            level = self.node_level.pop(curr)\n            self.level_counts[level] -= 1\n            stack.extend(curr.children)\n\n    def count_at_level(self, level):\n        return self.level_counts.get(level, 0)  # O(1)",
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
          value: "That's O(size of the subtree) for the remove, not O(1). You said O(1).",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 344,
      content: [
        {
          type: "text",
          value:
            "The O(1) requirement was on the get — count_at_level is a dict lookup, that's the operation you said had to be O(1), and it is, regardless of tree size. Insert is O(1) too. Removing a subtree of k nodes has to cost at least O(k), and I don't think that's avoidable: each of those k nodes is genuinely leaving its level, so its count has to be retracted somewhere, and that's k real state changes, not k units of wasted work. What I'd say instead is it's amortized O(1) per node over the tree's lifetime — every node costs one decrement when it's removed, and it only ever got inserted once, so total work across every insert and remove call is proportional to the total number of nodes that ever existed, not to the size of the tree at query time.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 378,
      content: [
        {
          type: "text",
          value:
            "Fair. Now the other version — removing a node splices it out, and its children get promoted up to attach to its old parent instead. What breaks?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 410,
      content: [
        {
          type: "text",
          value: "First thought: it's cheaper, because I'm not deleting the descendants, just re-hanging them one level higher, so maybe I can get away without touching all of them.",
        },
        {
          id: "highlight-reparent-missed-cascade",
          type: "highlight",
          status: "missed",
          value: "assume reparenting is cheaper than a full subtree removal since the nodes themselves survive",
          explanation:
            "Conflates 'the nodes aren't deleted' with 'the nodes don't need updating.' Every descendant's absolute level genuinely changes by one when its ancestor is spliced out — that's still a real state transition per node, whether the node survives or not, and each one has to move out of its old level's count and into its new one.",
        },
        {
          type: "text",
          value:
            " — but no, that's wrong. Every descendant's actual level shifts by one, since their whole chain up to the root just got one hop shorter. Grandchild that was level 5 is level 4 now, and everything below it shifts too. Each of those is still a real transition in the level_counts map — decrement the old level, increment the new one — for every single descendant. I still have to touch all of them, same as full subtree removal, just decrement-and-increment-elsewhere instead of decrement-and-drop.",
        },
        {
          type: "code",
          id: "code-reparent",
          language: "python",
          value:
            "    def remove_and_reparent(self, node, parent):\n        old_level = self.node_level.pop(node)\n        self.level_counts[old_level] -= 1\n\n        if parent is not None:\n            parent.children.remove(node)\n            for child in node.children:\n                parent.children.append(child)\n                self._shift_level(child, delta=-1)\n\n    def _shift_level(self, node, delta):\n        stack = [node]\n        while stack:\n            curr = stack.pop()\n            old = self.node_level[curr]\n            new = old + delta\n            self.node_level[curr] = new\n            self.level_counts[old] -= 1\n            self.level_counts[new] += 1\n            stack.extend(curr.children)",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 448,
      content: [
        {
          type: "text",
          value:
            "Could you make the level itself lazy — store it relative to the parent instead of absolute, so a reparent doesn't force you to touch descendants at all?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 486,
      content: [
        {
          type: "text",
          value:
            "You can make the level lazy, sure — store each node's depth as an offset from its parent, and resolve the absolute level by walking up the chain when you actually need it, with path compression so repeated queries amortize down. That makes reparenting itself O(1): reattach the node, done, nobody's absolute level field gets touched.",
        },
        {
          type: "text",
          value:
            "But that breaks count_at_level. The level_counts dict only stays correct if every node's contribution is filed under its current absolute level the moment it changes. If I make the level lazy, I don't know a node's absolute level without resolving it — so I can't keep an eagerly-correct per-level counter anymore, and count_at_level stops being a plain O(1) lookup. I've just moved the cost from remove into get instead of eliminating it. Since the requirement here was specifically that the get has to be O(1), I don't think I can afford to make the level lazy — I need levels resolved eagerly precisely so the count map stays valid without recomputation at query time.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 522,
      content: [
        {
          type: "text",
          value: "So what's your final answer — is O(1) really achievable here?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 556,
      content: [
        {
          type: "text",
          value: "Depends which operation you mean by ",
        },
        {
          id: "highlight-final-tradeoff",
          type: "highlight",
          status: "strong",
          value: "O(1): the get is worst-case O(1) always; insert is worst-case O(1); a subtree removal or reparent is O(k) for k affected descendants, which is amortized O(1) per node over the tree's whole lifetime, and it can't be less than that because each affected node undergoes a real level change that the count map has to reflect",
          explanation:
            "Delivers a precise, defensible final answer that separates what's achievable in the worst case (get, insert) from what's only achievable in an amortized sense (bulk removal/reparent), and grounds the lower bound in the fact that each level transition is genuine state that must be recorded somewhere — not an artifact of a suboptimal algorithm.",
        },
        {
          type: "text",
          value:
            ". Trying to push the cost off of remove and onto get by laziness doesn't get around it — it just relocates the O(k) work to a different operation, and you specifically needed get to stay O(1), so eager level maintenance is the right trade here.",
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
            "Takeaway: getting nodes at a level in a static N-ary tree is plain DFS or BFS carrying depth, and BFS has the edge only when you want to stop as soon as the target level is fully processed. Making count_at_level O(1) under dynamic insert/remove means maintaining a level → count map incrementally rather than recomputing it, which makes insert and get genuinely O(1) — but removal was tempting to treat as symmetric with insert, and it isn't: removing an internal node affects every descendant, whether the subtree is deleted outright or reparented, because each descendant's absolute level is real state that has to be individually retracted and re-filed. That cost is unavoidable in the worst case for a single bulk operation, but amortizes to O(1) per node across the tree's full lifetime. Trying to dodge it by storing levels lazily just moves the cost from remove into get, which fails the actual requirement — the O(1) constraint was on the query, so levels need to be maintained eagerly, not resolved on demand.",
        },
      ],
    },
  ],
};

const naryTreeLevelCount: TranscriptEntry = {
  summary: {
    slug: "nary-tree-level-nodes-dynamic-count",
    title: "N-ary Tree: Nodes at a Level, Then Making Level Counts O(1) Under Insert/Remove",
    category: "dsa",
    difficulty: Difficulty.HARD,
    duration: 38,
    company: "Generic",
    tags: [
      "Trees",
      "N-ary Tree",
      "BFS",
      "DFS",
      "Hash Map",
      "Amortized Analysis",
      "System Design",
    ],
    description:
      "Coding interview starting from DFS/BFS to list nodes at a level in an N-ary tree, then extending into a dynamic version where insert/remove happen live and count_at_level must be O(1) — surfacing the missed assumption that subtree removal or reparenting is 'symmetric' with insert, and landing on eager level maintenance with amortized O(1) update cost as the real trade-off.",
  },

  transcript,
};

export default naryTreeLevelCount;