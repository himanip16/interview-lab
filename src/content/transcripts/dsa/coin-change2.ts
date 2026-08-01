// src/content/transcripts/technical/coin-change-ii-bounded-quantity.ts

import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Coin Change II — Bounded Quantity Variation",
    difficulty: Difficulty.HARD,
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
            "Variation on Coin Change II. You have coin denominations, but this time each denomination has a limited quantity available — not infinite. Count the number of distinct ways to make up a target amount.",
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
            "Before anything — same as classic Coin Change II, are we counting combinations or permutations? Meaning, is using one 1-rupee coin then a 2-rupee coin different from using the 2 first then the 1, or are those the same way?",
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
          value: "Combinations — order doesn't matter, same as the original problem.",
        },
      ],
    },
    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 55,
      content: [
        {
          type: "text",
          value:
            "Good, that's the harder of the two to get right, since the loop order in the DP matters a lot for combinations versus permutations. A couple more assumptions: can the answer get large enough that I should return it modulo something, like 1e9+7? And is a quantity of zero for some coin a real input, meaning that coin is effectively unusable, or is quantity always at least 1 for every listed denomination?",
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
          value: "Return it mod 1e9+7. And yes, quantity zero is valid input, treat it as unusable.",
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
          value:
            "Okay, edge cases before I propose an approach. Amount zero should return 1 — the empty combination, using no coins, is a valid way to make zero. Empty coins array with a positive target amount returns 0. Any coin with quantity zero, I can just filter out or treat its contribution as 'skip entirely' — same effect either way, but I'd rather filter it out up front so the DP loop doesn't need a zero-quantity special case buried inside it. And if the sum of every coin's value times its quantity is less than the target amount, the answer is 0 before I even run the DP — that's a cheap early exit.",
        },
        {
          id: "highlight-edge-cases-before-dp",
          type: "highlight",
          status: "strong",
          value: "Lists concrete edge cases — including a cheap early-exit condition — before proposing the DP",
          explanation:
            "The max-achievable-sum early exit is a detail that's easy to skip; stating it up front as an edge case, not discovered later, shows the candidate is thinking about the full input space before committing to an approach.",
        },
      ],
    },
    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 135,
      content: [
        {
          type: "text",
          value: "Give me a brute-force approach and its complexity before you write anything.",
        },
      ],
    },
    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 165,
      content: [
        {
          type: "text",
          value:
            "Brute force is recursive backtracking — for each coin, try using it 0 up to its quantity times, recurse on the remaining amount and remaining coins, sum up the ways that hit exactly zero. Worst case that's the product of (quantity_i + 1) across all coins — exponential, since it's exploring every combination of counts independently before checking if they sum to the target. Completely impractical past a handful of coins.",
        },
        {
          id: "highlight-brute-force-complexity",
          type: "highlight",
          status: "strong",
          value: "States the exact exponential blow-up — product of (quantity+1) across coins — before coding",
          explanation:
            "Rather than a vague 'exponential', candidate names precisely what's multiplying — the per-coin choice count — which sets up the DP's improvement concretely later.",
        },
      ],
    },
    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 195,
      content: [
        {
          type: "text",
          value: "Right, unusable. What's your DP, and what's its complexity before you write it?",
        },
      ],
    },
    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 235,
      content: [
        {
          type: "text",
          value:
            "Classic unbounded Coin Change II uses dp[j] = number of ways to make amount j, processing coins one at a time, and for each coin, iterating j from the coin's value up to the target, accumulating dp[j] += dp[j - coin]. That works because processing amounts left-to-right for a single coin naturally allows reusing that coin any number of times. With a bounded quantity, I can't just let it reuse freely — I need a nested loop over how many of this coin I actually use, from 0 to its quantity, for every amount. That's O(amount) per coin per count, so O(coins * amount * maxQuantity) overall. If quantity can be large, that's the part I'd want to improve.",
        },
        {
          id: "highlight-bounded-dp-complexity",
          type: "highlight",
          status: "strong",
          value: "States O(coins * amount * maxQuantity) for the direct bounded-DP extension before coding it",
          explanation:
            "Complexity is derived from the specific structural change — the added quantity dimension — rather than asserted generically, and the candidate flags exactly which factor is the target for optimization.",
        },
      ],
    },
    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 265,
      content: [
        {
          type: "text",
          value: "That's correct but slow if quantity is large. Can you do better?",
        },
      ],
    },
    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 310,
      content: [
        {
          type: "text",
          value:
            "Yes — binary splitting. Instead of trying counts 0 through quantity one at a time, I decompose a coin's available quantity into groups sized as powers of two — 1, 2, 4, 8, ... up to the largest power of two that fits, plus one leftover group for the remainder. Any count from 0 to quantity can be formed by picking a subset of these groups, because that's just binary representation. So each group becomes a 'virtual coin' worth (original coin value times group size), and I run a standard 0/1 knapsack — each virtual coin used at most once — instead of a bounded one. That cuts the count dimension from O(quantity) to O(log quantity) virtual coins per real coin.",
        },
        {
          id: "highlight-binary-splitting",
          type: "highlight",
          status: "strong",
          value: "Applies binary/power-of-two splitting to convert bounded knapsack into 0/1 knapsack",
          explanation:
            "This is the standard technique for bounded knapsack optimization, but the candidate explains *why* it's valid — any count up to quantity is representable as a subset sum of power-of-two groups — rather than naming it as a memorized trick.",
        },
      ],
    },
    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 345,
      content: [
        {
          type: "text",
          value: "What's the new overall complexity, and code it. Plain Java.",
        },
      ],
    },
    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 400,
      content: [
        {
          type: "text",
          value:
            "O(coins * log(maxQuantity) * amount) — each coin contributes about log2(quantity) virtual coins, and each virtual coin does one O(amount) 0/1 knapsack pass.",
        },
        {
          type: "code",
          language: "java",
          value:
            "public int countWaysBounded(int[] coinValues, int[] quantities, int amount) {\n    final int MOD = 1_000_000_007;\n    long[] dp = new long[amount + 1];\n    dp[0] = 1;\n\n    for (int i = 0; i < coinValues.length; i++) {\n        int value = coinValues[i];\n        int qty = quantities[i];\n        if (qty <= 0) continue;\n\n        int remaining = qty;\n        int groupSize = 1;\n        while (remaining > 0) {\n            int take = Math.min(groupSize, remaining);\n            int virtualWeight = value * take;\n\n            for (int j = amount; j >= virtualWeight; j--) {\n                dp[j] = (dp[j] + dp[j - virtualWeight]) % MOD;\n            }\n\n            remaining -= take;\n            groupSize *= 2;\n        }\n    }\n\n    return (int) dp[amount];\n}",
        },
        {
          type: "text",
          value:
            "The inner loop counts down from amount to virtualWeight — that's the 0/1 knapsack direction, so each virtual coin's contribution is only applied once per position, not reused within the same coin's pass.",
        },
      ],
    },
    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 430,
      content: [
        {
          type: "text",
          value: "Why does the inner loop have to count down here, when classic unbounded Coin Change II counts up?",
        },
      ],
    },
    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 460,
      content: [
        {
          type: "text",
          value:
            "That direction is exactly what encodes 'use this item at most once' versus 'use it any number of times'. Counting up, dp[j - value] might already reflect this same coin having been used earlier in this same pass, letting it be reused — that's what gives unbounded behavior. Counting down, by the time I update dp[j], dp[j - virtualWeight] still holds the value from *before* this virtual coin's pass started, so it can only be counted in or out once. Since I've already split quantity into these power-of-two chunks specifically to make each chunk a single all-or-nothing choice, counting down is what keeps that guarantee intact.",
        },
        {
          id: "highlight-loop-direction-reasoning",
          type: "highlight",
          status: "strong",
          value: "Explains precisely why loop direction encodes bounded-vs-unbounded reuse",
          explanation:
            "This is a frequently-memorized-without-understanding detail in knapsack DPs. The candidate gives the actual mechanism — what dp[j-weight] reflects at update time — rather than reciting 'count down for 0/1, count up for unbounded' as a rule.",
        },
      ],
    },
    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 490,
      content: [
        {
          type: "text",
          value: "What's a bug you'd watch for in the binary-splitting loop itself?",
        },
      ],
    },
    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 520,
      content: [
        {
          type: "text",
          value:
            "The remainder handling. If quantity isn't exactly a power of two minus one, the last group isn't a full power of two — it's whatever's left, and I have to cap it with `Math.min(groupSize, remaining)` like I did, not just keep doubling blindly. If I forgot that cap, I could generate virtual coins that sum to more than the actual available quantity, which would let the DP count combinations using more coins than actually exist — silently wrong, higher counts than the true answer, and nothing would crash to reveal it.",
        },
        {
          id: "highlight-remainder-bug",
          type: "highlight",
          status: "strong",
          value: "Names the exact silent-overcounting bug from mishandling the non-power-of-two remainder",
          explanation:
            "Interviewer asks the candidate to anticipate a bug rather than just present working code — candidate identifies a specific, silent, hard-to-detect failure mode rather than a generic 'off by one somewhere'.",
        },
      ],
    },
    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 550,
      content: [
        {
          type: "text",
          value:
            "Can you get rid of the log factor entirely — true O(coins * amount), no quantity term at all?",
        },
      ],
    },
    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 600,
      content: [
        {
          type: "text",
          value:
            "There is a technique for that — the sliding-window optimization for bounded knapsack. The idea: for a fixed coin value v, positions in the dp array that differ by a multiple of v are the only ones that can ever contribute to each other for that coin, so you can group dp indices by their remainder mod v into independent chains. Within each chain, the bounded contribution is a sliding-window sum of at most (quantity + 1) consecutive elements, which you can maintain with a monotonic deque or a running prefix sum in O(1) amortized per position instead of redoing work per count. That gets each coin's full contribution down to O(amount) total, so O(coins * amount) overall, no quantity or log(quantity) factor at all.",
        },
        {
          id: "highlight-sliding-window-technique",
          type: "highlight",
          status: "note",
          value: "Names the sliding-window/monotonic-deque technique for true O(coins*amount) bounded knapsack",
          explanation:
            "Candidate correctly identifies the existence and mechanism of the fully optimal technique when pushed a second time on optimization, showing awareness beyond the commonly-known binary-splitting trick.",
        },
        {
          type: "text",
          value:
            "Honestly though, I'd think hard before actually coding that under interview time pressure — the remainder-mod-v chain indexing and the monotonic deque bookkeeping are both easy to get subtly wrong live, and binary splitting already gets the log factor down to something like 20-30 for realistic quantities, which is a very small constant next to amount and coin count. Unless the interview specifically wants the fully optimal version, I'd rather ship the correct, well-understood O(log quantity) solution than risk a half-working O(1) attempt at the sliding window.",
        },
        {
          id: "highlight-honest-tradeoff",
          type: "highlight",
          status: "strong",
          value: "Names the theoretically optimal technique but honestly declines to implement it under time pressure",
          explanation:
            "Rather than attempting a complex technique it risks getting wrong live, the candidate makes an explicit engineering trade-off — correctness and time-to-ship over a marginal complexity improvement — and states the reasoning plainly instead of either refusing the question or overcommitting.",
        },
      ],
    },
    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 640,
      content: [
        {
          type: "text",
          value: "Fair. Give me concrete test cases.",
        },
      ],
    },
    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 675,
      content: [
        {
          type: "text",
          value:
            "coinValues=[1,2,5], quantities=[5,2,1], amount=5 — I'd trace this by hand to confirm the count, but the key check is that it's strictly less than or equal to the unbounded version's answer for the same coins and amount, since bounding quantity can only remove combinations, never add any. amount=0 should return 1 regardless of coins. A coin with quantity 0 mixed into the array should behave identically to that coin being absent entirely. And a case where total available value across all coins is less than amount should return 0 without even running the main loop — that's the early-exit edge case from the start.",
        },
        {
          id: "highlight-invariant-based-test",
          type: "highlight",
          status: "strong",
          value: "Uses the unbounded-version's answer as an upper-bound invariant to sanity-check the bounded result",
          explanation:
            "Rather than only checking exact numeric outputs, candidate proposes a relational test — bounded count can never exceed unbounded count for the same inputs — which catches a wider class of bugs than a single hardcoded expected value would.",
        },
      ],
    },
    {
      id: "23",
      role: "takeaway",
      elapsedSeconds: 700,
      content: [
        {
          type: "text",
          value:
            "Takeaway: this session leads with assumptions and complexity stated before any code exists — clarifying combinations-versus-permutations, the modulo requirement, and zero-quantity handling up front, then naming the brute force's exact exponential blow-up (product of quantity+1 across coins) and the direct bounded-DP's O(coins*amount*maxQuantity) cost before proposing the optimization. The binary-splitting technique is explained by its underlying justification — any count is a subset-sum of power-of-two groups — not recited as a memorized trick, and the candidate correctly reasons through why the knapsack loop must count downward to preserve each virtual coin's 'use at most once' guarantee, rather than stating the direction as a rule. Two real risks get named without being triggered as bugs: silent overcounting if the binary-split remainder isn't capped correctly, and the general risk of attempting the fully optimal sliding-window technique under time pressure. That last point is the strongest moment in the round — pushed a second time to eliminate the log factor entirely, the candidate correctly names the sliding-window/monotonic-deque technique that achieves it, but explicitly declines to implement it live, trading a small constant-factor improvement for delivering correct, well-understood code — a real engineering judgment call, not evasion. Closes with a relational test (bounded count can never exceed the unbounded count for the same inputs) that catches a broader class of bugs than fixed expected-value assertions alone.",
        },
      ],
    },
  ],
};

