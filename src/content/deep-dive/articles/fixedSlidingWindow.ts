import { DeepDiveArticle } from '@/features/deep-dive/types';
import { FixedSlidingWindowIllustration } from '@/content/deep-dive/illustrations/FixedSlidingWindowIllustration';

export const article: DeepDiveArticle = {
  slug: 'fixed-sliding-window',
  category: 'algorithms',
  readTime: '10 min',
  name: 'Fixed Sliding Window',
  eyebrow: 'ARRAYS · TWO POINTERS',
  description:
    'A fixed sliding window replaces repeated work with incremental updates. Instead of recomputing every window from scratch, one element leaves, one enters, and the answer is updated in constant time.',

  heroIllustration: FixedSlidingWindowIllustration,

  tags: ['Sliding Window', 'Arrays', 'Two Pointers'],

  title: 'Fixed Sliding Window: stop recalculating what barely changed',

  lede:
    'Many array problems ask the same question repeatedly over neighboring groups of elements. The first group might be indices 0–3, the next 1–4, then 2–5. Most of the elements stay exactly the same between windows, yet a naive solution throws everything away and starts over. A fixed sliding window exists because those neighboring windows differ by only two elements: one leaves, one arrives.',

  sections: [
    {
      number: 1,
      title: 'The repeated work hiding in plain sight',
      content: [
        [
          {
            type: 'text',
            text: 'Suppose every consecutive block of four numbers needs its sum. A straightforward solution loops through all four elements every time. The problem is that adjacent windows overlap almost completely.'
          }
        ],
        [
          {
            type: 'text',
            text: 'Moving from one window to the next does not create an entirely new window. Three of the four elements are identical. Only one element disappears from the left, and one new element appears on the right.'
          }
        ]
      ],
      code: {
        language: "python",
        code: `nums = [2, 5, 1, 8, 2, 9]
k = 4

# Window 1
[2, 5, 1, 8]

# Window 2
   [5, 1, 8, 2]

# Window 3
      [1, 8, 2, 9]`
      },
      illustration: {
        component: 'SlidingWindowShiftIllustration',
        caption: 'Neighboring windows overlap almost entirely',
        width: 'full'
      }
    },

    {
      number: 2,
      title: 'The observation that changes everything',
      content: [
        [
          {
            type: 'text',
            text: 'Imagine the current window already has a sum of 16. When the window moves one position, almost nothing changes. Instead of adding four numbers again, remove the element that fell out of the window and add the new element that entered.'
          }
        ],
        [
          {
            type: 'text',
            text: 'Every move performs exactly one subtraction and one addition, regardless of the window size.'
          }
        ]
      ],
      code: {
        language: "python",
        code: `window_sum -= nums[left]   # element leaving
window_sum += nums[right]  # element entering`
      },
      callout: {
        label: 'Key insight',
        content: [
          [
            {
              type: 'text',
              text: 'The expensive part is computing the '
            },
            {
              type: 'text',
              text: 'first',
              bold: true
            },
            {
              type: 'text',
              text: ' window. Every window after that is just a tiny update.'
            }
          ]
        ]
      }
    },

    {
      number: 3,
      title: 'Building the algorithm',
      content: [
        [
          {
            type: 'text',
            text: 'The algorithm begins by computing the first window normally. Once that initial sum exists, every later window reuses it.'
          }
        ]
      ],
      code: {
        language: "python",
        code: `def max_sum(nums, k):
    window_sum = sum(nums[:k])
    best = window_sum

    left = 0

    for right in range(k, len(nums)):
        window_sum -= nums[left]
        window_sum += nums[right]
        left += 1

        best = max(best, window_sum)

    return best`
      }
    },

    {
      number: 4,
      title: 'Watching the window move',
      content: [
        [
          {
            type: 'text',
            text: 'Notice how each movement changes only two values. Everything else stays untouched.'
          }
        ]
      ],
      code: {
        language: "python",
        code: `nums = [2, 5, 1, 8, 2, 9]
k = 4

Window: [2,5,1,8]
sum = 16

remove 2
add 2

Window: [5,1,8,2]
sum = 16

remove 5
add 9

Window: [1,8,2,9]
sum = 20`
      },
      illustration: {
        component: 'SlidingWindowUpdateIllustration',
        caption: 'Every shift removes one element and adds one new element',
        width: 'full'
      }
    },

    {
      number: 5,
      title: 'Why it is faster',
      content: [
        [
          {
            type: 'text',
            text: 'Suppose the array contains one million numbers and the window size is one hundred. A naive solution performs one hundred additions for every window. The sliding window performs only two arithmetic operations after the first window.'
          }
        ]
      ],
      code: {
        language: "python",
        code: `Naive

Window 1
+100 additions

Window 2
+100 additions

Window 3
+100 additions


Sliding Window

Window 1
+100 additions

Window 2
-1 subtraction
+1 addition

Window 3
-1 subtraction
+1 addition`
      },
      callout: {
        label: 'Time complexity',
        content: [
          [
            {
              type: 'text',
              text: 'Naive: ',
              bold: false
            },
            {
              type: 'text',
              text: 'O(n × k)',
              bold: true
            },
            {
              type: 'text',
              text: '. Fixed sliding window: '
            },
            {
              type: 'text',
              text: 'O(n)',
              bold: true
            },
            {
              type: 'text',
              text: '.'
            }
          ]
        ]
      }
    },

    {
      number: 6,
      title: 'When this pattern applies',
      content: [
        [
          {
            type: 'text',
            text: 'Fixed sliding windows work whenever the window size never changes. Every iteration processes exactly k consecutive elements.'
          }
        ]
      ],
      code: {
        language: "python",
        code: `Maximum sum of size k

Average of every window

Maximum average subarray

Count negatives in every window

Distinct elements in every window

Maximum vowels in a substring of length k

Maximum points from cards`
      }
    },

    {
      number: 7,
      title: 'When it does not work',
      content: [
        [
          {
            type: 'text',
            text: 'Some problems do not know the correct window size beforehand. They ask for the shortest, longest, or smallest window satisfying some condition. In those problems the window must expand and shrink dynamically.'
          }
        ],
        [
          {
            type: 'text',
            text: 'That is the variable sliding window pattern, where the two pointers move independently instead of staying exactly k elements apart.'
          }
        ]
      ]
    }
  ],

  tradeoffs: {
    strengths: [
      'Reduces repeated work between neighboring windows',
      'Processes each element a constant number of times',
      'Simple once the first window is built',
      'Uses only O(1) extra space'
    ],
    weaknesses: [
      'Requires a fixed window size',
      'Cannot directly solve minimum or maximum length window problems',
      'Works only when the window state can be updated incrementally'
    ]
  },

  related: [
    {
      name: 'Variable Sliding Window',
      description:
        'The window grows and shrinks dynamically instead of staying a fixed size.',
      slug: 'variable-sliding-window'
    },
    {
      name: 'Two Pointers',
      description:
        'The broader technique from which sliding window is derived.',
      slug: 'two-pointers'
    }
  ]
};