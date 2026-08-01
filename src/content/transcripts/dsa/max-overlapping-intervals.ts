// src/content/transcripts/dsa/maximum-overlapping-intervals-sweep-heap.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Maximum Overlapping Intervals — Sweep Line, Then a Heap Rewrite",
    difficulty: Difficulty.HARD,
    duration: 38,
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
            "You're given a list of closed intervals — [start_i, end_i], both endpoints included. Find the maximum number of intervals that overlap at any single point on the number line.",
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
            "Closed on both ends — so if one interval ends at 5 and another starts at 5, they do overlap at x = 5, right? That's not a gap.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 22,
      content: [
        { type: "text", value: "Correct. That's the detail most people get wrong here." },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 34,
      content: [
        {
          type: "text",
          value:
            "Noted. Coordinates go up to 10^9 in either direction — so I can't just allocate an array indexed by value and bump counts along it, that's billions of cells for a handful of intervals.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 48,
      content: [{ type: "text", value: "Right, that's off the table. So what's your approach?" }],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 65,
      content: [
        {
          type: "text",
          value:
            "Sweep line. I don't care about every point on the number line, only the points where the overlap count could change — and that's exactly the start and end of some interval. So turn every interval into two events: a +1 where it starts, a -1 where it ends. Sort the events by position, walk through them left to right keeping a running total, and the max value that total ever hits is the answer.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 84,
      content: [{ type: "text", value: "Sounds reasonable. Show me the events part." }],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 100,
      content: [
        {
          type: "code",
          id: "code-events-naive",
          language: "python",
          value:
            "events = []\nfor s, e in intervals:\n    events.append((s, 1))\n    events.append((e, -1))\nevents.sort()",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 114,
      content: [
        {
          type: "text",
          value: "Trace that against example one for me — [1,5], [5,10], [2,3], [4,6]. What does it return at x = 5?",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 145,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-tuple-sort-bug",
          type: "highlight",
          status: "missed",
          value:
            "sorting (5, -1) and (5, 1) as plain tuples puts (5, -1) first, since -1 is less than 1 — so the end of [1,5] gets processed before the start of [5,10]",
          explanation:
            "Python (and most languages) compare tuples element by element, so at equal first elements the comparison falls through to the second — and a plain -1/+1 encoding makes the end event sort before the start event purely by coincidence of which integer is smaller, silently breaking the closed-interval rule that a shared endpoint should count as overlapping.",
        },
        {
          type: "text",
          value:
            "...let me actually walk it instead of assuming. At x=5 I have an end event from [1,5] and a start event from [5,10]. As plain tuples, (5,-1) sorts before (5,1), so my running total drops before it climbs back up. I lose the moment where both are simultaneously active. Running it in my head, I think this gives me 2 at x=5, not 3.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 172,
      content: [{ type: "text", value: "So the sort order is the bug, not the sweep itself. Fix it." }],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 190,
      content: [
        {
          type: "text",
          value: "I need starts to sort before ends whenever they land on the same point. Two ways to get that — tag each event with an explicit type and sort on the tag, or shift every end event one past its actual value so it can never tie with a start in the first place.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 205,
      content: [{ type: "text", value: "Show me the tagging version first." }],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 222,
      content: [
        {
          type: "code",
          id: "code-events-tagged",
          language: "diff",
          value:
            "- events.append((s, 1))\n- events.append((e, -1))\n+ events.append((s, 0, 1))   # type 0 = start, sorts first\n+ events.append((e, 1, -1))  # type 1 = end, sorts second",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 240,
      content: [{ type: "text", value: "And the other way — shifting ends?" }],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 262,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-end-plus-one",
          type: "highlight",
          status: "strong",
          value:
            "record the end event at e + 1 instead of e, so a start at the same coordinate as an original end never shares a sort key with it",
          explanation:
            "A closed interval [s, e] is 'active' through and including e, which is equivalent to saying its contribution ends just after e. Recording the end event at e + 1 makes plain (x, delta) sorting correct on its own, with no secondary tie-break field needed, and no ambiguity even when two closed intervals genuinely touch at a single point.",
        },
        {
          type: "text",
          value:
            " — that way plain tuple sort just works, no extra field needed.",
        },
        {
          type: "code",
          id: "code-events-shifted",
          language: "diff",
          value:
            "- events.append((e, -1))\n+ events.append((e + 1, -1))",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 284,
      content: [
        { type: "text", value: "e can be up to 10^9. Any concern adding 1 to it?" },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 296,
      content: [
        {
          type: "text",
          value: "None — 10^9 + 1 is nowhere near overflow territory in Python, and it'd still fit comfortably in a 32-bit signed int in most other languages too.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 308,
      content: [{ type: "text", value: "Which of the two fixes do you actually want to ship?" }],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 328,
      content: [
        {
          type: "text",
          value:
            "The shift. It's one line, no secondary sort key to get wrong later, and it reads as 'this interval's coverage stops right after e' — which is literally what a closed interval means. I'll go with that.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 345,
      content: [{ type: "text", value: "Finish the sweep." }],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 372,
      content: [
        {
          type: "code",
          id: "code-sweep-final",
          language: "python",
          value:
            "running = 0\nbest = 0\nfor _, delta in events:\n    running += delta\n    best = max(best, running)\nreturn best",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 388,
      content: [{ type: "text", value: "Complexity?" }],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 402,
      content: [
        {
          type: "text",
          value:
            "O(n log n) for the sort, O(n) for the sweep, so O(n log n) overall. Space is O(n) for the events list.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 418,
      content: [
        {
          type: "text",
          value:
            "Now solve it a completely different way — sort by start only, and use a heap of active end times instead of a flat event stream.",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 440,
      content: [
        {
          type: "text",
          value:
            "So instead of tracking a running total, the heap size at any moment is the overlap count. Sort intervals by start. For each one, first evict everything from the heap that's already finished, then push this interval's end, then check the heap size.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 458,
      content: [{ type: "text", value: "Define 'already finished' precisely, then code the eviction." }],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 478,
      content: [
        {
          type: "code",
          id: "code-heap-evict-buggy",
          language: "python",
          value:
            "while heap and heap[0] <= start:\n    heapq.heappop(heap)",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 495,
      content: [
        {
          type: "text",
          value: "Run that against [1,5] and [5,10] again. What happens when you reach the second interval?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 522,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-heap-off-by-one",
          type: "highlight",
          status: "missed",
          value:
            "heap[0] equals 5, start equals 5, and <= evicts it right before pushing the new interval, so they never coexist in the heap at the same time",
          explanation:
            "Mirrors the exact same closed-interval bug as the tuple-sort version, just expressed against a heap instead of a sort key: evicting on <= treats a touching endpoint as 'already gone' instead of 'still active', so two intervals that legitimately overlap at a single shared point never appear in the heap together.",
        },
        {
          type: "text",
          value:
            " — same bug as before, just wearing a different outfit. Heap has 5 in it from [1,5]. I'm about to process [5,10], start is 5. <= evicts the 5 first, then I push [5,10]'s end, so the heap only ever has size 1 at that moment instead of 2. I need strict less-than — an end time equal to the new start hasn't actually vacated yet.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 548,
      content: [{ type: "text", value: "Fix it." }],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 560,
      content: [
        {
          type: "code",
          id: "code-heap-evict-fixed",
          language: "diff",
          value:
            "- while heap and heap[0] <= start:\n+ while heap and heap[0] < start:\n      heapq.heappop(heap)",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 575,
      content: [{ type: "text", value: "Put the loop together." }],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 605,
      content: [
        {
          type: "code",
          id: "code-heap-full",
          language: "python",
          value:
            "intervals.sort(key=lambda iv: iv[0])\nheap = []\nbest = 0\nfor s, e in intervals:\n    while heap and heap[0] < s:\n        heapq.heappop(heap)\n    heapq.heappush(heap, e)\n    best = max(best, len(heap))\nreturn best",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 622,
      content: [{ type: "text", value: "Complexity of this version, and is it actually better than the sweep?" }],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 648,
      content: [
        {
          type: "text",
          value:
            "Same O(n log n) — sorting is n log n, and every interval does at most one heap push and, amortized across the whole run, at most one heap pop, each O(log n). It's not asymptotically better, it's just a different shape of the same idea: the sweep tracks a running sum, this tracks the size of a live set directly.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 668,
      content: [
        { type: "text", value: "Then why would anyone reach for the heap version instead of the sweep?" },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 695,
      content: [
        {
          type: "text",
          value:
            "Mainly when you actually need to know which intervals are overlapping at the point of maximum density, not just the count — the heap is holding the live set itself. The sweep only needs a single sort of 2n numbers and throws away identity, so if all I want is the number, the sweep is simpler and touches less memory. If I need to report the intervals, the heap version already has them sitting there.",
        },
      ],
    },

    {
      id: "39",
      role: "takeaway",
      elapsedSeconds: 720,
      content: [
        {
          type: "text",
          value:
            "Takeaway: this problem reduces to tracking how a running overlap count changes at the finitely many points where it actually can change — interval starts and ends — rather than scanning the number line itself, which the 10^9 coordinate range rules out anyway. The one real trap is the closed-interval tie: a naive (x, delta) sort with -1 for ends and +1 for starts silently orders ends before starts at a shared coordinate, undercounting exactly the touching case the problem calls out. Shifting end events to e + 1 fixes it with no secondary sort key. The heap-based rewrite is the same idea in a different shape, with the identical tie-break bug reappearing as an off-by-one in the eviction condition — <= evicts a same-moment end too eagerly, and needs to be strict <. Neither approach beats the other asymptotically; the heap earns its keep only when the live set of overlapping intervals is itself part of the answer.",
        },
      ],
    },
  ],
};

const maximumOverlappingIntervals: TranscriptEntry = {
  summary: {    id: 25,

    slug: "maximum-overlapping-intervals-sweep-heap",
    title: "Maximum Overlapping Intervals — Sweep Line, Then a Heap Rewrite",
    category: "dsa",
    difficulty: Difficulty.HARD,
    duration: 38,
    company: "Generic",
    tags: [
      "Sweep Line",
      "Sorting",
      "Heap",
      "Priority Queue",
      "Intervals",
      "Greedy",
    ],
    description:
      "Coding interview on finding the maximum number of closed intervals overlapping at any point. Candidate builds a sweep-line solution and hits the classic closed-interval tie-break bug — a naive (x, delta) tuple sort silently orders end events before start events at a shared coordinate — then fixes it by shifting end events to e + 1. The interviewer then asks for a heap-based rewrite sorted by start, where the exact same bug reappears as an off-by-one in the eviction condition (<= versus strict <), reinforcing that it's the same underlying invariant expressed two different ways, not two unrelated mistakes.",
  },

  transcript,
};

export default maximumOverlappingIntervals;