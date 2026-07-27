// src/content/deep-dive/articles/sorting.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Passive reference entries surfaced via ConceptReferenceBlock —
 * the prose never depends on the reader opening them.
 */
const glossary: Record<string, Concept> = {
  customSorting: {
    id: 'customSorting',
    term: 'Custom Sorting',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Sorting by a key or comparator you define instead of the default ordering — sort by end time, by length, by a derived value, or by multiple fields at once.'
          }
        ]
      }
    ],
    examples: [
      "meetings.sort(key=lambda m: m[0])  # sort by start time"
    ],
    relatedConceptIds: ['stableSorting']
  },
  stableSorting: {
    id: 'stableSorting',
    term: 'Stable Sorting',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: "A sort where elements that compare equal keep their original relative order. This is what lets you sort by one key, then sort again by another, and have the first sort's order survive as a tiebreaker."
          }
        ]
      }
    ],
    examples: [
      'Sorting by score, then by name — equal scores stay in name order'
    ],
    relatedConceptIds: ['customSorting']
  },
  partialSorting: {
    id: 'partialSorting',
    term: 'Partial Sorting',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: "Getting the k smallest, k largest, or k-th element without fully sorting everything else — using a heap or quickselect to do less work than a full O(n log n) sort."
          }
        ]
      }
    ],
    examples: [
      'heapq.nsmallest(3, nums)'
    ],
    relatedConceptIds: ['customSorting']
  },
  coordinateCompression: {
    id: 'coordinateCompression',
    term: 'Coordinate Compression',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Replacing a sparse set of large values with their rank among the sorted unique values, so only relative order is preserved. Turns huge or scattered numbers into a small dense range of indices.'
          }
        ]
      }
    ],
    examples: [
      '[1000000, 7, 350000] → ranks [2, 0, 1]'
    ],
    relatedConceptIds: ['customSorting']
  },
  sortingGreedy: {
    id: 'sortingGreedy',
    term: 'Sorting + Greedy',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Sort by the field that makes the greedy choice obviously safe, then walk through once making the locally best decision at each step — no backtracking needed.'
          }
        ]
      }
    ],
    examples: [
      'Activity selection: sort intervals by end time, greedily keep any that fit'
    ],
    relatedConceptIds: ['customSorting']
  },
  sortingTwoPointers: {
    id: 'sortingTwoPointers',
    term: 'Sorting + Two Pointers',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Sort the array first so that moving a left pointer up always increases the sum and moving a right pointer down always decreases it — turning an O(n²) search for a pair into a single O(n) sweep.'
          }
        ]
      }
    ],
    examples: [
      'Sorted pair-sum: move left/right inward based on whether the current sum is too small or too large'
    ],
    relatedConceptIds: ['customSorting']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'sorting-based',
    name: 'Sorting-Based Techniques',
    eyebrow: 'ARRAYS · ORDERING',
    description:
      "A huge number of array problems get dramatically simpler the moment you sort. This deep dive covers custom and stable sorting, partial sorting, coordinate compression, and the two workhorse combos: sorting with greedy and sorting with two pointers.",
    category: 'algorithms',
    tags: ['Sorting', 'Greedy', 'Two Pointers', 'Arrays', 'Coordinate Compression'],

    published: true,
    draft: false,
    version: '1.0.0',
    publishedAt: '2026-07-27',
    updatedAt: '2026-07-27',

    estimatedReadingMinutes: 12,
    credit: 'Provided by',
    creditOrg: 'Algorithm Deep Dives',

    keywords: [
      'Sorting',
      'Custom Sorting',
      'Stable Sort',
      'Partial Sorting',
      'Quickselect',
      'Coordinate Compression',
      'Greedy',
      'Two Pointers',
      'Interval Scheduling',
      '3Sum'
    ],
    aliases: ['Sort-Based Techniques', 'Sorting Patterns'],
    learningObjectives: [
      'Recognize when sorting turns a hard search into an easy scan',
      'Sort by a custom key or comparator, including multi-field sorts',
      'Understand why stability matters and when to rely on it',
      'Avoid a full sort when only the top-k elements are needed',
      'Use coordinate compression to shrink sparse values into dense ranks',
      'Pair sorting with greedy choices and with two pointers to solve classic problems in O(n log n)'
    ],
    difficulty: {
      level: 2,
      prerequisites: ['array-basics']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'SortingOrderIllustration',
    caption: 'A scattered row of values sliding into order, unlocking a single clean pass',
    alt: 'Diagram showing unsorted values rearranging into sorted order',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'A surprising number of hard-looking array problems have a boring first move that makes everything else easy: '
        },
        {
          type: 'bold',
          text: 'sort it first.'
        },
        {
          type: 'text',
          text: " Once the data is in order, comparisons that needed a nested loop often collapse into a single pass — you just have to know which sort, and what to do once it's sorted."
        }
      ]
    }
  ],

  sections: [
    {
      id: 'the-problem',
      number: 1,
      title: 'The Move That Simplifies Everything First',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Say you're given a list of numbers and need to know: do any two of them add up to a target? The brute-force way checks every pair."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `nums = [11, 2, 15, 7]
target = 9

def has_pair(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return True
    return False`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "O(n²), same shape as the hashing problems. But there's a second way in: sort the array first. Once it's ordered, the smallest and largest elements sit at the ends, and moving inward from both sides lets you reason about the sum without rechecking pairs you've already ruled out. Sorting doesn't just reorder data — it exposes structure that a nested loop can't see."
            }
          ]
        }
      ]
    },

    {
      id: 'custom-sorting',
      number: 2,
      title: 'Sorting on Your Own Terms',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "The default sort — smallest to largest — is rarely the sort you actually need. Most problems want order by something derived: a meeting's start time, a string's length, the second element of a pair. Any sort function that takes a key or comparator can do this."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `meetings = [(9, 10), (13, 15), (10, 12)]

meetings.sort(key=lambda m: m[0])
# [(9, 10), (10, 12), (13, 15)]  — sorted by start time`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "You can sort by more than one field too, just by returning a tuple from the key function — sort by category first, then by price within each category:"
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `items = [("fruit", 3.5), ("dairy", 2.0), ("fruit", 1.2)]

items.sort(key=lambda item: (item[0], item[1]))
# [("dairy", 2.0), ("fruit", 1.2), ("fruit", 3.5)]`
        },
        {
          type: 'concept-ref',
          conceptId: 'customSorting'
        }
      ]
    },

    {
      id: 'stable-sorting',
      number: 3,
      title: 'Order Among Equals',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Once you sort by more than one thing, a quiet question shows up: when two elements are equal on the key you're sorting by, which one comes first? A stable sort answers: whichever one came first before you sorted."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `students = [("Amir", 90), ("Beth", 85), ("Cy", 90)]

students.sort(key=lambda s: -s[1])
# [("Amir", 90), ("Cy", 90), ("Beth", 85)]
# Amir still comes before Cy — their original order survived the tie`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "This is what makes multi-key sorting possible without a tuple key at all: sort by the minor key first, then sort by the major key. Because the sort is stable, the minor-key order survives as the tiebreaker inside each major-key group. Python's sort, Java's Collections.sort, and most standard library sorts are stable by default — but it's worth checking, because an unstable sort will silently scramble ties."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'stableSorting'
        }
      ]
    },

    {
      id: 'partial-sorting',
      number: 4,
      title: "Not Everything Needs to Be Fully Sorted",
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'If you only need the 3 smallest values out of a million, sorting the whole million is wasted work — you paid for an ordering of everything and only used a sliver of it.'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `import heapq

nums = [7, 2, 9, 4, 1, 8]

three_smallest = heapq.nsmallest(3, nums)
# [1, 2, 4] — found without sorting the other three values`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "A heap of size k tracks only the k best candidates seen so far, giving you the top-k in O(n log k) instead of O(n log n). Quickselect is the other tool for this shape of problem — it finds the k-th smallest element in O(n) on average by partitioning around a pivot and only recursing into the side that contains the answer, the same idea as quicksort but throwing away the half you don't need."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'partialSorting'
        }
      ]
    },

    {
      id: 'coordinate-compression',
      number: 5,
      title: 'Turning Big Numbers Into Small Ranks',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Some algorithms — a Fenwick tree, a difference array, a DP table indexed by value — need to use a value as an array index. That's fine when values are small and dense, but breaks down when they're huge or sparse, like coordinates in the millions with only a handful actually used."
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Coordinate compression fixes this by only caring about relative order. Sort the unique values, then replace each original value with its position in that sorted list."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `values = [1000000, 7, 350000, 7, 42]

sorted_unique = sorted(set(values))
# [7, 42, 350000, 1000000]

rank = {v: i for i, v in enumerate(sorted_unique)}
compressed = [rank[v] for v in values]
# [3, 0, 2, 0, 1]`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Now the values fit in a dense array of size 4 instead of an array sized for a million, and every comparison that mattered — which value is bigger, which is equal — is preserved exactly."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'coordinateCompression'
        }
      ]
    },

    {
      id: 'sorting-greedy',
      number: 6,
      title: 'Sort First, Then Grab Greedily',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Some problems ask you to pick as many non-overlapping items as possible — the classic version being meetings that can't overlap on one calendar. Checking every combination is exponential. But sort the meetings by when they end, and a simple greedy rule works: always take the next meeting that starts after the last one you took ends."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `meetings = [(1, 3), (2, 4), (5, 7), (6, 8)]

meetings.sort(key=lambda m: m[1])  # sort by end time

count = 0
last_end = float('-inf')
for start, end in meetings:
    if start >= last_end:
        count += 1
        last_end = end
# count == 2  → (1, 3) then (5, 7)`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Sorting by end time is what makes the greedy choice safe: the meeting that finishes soonest always leaves the most room for whatever comes after, so taking it first is never a worse choice than taking any other meeting first. Without the sort, there's no obvious order to be greedy in."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'sortingGreedy'
        }
      ]
    },

    {
      id: 'sorting-two-pointers',
      number: 7,
      title: 'Sort First, Then Walk Inward',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Back to the pair-sum problem from the start. Once the array is sorted, put one pointer at the left end and one at the right end. If the two values sum to more than the target, the right one is too big — move it left. If they sum to less, the left one is too small — move it right. Every step rules out a whole row or column of pairs at once."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def has_pair_sorted(nums, target):
    nums = sorted(nums)
    left, right = 0, len(nums) - 1

    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return True
        elif total < target:
            left += 1
        else:
            right -= 1
    return False`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "This is the same idea behind 3Sum: fix one number, then run this exact two-pointer sweep on the rest. The sort turns 'search for a pair' into 'walk two pointers toward each other,' which is O(n log n) total instead of O(n²) — and it generalizes to problems like finding the pair closest to a target, or counting pairs below a threshold, without changing the core loop."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'sortingTwoPointers'
        }
      ]
    },

    {
      id: 'why-faster',
      number: 8,
      title: 'Why This Is Faster',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Sorting costs O(n log n) up front, but it buys structure — once order is guaranteed, most problems that needed nested loops or exponential search collapse into a single linear pass.'
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `Pair sum check:        O(n²) nested scan     →  O(n log n) sort + O(n) two pointers
Top-k elements:         O(n log n) full sort   →  O(n log k) with a heap
Interval scheduling:    exponential combos     →  O(n log n) sort + O(n) greedy
Sparse-value indexing:  array sized by value    →  O(n log n) sort + O(1) rank lookup`
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
                  text: 'You spend '
                },
                {
                  type: 'bold',
                  text: 'O(n log n) up front'
                },
                {
                  type: 'text',
                  text: " to sort, and in exchange give up the original ordering — so this only helps when the original order didn't matter, or you can recover it (e.g. by sorting indices instead of values)."
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'when-to-use',
      number: 9,
      title: 'When to Reach for This',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "If a problem doesn't care about the original order of elements, or explicitly asks for extremes, ranks, or non-overlapping selections, sorting first is almost always worth trying:"
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `• Finding pairs/triples that hit a target sum (sort + two pointers)
• Scheduling or selecting the max non-overlapping items (sort + greedy)
• Top-k, k-th largest/smallest (partial sorting)
• Multi-level ordering — by category, then by date, then by name (stable sort)
• Values are huge or sparse but only relative order matters (coordinate compression)
• Merging or comparing intervals`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "It stops being the right tool when the original positions matter and can't be tracked alongside the sort, or when the problem needs true O(n) and even O(n log n) is too slow — those cases usually call for hashing or a linear-time scan instead."
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
      title: 'Hashing',
      description: 'The other default first move — trade sorted structure for instant lookup when you need O(1) instead of O(log n).',
      url: '/deep-dive/hashing',
      slug: 'hashing',
      relationship: 'related'
    },
    {
      type: 'article',
      title: 'Two Pointers Technique',
      description: 'A closer look at the pointer-walking pattern that pairs so naturally with a sorted array.',
      url: '/deep-dive/two-pointers',
      slug: 'two-pointers',
      relationship: 'related'
    },
    {
      type: 'article',
      title: 'Fixed Sliding Window',
      description: 'Another linear-scan technique, useful when a problem needs a moving range rather than two pointers converging.',
      url: '/deep-dive/fixed-sliding-window',
      slug: 'fixed-sliding-window',
      relationship: 'related'
    }
  ]
};