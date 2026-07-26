// src/content/transcripts/dsa/burst-balloons-interval-dp.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Burst Balloons: Interval DP With Reversal of Order",
    difficulty: Difficulty.HARD,
    duration: 48,
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
            "You have an array of balloons. Burst them in any order. When you burst balloon i, you get nums[i-1] * nums[i] * nums[i+1] coins. Out-of-bounds indices count as 1. Maximize total coins.",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 18,
      content: [
        {
          type: "text",
          value:
            "So once I burst a balloon, its neighbors become adjacent. The score depends on the neighbors at the moment of bursting, not their original positions. This feels like I'd try every possible ordering and track state as balloons disappear.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 35,
      content: [
        {
          type: "text",
          value: "How many orderings are there?",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 48,
      content: [
        {
          type: "text",
          value:
            "n! — permutations of which balloon to burst at each step. With n up to 300, that's not even close to feasible. Brute force is dead. This has to be dynamic programming, but the state space isn't obvious because the array structure changes as balloons pop.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 62,
      content: [
        {
          type: "text",
          value:
            "What if you stop thinking about 'which balloon to burst first' and think about which to burst last?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 85,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-reversal-of-order",
          type: "highlight",
          status: "strong",
          value: "if I fix the last balloon to burst in a range, then when it bursts, its neighbors are known — they're the boundaries of the range",
          explanation:
            "Reversing the order of thinking transforms the problem from 'which balloon to pop first' (destroys adjacencies) to 'which balloon to pop last' (preserves boundary knowledge). When the last balloon in range [left, right] pops, all middle balloons are already gone, so its neighbors are definitely the balloons at left and right.",
        },
        {
          type: "text",
          value:
            " I can define dp[left][right] as the max coins from bursting everything between left and right, leaving left and right untouched. Then I try each position as the last to burst and recurse on the left and right halves.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 108,
      content: [
        {
          type: "text",
          value: "Walk through the example nums = [3, 1, 5, 8]. Show the recursion.",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 145,
      content: [
        {
          type: "text",
          value:
            "I want dp[0][3] — max coins from bursting all four. But wait, that doesn't match the definition. Let me redefine: dp[left][right] is max coins from bursting all balloons strictly between left and right indices, not including left and right themselves.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 165,
      content: [
        {
          type: "text",
          value: "But the boundaries need to exist to define neighbors. Add padding.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 185,
      content: [
        {
          type: "text",
          value:
            "Prepend and append 1 to the array. So [3, 1, 5, 8] becomes [1, 3, 1, 5, 8, 1]. Now dp[0][5] is the answer — max coins from bursting everything between the two 1's, which is everything except the padding. The padding never bursts, they're just boundary anchors.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 205,
      content: [
        {
          type: "text",
          value:
            "Now set up the recursion. For dp[left][right], which balloon between left and right do you choose as the last to burst?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 235,
      content: [
        {
          type: "text",
          value:
            "Try all positions k where left < k < right. If k is the last to burst in this range, when it pops, its left neighbor is nums[left] and its right neighbor is nums[right]. So the score is nums[left] * nums[k] * nums[right] plus dp[left][k] plus dp[k][right].",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 258,
      content: [
        {
          type: "text",
          value: "Why does that work? When you burst k, haven't the balloons in [left, k] and [k, right] already been assigned coins?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 280,
      content: [
        {
          type: "text",
          value:
            "Yes, dp[left][k] is the coins from bursting everything strictly between left and k. dp[k][right] is coins from between k and right. They've already earned their coins before k gets burst. When k finally pops, the only remaining neighbors are left and right, so it adds nums[left] * nums[k] * nums[right]. No double-counting because k bursts last in this subproblem.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 302,
      content: [
        {
          type: "text",
          value: "Code it.",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 360,
      content: [
        {
          type: "text",
          value: "Top-down memoization with the range recursion.",
        },
        {
          type: "code",
          id: "code-burst-memoization",
          language: "python",
          value:
            "def max_coins(nums):\n    nums = [1] + nums + [1]\n    memo = {}\n\n    def dp(left, right):\n        if left + 1 == right:\n            return 0\n        if (left, right) in memo:\n            return memo[(left, right)]\n\n        res = 0\n        for k in range(left + 1, right):\n            coins = nums[left] * nums[k] * nums[right]\n            coins += dp(left, k) + dp(k, right)\n            res = max(res, coins)\n\n        memo[(left, right)] = res\n        return res\n\n    return dp(0, len(nums) - 1)",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 388,
      content: [
        {
          type: "text",
          value: "Complexity?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 410,
      content: [
        {
          type: "text",
          value:
            "The state space is O(n²) — all pairs (left, right). For each state, I iterate through k from left+1 to right, which is O(n). So overall O(n³) time. Space is O(n²) for the memo, plus O(n) call stack depth.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 428,
      content: [
        {
          type: "text",
          value:
            "Walk through [3, 1, 5, 8] with padding [1, 3, 1, 5, 8, 1]. What's dp[0][5]?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 475,
      content: [
        {
          type: "text",
          value:
            "Try k = 1 (balloon 3): coins = 1*3*1 = 3, plus dp[0][1]=0 and dp[1][5]. Then k = 2 (balloon 1): coins = 1*1*1 = 1, plus dp[0][2] and dp[2][5]. Then k = 3 (balloon 5): coins = 1*5*1 = 5, plus dp[0][3] and dp[3][5]. Then k = 4 (balloon 8): coins = 1*8*1 = 8, plus dp[0][4] and dp[4][5]. Take the max of all these options.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 510,
      content: [
        {
          type: "text",
          value:
            "Let's compute dp[1][4] — balloons 3, 1, 5. If 1 is the last to burst there, what score?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 535,
      content: [
        {
          type: "text",
          value:
            "nums[1] * nums[2] * nums[4] = 3 * 1 * 5 = 15. Plus dp[1][2] which is 0, and dp[2][4].",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 550,
      content: [
        {
          type: "text",
          value: "And dp[2][4] — balloons 1, 5. If 5 is the last there?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 568,
      content: [
        {
          type: "text",
          value:
            "nums[2] * nums[3] * nums[4] = 1 * 5 * 5 = 25. Plus dp[2][3] which is 0. So dp[2][4] = 25 when 5 is last. If 1 is last: 1*1*5 = 5 plus dp[2][3]=0 and dp[3][4]=0, gives 5. Max is 25.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 585,
      content: [
        {
          type: "text",
          value:
            "So dp[1][4] = 15 + 25 = 40 when 1 is last. Does that match the example trace?",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 610,
      content: [
        {
          type: "text",
          value:
            "In the example trace, at one step we had [3, 5, 8] and burst 5 to get 3*5*8 = 120. That corresponds to... hmm, let me recount. Original [3, 1, 5, 8]. The trace shows 3*1*5 = 15, then 3*5*8 = 120, then 1*3*8 = 24, then 1*8*1 = 8, total = 167. So when 1 is last in [1..4] and we burst 5 second-to-last in [2..4], we get their contributions sequenced correctly.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 635,
      content: [
        {
          type: "text",
          value:
            "Exactly. The recursion handles the ordering implicitly — by deciding which balloon is last, you're deciding which contributions happen before it. Let's move on. Code it bottom-up.",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 680,
      content: [
        {
          type: "text",
          value:
            "Build the DP table by increasing interval length. Base case is intervals of length 2 or less, which contribute 0. Then for each larger interval, try all possible last balloons.",
        },
        {
          type: "code",
          id: "code-burst-bottom-up",
          language: "python",
          value:
            "def max_coins(nums):\n    nums = [1] + nums + [1]\n    n = len(nums)\n    dp = [[0] * n for _ in range(n)]\n\n    for length in range(3, n + 1):\n        for left in range(n - length):\n            right = left + length - 1\n            for k in range(left + 1, right):\n                coins = nums[left] * nums[k] * nums[right]\n                coins += dp[left][k] + dp[k][right]\n                dp[left][right] = max(dp[left][right], coins)\n\n    return dp[0][n - 1]",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 710,
      content: [
        {
          type: "text",
          value: "Why iterate by length and not by left/right directly?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 730,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-bottom-up-dependency-order",
          type: "highlight",
          status: "strong",
          value: "dp[left][right] depends on dp[left][k] and dp[k][right], which are both strictly smaller intervals, so you must compute smaller lengths before larger ones",
          explanation:
            "The bottom-up order ensures all subproblems are solved before being used. Iterating by length guarantees that when you compute dp[left][right], all intervals within it have already been computed.",
        },
        {
          type: "text",
          value:
            " When I compute dp[left][right], I need dp[left][k] and dp[k][right] to already be known. Those are smaller intervals, so iterating by increasing length ensures dependencies are met.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 750,
      content: [
        {
          type: "text",
          value:
            "One more thing — you're padding with 1 on both sides. What if you only added padding where needed?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 775,
      content: [
        {
          type: "text",
          value:
            "The padding at both ends exists specifically so that the first and last balloons have defined neighbors. Without it, nums[0] and nums[n-1] are edge cases — their left and right neighbors don't exist in the original array, so we'd have to handle them separately. The padding unifies the logic.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 795,
      content: [
        {
          type: "text",
          value:
            "Follow-up: some balloons are frozen and can't burst. How does the solution change?",
        },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 820,
      content: [
        {
          type: "text",
          value:
            "Frozen balloons never get bursted, so they're always there as neighbors. You'd skip them during recursion — only iterate k over non-frozen balloons, and dp[left][right] only bursts non-frozen balloons between left and right. Frozen ones stay in place and affect scores but never pop.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 845,
      content: [
        {
          type: "text",
          value:
            "What about memoization? If you have a lot of frozen balloons, does the state space change?",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 865,
      content: [
        {
          type: "text",
          value:
            "The state is still dp[left][right], which depends on array indices, not the count of frozen balloons. So the state space is still O(n²). But the pruning from skipping frozen balloons reduces the work inside each state — you don't try them as candidates for last-to-burst. If many balloons are frozen, the inner loop is smaller and the algorithm runs faster in practice.",
        },
      ],
    },

    {
      id: "37",
      role: "takeaway",
      elapsedSeconds: 885,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Burst Balloons is a classic interval DP problem that's deceptively hard because the naive approach — 'which balloon to burst first' — destroys the array structure, making it exponential. The critical insight is reversing the order of thinking to 'which balloon to burst last in a range', which preserves boundary knowledge and enables memoization. By padding the array with 1s on both sides, you turn the first and last balloons from edge cases into regular recursive calls. The DP state dp[left][right] represents max coins from bursting all balloons strictly between left and right, leaving the boundaries intact. When you choose balloon k as the last to burst in [left, right], its score is nums[left] * nums[k] * nums[right], plus the coins from subproblems [left, k] and [k, right], since those happen before k pops. The solution is O(n³) time and O(n²) space, with the n in the third dimension coming from trying all k positions as the final balloon. Bottom-up DP requires iterating by increasing interval length to ensure all dependencies are satisfied before use.",
        },
      ],
    },
  ],
};

const burstBalloonsIntervalDP: TranscriptEntry = {
  summary: {
    slug: "burst-balloons-interval-dp",
    title: "Burst Balloons: Interval DP With Reversal of Order",
    category: "dsa",
    difficulty: Difficulty.HARD,
    duration: 48,
    company: "Generic",
    tags: [
      "Dynamic Programming",
      "Interval DP",
      "Memoization",
      "Bottom-Up DP",
      "Array",
      "Optimization",
    ],
    description:
      "Coding interview on LeetCode's Burst Balloons: recognizing that the greedy/brute-force approach is exponential, understanding the critical insight of reversing order — bursting last instead of first — to make the subproblem structure tractable, implementing interval DP with padding to handle boundaries, walking through examples to verify correctness, and discussing the O(n³) time and O(n²) space complexity. Includes a follow-up on handling frozen balloons.",
  },

  transcript,
};

export default burstBalloonsIntervalDP;