// src/content/deep-dive/articles/avl.ts

import type { DeepDiveArticle } from "@/features/deep-dive/types";

export const article: DeepDiveArticle = {
  metadata: {
    slug: "avl-tree",
    name: "AVL Tree",
    eyebrow: "BALANCED · SELF-HEALING",
    description:
      "An AVL tree is a binary search tree that keeps itself balanced automatically. Every insertion or deletion triggers a rebalance check — if the tree gets lopsided, rotations fix it. It guarantees O(log n) search, insert, and delete, no matter what order data arrives in.",
    category: "data-structures",
    tags: ["Balanced BST", "Self-balancing", "Rotations"],

    // Publishing & Operations
    published: true,
    draft: false,
    version: "1.1.0",
    publishedAt: "2026-02-10",
    updatedAt: "2026-07-31",

    // Metrics & Attribution
    estimatedReadingMinutes: 12,
    credit: "Invented by",
    creditOrg: "Adelson-Velsky and Landis (1962)",
    docsUrl: "https://en.wikipedia.org/wiki/AVL_tree",

    // Discovery & Search Graph
    keywords: [
      "AVL Tree",
      "Binary Search Tree",
      "Tree Rotation",
      "Balance Factor",
      "Height-Balanced Tree",
      "Self-Balancing BST",
    ],
    aliases: ["Adelson-Velsky and Landis Tree", "Height-Balanced BST"],
    learningObjectives: [
      "Understand why naive binary search trees degenerate into O(n) linked lists",
      "Calculate the balance factor of a tree node based on subtree heights",
      "Execute single (LL, RR) and double (LR, RL) tree rotations to restore balance",
      "Analyze the asymptotic cost trade-offs between AVL trees and Red-Black trees",
    ],
    difficulty: {
      level: 3,
      prerequisites: ["binary-search-tree", "recursion-basics"],
    },
  },

  heroDiagram: {
    type: "diagram",
    renderEngine: "component",
    componentName: "AVLTreeIllustration",
    caption: "Self-healing AVL tree rebalancing through node rotation",
    alt: "Diagram showing an unbalanced binary search tree rotating into a balanced AVL tree",
    width: "full",
  },

  lede: [
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Imagine you built a search system that flew through every test. Then one day, production data arrives already sorted — and suddenly your O(log n) lookup crawls at O(n). Nothing crashed. No error was thrown. The tree just quietly turned into a linked list.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "That's the trap a plain binary search tree can't escape: it's only fast if you get lucky with the order data arrives in. An AVL tree refuses to leave that to luck. After every write, it checks whether any subtree has gotten too tall next to its sibling — and if it has, it rotates nodes until the tree is level again. A little extra work on every write buys a guarantee that reads never degrade, no matter what order the data came in.",
        },
      ],
    },
  ],

  sections: [
    {
      id: "bst-collapse",
      number: 1,
      title: "Wait — how does a tree become a linked list?",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "A binary search tree only stays fast if it's roughly balanced. Insert 1, 2, 3, 4, 5 in that order into a vanilla BST and you don't get a tree — every new value is larger than the last, so each one hangs off the right side of the one before it. You get a straight line. Search for 5? You touch all five nodes on the way down. The O(log n) guarantee is gone, and nothing in the code ever told you it happened.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "An AVL tree is built to make that failure mode impossible. It watches the height of every subtree, and the moment one side grows two levels taller than the other, it rotates nodes around to bring them back in line. The tree heals itself — automatically, on every single write.",
            },
          ],
        },
        {
          type: "diagram",
          renderEngine: "component",
          componentName: "AVLTreeCollapseIllustration",
          caption:
            "A plain BST degrades into a list with sorted inserts; an AVL tree rotates to stay balanced",
          alt: "Comparison showing a degenerated linear BST next to a balanced AVL tree structure",
          width: "full",
        },
      ],
    },

    {
      id: "height-invariant",
      number: 2,
      title: "So how does it know when a tree is going bad?",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "It doesn't need to inspect the whole tree. It measures one thing, locally, at every node: the difference in height between that node's left side and its right side. If one side is ever more than one level taller than the other, AVL calls the tree broken at that point — and something has to give.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "That single rule — left and right heights can differ by at most 1, everywhere in the tree — is the whole invariant. It sounds almost too simple to prevent the collapse from the last section, but enforcing it at every node is exactly what keeps any subtree from running away in height.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "In practice, every node caches its own height so the check is instant. After an insert or delete, you walk back up toward the root. At each node: is the height difference too big? If yes, rotate. If no, keep climbing.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "As code, the check is just arithmetic:",
            },
          ],
        },
        {
          type: "code",
          language: "typescript",
          title: "Balance Factor Calculation",
          code: `// Balance factor at a node = height of left subtree - height of right subtree
// AVL invariant: balance factor must be -1, 0, or +1

interface AVLNode {
  value: number;
  left: AVLNode | null;
  right: AVLNode | null;
  height: number;  // cached for O(1) balance checks
}

function balanceFactor(node: AVLNode | null): number {
  if (!node) return 0;
  const leftHeight = node.left?.height ?? 0;
  const rightHeight = node.right?.height ?? 0;
  return leftHeight - rightHeight;
}

function isBalanced(node: AVLNode | null): boolean {
  if (!node) return true;
  const bf = balanceFactor(node);
  return bf >= -1 && bf <= 1;
}`,
        },
      ],
    },

    {
      id: "rotations",
      number: 3,
      title: "How do you fix a tree without breaking its order?",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Here's the part that seems like it shouldn't work: when a node's balance goes bad, AVL doesn't rebuild anything. It doesn't re-sort. It just grabs a small handful of nodes near the problem and re-links them — a rotation. And somehow, after that local shuffle, the tree is still in perfect sorted order and is balanced again.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The trick is that a rotation never moves a node to a place that would violate BST ordering — it just changes who's whose parent among a few nodes that were already sitting next to each other. There are exactly four situations this can happen in, depending on which side is too tall and which way it leans:",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "bold",
              text: "Left-Left (LL): ",
            },
            {
              type: "text",
              text: "right subtree is too tall and leans right → single left rotation",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "bold",
              text: "Right-Right (RR): ",
            },
            {
              type: "text",
              text: "left subtree is too tall and leans left → single right rotation",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "bold",
              text: "Left-Right (LR): ",
            },
            {
              type: "text",
              text: "left subtree is too tall but leans right → left rotation, then right rotation",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "bold",
              text: "Right-Left (RL): ",
            },
            {
              type: "text",
              text: "right subtree is too tall but leans left → right rotation, then left rotation",
            },
          ],
        },
        {
          type: "diagram",
          renderEngine: "component",
          componentName: "AVLRotationIllustration",
          caption:
            "Single and double rotations restore balance without breaking BST order",
          alt: "Diagram illustrating Left-Left, Right-Right, Left-Right, and Right-Left rotations",
          width: "full",
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Strip away the four-case naming and a single rotation is really just three pointer changes: a node hands off one of its children to its parent, and swaps places with it. That's the whole repair. Here's what it looks like in code:",
            },
          ],
        },
        {
          type: "code",
          language: "typescript",
          title: "Rotation Implementation",
          code: `// Left rotation: root moves down-right, left child becomes new root
//     C              B
//    / \\            / \\
//   B   D    →     A   C
//  / \\              \\   \\
// A   X              X   D

function rotateRight(node: AVLNode): AVLNode {
  const newRoot = node.left!;
  node.left = newRoot.right;
  newRoot.right = node;
  node.height = 1 + Math.max(
    node.left?.height ?? 0,
    node.right?.height ?? 0
  );
  newRoot.height = 1 + Math.max(
    newRoot.left?.height ?? 0,
    newRoot.right?.height ?? 0
  );
  return newRoot;
}

// Rebalance after insert: check balance, apply rotations as needed
function rebalance(node: AVLNode | null): AVLNode | null {
  if (!node) return null;
  
  const bf = balanceFactor(node);
  
  // Left-heavy
  if (bf > 1) {
    if (balanceFactor(node.left) < 0) {
      node.left = rotateLeft(node.left!);  // LR case
    }
    return rotateRight(node);  // LL case
  }
  
  // Right-heavy
  if (bf < -1) {
    if (balanceFactor(node.right) > 0) {
      node.right = rotateRight(node.right!);  // RL case
    }
    return rotateLeft(node);  // RR case
  }
  
  return node;
}`,
        },
      ],
    },

    {
      id: "insert-operation",
      number: 4,
      title: "Insert: does one fix really settle the whole tree?",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Insertion starts out completely ordinary — put the new node in its sorted position, exactly like a plain BST would. The interesting part happens on the way back out: you walk back up toward the root, and at every ancestor you update its cached height and check the balance factor.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Here's the surprising guarantee: a single insertion can trigger at most one rotation, ever. Once that one rotation fixes the first violation it finds on the way up, every node above it is automatically back in balance too. You still climb the whole path updating heights, but you never chain rotation after rotation after a single insert.",
            },
          ],
        },
        {
          type: "diagram",
          renderEngine: "component",
          componentName: "AVLInsertIllustration",
          caption:
            "Insert at a leaf, update heights climbing up, rotate once if needed, done",
          alt: "Flowchart depicting leaf node insertion followed by parent height updates and rotation",
          width: "full",
        },
      ],
    },

    {
      id: "delete-operation",
      number: 5,
      title: "Delete: why one fix isn't enough this time",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Deletion starts like a BST too: if the node has two children, swap it with its in-order successor, then delete the successor instead (which has at most one child of its own). Then, just like insert, you walk back up and rebalance.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "But deletion breaks the tidy \"one rotation and you're done\" guarantee from insertion. Removing a node can shrink a subtree's height, which can throw off the balance of a node further up that was perfectly fine before — even one that's nowhere near where you deleted. So on delete, you keep checking and rotating all the way to the root, not just until the first fix.",
            },
          ],
        },
        {
          type: "code",
          language: "typescript",
          title: "Deletion with Cascading Rebalance",
          code: `function deleteNode(node: AVLNode | null, value: number): AVLNode | null {
  if (!node) return null;
  
  if (value < node.value) {
    node.left = deleteNode(node.left, value);
  } else if (value > node.value) {
    node.right = deleteNode(node.right, value);
  } else {
    // Found the node to delete
    if (!node.left) return node.right;
    if (!node.right) return node.left;
    
    // Two children: find in-order successor, swap, recurse
    const minRight = findMin(node.right);
    node.value = minRight.value;
    node.right = deleteNode(node.right, minRight.value);
  }
  
  // Update height and rebalance
  if (node) {
    node.height = 1 + Math.max(
      node.left?.height ?? 0,
      node.right?.height ?? 0
    );
    node = rebalance(node);  // May rotate multiple times on way up
  }
  
  return node;
}`,
        },
      ],
    },

    {
      id: "cost-analysis",
      number: 6,
      title: "So was all that rotating worth it?",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Here's the payoff: an AVL tree guarantees its height is always O(log n) — more precisely, at most 1.44 × log₂(n). Search is O(log n), always. Not \"usually,\" not \"unless the input arrives sorted\" — always.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Insert and delete are O(log n) too: walk to the insertion point (O(log n)), rebalance on the way back up (O(log n) rotations, each one O(1) work). The tree never gets a chance to get out of hand.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "The trade-off is real, though: every write does extra work to maintain that balance. A plain BST with lucky input can outrun an AVL tree on writes — you're paying per write to buy a bulletproof guarantee on reads.",
            },
          ],
        },
        {
          type: "callout",
          variant: "note",
          label: "In practice",
          title: "AVL vs Red-Black Trees",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "AVL trees are ",
                },
                {
                  type: "bold",
                  text: "stricter about balance than red-black trees",
                },
                {
                  type: "text",
                  text: ", which allows fewer rotations per write. If reads vastly outnumber writes, AVL is better. If writes are frequent, red-black or other variants might be faster. But AVL guarantees are rock-solid.",
                },
              ],
            },
          ],
        },
      ],
    },

    {
      id: "real-world-usage",
      number: 7,
      title: "If it's this good, why haven't you heard of it in production?",
      blocks: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "AVL trees are less common than they used to be. Most production systems reach for ",
            },
            {
              type: "bold",
              text: "red-black trees",
            },
            {
              type: "text",
              text: " instead — they relax the balance invariant slightly, which trades a bit of read speed for far fewer rotations on writes — or ",
            },
            {
              type: "bold",
              text: "B-trees",
            },
            {
              type: "text",
              text: ", which are built around disk I/O by packing multiple keys into each node.",
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "But AVL trees haven't disappeared. They still show up in competitive programming, in in-memory databases small enough to never touch disk, and anywhere the simplicity of a strict, easy-to-verify balance guarantee is worth paying for in extra rotations.",
            },
          ],
        },
        {
          type: "tradeoff",
          title: "AVL Tree Architectural Trade-offs",
          description: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Evaluating AVL trees against other balanced search structures involves balancing search performance against rotation overhead.",
                },
              ],
            },
          ],
          sides: [
            {
              name: "AVL Tree Advantages",
              pros: [
                "Strict height limit (1.44 log n) yields faster lookup performance than Red-Black trees",
                "Guaranteed O(log n) worst-case time complexity across search, insert, and delete",
                "Straightforward balance factor rules make correctness easier to verify",
              ],
              cons: [
                "Stricter balance requires more frequent rotations during insertion and deletion",
                "Higher memory footprint per node to track height metadata",
              ],
            },
            {
              name: "Alternatives (Red-Black / B-Trees)",
              pros: [
                "Red-Black trees require fewer rotations on writes, making write-heavy workloads faster",
                "B-Trees optimize for page cache locality and disk block I/O",
              ],
              cons: [
                "Slightly taller trees on average can lead to slightly slower read times",
                "Significantly more complex rebalancing cases (e.g., Red-Black tree color flips and double rotations)",
              ],
            },
          ],
          verdict: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Choose AVL trees when read throughput significantly exceeds write operations. For general-purpose write-heavy workloads, prefer Red-Black trees; for secondary storage or database indexing, prefer B-Trees.",
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
      title: "Red-Black Tree",
      description:
        "A relaxed alternative that rotates less often at the cost of height flexibility.",
      url: "/deep-dive/red-black-tree",
      slug: "red-black-tree",
      relationship: "similar",
    },
    {
      type: "article",
      title: "B-Tree",
      description:
        "Designed for disk I/O, storing multiple keys per node to optimize page size reads.",
      url: "/deep-dive/b-tree",
      slug: "b-tree",
      relationship: "contrast",
    },
    {
      type: "article",
      title: "Binary Search Tree",
      description:
        "The unbalanced foundation that AVL trees enhance through automatic rotation.",
      url: "/deep-dive/binary-search-tree",
      slug: "binary-search-tree",
      relationship: "prerequisite",
    },
  ],
};