const coinChangeIIBoundedQuantity: TranscriptEntry = {
  summary: {
    id: 19,

    slug: "coin-change-ii-bounded-quantity",
    title: "Coin Change II — Bounded Quantity Variation",
    category: "dsa",
    difficulty: Difficulty.HARD,
    duration: 40,
    tags: [
      "Dynamic Programming",
      "Knapsack",
      "DSA",
      "Complexity Analysis",
      "Edge Cases",
      "Java",
    ],
    description:
      "DP variation of Coin Change II (LeetCode 518) where each coin denomination has a limited available quantity rather than infinite supply, counting combinations to reach a target amount mod 1e9+7. Candidate clarifies combinations-vs-permutations and zero-quantity handling before proposing anything, states the brute force's exact exponential blow-up (product of quantity+1 across coins) and the direct bounded-DP extension's O(coins*amount*maxQuantity) cost explicitly before coding either. Optimizes via binary/power-of-two splitting into a 0/1 knapsack (O(coins*log(maxQuantity)*amount)), explaining the subset-sum justification for the technique and correctly reasoning through why the knapsack loop must run backward to preserve single-use semantics per virtual coin. Names a real silent-overcounting bug risk from mishandling the binary-split remainder. Pushed a second time toward true O(coins*amount) via a sliding-window/monotonic-deque bounded-knapsack technique, the candidate correctly identifies the method but explicitly declines to implement it under interview time pressure, stating the correctness-versus-marginal-optimization trade-off plainly. Closes with a relational test — bounded count can never exceed the unbounded version's count for the same inputs — alongside standard edge cases.",
  },

  transcript,
};

export default coinChangeIIBoundedQuantity;