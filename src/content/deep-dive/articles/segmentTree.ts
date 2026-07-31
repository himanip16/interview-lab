// src/content/deep-dive/articles/segment-tree.ts

import type { DeepDiveArticle } from "@/features/deep-dive/types";

export const article: DeepDiveArticle = {
  metadata: {
    slug: "segment-tree",
    name: "Segment Tree",
    eyebrow: "RANGE QUERIES · DIVIDE & CONQUER",
    description:
      "A segment tree answers range questions — sum, min, max, gcd, anything associative — over a shifting array in O(log n), and lets you update a single element in O(log n) too. It's the structure you reach for the moment prefix sums stop being enough.",
    category: "data-structures",
    tags: ["Range Queries", "Divide and Conquer", "Binary Tree"],

    // Publishing & Operations
    published: true,
    draft: false,
    version: "1.0.0",
    publishedAt: "2026-07-31",
    updatedAt: "2026-07-31",

    // Metrics & Attribution
    estimatedReadingMinutes: 12,
    credit: "Formalized in",
    creditOrg: "computational geometry & competitive programming",
    docsUrl: "https://en.wikipedia.org/wiki/Segment_tree",

    // Discovery & Search Graph
    keywords: [
      "Segment Tree",
      "Range Query",
      "Range Sum Query",
      "Point Update",
      "Lazy Propagation",
      "Divide and Conquer",
    ],
    aliases: ["Statistic Tree", "Interval Tree (Segment variant)"],
    learningObjectives: [
      "Understand why naive scans and plain prefix sums both fail once updates enter the picture",
      "Build a segment tree bottom-up from an array in O(n)",
      "Answer any range query in O(log n) by combining a small set of precomputed segments",
      "Update a single element in O(log n) by only touching the path from leaf to root",
      "Compare segment trees against Fenwick trees (BIT) and sparse tables",
    ],
    difficulty: {
      level: 3,
      prerequisites: ["arrays-basics", "recursion-basics"],
    },
  },

  heroDiagram: {
    type: "diagram",
    renderEngine: "component",
    componentName: "SegmentTreeIllustration",
    caption: "An array decomposed into overlapping ranges, each cached at a tree node",
    alt: "Diagram showing an array split recursively into a binary tree of range sums",
    width: "full",
  },

  lede: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Say you're given an array of a million numbers, and you need to answer two things, over and over, in whatever order they come in: \"what's the sum of elements 10,000 to 500,000?\" and \"element 42 just changed, update it.\" Do either one fast and the other one gets slow. Precompute your way to fast queries, and a single update forces you to redo all that work. Skip the precomputing, and every query means walking half the array.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "A segment tree refuses to pick a side. It precomputes — but only in overlapping chunks, arranged as a tree — so that any range query can be answered by combining a handful of chunks, and any update only has to fix the chunks that actually contain the changed element. Both operations land at O(log n), even when queries and updates are interleaved forever.",
        },
      ],
    },
  ],

  sections: [
    {
      id: "range-query-problem",
      number: 1,
      title: "Wait — why can't we just precompute the sums?",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The obvious approach to \"sum of elements i to j\" is to just walk the array and add them up. That's O(n) per query. Ask a thousand range-sum questions on a million-element array and you've done a billion additions. Too slow.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "So you precompute. A prefix-sum array — where each slot holds the running total up to that index — turns any range sum into a single subtraction: O(1) per query. Problem solved... until element 42 changes. Now every prefix sum from index 42 onward is wrong, and fixing them means walking the rest of the array again. You've traded a slow query for a slow update.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "That's the trap: fast reads and fast writes seem to be in direct tension, and neither the naive scan nor the prefix-sum array escapes it.",
            },
          ],
        },
        {
          type: "diagram",
          renderEngine: "component",
          componentName: "SegmentTreePrefixSumComparisonIllustration",
          caption:
            "A prefix-sum array answers queries instantly but rebuilds on every update; a segment tree does neither extreme",
          alt: "Comparison showing a prefix sum array needing a full rebuild after one update, next to a segment tree needing only a path update",
          width: "full",
        },
      ],
    },

    {
      id: "the-idea",
      number: 2,
      title: "So what if you only precomputed some of the sums?",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Here's the idea a segment tree runs with: instead of precomputing every possible range, precompute a much smaller set of ranges — chosen so that any range you'll ever be asked about can be built by combining just a few of them.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Split the array in half. Store the sum of the whole array at the root. Recurse on each half, storing the sum of each half at its own node. Keep splitting until each piece is a single element. What you get is a binary tree, exactly log₂(n) levels deep, where every node caches the sum of a contiguous chunk of the original array.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Nothing here is specific to sums, either — the same tree works for minimum, maximum, gcd, or anything else where combining two answers is a fast, well-defined operation.",
            },
          ],
        },
        {
          type: "code",
          language: "typescript",
          title: "Building the Tree",
          code: `// Array-based segment tree: node i's children are at 2i and 2i+1.
// A tree of size 4n is always enough room for n leaves.

class SegmentTree {
  private tree: number[];
  private n: number;

  constructor(private input: number[]) {
    this.n = input.length;
    this.tree = new Array(4 * this.n).fill(0);
    this.build(1, 0, this.n - 1);
  }

  private build(node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = this.input[start];
      return;
    }
    const mid = Math.floor((start + end) / 2);
    this.build(2 * node, start, mid);
    this.build(2 * node + 1, mid + 1, end);
    this.tree[node] = this.tree[2 * node] + this.tree[2 * node + 1];
  }
}`,
        },
      ],
    },

    {
      id: "range-query-mechanics",
      number: 3,
      title: "How do you answer any range from just a few precomputed pieces?",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Say you want the sum from index 10,000 to 500,000. Almost certainly, no single node in the tree covers exactly that range. So the query walks down from the root and, at each node, asks one of three questions: does this node's range sit completely inside what I want (use its cached sum, stop descending), completely outside it (ignore it entirely, stop descending), or does it straddle the edge (split it — recurse into both children)?",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The reason this stays fast is that only the nodes near the two edges of your query range ever get split. Once a node's range falls fully inside or fully outside what you asked for, the recursion stops there. That caps the number of nodes actually visited at O(log n), regardless of how wide the range is.",
            },
          ],
        },
        {
          type: "diagram",
          renderEngine: "component",
          componentName: "SegmentTreeQueryIllustration",
          caption:
            "A range query only descends where the query boundary splits a node's range",
          alt: "Diagram showing a segment tree query descending only into partially-overlapping nodes and stopping at fully-contained ones",
          width: "full",
        },
        {
          type: "code",
          language: "typescript",
          title: "Range Sum Query",
          code: `function query(
  tree: number[],
  node: number,
  start: number,
  end: number,
  left: number,
  right: number
): number {
  if (right < start || end < left) return 0;          // fully outside
  if (left <= start && end <= right) return tree[node]; // fully inside

  // straddles the boundary — split and combine
  const mid = Math.floor((start + end) / 2);
  const leftSum = query(tree, 2 * node, start, mid, left, right);
  const rightSum = query(tree, 2 * node + 1, mid + 1, end, left, right);
  return leftSum + rightSum;
}`,
        },
      ],
    },

    {
      id: "point-update",
      number: 4,
      title: "Update: why changing one element doesn't mean recomputing everything",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Every element in the array corresponds to exactly one leaf. And every node above that leaf — all the way up to the root — is a cached sum that includes it. That's the whole path from that one leaf to the root: exactly log₂(n) nodes.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "So an update walks down to the right leaf, changes it, then walks back up recomputing each ancestor's sum from its two children. Every other node in the tree — the ones off that single path — never even gets touched, because the element that changed was never part of their range in the first place.",
            },
          ],
        },
        {
          type: "code",
          language: "typescript",
          title: "Point Update",
          code: `function update(
  tree: number[],
  node: number,
  start: number,
  end: number,
  index: number,
  value: number
): void {
  if (start === end) {
    tree[node] = value;
    return;
  }

  const mid = Math.floor((start + end) / 2);
  if (index <= mid) {
    update(tree, 2 * node, start, mid, index, value);
  } else {
    update(tree, 2 * node + 1, mid + 1, end, index, value);
  }

  // Recompute this node from its (now up-to-date) children
  tree[node] = tree[2 * node] + tree[2 * node + 1];
}`,
        },
      ],
    },

    {
      id: "cost-analysis",
      number: 5,
      title: "So was building all this extra structure worth it?",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Building the tree costs O(n) up front — you touch every node once. After that, every range query is O(log n): only the nodes along the two boundary paths of the range get visited. Every point update is O(log n) too: only the one leaf-to-root path gets touched.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "That's the whole trade against the prefix-sum array: you give up the O(1) query in exchange for making updates O(log n) instead of O(n). For a workload with even a moderate number of updates mixed into your queries, that trade wins decisively.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The cost you do pay is space: a segment tree typically uses about 4n storage for n elements, versus n for a plain array or a prefix-sum array. You're renting extra memory to buy speed on both ends.",
            },
          ],
        },
        {
          type: "callout",
          variant: "note",
          label: "In practice",
          title: "Range updates need one more trick",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Everything above covers point updates — changing a single element. Updating an entire ",
                },
                {
                  type: "bold",
                  text: "range",
                },
                {
                  type: "text",
                  text: " at once (\"add 5 to every element from index 100 to 900\") naively costs O(n), the same trap as before. The fix is ",
                },
                {
                  type: "bold",
                  text: "lazy propagation",
                },
                {
                  type: "text",
                  text: ": defer an update at a node instead of pushing it down immediately, and only resolve it when a later query actually needs to descend past that node.",
                },
              ],
            },
          ],
        },
      ],
    },

    {
      id: "real-world-usage",
      number: 6,
      title: "If it's this good, why haven't you heard of it outside contests?",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "For the specific case of range sums with point updates, most people reach for a ",
            },
            {
              type: "bold",
              text: "Fenwick tree",
            },
            {
              type: "text",
              text: " (binary indexed tree) instead — it does the same O(log n) query and update with a much smaller, simpler array-only implementation. If all you need is sums, a Fenwick tree is usually the better default.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "A segment tree earns its keep once you need more than plain sums: range minimum or maximum, gcd, custom associative combinations, or range updates via lazy propagation — none of which a Fenwick tree handles as naturally. That's why it shows up constantly in competitive programming and computational geometry, but less often in typical application code, where a database index or a simpler running aggregate usually covers what's needed.",
            },
          ],
        },
        {
          type: "tradeoff",
          title: "Segment Tree Architectural Trade-offs",
          description: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Choosing a segment tree over its alternatives is mostly about how general the range operation needs to be, and how static the data is.",
                },
              ],
            },
          ],
          sides: [
            {
              name: "Segment Tree Advantages",
              pros: [
                "Handles any associative range operation: sum, min, max, gcd, and more",
                "Extends to range updates in O(log n) via lazy propagation",
                "O(log n) worst-case for both queries and updates, with no unlucky orderings",
              ],
              cons: [
                "Roughly 4n memory overhead versus a plain array",
                "More code and more edge cases than a Fenwick tree for the sum-only case",
              ],
            },
            {
              name: "Alternatives (Fenwick Tree / Sparse Table)",
              pros: [
                "Fenwick trees are far simpler and faster in practice for prefix-sum-style queries",
                "Sparse tables answer static range-min/max queries in O(1) after O(n log n) preprocessing",
              ],
              cons: [
                "Fenwick trees are limited to invertible operations like sum, not min/max or gcd",
                "Sparse tables can't handle updates at all — any change forces a full rebuild",
              ],
            },
          ],
          verdict: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Use a Fenwick tree for straightforward prefix-sum workloads. Reach for a segment tree when you need min/max/gcd-style queries, range updates, or both. Use a sparse table only when the data never changes and you want O(1) queries.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  resources: [
    {
      type: "article",
      title: "Fenwick Tree (Binary Indexed Tree)",
      description:
        "A leaner alternative for prefix-sum-style range queries, at the cost of generality.",
      url: "/deep-dive/fenwick-tree",
      slug: "fenwick-tree",
      relationship: "similar",
    },
    {
      type: "article",
      title: "Sparse Table",
      description:
        "O(1) range-min/max queries on static data, with no support for updates.",
      url: "/deep-dive/sparse-table",
      slug: "sparse-table",
      relationship: "contrast",
    },
    {
      type: "article",
      title: "Prefix Sum Array",
      description:
        "The O(1)-query, O(n)-update idea that segment trees generalize past its breaking point.",
      url: "/deep-dive/prefix-sum",
      slug: "prefix-sum",
      relationship: "prerequisite",
    },
  ],
};