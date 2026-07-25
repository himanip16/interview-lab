// src/content/transcripts/dsa/word-break.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Segment a String Into Dictionary Words (Word Break I & II)",
    difficulty: Difficulty.HARD,
    duration: 40,
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
            "Given a string s and a dictionary of words wordDict, determine if s can be segmented into a space-separated sequence of one or more dictionary words. Example: s = \"leetcode\", wordDict = [\"leet\", \"code\"] — true, because \"leet code\" works.",
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
            "Can the same dictionary word be reused more than once in the segmentation? And is s guaranteed non-empty, all lowercase?",
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
          value: "Words can repeat as many times as you want. Yes, non-empty, lowercase letters only.",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 42,
      content: [
        {
          type: "text",
          value:
            "Okay. First instinct: try every prefix of s that matches a dictionary word, and recurse on the remainder. If any path gets the whole string consumed, it's true.",
        },
        {
          id: "highlight-naive-recursion",
          type: "highlight",
          status: "missed",
          value: "plain recursion, no caching, branching on every valid prefix at every position",
          explanation:
            "Describes correct recursive structure but doesn't notice that the same suffix of s gets re-explored from multiple different paths — the classic overlapping-subproblems signal that plain recursion misses and DP exists to fix.",
        },
        {
          type: "text",
          value: ". Something like: try each word in the dict, if s starts with it, recurse on s[len(word):].",
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
            "Run that mentally on s = \"aaaaaaaaaaaaaaaaaaaaab\" (twenty a's then a b), with wordDict = [\"a\", \"aa\", \"aaa\", \"aaaa\", \"aaaaa\"]. What happens?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 90,
      content: [
        {
          type: "text",
          value:
            "...it's bad. At every position I've got up to five ways to eat into the run of a's, and none of them ever reach the b successfully until the very last a, so nothing prunes early. I'm re-deriving \"can I break the last k a's\" over and over from completely different starting points — that's the same subproblem solved a huge number of times. It's exponential, roughly branching-factor^n.",
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
          value: "So fix it.",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 132,
      content: [
        {
          type: "text",
          value: "Same recursion, but ",
        },
        {
          id: "highlight-memo-topdown",
          type: "highlight",
          status: "strong",
          value: "cache the result for each starting index, since \"can s[i:] be segmented\" only depends on i",
          explanation:
            "Correctly identifies that the recursive state collapses to a single integer — the start index — so memoizing on that index turns the exponential tree into at most n distinct subproblems.",
        },
        {
          type: "text",
          value: " — once I've answered it for a given index, never recompute it.",
        },
        {
          type: "code",
          id: "code-topdown-memo",
          language: "python",
          value:
            "def word_break(s: str, word_dict: list[str]) -> bool:\n    words = set(word_dict)\n    memo: dict[int, bool] = {}\n\n    def can_break(i: int) -> bool:\n        if i == len(s):\n            return True\n        if i in memo:\n            return memo[i]\n\n        ok = False\n        for j in range(i + 1, len(s) + 1):\n            if s[i:j] in words and can_break(j):\n                ok = True\n                break\n\n        memo[i] = ok\n        return ok\n\n    return can_break(0)",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 160,
      content: [
        {
          type: "text",
          value: "Now do it bottom-up, no recursion.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 186,
      content: [
        {
          type: "text",
          value:
            "dp[i] means s[:i] can be segmented. dp[0] is true — empty prefix trivially works. For each i, look back at every j less than i, and if dp[j] is true and s[j:i] is a word, dp[i] is true.",
        },
        {
          type: "code",
          id: "code-bottomup-dp",
          language: "python",
          value:
            "def word_break(s: str, word_dict: list[str]) -> bool:\n    words = set(word_dict)\n    n = len(s)\n    dp = [False] * (n + 1)\n    dp[0] = True\n\n    for i in range(1, n + 1):\n        for j in range(i):\n            if dp[j] and s[j:i] in words:\n                dp[i] = True\n                break\n\n    return dp[n]",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 210,
      content: [
        {
          type: "text",
          value: "Complexity?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 232,
      content: [
        {
          type: "text",
          value:
            "O(n^2) pairs of i and j, and each s[j:i] slice-plus-hash costs up to O(n) in the worst case, so O(n^3) overall, O(n^2) extra space if I count the slices, O(n) for the dp array itself. Could cap the inner loop to only try j within the length of the longest dictionary word instead of scanning back to 0 every time — that bounds it by O(n * maxWordLen) lookups instead of O(n^2).",
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
          value:
            "Good. Now the harder version — Word Break II. Same rules, but return every possible sentence, as a list of strings, each with words space-separated. s = \"catsanddog\", wordDict = [\"cat\", \"cats\", \"and\", \"sand\", \"dog\"] returns [\"cats and dog\", \"cat sand dog\"].",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 284,
      content: [
        {
          type: "text",
          value: "Feels like the same idea, just ",
        },
        {
          id: "highlight-naive-backtrack",
          type: "highlight",
          status: "missed",
          value: "backtrack over every valid split and collect the sentence when I reach the end, no caching",
          explanation:
            "Reuses the same untamed recursion from the first attempt at Word Break I, but for the enumeration version this is worse: without memoizing the list of sentences per index, the same suffix gets fully re-expanded into all its sentences from every path that reaches it.",
        },
        {
          type: "text",
          value: " — build up a path of words as I recurse, and when I hit the end of the string, join the path and add it to the results.",
        },
        {
          type: "code",
          id: "code-wb2-naive",
          language: "python",
          value:
            "def word_break_ii(s: str, word_dict: list[str]) -> list[str]:\n    words = set(word_dict)\n    results: list[str] = []\n\n    def backtrack(i: int, path: list[str]) -> None:\n        if i == len(s):\n            results.append(\" \".join(path))\n            return\n        for j in range(i + 1, len(s) + 1):\n            if s[i:j] in words:\n                path.append(s[i:j])\n                backtrack(j, path)\n                path.pop()\n\n    backtrack(0, [])\n    return results",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 316,
      content: [
        {
          type: "text",
          value:
            "Try s = \"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab\" — a long run of a's then a single b — with wordDict = [\"a\", \"aa\", \"aaa\", ..., every prefix of a's up to length 20]. Nothing in that dictionary can ever produce the b. What does your code do?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 348,
      content: [
        {
          type: "text",
          value:
            "It'd still try every single way to chop up the run of a's before finally hitting the b and failing each time — the recursion has no idea the whole thing is doomed until it's all the way at the end of a branch. That's exponential work spent proving something that's globally impossible from the start.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 372,
      content: [
        {
          type: "text",
          value: "So what do you actually cache here — and is caching alone enough?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 404,
      content: [
        {
          type: "text",
          value:
            "First thought: memoize index to the list of sentences for s[i:], same trick as before. That kills the re-expansion of the same suffix from different paths.",
        },
        {
          type: "text",
          value: "But that alone doesn't save me on your example — ",
        },
        {
          id: "highlight-memo-insufficient-alone",
          type: "highlight",
          status: "strong",
          value: "if s[i:] truly can't be segmented, I'd still discover that the slow way once per index, and there's a distinct 'impossible' cost at every single index in the run",
          explanation:
            "Recognizes a subtlety that a first pass at optimization often glosses over: memoizing the sentence lists helps with repeated work across paths, but doesn't eliminate the wasted exploration inside a suffix that's globally unbreakable — that needs a separate reachability check.",
        },
        {
          type: "text",
          value:
            ". I need a cheap yes/no first — run the boolean word-break DP from before to get canBreak[i] for every i in O(n * maxWordLen). Then in the sentence-building recursion, before I even try splitting at j, I check canBreak[j] — if it's false, don't bother recursing there at all. The boolean pass is cheap and prunes every dead branch before I pay for it.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 440,
      content: [
        {
          type: "text",
          value: "Write the whole thing.",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 486,
      content: [
        {
          type: "text",
          value:
            "canBreak[i] means s[i:] can be segmented at all — computed once, backwards, O(n * maxWordLen). Then memoized backtracking, pruned by canBreak before recursing into a suffix.",
        },
        {
          type: "code",
          id: "code-wb2-optimized",
          language: "python",
          value:
            "def word_break_ii(s: str, word_dict: list[str]) -> list[str]:\n    words = set(word_dict)\n    n = len(s)\n    max_len = max((len(w) for w in words), default=0)\n\n    # canBreak[i]: can s[i:] be fully segmented into dictionary words?\n    can_break = [False] * (n + 1)\n    can_break[n] = True\n    for i in range(n - 1, -1, -1):\n        for j in range(i + 1, min(i + max_len, n) + 1):\n            if can_break[j] and s[i:j] in words:\n                can_break[i] = True\n                break\n\n    if not can_break[0]:\n        return []\n\n    memo: dict[int, list[str]] = {n: [\"\"]}\n\n    def sentences_from(i: int) -> list[str]:\n        if i in memo:\n            return memo[i]\n\n        results: list[str] = []\n        for j in range(i + 1, min(i + max_len, n) + 1):\n            if not can_break[j]:\n                continue  # prune: this suffix can never complete\n            if s[i:j] in words:\n                for rest in sentences_from(j):\n                    results.append(s[i:j] if rest == \"\" else s[i:j] + \" \" + rest)\n\n        memo[i] = results\n        return results\n\n    return sentences_from(0)",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 522,
      content: [
        {
          type: "text",
          value: "s = \"aaaa...a\" (thirty a's), wordDict = every prefix of a's from length 1 to 20. How many sentences come back, and is your solution actually fast now?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 556,
      content: [
        {
          type: "text",
          value:
            "That's a case where can_break[0] is true — the run can absolutely be fully segmented, many different ways. The output itself is exponential in size, because the number of valid compositions of 30 using parts up to 20 is genuinely huge. No algorithm can return that faster than the size of what it returns, so this isn't something pruning or memoizing fixes — it's inherent to the problem whenever the output is large.",
        },
        {
          type: "text",
          value:
            "What the canBreak pruning buys me is specifically the earlier case — where a suffix can't be completed at all, like once the b showed up. There, without pruning, I pay exponential time to produce zero output. With pruning, I detect that dead end in O(1) per index instead of re-deriving it recursively. So: memoization removes duplicate work across shared suffixes, and canBreak pruning removes wasted work on suffixes that are dead ends. Neither one claims to make an output that's genuinely exponential in size come back faster — that part's just the cost of the problem.",
        },
      ],
    },

    {
      id: "23",
      role: "takeaway",
      elapsedSeconds: 590,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Word Break I starts as plain recursion over prefix splits, which looks fine until you notice the same suffix gets re-derived from multiple paths — memoizing on the start index (or its bottom-up dp[] equivalent) fixes that in O(n^2) to O(n^3) depending on how substring costs are counted, tightenable to O(n * maxWordLen) by bounding the inner loop to the longest dictionary word. Word Break II tempts a direct reuse of that recursion to enumerate sentences instead of a boolean, but memoizing the sentence lists alone doesn't save you from suffixes that are globally unbreakable — those need a separate O(n * maxWordLen) reachability pass (canBreak) computed once and checked before recursing, so dead branches are pruned in O(1) instead of rediscovered per path. Once a suffix is genuinely breakable in many ways, the output size itself can be exponential, and no amount of memoization or pruning changes that — it's a property of the problem, not the algorithm.",
        },
      ],
    },
  ],
};

const wordBreak: TranscriptEntry = {
  summary: {
    slug: "word-break-i-ii",
    title: "Segment a String Into Dictionary Words (Word Break I & II)",
    category: "dsa",
    difficulty: Difficulty.HARD,
    duration: 40,
    company: "Generic",
    tags: [
      "Dynamic Programming",
      "Recursion",
      "Memoization",
      "Backtracking",
      "Strings",
      "Hash Set",
      "Pruning",
    ],
    description:
      "Coding interview building Word Break I from naive exponential recursion up to a memoized/bottom-up O(n) reachability check, then extending into Word Break II — where memoizing sentence lists alone isn't enough, and a separate boolean reachability pass is needed to prune dead-end suffixes before enumerating all valid segmentations.",
  },

  transcript,
};

export default wordBreak;