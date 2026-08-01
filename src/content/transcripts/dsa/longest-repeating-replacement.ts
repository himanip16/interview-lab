// src/content/transcripts/dsa/longest-repeating-replacement-sliding-window.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Longest Repeating Character Replacement: Sliding Window Invariant",
    difficulty: Difficulty.MEDIUM,
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
            "Given a string s and an integer k, you can change any character to any other uppercase letter at most k times. Return the length of the longest substring containing the same letter after performing these changes.",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 15,
      content: [
        {
          type: "text",
          value:
            "So I need a substring where every character is the same, and I'm allowed to change up to k characters to make that happen. Start simple — check every possible substring, count the frequency of the most common character, and see if I can fill the rest with k changes.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 30,
      content: [
        {
          type: "text",
          value: "Code that.",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 75,
      content: [
        {
          type: "text",
          value: "For every starting position i, check all substrings starting there.",
        },
        {
          type: "code",
          id: "code-brute-force",
          language: "python",
          value:
            "def characterReplacement(s, k):\n    max_len = 0\n    for i in range(len(s)):\n        char_count = {}\n        for j in range(i, len(s)):\n            char_count[s[j]] = char_count.get(s[j], 0) + 1\n            max_freq = max(char_count.values())\n            changes_needed = (j - i + 1) - max_freq\n            if changes_needed <= k:\n                max_len = max(max_len, j - i + 1)\n    return max_len",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 100,
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
      elapsedSeconds: 115,
      content: [
        {
          type: "text",
          value:
            "O(n²) because I'm iterating through all substrings, and for each one I compute the max character frequency. With n up to 10⁵, that's 10¹⁰ operations in the worst case, which is tight.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 128,
      content: [
        {
          type: "text",
          value:
            "Can you improve this? The key observation is that you're expanding a window, checking validity, and moving on. What if you shrink when needed?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 152,
      content: [
        {
          type: "text",
          value:
            "Use a sliding window with two pointers. Start with left = 0, right = 0. Expand right, maintain character frequencies in the window, and when the number of changes needed exceeds k, shrink from the left.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 168,
      content: [
        {
          type: "text",
          value: "Walk me through s = 'AABABBA', k = 1.",
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
            "Start left=0, right=0. Expand right to 0: 'A', freq={A:1}, max_freq=1, window=1, changes=0, valid. Expand to 1: 'AA', freq={A:2}, max_freq=2, window=2, changes=0, valid. Expand to 2: 'AAB', freq={A:2,B:1}, max_freq=2, window=3, changes=1, valid. Expand to 3: 'AABA', freq={A:3,B:1}, max_freq=3, window=4, changes=1, valid. Expand to 4: 'AABAB', freq={A:3,B:2}, max_freq=3, window=5, changes=2, invalid. Shrink left to 1: 'ABAB', freq={A:2,B:2}, max_freq=2, window=4, changes=2, still invalid. Shrink to 2: 'BAB', freq={A:1,B:2}, max_freq=2, window=3, changes=1, valid.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 235,
      content: [
        {
          type: "text",
          value: "Continue to the end.",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 270,
      content: [
        {
          type: "text",
          value:
            "Expand to 5: 'BABB', freq={A:1,B:3}, max_freq=3, window=4, changes=1, valid. Expand to 6: 'BABBA', freq={A:2,B:3}, max_freq=3, window=5, changes=2, invalid. Shrink left to 3: 'ABBA', freq={A:1,B:3}, max_freq=3, window=4, changes=1, valid. No more characters. Max window was 4.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 290,
      content: [
        {
          type: "text",
          value: "Code it.",
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
          value: "Two pointers with a character frequency map.",
        },
        {
          type: "code",
          id: "code-two-pointer",
          language: "python",
          value:
            "def characterReplacement(s, k):\n    char_count = {}\n    left = 0\n    max_len = 0\n\n    for right in range(len(s)):\n        char_count[s[right]] = char_count.get(s[right], 0) + 1\n        max_freq = max(char_count.values())\n        window_len = right - left + 1\n        changes_needed = window_len - max_freq\n\n        if changes_needed > k:\n            char_count[s[left]] -= 1\n            if char_count[s[left]] == 0:\n                del char_count[s[left]]\n            left += 1\n        else:\n            max_len = max(max_len, window_len)\n\n    return max_len",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 360,
      content: [
        {
          type: "text",
          value: "Complexity now?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 375,
      content: [
        {
          type: "text",
          value:
            "O(n) for the loop, but max(char_count.values()) is O(26) since there are only 26 uppercase letters. So overall O(26n) = O(n). Space is O(1) since the character map has at most 26 entries.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 390,
      content: [
        {
          type: "text",
          value:
            "One thing worries me — you're calling max(char_count.values()) every iteration. Can you avoid that?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 415,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-track-max-freq",
          type: "highlight",
          status: "strong",
          value: "maintain a running max_freq variable that only increases, never decreases",
          explanation:
            "Since we only care about finding any valid window, max_freq is a lower bound that can only grow. When we shrink the window, we don't recompute max_freq because a smaller window with the same max_freq could still be valid, and we're only looking for the longest anyway.",
        },
        {
          type: "text",
          value:
            " Track max_freq as you update frequencies. When you expand right, update max_freq. When you shrink left, don't bother updating max_freq downward — you're looking for the maximum window size anyway.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 435,
      content: [
        {
          type: "text",
          value: "Does that break correctness?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 460,
      content: [
        {
          type: "text",
          value:
            "Let me think. If max_freq stops being accurate, then changes_needed = window_len - max_freq might be too low, making us think the window is valid when it's not. But that only happens if the true max_freq inside the window is higher than what we're tracking. After shrinking, the window is smaller, so the true max_freq inside it can't go up — it can only stay the same or decrease. So if we overestimate max_freq, we underestimate changes_needed, and... actually, that seems wrong.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 485,
      content: [
        {
          type: "text",
          value:
            "Let me guide you. After shrinking, the window is smaller. If the true max_freq in the new window is lower than what we're tracking, what happens?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 510,
      content: [
        {
          type: "text",
          value:
            "We compute changes_needed = window_len - stale_max_freq, which gives a number smaller than the true changes needed. The window might seem valid when it's not... but wait, then we'd expand right and record a longer window that's actually invalid.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 530,
      content: [
        {
          type: "text",
          value:
            "Exactly. So if we track a stale max_freq and claim validity, we keep the window. We don't shrink. What happens as we keep expanding with that stale max_freq?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 555,
      content: [
        {
          type: "text",
          value:
            "Eventually, when we expand enough, the true changes_needed will exceed k, and we'll be forced to shrink anyway. By then, we've already recorded a window that might be too long, but... only as long as the stale max_freq allows. Hmm, I think the key is that we're looking for the maximum window, and any window we record when the stale max_freq is in play is still a valid candidate for the answer, even if we don't shrink it right away.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 580,
      content: [
        {
          type: "text",
          value:
            "Think about it differently. We never shrink the window size. We only move left pointer forward when the window becomes invalid. If we're using a stale max_freq and the window seems valid, we're safe — because we never actually hit the true constraint violation until we expand more.",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 605,
      content: [
        {
          type: "text",
          value:
            "Oh, I see. The algorithm is: as long as the window is valid (or seems valid with stale max_freq), keep expanding. The first time you'd be forced to shrink, you move left forward once and check again. If you're still invalid, you shrink more. By never updating max_freq downward, you're essentially saying 'I'm looking for windows of size at least max_freq I've seen so far.' Any window smaller than that becomes invalid for the answer anyway. The algorithm naturally finds the longest window by never letting window_len drop permanently.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 630,
      content: [
        {
          type: "text",
          value: "Exactly. Code it with that optimization.",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 670,
      content: [
        {
          type: "text",
          value: "Track max_freq directly, update it on expansion, leave it alone on shrinking.",
        },
        {
          type: "code",
          id: "code-optimized",
          language: "python",
          value:
            "def characterReplacement(s, k):\n    char_count = {}\n    left = 0\n    max_freq = 0\n    max_len = 0\n\n    for right in range(len(s)):\n        char_count[s[right]] = char_count.get(s[right], 0) + 1\n        max_freq = max(max_freq, char_count[s[right]])\n        window_len = right - left + 1\n        changes_needed = window_len - max_freq\n\n        if changes_needed > k:\n            char_count[s[left]] -= 1\n            left += 1\n\n    return right - left + 1",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 695,
      content: [
        {
          type: "text",
          value: "Why is the final return value right - left + 1 and not max_len?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 720,
      content: [
        {
          type: "text",
          value:
            "Because we never shrink the window to a size smaller than the longest valid one we've found. Once we find a window of size L that's valid, we never let left catch up to right enough to make the window smaller than L. So at the end, the window itself is the answer.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 738,
      content: [
        {
          type: "text",
          value:
            "Follow-up: what if instead of changing up to k characters, you had to delete up to k characters to form the longest repeating substring?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 765,
      content: [
        {
          type: "text",
          value:
            "That's different — I'm looking for a substring where all characters are the same, but I'm allowed to skip up to k characters (delete them). So in a window [left, right], the longest repeating substring I can form has length = count of the most frequent character, and I skip the rest up to k times.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 785,
      content: [
        {
          type: "text",
          value:
            "Same window logic then. Characters to delete = window_len - max_freq. If that's <= k, it's valid.",
        },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 810,
      content: [
        {
          type: "text",
          value:
            "Same algorithm! The only difference is semantic — we're counting skipped characters instead of changed ones, but the math is identical. You'd get the longest repeating substring after deletions using the exact same sliding window.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 828,
      content: [
        {
          type: "text",
          value:
            "One more follow-up: what if you could perform different operations with different budgets — say, change up to k₁ characters and delete up to k₂ characters?",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 855,
      content: [
        {
          type: "text",
          value:
            "The constraint becomes: (window_len - max_freq) <= k₁ + k₂. We're allowed to use up to k₁ + k₂ operations total to make the window all the same character. So you'd just increase your allowed budget to k₁ + k₂, and the algorithm stays the same.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 875,
      content: [
        {
          type: "text",
          value:
            "Exactly. The problem is abstraction-agnostic to the operation type. As long as you can express the constraint as 'operations_count <= budget', sliding window works.",
        },
      ],
    },

    {
      id: "38",
      role: "takeaway",
      elapsedSeconds: 890,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Longest Repeating Character Replacement is solved with a sliding window where the key insight is that for any window, the number of changes needed equals window_length minus the frequency of the most common character. The window is valid if changes_needed <= k. The algorithm expands right and shrinks left whenever the window becomes invalid, maintaining O(n) time complexity by avoiding recomputation of the maximum frequency. A crucial optimization is realizing that max_freq never needs to decrease — you're looking for the longest window, and by never shrinking it below the best size found so far, the final window naturally contains the answer. This one-pointer-like behavior simplifies the code and makes the correctness argument cleaner: once a window of size L is valid, the algorithm ensures the window size stays >= L for the rest of the traversal. The same sliding window logic applies to deletion variants and multi-operation scenarios where the constraint is framed as total operations <= budget.",
        },
      ],
    },
  ],
};

const longestRepeatingCharacterReplacement: TranscriptEntry = {
  summary: {    id: 24,

    slug: "longest-repeating-replacement-sliding-window",
    title: "Longest Repeating Character Replacement: Sliding Window Invariant",
    category: "dsa",
    difficulty: Difficulty.MEDIUM,
    duration: 40,
    company: "Generic",
    tags: [
      "Sliding Window",
      "Two Pointers",
      "String",
      "Greedy",
      "Frequency Map",
      "Optimization",
    ],
    description:
      "Coding interview on LeetCode's Longest Repeating Character Replacement: starting with O(n²) brute force on all substrings, recognizing the shrinking window pattern, implementing two-pointer sliding window with character frequency tracking, and crucially, optimizing by maintaining max_freq without recomputation. Includes the non-obvious insight that max_freq never needs to decrease, enabling a one-pass traversal where the window itself becomes the answer. Extends to deletion and multi-operation variants.",
  },

  transcript,
};

export default longestRepeatingCharacterReplacement;