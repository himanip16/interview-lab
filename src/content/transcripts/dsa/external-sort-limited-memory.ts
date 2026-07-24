// src/content/transcripts/dsa/external-sort-limited-memory.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Sort a 500MB File with a 2MB Heap",
    difficulty: Difficulty.HARD,
    company: "Amazon",
    duration: 44,
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
            "You have a 500MB file of integers, one per line, that needs to be sorted. You only have a 2MB heap to work with. How would you do it?",
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
            "Is there effectively unlimited scratch disk space I can use for temporary files, and I just need to produce a fully sorted output file at the end?",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 20,
      content: [
        { type: "text", value: "Yes to both." },
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
            "Okay — the file's obviously way bigger than what fits in memory, so reading the whole thing in and sorting it in place is out.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 45,
      content: [
        { type: "text", value: "Right, so what do you do?" },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 60,
      content: [
        {
          type: "text",
          value:
            "Classic external sort. Split the file into chunks small enough to fit in memory, sort each chunk in place, write each sorted chunk back to disk as its own 'run', then merge all the runs together at the end.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 72,
      content: [
        { type: "text", value: "How big is each chunk?" },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 85,
      content: [
        {
          type: "text",
          value:
            "As big as I can make it while still fitting the heap — roughly 2MB, since during this phase I'm only ever holding one chunk in memory at a time: read it, sort it, write it out, move to the next.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 98,
      content: [
        { type: "text", value: "So how many runs does that give you?" },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 110,
      content: [
        {
          type: "text",
          value: "500MB divided by 2MB — about 250 sorted runs sitting on disk.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 122,
      content: [
        { type: "text", value: "Now merge them." },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 138,
      content: [
        {
          type: "text",
          value:
            "K-way merge — open all 250 runs, keep a pointer into each, and repeatedly pick the smallest of the 250 current values, write it to the output, and advance that run's pointer. I'd use a min-heap over the current values so picking the smallest one each time is cheap.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 152,
      content: [
        { type: "text", value: "You're opening 250 file handles and pulling from all of them at once — with a 2MB heap. Walk me through what that actually costs in memory." },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 168,
      content: [
        {
          type: "text",
          value:
            "I wouldn't pull a whole run into memory, obviously — just a small buffer per run, so I'm not doing a disk read for every single value. Splitting 2MB across 250 runs gives about 8 kilobytes of buffer each, plus a bit more for the output buffer and the heap itself.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 182,
      content: [
        { type: "text", value: "And? Is 8 kilobytes fine, or does that create a new problem?" },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 198,
      content: [
        {
          type: "text",
          value:
            "Hmm — it's small, but not absurdly so. Let me actually think about whether the number of runs itself is the real problem here, separate from buffer size, because I do want enough buffer per run that each disk read pulls back a decent, mostly-sequential chunk rather than a tiny sliver.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 212,
      content: [
        { type: "text", value: "Say you want something like 64 kilobytes per run's buffer, for decent sequential throughput. What does that do to your plan?" },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 228,
      content: [
        {
          type: "text",
          value:
            "With 2MB total and 64 kilobytes per run, I can only actively merge around 32 runs at once — nowhere near all 250. A single merge pass across everything isn't actually possible if I want reasonably sized buffers.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 240,
      content: [
        { type: "text", value: "So were you wrong earlier, saying you'd just merge all 250 at once?" },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 255,
      content: [
        {
          type: "text",
          value:
            "Yeah, I was — I was only accounting for the heap data structure's bookkeeping, not the actual I/O buffers each run needs. I need multiple merge passes: first merge groups of about 32 runs at a time, turning 250 runs into roughly 8 bigger runs, then merge those 8 down into the final sorted file in a second pass.",
        },
        {
          id: "highlight-buffer-oversight",
          type: "highlight",
          status: "strong",
          value: "only accounting for the heap data structure's bookkeeping, not the actual I/O buffers",
          explanation:
            "Catches its own earlier mistake once pressed — the initial 'merge all 250 at once' plan only budgeted memory for the min-heap's bookkeeping, not the per-run I/O buffers that actually dominate the memory cost.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 272,
      content: [
        { type: "text", value: "Careful with your min-heap, by the way — don't let the data structure heap eat into your literal 2MB heap budget." },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 285,
      content: [
        {
          type: "text",
          value:
            "Fair — but that heap only ever holds one entry per active run, so at 32-way merges it's maybe a few hundred bytes, negligible next to the actual I/O buffers.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 298,
      content: [
        { type: "text", value: "What's the downside if you shrink each run's buffer even further, so you could merge all 250 in a single pass instead of two?" },
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
            "Smaller buffers mean more, smaller disk reads per run — more seeks and syscall overhead relative to the actual useful data moved. I'd be trading fewer merge passes for worse throughput per pass; on a spinning disk that's a real cost, though SSDs are more forgiving of it.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 330,
      content: [
        { type: "text", value: "So which do you pick — fewer passes with tiny buffers, or more passes with bigger buffers?" },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 348,
      content: [
        {
          type: "text",
          value:
            "I'd keep the bigger buffers and eat the second pass. Two passes over roughly 500MB each is only about a gigabyte of extra reading and writing total, which is cheap next to constant tiny reads spread across 250 open files at once.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 362,
      content: [
        { type: "text", value: "What's your total I/O cost across the whole thing, then?" },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 380,
      content: [
        {
          type: "text",
          value:
            "Run generation reads the file once and writes it once — one full read-write pass. Then two merge passes, each also reading and writing the current data once. So roughly three full read-write passes over the data in total.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 395,
      content: [
        { type: "text", value: "Now scale this up — the file's 500 gigabytes, and you've got a cluster of machines instead of one box with a tiny heap. Does your approach still work as-is?" },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 415,
      content: [
        {
          type: "text",
          value:
            "Not as one process, no. I'd partition the data by key range across machines first, so each machine only deals with a slice, and each slice is small enough for that machine to run basically the same external sort we just built.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 428,
      content: [
        { type: "text", value: "How do you decide where those partition boundaries fall, if you don't know the value distribution ahead of time?" },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 448,
      content: [
        {
          type: "text",
          value:
            "Sample a subset of the records up front, estimate the quantiles from that sample, and set partition boundaries so each machine ends up with roughly the same amount of data.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 462,
      content: [
        { type: "text", value: "What if your sample's off and one partition ends up way bigger than the others anyway?" },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 480,
      content: [
        {
          type: "text",
          value:
            "Then that one machine becomes the bottleneck for the whole job, since everyone else finishes and waits on it. I'd want to detect a skewed partition and split it further — resample more finely within that range, or hand part of the range off to another machine after the fact.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 495,
      content: [
        { type: "text", value: "If your partitions are ranges and each machine sorts its own range locally, do you even need a final merge step across machines?" },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 512,
      content: [
        {
          type: "text",
          value:
            "No, actually — if partition 1 holds strictly smaller keys than partition 2, and so on, then once every machine has locally sorted its own range, I can just concatenate the partitions in range order and the whole file is sorted. No global merge needed, since there's no overlap in values between partitions.",
        },
        {
          id: "highlight-no-global-merge",
          type: "highlight",
          status: "strong",
          value: "concatenate the partitions in range order",
          explanation:
            "Recognizes that range-partitioning removes the need for a final k-way merge entirely, since disjoint sorted ranges are already globally ordered once placed side by side.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 528,
      content: [
        { type: "text", value: "Good. Last thing — back on a single machine, if you wanted multiple cores to speed up the original run-generation phase, how do you split the 2MB heap across threads?" },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 548,
      content: [
        {
          type: "text",
          value:
            "I'd carve the heap into fixed static shares up front, one per thread, rather than have them contend for a shared pool — say four threads each get 512 kilobytes, independently reading, sorting, and writing their own chunks.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 560,
      content: [
        { type: "text", value: "Does that need any locking between threads?" },
      ],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 575,
      content: [
        {
          type: "text",
          value:
            "Not for the sort-and-write itself, since each thread's chunk and buffer are private memory with no shared mutable state. The only shared thing is which byte offset of the source file each thread reads next — I'd hand out offsets from a shared counter using an atomic increment rather than a lock, so nobody blocks waiting on something that small.",
        },
      ],
    },

    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 590,
      content: [
        { type: "text", value: "Why atomic increment instead of just wrapping a lock around that counter?" },
      ],
    },

    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 608,
      content: [
        {
          type: "text",
          value:
            "Because grabbing the next offset is such a tiny, fast operation that a full lock's overhead — acquire, hold, release — would dominate the actual work. An atomic increment gets the same correctness without a thread ever blocking, and there's no way it can deadlock since it's one operation, not multiple locks being taken in some order.",
        },
      ],
    },

    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 622,
      content: [
        { type: "text", value: "Good, that's what I wanted to dig into. Let's stop there." },
      ],
    },

    {
      id: "44",
      role: "takeaway",
      elapsedSeconds: 642,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the core technique is external sort — generate sorted runs sized to fill the available heap, then merge them, but the candidate is pushed to catch a real oversight: a k-way merge budget has to account for per-run I/O buffers, not just the heap data structure's bookkeeping, and that budget is what actually caps how many runs can merge in a single pass. The rest rewards concrete trade-off reasoning over defaults: bigger buffers and an extra merge pass over tiny buffers and one pass, range-partitioning to avoid a final global merge entirely when scaling out to a cluster, detecting and correcting for sampling skew, and choosing an atomic increment over a lock for a shared counter based on the actual cost of the operation being protected.",
        },
      ],
    },
  ],
};

const amazonExternalSortLimitedMemory: TranscriptEntry = {
  summary: {
    slug: "amazon-external-sort-500mb-2mb-heap",
    title: "Sort a 500MB File with a 2MB Heap",
    category: "dsa",
    difficulty: Difficulty.HARD,
    duration: 44,
    company: "Amazon",
    tags: [
      "External Sort",
      "K-Way Merge",
      "Memory-Constrained",
      "I/O Optimization",
      "Distributed Systems",
      "Concurrency",
    ],
    description:
      "SDE2 DSA + systems interview on sorting a file far larger than available memory. Covers external sort's run-generation and k-way merge phases, catching a real memory-budgeting oversight around per-run I/O buffers, the buffer-size-versus-pass-count trade-off, then scales to a distributed cluster via range partitioning (no final global merge needed) and closes on lock-free multithreaded run generation.",
  },

  transcript,
};

export default amazonExternalSortLimitedMemory;