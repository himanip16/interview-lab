import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Design Amazon Lockers & Capacity Management",
    difficulty: Difficulty.HARD,
    duration: 50,
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
          value:
            "Let's design the system behind Amazon Lockers — the physical pickup points where drivers drop off packages and customers pick them up later.",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 16,
      content: [
        {
          type: "text",
          value:
            "Before designing anything, I want to understand what decisions this system is actually responsible for.",
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
          value: "Fair. Go ahead.",
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
            "Is the scope just reserving and tracking locker slots, or does it also include deciding which locker a driver should be routed to in the first place?",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 63,
      content: [
        {
          type: "text",
          value:
            "Both. The system should pick a locker for a package and manage the physical slot lifecycle end to end.",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 82,
      content: [
        {
          type: "text",
          value:
            "Okay. So functionally: assign a package to a locker, reserve a physical slot sized for that package, let the driver deposit it, notify the customer, and release the slot once picked up or expired.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 108,
      content: [
        {
          type: "text",
          value: "Right. What about non-functional concerns?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 130,
      content: [
        {
          type: "text",
          value:
            "The big one is correctness of slot state — we can never tell two drivers the same slot is free. I'd also guess these kiosks sit in places like mall basements or apartment lobbies, so I shouldn't assume reliable connectivity at the kiosk itself.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 158,
      content: [
        {
          type: "text",
          value:
            "Good instinct, we'll come back to that. Let's start simple. Sketch the first version.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 182,
      content: [
        {
          type: "text",
          value:
            "Simplest version: a driver's handheld app calls a Locker Service, which checks a database for a free slot near the delivery address, marks it reserved, and returns an access code. Driver walks up, enters the code, door opens.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 215,
      content: [
        {
          type: "text",
          value:
            "Two drivers, delivering to nearby addresses, both query the same locker bank within a second of each other for the last free small slot. Walk me through what happens.",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 244,
      content: [
        {
          type: "text",
          value:
            "Both requests hit different API servers. Both read the slot as free. Both write a reservation. Let me think... whichever write happens last wins, but both drivers already got back a success response and an access code for the same physical door.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 275,
      content: [
        {
          type: "text",
          value: "So how do you stop that?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 298,
      content: [
        {
          type: "text",
          value: "I'd just wrap the read and the write in a database transaction.",
        },
        {
          id: "highlight-naive-transaction",
          type: "highlight",
          status: "missed",
          value: "",
          explanation:
            "A transaction around a read-then-write doesn't help if two separate transactions each read 'free' before either writes — it doesn't create mutual exclusion on its own without an isolation guarantee tied to the actual row.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 322,
      content: [
        {
          type: "text",
          value:
            "Both transactions still read the row before either commits. Does wrapping it in a transaction change that?",
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
            "No, you're right, that doesn't fix it by itself. The reservation has to be a single atomic operation, not a read followed by a write.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 368,
      content: [
        {
          type: "text",
          value: "How would you make it atomic?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 392,
      content: [
        {
          type: "text",
          value: "I'd make the ",
        },
        {
          id: "highlight-conditional-update",
          type: "highlight",
          status: "strong",
          value: "reservation a single conditional update",
          explanation:
            "Correctly moves from read-then-write to an atomic compare-and-set on the row itself, which is what actually prevents the race.",
        },
        {
          type: "text",
          value:
            " — an UPDATE against the slot row that only succeeds if its current status is still 'free'. Whichever request's update actually flips the row wins, and the other gets zero rows affected and knows to try a different slot.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 425,
      content: [
        {
          type: "text",
          value: "Good. Now — packages aren't all the same size. Does that change anything?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 452,
      content: [
        {
          type: "text",
          value:
            "It does. A slot isn't interchangeable capacity like a generic counter — it's a specific physical compartment of a specific size. So 'is there a free slot' isn't a single number, it's really 'is there a free slot in the size tier this package needs.'",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 480,
      content: [
        {
          type: "text",
          value:
            "Say a locker bank has plenty of large slots free but zero small ones, and a small package shows up. What do you do?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 508,
      content: [
        {
          type: "text",
          value:
            "You could put the small package in a large slot, but if you always do that you'll burn through large capacity fast with tiny packages and then have nowhere for actual large ones. I'd want a ",
        },
        {
          id: "highlight-best-fit",
          type: "highlight",
          status: "strong",
          value: "best-fit allocation with tiered fallback",
          explanation:
            "Recognizes that naive first-available allocation wastes scarce large capacity — best-fit-first with controlled fallback is the right tradeoff.",
        },
        {
          type: "text",
          value:
            " — try the smallest tier that fits first, and only fall back to the next size up when that tier is exhausted, so large slots stay reserved for packages that actually need them.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 545,
      content: [
        {
          type: "text",
          value:
            "What if every tier at this specific locker bank is full for this package's size?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 570,
      content: [
        {
          type: "text",
          value:
            "Then this locker bank just isn't a valid candidate for this package, and it shouldn't have been offered in the first place. Which makes me think slot allocation and locker selection aren't really two separate steps — the selection step needs live visibility into per-tier capacity, not just 'is this locker open.'",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 600,
      content: [
        {
          type: "text",
          value: "Good, hold that thought. Let's talk about the kiosk itself now. Where does it live in this picture?",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 625,
      content: [
        {
          type: "text",
          value:
            "So far I've been treating the kiosk as a dumb terminal — driver enters a code, kiosk asks the central Locker Service 'is this code valid,' service says yes, door opens.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 650,
      content: [
        {
          type: "text",
          value:
            "This kiosk is in a basement with unreliable cellular signal. The driver walks up with a valid code, but the kiosk's connection to the central service has been down for the last ten minutes. What happens?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 680,
      content: [
        {
          type: "text",
          value:
            "Hmm. If opening the door requires a live round trip to the central service, the door just... doesn't open. The driver's standing there with a package and a valid reservation and the kiosk can't confirm it.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 705,
      content: [
        {
          type: "text",
          value: "So how do you avoid that?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 730,
      content: [
        {
          type: "text",
          value:
            "The kiosk needs to be able to make the open-or-not decision on its own. I'd push the reservation — slot ID and access code — down to the kiosk at the moment it's created, so the kiosk already knows locally which codes are valid for which doors, before the driver ever arrives.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 758,
      content: [
        {
          type: "text",
          value:
            "Okay, but that push has to reach the kiosk somehow. What if the kiosk was already offline when the reservation was made?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 785,
      content: [
        {
          type: "text",
          value:
            "Then it queues, and the kiosk picks it up once it reconnects. That's fine for a package that hasn't arrived yet. It's only a real problem if the driver shows up before the reservation ever made it down.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 812,
      content: [
        {
          type: "text",
          value: "So does that change how you pick lockers for packages heading to a flaky kiosk?",
        },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 838,
      content: [
        {
          type: "text",
          value:
            "It should. Going back to what you said earlier — locker selection needs live capacity, and I'd extend that to needing live connectivity health too. If a kiosk's been unreachable, I'd treat its capacity as ",
        },
        {
          id: "highlight-degraded-capacity",
          type: "highlight",
          status: "strong",
          value: "unconfirmed rather than unavailable",
          explanation:
            "Good distinction — instead of a binary online/offline flag, treating stale kiosks as degraded input to the selection scoring avoids both wrongly excluding a locker that's fine and wrongly trusting one that isn't.",
        },
        {
          type: "text",
          value:
            ", and deprioritize it in selection until it's confirmed synced again, rather than fully excluding it or fully trusting it.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 872,
      content: [
        {
          type: "text",
          value:
            "Now flip it around. The kiosk was offline, a driver dropped off a package using its locally cached reservation, and the door opened and closed. When the kiosk reconnects, what does it tell the central service, and what if the central service had, in the meantime, decided to give that slot away as expired?",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 905,
      content: [
        {
          type: "text",
          value:
            "That's a real conflict. The kiosk thinks the slot is occupied because it physically watched the door close. The central service thinks it's free because it never heard otherwise and the reservation timed out.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 930,
      content: [
        {
          type: "text",
          value: "Who's right?",
        },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 955,
      content: [
        {
          type: "text",
          value:
            "The kiosk is, physically. It has a door sensor, it knows a package is actually sitting in that compartment. I think the mistake is letting the central service treat itself as the source of truth for physical slot occupancy when it isn't physically present.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 985,
      content: [
        {
          type: "text",
          value: "So how do you restructure that?",
        },
      ],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 1015,
      content: [
        {
          type: "text",
          value: "The kiosk should be the ",
        },
        {
          id: "highlight-kiosk-authority",
          type: "highlight",
          status: "strong",
          value: "authoritative source for physical occupancy",
          explanation:
            "Correctly relocates the source of truth to the component with physical evidence, and treats the central service as a downstream, reconciling observer rather than the arbiter of physical reality.",
        },
        {
          type: "text",
          value:
            ", logging every door-open and door-close event locally as it happens, with its own timestamps. The central service is downstream of that — it reconciles its view against the kiosk's event log once connectivity returns, not the other way around.",
        },
      ],
    },

    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 1050,
      content: [
        {
          type: "text",
          value: "Walk me through that sync happening.",
        },
      ],
    },

    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 1080,
      content: [
        {
          type: "text",
          value:
            "The kiosk keeps an append-only local log of door events with sequence numbers. On reconnect, a relay process on the kiosk pushes any events the central service hasn't acknowledged yet. If the central service had marked that slot expired and free, it now sees a door-close event after the expiry and corrects itself — flags the slot occupied, and separately raises an alert that a reservation was fulfilled after its expiry window so someone can check whether that customer still needs notifying.",
        },
      ],
    },

    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 1120,
      content: [
        {
          type: "text",
          value: "Good. Now, once a package is actually placed, how does the customer find out?",
        },
      ],
    },

    {
      id: "44",
      role: "candidate",
      elapsedSeconds: 1148,
      content: [
        {
          type: "text",
          value:
            "The kiosk's door-close event, once it reaches the central service, should trigger a notification — push notification with a pickup code, falling back to SMS.",
        },
      ],
    },

    {
      id: "45",
      role: "interviewer",
      elapsedSeconds: 1172,
      content: [
        {
          type: "text",
          value:
            "Given everything we just discussed about the kiosk being offline and syncing late, what happens if that same door-close event gets delivered to the notification step twice?",
        },
      ],
    },

    {
      id: "46",
      role: "candidate",
      elapsedSeconds: 1198,
      content: [
        {
          type: "text",
          value:
            "Right, because the kiosk might retry pushing an event it's not sure was acknowledged. I'd carry the kiosk's event ID all the way through to the notification, so the notification step can recognize ",
        },
        {
          id: "highlight-idempotent-notification",
          type: "highlight",
          status: "strong",
          value: "it's already sent for this event ID",
          explanation:
            "Correctly extends idempotency from the kiosk sync layer through to customer-facing notifications, so a duplicate physical event doesn't become a duplicate, confusing message to the customer.",
        },
        {
          type: "text",
          value:
            " and skip it, rather than treating every incoming event as a brand new notification to send.",
        },
      ],
    },

    {
      id: "47",
      role: "interviewer",
      elapsedSeconds: 1230,
      content: [
        {
          type: "text",
          value:
            "Let's go back to locker selection. You mentioned it needs live capacity and connectivity health. What about cost — does the system just pick the nearest locker with room?",
        },
      ],
    },

    {
      id: "48",
      role: "candidate",
      elapsedSeconds: 1260,
      content: [
        {
          type: "text",
          value:
            "Nearest-to-the-customer isn't quite right either, because the thing we're actually optimizing is the driver's route, not straight-line distance. A locker slightly farther from the customer but directly on the driver's existing route costs less than a 'closer' one that's a detour.",
        },
      ],
    },

    {
      id: "49",
      role: "interviewer",
      elapsedSeconds: 1292,
      content: [
        {
          type: "text",
          value: "So what are you actually scoring on?",
        },
      ],
    },

    {
      id: "50",
      role: "candidate",
      elapsedSeconds: 1320,
      content: [
        {
          type: "text",
          value:
            "A few signals together: detour cost added to the driver's planned route, whether the right size tier is actually free, and now, from what we just covered, the kiosk's connectivity confidence. I'd score candidate lockers on those and pick the best, not just the nearest.",
        },
      ],
    },

    {
      id: "51",
      role: "interviewer",
      elapsedSeconds: 1352,
      content: [
        {
          type: "text",
          value:
            "The locker looked free when the route was planned that morning, but by the time the driver actually gets there hours later, someone else's package has filled it. What now?",
        },
      ],
    },

    {
      id: "52",
      role: "candidate",
      elapsedSeconds: 1382,
      content: [
        {
          type: "text",
          value:
            "That's the gap between planning-time capacity and arrival-time capacity. A locker that shows one free slot in the morning might have several drivers all planning routes around that same slot before any of them arrive.",
        },
      ],
    },

    {
      id: "53",
      role: "interviewer",
      elapsedSeconds: 1408,
      content: [
        {
          type: "text",
          value: "So how do you protect against that?",
        },
      ],
    },

    {
      id: "54",
      role: "candidate",
      elapsedSeconds: 1435,
      content: [
        {
          type: "text",
          value: "I'd put a ",
        },
        {
          id: "highlight-soft-hold",
          type: "highlight",
          status: "strong",
          value: "short-lived soft hold on the slot at planning time",
          explanation:
            "Correctly identifies that a scoring decision made hours before arrival needs its own temporary reservation with a decaying lifetime, rather than treating the slot as free right up until the atomic reservation at arrival.",
        },
        {
          type: "text",
          value:
            " as soon as a route plan assigns a package to it — not a full reservation yet, but enough that other route plans see it as spoken for. If the driver doesn't actually arrive and confirm within some window, the hold expires and the slot goes back into the pool.",
        },
      ],
    },

    {
      id: "55",
      role: "interviewer",
      elapsedSeconds: 1470,
      content: [
        {
          type: "text",
          value: "Good. Last one — days later, does anything check that the software's view of locker state matches physical reality?",
        },
      ],
    },

    {
      id: "56",
      role: "candidate",
      elapsedSeconds: 1500,
      content: [
        {
          type: "text",
          value:
            "It should. Even with the kiosk as source of truth, hardware fails — a door sensor can stick, a kiosk can lose its local log. I'd run a periodic reconciliation between each kiosk's reported slot state and whatever physical audit signal is available, like a technician sweep or a weight sensor, and flag mismatches for manual review rather than assume software state is always correct.",
        },
      ],
    },

    {
      id: "57",
      role: "interviewer",
      elapsedSeconds: 1535,
      content: [
        {
          type: "text",
          value: "Last question — how does this scale to thousands of locker banks?",
        },
      ],
    },

    {
      id: "58",
      role: "candidate",
      elapsedSeconds: 1565,
      content: [
        {
          type: "text",
          value:
            "The locker selection and route-scoring services scale horizontally and shard capacity data by region, since a package only ever competes with lockers near its own delivery area. Each kiosk only ever talks about its own slots, so kiosk sync fans out naturally without any kiosk needing to know about any other. The soft-hold and reservation state can live in a per-region store keyed by locker, and reconciliation jobs run per region on their own schedule so a backlog in one area doesn't block another.",
        },
      ],
    },

    {
      id: "59",
      role: "takeaway",
      elapsedSeconds: 1600,
      content: [
        {
          type: "text",
          value:
            "Takeaway: treat physical slot state as owned by the device that can actually observe it, not the central service. Atomic conditional updates prevent double-booking, tiered best-fit allocation respects scarce capacity, soft holds bridge the gap between planning-time and arrival-time state, and reconciliation — at the kiosk-sync level and the physical-audit level — catches everything the rest of the design didn't anticipate.",
        },
      ],
    },
  ],
};

const amazonLockers: TranscriptEntry = {
  summary: {
    slug: "amazon-lockers",
    title: "Design Amazon Lockers & Capacity Management",
    category: "hld",
    difficulty: Difficulty.HARD,
    duration: 50,
    company: "Amazon",
    tags: [
      "Distributed Systems",
      "Concurrency",
      "Offline-First",
      "Capacity Planning",
      "Idempotency",
      "Edge Computing",
      "Last-Mile Logistics",
    ],
    description:
      "Production-grade HLD interview covering dynamic slot allocation, kiosk-authoritative offline sync, edge notification dispatch, and last-mile cost optimization for a physical locker network.",
  },

  transcript,
};

export default amazonLockers;