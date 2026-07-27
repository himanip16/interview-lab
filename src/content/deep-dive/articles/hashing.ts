// src/content/deep-dive/articles/hashing.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Passive reference entries surfaced via ConceptReferenceBlock —
 * the prose never depends on the reader opening them.
 */
const glossary: Record<string, Concept> = {
  hashFunction: {
    id: 'hashFunction',
    term: 'Hash Function',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A small computation that turns a value into a bucket number, so a hash table can jump straight to where that value should live instead of scanning for it.'
          }
        ]
      }
    ],
    examples: [
      '104 → hash() → Bucket 3'
    ],
    relatedConceptIds: ['collision', 'hashSet', 'hashMap']
  },
  collision: {
    id: 'collision',
    term: 'Collision',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: "When two different values hash to the same bucket. Hash tables handle this internally (chaining, open addressing), which is why lookups stay O(1) on average rather than always."
          }
        ]
      }
    ],
    examples: [
      '18 → Bucket 4, 42 → Bucket 4'
    ],
    relatedConceptIds: ['hashFunction']
  },
  hashSet: {
    id: 'hashSet',
    term: 'Hash Set',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A collection that only tracks whether something has been seen — checking, adding, and removing all happen in O(1) on average.'
          }
        ]
      }
    ],
    examples: [
      "seen = set(); if x in seen: ... else: seen.add(x)"
    ],
    relatedConceptIds: ['duplicateDetection', 'hashMap', 'hashFunction']
  },
  hashMap: {
    id: 'hashMap',
    term: 'Hash Map',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Like a hash set, but each key also stores a value — an index, a count, a running total — so you get more than a yes/no answer back.'
          }
        ]
      }
    ],
    examples: [
      'counts = {}; counts[x] = counts.get(x, 0) + 1'
    ],
    relatedConceptIds: ['hashSet', 'complementLookup', 'prefixHashing']
  },
  duplicateDetection: {
    id: 'duplicateDetection',
    term: 'Duplicate Detection',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Instead of comparing every pair of elements, remember what you\'ve already visited and check new elements against that memory.'
          }
        ]
      }
    ],
    examples: [
      'Finding the first repeated value in a list in one pass'
    ],
    relatedConceptIds: ['hashSet']
  },
  complementLookup: {
    id: 'complementLookup',
    term: 'Complement Lookup',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Instead of asking "does a pair exist?", ask "if I already have one half, does the other half exist?" — then check for that other half in a map you\'ve been filling in as you go.'
          }
        ]
      }
    ],
    examples: [
      'Two Sum: for each num, look up target - num'
    ],
    relatedConceptIds: ['hashMap']
  },
  prefixHashing: {
    id: 'prefixHashing',
    term: 'Prefix Hashing',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'Store running totals (prefix sums) in a hash map as you scan, so you can instantly check whether some earlier running total would make the sum between two points equal a target.'
          }
        ]
      }
    ],
    examples: [
      'Subarray Sum Equals K: look up prefix_sum - k in a running map'
    ],
    relatedConceptIds: ['hashMap', 'complementLookup']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'hashing',
    name: 'Hashing',
    eyebrow: 'ARRAYS · LOOKUPS',
    description:
      "Most brute-force array problems boil down to one repeated question: 'have I seen this before?' A hash set or map answers that in O(1) instead of scanning everything again.",
    category: 'algorithms',
    tags: ['Hashing', 'Hash Set', 'Hash Map', 'Arrays', 'Data Structures'],

    published: true,
    draft: false,
    version: '1.1.0',
    publishedAt: '2026-07-27',
    updatedAt: '2026-07-27',

    estimatedReadingMinutes: 11,
    credit: 'Provided by',
    creditOrg: 'Algorithm Deep Dives',

    keywords: [
      'Hashing',
      'Hash Set',
      'Hash Map',
      'Hash Function',
      'Collision',
      'Duplicate Detection',
      'Two Sum',
      'Complement Lookup',
      'Prefix Sum',
      'Subarray Sum Equals K'
    ],
    aliases: ['Hash Table', 'Hash-Based Lookup'],
    learningObjectives: [
      'Understand why hash table lookups run in O(1) on average',
      'Recognize when a brute-force pair or lookup check can become O(1)',
      'Use a hash set to detect duplicates in a single pass',
      'Use a hash map + complement lookup to solve pair-sum problems',
      'Use prefix hashing to answer subarray-sum questions without rescanning'
    ],
    difficulty: {
      level: 1,
      prerequisites: ['array-basics']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'HashLookupIllustration',
    caption: 'A value going in, a bucket lighting up, and an answer coming back in O(1)',
    alt: 'Diagram showing values mapping into hash buckets for constant-time lookup',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'A lot of array problems are really the same question in disguise: '
        },
        {
          type: 'bold',
          text: '"have I seen this before?"'
        },
        {
          type: 'text',
          text: " Checking that by scanning the whole array every time is slow. Hashing answers it instantly, because you're not searching — you're just checking if a spot exists."
        }
      ]
    }
  ],

  sections: [
    {
      id: 'the-problem',
      number: 1,
      title: 'The Question Hiding in Half of Array Problems',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Say you're checking a list of ticket numbers for a duplicate. The obvious way: for every ticket, scan every other ticket and compare."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `tickets = [104, 209, 315, 104, 512]

def has_duplicate(tickets):
    for i in range(len(tickets)):
        for j in range(i + 1, len(tickets)):
            if tickets[i] == tickets[j]:
                return True
    return False`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "This works, but every ticket gets compared against every other ticket — that's O(n²) comparisons for something that feels like it should be simple: has this number shown up already, yes or no?"
            }
          ]
        }
      ]
    },

    {
      id: 'how-hashing-works',
      number: 2,
      title: 'How Can It Find Something So Quickly?',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Imagine you're storing books in a library. If you simply place every new book on the next empty shelf, then finding a book later means walking through shelf after shelf until you spot it."
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'A hash table works differently. Instead of searching every shelf, it first runs the value through a '
            },
            {
              type: 'bold',
              text: 'hash function'
            },
            {
              type: 'text',
              text: ' — a small computation that turns the value into a bucket number.'
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `104 ──► hash() ──► Bucket 3
209 ──► hash() ──► Bucket 7
315 ──► hash() ──► Bucket 1
104 ──► hash() ──► Bucket 3`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'When you later ask, "Have I seen 104?", the hash function produces Bucket 3 again. Instead of checking every stored value, the hash table jumps straight to Bucket 3 and checks only what\'s there. That\'s why lookups are O(1) on average — the amount of work doesn\'t grow with the total number of elements.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'hashFunction'
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "What If Two Values Pick the Same Bucket?"
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Buckets aren't unique. Sometimes different values produce the same bucket."
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `18 ──► Bucket 4
42 ──► Bucket 4`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is called a '
            },
            {
              type: 'bold',
              text: 'collision'
            },
            {
              type: 'text',
              text: '. Hash tables store both values in that bucket using an internal strategy, such as chaining or open addressing. Because collisions are relatively uncommon with a good hash function and a well-sized table, lookups stay O(1) on average rather than always. The implementation details aren\'t important for solving interview problems — the important idea is that the table can still find the right value without scanning everything.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'collision'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'The core idea',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: "Hashing doesn't make searching faster by searching more cleverly. It avoids searching almost entirely. Instead of asking \"where is this value?\", it computes where the value should be and goes directly there."
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'hash-set',
      number: 3,
      title: "A List That Remembers What's Already On It",
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Think of a guest list at a door. Instead of checking a new arrival's name against every name already inside, you keep the list somewhere you can check instantly — a hash set does exactly that: checking membership doesn't depend on how many names are already in it."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def has_duplicate(tickets):
    seen = set()
    for ticket in tickets:
        if ticket in seen:
            return True
        seen.add(ticket)
    return False`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'One pass. Each ticket gets checked and added exactly once, and both operations are O(1) on average. The nested loop is gone entirely.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'hashSet'
        },
        {
          type: 'concept-ref',
          conceptId: 'duplicateDetection'
        }
      ]
    },

    {
      id: 'complement-lookup',
      number: 4,
      title: "If I Have Half the Answer, Does the Other Half Exist?",
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'A set tells you yes or no. But a lot of problems ask something slightly bigger: find two numbers that add up to a target. The brute-force version checks every pair:'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `nums = [2, 7, 11, 15]
target = 9

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
              text: "Flip the question around. For each number, you already know what its partner would have to be — target minus the number you're holding. So instead of searching for a pair, just ask: \"have I already seen the number that would complete this pair?\""
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def two_sum(nums, target):
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is where a plain set stops being enough — you need the index too, not just "yes, it exists." That extra bit of storage is the whole difference between a set and a map.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'complementLookup'
        },
        {
          type: 'concept-ref',
          conceptId: 'hashMap'
        }
      ]
    },

    {
      id: 'prefix-hashing',
      number: 5,
      title: 'Doing the Same Trick for Sums Instead of Values',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Now stretch the idea further: find a contiguous subarray that sums to exactly k. The brute-force version recomputes the sum of every possible subarray — O(n²) or worse.'
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Keep a running total as you scan left to right. If the running total right now is 20, and at some earlier point it was 8, then everything between those two points sums to 12. So the question \"is there a subarray ending here that sums to k\" becomes: \"have I seen the running total (current total - k) before?\" — the exact same complement lookup, just applied to running sums instead of raw values."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def subarray_sum_equals_k(nums, k):
    prefix_counts = {0: 1}  # empty prefix sums to 0
    running_sum = 0
    count = 0

    for num in nums:
        running_sum += num
        count += prefix_counts.get(running_sum - k, 0)
        prefix_counts[running_sum] = prefix_counts.get(running_sum, 0) + 1

    return count`
        },
        {
          type: 'concept-ref',
          conceptId: 'prefixHashing'
        }
      ]
    },

    {
      id: 'why-faster',
      number: 6,
      title: 'Why This Is Faster',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Every one of these problems has the same shape underneath: brute force re-scans everything for every element, hashing lets you check 'have I seen this' in one step instead."
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `Duplicate check:        O(n²) nested scan  →  O(n) with a hash set
Two Sum:                O(n²) pair check    →  O(n) with a hash map
Subarray Sum Equals K:  O(n²) sum recompute →  O(n) with prefix hashing`
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
                  text: 'You trade '
                },
                {
                  type: 'bold',
                  text: 'O(n) extra space'
                },
                {
                  type: 'text',
                  text: ' for storing what you\'ve seen, in exchange for turning repeated scans into single lookups.'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: 'when-to-use',
      number: 7,
      title: 'When to Reach for This',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "If a brute-force solution has a nested loop whose inner loop is just checking \"does this exist / have I seen this,\" that inner loop is almost always replaceable with a hash lookup:"
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `• Detecting duplicates in one pass
• Two Sum / pair-sum problems (complement lookup)
• Counting frequencies of elements
• Subarray sum equals k (prefix hashing)
• Longest subarray with a given sum
• Grouping items by a computed key (anagrams, remainders)`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'It stops being the right tool when order matters and you can\'t just check existence — for example, finding the smallest window that contains certain characters needs both a hash map '
            },
            {
              type: 'bold',
              text: 'and'
            },
            {
              type: 'text',
              text: ' a sliding window working together, not hashing alone.'
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
      title: 'Fixed Sliding Window',
      description: "Combine with hashing when a problem needs both a window and a lookup — like counting distinct elements per window.",
      url: '/deep-dive/fixed-sliding-window',
      slug: 'fixed-sliding-window',
      relationship: 'related'
    },
    {
      type: 'article',
      title: 'Two Pointers Technique',
      description: 'An alternative to hashing for sorted-array pair problems, trading extra space for no extra memory at all.',
      url: '/deep-dive/two-pointers',
      slug: 'two-pointers',
      relationship: 'related'
    }
  ]
};