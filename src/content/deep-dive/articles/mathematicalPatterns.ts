// src/content/deep-dive/articles/mathematical-patterns.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Passive reference entries surfaced via ConceptReferenceBlock —
 * the prose never depends on the reader opening them.
 */
const glossary: Record<string, Concept> = {
  cyclicSort: {
    id: 'cyclicSort',
    term: 'Cyclic Sort',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: "A placement technique for arrays whose values are known to fall in a bounded range like [1, n]: repeatedly swap each element toward the index it 'belongs' at until every value sits where it should, in O(n) time and O(1) extra space."
          }
        ]
      }
    ],
    examples: [
      'nums[i], nums[correct] = nums[correct], nums[i]'
    ],
    relatedConceptIds: ['missingPositive']
  },
  missingPositive: {
    id: 'missingPositive',
    term: 'Missing Positive',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Finding the smallest positive integer not present in an array — solved by cyclic-sorting values into their correct slots first, then scanning once for the first slot that disagrees with its expected value.'
          }
        ]
      }
    ],
    examples: [
      '[3, 4, -1, 1] → 1 is at index 0, 2 is missing → answer 2'
    ],
    relatedConceptIds: ['cyclicSort']
  },
  arrayGcd: {
    id: 'arrayGcd',
    term: 'GCD on Arrays',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: "The greatest common divisor of an entire array, computed by folding gcd across all elements — gcd(a, b, c) = gcd(gcd(a, b), c) — since gcd is associative and commutative."
          }
        ]
      }
    ],
    examples: [
      'reduce(gcd, [12, 18, 30]) → 6'
    ],
    relatedConceptIds: ['prefixGcd']
  },
  prefixGcd: {
    id: 'prefixGcd',
    term: 'Prefix GCD',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: "A running array where each entry is the gcd of all elements up to that point. Because adding more numbers can only keep the gcd the same or shrink it, the sequence is monotonically non-increasing."
          }
        ]
      }
    ],
    examples: [
      '[12, 18, 30] → prefix gcd [12, 6, 6]'
    ],
    relatedConceptIds: ['arrayGcd', 'prefixLcm']
  },
  prefixLcm: {
    id: 'prefixLcm',
    term: 'Prefix LCM',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A running array where each entry is the least common multiple of all elements up to that point. Since adding more numbers can only keep the LCM the same or grow it, the sequence is monotonically non-decreasing — the mirror image of prefix GCD.'
          }
        ]
      }
    ],
    examples: [
      '[2, 3, 4] → prefix lcm [2, 6, 12]'
    ],
    relatedConceptIds: ['prefixGcd']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'mathematical-patterns',
    name: 'Mathematical Patterns',
    eyebrow: 'ARRAYS · NUMBER THEORY',
    description:
      "Some array problems aren't really about scanning or comparing — they're about a number-theoretic property hiding in the data. This deep dive covers cyclic sort for bounded-range arrays, finding a missing positive in O(1) space, and how GCD and LCM extend into prefix arrays with useful monotonic behavior.",
    category: 'algorithms',
    tags: ['Cyclic Sort', 'GCD', 'LCM', 'Arrays', 'Number Theory'],

    published: true,
    draft: false,
    version: '1.0.0',
    publishedAt: '2026-07-27',
    updatedAt: '2026-07-27',

    estimatedReadingMinutes: 11,
    credit: 'Provided by',
    creditOrg: 'Algorithm Deep Dives',

    keywords: [
      'Cyclic Sort',
      'Missing Positive',
      'First Missing Positive',
      'GCD',
      'Greatest Common Divisor',
      'LCM',
      'Least Common Multiple',
      'Prefix GCD',
      'Prefix LCM',
      'Number Theory'
    ],
    aliases: ['Number Theory Patterns', 'GCD/LCM Techniques'],
    learningObjectives: [
      'Use cyclic sort to place bounded-range values in O(n) time and O(1) space',
      'Find the first missing positive integer without extra memory',
      'Compute the GCD of an entire array by folding pairwise GCDs',
      'Build a prefix GCD array and use its non-increasing property',
      'Build a prefix LCM array and use its non-decreasing property'
    ],
    difficulty: {
      level: 2,
      prerequisites: ['array-basics']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'CyclicSortIllustration',
    caption: 'Each value swapping into the slot that matches its own number',
    alt: 'Diagram showing array elements rotating into index positions that match their values',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'A handful of array problems aren\'t solved by scanning, hashing, or sorting in the usual sense — they\'re solved by noticing a '
        },
        {
          type: 'bold',
          text: 'numeric property'
        },
        {
          type: 'text',
          text: " hiding in the data: values that map directly to indices, or a divisor relationship that holds across the whole array. Once you see it, the brute-force solution often collapses to O(n) time and O(1) extra space."
        }
      ]
    }
  ],

  sections: [
    {
      id: 'the-problem',
      number: 1,
      title: 'When the Array Itself Is the Hash Table',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Say you're given an array of n numbers, each somewhere between 1 and n, possibly with duplicates or gaps, and asked to find the smallest positive integer missing from it. The obvious approach reaches for a hash set:"
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def first_missing_positive(nums):
    present = set(nums)
    i = 1
    while i in present:
        i += 1
    return i`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "That's O(n) time, which is fine — but it costs O(n) extra space for the set. There's a detail worth noticing: the values themselves are bounded to roughly [1, n], the same size as the array. That means every value already has a natural home — value v belongs at index v - 1. If you could get every number into its own slot using the array as your own storage, you wouldn't need a hash set at all."
            }
          ]
        }
      ]
    },

    {
      id: 'cyclic-sort',
      number: 2,
      title: 'Putting Every Value in Its Own Seat',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Cyclic sort takes advantage of exactly that: when values are drawn from a range the same size as the array, you can place each one where it belongs with a swap, and repeat until nothing's left to swap."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def cyclic_sort(nums):
    i = 0
    while i < len(nums):
        correct = nums[i] - 1
        if 0 <= correct < len(nums) and nums[i] != nums[correct]:
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1
    return nums`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "The pointer i only advances once the value sitting at i is already correct — otherwise it swaps the misplaced value directly to its home and checks again without moving forward. Every swap puts at least one number in its final position, so no value gets swapped more than once, which is what keeps the whole pass at O(n) despite the inner loop."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'cyclicSort'
        }
      ]
    },

    {
      id: 'missing-positive',
      number: 3,
      title: 'Finding the Missing Positive, No Extra Memory',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Once cyclic sort has run, a single pass reveals the answer: the first index where the value doesn't match its slot is exactly the missing number, because every value that could have gone there would have been swapped in."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def first_missing_positive(nums):
    n = len(nums)
    i = 0
    while i < n:
        correct = nums[i] - 1
        if 0 < nums[i] <= n and nums[i] != nums[correct]:
            nums[i], nums[correct] = nums[correct], nums[i]
        else:
            i += 1

    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    return n + 1  # every slot was correct — the array was [1, 2, ..., n]`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Values outside [1, n] — negatives, zero, duplicates, anything too large — simply have nowhere valid to go, so the swap condition skips them and they stay put. That's fine: they could never have been the answer anyway, since the missing positive is always somewhere in [1, n + 1]."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'missingPositive'
        }
      ]
    },

    {
      id: 'gcd-arrays',
      number: 4,
      title: 'When the Question Is About Divisibility, Not Order',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "A different family of problems isn't about position at all — it's about what divides everything in the array. \"Can every element be reduced to 1 using divisions by a common factor?\" and \"what's the largest number that evenly divides the whole array?\" are both answered by a single value: the GCD of the array."
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'GCD is associative and commutative, so the GCD of a whole array is just the GCD of the GCDs — fold it across the array one element at a time:'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `from math import gcd
from functools import reduce

def array_gcd(nums):
    return reduce(gcd, nums)

array_gcd([12, 18, 30])  # 6`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is O(n log(min(nums))) — each gcd call is fast, and you only ever fold pairwise, never comparing every pair of elements directly.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'arrayGcd'
        }
      ]
    },

    {
      id: 'prefix-gcd',
      number: 5,
      title: 'A Running GCD That Only Ever Shrinks',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Some problems need the GCD of every prefix, not just the whole array — for example, finding the shortest prefix whose GCD is 1. Compute it the same way you'd compute a running sum, but folding gcd instead of addition:"
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def prefix_gcd(nums):
    prefix = [nums[0]]
    for num in nums[1:]:
        prefix.append(gcd(prefix[-1], num))
    return prefix

prefix_gcd([12, 8, 30])  # [12, 4, 2]`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "The useful property here is monotonicity: adding another number to a GCD can never increase it, only keep it the same or shrink it, since gcd(a, b) always divides a. That means prefix GCD is non-increasing from left to right — which is exactly the shape that lets you binary search for \"the first prefix whose GCD drops to some value\" instead of checking every prefix by hand."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'prefixGcd'
        }
      ]
    },

    {
      id: 'prefix-lcm',
      number: 6,
      title: 'A Running LCM That Only Ever Grows',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Prefix LCM is the mirror image. Where prefix GCD asks "what still divides everything so far," prefix LCM asks "what\'s the smallest number everything so far divides into" — and it grows instead of shrinking as you add more elements.'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def lcm(a, b):
    return a * b // gcd(a, b)

def prefix_lcm(nums):
    prefix = [nums[0]]
    for num in nums[1:]:
        prefix.append(lcm(prefix[-1], num))
    return prefix

prefix_lcm([2, 3, 4])  # [2, 6, 12]`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Because lcm(a, b) is always a multiple of a, the sequence is non-decreasing — the same monotonic shape as prefix GCD, just flipped. That's what makes it useful for questions like \"what's the smallest prefix whose LCM exceeds some limit,\" where the non-decreasing property again turns a linear scan into something binary-searchable."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'prefixLcm'
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
              text: 'Each of these techniques trades a general-purpose approach for one that exploits a specific numeric property already sitting in the problem.'
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `Missing positive:     O(n) time + O(n) space (hash set)  →  O(n) time + O(1) space (cyclic sort)
Array-wide divisor:    checking every pair                →  O(n log(min)) folding gcd
Shortest gcd-1 prefix: O(n) per candidate, checked by hand →  O(log n) binary search on a monotonic prefix array`
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
                  text: 'Cyclic sort '
                },
                {
                  type: 'bold',
                  text: 'reorders the input array in place'
                },
                {
                  type: 'text',
                  text: ' — fine if you don\'t need the original order afterward, but worth copying the array first if you do. Prefix GCD/LCM cost O(n) extra space for the running array, traded for turning repeated recomputation into O(1) lookups.'
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
              text: 'These patterns are narrower than hashing or sorting — they only fire when the problem hands you a specific numeric shape:'
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `• Array values are a permutation-like range [1, n] with possible duplicates/gaps
  (cyclic sort, missing positive, missing number, duplicate number)
• Question is about a common divisor or multiple across all or part of the array
  (array gcd, prefix gcd, prefix lcm)
• You need the shortest/longest prefix or subarray satisfying a divisibility condition
  (monotonic prefix gcd/lcm + binary search or two pointers)`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "It stops being the right tool the moment values fall outside a bounded range (cyclic sort has nowhere to place them) or the question isn't really about divisibility at all — at that point, hashing or plain sorting is usually the better first move."
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
      title: 'Sorting-Based Techniques',
      description: "Cyclic sort is a specialized cousin of general sorting — see how it compares to sorting by a custom key.",
      url: '/deep-dive/sorting-based',
      slug: 'sorting-based',
      relationship: 'related'
    },
    {
      type: 'article',
      title: 'Hashing',
      description: 'The general-purpose alternative to cyclic sort when values aren\'t conveniently bounded to a [1, n] range.',
      url: '/deep-dive/hashing',
      slug: 'hashing',
      relationship: 'related'
    },
    {
      type: 'article',
      title: 'Two Pointers Technique',
      description: 'Pairs naturally with monotonic prefix GCD/LCM arrays for shortest/longest subarray questions.',
      url: '/deep-dive/two-pointers',
      slug: 'two-pointers',
      relationship: 'related'
    }
  ]
};