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
            "Here's an elevation map, n non-negative integers, each bar has width one. It rains. How much water sits on top when it's done? For [0,1,0,2,1,0,1,3,2,1,2,1] the answer is 6. Walk me through how you'd even start thinking about this.",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 14,
      content: [
        {
          type: "text",
          value:
            "The water sitting above any one bar depends on what's walling it in on both sides, so it feels like a per-position question rather than a whole-array one — for each index, figure out how deep the water gets there, then add those up.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 24,
      content: [
        {
          type: "text",
          value: "Okay, per position then. Take index i. What decides the water level right above it?",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 40,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-adjacent-only",
          type: "highlight",
          status: "missed",
          value: "Whichever neighbor is taller, left or right of it",
          explanation:
            "Confuses the immediate neighbor with the true bounding wall. Water above a bar is governed by the tallest bar anywhere to its left and anywhere to its right, not by whatever sits directly next to it.",
        },
        {
          type: "text",
          value: " — say the left one's taller, water fills up to that height and whatever's left after subtracting the bar's own height is trapped.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 55,
      content: [
        {
          type: "text",
          value:
            "Let's not take that on faith. [5, 1, 1, 1, 3] — trace your rule at index 2 for me.",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 78,
      content: [
        {
          type: "text",
          value:
            "Index 2 is height 1. Its left neighbor, index 1, is also height 1 — no gap, so by my rule there's no water there.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 90,
      content: [
        {
          type: "text",
          value: "Draw it instead of trusting the rule. What's actually sitting on both sides of index 2?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 118,
      content: [
        {
          type: "text",
          value:
            "5 _ 1 1 1 _ 3 — two spots left there's a wall of 5, two spots right there's a wall of 3. So the water at index 2 fills to min(5,3), which is 3, minus its own height of 1 — that's 2 units, not 0. My rule broke because it only looked one step away, and the wall that actually matters doesn't have to be adjacent, it just has to be the tallest thing between the position and either end. So what I really want is the ",
        },
        {
          id: "highlight-global-max",
          type: "highlight",
          status: "strong",
          value: "running maximum across everything to the left, and separately everything to the right",
          explanation:
            "Correctly re-derives the governing quantities: leftMax[i] and rightMax[i] must be global running maxima over [0..i] and [i..n-1], not local neighbor comparisons.",
        },
        {
          type: "text",
          value: ", at every index, not just one neighbor's height.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 145,
      content: [
        {
          type: "text",
          value: "Good. Turn that into something you'd actually run.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 190,
      content: [
        {
          type: "text",
          value:
            "One pass left to right builds leftMax, one pass right to left builds rightMax, then water at i is just min of the two maxes minus height[i], summed over the array.",
        },
        {
          type: "code",
          id: "code-recurrence",
          language: "python",
          value: "left_max[i] = max(left_max[i - 1], height[i])\nwater_i = min(left_max[i], right_max[i]) - height[i]",
        },
        {
          type: "text",
          value:
            "That's O(n) time, but I'm paying O(n) space for the two arrays, and I don't actually need the whole history — only the max so far from each side.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 215,
      content: [
        {
          type: "text",
          value: "So drop the arrays. Can you get this to O(1) extra space?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 240,
      content: [
        {
          type: "text",
          value:
            "Two pointers, one at each end, each carrying just a running max instead of a full array. Move whichever pointer is on the shorter bar.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 250,
      content: [
        {
          type: "text",
          value: "Why the shorter one? Have you actually worked that out, or is that a pattern you remember from somewhere?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 270,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-two-pointer-no-proof",
          type: "highlight",
          status: "missed",
          value: "Honestly, mostly remembered — the two sides are close in height so it should even out",
          explanation:
            "Offers no justification for why comparing height[left] and height[right] is a safe substitute for the true opposite-side maximum — the actual non-obvious part of the technique.",
        },
        {
          type: "text",
          value: ".",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 285,
      content: [
        {
          type: "text",
          value:
            "\"Should even out\" isn't something I can trust a system to. When height[left] <= height[right], you use left_max as the water level at left. What do you actually know about the true maximum on the right side at that moment?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 305,
      content: [
        {
          type: "text",
          value:
            "The right pointer is standing on a bar of height[right], and it hasn't reached the true right edge yet — so whatever the true max on the right eventually turns out to be, it's at least height[right]. And since height[left] <= height[right], that gives me true_right_max >= height[left]. So the right side can't be the bottleneck... at index left, at least.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 320,
      content: [
        {
          type: "text",
          value: "That compares true_right_max to height[left]. You're using left_max, not height[left]. Same thing?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 345,
      content: [
        {
          type: "text",
          value:
            "No — not automatically. left_max could be bigger than height[left] if a taller bar came earlier on the left. So I need true_right_max >= left_max, and I've only shown true_right_max >= height[left]. Let me trace a case instead of guessing: [4, 2, 3, 1, 5]. Left pointer at index 1 (height 2), right pointer at index 3 (height 1). height[left] > height[right] here, so actually I'd be moving right, not left — so this case doesn't apply to the left rule at all.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 365,
      content: [
        {
          type: "text",
          value: "Right, so go find a case where the rule does fire, and check whether left_max could actually exceed height[right].",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 400,
      content: [
        {
          type: "text",
          value:
            "The rule fires when height[left] <= height[right]. Could left_max, the best bar seen so far on the left, still be bigger than height[right]? If it were, that bar would be sitting to the left of my current left pointer — meaning at some earlier step, that bar's height was compared against whatever the right pointer's height was then. Right pointer heights only ever get replaced by other heights we've already passed, and the pointer only advances rightward — so if that earlier bar had beaten the right side back then, we'd have moved right instead of left, and left_max would never have advanced past it while a taller unresolved right wall was still in play. So by the time the rule fires with height[left] <= height[right], ",
        },
        {
          id: "highlight-two-pointer-proof",
          type: "highlight",
          status: "strong",
          value: "left_max can never have snuck past height[right] without the algorithm already having moved the other pointer instead",
          explanation:
            "Arrives at the actual invariant: the algorithm only trusts left_max for water calculation at moments where the current comparison certifies true_right_max is bounded below by something at least as large as left_max.",
        },
        {
          type: "text",
          value: " — so min(true_left_max, true_right_max) really does equal left_max right there, and using it is safe.",
        },
        {
          type: "code",
          id: "code-two-pointer",
          language: "python",
          value:
            "if height[left] <= height[right]:\n    left_max = max(left_max, height[left])\n    water += left_max - height[left]\n    left += 1",
        },
        {
          type: "text",
          value: "Mirror it for the right pointer and that's the whole loop.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 425,
      content: [
        {
          type: "text",
          value: "Good, that's a real proof, not a shrug. Third approach now — a stack. What does it buy you that the pointer version doesn't?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 445,
      content: [
        {
          type: "text",
          value:
            "The pointer version fills water column by column, one bar at a time. A stack lets you fill it layer by layer instead — keep indices in the stack with heights non-increasing bottom to top, and the moment a new bar is taller than the stack's top, a basin just closed.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 460,
      content: [
        {
          type: "text",
          value: "When that basin closes, what water do you add, and for what width?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 490,
      content: [
        {
          type: "text",
          value:
            "Pop the bottom of the basin. The new stack top and the current bar are the two walls, the width is the gap between their indices minus one, and the height added is the shorter of those two walls minus whatever was just popped.",
        },
        {
          type: "code",
          id: "code-stack",
          language: "python",
          value:
            "bottom = stack.pop()\nleft = stack[-1]\nwidth = i - left - 1\nwater += width * (min(height[left], h) - height[bottom])",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 505,
      content: [
        {
          type: "text",
          value: "Same O(n) time as the two-pointer version. So why reach for this one instead, ever?",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 525,
      content: [
        {
          type: "text",
          value:
            "It's strictly worse on space for this exact problem — O(n) stack against O(1). Where it earns its keep is when the shape of the question changes: bars arriving as a stream where you can't anchor two pointers because you don't have the far end yet, or a follow-up that wants the individual pooled regions listed out rather than a single total. The two-pointer sum only ever hands you a number; the stack's layer-by-layer structure is what you'd build on for that.",
        },
      ],
    },

    {
      id: "27",
      role: "takeaway",
      elapsedSeconds: 545,
      content: [
        {
          type: "text",
          value:
            "The tempting first instinct is to compare a bar against its immediate neighbor, and that breaks the moment the real bounding wall sits further away — the governing quantities are the true running maximum on each side, not local differences. Precomputing leftMax and rightMax gets there in O(n) time and O(n) space; collapsing that into two pointers with scalar running maxes gets O(1) space, but only because of a specific invariant, worked out from a concrete trace rather than assumed — whichever pointer sits on the shorter bar is guaranteed to have its running max be the true minimum-side bound, since the other side's true maximum is already certified to be at least as large. A monotonic stack solves the same problem in horizontal layers instead of vertical columns, trading the two-pointer's O(1) space for a structure that generalizes better if a follow-up needs the pooled regions themselves rather than just their total.",
        },
      ],
    },
  ],
};

const trappingRainWater: TranscriptEntry = {
  summary: {    id: 31,

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
      "Coding interview on Trapping Rain Water: a wrong first instinct comparing bars only to their immediate neighbor gets corrected into true running left/right maxima, then compressed from an O(n)-space two-array solution into an O(1)-space two-pointer solution — with the pointer-move rule pushed past a remembered pattern into an actual invariant proof built from a concrete trace — and finally re-solved with a monotonic stack to contrast per-column vs. per-layer accounting.",
  },

  transcript,
};

export default trappingRainWater;