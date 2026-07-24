// src/content/transcripts/system-design/distributed-session-management.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Distributed Session Management System",
    difficulty: Difficulty.HARD,
    company: "Amazon",
    duration: 48,
    template: "High Level Design",
    category: "HLD",
  },

  messages: [
    {
      id: "1",
      role: "interviewer",
      elapsedSeconds: 0,
      content: [
        {
          type: "text",
          value: "How would you design a distributed session management system? Walk me through your approach.",
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
            "When you say distributed, do you mean multiple app servers behind one load balancer, or actually multiple data centers or regions?",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 25,
      content: [
        { type: "text", value: "Start with multiple servers in one region. We'll get to multi-region later." },
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
            "Okay. And a session here is: after a user logs in, we track some state tied to a session ID — user identity, maybe cart contents or preferences — and that ID gets handed back as a cookie?",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 50,
      content: [
        { type: "text", value: "Right. Go on." },
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
            "Simplest thing: store session data in memory on whichever server handled the login, and use sticky sessions at the load balancer so later requests always route back to that same server.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 78,
      content: [
        { type: "text", value: "What's the problem with that?" },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 92,
      content: [
        {
          type: "text",
          value:
            "If that specific server goes down, the session is just gone — the user gets logged out with no failover. It also load-balances unevenly, since sticky routing can pile heavy users onto the same server, and the load balancer itself has to remember a mapping, so it's not stateless anymore either.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 105,
      content: [
        { type: "text", value: "So what do you do instead?" },
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
            "Move session data out of any individual app server into a separate shared store that every server can read and write. Then any server can handle any request — I get real load balancing, and one app server dying doesn't lose anyone's session.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 132,
      content: [
        { type: "text", value: "What do you actually use for that store?" },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 148,
      content: [
        {
          type: "text",
          value: "Something like Redis or Memcached — an external key-value store, keyed by session ID.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 160,
      content: [
        { type: "text", value: "Pick one. Why?" },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 178,
      content: [
        {
          type: "text",
          value:
            "I'd lean Redis — it supports richer structures, like a hash per session instead of one flat blob, and it has built-in TTL I can use directly for expiry.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 190,
      content: [
        { type: "text", value: "What does Memcached give you that Redis doesn't, then? If Redis is strictly better here, why would anyone pick Memcached?" },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 210,
      content: [
        {
          type: "text",
          value:
            "Memcached's simpler, and it's historically had a reputation for being faster on plain get and set of small blobs, since it's just a thin in-memory cache with a narrow feature set... but if I need TTL and atomic field updates, I'd still say Redis wins for this specific use case.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 225,
      content: [
        { type: "text", value: "You said 'historically' — are you sure that throughput gap still holds today, or is that dated advice?" },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 240,
      content: [
        {
          type: "text",
          value:
            "...Fair, I'm not actually sure that gap still holds — Redis has closed a lot of it with pipelining and its event loop being fairly optimized despite being single-threaded. I'd want to benchmark rather than assume. But for this use case specifically, I don't think raw throughput is the deciding factor anyway — it's whether I need atomic operations and TTL semantics, and Redis wins on that regardless of the throughput question.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 258,
      content: [
        { type: "text", value: "What about Memcached being multithreaded versus Redis being mostly single-threaded — does that matter at your target scale?" },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 275,
      content: [
        {
          type: "text",
          value:
            "It could — Memcached can use multiple cores on one node directly, while Redis mostly leans on horizontal sharding across single-threaded instances to use multiple cores. I'd rather scale Redis out with sharding than lean on Memcached's per-node threading, though, since I still need the atomic per-session operations Memcached doesn't give me as cleanly.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 290,
      content: [
        { type: "text", value: "Okay — target is 1 million requests per second on session reads and writes combined. Does a single Redis instance handle that?" },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 305,
      content: [
        {
          type: "text",
          value:
            "No, that's well past what one instance and one core pushes through. I need to shard session data by session ID across many Redis nodes.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 315,
      content: [
        { type: "text", value: "How do you decide which node owns which session?" },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 330,
      content: [
        {
          type: "text",
          value:
            "Consistent hashing on the session ID, so adding or removing nodes later only reshuffles the portion of keys near the changed point on the hash ring, not almost everything.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 345,
      content: [
        { type: "text", value: "Are you sure consistent hashing alone is enough, or could you still end up with hot nodes?" },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 360,
      content: [
        {
          type: "text",
          value:
            "...If traffic isn't uniform per session — say one bot or one heavily-polled account generates a disproportionate share of requests against a single session key — consistent hashing doesn't help at all, since that one key is still pinned to one node no matter how well the ring is balanced. I'd need to handle that hot key separately, maybe with a short-TTL local cache at the app-server layer sitting in front of the sharded store.",
        },
        {
          id: "highlight-hot-key-catch",
          type: "highlight",
          status: "strong",
          value: "one key is still pinned to one node",
          explanation:
            "Recognizes, unprompted beyond the interviewer's nudge, that consistent hashing balances key distribution but does nothing for skewed traffic against a single key — a distinct problem from partition balance.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 378,
      content: [
        { type: "text", value: "Good catch. Let's talk concurrency. Two requests for the same session land on different servers at nearly the same time — one updates cart contents, one updates a last-active timestamp. What happens?" },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 395,
      content: [
        {
          type: "text",
          value:
            "If both do a full read, modify their one field, and write the whole session back, the second write can clobber the first one's change — they each read the same old state and don't see each other's update.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 408,
      content: [
        { type: "text", value: "So how do you avoid that?" },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 425,
      content: [
        {
          type: "text",
          value:
            "Use per-field operations where the store supports them — Redis hash field updates, so each server only writes the specific field it cares about instead of the whole blob, and there's no read-modify-write of the full session to collide on.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 438,
      content: [
        { type: "text", value: "What if two servers need to update several related fields together, atomically?" },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 455,
      content: [
        {
          type: "text",
          value:
            "I'd run a Lua script on the Redis node holding that key — Redis executes the whole script as one atomic step, so multiple field writes can't be interleaved with someone else's update.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 468,
      content: [
        { type: "text", value: "Any downside to leaning on Lua scripts for this?" },
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
            "It serializes work on that key — while the script runs, nothing else can touch that same session. Fine for an occasional multi-field update, bad if it somehow became the common path for every request.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 498,
      content: [
        { type: "text", value: "Now — deadlocks. Where could those actually show up, given what you've described so far?" },
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
            "Since everything I've described is a single atomic operation scoped to one session key at a time, there isn't really room for a classic lock-ordering deadlock to form — that mostly needs two threads holding multiple locks and grabbing them in opposite order. I've kept it to one key at a time throughout.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 528,
      content: [
        { type: "text", value: "So you're telling me deadlocks just can't happen here at all?" },
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
            "...Not entirely, no. If I ever needed to update two different sessions in one transaction — say merging a guest session into a newly logged-in user's session — and two of those merges ran concurrently grabbing the two session locks in opposite order, that could deadlock. I'd need to always acquire multi-session locks in a fixed order, like sorted by session ID, rather than assume single-key atomicity covers every case I'll ever need.",
        },
        {
          id: "highlight-deadlock-correction",
          type: "highlight",
          status: "strong",
          value: "always acquire multi-session locks in a fixed order",
          explanation:
            "Walks back an overconfident 'deadlocks can't happen' once pressed, correctly locating the actual deadlock risk in a multi-key operation the earlier design hadn't accounted for, and proposes the standard fixed-ordering fix.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 560,
      content: [
        { type: "text", value: "Good catch. Now — what happens when a Redis node just goes down?" },
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
            "Depends on replication — if each shard has a replica, I promote the replica on primary failure and keep going, though any writes that hadn't replicated yet are lost.",
        },
      ],
    },

    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 588,
      content: [
        { type: "text", value: "Is losing those recent writes acceptable for session data specifically?" },
      ],
    },

    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 602,
      content: [
        {
          type: "text",
          value:
            "For most fields, probably — losing the last few seconds of a last-active timestamp isn't a real problem. But something like in-progress checkout state is a worse loss if it happens right at failover, so I don't think checkout-critical data should live purely as best-effort session state at all — that belongs in a more durable store, written through separately from the disposable session fields.",
        },
        {
          id: "highlight-durability-distinction",
          type: "highlight",
          status: "strong",
          value: "belongs in a more durable store",
          explanation:
            "Draws a distinction between disposable session state and business-critical state that happens to ride alongside it, rather than treating the whole session blob as uniformly best-effort.",
        },
      ],
    },

    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 618,
      content: [
        { type: "text", value: "Last one — say we do go multi-region eventually. Does your design as described hold up, or does it break?" },
      ],
    },

    {
      id: "44",
      role: "candidate",
      elapsedSeconds: 635,
      content: [
        {
          type: "text",
          value:
            "It'd break as-is — a single sharded Redis cluster living in one region means every other region's app servers are making cross-region calls just to read a session, which kills latency. Each region would need its own local session store, and then either asynchronous replication between regions, or accepting that a user's session is pinned to whichever region they first authenticated in and routing them back there.",
        },
      ],
    },

    {
      id: "45",
      role: "interviewer",
      elapsedSeconds: 650,
      content: [
        { type: "text", value: "Which of those two, and why — not just 'it depends'." },
      ],
    },

    {
      id: "46",
      role: "candidate",
      elapsedSeconds: 668,
      content: [
        {
          type: "text",
          value:
            "I'd lean toward pinning the user to their home region over replicating everywhere. Replication adds real lag and complexity, and for session data specifically, consistently routing a user back to one region is simpler — the failure mode is just added latency if they're traveling, not incorrect session state from a stale cross-region replica.",
        },
      ],
    },

    {
      id: "47",
      role: "interviewer",
      elapsedSeconds: 680,
      content: [
        { type: "text", value: "Good, that's what I wanted to dig into. Let's stop there." },
      ],
    },

    {
      id: "48",
      role: "takeaway",
      elapsedSeconds: 700,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the design arc moves from in-memory sticky sessions to an externalized shared store, with the Redis-versus-Memcached choice grounded in atomicity and TTL needs rather than an unexamined throughput assumption the candidate is pushed to question directly. Scaling to 1M requests per second surfaces that consistent hashing solves partition balance but not per-key traffic skew, requiring a separate hot-key mitigation. On concurrency, the candidate moves from whole-blob writes to per-field updates to atomic Lua scripts, then — after an overconfident 'deadlocks can't happen here' — correctly locates the real risk in multi-session transactions and proposes fixed lock ordering. The design closes by distinguishing best-effort session fields from business-critical state that needs a durable store, and by justifying a multi-region strategy on the actual cost of being wrong rather than defaulting to full replication.",
        },
      ],
    },
  ],
};

const amazonDistributedSessionManagement: TranscriptEntry = {
  summary: {
    slug: "amazon-distributed-session-management",
    title: "Distributed Session Management System",
    category: "hld",
    difficulty: Difficulty.HARD,
    duration: 48,
    company: "Amazon",
    tags: [
      "Distributed Systems",
      "Redis",
      "Caching",
      "Concurrency",
      "Consistent Hashing",
      "Replication",
      "Trade-off Analysis",
    ],
    description:
      "SDE2 system design interview on building a distributed session management system for 1M requests/sec. Covers moving off sticky in-memory sessions to a sharded external store, a grounded Redis-versus-Memcached trade-off, hot-key mitigation on top of consistent hashing, concurrency from whole-blob writes to atomic Lua scripts, a deadlock self-correction around multi-session transactions, durability trade-offs on node failure, and a justified multi-region strategy.",
  },

  transcript,
};

export default amazonDistributedSessionManagement;