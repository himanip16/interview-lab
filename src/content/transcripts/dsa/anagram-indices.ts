// src/content/transcripts/dsa/find-all-anagrams.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Find All Anagram Indices",
    difficulty: Difficulty.MEDIUM,
    company: "Amazon",
    duration: 40,
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
            "Given two strings str and pattern, return an array of all start indices in str where a substring is an anagram of pattern. For example, str = \"acbadabcaa\", pattern = \"aabc\" gives [0, 5, 6].",
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
            "So I'm looking for every window the same length as pattern where the letters match exactly as a multiset — order inside the window doesn't matter?",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 20,
      content: [
        { type: "text", value: "Right. Go ahead." },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 35,
      content: [
        {
          type: "text",
          value:
            "First thing that comes to mind — take every substring of str the same length as pattern, sort both, and compare the sorted strings.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 50,
      content: [
        { type: "text", value: "Walk me through the cost of that." },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 65,
      content: [
        {
          type: "text",
          value:
            "There are roughly n minus m windows, and sorting each one costs m log m... though wait, am I also re-sorting pattern every single time inside that loop?",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 78,
      content: [
        { type: "text", value: "Is it?" },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 90,
      content: [
        {
          type: "text",
          value:
            "No — I'd sort pattern once outside the loop. So it's O(m log m) once, plus O(n times m log m) for the windows. Still dominated by the window sorts.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 105,
      content: [
        { type: "text", value: "Are you sure that's the best you can do?" },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 120,
      content: [
        {
          type: "text",
          value:
            "...Probably not. Sorting feels like overkill just to check 'same letters, same counts' — I don't actually need the order at all.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 130,
      content: [
        { type: "text", value: "So what do you do instead?" },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 148,
      content: [
        {
          type: "text",
          value:
            "Use a 26-length count array. Build the frequency counts of pattern once, then the frequency counts of the current window, and compare the two arrays.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 160,
      content: [
        { type: "text", value: "Compare how — recheck all 26 slots at every single position?" },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 175,
      content: [
        {
          type: "text",
          value:
            "If I recompute the whole window's counts from scratch at every position and compare 26 numbers, that's O(26n) — which might be fine, but can I avoid rebuilding the window count every time?",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 185,
      content: [
        { type: "text", value: "Can you?" },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 200,
      content: [
        {
          type: "text",
          value:
            "Yeah — slide the window by one instead. One character leaves on the left, one enters on the right, and I update counts incrementally rather than recomputing the whole window.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 210,
      content: [
        { type: "text", value: "Okay, but you still said comparing 26 counts at every position. Why does that still cost you?" },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 225,
      content: [
        {
          type: "text",
          value:
            "Right, that's still O(26) per position, O(26n) overall — better constant, but the 26 doesn't disappear. I could instead track a single 'matches' counter that only changes when one specific character's count crosses into or out of equality with pattern's count for that character.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 240,
      content: [
        { type: "text", value: "Skip the code for a second — walk me through what happens to that counter when a character enters the window." },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 260,
      content: [
        {
          type: "text",
          value:
            "I increment that character's count in the window array. If the new count now equals pattern's count for that character, matches goes up by one. If it was already equal before and now overshoots, matches actually goes down by one — since it was equal and now isn't.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 275,
      content: [
        { type: "text", value: "And are you sure that's symmetric when a character leaves the window on the left?" },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 290,
      content: [
        {
          type: "text",
          value: "When it leaves I just decrement its count in the window array.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 298,
      content: [
        { type: "text", value: "And the matches counter?" },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 312,
      content: [
        {
          type: "text",
          value: "...oh — right, I need the same before-and-after equality check on the decrement, mirroring the entering logic. Otherwise the counter goes stale and I'd trust a number that's no longer true.",
        },
        {
          id: "highlight-symmetric-fix",
          type: "highlight",
          status: "strong",
          value: "before-and-after equality check",
          explanation:
            "Catches, without being told directly, that the matches-counter update must be applied symmetrically on both the entering and leaving side of the window, not just on entry.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 325,
      content: [
        { type: "text", value: "Okay. What's your complexity now?" },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 340,
      content: [
        {
          type: "text",
          value:
            "Each position does O(1) work now instead of O(26), so it's",
        },
        {
          id: "highlight-linear-time",
          type: "highlight",
          status: "strong",
          value: "O(n)",
          explanation:
            "Correctly collapses the per-position cost from O(26) down to O(1) once the matches counter replaces a full array comparison, giving true linear time.",
        },
        { type: "text", value: " overall, with O(26) space for the two count arrays." },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 355,
      content: [
        { type: "text", value: "Write the code." },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 380,
      content: [
        {
          type: "code",
          language: "python",
          value:
            "def findAnagrams(str_, pattern):\n    n, m = len(str_), len(pattern)\n    if m > n:\n        return []\n\n    p_count = [0] * 26\n    w_count = [0] * 26\n    for ch in pattern:\n        p_count[ord(ch) - ord('a')] += 1\n\n    matches = 0\n    result = []\n\n    def bump(idx, delta):\n        nonlocal matches\n        before = w_count[idx] == p_count[idx]\n        w_count[idx] += delta\n        after = w_count[idx] == p_count[idx]\n        if before and not after:\n            matches -= 1\n        elif after and not before:\n            matches += 1\n\n    for i in range(n):\n        bump(ord(str_[i]) - ord('a'), 1)\n\n        if i >= m:\n            bump(ord(str_[i - m]) - ord('a'), -1)\n\n        if i >= m - 1 and matches == 26:\n            result.append(i - m + 1)\n\n    return result",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 400,
      content: [
        { type: "text", value: "What if str and pattern aren't guaranteed lowercase-only — say full Unicode text?" },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 420,
      content: [
        {
          type: "text",
          value:
            "Then a fixed 26-slot array doesn't work — I'd swap both count arrays for hash maps keyed by character instead.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 435,
      content: [
        { type: "text", value: "What does that swap actually cost you?" },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 450,
      content: [
        {
          type: "text",
          value:
            "It's still O(n) time overall, but it's amortized rather than strictly O(1) per operation, since hash map inserts and lookups aren't guaranteed constant. Space also stops being a fixed O(26) — it grows with however many distinct characters actually show up.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 465,
      content: [
        { type: "text", value: "Now say str isn't sitting in memory — it's a live stream, characters arriving one at a time, and you can't index back into it. What happens to your approach?" },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 485,
      content: [
        {
          type: "text",
          value:
            "I can't just do str[i - m] anymore since I don't have random access into the past. I'd need to keep the last m characters myself, in a circular buffer, so I know exactly what's leaving when a new one arrives.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 500,
      content: [
        { type: "text", value: "What breaks specifically if you skip the buffer?" },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 515,
      content: [
        {
          type: "text",
          value:
            "I'd know what's entering the window, but I'd have no way to know which character to decrement when the window slides — the matches counter update needs both sides, and I'd have silently lost the leaving side.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 528,
      content: [
        { type: "text", value: "And if m itself is huge — pattern is a million characters?" },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 545,
      content: [
        {
          type: "text",
          value:
            "Then the buffer costs O(m) memory regardless of what else I do — that part's unavoidable, since I fundamentally need to remember the last m characters to know what's leaving.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 560,
      content: [
        { type: "text", value: "Say you're running this same anagram check for thousands of different patterns simultaneously, against the same stream. Still one sliding window per pattern?" },
      ],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 580,
      content: [
        {
          type: "text",
          value:
            "That'd mean thousands of separate buffers and counters doing basically the same bookkeeping over and over... let me think about what's actually different between them. If two patterns are the same length, the window mechanics — what enters, what leaves — are literally identical between them. Only the target frequency vector differs.",
        },
      ],
    },

    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 595,
      content: [
        { type: "text", value: "So why does grouping by length actually help you, specifically?" },
      ],
    },

    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 615,
      content: [
        {
          type: "text",
          value:
            "Because I can run one shared sliding window per distinct pattern length, doing the incremental count updates once, and then just check that shared window's frequency vector against every pattern of that length — instead of paying the buffer-and-slide cost separately per pattern.",
        },
        {
          id: "highlight-length-grouping",
          type: "highlight",
          status: "strong",
          value: "one shared sliding window per distinct pattern length",
          explanation:
            "Recognizes that the sliding-window mechanics depend only on window length, not on the target pattern itself, and factors the shared cost out instead of duplicating it per pattern.",
        },
      ],
    },

    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 630,
      content: [
        { type: "text", value: "Good — that's what I wanted to dig into. Let's stop there." },
      ],
    },

    {
      id: "44",
      role: "takeaway",
      elapsedSeconds: 650,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the core move is replacing per-window sorting with a fixed-size frequency count, then collapsing the O(26) comparison into an O(1) matches counter that must be updated symmetrically on both the entering and leaving side of the window. The follow-ups reward noticing what a constraint change actually breaks — Unicode forces counts into a hash map, a live stream forces an explicit buffer since random access is gone — and, when scaling to many patterns at once, spotting that the sliding-window mechanics depend only on window length and can be shared across all patterns of that length rather than duplicated.",
        },
      ],
    },
  ],
};

const amazonFindAllAnagrams: TranscriptEntry = {
  summary: {
    slug: "amazon-find-all-anagrams",
    title: "Find All Anagram Indices",
    category: "dsa",
    difficulty: Difficulty.MEDIUM,
    duration: 40,
    company: "Amazon",
    tags: [
      "Sliding Window",
      "Hashing",
      "String Matching",
      "Frequency Count",
      "Streaming",
    ],
    description:
      "SDE2 DSA interview on finding anagram start indices in a string. Covers the sort-based brute force, the fixed-array frequency count optimization, collapsing the comparison into an O(1) matches counter, then scales to Unicode alphabets, unbounded live streams, and running the check for many patterns at once.",
  },

  transcript,
};

export default amazonFindAllAnagrams;