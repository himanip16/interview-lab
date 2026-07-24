// src/content/transcripts/dsa/token-bucket-rate-limiter.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Rate Limiter with Token Bucket",
    difficulty: Difficulty.MEDIUM,
    company: "Amazon",
    duration: 43,
    template: "Low Level Design",
    category: "LLD",
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
            "Implement a rate limiter using the token bucket algorithm. Given a client making requests, you need a way to decide, per request, whether it should be allowed or rejected.",
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
            "So a bucket has some max capacity, tokens refill over time at a fixed rate, each request consumes one token, and if there are no tokens left, the request gets rejected?",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 22,
      content: [
        { type: "text", value: "Right. Does it refill continuously, or in fixed chunks at intervals?" },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 40,
      content: [
        {
          type: "text",
          value:
            "I'd do it continuously — track how much time has passed since the last check, multiply by the refill rate, add that many tokens, and cap the total at capacity.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 55,
      content: [
        { type: "text", value: "Why continuous instead of just a counter that resets every second?" },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 72,
      content: [
        {
          type: "text",
          value:
            "A fixed reset has a boundary problem — right around the reset instant, a client can burst right before the reset and right after it, and effectively get double the allowed rate in a tiny window.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 85,
      content: [
        { type: "text", value: "Give me an actual example of that boundary problem." },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 102,
      content: [
        {
          type: "text",
          value:
            "Say the limit is 100 requests per second and the window resets exactly at t=1.0s. A client sends 100 requests at t=0.99s, all allowed, then the window resets and they immediately send 100 more at t=1.01s — also allowed. That's 200 requests inside 20 milliseconds.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 118,
      content: [
        { type: "text", value: "So how does token bucket actually avoid that?" },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 135,
      content: [
        {
          type: "text",
          value:
            "Because tokens accumulate gradually and are capped at capacity — there's no instant where the bucket jumps back up to full regardless of how recently it was drained. The worst burst you can get is bounded by whatever's actually accumulated, not by a hard reset.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 150,
      content: [
        { type: "text", value: "What state do you actually need to keep, per client?" },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 165,
      content: [
        {
          type: "text",
          value: "Current token count as a float, and the timestamp of the last time it was updated.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 178,
      content: [
        { type: "text", value: "Cost per request?" },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 192,
      content: [
        {
          type: "text",
          value:
            "O(1) — compute elapsed time since last timestamp, add the refill, cap it, then check if there's at least one token and deduct if so.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 205,
      content: [
        { type: "text", value: "Write it." },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 232,
      content: [
        {
          type: "code",
          language: "python",
          value:
            "import time\n\nclass TokenBucket:\n    def __init__(self, capacity, refill_rate):\n        self.capacity = capacity\n        self.refill_rate = refill_rate  # tokens per second\n        self.tokens = capacity\n        self.last_refill = time.monotonic()\n\n    def allow_request(self):\n        now = time.monotonic()\n        elapsed = now - self.last_refill\n        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)\n        self.last_refill = now\n\n        if self.tokens >= 1:\n            self.tokens -= 1\n            return True\n        return False",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 250,
      content: [
        { type: "text", value: "What happens if two requests for the same client arrive at essentially the same instant?" },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 265,
      content: [
        {
          type: "text",
          value: "Should be fine — it's just reading a number and subtracting from it.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 275,
      content: [
        { type: "text", value: "Are you sure that's fine?" },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 292,
      content: [
        {
          type: "text",
          value:
            "...Actually no. If two threads both read tokens as, say, 1 before either writes back, they'd both think a token's available and both deduct, letting two requests through on a single token. It's a classic read-modify-write race between the check and the decrement.",
        },
        {
          id: "highlight-race-condition",
          type: "highlight",
          status: "strong",
          value: "read-modify-write race",
          explanation:
            "Self-corrects from an incorrect 'should be fine' into correctly identifying the check-then-deduct sequence as a race condition once pushed, rather than being told directly.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 305,
      content: [
        { type: "text", value: "Fix it, then. What if you have millions of clients — one lock per client, does that scale?" },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 325,
      content: [
        {
          type: "text",
          value:
            "A lock object per client is a lot of overhead if most clients are idle most of the time — millions of mostly-unused mutexes sitting in memory. I could shard locks across a smaller fixed pool keyed by hashing the client ID, or use a compare-and-swap loop instead of a full lock so idle clients cost nothing beyond the bucket state itself.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 345,
      content: [
        { type: "text", value: "Now say this rate limiter runs behind a load balancer, across multiple application servers, not one process. Does your local in-memory bucket still work?" },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 365,
      content: [
        {
          type: "text",
          value:
            "No — each server would keep its own separate bucket for the same client, so a client bouncing between servers could get the full limit from each server independently, blowing past the intended total.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 378,
      content: [
        { type: "text", value: "So what do you use for the shared state?" },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 395,
      content: [
        {
          type: "text",
          value:
            "Something like Redis, with the whole check-refill-and-deduct sequence written as a single atomic Lua script, so there's no window where two servers can both read stale token counts.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 408,
      content: [
        { type: "text", value: "Doesn't that add latency to every single request now?" },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 425,
      content: [
        {
          type: "text",
          value:
            "Yes — every request now pays a network round trip to Redis. One option is to give each server a small local allowance it can spend without checking in, and periodically sync with the shared store instead of hitting it on every request.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 440,
      content: [
        { type: "text", value: "Walk me through the risk in that approximate approach." },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 458,
      content: [
        {
          type: "text",
          value:
            "Between syncs, each server is spending its local allowance independently of the others, so the combined total across all servers could briefly overshoot the global limit before the next sync catches up. You're trading strict correctness for lower latency.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 472,
      content: [
        { type: "text", value: "If the requirement is 'never exceed the limit, full stop' — does the local-allowance approach still work?" },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 488,
      content: [
        {
          type: "text",
          value:
            "No, not if overshoot is genuinely unacceptable. Then you're stuck paying the round trip to a centralized atomic store on every request, because correctness has to win over latency in that case — there's no version of local caching that guarantees zero overshoot.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 502,
      content: [
        { type: "text", value: "One more — if each server computes elapsed time using its own local clock, what happens if those clocks aren't perfectly in sync?" },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 520,
      content: [
        {
          type: "text",
          value:
            "If a client's requests are routed to different servers with skewed clocks, the elapsed-time calculation could be off — one server might think more or less time has passed than actually did, so the refill amount would be wrong. Since we've already centralized the bucket state in Redis, I'd have Redis compute elapsed time using its own server clock in the Lua script, rather than trusting whichever application server happens to handle the request.",
        },
        {
          id: "highlight-authoritative-clock",
          type: "highlight",
          status: "strong",
          value: "Redis compute elapsed time using its own server clock",
          explanation:
            "Connects the clock-skew follow-up back to the earlier decision to centralize state, recognizing that centralizing state also means centralizing the authoritative clock, not just the token count.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 535,
      content: [
        { type: "text", value: "Good, that covers what I wanted. Let's stop there." },
      ],
    },

    {
      id: "36",
      role: "takeaway",
      elapsedSeconds: 555,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the core algorithm is straightforward once the boundary-burst problem with fixed windows is articulated clearly. The follow-ups reward catching a check-then-deduct race condition after an initial too-quick 'should be fine', recognizing that a single in-memory bucket silently breaks the moment there's more than one server, and reasoning explicitly about the latency-versus-correctness trade-off of local caching versus a centralized atomic store — including that centralizing token state also means centralizing the clock the calculations trust.",
        },
      ],
    },
  ],
};

const amazonTokenBucketRateLimiter: TranscriptEntry = {
  summary: {
    slug: "amazon-token-bucket-rate-limiter",
    title: "Rate Limiter with Token Bucket",
    category: "dsa",
    difficulty: Difficulty.MEDIUM,
    duration: 43,
    company: "Amazon",
    tags: [
      "Token Bucket",
      "Rate Limiting",
      "Concurrency",
      "Distributed Systems",
      "Caching",
    ],
    description:
      "SDE2 DSA + systems design interview implementing a token bucket rate limiter. Covers continuous refill versus fixed-window bursts, a check-then-deduct race condition caught under pressure, scaling to millions of clients, moving state to a centralized store across multiple servers, and the latency-versus-correctness trade-off of local caching plus clock-authority across servers.",
  },

  transcript,
};

export default amazonTokenBucketRateLimiter;