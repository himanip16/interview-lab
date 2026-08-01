// src/content/transcripts/dsa/132-pattern-stack.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "132 Pattern: Monotonic Stack to Avoid O(n²) Pitfall",
    difficulty: Difficulty.MEDIUM,
    duration: 38,
    template: "Coding",
    category: "DSA",
  },

  messages: [
    {
      id: "1",
      role: "interviewer",
      elapsedSeconds: 0,
      content: [
        {
          type: "text",
          value:
            "Given an array of integers, find if there's a 132 pattern — three indices i, j, k where i < j < k and nums[i] < nums[k] < nums[j]. Return true if any such subsequence exists, false otherwise.",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 12,
      content: [
        {
          type: "text",
          value:
            "So we need three values in order where the middle one is the largest. Not necessarily adjacent, just the ordering of indices. Let me start with the straightforward approach — fix each middle element j, find any i to the left where nums[i] is smaller, and any k to the right where nums[i] < nums[k] < nums[j].",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 28,
      content: [
        {
          type: "text",
          value: "Code that up.",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 60,
      content: [
        {
          type: "text",
          value: "For each j, iterate left to find min, iterate right to find any k fitting the pattern.",
        },
        {
          type: "code",
          id: "code-brute-force",
          language: "python",
          value:
            "def find_132_pattern(nums):\n    n = len(nums)\n    for j in range(1, n - 1):\n        min_left = min(nums[:j])\n        if min_left >= nums[j]:\n            continue\n        for k in range(j + 1, n):\n            if min_left < nums[k] < nums[j]:\n                return True\n    return False",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 75,
      content: [
        {
          type: "text",
          value: "Complexity?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 88,
      content: [
        {
          type: "text",
          value:
            "Three nested loops — O(n³). The inner k loop searches every element right of j, j iterates through the middle, and computing min_left every time inside is another scan. This won't scale past a few thousand elements.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 100,
      content: [
        {
          type: "text",
          value: "We can get this down significantly. What information do you actually need about the left side?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 125,
      content: [
        {
          type: "text",
          value:
            "Just the minimum, which I can precompute in a single pass. If I have the minimum to the left of every position, I can turn the j loop into checking every middle element, and then scan right for a valid k — that's O(n²).",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 140,
      content: [
        {
          type: "text",
          value: "Still not great. What about from the right — what does each k care about?",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 162,
      content: [
        {
          type: "text",
          value:
            "A k needs to find some j to its left where nums[j] is bigger than nums[k], and that j also has an i to its left smaller than nums[k]. So k is looking for a j larger than itself, and that j needs a smaller i to exist.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 180,
      content: [
        {
          type: "text",
          value: "What if k itself searches backwards, and maintains some structure about the candidates it's already passed?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 205,
      content: [
        {
          type: "text",
          value:
            "Ah — traverse right to left, keep a stack of candidates for j. When I see a new element as a potential k, check if it fits any of those candidates. Then decide whether this new element should go on the stack as a candidate for a future k.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 225,
      content: [
        {
          type: "text",
          value: "Walk me through the pattern [3, 1, 4, 2]. Right-to-left, starting from the right.",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 255,
      content: [
        {
          type: "text",
          value:
            "At 2: stack is empty, push it. At 4: 4 > 2, so 2 could be valid k if there's a j and i. Push 4. At 1: 1 is smaller than 4, so pop 4 and update... what exactly am I tracking with 4?",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 272,
      content: [
        {
          type: "text",
          value:
            "The third value of a 132 pattern. When you pop an element from the stack as a candidate for j, what does that mean about the future?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 295,
      content: [
        {
          type: "text",
          value:
            "That element will never be a j again — elements to its left in the original array are already behind us in the right-to-left pass. So if it got popped, I should remember the largest value it was compared against, which becomes the third value of the pattern.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 310,
      content: [
        {
          type: "text",
          value: "So the algorithm cares about this third value as what?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 330,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-third-value-threshold",
          type: "highlight",
          status: "strong",
          value: "a lower bound — any current element that's smaller than this third value is the i that completes the pattern",
          explanation:
            "The third value represents the middle ground between the i and j: it's larger than any valid i, but smaller than any valid j. If the current element is smaller than this threshold, the pattern is immediately confirmed.",
        },
        {
          type: "text",
          value: ". If current element is less than third, we found our 132.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 345,
      content: [
        {
          type: "text",
          value: "Continue the trace with that logic.",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 375,
      content: [
        {
          type: "text",
          value:
            "At 2: push. At 4: push. At 1: 1 < 4, so pop 4 — remember 4 as the third value. 1 is still larger than... well, there's nothing. Stack has 2, and 1 < 2, but no third value yet. Push 1. At 3: 3 > 1, pop 1, now third value is max(previous third, 1) = 4. Is 3 < 4? No. Push 3 to stack. Now stack is [2, 3] in order. No current element is smaller than third value 4. Did I miss something?",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 405,
      content: [
        {
          type: "text",
          value:
            "The stack should be monotonically decreasing. When you push 3, what should happen to the stack [2, 3]?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 430,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-maintain-decreasing-stack",
          type: "highlight",
          status: "missed",
          value: "pop everything from the stack that's smaller than the current element",
          explanation:
            "Maintaining a decreasing stack ensures each candidate j in the stack is larger than all candidates below it. When a new element comes in larger than the top, popping smaller elements and updating the third value captures the largest valid j for future comparisons.",
        },
        {
          type: "text",
          value:
            "Before pushing 3, pop 2 since 2 < 3, and record 2 as a popped candidate for the third value. Push 3. Now the stack is [3].",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 450,
      content: [
        {
          type: "text",
          value: "Why does the stack need to be decreasing?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 475,
      content: [
        {
          type: "text",
          value:
            "If the stack had two elements where bottom > top, the top can never be useful as a j again. Any future element smaller than top is also smaller than bottom, so bottom is always the better candidate. We'd have dead weight in the stack.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 495,
      content: [
        {
          type: "text",
          value: "Write the solution.",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 545,
      content: [
        {
          type: "text",
          value:
            "Traverse right to left, maintain a decreasing stack and track the third value.",
        },
        {
          type: "code",
          id: "code-stack-solution",
          language: "python",
          value:
            "def find_132_pattern(nums):\n    third = float('-inf')\n    stack = []\n    \n    for i in range(len(nums) - 1, -1, -1):\n        if nums[i] < third:\n            return True\n        while stack and stack[-1] < nums[i]:\n            third = max(third, stack.pop())\n        stack.append(nums[i])\n    \n    return False",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 570,
      content: [
        {
          type: "text",
          value: "Complexity?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 590,
      content: [
        {
          type: "text",
          value:
            "Each element is pushed onto the stack once and popped at most once, so O(n) time. Space is O(n) for the stack in the worst case — like when the array is strictly increasing, nothing gets popped.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 610,
      content: [
        {
          type: "text",
          value:
            "Follow-up: now find the count of all 132 patterns, not just true or false. Same constraints, but sum of pattern counts.",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 630,
      content: [
        {
          type: "text",
          value:
            "The stack solution gives us existence. For counting, I'd go back to O(n²) with precomputed minimums — for each j, count how many i's are smaller, how many k's satisfy i < nums[k] < j, then multiply.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 650,
      content: [
        {
          type: "text",
          value: "That's not efficient. Can you adapt the stack approach to count?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 680,
      content: [
        {
          type: "text",
          value:
            "When I pop an element from the stack, it means that element is a valid j. I know it's paired with i's smaller than the new third value. But counting which specific i's depends on their distribution, not just the minimum.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 705,
      content: [
        {
          type: "text",
          value:
            "Think differently. When an element gets popped, what i candidates are available?",
        },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 735,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-count-pattern-popped-range",
          type: "highlight",
          status: "strong",
          value: "all elements still on the stack, since the stack is decreasing and they're all smaller than the third value",
          explanation:
            "When an element is popped as j, every element remaining in the stack is a valid i candidate (all smaller than j), and the third value acts as the k constraint. Stack size directly gives the count of valid i's for that popped j.",
        },
        {
          type: "text",
          value:
            " All stack elements are smaller than j and also smaller than the current element (which would make a valid k). So when I pop a j, I count stack.size() as the number of valid i's for this j-k pair.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 760,
      content: [
        {
          type: "text",
          value: "But wait. You pop when you see nums[i]. That makes nums[i] valid as k. But you're also about to push nums[i] onto the stack — will it be treated as a later i?",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 785,
      content: [
        {
          type: "text",
          value:
            "Right — after I count and pop, nums[i] goes on the stack for future iterations. So for this round, the stack contains only elements to the right of nums[i] in the original array, which is correct for being i's relative to some k to the right. When i push nums[i], it becomes a candidate for being j in a later comparison when we process elements further left.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 805,
      content: [
        {
          type: "text",
          value: "Code it.",
        },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 850,
      content: [
        {
          type: "text",
          value:
            "Add a counter when popping elements that satisfy the pattern constraint.",
        },
        {
          type: "code",
          id: "code-count-patterns",
          language: "python",
          value:
            "def count_132_patterns(nums):\n    third = float('-inf')\n    stack = []\n    count = 0\n    \n    for i in range(len(nums) - 1, -1, -1):\n        if nums[i] < third:\n            count += len(stack)\n        while stack and stack[-1] < nums[i]:\n            third = max(third, stack.pop())\n        stack.append(nums[i])\n    \n    return count",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 875,
      content: [
        {
          type: "text",
          value:
            "Wait, you're counting every time nums[i] < third. But third was built from popped elements. How do you know every stack element forms a valid pattern with this current i and this third?",
        },
      ],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 910,
      content: [
        {
          type: "text",
          value:
            "Because of the invariants. third is always the largest value we've popped, representing valid middle elements from the right side. Every element in the stack is smaller than both third and nums[i]... wait, not smaller than third, but could be equal or larger depending on when they were popped. Let me reconsider.",
        },
      ],
    },

    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 935,
      content: [
        {
          type: "text",
          value:
            "Stack elements are smaller than the current nums[i] by the decreasing invariant. third is some value that was popped and represents a valid j. If nums[i] < third, then nums[i] becomes a valid i for any j and k pair already established. What's the role of the stack then?",
        },
      ],
    },

    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 965,
      content: [
        {
          type: "text",
          value:
            "The stack elements are potential j's that haven't been finalized yet. No wait — they're smaller than nums[i], so they can't be j in a pattern with nums[i] as k. I think the logic is: third is a real j value, nums[i] is a real k value (since i is iterating left), and every element in the stack right now is a real i value — they're all smaller than nums[i] by the stack invariant, and they're all in the right side of i when we pop from stack, wait...",
        },
      ],
    },

    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 995,
      content: [
        {
          type: "text",
          value:
            "Let me clarify the role. When you iterate i from right to left, elements to the right of i are candidates for k. Elements being evaluated now (at i) are candidates for... what position in the pattern?",
        },
      ],
    },

    {
      id: "44",
      role: "candidate",
      elapsedSeconds: 1020,
      content: [
        {
          type: "text",
          value:
            "Position i — the smallest value in the pattern. So in a single pass, I'm fixing i at each iteration, then looking at all k's to the right (stack and third), and checking if nums[i] < third < (some j). But the stack is full of candidate j's, not k's.",
        },
      ],
    },

    {
      id: "45",
      role: "interviewer",
      elapsedSeconds: 1040,
      content: [
        {
          type: "text",
          value:
            "Exactly. The stack is full of potential j's from the right side. When nums[i] < third, third is a valid k (smaller than all the j's still in the stack). Count how many of those j's are present.",
        },
      ],
    },

    {
      id: "46",
      role: "candidate",
      elapsedSeconds: 1065,
      content: [
        {
          type: "text",
          value:
            "So nums[i] is i, third is k, and every element currently in the stack is a j, and they all satisfy nums[i] < third < nums[stack element]. The count for this i is the stack size. That makes sense now — and third gets updated whenever I pop a larger value, always capturing the threshold for a valid k.",
        },
      ],
    },

    {
      id: "47",
      role: "interviewer",
      elapsedSeconds: 1085,
      content: [
        {
          type: "text",
          value:
            "So the one-pass stack solution is naturally extendable. Any gotchas on the counting side?",
        },
      ],
    },

    {
      id: "48",
      role: "candidate",
      elapsedSeconds: 1110,
      content: [
        {
          type: "text",
          value:
            "If there are duplicates, stack elements might not all be strictly smaller than nums[i]. The decreasing invariant prevents a strictly larger value from sitting below a smaller one, but equal values could be an issue.",
        },
      ],
    },

    {
      id: "49",
      role: "interviewer",
      elapsedSeconds: 1125,
      content: [
        {
          type: "text",
          value:
            "What happens if stack has [3, 2] and nums[i] = 3? The pop condition is stack[-1] < nums[i].",
        },
      ],
    },

    {
      id: "50",
      role: "candidate",
      elapsedSeconds: 1145,
      content: [
        {
          type: "text",
          value:
            "2 < 3, so pop 2. 3 is not < 3, so don't pop 3. Push nums[i] = 3. Now the stack has [3, 3]. That's fine — duplicates don't break the counting because we still count stack size correctly, and third still tracks the boundary.",
        },
      ],
    },

    {
      id: "51",
      role: "takeaway",
      elapsedSeconds: 1155,
      content: [
        {
          type: "text",
          value:
            "Takeaway: The 132 pattern at first looks like an O(n²) or O(n³) search problem, but reframing it from right-to-left with a monotonic decreasing stack unlocks O(n) existence detection. The stack maintains candidate j values in decreasing order; a third variable tracks the largest popped value, acting as a lower bound for valid k values. When nums[i] is smaller than this third value, it completes the pattern immediately. The key insight is that the stack's decreasing invariant eliminates redundant candidates — any stack element smaller than the top would never be chosen over the top. Extending to counting patterns is natural: when nums[i] becomes a valid i and third becomes a valid k, every j still on the stack contributes one complete pattern, so the count is stack.size(). The one-pass nature of the algorithm and its symmetry between checking existence and counting makes it elegant for both versions.",
        },
      ],
    },
  ],
};

const pattern132Stack: TranscriptEntry = {
  summary: {    id: 31,

    slug: "132-pattern-stack",
    title: "132 Pattern: Monotonic Stack to Avoid O(n²) Pitfall",
    category: "dsa",
    difficulty: Difficulty.MEDIUM,
    duration: 38,
   
    tags: [
      "Stack",
      "Monotonic Stack",
      "Array",
      "Pattern Matching",
      "Greedy",
      "Right-to-Left Traversal",
    ],
    description:
      "Coding interview on LeetCode's 132 Pattern: starting with brute-force O(n³), recognizing the need for structure, building a right-to-left monotonic decreasing stack solution that runs in O(n), understanding why the stack must stay decreasing and what the third value threshold represents, then extending it to count all patterns in one pass without additional complexity.",
  },

  transcript,
};

export default pattern132Stack;