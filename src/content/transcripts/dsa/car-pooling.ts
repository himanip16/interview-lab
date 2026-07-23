// src/content/transcripts/dsa/car-pooling.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Car Pooling Capacity Validation",
    difficulty: Difficulty.MEDIUM,
    company: "Stripe",
    duration: 42,
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
            "You have a car with fixed capacity C. You're given a list of trips, where each trip is [numPassengers, from, to]. Passengers board at 'from' and leave at 'to'. You need to determine if you can fulfill all trips without the car exceeding capacity at any point.",
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
            "Okay. So at any location, occupancy is passengers currently in the car, and I fail as soon as that goes above C at any point along the route.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 28,
      content: [
        {
          type: "text",
          value: "Right. What about ties — two trips sharing the same 'from' or 'to'?",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 45,
      content: [
        {
          type: "text",
          value:
            "Hm. I think it matters which order you process board vs drop at the same stop — if I do the pickup first I might report a false failure that wouldn't really happen. So... drop-offs before pickups at a shared location?",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 58,
      content: [
        {
          type: "text",
          value: "Why does the order matter — walk me through a case where it breaks.",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 78,
      content: [
        {
          type: "text",
          value:
            "Say capacity is 4. One trip drops 2 passengers at location 5, another trip picks up 3 at location 5. If I add the 3 before removing the 2, occupancy briefly reads higher than what's physically true. So for this problem let's just say: at a shared location, process the drop first, then the pickup.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 95,
      content: [
        {
          type: "text",
          value: "Fine, let's go with that. Constraints?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 105,
      content: [
        {
          type: "text",
          value: "How many trips are we talking, what's the range on capacity and locations?",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 115,
      content: [
        {
          type: "text",
          value: "Up to 1000 trips, capacity up to 100, locations are integers 1 to 1000.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 132,
      content: [
        {
          type: "text",
          value:
            "My first instinct is just simulate it directly — for each location from 1 to 1000, sum up who's currently on board. But that's basically checking every trip against every location, which feels like it could be O(N times L). Let me think if there's a cleaner way to sweep through this instead of re-scanning trips at every point.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 158,
      content: [
        {
          type: "text",
          value: "Go on.",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 175,
      content: [
        {
          type: "text",
          value:
            "Right — instead of re-checking every trip at every location, I only care about the points where occupancy actually changes: someone boards or someone leaves. So I can record events at those specific locations instead of scanning the whole range for each trip.",
        },
      ],
    },

    {
      id: "13",
      role: "candidate",
      elapsedSeconds: 195,
      content: [
        {
          type: "text",
          value:
            "I'd use a sorted map keyed by location. For each trip, add +numPassengers at 'from' and -numPassengers at 'to'. Then walk the map in order, keeping a running total, and check it against C at each key.",
        },
      ],
    },

    {
      id: "14",
      role: "interviewer",
      elapsedSeconds: 218,
      content: [
        {
          type: "text",
          value: "What's that cost you, in total?",
        },
      ],
    },

    {
      id: "15",
      role: "candidate",
      elapsedSeconds: 235,
      content: [
        {
          type: "text",
          value:
            "Up to 2N insertions into the sorted map, each log N, so building it is O(N log N). Walking it after is O(N). So overall it's dominated by the ",
        },
        {
          id: "highlight-treemap-cost",
          type: "highlight",
          status: "strong",
          value: "O(N log N)",
          explanation:
            "Correctly isolates the sorted-map insertions as the dominant cost, rather than treating the walk-through as equally expensive.",
        },
        {
          type: "text",
          value: " insertion step.",
        },
      ],
    },

    {
      id: "16",
      role: "interviewer",
      elapsedSeconds: 255,
      content: [
        {
          type: "text",
          value: "You said locations are bounded, 1 to 1000. Does that change anything for you?",
        },
      ],
    },

    {
      id: "17",
      role: "candidate",
      elapsedSeconds: 272,
      content: [
        {
          type: "text",
          value:
            "...Give me a second. I keep wanting to reach for the sorted map because that's the general-purpose tool, but you're right, I don't need a map at all if the key space is small and known ahead of time.",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 292,
      content: [
        {
          type: "text",
          value:
            "I can just use a plain array of size 1001 as a difference array — index directly by location instead of paying log N per lookup.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 305,
      content: [
        {
          type: "text",
          value: "Set it up.",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 322,
      content: [
        {
          type: "text",
          value:
            "delta array, size 1001, all zero. For each trip: delta[from] += numPassengers, delta[to] -= numPassengers. Then sweep index 1 through 1000, keep a running sum, and if it ever crosses C, fail.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 340,
      content: [
        {
          type: "text",
          value: "Trace it. Capacity 4, trips [2,1,5] and [3,3,7].",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 360,
      content: [
        {
          type: "text",
          value:
            "delta[1] += 2, delta[5] -= 2 for the first trip. delta[3] += 3, delta[7] -= 3 for the second.",
        },
      ],
    },

    {
      id: "23",
      role: "candidate",
      elapsedSeconds: 380,
      content: [
        {
          type: "text",
          value:
            "Sweeping — position 1, running total 2. Position 2, still 2, no event there. Position 3, add 3, total is... wait, let me redo that. 2 plus 3 is 5. Yeah, 5, that's already above capacity 4. So this fails at location 3.",
        },
      ],
    },

    {
      id: "24",
      role: "interviewer",
      elapsedSeconds: 398,
      content: [
        {
          type: "text",
          value: "Good, you caught yourself. What's the complexity now, and is it actually better?",
        },
      ],
    },

    {
      id: "25",
      role: "candidate",
      elapsedSeconds: 418,
      content: [
        {
          type: "text",
          value:
            "Building the delta array is O(N) — one pass over trips. Sweeping it is O(L), the location range. So O(N + L) total, no log factor. Given N and L are both bounded here, that's strictly better than the sorted-map version.",
        },
        {
          id: "highlight-linear-complexity",
          type: "highlight",
          status: "strong",
          value: "O(N + L)",
          explanation:
            "Identifies that the difference-array approach removes the log factor entirely, and correctly frames why that's a real improvement rather than just a constant-factor win.",
        },
      ],
    },

    {
      id: "26",
      role: "interviewer",
      elapsedSeconds: 438,
      content: [
        {
          type: "text",
          value: "What if L were 10^9 instead of 1000? Still like this approach?",
        },
      ],
    },

    {
      id: "27",
      role: "candidate",
      elapsedSeconds: 458,
      content: [
        {
          type: "text",
          value:
            "No — then the array itself becomes the bottleneck, both in memory and in sweep time, and I'd be back to the sorted-map approach, or I'd coordinate-compress the locations down to just the ones that actually appear in trips. So the array trick only wins because L happens to be small here, it's not a universally better algorithm.",
        },
      ],
    },

    {
      id: "28",
      role: "interviewer",
      elapsedSeconds: 478,
      content: [
        {
          type: "text",
          value: "Good — write the code for the version we have.",
        },
      ],
    },

    {
      id: "29",
      role: "candidate",
      elapsedSeconds: 505,
      content: [
        {
          type: "code",
          language: "python",
          value:
            "def carPooling(trips, capacity):\n    delta = [0] * 1001\n    \n    for passengers, start, end in trips:\n        delta[start] += passengers\n        delta[end] -= passengers\n    \n    occupancy = 0\n    for i in range(1001):\n        occupancy += delta[i]\n        if occupancy > capacity:\n            return False\n    \n    return True",
        },
      ],
    },

    {
      id: "30",
      role: "interviewer",
      elapsedSeconds: 530,
      content: [
        {
          type: "text",
          value:
            "Okay, now let's change the setup. Trips live in a database, updated in real time, and drivers are querying this system all day. Your array-in-memory trick — does it still hold up?",
        },
      ],
    },

    {
      id: "31",
      role: "candidate",
      elapsedSeconds: 555,
      content: [
        {
          type: "text",
          value:
            "Not really as-is. Rebuilding a full delta array on every query means re-reading every trip from the DB every time, which doesn't scale if there are millions of rows and drivers are querying constantly.",
        },
      ],
    },

    {
      id: "32",
      role: "interviewer",
      elapsedSeconds: 570,
      content: [
        {
          type: "text",
          value: "So what do you actually fetch?",
        },
      ],
    },

    {
      id: "33",
      role: "candidate",
      elapsedSeconds: 592,
      content: [
        {
          type: "text",
          value:
            "I'd index trips by start and end location, and only pull the ones overlapping the route a driver's actually asking about, instead of the full table. That should cut down what I'm scanning per query quite a bit.",
        },
      ],
    },

    {
      id: "34",
      role: "interviewer",
      elapsedSeconds: 610,
      content: [
        {
          type: "text",
          value: "Say the table's sharded across multiple nodes. Does your index-and-filter idea still work cleanly?",
        },
      ],
    },

    {
      id: "35",
      role: "candidate",
      elapsedSeconds: 635,
      content: [
        {
          type: "text",
          value:
            "Hmm, not cleanly — a single shard only has part of the picture. I think I'd need to fan out the query to every shard that could hold relevant trips, in parallel, then merge what comes back before running the delta-array check locally.",
        },
      ],
    },

    {
      id: "36",
      role: "interviewer",
      elapsedSeconds: 655,
      content: [
        {
          type: "text",
          value: "Are you sure you need every shard, every time?",
        },
      ],
    },

    {
      id: "37",
      role: "candidate",
      elapsedSeconds: 678,
      content: [
        {
          type: "text",
          value:
            "...No, actually — if trips are sharded by location range, and the driver's route only spans a couple of ranges, I only need to hit the shards that own those ranges. That's not a full fan-out, that's a targeted one, so it's much cheaper than what I first said.",
        },
        {
          id: "highlight-distributed-strategy",
          type: "highlight",
          status: "strong",
          value: "targeted fan-out",
          explanation:
            "Self-corrects an over-broad 'query every shard' answer into a routing-aware fan-out once pushed — recognizes that shard key design should determine which nodes actually need to be hit.",
        },
      ],
    },

    {
      id: "38",
      role: "interviewer",
      elapsedSeconds: 705,
      content: [
        {
          type: "text",
          value: "Better. Now — a new trip gets inserted mid-query. Does your answer become wrong?",
        },
      ],
    },

    {
      id: "39",
      role: "candidate",
      elapsedSeconds: 725,
      content: [
        {
          type: "text",
          value:
            "It could — if the insert lands after I've already read that shard, I'd miss it and possibly approve a route that's actually over capacity. Honestly for a lot of systems I'd just say that's fine, eventual consistency, but for this one, missing a trip means overbooking a car, which feels like an actual bad outcome, not just a stale read.",
        },
      ],
    },

    {
      id: "40",
      role: "interviewer",
      elapsedSeconds: 748,
      content: [
        {
          type: "text",
          value: "So what do you do about it?",
        },
      ],
    },

    {
      id: "41",
      role: "candidate",
      elapsedSeconds: 768,
      content: [
        {
          type: "text",
          value:
            "Two options I can think of. One, snapshot isolation — pin the query to a fixed point in time across all shards, so I get a consistent view even mid-write. Two, accept some lag — query 'as of a few seconds ago' and live with the risk.",
        },
      ],
    },

    {
      id: "42",
      role: "interviewer",
      elapsedSeconds: 788,
      content: [
        {
          type: "text",
          value: "Which one, and why — not just 'it depends'.",
        },
      ],
    },

    {
      id: "43",
      role: "candidate",
      elapsedSeconds: 812,
      content: [
        {
          type: "text",
          value:
            "Snapshot isolation. Given what I just said about overbooking being the bad outcome here, I'd rather pay the extra DB overhead for a consistent read than risk approving a trip that pushes a car over capacity. If snapshots are sub-second, the driver won't notice the cost anyway.",
        },
      ],
    },

    {
      id: "44",
      role: "interviewer",
      elapsedSeconds: 838,
      content: [
        {
          type: "text",
          value: "You mentioned caching the merged result earlier — how do you keep that from going stale?",
        },
      ],
    },

    {
      id: "45",
      role: "candidate",
      elapsedSeconds: 862,
      content: [
        {
          type: "text",
          value:
            "Right, that's a real problem — if I cache a merged delta array per route and a trip gets inserted or cancelled after, that cache entry is now wrong. Simplest fix is a short TTL, five or ten seconds, and just eat the recompute cost.",
        },
      ],
    },

    {
      id: "46",
      role: "interviewer",
      elapsedSeconds: 880,
      content: [
        {
          type: "text",
          value: "And if a short TTL isn't tight enough for this use case?",
        },
      ],
    },

    {
      id: "47",
      role: "candidate",
      elapsedSeconds: 902,
      content: [
        {
          type: "text",
          value:
            "Then I'd go event-driven — publish an event on trip insert or cancel, and have cache entries for the affected route invalidated immediately instead of waiting out a TTL. More moving parts, but it closes the staleness window properly. I'd only reach for that if the TTL approach was actually causing bad approvals in practice, not by default.",
        },
        {
          id: "highlight-cache-tradeoff",
          type: "highlight",
          status: "strong",
          value: "",
          explanation:
            "Doesn't default to the more sophisticated event-driven design — explicitly ties the choice to whether the simpler TTL approach is causing real problems first, showing pragmatic judgment about complexity cost.",
        },
      ],
    },

    {
      id: "48",
      role: "interviewer",
      elapsedSeconds: 920,
      content: [
        {
          type: "text",
          value: "Okay, that's what I wanted to dig into. Let's stop there.",
        },
      ],
    },

    {
      id: "49",
      role: "takeaway",
      elapsedSeconds: 940,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the core algorithmic move is trading a sorted-map's O(N log N) for a difference array's O(N + L) once the location range is known to be bounded — but that trade only holds because L is small; it isn't a universal upgrade. The distributed follow-up rewards noticing when an answer is over-broad (fan-out to every shard vs. a targeted fan-out based on shard key), reasoning about consistency from the actual cost of being wrong (overbooking) rather than reflexively picking eventual consistency, and choosing cache invalidation strategy based on whether the simpler option is actually failing, not by default reaching for the more complex one.",
        },
      ],
    },
  ],
};

const stripeCarPooling: TranscriptEntry = {
  summary: {
    slug: "stripe-car-pooling",
    title: "Car Pooling Capacity Validation",
    category: "dsa",
    difficulty: Difficulty.MEDIUM,
    duration: 42,
    company: "Stripe",
    tags: [
      "Difference Array",
      "TreeMap",
      "Arrays",
      "Optimization",
      "Distributed Systems",
      "Snapshot Isolation",
      "Cache Invalidation",
      "Event-Driven Invalidation",
    ],
    description:
      "SDE2 DSA + systems design interview on validating car pooling capacity. Covers the TreeMap O(N log N) approach, the O(N + L) difference array optimization leveraging bounded location ranges, then scales to distributed DB with sharding, snapshot isolation for consistency, and pragmatic caching trade-offs.",
  },

  transcript,
};

export default stripeCarPooling;