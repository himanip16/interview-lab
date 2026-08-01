// src/content/transcripts/dsa/burst-balloons-interval-dp.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Burst Balloons: Reversing Order to Enable Interval DP",
    difficulty: Difficulty.HARD,
    duration: 46,
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
            "You have an array of balloons. Burst them in any order. When you burst balloon i, you get nums[i-1] * nums[i] * nums[i+1] coins. Out-of-bounds is treated as 1. Maximize total coins. What's your first instinct?",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 20,
      content: [
        {
          type: "text",
          value:
            "Seems like I'd try every ordering and track the sum. But there are n! orderings, so brute force is exponential. Dynamic programming somehow.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 38,
      content: [
        {
          type: "text",
          value:
            "Right, n! is dead on arrival. Let's think about structure. When I burst a balloon, what happens to the array?",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 58,
      content: [
        {
          type: "text",
          value:
            "The balloon disappears, and its neighbors become adjacent. So the array shrinks and structure changes.",
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
          value:
            "Exactly. The problem is that bursting one balloon changes the context for the rest. What if, instead of thinking 'which balloon to burst first,' you flipped it to 'which balloon to burst last'?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 100,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-reversal-insight",
          type: "highlight",
          status: "strong",
          value: "if I fix the last balloon to burst in a range, its neighbors at burst time are always the boundaries of the range",
          explanation:
            "Reversing the order of thinking transforms the problem from 'which balloon to pop first' (destroys adjacencies) to 'which balloon to pop last' (preserves boundary knowledge). When the last balloon in range [left, right] pops, all middle balloons are already gone, so its neighbors are definitely the balloons at left and right boundaries.",
        },
        {
          type: "text",
          value:
            " When I burst balloon k last in some range, I know exactly what its neighbors are — they're the interval boundaries. Everything inside the interval is already gone.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 125,
      content: [
        {
          type: "text",
          value: "So what does that let you do?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 150,
      content: [
        {
          type: "text",
          value:
            "Define dp[left][right] = max coins from bursting all interior balloons strictly between left and right, leaving left and right themselves intact. Then I try each interior balloon k as the last to burst, and the score is nums[left] * nums[k] * nums[right] plus the coins from the left and right subproblems.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 172,
      content: [
        {
          type: "text",
          value:
            "Good definition. Write the recurrence.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 200,
      content: [
        {
          type: "text",
          value:
            "dp[left][right] = max over all k in (left, right) of: nums[left] * nums[k] * nums[right] + dp[left][k] + dp[k][right]",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 218,
      content: [
        {
          type: "text",
          value: "Now, your recurrence depends on neighbors existing. The first and last balloons in the original array are edge cases. How are you handling that?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 245,
      content: [
        {
          type: "text",
          value:
            "I could hard-code a check — if left is -1, treat it as 1; if right is out of bounds, same. But that's messy. Or... I could pad the array.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 263,
      content: [
        {
          type: "text",
          value: "How would you pad it?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 285,
      content: [
        {
          type: "text",
          value:
            "Add a 1 on both sides. [3, 1, 5, 8] becomes [1, 3, 1, 5, 8, 1]. Now the original balloons are interior, and the padding serves as permanent neighbors.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 305,
      content: [
        {
          type: "text",
          value: "And your answer?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 320,
      content: [
        {
          type: "text",
          value: "dp[0][len(padded)-1] — all interior balloons between the two padding 1s.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 335,
      content: [
        {
          type: "text",
          value: "Code it.",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 385,
      content: [
        {
          type: "text",
          value: "Top-down with memoization.",
        },
        {
          type: "code",
          id: "code-memoization",
          language: "python",
          value:
            "def max_coins(nums):\n    nums = [1] + nums + [1]\n    memo = {}\n\n    def dp(left, right):\n        if left + 1 == right:\n            return 0  # No interior balloons\n        if (left, right) in memo:\n            return memo[(left, right)]\n\n        res = 0\n        for k in range(left + 1, right):\n            coins = nums[left] * nums[k] * nums[right]\n            coins += dp(left, k) + dp(k, right)\n            res = max(res, coins)\n\n        memo[(left, right)] = res\n        return res\n\n    return dp(0, len(nums) - 1)",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 410,
      content: [
        {
          type: "text",
          value:
            "Walk me through a small example. nums = [3, 1, 5], padded = [1, 3, 1, 5, 1]. Compute dp(0, 4) and show the recursion tree.",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 470,
      content: [
        {
          type: "text",
          value:
            "dp(0, 4) tries k = 1, 2, 3 (the interior balloons at padded indices 1, 2, 3 with values 3, 1, 5). If k=1 (balloon 3): 1*3*1=3 + dp(0,1) + dp(1,4). If k=2 (balloon 1): 1*1*5=5 + dp(0,2) + dp(2,4). If k=3 (balloon 5): 1*5*1=5 + dp(0,3) + dp(3,4). Base cases are all 0 since length <= 2 has no interior. dp(0,1) = 0, dp(1,4): interior are k=2,3. If k=2: 3*1*1=3 + 0 + dp(2,4). dp(2,4) = 0. So dp(1,4)=3. If k=3: 3*5*1=15 + dp(1,3) + 0. dp(1,3) interior is k=2: 3*1*5=15 + 0 + 0 = 15. So dp(1,4) = max(3, 15) = 15. Back to k=1: 3 + 0 + 15 = 18. For k=2: dp(0,2) interior is k=1: 1*3*1=3, so 3. dp(2,4) = 0. So k=2 gives 5 + 3 + 0 = 8. For k=3: dp(0,3) interior k=1,2. k=1: 1*3*1=3 + 0 + dp(1,3)=15, gives 18. k=2: 1*1*5=5 + dp(0,2)=3 + 0 = 8. dp(0,3)=18. k=3: 5 + 18 + 0 = 23. Final answer is max(18, 8, 23) = 23.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 540,
      content: [
        {
          type: "text",
          value:
            "Correct. Now I want to probe the core idea. Why did choosing the last balloon work, but choosing the first wouldn't?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 575,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-why-first-fails",
          type: "highlight",
          status: "strong",
          value: "if you burst the first balloon first, the second balloon suddenly gets a new left neighbor from outside the interval, destroying the interval structure",
          explanation:
            "Bursting the first balloon changes the neighbors of what was the second balloon, making it impossible to split the remaining problem into independent left and right subproblems. By choosing the last balloon, left and right are always fixed boundaries regardless of which interior balloons have been burst.",
        },
        {
          type: "text",
          value:
            " If I burst the first balloon k, the second balloon's left neighbor is suddenly nums[left-1], not the first balloon anymore. Now the subproblem from the second balloon onward depends on something outside my interval. I can't cleanly recurse.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 605,
      content: [
        {
          type: "text",
          value:
            "Exactly. So the choice of order isn't arbitrary — it's the difference between a solvable and unsolvable subproblem structure. Good. Now your recurrence has dependencies: dp[left][right] depends on dp[left][k] and dp[k][right]. Smaller intervals. How does that affect computing the answer bottom-up?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 640,
      content: [
        {
          type: "text",
          value:
            "I need to compute smaller intervals first. If I iterate by interval length — start with length 2, then 3, then 4 — I guarantee that when I compute length L, all subproblems of length L-1 are already filled in.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 660,
      content: [
        {
          type: "text",
          value: "Code the bottom-up version.",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 715,
      content: [
        {
          type: "text",
          value: "Iterate by length, fill the table.",
        },
        {
          type: "code",
          id: "code-bottom-up",
          language: "python",
          value:
            "def max_coins(nums):\n    nums = [1] + nums + [1]\n    n = len(nums)\n    dp = [[0] * n for _ in range(n)]\n\n    for length in range(3, n + 1):\n        for left in range(n - length):\n            right = left + length - 1\n            for k in range(left + 1, right):\n                coins = nums[left] * nums[k] * nums[right]\n                coins += dp[left][k] + dp[k][right]\n                dp[left][right] = max(dp[left][right], coins)\n\n    return dp[0][n - 1]",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 740,
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
      elapsedSeconds: 760,
      content: [
        {
          type: "text",
          value:
            "Three nested loops: length (O(n)), left (O(n)), k (O(n)). So O(n³) time. Space is O(n²) for the DP table.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 778,
      content: [
        {
          type: "text",
          value:
            "Follow-up: some balloons are frozen and never burst. How does the recurrence change?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 805,
      content: [
        {
          type: "text",
          value:
            "When k is frozen, skip it. Only try non-frozen balloons as candidates for bursting last.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 820,
      content: [
        {
          type: "text",
          value:
            "Just skip it? Let me give you a case: [A (frozen), B, C (frozen)]. You want dp[A][C]. When you burst B, what are its neighbors?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 845,
      content: [
        {
          type: "text",
          value:
            "Its neighbors are A and C, not the interval boundaries... wait, they are the boundaries. A is at left and C is at right.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 862,
      content: [
        {
          type: "text",
          value:
            "Right. So skipping frozen balloons in the loop works. But now consider [A, B (frozen), C, B (frozen), D]. You want dp[A][D]. If you burst C last, what are its neighbors?",
        },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 895,
      content: [
        {
          type: "text",
          value:
            "C's neighbors are... the nearest non-frozen balloons on each side, which are B on the left and B on the right. But they're at different positions, not just 'left' and 'right' indices.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 918,
      content: [
        {
          type: "text",
          value:
            "Exactly. The recurrence depends on the actual neighbors at burst time, not just the interval boundaries. Frozen balloons that persist change the definition of neighbors. Your DP state might need to track something more complex than just (left, right). The problem structure itself has changed.",
        },
      ],
    },

    {
      id: "36",
      role: "takeaway",
      elapsedSeconds: 945,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Burst Balloons is fundamentally hard because the greedy and forward-thinking approaches destroy the problem structure. The breakthrough is reversing the order: instead of thinking 'which balloon to burst first,' ask 'which to burst last in this range.' This single flip converts an intractable exponential problem into interval DP. When balloon k is the last to burst in [left, right], its neighbors are guaranteed to be nums[left] and nums[right], since all interior balloons are gone. This enables a clean recurrence: dp[left][right] = max over interior k of (nums[left] * nums[k] * nums[right] + dp[left][k] + dp[k][right]). Padding eliminates boundary special cases. Computing bottom-up requires iterating by interval length to respect dependencies. The core insight — that the order of processing affects which subproblems are independent — is crucial and appears in other problems. Frozen balloons illustrate why constraints matter: they change which balloons are 'neighbors,' potentially invalidating the recurrence unless the state space is redefined.",
        },
      ],
    },
  ],
};

const burstBalloonsIntervalDP: TranscriptEntry = {
  summary: {    id: 15,

    slug: "burst-balloons-interval-dp",
    title: "Burst Balloons: Reversing Order to Enable Interval DP",
    category: "dsa",
    difficulty: Difficulty.HARD,
    duration: 46,
    company: "Generic",
    tags: [
      "Dynamic Programming",
      "Interval DP",
      "Memoization",
      "Bottom-Up DP",
      "Array",
      "Problem Transformation",
    ],
    description:
      "Coding interview on LeetCode's Burst Balloons: recognizing why forward-thinking ('burst first') fails, understanding the order-reversal insight ('burst last') and why it enables interval DP, correctly implementing both top-down and bottom-up solutions, walking through a complete recursion tree with correct arithmetic, and probing deeper into why the choice of order matters fundamentally. Includes a challenging frozen balloons variant that exposes how constraints change the recurrence structure.",
  },

  transcript,
};

export default burstBalloonsIntervalDP;