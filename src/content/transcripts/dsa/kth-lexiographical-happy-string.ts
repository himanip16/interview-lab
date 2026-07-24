// src/content/transcripts/dsa/kth-lexicographical-happy-string.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "K-th Lexicographical Happy String",
    difficulty: Difficulty.MEDIUM,
    company: "Amazon",
    duration: 34,
    template: "DSA",
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
            "A 'happy string' only uses the letters a, b, c, and never has two of the same letter next to each other. Given n and k, return the k-th happy string of length n in lexicographical order, or an empty string if fewer than k exist. For example, n=3, k=9 should give \"cab\".",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 10,
      content: [
        {
          type: "text",
          value: "So the only constraint is no two adjacent letters being the same — nothing else going on with the alphabet?",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 18,
      content: [
        { type: "text", value: "That's it." },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 30,
      content: [
        {
          type: "text",
          value:
            "Okay, let me just think out loud for a sec. Simplest thing — generate every happy string of length n, and grab the k-th one.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 40,
      content: [
        { type: "text", value: "How would you generate them?" },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 55,
      content: [
        {
          type: "text",
          value:
            "Backtracking — build the string one character at a time, only disallowing whatever character was just used, and once it hits length n, add it to a list.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 65,
      content: [
        { type: "text", value: "Are they already in order if you do that?" },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 78,
      content: [
        {
          type: "text",
          value:
            "Hold on, let me actually think about that instead of just assuming... if I try 'a' before 'b' before 'c' at every position, then everything under 'a' finishes generating before I even touch 'b'. So yeah, I think it comes out sorted for free, I wouldn't need to sort afterward.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 92,
      content: [
        { type: "text", value: "Fine. What's the complexity of that whole approach?" },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 108,
      content: [
        {
          type: "text",
          value:
            "There's 3 choices for the first letter, then 2 for every letter after that, so 3 times 2 to the n-minus-1 total strings. Each one takes O(n) to build, so... roughly O(n times 2 to the n).",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 122,
      content: [
        { type: "text", value: "So for n up to, say, 10, that's fine?" },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 135,
      content: [
        {
          type: "text",
          value: "Yeah — 2 to the 10th is about a thousand, times 3, so a few thousand strings tops. No problem.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 148,
      content: [
        { type: "text", value: "What if n were bigger — say 40, or 60?" },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 162,
      content: [
        {
          type: "text",
          value:
            "Oh, that blows up fast. 2 to the 40th is already in the trillions — there's no way I'm generating or storing all of that, memory alone kills it before I even get to worrying about time.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 175,
      content: [
        { type: "text", value: "So do it without generating everything." },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 190,
      content: [
        {
          type: "text",
          value:
            "Hmm, okay... let me think about what's actually happening in that backtracking tree instead of running it. At the very first position there's 3 choices, and under whichever one I pick, the remaining n-minus-1 positions branch by 2 each. So under 'a' alone, there's exactly 2 to the power n-minus-1 strings. Same count under 'b'. Same under 'c'.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 205,
      content: [
        { type: "text", value: "So?" },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 218,
      content: [
        {
          type: "text",
          value:
            "So... if k lands in the first block of that size, the answer starts with 'a'. Next block, 'b'. Otherwise 'c'. I don't need to walk the actual tree at all — just divide.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 232,
      content: [
        { type: "text", value: "Walk me through it with real numbers. n=3, k=9." },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 250,
      content: [
        {
          type: "text",
          value:
            "Total is 3 times 2 squared, so 12 strings — k=9 is in range. Let me zero-index it, so k becomes 8. Block size for the first character is 2 to the n-minus-1, that's 2 squared, 4. 8 divided by 4 is 2, so index 2 into a, b, c — that's 'c'. Remainder is 8 mod 4, which is 0.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 265,
      content: [
        { type: "text", value: "Keep going." },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 282,
      content: [
        {
          type: "text",
          value:
            "Previous character was 'c', so what's left is 'a' and 'b', in that order. Block size now is 2 to the n-minus-2, n is 3 so that's 2 to the 1, which is 2. Current k is 0 — 0 divided by 2 is 0, index 0 into 'a','b' is 'a'. Remainder's still 0.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 298,
      content: [
        { type: "text", value: "Last character." },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 315,
      content: [
        {
          type: "text",
          value:
            "Previous was 'a', so remaining choices are 'b' and 'c'. Block size is 2 to the 0, which is 1. k is 0, 0 divided by 1 is 0, index 0 from 'b','c' is 'b'. So... putting it together — c, a, b. \"cab\".",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 328,
      content: [
        { type: "text", value: "Matches. What's the complexity now?" },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 340,
      content: [
        {
          type: "text",
          value: "O(n) — one pass, no branching, and I'm not storing anything except the result string itself.",
        },
        {
          id: "highlight-direct-construction",
          type: "highlight",
          status: "strong",
          value: "no branching",
          explanation:
            "Reframes the backtracking tree as a counting problem — dividing k by block sizes at each level instead of walking or generating any of the tree — collapsing exponential enumeration into a single O(n) pass.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 352,
      content: [
        { type: "text", value: "What data type are you using to hold that total count, 3 times 2 to the n-minus-1?" },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 365,
      content: [
        {
          type: "text",
          value:
            "I was just going to use a regular int... actually, hold on — if n's like 60, 2 to the 59th is already bigger than a 32-bit int can hold, so that overflows. I'd need at least a 64-bit integer, or honestly just avoid computing the full exact count in the first place.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 378,
      content: [
        { type: "text", value: "What do you mean, avoid computing it?" },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 392,
      content: [
        {
          type: "text",
          value:
            "Like — I don't actually need the exact value of 3 times 2 to the n-minus-1 if it's already astronomically bigger than k. I could cap the running total at, say, k plus 1 as I multiply it up, and just stop growing it once it's already past k, since all I really care about is whether k fits inside this many strings or not.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 405,
      content: [
        { type: "text", value: "Why bother with that instead of just using a big-integer type and comparing normally?" },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 420,
      content: [
        {
          type: "text",
          value:
            "I mean, honestly, a bignum type would also just work and be simpler to write. I guess the capping thing only really matters if I'm somewhere without arbitrary-precision integers handy and don't want to pull in a whole bignum library for one comparison.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 432,
      content: [
        { type: "text", value: "Fair. Now — what if this gets queried a huge number of times, same n, lots of different k values coming in rapidly. Does anything change?" },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 448,
      content: [
        {
          type: "text",
          value:
            "Not really, I don't think — each query's already O(n) on its own and doesn't depend on any other query... unless, wait, actually there kind of is shared work. The block sizes — the powers of 2 up to 2 to the n — are identical for every query with the same n. I could precompute that array once instead of recomputing 2 to the n-minus-i inside every single call.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 462,
      content: [
        { type: "text", value: "Does that actually save you much?" },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 475,
      content: [
        {
          type: "text",
          value:
            "For one query, barely anything — a power of 2 is cheap to compute. But if this is getting hit a lot, avoiding even a small repeated computation across, I don't know, millions of calls adds up. So yeah, precomputing it once per distinct n is worth doing, it's just not going to move the needle for a single call.",
        },
        {
          id: "highlight-precompute-tradeoff",
          type: "highlight",
          status: "strong",
          value: "not going to move the needle for a single call",
          explanation:
            "Distinguishes the per-call cost from the aggregate cost across many calls, rather than reflexively recommending precomputation as a universal win.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 488,
      content: [
        { type: "text", value: "Good, that's what I wanted to dig into. Let's stop there." },
      ],
    },

    {
      id: "38",
      role: "takeaway",
      elapsedSeconds: 505,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the core insight is treating the backtracking tree as a counting problem instead of generating it — dividing k by the block size at each level to pick a character directly, collapsing O(n * 2^n) enumeration into O(n). The follow-ups reward catching an integer-overflow risk in the total-count formula before being told, weighing a capped running total against just reaching for a bignum type, and correctly scoping a precomputation suggestion to its actual payoff — cheap for one call, worthwhile only in aggregate across many.",
        },
      ],
    },
  ],
};

const amazonKthLexicographicalHappyString: TranscriptEntry = {
  summary: {
    slug: "amazon-kth-lexicographical-happy-string",
    title: "K-th Lexicographical Happy String",
    category: "dsa",
    difficulty: Difficulty.MEDIUM,
    duration: 34,
    company: "Amazon",
    tags: [
      "Combinatorics",
      "Backtracking",
      "Bit Manipulation",
      "Overflow Handling",
      "Precomputation",
    ],
    description:
      "SDE2 DSA interview on finding the k-th lexicographical happy string of length n. Covers backtracking generation, reframing the search tree as block-size division for direct O(n) construction, integer-overflow handling in the count formula, and scoping a precomputation suggestion to repeated-query volume rather than a single call.",
  },

  transcript,
};

export default amazonKthLexicographicalHappyString;