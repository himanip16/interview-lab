// src/content/deep-dive/articles/fixed-sliding-window.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * These are passive reference entries surfaced via ConceptReferenceBlock —
 * the prose never depends on the reader opening them. Kept short and plain.
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
            text: 'The window always covers exactly k elements — never more, never fewer — as it moves across the array.'
          }
        ]
      }
    ],
    examples: [
      'Finding the max sum of k consecutive elements',
      'A moving average over the last k days'
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
            text: 'Instead of recalculating the whole window, keep the running result and update only what changed: subtract the element that left, add the element that entered.'
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
            text: 'When the window moves by one step, most elements are still there. Only one leaves and one enters.'
          }
        ]
      }
    ],
    examples: [
      'Window [0..3] and window [1..4] share indices 1, 2, and 3'
    ],
    relatedConceptIds: ['fixedWindowSize', 'incrementalUpdate']
  },
  timeComplexityOptimization: {
    id: 'timeComplexityOptimization',
    term: 'Why It Scales',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Recalculating every window from scratch costs O(n × k). Updating the running total costs O(n) — the window size stops mattering.'
          }
        ]
      }
    ],
    examples: [
      '1,000,000 elements, k=100: 1,000,000 operations instead of 100,000,000'
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
      "You don't need to recompute a window from scratch every time it moves — one element leaves, one enters, and you update the answer in constant time.",
    category: 'algorithms',
    tags: ['Sliding Window', 'Arrays', 'Two Pointers', 'Algorithms', 'Data Structures'],

    published: true,
    draft: false,
    version: '3.0.0',
    publishedAt: '2024-10-15',
    updatedAt: '2026-07-27',

    estimatedReadingMinutes: 8,
    credit: 'Provided by',
    creditOrg: 'Algorithm Deep Dives',

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
      'Spot when you\'re redoing work you already did',
      'Update a running result instead of recalculating it',
      'Write a linear O(n) solution for fixed-length subarray problems',
      'Tell fixed windows apart from problems that need a variable window'
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
    caption: 'A fixed-size window sliding across the array, one step at a time',
    alt: 'Diagram showing a window frame spanning fixed elements across an array',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "Say you're checking every group of 4 consecutive numbers for something — a sum, an average, a count. The next group only shifts over by one. Most of it is the same numbers you already looked at. If your solution re-adds all four every time, it's "
        },
        {
          type: 'bold',
          text: 'redoing work it already did.'
        }
      ]
    }
  ],

  sections: [
    {
      id: 'repeated-work',
      number: 1,
      title: 'Wait, Haven\'t I Already Added These?',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Say you're tracking the highest 3-day temperature total over a week:"
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `Day:   Mon Tue Wed Thu Fri
Temp:   10  20  30  15  25

Window 1 (Mon-Wed): 10 + 20 + 30 = 60
Window 2 (Tue-Thu): 20 + 30 + 15 = 65
Window 3 (Wed-Fri): 30 + 15 + 25 = 70`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Look at Window 1 and Window 2. Both include Tue (20) and Wed (30). The only thing that actually changed is: Mon dropped out, Thu showed up. Recomputing all three numbers for Window 2 means re-adding two numbers you already added a moment ago.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "This is the same shape in array form — it's just numbers instead of days:"
            }
          ]
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
          type: 'concept-ref',
          conceptId: 'windowOverlap'
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
      title: 'The Trick: Reuse What You Already Know',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "You already know the current window's total. When the window slides over by one, you don't need the whole sum again — you just need to know what left and what arrived."
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Subtract the element that fell out on the left. Add the element that showed up on the right. That\'s it — one subtraction, one addition, no matter how big the window is.'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `window_sum -= nums[left]   # element leaving left boundary
window_sum += nums[right]  # element entering right boundary`
        },
        {
          type: 'concept-ref',
          conceptId: 'incrementalUpdate'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'The only expensive step',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'You compute the '
                },
                {
                  type: 'bold',
                  text: 'first'
                },
                {
                  type: 'text',
                  text: ' window the normal way. Every window after that is just one swap.'
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
      title: 'Putting It Into Code',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Sum the first k elements to get a starting point. Then walk through the rest of the array, swapping one element out and one in at each step.'
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
      title: 'Watching It Move',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Back to the array example — trace it and check that only two numbers change per step.'
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
      title: 'Why This Is Faster',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Recalculating every window from scratch means k additions per window — for n windows, that adds up fast. Updating a running total means 2 operations per window, period.'
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `Naive (recalculate every window):     O(n × k)
Sliding window (update, don't rebuild): O(n)

Example: 1,000,000 elements, k = 100
  Naive:           100,000,000 operations
  Sliding window:    1,000,000 operations`
        },
        {
          type: 'concept-ref',
          conceptId: 'timeComplexityOptimization'
        }
      ]
    },

    {
      id: 'applicable-patterns',
      number: 6,
      title: 'When to Reach for This',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Use a fixed window whenever the problem hands you an exact window length k that stays constant the whole way through:'
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `• Max/min sum of a subarray of size k
• Average of every window of size k
• Maximum average subarray of length k
• Count negatives in every window of size k
• Count distinct elements in every window of size k
• Max vowels in a substring of length k
• Card points from k cards taken off either end`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'It falls apart when the problem doesn\'t give you a fixed length up front — "smallest subarray with sum ≥ S" doesn\'t tell you how big the window should be, so it has to grow and shrink as you go. That\'s a '
            },
            {
              type: 'bold',
              text: 'variable'
            },
            {
              type: 'text',
              text: ' window, and it needs both pointers moving independently instead of in lockstep.'
            }
          ]
        },
        {
          type: 'tradeoff',
          title: 'Fixed vs. Variable Window',
          description: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'The question to ask: does the window length stay fixed, or does it depend on satisfying some condition?'
                }
              ]
            }
          ],
          sides: [
            {
              name: 'Fixed Window',
              pros: [
                'Same O(1) update every single step',
                'Both pointers move together — simple to implement',
                'Great fit for fixed-length sums and averages'
              ],
              cons: [
                "Only works if you're told the exact window size",
                "Can't handle a 'find the best length' problem"
              ]
            },
            {
              name: 'Variable Window',
              pros: [
                'Handles "find the shortest/longest window that works" problems',
                'Grows right, shrinks left, until the condition is met'
              ],
              cons: [
                'Trickier edge cases (empty windows, pointers crossing)',
                'Usually needs extra state (hash maps, counters)'
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