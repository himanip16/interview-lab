// src/content/transcripts/dsa/trapping-rain-water.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Trapping Rain Water",
    difficulty: Difficulty.HARD,
    duration: 36,
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
            "You're given n non-negative integers representing an elevation map — each bar has width 1. Compute how much water it can trap after raining. Example: [0,1,0,2,1,0,1,3,2,1,2,1] traps 6 units.",
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
            "So water sits on top of a bar up to whatever's the shorter of the two walls containing it, minus the bar's own height. Let me start with what determines the water above a single index.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 26,
      content: [
        {
          type: "text",
          value: "Go ahead.",
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
          value: "For index i, ",
        },
        {
          id: "highlight-adjacent-only",
          type: "highlight",
          status: "missed",
          value: "compare height[i] against its immediate left and right neighbors, and the difference is the trapped water",
          explanation:
            "Confuses the immediate neighbor with the true bounding wall. Water above a bar is governed by the tallest bar anywhere to its left and the tallest bar anywhere to its right — not by whatever happens to sit directly next to it, which can be much shorter than the real wall further away.",
        },
        {
          type: "text",
          value: " — if the left neighbor's taller, water fills up to that height above bar i.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 70,
      content: [
        {
          type: "text",
          value: "Run that on [5, 1, 1, 1, 3]. What do you get for index 2?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 96,
      content: [
        {
          type: "text",
          value:
            "Index 2 is height 1, immediate left neighbor is index 1, also height 1. No difference, so my rule says zero water there.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 112,
      content: [
        {
          type: "text",
          value: "Is that actually right, though? What's really holding water at index 2?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 138,
      content: [
        {
          type: "text",
          value:
            "...no, it's wrong. There's a wall of height 5 two spots to the left and a wall of height 3 two spots to the right. Water at index 2 fills up to min(5, 3) = 3, minus its own height of 1, so 2 units — not 0. My rule only looked at the adjacent bar, but the bar holding the water back doesn't have to be adjacent at all, it just has to be the tallest thing you'd hit walking outward in each direction. I need the ",
        },
        {
          id: "highlight-global-max",
          type: "highlight",
          status: "strong",
          value: "running maximum height across the entire left side and the entire right side, not just the neighbor",
          explanation:
            "Correctly re-derives the actual governing quantities: leftMax[i] and rightMax[i] must be the tallest bar anywhere in [0..i] and [i..n-1] respectively — global running maxima, not local comparisons — since a wall two, ten, or a hundred positions away is just as capable of holding water as an adjacent one.",
        },
        {
          type: "text",
          value: ", for every index.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 164,
      content: [
        {
          type: "text",
          value: "Write that.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 202,
      content: [
        {
          type: "text",
          value:
            "Precompute leftMax[i] as the max of everything from 0 to i inclusive, and rightMax[i] as the max from i to n-1 inclusive, one pass each direction. Then water at i is min(leftMax[i], rightMax[i]) minus height[i], summed over everything, clamped so it can't go negative — though it never will, since height[i] itself is always included in both of those maxes.",
        },
        {
          type: "code",
          id: "code-two-arrays",
          language: "python",
          value:
            "def trap(height: list[int]) -> int:\n    n = len(height)\n    if n == 0:\n        return 0\n\n    left_max = [0] * n\n    right_max = [0] * n\n\n    left_max[0] = height[0]\n    for i in range(1, n):\n        left_max[i] = max(left_max[i - 1], height[i])\n\n    right_max[n - 1] = height[n - 1]\n    for i in range(n - 2, -1, -1):\n        right_max[i] = max(right_max[i + 1], height[i])\n\n    return sum(min(left_max[i], right_max[i]) - height[i] for i in range(n))",
        },
        {
          type: "text",
          value: "O(n) time, O(n) extra space for the two arrays.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 228,
      content: [
        {
          type: "text",
          value: "Can you get rid of the two arrays and do it in O(1) extra space?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 260,
      content: [
        {
          type: "text",
          value:
            "I think so — two pointers, one from each end, tracking just a running left_max and right_max as scalars instead of full arrays. Move whichever side looks smaller.",
        },
        {
          id: "highlight-two-pointer-no-proof",
          type: "highlight",
          status: "missed",
          value: "move the pointer with the smaller height and just trust that it works out",
          explanation:
            "States the correct two-pointer move rule but offers no justification for why comparing height[left] and height[right] — rather than left_max and right_max — is a safe substitute for knowing the true opposite-side maximum, which is the entire non-obvious part of this technique.",
        },
        {
          type: "text",
          value: ", since the two heights are close together it should roughly average out to the right answer.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 288,
      content: [
        {
          type: "text",
          value:
            "\"Roughly average out\" isn't a proof. When height[left] is less than or equal to height[right], why are you allowed to trust left_max as the answer for the left pointer, without knowing anything about what's further to the right?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 330,
      content: [
        {
          type: "text",
          value:
            "Let me actually think this through instead of hand-waving it. left_max is the true, exact maximum of everything from index 0 up to the left pointer — I've been tracking it honestly the whole time, so that part's solid regardless of anything else.",
        },
        {
          type: "text",
          value:
            "The question is whether left_max is really the smaller of the two true bounding walls at that position, since if it's not the smaller one, using it would be wrong. Suppose height[left] <= height[right]. The right pointer hasn't reached the true right edge yet, but whatever the true maximum on the right side ends up being, it's at least height[right] — the pointer itself is sitting on a bar of that height, and the true max can only be greater than or equal to any single bar within its range. So true_right_max >= height[right] >= height[left]. And left_max, being the max of a prefix that includes the left pointer's own bar, is at least height[left]. So I know true_right_max >= height[left], but I need it compared to left_max specifically, not just height[left].",
        },
        {
          type: "text",
          value:
            "Actually the cleaner way to see it: left_max is already the true value for the left side by definition — no approximation there. And true_right_max >= height[right] >= height[left]. That doesn't directly bound true_right_max against left_max unless left_max also happens to be <= height[right]... but here's the thing — left_max can never be less than height[left], and if left_max were somehow bigger than height[right], that would mean some bar to the left of my pointer is taller than height[right], which is fine, but then the true right max, being >= height[right], could still be less than that inflated left_max. Hmm — no, wait, that's the wrong direction to worry about.",
        },
        {
          type: "text",
          value:
            "Let me redo it cleanly: I only ever move the left pointer when height[left] <= height[right]. At that moment, true_right_max — whatever it eventually resolves to — is guaranteed >= height[right], because the pointer standing there is itself part of that range. So true_right_max >= height[right] >= height[left]. Meanwhile left_max >= height[left] trivially, since it's a max that includes height[left]. But I actually need true_right_max >= left_max, not just >= height[left]. That only holds because ",
        },
        {
          id: "highlight-two-pointer-proof",
          type: "highlight",
          status: "strong",
          value: "left_max was already finalized as the true left-side maximum before this comparison, so if left_max were greater than height[right], the pointer move rule guarantees we'd have advanced right instead — the algorithm only ever trusts left_max for water calculation at moments where the comparison height[left] <= height[right] holds, and by induction left_max never exceeds any height value the right pointer has already passed",
          explanation:
            "Works through the actual invariant that makes the two-pointer technique correct instead of accepting the move rule on faith: the algorithm only computes water using left_max exactly when the current comparison certifies that the true opposite-side maximum is bounded below by something at least as large, which is the non-obvious correctness argument most candidates skip.",
        },
        {
          type: "text",
          value:
            " — so min(true_left_max, true_right_max) really does equal left_max at that point, and using it is safe. Same argument mirrored for the right pointer.",
        },
        {
          type: "code",
          id: "code-two-pointer",
          language: "python",
          value:
            "def trap(height: list[int]) -> int:\n    left, right = 0, len(height) - 1\n    left_max = right_max = 0\n    water = 0\n\n    while left < right:\n        if height[left] <= height[right]:\n            left_max = max(left_max, height[left])\n            water += left_max - height[left]\n            left += 1\n        else:\n            right_max = max(right_max, height[right])\n            water += right_max - height[right]\n            right -= 1\n\n    return water",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 372,
      content: [
        {
          type: "text",
          value: "Good. Now solve it a third way — with a stack, thinking in horizontal layers instead of per-column vertical fills.",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 402,
      content: [
        {
          type: "text",
          value:
            "Keep a stack of indices with non-increasing heights from bottom to top. When I hit a bar taller than what's on top of the stack, that's the moment a basin closes — I pop the bottom of the basin, and the new stack top plus the current bar are the two walls. The width is the gap between them, and the height of water added is bounded by the shorter of the two walls, minus whatever was at the bottom I just popped.",
        },
        {
          type: "code",
          id: "code-stack",
          language: "python",
          value:
            "def trap(height: list[int]) -> int:\n    stack: list[int] = []  # indices, heights non-increasing bottom to top\n    water = 0\n\n    for i, h in enumerate(height):\n        while stack and height[stack[-1]] < h:\n            bottom = stack.pop()\n            if not stack:\n                break  # no left wall left to pair with\n            left = stack[-1]\n            width = i - left - 1\n            bounded_height = min(height[left], h) - height[bottom]\n            water += width * bounded_height\n        stack.append(i)\n\n    return water",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 430,
      content: [
        {
          type: "text",
          value: "This one's O(n) time same as the two-pointer, but why would you ever reach for it instead?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 456,
      content: [
        {
          type: "text",
          value:
            "Space-wise it's worse than two-pointer — O(n) stack versus O(1) — so for this exact problem, two-pointer is strictly better. Where the stack version earns its keep is if the follow-up changes shape: things like processing bars as a live stream where you can't just walk from both ends because you don't have the whole array yet, or variants where you actually need to know the layer boundaries themselves — like listing out each individual pooled region — rather than just a single running total. The layer-by-layer accounting the stack gives you generalizes better to those; the two-pointer sum doesn't expose that structure at all, it only hands you the final number.",
        },
      ],
    },

    {
      id: "19",
      role: "takeaway",
      elapsedSeconds: 480,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the tempting first instinct is to compare a bar against its immediate neighbor, which fails as soon as the real bounding wall sits further away — the governing quantities are the true running maximum height on each side, not local differences. Precomputing leftMax and rightMax arrays gets there in O(n) time and O(n) space; collapsing that into two pointers with scalar running maxima gets O(1) space, but only because of a specific invariant — whichever pointer has the smaller current height is guaranteed to have its running max be the true minimum-side bound, since the other side's true maximum is already certified to be at least as large. A monotonic stack solves the same problem by processing water in horizontal layers instead of vertical columns, trading the two-pointer's O(1) space for a structure that generalizes better if a follow-up needs the individual pooled regions rather than just their total.",
        },
      ],
    },
  ],
};

const trappingRainWater: TranscriptEntry = {
  summary: {
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    category: "dsa",
    difficulty: Difficulty.HARD,
    duration: 36,
    company: "Generic",
    tags: [
      "Arrays",
      "Two Pointers",
      "Dynamic Programming",
      "Monotonic Stack",
      "Prefix Sums",
    ],
    description:
      "Coding interview on Trapping Rain Water: a wrong first instinct comparing bars only to their immediate neighbor gets corrected into true running left/right maxima, then compressed from an O(n)-space two-array solution into an O(1)-space two-pointer solution — with the pointer-move rule pushed past hand-waving into an actual invariant proof — and finally re-solved with a monotonic stack to contrast per-column vs. per-layer accounting.",
  },

  transcript,
};

export default trappingRainWater;