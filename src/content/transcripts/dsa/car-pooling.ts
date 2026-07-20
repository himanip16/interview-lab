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
      elapsedSeconds: 18,
      content: [
        {
          type: "text",
          value:
            "So passengers board at the 'from' location, and we drop them off at the 'to' location. I need to check if at any point between any two stops, the occupancy goes over C?",
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
          value: "Exactly. What if two trips have the same 'from' or 'to' location?",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 50,
      content: [
        {
          type: "text",
          value:
            "I assume boarding happens before drop-off at the same location, right? So if one trip ends at 5 and another starts at 5, we drop off first, then pick up the new passengers?",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 65,
      content: [
        {
          type: "text",
          value:
            "Good instinct — for this version, treat them as simultaneous events. If one trip ends and another begins at the same location, handle the drop-off before the pickup to minimize peak occupancy.",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 80,
      content: [
        {
          type: "text",
          value: "What are the constraints on the number of trips, the capacity, and the location range?",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 98,
      content: [
        {
          type: "text",
          value:
            "Assume up to 1000 trips, capacity up to 100, and locations are integers from 1 to 1000.",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 115,
      content: [
        {
          type: "text",
          value:
            "Okay. The straightforward approach would be to simulate the journey — sort all unique locations, then for each location between the start and end of all trips, count how many passengers are in the car and check against C.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 140,
      content: [
        {
          type: "text",
          value: "Walk me through that.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 158,
      content: [
        {
          type: "text",
          value:
            "I'd use a TreeMap or sorted map keyed by location. For each trip, I insert numPassengers at the 'from' location and insert negative numPassengers at the 'to' location — positive for boarding, negative for drop-off. Then I iterate through the map in order, maintaining a running occupancy count. At each location, I apply all the events at that location and check if occupancy exceeds C.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 185,
      content: [
        {
          type: "text",
          value: "What's the cost of that?",
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
            "Building the TreeMap is O(N log N) because I'm inserting up to 2N events into a sorted structure, and then iterating through them is O(N). So overall ",
        },
        {
          id: "highlight-treemap-cost",
          type: "highlight",
          status: "strong",
          value: "O(N log N)",
          explanation:
            "Correctly identifies that the TreeMap approach is O(N log N) because insertions and lookups in a sorted map are logarithmic in the number of unique locations.",
        },
        {
          type: "text",
          value: ".",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 225,
      content: [
        {
          type: "text",
          value:
            "That works, but can you do better? Locations are constrained to a fixed range.",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 250,
      content: [
        {
          type: "text",
          value:
            "Oh — if the location range is 1 to 1000, I could use a fixed-size array instead of a TreeMap. Create an array of size 1001, mark the deltas at each location, then sweep through the array once accumulating the running occupancy.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 270,
      content: [
        {
          type: "text",
          value: "Exactly — a difference array. Set it up.",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 290,
      content: [
        {
          type: "text",
          value:
            "I create an array 'delta' of size 1001, initialized to 0. For each trip, I do delta[from] += numPassengers and delta[to] -= numPassengers. This captures the net change in occupancy at each location. Then I iterate from location 1 to 1000, maintaining a running sum of occupancy, and if it ever exceeds C, I return false. If I make it through without exceeding, I return true.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 320,
      content: [
        {
          type: "text",
          value: "Walk me through an example. Capacity 4, trips are [2, 1, 5], [3, 3, 7].",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 345,
      content: [
        {
          type: "text",
          value:
            "First trip: delta[1] += 2, delta[5] -= 2. Second trip: delta[3] += 3, delta[7] -= 3. So the delta array has values at positions 1, 3, 5, 7.",
        },
      ],
    },

    {
      id: "19",
      role: "candidate",
      elapsedSeconds: 368,
      content: [
        {
          type: "text",
          value:
            "Sweep through: at 1, occupancy becomes 0 + 2 = 2. At 2, 3, 4, no change. At 3, occupancy becomes 2 + 3 = 5. That's already over 4, so return false.",
        },
      ],
    },

    {
      id: "20",
      role: "interviewer",
      elapsedSeconds: 385,
      content: [
        {
          type: "text",
          value: "Good. What's the time complexity now?",
        },
      ],
    },

    {
      id: "21",
      role: "candidate",
      elapsedSeconds: 405,
      content: [
        {
          type: "text",
          value:
            "Building the delta array is O(N) — one pass through the trips. The sweep is O(L) where L is the location range, 1000 in this case. So it's O(N + L), which is better than O(N log N) when N is large, and since both N and L are bounded by constants here, it's effectively O(1) for the problem constraints.",
        },
        {
          id: "highlight-linear-complexity",
          type: "highlight",
          status: "strong",
          value: "O(N + L)",
          explanation:
            "Recognizes that the difference array approach is linear in both trips and location range, strictly better than the TreeMap's O(N log N) when dealing with bounded, fixed ranges.",
        },
      ],
    },

    {
      id: "22",
      role: "interviewer",
      elapsedSeconds: 435,
      content: [
        {
          type: "text",
          value: "Write the code.",
        },
      ],
    },

    {
      id: "23",
      role: "candidate",
      elapsedSeconds: 460,
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
      id: "24",
      role: "interviewer",
      elapsedSeconds: 490,
      content: [
        {
          type: "text",
          value:
            "Now for the harder part. Suppose this system scales up — instead of a single in-memory array of trips, the trip data is distributed across a database that's being updated in real-time. Drivers query this system throughout the day. How would you rethink this?",
        },
      ],
    },

    {
      id: "25",
      role: "candidate",
      elapsedSeconds: 525,
      content: [
        {
          type: "text",
          value:
            "If the trips data is in a DB and gets updated during the day, fetching all trips every time a driver queries is expensive. Also, if there are thousands or millions of trips, building the full delta array becomes memory-intensive.",
        },
      ],
    },

    {
      id: "26",
      role: "interviewer",
      elapsedSeconds: 550,
      content: [
        {
          type: "text",
          value: "Right. So what changes?",
        },
      ],
    },

    {
      id: "27",
      role: "candidate",
      elapsedSeconds: 572,
      content: [
        {
          type: "text",
          value:
            "I'd keep the delta-array logic, but instead of querying all trips at once, I'd structure the DB to index trips by their 'start' and 'end' locations. When a driver queries for capacity feasibility, I query the DB for trips that overlap with the route they're planning. If the route is a specific segment, say locations 1 to 50, I fetch only trips that have start or end within or overlapping that range, rather than the entire trip table.",
        },
      ],
    },

    {
      id: "28",
      role: "interviewer",
      elapsedSeconds: 605,
      content: [
        {
          type: "text",
          value:
            "Good direction. But what if the DB is sharded, or trips are spread across multiple partitions? How do you handle that?",
        },
      ],
    },

    {
      id: "29",
      role: "candidate",
      elapsedSeconds: 635,
      content: [
        {
          type: "text",
          value:
            "If trips are sharded by location range or by trip ID, I'd still need to query across all shards to get the full picture for a capacity check. That could be expensive if shards are remote. I'd probably use a ",
        },
        {
          id: "highlight-distributed-strategy",
          type: "highlight",
          status: "strong",
          value: "fan-out to all shards in parallel",
          explanation:
            "Correctly identifies that querying distributed data requires parallel requests to multiple shards, and mentions the need for aggregation across results — the standard approach for distributed query execution.",
        },
        {
          type: "text",
          value:
            " — the query service hits all the relevant shards in parallel, collects the trip subsets from each, merges them locally in-memory, then applies the same delta-array logic. Depending on the shard size and query frequency, I might also cache the merged delta arrays for recent time windows to avoid repeated fan-outs.",
        },
      ],
    },

    {
      id: "30",
      role: "interviewer",
      elapsedSeconds: 675,
      content: [
        {
          type: "text",
          value:
            "What if a new trip is inserted into the database right in the middle of your query execution? Does your result become stale?",
        },
      ],
    },

    {
      id: "31",
      role: "candidate",
      elapsedSeconds: 705,
      content: [
        {
          type: "text",
          value:
            "Yes, if a trip is inserted after I've started the fan-out but before I've read all shards, I might miss it. That's a consistency issue. I'd need to either:",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 730,
      content: [
        {
          type: "text",
          value:
            "One, use a snapshot isolation level — start the query against a consistent view of the DB at a specific timestamp, so all shards return data from that point in time, ignoring writes after that snapshot was taken. Or two, if near-real-time is acceptable, accept the lag — query for 'all trips as of 10 seconds ago' and live with the fact that very recent insertions might not be included yet.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 765,
      content: [
        {
          type: "text",
          value:
            "Which trade-off would you pick, and why?",
        },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 792,
      content: [
        {
          type: "text",
          value:
            "For a ride-sharing system, you want to be conservative — you don't want to overbook a car because you missed a recent trip. I'd go with snapshot isolation. It costs a bit more in terms of DB overhead — maintaining snapshots — but the guarantee that the result is correct as of a known point in time is worth it. If the snapshot is recent enough, say sub-second latency, the staleness is barely noticeable to the driver.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 825,
      content: [
        {
          type: "text",
          value: "What about cache invalidation? Trips change constantly.",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 850,
      content: [
        {
          type: "text",
          value:
            "Yeah, caching delta arrays per route or time window becomes tricky. If a trip is inserted or cancelled, I need to invalidate any cached result that includes that trip. I could use event-driven invalidation — when a trip is inserted into the DB, publish an event, and cache listeners drop their cached arrays for affected routes. Or I could just use short TTLs on the cache, like 5 or 10 seconds, and live with a small amount of recalculation. For this problem, the queries are probably simple and fast enough that the recalculation cost is lower than managing a complex cache coherence system.",
        },
        {
          id: "highlight-cache-tradeoff",
          type: "highlight",
          status: "strong",
          value: "",
          explanation:
            "Shows judgment about when caching is worth the complexity — recognizes that event-driven invalidation is the 'correct' answer but also identifies that a simpler short-TTL approach might be the practical choice depending on query volume and latency requirements.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 895,
      content: [
        {
          type: "text",
          value: "Good trade-off thinking. That's what I wanted to explore.",
        },
      ],
    },

    {
      id: "38",
      role: "takeaway",
      elapsedSeconds: 925,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the core optimization is recognizing that with a bounded location range, you can trade the TreeMap's O(N log N) sorting cost for a linear sweep with a difference array — O(N + L) and much simpler code. The distributed version adds layers: querying across shards in parallel, handling consistency via snapshot isolation, and making pragmatic trade-offs on caching. The fundamental algorithm stays the same, but the system design conversation reveals how a seemingly simple DSA problem escalates when data moves from memory to a distributed database.",
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