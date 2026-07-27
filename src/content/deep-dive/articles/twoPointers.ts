// src/content/deep-dive/articles/two-pointers.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Passive reference entries surfaced via ConceptReferenceBlock —
 * the prose never depends on the reader opening them.
 */
const glossary: Record<string, Concept> = {
  oppositeEnds: {
    id: 'oppositeEnds',
    term: 'Opposite Ends',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'One pointer starts at the front, one starts at the back, and they move toward each other — useful whenever sorted order tells you which side to move.'
          }
        ]
      }
    ],
    examples: [
      'left, right = 0, len(nums) - 1'
    ],
    relatedConceptIds: ['fastSlowPointers']
  },
  fastSlowPointers: {
    id: 'fastSlowPointers',
    term: 'Same Direction (Fast/Slow)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Both pointers move forward from the same side, but at different speeds or under different conditions — one marks where the next valid element should go, the other scans ahead looking for it.'
          }
        ]
      }
    ],
    examples: [
      'slow tracks the write position, fast scans for the next value worth keeping'
    ],
    relatedConceptIds: ['partitioning']
  },
  partitioning: {
    id: 'partitioning',
    term: 'Partitioning',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Rearranging an array in place around a condition, so everything satisfying it ends up on one side and everything else on the other — without extra storage.'
          }
        ]
      }
    ],
    examples: [
      'Moving all zeroes in an array to the end'
    ],
    relatedConceptIds: ['fastSlowPointers', 'dutchNationalFlag']
  },
  dutchNationalFlag: {
    id: 'dutchNationalFlag',
    term: 'Three Pointers (Dutch National Flag)',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Partitioning into three buckets instead of two, using three pointers — low, mid, and high — that carve the array into "less than," "equal to," and "greater than" sections in a single pass.'
          }
        ]
      }
    ],
    examples: [
      'Sorting an array of only 0s, 1s, and 2s in place'
    ],
    relatedConceptIds: ['partitioning']
  },
  mergePointers: {
    id: 'mergePointers',
    term: 'Merge Two Sorted Arrays',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A pointer on each of two sorted arrays, always advancing whichever one points at the smaller current value — building the merged result without re-sorting anything.'
          }
        ]
      }
    ],
    examples: [
      'i tracks array A, j tracks array B, both only ever move forward'
    ],
    relatedConceptIds: ['oppositeEnds']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'two-pointers',
    name: 'Two Pointers',
    eyebrow: 'ARRAYS · SORTED STRUCTURES',
    description:
      "When an array is sorted (or can be treated as two sorted halves), you rarely need to check every pair. Two indices moving with purpose can do the job in a single pass.",
    category: 'algorithms',
    tags: ['Two Pointers', 'Arrays', 'Sorting', 'In-Place', 'Data Structures'],

    published: true,
    draft: false,
    version: '1.0.0',
    publishedAt: '2026-07-27',
    updatedAt: '2026-07-27',

    estimatedReadingMinutes: 10,
    credit: 'Provided by',
    creditOrg: 'Algorithm Deep Dives',

    keywords: [
      'Two Pointers',
      'Opposite Ends',
      'Fast Slow Pointers',
      'Partitioning',
      'Merge Sorted Arrays',
      'Container With Most Water',
      'Dutch National Flag',
      'Squares of a Sorted Array'
    ],
    aliases: ['Left-Right Pointers', 'Converging Pointers'],
    learningObjectives: [
      'Use opposite-end pointers to avoid checking every pair in a sorted array',
      'Use fast/slow pointers to rewrite an array in place without extra memory',
      'Partition an array around one or two conditions in a single pass',
      'Recognize when two pointers beat sorting, hashing, or brute force'
    ],
    difficulty: {
      level: 1,
      prerequisites: ['array-basics']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'TwoPointersIllustration',
    caption: 'Two indices moving through an array with intent instead of checking every pair',
    alt: 'Diagram showing two pointer arrows converging across a sorted array',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "If an array is sorted, you already know something the brute-force solution throws away: moving left makes values smaller, moving right makes them bigger. Two pointers exist to "
        },
        {
          type: 'bold',
          text: 'use that fact'
        },
        {
          type: 'text',
          text: ' instead of checking every pair to rediscover it.'
        }
      ]
    }
  ],

  sections: [
    {
      id: 'the-problem',
      number: 1,
      title: "You Already Know Which Way to Move",
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Say you need two numbers in a sorted array that add up to a target. Brute force checks every pair:'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `nums = [2, 7, 11, 15]
target = 18

for i in range(len(nums)):
    for j in range(i + 1, len(nums)):
        if nums[i] + nums[j] == target:
            return [i, j]`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "That ignores something useful: the array is sorted. If the current pair sums too high, you know the bigger number is the problem — no need to check it against anything else. If it sums too low, the smaller number is the problem. You never need to ask \"which side should I move?\" — sorted order already answered it."
            }
          ]
        }
      ]
    },

    {
      id: 'opposite-ends',
      number: 2,
      title: 'Opposite Ends: Start Wide, Close In',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Put one pointer at the front, one at the back. Look at the sum: too big, move the right pointer in; too small, move the left pointer in; just right, done.'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        total = nums[left] + nums[right]
        if total == target:
            return [left, right]
        elif total < target:
            left += 1
        else:
            right -= 1`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Each step throws away exactly the pairs that couldn't possibly work, instead of checking them. The two pointers close the gap between them once per step, so they meet in at most n steps total."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'oppositeEnds'
        }
      ]
    },

    {
      id: 'container-with-most-water',
      number: 3,
      title: 'Same Idea, Different Question: Container With Most Water',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Opposite ends isn't just for sums. Given a row of walls of different heights, find the two walls that trap the most water between them — area is the shorter wall's height times the distance between them."
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Start with the widest possible container: leftmost and rightmost wall. The shorter of the two is what's limiting the water — moving it inward is the only move that could possibly find something bigger, since the width can only shrink from here and the taller wall was never the bottleneck."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def max_area(heights):
    left, right = 0, len(heights) - 1
    best = 0

    while left < right:
        width = right - left
        area = width * min(heights[left], heights[right])
        best = max(best, area)

        if heights[left] < heights[right]:
            left += 1
        else:
            right -= 1

    return best`
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Why moving the shorter wall is safe',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Any container using the current left and the taller wall\'s position would still be capped by the shorter wall\'s height — moving the taller wall inward can only shrink the width for no gain. Moving the shorter one is the only choice that could improve things.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'fast-slow',
      number: 4,
      title: 'Same Direction: One Pointer Writes, One Pointer Scans',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Opposite ends works when two ends are meaningful. Some problems need both pointers moving the same direction instead — say, removing duplicates from a sorted array in place."
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'One pointer (slow) marks the last position you know is correct. The other (fast) scans ahead looking for the next value worth keeping. When fast finds one, it gets written just after slow, and slow moves up.'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def remove_duplicates(nums):
    slow = 0
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:
            slow += 1
            nums[slow] = nums[fast]
    return slow + 1  # new length`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "fast does all the looking, slow does all the keeping. Neither pointer ever backtracks, so the whole array gets rewritten in one pass with no extra storage."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'fastSlowPointers'
        }
      ]
    },

    {
      id: 'partitioning',
      number: 5,
      title: 'Sorting Into Buckets Without Extra Space',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Fast/slow pointers generalize into partitioning: pushing everything that matches a condition to one side of the array. Moving all zeroes to the end looks almost identical to removing duplicates — slow marks where the next non-zero belongs, fast scans for one:'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def move_zeroes(nums):
    slow = 0
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Now push it one step further: what if there are three buckets instead of two — say, sorting an array of only 0s, 1s, and 2s? Two pointers aren't enough to track three regions, so add a third. low marks the boundary of the \"0s so far\" section, high marks the boundary of the \"2s so far\" section, and mid scans everything in between."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def sort_colors(nums):
    low, mid, high = 0, 0, len(nums) - 1

    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 2:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            # don't advance mid — the swapped-in value is unchecked
        else:
            mid += 1`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "The one subtlety: swapping with high brings an unchecked value into mid's position, so mid has to stay put and look at it again. Swapping with low is safe to advance past, because everything low swaps in has already been checked."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'partitioning'
        },
        {
          type: 'concept-ref',
          conceptId: 'dutchNationalFlag'
        }
      ]
    },

    {
      id: 'merging-and-building',
      number: 6,
      title: 'Two Pointers, Two Arrays',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "So far both pointers shared one array. They can just as easily each own a separate array — merging two sorted arrays is the clearest example. Advance whichever pointer is looking at the smaller value, and the merged result comes out sorted for free."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def merge_sorted(a, b):
    i, j = 0, 0
    merged = []

    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            merged.append(a[i])
            i += 1
        else:
            merged.append(b[j])
            j += 1

    merged.extend(a[i:])
    merged.extend(b[j:])
    return merged`
        },
        {
          type: 'concept-ref',
          conceptId: 'mergePointers'
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Opposite ends shows up here too, just less obviously — squaring every element of a sorted array (which can contain negatives) and returning the result sorted. The largest square is always at one of the two ends, never in the middle, because squaring a negative flips it positive. So fill the result array from the back, comparing |nums[left]| and |nums[right]| and taking whichever is bigger:"
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def sorted_squares(nums):
    left, right = 0, len(nums) - 1
    result = [0] * len(nums)

    for pos in range(len(nums) - 1, -1, -1):
        if abs(nums[left]) > abs(nums[right]):
            result[pos] = nums[left] ** 2
            left += 1
        else:
            result[pos] = nums[right] ** 2
            right -= 1

    return result`
        }
      ]
    },

    {
      id: 'why-faster',
      number: 7,
      title: 'Why This Is Faster',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Every variant above replaces a nested loop — or a sort, or an extra array — with two (or three) indices that only ever move forward.'
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `Pair sum in sorted array:  O(n²) brute force  →  O(n) opposite ends
Container with most water: O(n²) all pairs     →  O(n) opposite ends
Remove duplicates:         O(n) + O(n) space   →  O(n), O(1) space with fast/slow
Merge two sorted arrays:   O((n+m) log(n+m)) if re-sorted → O(n + m) with two pointers`
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'The pattern underneath',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Every pointer in this article moves forward and never backtracks — that\'s what keeps all of these at O(n) instead of O(n²): each element is visited a constant number of times, total.'
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
              text: "Two pointers need some structure to exploit — sortedness, or an in-place rewrite, or two already-sorted inputs. Reach for it when you see:"
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `• Pair-sum or pair-comparison problems on a sorted array
• Squaring, reversing, or palindrome checks on a sorted or symmetric array
• Removing/rewriting elements in place under a condition
• Partitioning into 2 or 3 buckets in a single pass
• Merging two sorted arrays or lists
• Maximizing an area/volume bounded by two shrinking edges`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'It breaks down when the array isn\'t sorted and sortedness isn\'t something you can create cheaply, or when the answer depends on '
            },
            {
              type: 'bold',
              text: 'which'
            },
            {
              type: 'text',
              text: ' elements matched rather than just whether a valid pair or partition exists — at that point a hash map\'s O(1) lookup usually fits better than a converging scan.'
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
      description: 'An alternative to two pointers when the array is unsorted, trading extra space for O(1) lookups instead of sorted structure.',
      url: '/deep-dive/hashing',
      slug: 'hashing',
      relationship: 'related'
    },
    {
      type: 'article',
      title: 'Fixed Sliding Window',
      description: 'A close cousin of same-direction pointers, for problems with an explicit window length instead of a condition to partition around.',
      url: '/deep-dive/fixed-sliding-window',
      slug: 'fixed-sliding-window',
      relationship: 'related'
    }
  ]
};