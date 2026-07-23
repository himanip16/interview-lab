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
            "Design the system behind Amazon Lockers. Drivers drop packages off, customers pick them up later.",
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
            "Okay. Before I draw anything — can I ask what this thing is actually responsible for? Like where the edges are.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 24,
      content: [
        {
          type: "text",
          value: "Go ahead.",
        },
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
            "Is it just reserving and tracking slots, or does it also decide which locker a driver gets routed to?",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 52,
      content: [
        {
          type: "text",
          value: "Both.",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 70,
      content: [
        {
          type: "text",
          value:
            "Got it. So — assign a package to a locker, reserve a slot that actually fits it, let the driver drop it, tell the customer, then free the slot once it's picked up. Or times out.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 92,
      content: [
        {
          type: "text",
          value: "Non-functional concerns?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 118,
      content: [
        {
          type: "text",
          value:
            "Biggest one — two drivers can never be told the same slot is free. That's a correctness thing, not a nice-to-have. And I'm guessing these kiosks are in places like mall basements, so I probably shouldn't assume the kiosk itself is always online.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 142,
      content: [
        {
          type: "text",
          value: "We'll get to that. Sketch v1.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 168,
      content: [
        {
          type: "text",
          value:
            "Simplest thing — driver's app hits a Locker Service, that checks a database for a free slot near the address, marks it reserved, hands back an access code. Driver walks up, types the code, door opens.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 196,
      content: [
        {
          type: "text",
          value:
            "Two drivers, nearby addresses, both hit the same locker bank a second apart. Last small slot. Go.",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 214,
      content: [
        {
          type: "text",
          value:
            "Different API servers, both read it as free, both—",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 218,
      content: [
        {
          type: "text",
          value: "Both write.",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 232,
      content: [
        {
          type: "text",
          value:
            "Right — both write a reservation. Whoever's write lands last technically wins in the DB, but both drivers already got a success response and a code for the same door. So that's broken.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 250,
      content: [
        {
          type: "text",
          value: "So fix it.",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 268,
      content: [
        {
          type: "text",
          value: "Wrap the read and the write in a transaction.",
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
      id: "17",
      role: "interviewer",
      elapsedSeconds: 284,
      content: [
        {
          type: "text",
          value: "Both transactions still read before either commits. Does the transaction change that?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 302,
      content: [
        {
          type: "text",
          value:
            "...No. No, it doesn't. Okay — so the read and the write can't be two steps at all. It has to be one operation.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 316,
      content: [
        {
          type: "text",
          value: "How.",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 336,
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
            " — an UPDATE that only succeeds if the row's still marked free. Whichever request actually flips it wins. The loser gets zero rows affected and knows to go try somewhere else.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 358,
      content: [
        {
          type: "text",
          value: "Packages aren't all the same size. Matter?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 380,
      content: [
        {
          type: "text",
          value:
            "It does, yeah — a slot's not interchangeable capacity like a counter, it's a specific physical box of a specific size. So \"is there a free slot\" is really \"is there a free slot in the tier this package needs.\"",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 404,
      content: [
        {
          type: "text",
          value: "Bank's got plenty of large slots, zero small ones. Small package shows up.",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 428,
      content: [
        {
          type: "text",
          value:
            "First thought — just drop it in a large slot. But if I always do that I'll burn through large capacity on tiny packages, and then there's nowhere for the packages that actually need a large slot. So more like ",
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
            " — try the smallest tier that fits, and only fall back a size when that tier's actually exhausted.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 452,
      content: [
        {
          type: "text",
          value: "Every tier's full for this size. Now what?",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 476,
      content: [
        {
          type: "text",
          value:
            "Then this bank was never a valid candidate and shouldn't have been offered. Which — actually, that makes me think allocation and locker selection aren't really separate steps. Selection needs live per-tier capacity, not just \"is this locker open.\"",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 500,
      content: [
        {
          type: "text",
          value: "Hold that. The kiosk itself — where does it sit in this?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 522,
      content: [
        {
          type: "text",
          value:
            "So far I've had it as basically dumb — driver enters a code, kiosk asks the central service \"is this valid,\" service says yes, door opens.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 546,
      content: [
        {
          type: "text",
          value:
            "That kiosk's in a basement, connection's been down ten minutes. Driver walks up with a valid code.",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 568,
      content: [
        {
          type: "text",
          value:
            "Hmm. If opening the door means a round trip to the central service... the door just doesn't open. Guy's standing there with a package and a good reservation and the kiosk can't confirm anything.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 586,
      content: [
        {
          type: "text",
          value: "So?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 612,
      content: [
        {
          type: "text",
          value:
            "The kiosk needs to make that call on its own, without asking. I'd push the reservation down when it's created — slot, code — so it's already sitting on the kiosk before the driver even shows up.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 634,
      content: [
        {
          type: "text",
          value: "That push has to reach the kiosk somehow. What if it was already offline when you made the reservation?",
        },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 656,
      content: [
        {
          type: "text",
          value:
            "Queue it. Kiosk picks it up on reconnect. Fine for a package that hasn't arrived yet — only actually breaks if the driver gets there before the reservation ever made it down.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 680,
      content: [
        {
          type: "text",
          value: "Does that change how you pick lockers heading toward a flaky kiosk?",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 704,
      content: [
        {
          type: "text",
          value:
            "It should — you said selection needs live capacity, I'd fold connectivity in too. Kiosk's been unreachable, I wouldn't call its capacity unavailable, more like ",
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
          value: ". Deprioritize it until it syncs, don't fully exclude it and don't fully trust it either.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 730,
      content: [
        {
          type: "text",
          value:
            "Flip it. Kiosk was offline, driver used the cached reservation, door opened and closed. Meanwhile central service decided that slot expired and handed it to someone else. Kiosk reconnects. Now what.",
        },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 758,
      content: [
        {
          type: "text",
          value:
            "That's a real conflict, not just a stale-cache thing. Kiosk thinks it's occupied — it watched the door close. Central service thinks it's free, it never heard otherwise and the timer ran out.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 780,
      content: [
        {
          type: "text",
          value: "Who's right?",
        },
      ],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 802,
      content: [
        {
          type: "text",
          value:
            "The kiosk. It's the one with a sensor on the actual door. I think the real bug is letting the central service act like it owns physical truth when it was never in the room.",
        },
      ],
    },

    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 822,
      content: [
        {
          type: "text",
          value: "So restructure it.",
        },
      ],
    },

    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 848,
      content: [
        {
          type: "text",
          value: "The kiosk becomes the ",
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
            " — logs every door-open, door-close locally, its own timestamps. Central service is downstream. It reconciles against the kiosk's log when it reconnects, not the other way around.",
        },
      ],
    },

    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 868,
      content: [
        {
          type: "text",
          value: "Walk me through that sync.",
        },
      ],
    },

    {
      id: "44",
      role: "candidate",
      elapsedSeconds: 896,
      content: [
        {
          type: "text",
          value:
            "Kiosk keeps an append-only log, sequence numbers on everything. Reconnects, a relay process pushes whatever the central service hasn't acked yet. If the service had marked that slot expired-and-free, it now sees a door-close after the expiry — corrects itself, flips the slot to occupied, and separately raises a flag: reservation fulfilled after expiry, someone should check whether that customer still needs a notification.",
        },
      ],
    },

    {
      id: "45",
      role: "interviewer",
      elapsedSeconds: 924,
      content: [
        {
          type: "text",
          value: "How does the customer even find out a package is there?",
        },
      ],
    },

    {
      id: "46",
      role: "candidate",
      elapsedSeconds: 946,
      content: [
        {
          type: "text",
          value:
            "Door-close event hits the central service, that triggers a notification. Push, falling back to SMS.",
        },
      ],
    },

    {
      id: "47",
      role: "interviewer",
      elapsedSeconds: 966,
      content: [
        {
          type: "text",
          value: "Given the offline-and-retry thing we just covered — same event gets delivered twice?",
        },
      ],
    },

    {
      id: "48",
      role: "candidate",
      elapsedSeconds: 990,
      content: [
        {
          type: "text",
          value:
            "Yeah, because the kiosk might retry a push it wasn't sure landed. I'd carry its event ID all the way through, so the notification step can go, ",
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
          value: ", skip it — instead of treating every incoming event as a fresh one to send.",
        },
      ],
    },

    {
      id: "49",
      role: "interviewer",
      elapsedSeconds: 1012,
      content: [
        {
          type: "text",
          value: "Back to selection. Just nearest locker with room?",
        },
      ],
    },

    {
      id: "50",
      role: "candidate",
      elapsedSeconds: 1036,
      content: [
        {
          type: "text",
          value:
            "Nearest-to-the-customer isn't really it — what we're optimizing is the driver's route, not straight-line distance. A locker a bit farther from the customer but on the driver's existing path can beat a \"closer\" one that's a detour.",
        },
      ],
    },

    {
      id: "51",
      role: "interviewer",
      elapsedSeconds: 1058,
      content: [
        {
          type: "text",
          value: "So what are you actually scoring?",
        },
      ],
    },

    {
      id: "52",
      role: "candidate",
      elapsedSeconds: 1080,
      content: [
        {
          type: "text",
          value:
            "Detour cost against the driver's planned route. Whether the right size tier is actually free. And now — connectivity confidence from the kiosk, since we just established that matters too. Score candidates on those, take the best, not the closest.",
        },
      ],
    },

    {
      id: "53",
      role: "interviewer",
      elapsedSeconds: 1108,
      content: [
        {
          type: "text",
          value:
            "Locker looked free that morning when the route got planned. By the time the driver gets there, someone else filled it.",
        },
      ],
    },

    {
      id: "54",
      role: "candidate",
      elapsedSeconds: 1132,
      content: [
        {
          type: "text",
          value:
            "That's the gap between planning-time and arrival-time state. One free slot in the morning, multiple drivers planning routes around it before anyone actually shows up.",
        },
      ],
    },

    {
      id: "55",
      role: "interviewer",
      elapsedSeconds: 1150,
      content: [
        {
          type: "text",
          value: "Protect against that how?",
        },
      ],
    },

    {
      id: "56",
      role: "candidate",
      elapsedSeconds: 1174,
      content: [
        {
          type: "text",
          value: "Put a ",
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
            " — not a full reservation, just enough that other route plans see it as spoken for. Driver doesn't show and confirm in time, it expires, goes back in the pool.",
        },
      ],
    },

    {
      id: "57",
      role: "interviewer",
      elapsedSeconds: 1198,
      content: [
        {
          type: "text",
          value: "Last one on this thread — does anything check the software's view against physical reality?",
        },
      ],
    },

    {
      id: "58",
      role: "candidate",
      elapsedSeconds: 1224,
      content: [
        {
          type: "text",
          value:
            "It should. Kiosk being source of truth doesn't help if the sensor's stuck or the local log gets lost. I'd run periodic reconciliation between what each kiosk reports and some outside signal — technician sweep, weight sensor, whatever's available — and flag mismatches for a human instead of assuming the software's always right.",
        },
      ],
    },

    {
      id: "59",
      role: "interviewer",
      elapsedSeconds: 1250,
      content: [
        {
          type: "text",
          value: "Scale this to thousands of locker banks.",
        },
      ],
    },

    {
      id: "60",
      role: "candidate",
      elapsedSeconds: 1280,
      content: [
        {
          type: "text",
          value:
            "Selection and route-scoring shard by region — a package only ever competes with lockers near its own delivery area. Each kiosk only ever talks about its own slots, so sync fans out naturally, no kiosk needs to know about any other. Soft-hold and reservation state live in a per-region store keyed by locker, and reconciliation runs per region on its own schedule, so a backlog in one area doesn't stall another.",
        },
      ],
    },

    {
      id: "61",
      role: "takeaway",
      elapsedSeconds: 1310,
      content: [
        {
          type: "text",
          value:
            "Takeaway: treat physical slot state as owned by the device that can actually observe it, not the central service. Atomic conditional updates prevent double-booking, tiered best-fit allocation respects scarce capacity, soft holds bridge the gap between planning-time and arrival-time state, and reconciliation — at the kiosk-sync level and the physical-audit level — catches everything else the design didn't anticipate.",
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