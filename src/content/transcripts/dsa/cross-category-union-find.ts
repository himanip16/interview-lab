// src/content/transcripts/dsa/cross-category-product-pairs-union-find.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Cross-Category Product Recommendations, Then Sampling at Scale",
    difficulty: Difficulty.MEDIUM,
    duration: 36,
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
            "You've got N products. You're given pairs of products, and each pair tells you those two products are in the same category. Return a list of product pairs where the two products are in different categories — basically, valid cross-category recommendations.",
        },
        {
          type: "code",
          id: "code-example",
          language: "text",
          value:
            "Input:  [(1,3), (2,7), (3,8)]\nOutput: [(1,2),(1,7),(3,2),(3,7),(8,2),(8,7)]",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 16,
      content: [
        {
          type: "text",
          value:
            "3 shows up in two different pairs — (1,3) and (3,8). Does that mean 1, 3, and 8 are all the same category, even though 1 and 8 never appear together directly?",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 28,
      content: [
        { type: "text", value: "Yes. Same-category is transitive." },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 36,
      content: [
        {
          type: "text",
          value:
            "That explains the output then — 1, 3, 8 must be one category, 2 and 7 the other, and it's every pair across the two. Does the order of the output pairs matter, or is it just 'return a correct set of cross-category pairs'?",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 50,
      content: [
        {
          type: "text",
          value: "Any correct, duplicate-free set is fine. Order isn't graded.",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 58,
      content: [
        {
          type: "text",
          value:
            "Good, that simplifies things. One more — could a product I never see in the input pairs at all still exist, as its own singleton category?",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 68,
      content: [
        {
          type: "text",
          value:
            "For now assume every product appears in at least one pair. I'll come back to that.",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 80,
      content: [
        {
          type: "text",
          value:
            "Okay. So really the input is describing a graph — an edge between two products means same category — and 'category' is just 'connected component.' Naive version: for every pair of products, check whether they're connected by searching the graph.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 96,
      content: [
        {
          type: "text",
          value: "N is 200,000 products. How bad is that?",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 108,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-naive-blowup",
          type: "highlight",
          status: "missed",
          value:
            "a BFS or DFS per pair of products, over every one of the roughly N-squared pairs",
          explanation:
            "Re-running a graph search for every candidate pair is O(N^2 * (N+M)) in the worst case — checking connectivity between all pairs this way is enormously wasteful when connectivity only needs to be computed once per product, not once per pair.",
        },
        {
          type: "text",
          value:
            ". That's N-squared pair checks times a search that's itself linear in the graph size. Nowhere close to feasible at 200,000. I don't need to re-derive connectivity for every pair — I need to know, once, which category each product is in.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 128,
      content: [
        { type: "text", value: "So what's the right tool for 'which group is this in, and do these two things share a group'?" },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 140,
      content: [
        {
          type: "text",
          value:
            "Union-Find. Union every pair as I read it in, and I get connected components for free — no repeated traversal, and find() answers 'same group?' in close to constant time.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 152,
      content: [{ type: "text", value: "Go ahead, sketch it." }],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 172,
      content: [
        {
          type: "text",
          value: "Standard path-compressed union-find, keyed by product id instead of a plain array since ids aren't guaranteed to be dense:",
        },
        {
          type: "code",
          id: "code-dsu",
          language: "python",
          value:
            "class DSU:\n    def __init__(self):\n        self.parent = {}\n\n    def find(self, x):\n        self.parent.setdefault(x, x)\n        if self.parent[x] != x:\n            self.parent[x] = self.find(self.parent[x])\n        return self.parent[x]\n\n    def union(self, a, b):\n        ra, rb = self.find(a), self.find(b)\n        if ra != rb:\n            self.parent[ra] = rb",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 190,
      content: [
        {
          type: "text",
          value:
            "Hold on before you move to output generation — no union by rank or size in there. Does that actually matter for this problem?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 206,
      content: [
        {
          type: "text",
          value:
            "It affects tree height without path compression, but I do have path compression, so chains get flattened the moment they're touched. Without union by size on top of that, a pathological input could still build a tall tree before the first find() flattens it — so it's not wrong, it's just not the tightest bound. Since M pairs is at most on the order of N here, I'd rather add it than argue it away.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 224,
      content: [{ type: "text", value: "Add it, quickly." }],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 238,
      content: [
        {
          type: "code",
          id: "code-dsu-rank",
          language: "diff",
          value:
            "  class DSU:\n      def __init__(self):\n          self.parent = {}\n+         self.size = {}\n\n      def union(self, a, b):\n          ra, rb = self.find(a), self.find(b)\n          if ra != rb:\n-             self.parent[ra] = rb\n+             self.size.setdefault(ra, 1)\n+             self.size.setdefault(rb, 1)\n+             if self.size[ra] < self.size[rb]:\n+                 ra, rb = rb, ra\n+             self.parent[rb] = ra\n+             self.size[ra] += self.size[rb]",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 255,
      content: [
        { type: "text", value: "Fine. Now — from union-find to the actual output list." },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 270,
      content: [
        {
          type: "text",
          value:
            "Union everything first, then group products by root, then take every pair of groups and cross-join their members.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 282,
      content: [
        {
          type: "text",
          value: "Before code — how do you get from 'root per product' to 'list of products per group' without scanning everything twice?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 298,
      content: [
        {
          type: "text",
          value:
            "One pass, bucket by find(x). I need every distinct product exactly once, so I'll track which ones I've already bucketed as I walk the input pairs.",
        },
        {
          type: "code",
          id: "code-groups",
          language: "python",
          value:
            "groups = defaultdict(list)\nseen = set()\nfor a, b in pairs:\n    for x in (a, b):\n        if x not in seen:\n            seen.add(x)\n            groups[dsu.find(x)].append(x)",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 315,
      content: [
        {
          type: "text",
          value: "Why the seen set — why not just bucket every key you find in dsu.parent?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 330,
      content: [
        {
          type: "text",
          value:
            "I could — parent's keys happen to appear in the same order I inserted them, which is the same order as the input pairs. But that's leaning on dict insertion order being preserved, which is language- and implementation-specific behavior, not something the algorithm should depend on. Walking the pairs directly and de-duping with a set gets the same result without relying on that guarantee.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 350,
      content: [{ type: "text", value: "Fair. Now the cross-join." }],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 365,
      content: [
        {
          type: "code",
          id: "code-cross-join",
          language: "python",
          value:
            "group_lists = list(groups.values())\nresult = []\nfor i in range(len(group_lists)):\n    for j in range(i + 1, len(group_lists)):\n        for x in group_lists[i]:\n            for y in group_lists[j]:\n                result.append((x, y))",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 382,
      content: [
        {
          type: "text",
          value: "What's the complexity of that last step, worst case?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 398,
      content: [
        {
          type: "text",
          value:
            "Union-find itself is close to O(M) for M input pairs. The cross-join is bounded by the number of valid output pairs, which in the worst case — every product its own singleton category — is every pair of N products, so O(N^2). That's not a flaw in the loop, it's the size of the answer itself; you can't return N-squared pairs in less than N-squared time.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 420,
      content: [
        {
          type: "text",
          value:
            "Which is exactly the problem I want to give you now. N is 10 million products, almost all singleton categories. You obviously can't materialize the full output. Instead: return K random valid cross-category pairs, uniformly sampled from the full valid set, without ever building that full set.",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 445,
      content: [
        {
          type: "text",
          value:
            "First instinct — pick two random distinct products, check find(a) != find(b), keep it if so, throw it away and repick if not. If most categories are singletons, almost every random pair already qualifies, so this converges fast.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 462,
      content: [
        {
          type: "text",
          value:
            "Fast in that case, sure. What if one category is huge — say half of all 10 million products are in one giant group, everything else singleton?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 480,
      content: [
        {
          type: "text",
          value:
            "Then a random pair lands inside that one group about a quarter of the time, so rejection sampling is still fine there — it's a constant-factor slowdown, not unbounded. Where it actually breaks is if that one group is, say, 99.9% of all products. Then almost every random pair gets rejected and I could spin for a long time per sample. I don't have a bound on the number of retries unless I bound the group sizes, and the problem didn't give me one.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 502,
      content: [
        { type: "text", value: "So give me something with a guaranteed cost per sample." },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 525,
      content: [
        {
          type: "text",
          value:
            "I want to pick a random index directly into the space of valid pairs, the same way you'd pick a random element out of a flattened 2D array without materializing it. If I sort the groups and, for each group, know how many total elements come from every group after it, then group i contributes size(i) times (everything after it) valid pairs, and none of those overlap with group j's contribution for j > i.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 545,
      content: [{ type: "text", value: "Keep going — how do you turn that into an actual sample?" }],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 560,
      content: [
        {
          type: "text",
          value:
            "Precompute a running suffix count — total products in all groups after group i — and multiply by size(i) to get group i's pair contribution. Prefix-sum those contributions across all groups once, up front.",
        },
        {
          type: "code",
          id: "code-prefix-contrib",
          language: "python",
          value:
            "suffix = 0\ncontrib = []\nfor g in reversed(group_lists):\n    contrib.append(len(g) * suffix)\n    suffix += len(g)\ncontrib.reverse()\nprefix = list(accumulate(contrib))  # prefix[i] = pairs using groups[0..i]",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 580,
      content: [
        { type: "text", value: "And per sample, at query time?" },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 600,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-binary-search-sample",
          type: "highlight",
          status: "strong",
          value:
            "pick a random integer in [0, prefix[-1]), binary search prefix to find which group's contribution range it falls in, then pick x uniformly from that group and y uniformly from the flattened tail of later groups",
          explanation:
            "Turns sampling from an unmaterialized O(N^2)-sized space into O(log G) work per sample after O(N) preprocessing — the prefix array lets any target index be mapped to a specific (group, offset) pair without ever enumerating the pairs it skips over.",
        },
        {
          type: "text",
          value:
            ". Binary search on the prefix array is O(log G) where G is the number of groups. Picking x within group i is O(1). Picking y from the concatenation of everything after group i needs the same trick one level down — another prefix-sum, this time over group sizes, so I can map an offset straight to a specific product without flattening the list. Both lookups are O(log G), so each of the K samples costs O(log G) after an O(N) one-time setup instead of O(N^2) to build the whole list.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 630,
      content: [
        {
          type: "text",
          value: "Does that sampling stay uniform, or does it favor smaller groups over the giant one?",
        },
      ],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 650,
      content: [
        {
          type: "text",
          value:
            "It stays uniform, because the index space itself was built proportional to contribution — the giant group's slice of the prefix array is exactly as wide as the number of valid pairs it actually participates in. A uniformly random index automatically lands in each group's range in proportion to that group's true share of all valid pairs. That's the whole point of building the prefix sums off of actual pair counts instead of off of group counts.",
        },
      ],
    },

    {
      id: "41",
      role: "takeaway",
      elapsedSeconds: 690,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the core problem is recognizing that 'same category' is a transitive relation, which makes it a connected-components problem, not a pairwise-comparison one — Union-Find with path compression (and union by size, since it costs almost nothing to add) computes every product's group in close to linear time instead of re-deriving connectivity per pair. Generating the actual cross-category list is bounded by the size of the answer itself, which can be quadratic in the worst case — that's inherent, not a bug. The scaling follow-up breaks the moment naive rejection sampling meets a single dominant category: instead of materializing or repeatedly resampling, building a prefix-sum over each group's true pair-contribution turns sampling into an O(log G) binary search per draw, with uniformity guaranteed because the index space is proportional to actual pair counts rather than group counts.",
        },
      ],
    },
  ],
};

const crossCategoryProductPairs: TranscriptEntry = {
  summary: {    id: 20,

    slug: "cross-category-product-pairs-union-find",
    title: "Cross-Category Product Recommendations, Then Sampling at Scale",
    category: "dsa",
    difficulty: Difficulty.MEDIUM,
    duration: 36,
    
    tags: [
      "Union-Find",
      "Disjoint Set",
      "Graphs",
      "Hash Map",
      "Sampling",
      "Binary Search",
      "Prefix Sums",
    ],
    description:
      "Coding interview on generating valid cross-category product recommendation pairs from a list of same-category pairs. Candidate rejects a naive per-pair connectivity search in favor of Union-Find with path compression and union by size, groups products by root while explicitly avoiding reliance on dict insertion-order behavior, and cross-joins groups to produce the output. Extends into an original scaling follow-up — sampling K uniformly random valid pairs from an unmaterializable, potentially quadratic space at 10 million products — moving from naive rejection sampling (and diagnosing exactly when it degrades under a dominant category) to a prefix-sum-and-binary-search scheme that samples in O(log G) per draw with guaranteed uniformity.",
  },

  transcript,
};

export default crossCategoryProductPairs;