// src/content/deep-dive/articles/traversal.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Passive reference entries surfaced via ConceptReferenceBlock —
 * the prose never depends on the reader opening them.
 */
const glossary: Record<string, Concept> = {
  linearScan: {
    id: 'linearScan',
    term: 'Linear Scan',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Visiting elements one at a time in order, left to right. The default traversal — but it only ever tells you about what came before the current position.'
          }
        ]
      }
    ],
    examples: [
      'for i in range(len(nums)): ...'
    ],
    relatedConceptIds: ['reverseTraversal']
  },
  reverseTraversal: {
    id: 'reverseTraversal',
    term: 'Reverse Traversal',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Scanning right to left instead of left to right — the only way to know, at each position, what comes after it rather than before it.'
          }
        ]
      }
    ],
    examples: [
      'for i in range(len(nums) - 1, -1, -1): ...'
    ],
    relatedConceptIds: ['linearScan', 'simultaneousTraversal']
  },
  simultaneousTraversal: {
    id: 'simultaneousTraversal',
    term: 'Simultaneous Forward & Backward Traversal',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Running a forward pass and a backward pass at the same time, one pointer closing in from each side, so you always have both "what came before" and "what comes after" without storing either as a full array.'
          }
        ]
      }
    ],
    examples: [
      'left and right pointers both moving toward the middle in a single loop'
    ],
    relatedConceptIds: ['linearScan', 'reverseTraversal']
  },
  matrixTraversal: {
    id: 'matrixTraversal',
    term: 'Matrix Traversal',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'The same left-to-right scanning idea, extended to two dimensions — a nested loop over rows and columns instead of a single index.'
          }
        ]
      }
    ],
    examples: [
      'for row in range(rows): for col in range(cols): ...'
    ],
    relatedConceptIds: ['spiralTraversal', 'diagonalTraversal', 'zigzagTraversal']
  },
  spiralTraversal: {
    id: 'spiralTraversal',
    term: 'Spiral Traversal',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Reading a matrix by peeling off its outer ring — right along the top, down the right side, left along the bottom, up the left side — then repeating on the next ring in.'
          }
        ]
      }
    ],
    examples: [
      'top, bottom, left, right boundaries shrinking inward one ring at a time'
    ],
    relatedConceptIds: ['matrixTraversal']
  },
  diagonalTraversal: {
    id: 'diagonalTraversal',
    term: 'Diagonal Traversal',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Reading a matrix diagonal by diagonal — every cell along a diagonal shares the same (row + col), which is what makes the diagonals easy to group.'
          }
        ]
      }
    ],
    examples: [
      'All cells where row + col == 3 belong to the same diagonal'
    ],
    relatedConceptIds: ['matrixTraversal']
  },
  zigzagTraversal: {
    id: 'zigzagTraversal',
    term: 'Zigzag Traversal',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Reading a matrix row by row, but flipping direction on alternating rows — left to right, then right to left, then left to right again.'
          }
        ]
      }
    ],
    examples: [
      'Row 0 read left→right, row 1 read right→left, row 2 read left→right'
    ],
    relatedConceptIds: ['matrixTraversal']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'traversal',
    name: 'Traversal',
    eyebrow: 'ARRAYS · MATRICES',
    description:
      "The direction and shape you read a structure in is a choice, not a default. Reading it differently — backward, from both ends, in rings, on the diagonal — often turns a hard problem into an easy one.",
    category: 'algorithms',
    tags: ['Traversal', 'Arrays', 'Matrix', 'Two Pointers', 'Data Structures'],

    published: true,
    draft: false,
    version: '1.0.0',
    publishedAt: '2026-07-27',
    updatedAt: '2026-07-27',

    estimatedReadingMinutes: 11,
    credit: 'Provided by',
    creditOrg: 'Algorithm Deep Dives',

    keywords: [
      'Traversal',
      'Linear Scan',
      'Reverse Traversal',
      'Matrix Traversal',
      'Spiral Traversal',
      'Zigzag Traversal',
      'Diagonal Traversal',
      'Trapping Rain Water'
    ],
    aliases: ['Array Traversal', 'Matrix Scanning Patterns'],
    learningObjectives: [
      'Recognize when scanning backward reveals information forward scanning can\'t',
      'Combine a forward and backward pass into one traversal to save space',
      'Extend single-array scanning into matrices: row-major, spiral, diagonal, and zigzag order',
      'Choose a traversal order based on what the problem is actually asking for'
    ],
    difficulty: {
      level: 1,
      prerequisites: ['array-basics']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'TraversalDirectionsIllustration',
    caption: 'The same array or grid, read in several different orders',
    alt: 'Diagram showing forward, backward, spiral, diagonal, and zigzag paths over a grid',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "Reading left to right feels like the default, not a choice. But it's only one option, and it only ever tells you what "
        },
        {
          type: 'bold',
          text: 'came before'
        },
        {
          type: 'text',
          text: ' the current position. Sometimes the answer needs to know what comes after — and the only way to get that is to read it differently.'
        }
      ]
    }
  ],

  sections: [
    {
      id: 'the-problem',
      number: 1,
      title: "What Forward Scanning Can't Tell You",
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Say you have a skyline of walls of different heights, and you need to know how much rainwater would collect above each position — bounded by the tallest wall to its left and the tallest wall to its right.'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'The brute-force version rescans the entire array to the left and the entire array to the right, for every single position, just to find those two maxes:'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def trap_naive(heights):
    total = 0
    for i in range(len(heights)):
        left_max = max(heights[:i + 1])
        right_max = max(heights[i:])
        total += min(left_max, right_max) - heights[i]
    return total`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "That's O(n²) — rediscovering the same maxes over and over. The real issue is direction: a single left-to-right scan can hand you every left_max for free, but it has no way to know what's still ahead."
            }
          ]
        }
      ]
    },

    {
      id: 'linear-scan',
      number: 2,
      title: 'Linear Scan: What Came Before',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'One pass, left to right, tracking the running max as you go, gives you left_max for every index at once — no rescanning required:'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def left_maxes(heights):
    result = []
    running_max = 0
    for h in heights:
        running_max = max(running_max, h)
        result.append(running_max)
    return result`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is a linear scan — the default traversal most code already uses. It gives you exactly half of what the problem needs: everything to the left. It has nothing to say about what\'s to the right, because it hasn\'t looked yet.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'linearScan'
        }
      ]
    },

    {
      id: 'reverse-traversal',
      number: 3,
      title: 'Reverse Traversal: What Comes After',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "The other half is right there — just scan from the other end. Reversing the direction gives you right_max for every index, using the exact same running-max logic:"
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def right_maxes(heights):
    result = [0] * len(heights)
    running_max = 0
    for i in range(len(heights) - 1, -1, -1):
        running_max = max(running_max, heights[i])
        result[i] = running_max
    return result`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Nothing about the logic changed — only the direction. That's the whole point of reverse traversal: some information (\"what's ahead of me\") is only reachable by walking toward it, and forward scanning can never see it no matter how cleverly it's written."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'reverseTraversal'
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'With both arrays built, the answer falls out directly: for each index, take the smaller of the two maxes, subtract the wall height, and sum it up. That already beats brute force — O(n) instead of O(n²) — but it costs two full extra arrays.'
            }
          ]
        }
      ]
    },

    {
      id: 'simultaneous-traversal',
      number: 4,
      title: 'Doing Both at Once',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "You don't actually need both arrays stored in full — you just need, at each position, whichever of the two maxes is currently smaller. So run both traversals at the same time: one pointer closing in from the left, one from the right, each tracking its own running max."
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "At each step, advance whichever side has the smaller running max — that side's answer is now fully determined, since a taller wall somewhere on the other side can't matter once the near side is already the bottleneck."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def trap(heights):
    left, right = 0, len(heights) - 1
    left_max = right_max = 0
    total = 0

    while left < right:
        if heights[left] < heights[right]:
            left_max = max(left_max, heights[left])
            total += left_max - heights[left]
            left += 1
        else:
            right_max = max(right_max, heights[right])
            total += right_max - heights[right]
            right -= 1

    return total`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Same O(n) time as the two-array version, but O(1) extra space — because forward and backward information is being produced and consumed in the same pass instead of stored for later.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'simultaneousTraversal'
        }
      ]
    },

    {
      id: 'matrix-traversal',
      number: 5,
      title: 'The Same Idea, One Dimension Up',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Everything so far assumed a single line of elements. A matrix is just two of those, nested — a row-major scan is a linear scan with an extra loop wrapped around it:"
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def sum_matrix(grid):
    total = 0
    for row in range(len(grid)):
        for col in range(len(grid[0])):
            total += grid[row][col]
    return total`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'That covers most matrix problems just fine. But some problems ask for the elements in a specific '
            },
            {
              type: 'bold',
              text: 'order'
            },
            {
              type: 'text',
              text: " — not row by row, but ring by ring, diagonal by diagonal, or alternating direction. Those don't need a faster traversal, just a more deliberate one."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'matrixTraversal'
        }
      ]
    },

    {
      id: 'spiral-traversal',
      number: 6,
      title: 'Spiral Traversal: Peeling Off Rings',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "A spiral reads the outer ring first — right across the top, down the right edge, left across the bottom, up the left edge — then does the same thing one ring in. Four shrinking boundaries do all the bookkeeping:"
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def spiral_order(matrix):
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1

    while top <= bottom and left <= right:
        for col in range(left, right + 1):
            result.append(matrix[top][col])
        top += 1

        for row in range(top, bottom + 1):
            result.append(matrix[row][right])
        right -= 1

        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])
            bottom -= 1

        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])
            left += 1

    return result`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Each of the four sides checks the boundaries it depends on before running — that\'s what keeps a single row or column from being read twice once the ring narrows down to one line.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'spiralTraversal'
        }
      ]
    },

    {
      id: 'diagonal-traversal',
      number: 7,
      title: 'Diagonal Traversal: Following row + col',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "On any diagonal running from top-right to bottom-left, every cell shares the same row + col. That single fact is enough to group and read a matrix diagonal by diagonal, alternating direction on each one:"
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def diagonal_order(matrix):
    rows, cols = len(matrix), len(matrix[0])
    diagonals = {}

    for row in range(rows):
        for col in range(cols):
            key = row + col
            diagonals.setdefault(key, []).append(matrix[row][col])

    result = []
    for key in sorted(diagonals):
        diagonal = diagonals[key]
        result.extend(diagonal if key % 2 == 0 else reversed(diagonal))

    return result`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "The direction flip on alternating diagonals isn't extra logic bolted on — it's the same reverse-traversal idea from earlier, just applied per group instead of to the whole array."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'diagonalTraversal'
        }
      ]
    },

    {
      id: 'zigzag-traversal',
      number: 8,
      title: 'Zigzag Traversal: Flipping Direction Row by Row',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Zigzag order works the same way as diagonal order, one level simpler: instead of flipping direction per diagonal, flip it per row.'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def zigzag_order(matrix):
    result = []
    for i, row in enumerate(matrix):
        result.extend(row if i % 2 == 0 else reversed(row))
    return result`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "It shows up outside matrices too — reading a tree level by level but alternating direction each level is the exact same idea, just with each row replaced by a level's worth of nodes."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'zigzagTraversal'
        }
      ]
    },

    {
      id: 'when-to-use',
      number: 9,
      title: 'When to Reach for Each One',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'For a single array, the question is usually about information direction — do you need what came before, what comes after, or both at once:'
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `• Only need info from earlier positions           → Linear Scan
• Only need info from later positions              → Reverse Traversal
• Need both, without storing two full arrays       → Simultaneous Forward & Backward`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'For a matrix, the question is usually about required output order rather than speed — all of these run in O(rows × cols) regardless:'
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `• Any order works, just visit everything    → Matrix Traversal (row-major)
• Output must go ring by ring, inward       → Spiral Traversal
• Output must go diagonal by diagonal       → Diagonal Traversal
• Output must alternate direction each row  → Zigzag Traversal`
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Speed vs. order',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'The 1D patterns are usually about cutting down time or space. The matrix patterns are usually about correctness of order, not speed — the skill is careful boundary bookkeeping, not a faster algorithm.'
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  glossary,

  resources: [
    {
      type: 'article',
      title: 'Two Pointers',
      description: 'Simultaneous forward/backward traversal is the same converging-pointers idea, applied to accumulate information instead of search for a pair.',
      url: '/deep-dive/two-pointers',
      slug: 'two-pointers',
      relationship: 'prerequisite'
    },
    {
      type: 'article',
      title: 'Fixed Sliding Window',
      description: 'Another traversal that keeps a running state across a single pass, but bounded to a constant-size window instead of the whole array.',
      url: '/deep-dive/fixed-sliding-window',
      slug: 'fixed-sliding-window',
      relationship: 'related'
    }
  ]
};