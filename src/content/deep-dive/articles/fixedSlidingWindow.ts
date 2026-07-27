// src/content/deep-dive/articles/fixed-sliding-window.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Terms are referenced inside sections via ConceptReferenceBlock items.
 */
const glossary: Record<string, Concept> = {
  fixedWindowSize: {
    id: 'fixedWindowSize',
    term: 'Fixed Window Size (k)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A constraint where the sub-array or sub-string under evaluation maintains a constant length k throughout the entire traversal.'
          }
        ]
      }
    ],
    examples: [
      'Finding the maximum sum of k consecutive elements in an array',
      'Calculating moving averages over a fixed period of k days'
    ],
    relatedConceptIds: ['incrementalUpdate', 'windowOverlap']
  },
  incrementalUpdate: {
    id: 'incrementalUpdate',
    term: 'Incremental Update',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'The technique of maintaining window metrics by performing a constant O(1) operation: subtracting the element leaving the left edge and adding the element entering the right edge.'
          }
        ]
      }
    ],
    examples: [
      'window_sum = window_sum - nums[left] + nums[right]'
    ],
    relatedConceptIds: ['fixedWindowSize', 'windowOverlap']
  },
  windowOverlap: {
    id: 'windowOverlap',
    term: 'Window Overlap',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'The mathematical property where consecutive windows of size k share k - 1 elements, meaning only two elements change between adjacent states.'
          }
        ]
      }
    ],
    examples: [
      'Window [0..3] and Window [1..4] both contain elements at indices 1, 2, and 3'
    ],
    relatedConceptIds: ['fixedWindowSize', 'incrementalUpdate']
  },
  timeComplexityOptimization: {
    id: 'timeComplexityOptimization',
    term: 'Time Complexity Optimization',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Reducing operational runtime from O(n × k) in naive brute-force recalculations down to O(n) linear time by eliminating redundant operations.'
          }
        ]
      }
    ],
    examples: [
      'Processing a 1,000,000 element array with k=100 takes 1,000,000 operations instead of 100,000,000 operations'
    ],
    relatedConceptIds: ['incrementalUpdate']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'fixed-sliding-window',
    name: 'Fixed Sliding Window',
    eyebrow: 'ARRAYS · TWO POINTERS',
    description:
      'A fixed sliding window replaces redundant calculations with incremental O(1) updates. Instead of recomputing every window from scratch, one element leaves, one enters, and the answer updates in constant time.',
    category: 'algorithms',
    tags: ['Sliding Window', 'Arrays', 'Two Pointers', 'Algorithms', 'Data Structures'],

    // Publishing & Operations
    published: true,
    draft: false,
    version: '2.0.0',
    publishedAt: '2024-10-15',
    updatedAt: '2026-07-27',

    // Metrics & Attribution
    estimatedReadingMinutes: 10,
    credit: 'Provided by',
    creditOrg: 'Algorithm Deep Dives',

    // Discovery & Search Graph
    keywords: [
      'Sliding Window',
      'Fixed Window Algorithm',
      'Two Pointers',
      'Array Optimization',
      'Subarray Sum',
      'Time Complexity O(n)'
    ],
    aliases: ['Static Sliding Window', 'K-Length Subarray Pattern'],
    learningObjectives: [
      'Identify redundant overlap computations in naive array operations',
      'Apply incremental update mechanics (add entering, remove leaving element)',
      'Construct linear O(n) solutions for fixed subarray problems',
      'Distinguish when to use fixed vs. variable sliding window techniques'
    ],
    difficulty: {
      level: 1,
      prerequisites: ['two-pointers', 'array-basics']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'FixedSlidingWindowIllustration',
    caption: 'Visualizing a fixed-size window sliding sequentially across contiguous array indices',
    alt: 'Diagram showing a window frame spanning fixed elements across an array',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Many array problems ask the same question repeatedly over neighboring groups of elements. The first group might be indices 0–3, the next 1–4, then 2–5. Most elements remain identical between windows, yet a naive solution throws everything away and recalculates from scratch. A fixed sliding window exists because adjacent windows differ by only two elements: '
        },
        {
          type: 'bold',
          text: 'one leaves, and one arrives.'
        }
      ]
    }
  ],

  sections: [
    {
      id: 'repeated-work',
      number: 1,
      title: 'The Repeated Work Hiding in Plain Sight',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Suppose every consecutive block of four numbers needs its sum. A straightforward solution loops through all four elements every time. The issue is that adjacent windows overlap almost completely.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Moving from one window to the next does not create an entirely new window. Three of the four elements are identical. Only one element disappears from the left edge, and one new element appears on the right edge.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'windowOverlap'
        },
        {
          type: 'code',
          language: 'python',
          code: `nums = [2, 5, 1, 8, 2, 9]
k = 4

# Window 1
[2, 5, 1, 8]

# Window 2
   [5, 1, 8, 2]

# Window 3
      [1, 8, 2, 9]`
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'SlidingWindowShiftIllustration',
          caption: 'Neighboring windows overlap almost entirely across iterations',
          alt: 'Diagram demonstrating index overlap between adjacent window shifts',
          width: 'full'
        }
      ]
    },

    {
      id: 'core-observation',
      number: 2,
      title: 'The Observation That Changes Everything',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Imagine the current window already has a sum of 16. When the window slides one position to the right, almost nothing changes. Instead of summing four numbers again, subtract the element that fell out of the window and add the new element that entered.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Every shift performs exactly one subtraction and one addition, regardless of the window size k.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'incrementalUpdate'
        },
        {
          type: 'code',
          language: 'python',
          code: `window_sum -= nums[left]   # element leaving left boundary
window_sum += nums[right]  # element entering right boundary`
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Key Insight',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'The only expensive operation is computing the '
                },
                {
                  type: 'bold',
                  text: 'first'
                },
                {
                  type: 'text',
                  text: ' window. Every window after that requires only a constant O(1) state update.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'building-the-algorithm',
      number: 3,
      title: 'Building the Algorithm',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'The algorithm begins by computing the first window normally. Once that initial sum exists, every subsequent window reuses it by applying constant-time incremental updates.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'fixedWindowSize'
        },
        {
          type: 'code',
          language: 'python',
          code: `def max_sum(nums: list[int], k: int) -> int:
    # Build the first window
    window_sum = sum(nums[:k])
    best = window_sum

    left = 0

    # Slide the window across the remaining elements
    for right in range(k, len(nums)):
        window_sum -= nums[left]
        window_sum += nums[right]
        left += 1

        best = max(best, window_sum)

    return best`
        }
      ]
    },

    {
      id: 'tracing-the-window',
      number: 4,
      title: 'Watching the Window Move',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Trace how each shift changes only two values while leaving all internal elements untouched.'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `nums = [2, 5, 1, 8, 2, 9]
k = 4

Window: [2, 5, 1, 8]
sum = 16

remove 2 (index 0)
add 2    (index 4)

Window: [5, 1, 8, 2]
sum = 16

remove 5 (index 1)
add 9    (index 5)

Window: [1, 8, 2, 9]
sum = 20`
        },
        {
          type: 'diagram',
          renderEngine: 'component',
          componentName: 'SlidingWindowUpdateIllustration',
          caption: 'Every shift drops one element on the left and picks up one element on the right',
          alt: 'Animation/diagram illustrating the left-out and right-in element updates',
          width: 'full'
        }
      ]
    },

    {
      id: 'complexity-analysis',
      number: 5,
      title: 'Why It Is Significantly Faster',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Suppose an array contains one million elements and the window size is one hundred. A naive solution performs 100 additions for every window position. The sliding window performs only 2 arithmetic operations per shift after the initial window.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'timeComplexityOptimization'
        },
        {
          type: 'code',
          language: 'text',
          code: `Naive Approach (Recalculating every window)
  Window 1: 100 additions
  Window 2: 100 additions
  Window 3: 100 additions
  Total Operations: O(n × k)

Sliding Window Approach (Incremental updates)
  Window 1: 100 additions
  Window 2: 1 subtraction, 1 addition
  Window 3: 1 subtraction, 1 addition
  Total Operations: O(n)`
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Time & Space Complexity',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Naive Complexity: '
                },
                {
                  type: 'bold',
                  text: 'O(n × k)'
                },
                {
                  type: 'text',
                  text: ' time, O(1) auxiliary space.\n'
                },
                {
                  type: 'text',
                  text: 'Fixed Sliding Window Complexity: '
                },
                {
                  type: 'bold',
                  text: 'O(n)'
                },
                {
                  type: 'text',
                  text: ' time, '
                },
                {
                  type: 'bold',
                  text: 'O(1)'
                },
                {
                  type: 'text',
                  text: ' auxiliary space.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'applicable-patterns',
      number: 6,
      title: 'When This Pattern Applies',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'The fixed sliding window technique applies whenever the subarray length is explicitly specified and remains static throughout the evaluation.'
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `Common Fixed Window Problems:
• Maximum/Minimum sum of subarray of size k
• Average of every contiguous window of size k
• Maximum average subarray of length k
• Count negative numbers in every window of size k
• Count distinct elements in every window of size k
• Maximum vowels in a substring of length k
• Card points maximization (k cards from ends)`
        }
      ]
    },

    {
      id: 'limitations',
      number: 7,
      title: 'When It Does Not Work',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Some problems do not specify a window size upfront. They ask for the shortest, longest, or optimal window that satisfies a condition (e.g., "smallest subarray with sum ≥ S"). In these cases, the window must expand and shrink dynamically.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Dynamic boundary problems require the '
            },
            {
              type: 'bold',
              text: 'Variable Sliding Window'
            },
            {
              type: 'text',
              text: ' pattern, where the left and right pointers move independently.'
            }
          ]
        },
        {
          type: 'tradeoff',
          title: 'Fixed vs. Variable Sliding Window',
          description: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Choosing between fixed and variable window strategies depends on whether window bounds are constant or dynamic.'
                }
              ]
            }
          ],
          sides: [
            {
              name: 'Fixed Window',
              pros: [
                'Deterministic O(1) step behavior on every iteration',
                'Simple implementation using synchronized two-pointer movement',
                'Ideal for contiguous sub-sequence metrics (averages, sums)'
              ],
              cons: [
                'Inflexible—cannot process variable constraints',
                'Requires prior knowledge of exact window length k'
              ]
            },
            {
              name: 'Variable Window',
              pros: [
                'Handles dynamic target conditions (e.g., min length satisfying condition)',
                'Expands right pointer to find valid states and shrinks left pointer to optimize'
              ],
              cons: [
                'More complex edge-case handling (empty windows, pointer crossover)',
                'Requires auxiliary state tracking (hash maps, frequency tables)'
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
      title: 'Variable Sliding Window',
      description: 'The window grows and shrinks dynamically to find optimal subarrays.',
      url: '/deep-dive/variable-sliding-window',
      slug: 'variable-sliding-window',
      relationship: 'next'
    },
    {
      type: 'article',
      title: 'Two Pointers Technique',
      description: 'The foundational algorithmic paradigm from which sliding windows are derived.',
      url: '/deep-dive/two-pointers',
      slug: 'two-pointers',
      relationship: 'prerequisite'
    }
  ]
};