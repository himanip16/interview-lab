// src/content/deep-dive/articles/sliding-window.ts

import type { DeepDiveArticle, Concept } from '@/features/deep-dive/types';

/**
 * Top-Level Glossary (Single Source of Truth)
 * Passive reference entries surfaced via ConceptReferenceBlock —
 * the prose never depends on the reader opening them.
 */
const glossary: Record<string, Concept> = {
  frequencyMapWindow: {
    id: 'frequencyMapWindow',
    term: 'Window with Frequency Map',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: "A window that tracks not just a single number, but a count of every element or character currently inside it — updated incrementally as the window slides, the same way a running sum is."
          }
        ]
      }
    ],
    examples: [
      'window_counts[char] += 1 on entry, window_counts[char] -= 1 on exit'
    ],
    relatedConceptIds: ['distinctWindow']
  },
  distinctWindow: {
    id: 'distinctWindow',
    term: 'Window with Distinct Characters',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: "A frequency-map window where what matters isn't each count, but how many keys currently have a nonzero count — i.e., how many distinct elements are in the window right now."
          }
        ]
      }
    ],
    examples: [
      'Longest substring with no repeated characters'
    ],
    relatedConceptIds: ['frequencyMapWindow']
  },
  maxMinWindow: {
    id: 'maxMinWindow',
    term: 'Maximum/Minimum Window',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: "A window that needs to answer 'what's the largest (or smallest) value currently inside?' at every position — which a plain running variable can't do, since the max can leave the window."
          }
        ]
      }
    ],
    examples: [
      'The maximum value in every window of size k as it slides across an array'
    ],
    relatedConceptIds: ['monotonicWindow']
  },
  monotonicWindow: {
    id: 'monotonicWindow',
    term: 'Monotonic Window',
    definition: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'A window backed by a deque that only ever stores values in strictly decreasing (or increasing) order — any value that could never become the max gets discarded immediately, so the front of the deque is always the current answer.'
          }
        ]
      }
    ],
    examples: [
      'A newly entering larger value evicts every smaller value behind it in the deque'
    ],
    relatedConceptIds: ['maxMinWindow']
  }
};

