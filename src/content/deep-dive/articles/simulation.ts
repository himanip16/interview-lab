// src/content/deep-dive/articles/simulation.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Passive reference entries surfaced via ConceptReferenceBlock —
 * the prose never depends on the reader opening them.
 */
const glossary: Record<string, Concept> = {
  reversalRotation: {
    id: 'reversalRotation',
    term: 'Reversal Rotation',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Rotating an array in place by reversing the whole array, then reversing each of the two resulting segments — three reversals that together produce the same result as shifting every element, with O(1) extra space.'
          }
        ]
      }
    ],
    examples: [
      'reverse(0, n-1); reverse(0, k-1); reverse(k, n-1)'
    ],
    relatedConceptIds: ['boundaryTraversal']
  },
  boundaryTraversal: {
    id: 'boundaryTraversal',
    term: 'Boundary Traversal',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Walking a grid by tracking shrinking edges — top, bottom, left, right — and consuming one edge per leg, instead of computing a closed-form index for each visited cell.'
          }
        ]
      }
    ],
    examples: [
      'top, bottom, left, right = 0, rows-1, 0, cols-1'
    ],
    relatedConceptIds: ['directionVector']
  },
  stateEncoding: {
    id: 'stateEncoding',
    term: 'State Encoding',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Packing both the old and new state of a cell into the same value (e.g. using a second bit) so an in-place simulation can read every cell\'s original state even after some cells have already been updated.'
          }
        ]
      }
    ],
    examples: [
      '0b11 = "was alive, now alive"; 0b10 = "was dead, now alive"'
    ],
    relatedConceptIds: []
  },
  directionVector: {
    id: 'directionVector',
    term: 'Direction Vector',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Representing "facing a direction" as an index into a fixed list of (dx, dy) offsets, so turning becomes incrementing or decrementing that index modulo the list length instead of a chain of if/elif branches.'
          }
        ]
      }
    ],
    examples: [
      'directions = [(0,1), (1,0), (0,-1), (-1,0)]; d = (d + 1) % 4'
    ],
    relatedConceptIds: ['boundaryTraversal']
  },
  transposeReverse: {
    id: 'transposeReverse',
    term: 'Transpose + Reverse',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Rotating a square matrix 90° in place by first transposing it (flip across the main diagonal), then reversing each row — two simple, well-understood operations that compose into a rotation without any extra grid.'
          }
        ]
      }
    ],
    examples: [
      'transpose(matrix); for row in matrix: row.reverse()'
    ],
    relatedConceptIds: ['reversalRotation']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'simulation',
    name: 'Simulation',
    eyebrow: 'ARRAYS · GRIDS',
    description:
      "Some problems don't have a clever shortcut — they just describe a process, and you have to carry it out correctly. This deep dive covers rotating arrays and matrices in place, walking a grid in spiral order, simulating a robot's moves, and the specific trap of updating a grid whose neighbors depend on each other's current state.",
    category: 'algorithms',
    tags: ['Simulation', 'Matrix', 'Arrays', 'Grid Traversal'],

    published: true,
    draft: false,
    version: '1.0.0',
    publishedAt: '2026-07-27',
    updatedAt: '2026-07-27',

    estimatedReadingMinutes: 12,
    credit: 'Provided by',
    creditOrg: 'Algorithm Deep Dives',

    keywords: [
      'Simulation',
      'Rotate Array',
      'Spiral Matrix',
      'Game of Life',
      'Robot Simulation',
      'Matrix Rotation',
      'In-Place',
      'Direction Vectors'
    ],
    aliases: ['Simulation Problems', 'Step-by-Step Simulation'],
    learningObjectives: [
      'Rotate an array in O(1) space using the three-reversal trick',
      'Traverse a matrix in spiral order using shrinking boundaries',
      'Update a grid in place without corrupting neighbors that haven\'t been processed yet',
      'Model direction and turning with direction vectors instead of branching logic',
      'Rotate a matrix 90° in place using transpose + reverse'
    ],
    difficulty: {
      level: 2,
      prerequisites: ['array-basics']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'SpiralWalkIllustration',
    caption: 'A path spiraling inward through a grid, one shrinking boundary at a time',
    alt: 'Diagram showing a spiral traversal path through a matrix with shrinking boundaries',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "Not every problem has a clever trick hiding underneath it. Some just describe a process — spin the array, walk the grid in a spiral, update every cell based on its neighbors — and the entire job is to "
        },
        {
          type: 'bold',
          text: 'carry that process out correctly'
        },
        {
          type: 'text',
          text: ", without extra memory and without letting one step corrupt the data another step still needs."
        }
      ]
    }
  ],

  sections: [
    {
      id: 'the-problem',
      number: 1,
      title: "When There's No Shortcut, Only a Process",
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Take something as simple as rotating an array k steps to the right. There's no clever formula that replaces the rotation — the values genuinely have to move. The easy way is to build a new array:"
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def rotate_naive(nums, k):
    n = len(nums)
    k %= n
    return nums[-k:] + nums[:-k]`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Correct, and O(n) time — but it costs O(n) extra space for the new array. Simulation problems are usually solvable this way on the first pass. The harder, more interesting version asks: can you do it in place, mutating the original array or grid directly, without a second copy to fall back on? That constraint is what turns \"just simulate it\" into a real design problem."
            }
          ]
        }
      ]
    },

    {
      id: 'rotate-array',
      number: 2,
      title: 'Rotating Without a Second Array',
      blocks: [
        {
          type: 'subsection',
          dotColor: 'var(--mint-deep)',
          title: 'Three-Reversal Trick',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: "The in-place trick is to reverse the whole array, then reverse each of the two pieces that should end up in swapped order. Reversing the whole thing gets everything backwards, and reversing each half un-reverses it locally while leaving the two halves swapped — which is exactly a rotation."
                }
              ]
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def rotate(nums, k):
    n = len(nums)
    k %= n

    def reverse(l, r):
        while l < r:
            nums[l], nums[r] = nums[r], nums[l]
            l += 1
            r -= 1

    reverse(0, n - 1)     # [7,6,5,4,3,2,1] from [1,2,3,4,5,6,7]
    reverse(0, k - 1)     # un-reverse the first k
    reverse(k, n - 1)     # un-reverse the rest`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Three linear passes, each O(n), so the whole thing is still O(n) time — but now O(1) extra space, because every reversal happens on the array itself.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'reversalRotation'
        }
      ]
    },

    {
      id: 'spiral-matrix',
      number: 3,
      title: 'Walking a Grid From the Outside In',
      blocks: [
        {
          type: 'subsection',
          dotColor: 'var(--coral)',
          title: 'Shrinking Boundaries',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: "Printing a matrix in spiral order is simulation in its purest form: right along the top, down the right side, left along the bottom, up the left side, then shrink and repeat. The clean way to track this isn't a formula for \"the nth cell in spiral order\" — it's four boundaries that close in after each leg."
                }
              ]
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
              text: "The two guard checks (if top <= bottom, if left <= right) matter more than they look — without them, a matrix with only one remaining row or column gets walked twice, once going right-to-left along the row and then again going the \"wrong way\" back along a row that no longer exists."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'boundaryTraversal'
        }
      ]
    },

    {
      id: 'game-of-life',
      number: 4,
      title: "Updating Cells That Depend on Each Other",
      blocks: [
        {
          type: 'subsection',
          dotColor: 'var(--amber)',
          title: 'State Encoding',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: "Game of Life adds a trap that rotation and spiral traversal don't have: every cell's next state depends on its neighbors' current state, and if you update cells one at a time in place, later cells end up reading already-updated neighbors instead of the original board."
                }
              ]
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: "The usual fix is a second grid — simple, but O(rows × cols) extra space. The in-place fix is to encode both the old and new state in the same cell, using a second bit, so every read of a neighbor still sees its original value even after that neighbor's new state has been written on top of it:"
                }
              ]
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def game_of_life(board):
    rows, cols = len(board), len(board[0])

    def live_neighbors(r, c):
        count = 0
        for dr in (-1, 0, 1):
            for dc in (-1, 0, 1):
                if dr == 0 and dc == 0:
                    continue
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    count += board[nr][nc] & 1  # original state, ignore new bit
        return count

    for r in range(rows):
        for c in range(cols):
            n = live_neighbors(r, c)
            if board[r][c] == 1 and n in (2, 3):
                board[r][c] = 0b11  # was alive, stays alive
            elif board[r][c] == 0 and n == 3:
                board[r][c] = 0b10  # was dead, becomes alive

    for r in range(rows):
        for c in range(cols):
            board[r][c] >>= 1  # drop the "old state" bit, keep only the new one`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '`board[nr][nc] & 1` reads only the low bit, which always holds the original state, no matter how many neighboring cells have already been overwritten with a new-state bit above it. The final pass shifts every cell down to just its new value.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'stateEncoding'
        }
      ]
    },

    {
      id: 'robot-simulation',
      number: 5,
      title: 'Facing a Direction Without a Wall of If-Statements',
      blocks: [
        {
          type: 'subsection',
          dotColor: 'var(--mint-deep)',
          title: 'Direction Vectors',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: "Robot-on-a-grid problems ask you to track a moving point, a facing direction, and turns. The naive version writes out a branch for every combination of current direction and turn command — sixteen cases before you've even started moving. The cleaner version stores the four directions in a fixed list and represents \"facing\" as an index into it."
                }
              ]
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def simulate_robot(commands, obstacles):
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # N, E, S, W
    obstacle_set = set(obstacles)
    x, y, d = 0, 0, 0
    max_dist_sq = 0

    for cmd in commands:
        if cmd == -2:        # turn left
            d = (d - 1) % 4
        elif cmd == -1:      # turn right
            d = (d + 1) % 4
        else:
            for _ in range(cmd):
                nx, ny = x + directions[d][0], y + directions[d][1]
                if (nx, ny) in obstacle_set:
                    break
                x, y = nx, ny
                max_dist_sq = max(max_dist_sq, x * x + y * y)

    return max_dist_sq`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Turning right is just `d = (d + 1) % 4`; turning left is `d = (d - 1) % 4`. The modulo wraps automatically from West back to North, so there\'s no special-case code for "what comes after facing West" — the direction list already encodes the cycle.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'directionVector'
        }
      ]
    },

    {
      id: 'matrix-rotation',
      number: 6,
      title: 'Rotating a Grid 90° Without a Second Grid',
      blocks: [
        {
          type: 'subsection',
          dotColor: 'var(--coral)',
          title: 'Transpose + Reverse',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Rotating a square matrix 90° clockwise looks like it needs a fresh grid to write the rotated result into — but it decomposes into two simpler in-place operations: transpose the matrix (swap across the main diagonal), then reverse each row.'
                }
              ]
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def rotate_matrix(matrix):
    n = len(matrix)

    # transpose: flip across the main diagonal
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

    # reverse each row
    for row in matrix:
        row.reverse()`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Transposing alone would flip the matrix along the diagonal, which is a reflection, not a rotation. Reversing each row afterward turns that reflection into a clean 90° clockwise turn. Both steps are O(n²) but O(1) extra space, and the order matters — reversing rows before transposing produces a counter-clockwise rotation instead."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'transposeReverse'
        }
      ]
    },

    {
      id: 'why-it-works',
      number: 7,
      title: 'Why the In-Place Versions Are Worth the Trouble',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "None of these tricks change the time complexity — simulation problems are usually O(n) or O(rows × cols) either way. What they buy is space:"
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `Rotate array:     O(n) space (new array)        →  O(1) space (three reversals)
Game of Life:      O(rows × cols) space (new grid) →  O(1) space (state-encoded bits)
Matrix rotation:   O(n²) space (new matrix)        →  O(1) space (transpose + reverse)`
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'The tradeoff',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'In-place simulation trades a small amount of '
                },
                {
                  type: 'bold',
                  text: 'cleverness in the write order'
                },
                {
                  type: 'text',
                  text: " for real memory savings — but every one of these tricks depends on carefully deciding what gets overwritten and when. Get the order wrong and you silently read data that's already been mutated."
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'when-to-use',
      number: 8,
      title: 'When to Reach for This',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Simulation is less about recognizing a pattern and more about recognizing that no pattern applies — the problem just wants the process carried out. It's worth reaching for these specific tricks when:"
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `• The problem describes an actual physical process — rotating, spiraling, moving, turning
• You're asked for an in-place / O(1)-extra-space solution
• A grid update depends on neighbor values that shouldn't change mid-update
  (state encoding, or process in a safe order / use a second buffer)
• "Facing a direction" or "turning" shows up — model it as an index, not a branch`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "If extra space isn't a constraint, the naive version — build a new array, new grid, or new matrix — is almost always simpler to write and just as correct. Reach for the in-place versions when the constraint actually asks for them, not by default."
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
      title: 'Mathematical Patterns',
      description: 'Another O(1)-space in-place technique — cyclic sort uses the same "place things where they belong" instinct as reversal rotation.',
      url: '/deep-dive/mathematical-patterns',
      slug: 'mathematical-patterns',
      relationship: 'related'
    },
    {
      type: 'article',
      title: 'Sorting-Based Techniques',
      description: 'Custom comparators and coordinate compression share the same "impose structure on the data first" mindset as boundary traversal.',
      url: '/deep-dive/sorting-based',
      slug: 'sorting-based',
      relationship: 'related'
    }
  ]
};