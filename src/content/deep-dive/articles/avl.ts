import { DeepDiveArticle } from '@/features/deep-dive/types';
import { AVLTreeIllustration } from '@/content/deep-dive/illustrations/avl';

export const article: DeepDiveArticle = {
  slug: 'avl-tree',
  category: 'data-structures',
  readTime: '12 min',
  name: 'AVL Tree',
  eyebrow: 'BALANCED · SELF-HEALING',
  description: 'An AVL tree is a binary search tree that keeps itself balanced automatically. Every insertion or deletion triggers a rebalance check — if the tree gets lopsided, rotations fix it. It guarantees O(log n) search, insert, and delete, no matter what order data arrives in.',
  heroIllustration: AVLTreeIllustration,

  tags: ['Balanced BST', 'Self-balancing', 'Rotations'],
  credit: 'Invented by',
  creditOrg: 'Adelson-Velsky and Landis (1962)',
  docsUrl: 'https://en.wikipedia.org/wiki/AVL_tree',
  title: 'The AVL Tree: Why Balanced Beats Lucky',
  lede: 'A plain binary search tree is fast only if you get lucky — if data arrives already mixed up, a tree can collapse into a linked list. An AVL tree refuses to get sloppy. After every write, it checks if any subtree got too tall compared to its sibling, and if so, it rotates nodes to restore the balance. It costs a little work per write to buy the guarantee that searches will never degrade, no matter what order the data came in.',

  sections: [
    {
      number: 1,
      title: 'The problem: BSTs can break',
      content: [
        [
          { type: 'text', text: 'A binary search tree only stays fast if it\'s roughly balanced. Insert 1, 2, 3, 4, 5 in order into a vanilla BST and you don\'t get a tree — you get a linked list. Search for 5? You touch all five nodes. The O(log n) guarantee vanishes.' }
        ],
        [
          { type: 'text', text: 'An AVL tree refuses to let this happen. It watches the height of every subtree, and if one side ever grows two levels taller than the other, it rotates nodes around to bring them back in line. The tree heals itself automatically.' }
        ]
      ],
      illustrations: {
        component: 'AVLTreeCollapseIllustration',
        caption: 'A plain BST degrades into a list with sorted inserts; an AVL tree rotates to stay balanced',
        width: 'full'
      }
    },

    {
      number: 2,
      title: 'Balance: the height invariant',
      content: [
        [
          { type: 'text', text: 'The rule is simple: for every node, the height of its left subtree and right subtree can differ by at most 1. That\'s it. That one constraint is what forces the tree to stay balanced.' }
        ],
        [
          { type: 'text', text: 'Every node stores its height (or calculates it on-the-fly). After an insert or delete, walk back up the tree toward the root. At each node, check: does the height difference violate the invariant? If yes, rotate. If no, keep walking up.' }
        ]
      ],
      code: {
        language: 'typescript',
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
}`
      }
    },

    {
      number: 3,
      title: 'Rotations: the rebalancing weapon',
      content: [
        [
          { type: 'text', text: 'When a node\'s balance factor goes out of bounds (< -1 or > 1), the tree rotates. A rotation is a small, local restructuring that preserves BST order while moving tall subtrees closer to the root.' }
        ],
        [
          { type: 'text', text: 'There are four cases, each fixed by one or two rotations:' }
        ],
        [
          { type: 'text', text: 'Left-Left (LL): right subtree is too tall and leans right → single left rotation'}
        ],
        [
          { type: 'text', text: 'Right-Right (RR): left subtree is too tall and leans left → single right rotation'}
        ],
        [
          { type: 'text', text: 'Left-Right (LR): left subtree is too tall but leans right → left rotation, then right rotation' }
        ],
        [
          { type: 'text', text: 'Right-Left (RL): right subtree is too tall but leans left → right rotation, then left rotation'}
        ]
      ],
      illustration: {
        component: 'AVLRotationIllustration',
        caption: 'Single and double rotations restore balance without breaking BST order',
        width: 'full'
      },
      code: {
        language: 'typescript',
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
}`
      }
    },

    {
      number: 4,
      title: 'Insert: write, rebalance, propagate',
      content: [
        [
          { type: 'text', text: 'Insertion is plain BST insertion — put the new node in its sorted position. Then walk back up the tree. At each ancestor, update its height and check the balance factor. If it\'s violated, rotate locally and keep walking.' }
        ],
        [
          { type: 'text', text: 'The key insight: one insertion can trigger at most one rebalance operation. After a single rotation fixes a violation, all ancestors above it are automatically balanced again. You don\'t cascade rotations — you cascade height updates, but at most one rotation per insertion.' }
        ]
      ],
      illustration: {
        component: 'AVLInsertIllustration',
        caption: 'Insert at a leaf, update heights climbing up, rotate once if needed, done',
        width: 'full'
      }
    },

    {
      number: 5,
      title: 'Delete: messier, same principle',
      content: [
        [
          { type: 'text', text: 'Deletion starts like a BST: if the node has two children, swap it with its in-order successor, then delete the successor (which has at most one child). Then, like insert, walk back up and rebalance.' }
        ],
        [
          { type: 'text', text: 'The difference: a deletion can leave the tree less tall than it was before, which might rebalance a node that wasn\'t imbalanced before. So you keep checking and rotating all the way to the root, not just until the first rotation.' }
        ]
      ],
      code: {
        language: 'typescript',
        code: `function delete(node: AVLNode | null, value: number): AVLNode | null {
  if (!node) return null;
  
  if (value < node.value) {
    node.left = delete(node.left, value);
  } else if (value > node.value) {
    node.right = delete(node.right, value);
  } else {
    // Found the node to delete
    if (!node.left) return node.right;
    if (!node.right) return node.left;
    
    // Two children: find in-order successor, swap, recurse
    const minRight = findMin(node.right);
    node.value = minRight.value;
    node.right = delete(node.right, minRight.value);
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
}`
      }
    },

    {
      number: 6,
      title: 'Cost: O(log n) search, O(log n) write',
      content: [
        [
          { type: 'text', text: 'An AVL tree guarantees that the height is always O(log n) — more precisely, at most 1.44 × log₂(n). That means search is O(log n) always, no unlucky orderings.' }
        ],
        [
          { type: 'text', text: 'Insert and delete are also O(log n): walk to the insertion point (O(log n)), rebalance on the way back up (O(log n) rotations, each O(1)). The tree never gets out of hand.' }
        ],
        [
          { type: 'text', text: 'The trade-off: every write does work to maintain balance. A plain BST with lucky input can be faster than an AVL tree — you pay per write to guarantee fast reads. But the read guarantee is bulletproof.' }
        ]
      ],
      callout: {
        label: 'In practice',
        content: [
          [
            { type: 'text', text: 'AVL trees are ' },
            { type: 'text', text: 'stricter about balance than red-black trees', bold: true },
            { type: 'text', text: ', which allows fewer rotations per write. If reads vastly outnumber writes, AVL is better. If writes are frequent, red-black or other variants might be faster. But AVL guarantees are rock-solid.' }
          ]
        ]
      }
    },

    {
      number: 7,
      title: 'Where AVL trees live today',
      content: [
        [
          { type: 'text', text: 'AVL trees are less common than they used to be. Most production systems use ' },
          { type: 'text', text: 'red-black trees', bold: true },
          { type: 'text', text: ' (which relax the balance invariant slightly to reduce rotation overhead) or ' },
          { type: 'text', text: 'B-trees', bold: true },
          { type: 'text', text: ' (which optimize for disk I/O by storing multiple keys per node).' }
        ],
        [
          { type: 'text', text: 'But AVL trees still show up in competitive programming, in-memory databases that don\'t fit on disk, and anywhere the simplicity of a strict balance guarantee is worth the extra rotation cost.' }
        ]
      ]
    }
  ],

  tradeoffs: {
    strengths: [
      'Search, insert, delete are guaranteed O(log n) with a strict height bound',
      'No worst-case degradation — tree cannot collapse into a list no matter what order data arrives',
      'Simpler balance invariant than red-black trees (easier to reason about, easier to verify)',
      'Read-heavy workloads where few writes pay for many fast searches'
    ],
    weaknesses: [
      'More rotations per insert/delete than red-black trees (stricter balance costs)',
      'Height overhead compared to red-black (taller trees for the same number of nodes)',
      'Not optimal for disk-based systems (B-trees handle page-size awareness better)',
      'Overkill for small datasets where O(log n) overhead isn\'t the bottleneck'
    ]
  },

  related: [
    {
      name: 'Red-Black Tree',
      description: 'A relaxed alternative that rotates less often at the cost of height flexibility',
      slug: 'red-black-tree'
    },
    {
      name: 'B-Tree',
      description: 'Designed for disk I/O, stores multiple keys per node',
      slug: 'b-tree'
    },
    {
      name: 'Binary Search Tree',
      description: 'The unbalanced foundation AVL improves upon',
      slug: 'binary-search-tree'
    }
  ]
};