export const article: DeepDiveArticle = {
  metadata: {
    slug: 'sliding-window',
    name: 'Sliding Window',
    eyebrow: 'ARRAYS · STRINGS',
    description:
      "A sum is the simplest thing a window can track. Once a window needs to know what's inside it — composition, distinctness, or the max — the same slide-and-update idea still works, it just needs a richer piece of state.",
    category: 'algorithms',
    tags: ['Sliding Window', 'Arrays', 'Strings', 'Hashing', 'Monotonic Deque'],

    published: true,
    draft: false,
    version: '1.0.0',
    publishedAt: '2026-07-27',
    updatedAt: '2026-07-27',

    estimatedReadingMinutes: 11,
    credit: 'Provided by',
    creditOrg: 'Algorithm Deep Dives',

    keywords: [
      'Sliding Window',
      'Fixed Window',
      'Variable Window',
      'Frequency Map',
      'Distinct Characters',
      'Sliding Window Maximum',
      'Monotonic Deque',
      'Longest Substring Without Repeating Characters'
    ],
    aliases: ['Window Techniques', 'Two Pointers Window'],
    learningObjectives: [
      'Tell fixed and variable windows apart by what decides the boundary',
      'Track a window\'s composition with a frequency map instead of a single number',
      'Recognize when "composition" narrows down to just "how many distinct keys"',
      'Use a monotonic deque to get a window\'s max or min in O(1) instead of rescanning it'
    ],
    difficulty: {
      level: 2,
      prerequisites: ['fixed-sliding-window', 'hashing']
    }
  },

  heroDiagram: {
    type: 'diagram',
    renderEngine: 'component',
    componentName: 'SlidingWindowFamilyIllustration',
    caption: 'The same window, carrying progressively richer state as it slides',
    alt: 'Diagram showing a sliding window paired with a counter, then a frequency map, then a deque',
    width: 'full'
  },

  lede: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Every sliding window so far has tracked one number — a sum. But plenty of problems ask harder questions about the window: '
        },
        {
          type: 'bold',
          text: "what's inside it, how many different things are inside it, or what the biggest thing inside it is."
        },
        {
          type: 'text',
          text: ' The slide-and-update idea still works. It just needs to carry more than a single number.'
        }
      ]
    }
  ],

  sections: [
    {
      id: 'the-problem',
      number: 1,
      title: 'A Sum Was the Easy Case',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "A running sum is easy to update: subtract what left, add what entered. But say the question is \"does this window contain an anagram of another string?\" A single number can't answer that — you need to know exactly which characters are in the window and how many of each."
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Before getting into that, it\'s worth being explicit about a decision every sliding window problem makes, whether or not the state inside it is complicated: how the window\'s size is chosen in the first place.'
            }
          ]
        }
      ]
    },

    {
      id: 'sizing-recap',
      number: 2,
      title: 'Two Ways a Window\'s Size Gets Decided',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "When the problem hands you an exact length k up front, the window is fixed — it never grows or shrinks, it only shifts."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `# Fixed: k is given, window only shifts
for right in range(k, len(nums)):
    window_sum += nums[right] - nums[left]
    left += 1`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'When the problem instead asks for the shortest or longest window satisfying some condition, there\'s no k to start from — the window has to grow until the condition holds, then shrink while it still does:'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `# Variable: right always advances; left only advances when a condition says to
for right in range(len(nums)):
    # ... add nums[right] to window state ...
    while window_is_invalid():
        # ... remove nums[left] from window state ...
        left += 1`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Everything below applies to either shape — fixed or variable — the difference is only in what the window tracks while it slides, not whether it slides."
            }
          ]
        }
      ]
    },

    {
      id: 'frequency-map-window',
      number: 3,
      title: 'Tracking Composition: Window with Frequency Map',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Back to anagrams: find every starting index where a fixed-size window is an anagram of a given pattern. The window needs a count of every character currently inside it, updated the same incremental way a sum is — add on entry, subtract on exit.'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `from collections import Counter

def find_anagrams(s, pattern):
    k = len(pattern)
    pattern_counts = Counter(pattern)
    window_counts = Counter(s[:k])
    result = []

    matches = sum(1 for c in pattern_counts if window_counts[c] == pattern_counts[c])

    if matches == len(pattern_counts):
        result.append(0)

    for right in range(k, len(s)):
        left_char, right_char = s[right - k], s[right]

        window_counts[right_char] += 1
        if window_counts[right_char] == pattern_counts[right_char]:
            matches += 1
        elif window_counts[right_char] == pattern_counts[right_char] + 1:
            matches -= 1

        window_counts[left_char] -= 1
        if window_counts[left_char] == pattern_counts[left_char]:
            matches += 1
        elif window_counts[left_char] == pattern_counts[left_char] - 1:
            matches -= 1

        if matches == len(pattern_counts):
            result.append(right - k + 1)

    return result`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "The `matches` counter is what keeps this fast: instead of comparing two full frequency maps at every position, one integer says whether the window currently matches, updated only when a count crosses in or out of alignment."
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'frequencyMapWindow'
        }
      ]
    },

    {
      id: 'distinct-window',
      number: 4,
      title: "A Narrower Question: Window with Distinct Characters",
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Some problems don't care about exact counts at all — only whether something has repeated. Find the longest substring with no repeated characters, for instance. That's the same frequency map, but the only thing being asked is: does any count exceed 1?"
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "This is also a variable window: expand right freely, and only shrink left when the character just added has become a duplicate."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def longest_unique_substring(s):
    counts = {}
    left = 0
    best = 0

    for right, char in enumerate(s):
        counts[char] = counts.get(char, 0) + 1

        while counts[char] > 1:
            counts[s[left]] -= 1
            left += 1

        best = max(best, right - left + 1)

    return best`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Only the character that just entered can possibly be the duplicate causing a problem, so the shrink loop only ever needs to check that one key — not rescan the whole map.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'distinctWindow'
        }
      ]
    },

    {
      id: 'max-min-window',
      number: 5,
      title: "A Question a Number Can't Answer: Maximum/Minimum Window",
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Now a different kind of question: what's the maximum value in every window of size k as it slides? A running sum update won't work here — when the max leaves the window on the left, there's no way to recover the second-largest value without looking back at the whole window again."
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `def max_window_naive(nums, k):
    result = []
    for i in range(len(nums) - k + 1):
        result.append(max(nums[i:i + k]))
    return result`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'That rescans all k elements at every position — O(n × k) total. The window needs a piece of state that can answer "what\'s the max in here right now" without looking at everything, and can also update itself when the max leaves.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'maxMinWindow'
        }
      ]
    },

    {
      id: 'monotonic-window',
      number: 6,
      title: 'The Trick: Only Keep Values That Could Still Win',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Here's the shortcut: if a new value entering the window is bigger than some value already near the back, that older, smaller value can never be the max again — the new value outlasts it and beats it. So throw it away immediately instead of waiting for it to lose relevance."
            }
          ]
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Keep a deque of indices whose values are strictly decreasing, front to back. Before adding a new index, pop off anything at the back that\'s smaller than it — those values are now permanently irrelevant. The front of the deque is always the current window\'s max.'
            }
          ]
        },
        {
          type: 'code',
          language: 'python',
          code: `from collections import deque

def max_window(nums, k):
    dq = deque()  # stores indices, values strictly decreasing
    result = []

    for i, num in enumerate(nums):
        while dq and nums[dq[-1]] < num:
            dq.pop()
        dq.append(i)

        if dq[0] <= i - k:
            dq.popleft()  # fell out of the window

        if i >= k - 1:
            result.append(nums[dq[0]])

    return result`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Each index is pushed onto the deque exactly once and popped at most once — so the whole scan is O(n), even though it looks like there\'s a loop inside a loop.'
            }
          ]
        },
        {
          type: 'concept-ref',
          conceptId: 'monotonicWindow'
        }
      ]
    },

    {
      id: 'why-faster',
      number: 7,
      title: 'Why These Are Fast',
      blocks: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "Each variant keeps the same discipline as a plain running sum: never redo work you already did, only update what actually changed."
            }
          ]
        },
        {
          type: 'code',
          language: 'text',
          code: `Anagram search:     O(n × k) recompare  →  O(n) with a match counter
Longest unique sub: O(n²) recheck        →  O(n) with a lazily shrinking window
Sliding window max: O(n × k) rescan      →  O(n) amortized with a monotonic deque`
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'The recurring move',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'In every case, the expensive check gets replaced by a single piece of maintained state — a counter, a lazily-shrinking pointer, or a deque — that already knows the answer instead of having to look for it.'
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
      title: 'When to Reach for Each One',
      blocks: [
        {
          type: 'code',
          language: 'text',
          code: `• Window length is given upfront            → Fixed Window
• Window must grow/shrink to satisfy a rule  → Variable Window
• Need to know what's inside the window      → Frequency Map
• Only care how many distinct things inside  → Distinct Characters
• Need the current max or min in the window  → Monotonic Window (deque)`
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: "These aren't exclusive — a real problem often stacks them, like a variable window (boundary rule) tracking a frequency map (composition) at the same time. Recognize which question is being asked about the window, and the right piece of state usually follows."
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
      description: 'The base case this article builds on — start here if incremental window updates are new.',
      url: '/deep-dive/fixed-sliding-window',
      slug: 'fixed-sliding-window',
      relationship: 'prerequisite'
    },
    {
      type: 'article',
      title: 'Hashing',
      description: 'Frequency-map windows are hash maps underneath — this covers the lookup mechanics in isolation.',
      url: '/deep-dive/hashing',
      slug: 'hashing',
      relationship: 'prerequisite'
    },
    {
      type: 'article',
      title: 'Two Pointers',
      description: 'Variable windows are a special case of same-direction two pointers, applied with a shrink condition.',
      url: '/deep-dive/two-pointers',
      slug: 'two-pointers',
      relationship: 'related'
    }
  ]
};