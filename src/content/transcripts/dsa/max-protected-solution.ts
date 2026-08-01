// src/content/transcripts/dsa/maximum-protected-city-population.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Maximum Protected City Population — Cascading Shifts, Then a Global Shift Budget",
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
            "You've got an integer array population of size n, and a binary string protection of the same length. protection[i] == '0' means city i is currently protected; '1' means unprotected. You may shift any protected city's marker exactly one step left — index i to i-1 — at most once per marker, never past the left boundary, and two markers can never land on the same final index. Maximize total protected population.",
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
            "I want to slow down on that '0' means protected part before I do anything else — it's the opposite of what I'd assume walking in, and the prompt itself flags that some versions flip it. So let me just say it back: a marker physically exists at every index where the character is '0'. That's my set of things that can move.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 28,
      content: [
        { type: "text", value: "That's right. Good that you checked instead of assuming '1' means present." },
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
            "And when a marker leaves index i for i-1, i just goes back to unprotected — unless the marker that was originally at i+1 happens to shift into it. So the total number of protected cities after all shifts is always exactly the number of markers I started with, just possibly at different positions.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 58,
      content: [{ type: "text", value: "Right. So what's your first read on the structure here?" }],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 78,
      content: [
        {
          type: "text",
          value:
            "A marker at some position p can only ever end up at p or p-1. So the interesting question is just: for each marker, is it worth trading its current cell for the one on its left? My first instinct is to just walk left to right and, for each marker, compare population[p-1] against population[p] and move it if the left cell is bigger.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 95,
      content: [
        { type: "text", value: "Before you code that — what happens when two markers are sitting right next to each other?" },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 112,
      content: [
        {
          type: "text",
          value: "Let me actually build a case instead of guessing.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 118,
      content: [{ type: "text", value: "Go ahead." }],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 155,
      content: [
        {
          type: "text",
          value:
            "population = [0, 0, 5, 1, 6, 2], markers at indices 2, 3, 4 — three in a row.",
        },
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-independent-greedy-collision",
          type: "highlight",
          status: "missed",
          value:
            "comparing each marker to its left neighbor independently says move the marker at 3 into 2, because population[2] is 5 and population[3] is only 1",
          explanation:
            "Evaluating each marker's move purely against its immediate left neighbor's population, without checking whether that neighbor's own marker is actually vacating, produces an illegal collision whenever the target cell is occupied by a marker that has no reason to move — the two decisions were made independently but they're not independent.",
        },
        {
          type: "text",
          value:
            ". But the marker already sitting at index 2 has no reason to move — its own left neighbor, index 1, is population 0, way worse than staying at 5. So it stays. Which means the marker at 3 wanting to move into 2 is trying to land on a cell that's still occupied. That's an illegal collision, and my per-marker comparison never even noticed, because it evaluated 2 and 3 as separate decisions.",
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
          value: "So a marker's move depends on what its neighbor does. What's actually true about when a shift into i-1 is legal?",
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
            "A marker at position x can only move into x-1 if x-1 is empty at the moment it arrives. x-1 is empty either because there was never a marker there, or because the marker that was there also moved away — to x-2. So if I've got a run of markers sitting on consecutive indices, one of them shifting isn't a solo decision, it's the front of a chain: everyone behind it in the run has to shift too, or the move is illegal.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 228,
      content: [
        { type: "text", value: "So a run of markers only has a handful of valid final shapes, not 2 to the power of run length." },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 250,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-cascade-prefix",
          type: "highlight",
          status: "strong",
          value:
            "the only legal shapes for a run of m consecutive markers are: some prefix of t markers, counting from the left, all shift left by one, and the rest just stay put",
          explanation:
            "Reduces what looks like an exponential number of shift combinations per run down to exactly m+1 possibilities, because the collision rule forces shifts within a run to cascade from the left: if marker j shifts, marker j-1 within the same run must also shift, all the way back to the front of the run. This turns per-run optimization into checking t = 0..m rather than searching subsets.",
        },
        {
          type: "text",
          value:
            ". If t markers shift, it's always the first t in the run — never a marker in the middle shifting while the one behind it stays. That's only m+1 possible outcomes for a run of length m, not 2 to the m.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 272,
      content: [
        { type: "text", value: "Walk me through what a run occupies for a given t." },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 300,
      content: [
        {
          type: "text",
          value:
            "Run starts at p, length m. If the first t shift, those t markers end up at p-1 through p+t-2. The remaining m-t markers, from index t onward in the run, never moved, so they're still sitting at p+t through p+m-1. Notice there's a gap at exactly p+t-1 — the marker that used to be there shifted away, and nothing refills it, since the marker behind it in the run stayed put.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 320,
      content: [{ type: "text", value: "So what's the population total as a function of t?" }],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 345,
      content: [
        {
          type: "text",
          value:
            "Rather than resum the whole thing for every t, I can go incrementally — going from t-1 shifted to t shifted, exactly one marker's contribution changes: the one at the boundary trades its old cell for the new one.",
        },
        {
          type: "code",
          id: "code-run-delta",
          language: "python",
          value: "delta = population[p + t - 2] - population[p + t - 1]  # for t in 1..m",
        },
        {
          type: "text",
          value: "sum(t) = sum(t-1) + delta. sum(0) is just the run's population total with nobody moved.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 365,
      content: [{ type: "text", value: "Any restriction on how far t can go?" }],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 382,
      content: [
        {
          type: "text",
          value:
            "t of 0 is always legal. Anything higher requires the very first marker in the run to shift, which needs p to be at least 1 — if the run starts at index 0, t is stuck at 0, no matter how good the numbers look further along.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 398,
      content: [
        { type: "text", value: "One thing I want you to justify, not assume — do runs ever interfere with each other?" },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 420,
      content: [
        {
          type: "text",
          value:
            "No, and here's why: a run is a maximal block of consecutive markers, so the cell just to its left, p-1, is guaranteed to not be part of any other run — if it were a marker too, the run would've started there instead. So the only cell a run can ever reach outside itself is already guaranteed empty of other markers. Runs can be scored completely independently and just summed.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 445,
      content: [{ type: "text", value: "Good. Show me the run-scoring function." }],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 475,
      content: [
        {
          type: "code",
          id: "code-score-run",
          language: "python",
          value:
            "def best_run_score(p, m, population):\n    running = sum(population[p:p + m])\n    best = running\n    max_t = m if p >= 1 else 0\n    for t in range(1, max_t + 1):\n        running += population[p + t - 2] - population[p + t - 1]\n        best = max(best, running)\n    return best",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 492,
      content: [{ type: "text", value: "Now the outer loop that finds the runs in the first place." }],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 528,
      content: [
        {
          type: "text",
          value: "Single left-to-right pass, scoring each run as soon as it ends:",
        },
        {
          type: "code",
          id: "code-outer-scan",
          language: "python",
          value:
            "total, i, n = 0, 0, len(population)\nwhile i < n:\n    if protection[i] != '0':\n        i += 1\n        continue\n    p = i\n    while i < n and protection[i] == '0':\n        i += 1\n    total += best_run_score(p, i - p, population)\nreturn total",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 545,
      content: [{ type: "text", value: "Complexity?" }],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 562,
      content: [
        {
          type: "text",
          value:
            "Every index is visited a constant number of times across the outer scan and its run's scoring loop, so it's O(n) time overall, O(1) extra space beyond the input.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 580,
      content: [
        {
          type: "text",
          value:
            "Follow-up, and this one isn't in the original prompt. Same setup, but now there's a single shared budget K — the total number of shifts allowed across the entire array, not one per marker. Maximize protected population using at most K shifts total.",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 605,
      content: [
        {
          type: "text",
          value:
            "So now it's not 'give every run its own best t' — it's deciding how to split a limited number of shifts across runs. My gut says: for each run, look at the very next shift's marginal gain, and always spend the next unit of budget on whichever run currently offers the best next delta. Like a priority queue of next-available deltas.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 622,
      content: [{ type: "text", value: "Does that actually get you the optimum, though?" }],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 638,
      content: [
        { type: "text", value: "Let me try to break it before I trust it." },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 645,
      content: [{ type: "text", value: "Please." }],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 700,
      content: [
        {
          type: "text",
          value:
            "Run X: p=5, m=2. population[4]=5, population[5]=6, population[6]=1. Run Y, elsewhere: a single marker where shifting it gains a clean +2.",
        },
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-greedy-budget-dip",
          type: "highlight",
          status: "missed",
          value:
            "run X's first shift has a negative delta of -1, so a greedy that only takes moves with positive next-step gain refuses it, and never reaches the second shift where the delta flips to +5",
          explanation:
            "Marginal-gain greedy across a shared budget silently assumes each run's gain sequence is concave — that returns diminish as you commit more shifts to it — which isn't guaranteed here. A run can have a dip on its first shift that only pays off once a second shift is also committed, and a step-at-a-time greedy that refuses negative-looking first moves can never see the payoff on the other side of the dip.",
        },
        {
          type: "text",
          value:
            ". Run X's t=0 total is 6+1=7. t=1 is 5+1=6 — worse, that's the dip. t=2 is 5+6=11 — jumping way past t=0. Fully committing to run X nets +4 over doing nothing there. But a greedy watching only next-step deltas sees -1 first, declines it, spends its budget on run Y's guaranteed +2 instead, and with K=2 total, never revisits run X because its only visible next move still looks like -1. Final result: +2, using just one of two shifts. Actual optimum, spending both shifts on run X and ignoring Y entirely: +4.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 730,
      content: [
        { type: "text", value: "So per-step marginal greedy is out. What actually handles that dip correctly?" },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 750,
      content: [
        {
          type: "text",
          value:
            "I already have, per run, the full curve of every possible t and its score, from the first part of this problem — best_run_score basically builds that curve, I just need to stop collapsing it down to a single best number.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 765,
      content: [{ type: "text", value: "So what's the shape of the actual decision now?" }],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 790,
      content: [
        {
          type: "text",
          value:
            "It's a knapsack, where each run is a group and each group offers m+1 mutually exclusive options — spend 0 shifts, 1, up to m — each with its own value, and only one option per run can be chosen. I need to pick one option per run so the shift counts add up to at most K, maximizing total value.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 805,
      content: [{ type: "text", value: "Show me the DP transition, not the whole thing." }],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 840,
      content: [
        {
          type: "text",
          value: "dp[k] tracks the best total using at most k shifts, folding in one run at a time:",
        },
        {
          type: "code",
          id: "code-knapsack-transition",
          language: "python",
          value:
            "new_dp = dp[:]  # start from 'skip this run entirely' baseline\nfor t in range(1, max_t + 1):\n    gain = run_scores[t] - run_scores[0]\n    for k in range(t, K + 1):\n        new_dp[k] = max(new_dp[k], dp[k - t] + gain)\ndp = new_dp",
        },
      ],
    },

    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 858,
      content: [{ type: "text", value: "Why copy dp into new_dp first instead of updating dp in place?" }],
    },

    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 872,
      content: [
        {
          type: "text",
          value:
            "Because a run only gets to contribute once — if I update dp in place while trying different t values for the same run, a later t could build on an earlier t from the same run, which would double-shift markers that don't exist. Each run needs to start every one of its own t options from the state before this run was considered at all.",
        },
      ],
    },

    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 890,
      content: [{ type: "text", value: "Complexity of the whole thing now?" }],
    },

    {
      id: "44",
      role: "candidate",
      elapsedSeconds: 915,
      content: [
        {
          type: "text",
          value:
            "For a run of length m, that inner loop costs O(m · K). Summed across all runs, the m's add up to at most n, so it's O(n · K) overall, with O(K) space for the dp array. It's the classic knapsack trade-off — exact, but only as fast as the budget lets it be, not truly linear anymore.",
        },
      ],
    },

    {
      id: "45",
      role: "interviewer",
      elapsedSeconds: 930,
      content: [
        { type: "text", value: "Is there any situation where the simple greedy from before would've actually been safe?" },
      ],
    },

    {
      id: "46",
      role: "candidate",
      elapsedSeconds: 955,
      content: [
        {
          type: "text",
          value:
            "If every run's score curve were concave — each additional shift within a run never more valuable than the one before it — then yes, picking the best available next delta across all runs, one unit at a time, would be provably optimal. It's exactly the dip, a run that gets worse before it gets better, that breaks it. And nothing in the problem promises population values won't create that shape.",
        },
      ],
    },

    {
      id: "47",
      role: "takeaway",
      elapsedSeconds: 980,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the core trap is treating each marker's shift as an independent local decision — a marker can only move into a cell its neighbor is also vacating, so runs of consecutive markers cascade from the front, collapsing an apparently exponential set of shift combinations into just m+1 shapes per run. Once every run's score is reduced to a small curve over t = 0..m, computed incrementally rather than resummed each time, the base problem is a single O(n) pass. The global-budget follow-up looks like it should reduce to 'always take the best next marginal shift,' but that assumes every run's curve is concave, and a run can legitimately dip before it pays off — a step-at-a-time greedy can walk right past a large gain because the first step toward it looks like a loss. The fix reuses the same per-run curves from the base solution, just treats them as knapsack groups instead of collapsing each to one number, turning an O(n) scan into an O(n·K) group knapsack — the same shape of trade-off, exact instead of greedy, that shows up whenever a per-unit gain sequence can't be trusted to only get worse.",
        },
      ],
    },
  ],
};

const maximumProtectedCityPopulation: TranscriptEntry = {
  summary: {    id: 26,

    slug: "maximum-protected-city-population",
    title: "Maximum Protected City Population — Cascading Shifts, Then a Global Shift Budget",
    category: "dsa",
    difficulty: Difficulty.HARD,
    duration: 46,
    company: ["Amazon"],
    tags: [
      "Dynamic Programming",
      "Greedy Counterexample",
      "Knapsack",
      "Arrays",
      "Prefix Sum",
      "Simulation",
    ],
    description:
      "Coding interview on maximizing protected population when each protected city's marker can shift at most one step left. Candidate first catches the inverted '0' means protected convention by restating it rather than assuming, then breaks a naive per-marker greedy with a concrete collision — a marker wanting to move into a cell its neighbor has no reason to vacate. This leads to the key insight that markers only ever move in front-cascading runs, reducing each run of length m to just m+1 valid outcomes computed incrementally in O(n) overall. The follow-up introduces a single shared shift budget across the whole array, breaking a marginal-gain greedy with a concrete 'dip before it pays off' counterexample, and resolves it by reusing the same per-run score curves as groups in an O(n·K) knapsack DP.",
  },

  transcript,
};

export default maximumProtectedCityPopulation;