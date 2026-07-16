import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Design a Vending Machine Leasing System",
    difficulty: Difficulty.HARD,
    duration: 45,
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
            "Let's design a B2B system that manages leasing agreements for vending machines — a supplier leases machines out, and we need to model the machine's lifecycle, the lease terms, and incoming payment events.",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 16,
      content: [{ type: "text", value: "A couple of scoping questions first." }],
    },

    { id: "3", role: "interviewer", elapsedSeconds: 28, content: [{ type: "text", value: "Sure." }] },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 45,
      content: [
        {
          type: "text",
          value:
            "Am I building the payment processing itself, or do I just receive events like 'payment received' or 'payment failed' and react to them?",
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
          value: "Just react to them. Assume payment events arrive from somewhere else, already validated.",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 88,
      content: [
        {
          type: "text",
          value:
            "And what states does a machine actually move through? I want to hear the vocabulary before I start modeling.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 110,
      content: [
        {
          type: "text",
          value:
            "At minimum: idle and available, leased to a customer, under maintenance, and defaulted on payment.",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 135,
      content: [
        {
          type: "text",
          value:
            "Okay. Let me start with something simple and see where it breaks, rather than jumping straight to a pattern.",
        },
      ],
    },

    { id: "9", role: "interviewer", elapsedSeconds: 150, content: [{ type: "text", value: "Go for it." }] },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 178,
      content: [
        {
          type: "text",
          value:
            "A VendingMachine entity with a status field — an enum, idle, leased, underMaintenance, defaulted. Then a handler method per event type: handleLeaseSigned, handlePaymentReceived, handlePaymentMissed, handleMaintenanceRequested. Each one checks the current status and, if it's a valid transition, updates it.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 210,
      content: [
        {
          type: "text",
          value:
            "Walk me through handlePaymentMissed specifically — what does it actually check?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 238,
      content: [
        {
          type: "text",
          value:
            "Something like: if status is leased, and this is, say, the third missed payment, set status to defaulted. If it's already under maintenance, missed payments probably shouldn't default it — a machine that's broken isn't really the lessee's fault. So I'd guard on the current status inside that handler too.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 268,
      content: [
        {
          type: "text",
          value:
            "We add a fifth state next quarter — say, pending inspection before a machine can be leased out at all. How many of these handler methods do you have to go back and touch?",
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
          value:
            "Probably most of them — I'd need to add a branch to handleLeaseSigned to reject leasing a machine still pending inspection, and I'd want to double check every other handler to make sure none of them accidentally allow a transition out of pending inspection that shouldn't be allowed either.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 328,
      content: [{ type: "text", value: "Is that a comfortable place to be?" }],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 355,
      content: [
        {
          type: "text",
          value:
            "Not really — the legality of a transition is scattered across every handler instead of living in one place, so it's easy for one handler to forget a guard the others remember. That's the kind of thing that quietly breaks when someone adds a state six months from now and doesn't know to check all four other files.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 385,
      content: [{ type: "text", value: "So how would you restructure it?" }],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 412,
      content: [
        {
          type: "text",
          value:
            "Before I reach for anything heavier — could this just be a lookup table? Current state plus incoming event maps to a next state, all in one place, instead of scattered across handlers.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 440,
      content: [{ type: "text", value: "Would that be enough on its own?" }],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 468,
      content: [
        {
          type: "text",
          value:
            "Thinking about it more — probably not, because it's not just about which transitions are legal. Each state actually does something different. Leased has to kick off a billing cycle. UnderMaintenance needs to block any new lease from being signed. Defaulted probably triggers a repossession workflow. A table tells me what's allowed, but not what should happen.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 498,
      content: [{ type: "text", value: "So what earns its place here?" }],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 525,
      content: [
        { type: "text", value: "Given that each state carries its own real behavior, not just permissions, I think " },
        {
          id: "highlight-state-pattern-justified",
          type: "highlight",
          status: "strong",
          value: "a state class per lifecycle stage actually earns its place here",
          explanation:
            "Justifies the State pattern on the right basis — each state has genuinely distinct behavior and side effects (billing, blocking new leases, repossession), not merely a different row in a transition table, which is exactly when encapsulating state-specific behavior in its own class pays for its complexity.",
        },
        {
          type: "text",
          value:
            " — an Idle state, a Leased state, an UnderMaintenance state, a Defaulted state, each implementing the same interface: something like onPaymentReceived, onPaymentMissed, onMaintenanceRequested, onLeaseSigned. Each state only overrides what actually applies to it, and the machine just delegates to whatever state it's currently in.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 560,
      content: [
        {
          type: "text",
          value:
            "Good. Now, where does the actual business decision live — like, how many missed payments before we call it defaulted?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 590,
      content: [
        {
          type: "text",
          value:
            "My instinct is to just put that threshold check directly inside the Leased state's onPaymentMissed method.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 615,
      content: [
        {
          type: "text",
          value:
            "Suppose that threshold differs by lease contract — some suppliers negotiate a grace period of one missed payment, others allow three. Does that change where you'd put it?",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 645,
      content: [
        {
          type: "text",
          value:
            "It should. If I bake a fixed threshold into the state class, every lease is forced through the same rule, and testing that rule means instantiating the whole state machine just to check a number comparison.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 675,
      content: [{ type: "text", value: "So restructure it." }],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 702,
      content: [
        {
          type: "text",
          value:
            "I'd pull that decision out into a separate compliance engine — something like a LeaseComplianceEngine that knows about grace periods and contract-specific rules, and takes in the payment history plus the lease terms to decide whether this counts as a default. The Leased state just asks that engine 'should this trigger a default,' and reacts to whatever it says. The state class stays about transition semantics; the actual business rule lives somewhere I can test on its own, independent of the machine.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 738,
      content: [
        {
          type: "text",
          value:
            "Good separation. Let's build up the basic structure a bit more, and then I want to ask you something about it.",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 765,
      content: [
        {
          type: "text",
          value:
            "Sure — VendingMachine holds a reference to its current MachineState, plus its ID and lease history. Each MachineState implementation handles the four event types and returns whatever the next state should be. The compliance engine sits alongside, consulted by states that need a business decision rather than a pure transition rule.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 798,
      content: [
        {
          type: "text",
          value:
            "Okay. Now — a field technician marks a machine as needing maintenance, and at the exact same instant, an automated payment sweep marks that same machine as defaulted. Both events hit your VendingMachine object at the same time, from different threads. What happens?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 830,
      content: [
        {
          type: "text",
          value:
            "If both threads read the current state — say, Leased — before either one writes the new state, both would compute their transition based on the same starting point, and whichever write lands last just silently overwrites the other. I could end up with the machine marked under maintenance when it should also reflect that it defaulted, or vice versa, and no record that both things actually happened.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 862,
      content: [{ type: "text", value: "How would you prevent that?" }],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 890,
      content: [
        {
          type: "text",
          value:
            "Simplest fix — synchronize the whole method that processes events, across the entire service, so only one event processes at a time anywhere.",
        },
        {
          id: "highlight-global-lock-mistake",
          type: "highlight",
          status: "missed",
          value: "",
          explanation:
            "A single global lock makes every machine's events wait behind every other machine's events, even though machines are entirely independent of each other — the actual race only involves two events for the same machine, not the whole fleet.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 918,
      content: [
        {
          type: "text",
          value:
            "There could be tens of thousands of machines, all firing events independently. What does one lock across the whole service do to that?",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 945,
      content: [
        {
          type: "text",
          value:
            "It forces every unrelated machine's events to queue behind each other, even though they share nothing. The actual conflict is scoped to one machine at a time — I only need mutual exclusion per machine, not across the entire fleet.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 972,
      content: [{ type: "text", value: "So how do you scope it down?" }],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 1000,
      content: [
        {
          type: "text",
          value: "I'd key a lock " },
        {
          id: "highlight-per-machine-lock",
          type: "highlight",
          status: "strong",
          value: "per machine ID, not globally",
          explanation:
            "Correctly narrows the synchronization boundary to exactly the shared, mutable piece of state — one machine's current state reference — so unrelated machines never contend, while still guaranteeing that two events for the same machine can't race.",
        },
        {
          type: "text",
          value:
            " — something like a striped lock, or a ConcurrentHashMap from machine ID to its own lock object. Whichever event acquires that specific machine's lock first fully applies its transition before the second one even reads the current state, so the second one is guaranteed to see the result of the first.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 1032,
      content: [
        {
          type: "text",
          value:
            "Once the second event acquires the lock and sees the machine is now defaulted, does it still make sense to apply the maintenance-requested event on top of that?",
        },
      ],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 1062,
      content: [
        {
          type: "text",
          value:
            "That's actually a real business question, not just a concurrency one — the lock guarantees the events apply one at a time in some order, but it doesn't tell me whether Defaulted's onMaintenanceRequested should even allow that transition. I think it should — a machine can be both defaulted on payment and physically broken at the same time, those aren't mutually exclusive facts about the world. So Defaulted's handler for a maintenance event probably needs to layer maintenance on top rather than discard it, maybe as a flag alongside the state rather than replacing it outright.",
        },
      ],
    },

    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 1098,
      content: [
        {
          type: "text",
          value: "So is 'state' really a single enum-like value at all, or something richer?",
        },
      ],
    },

    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 1128,
      content: [
        {
          type: "text",
          value:
            "Hearing myself say that out loud — probably something richer. A single current lifecycle state, like Leased or Defaulted, plus an independent maintenance flag that can be true or false regardless of lifecycle state. That keeps the state pattern focused on the lifecycle question it's actually good at, without forcing it to represent every combination of independent facts as its own named state.",
        },
      ],
    },

    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 1160,
      content: [
        {
          type: "text",
          value:
            "Good catch. Last thing — the automated payment sweep retries on failure and could theoretically deliver the same payment-missed event twice for the same machine. Does your locking scheme protect against that on its own?",
        },
      ],
    },

    {
      id: "44",
      role: "candidate",
      elapsedSeconds: 1192,
      content: [
        {
          type: "text",
          value:
            "No — the lock only guarantees events for one machine don't interleave with each other, it doesn't know two events are actually duplicates of the same underlying occurrence. I'd want each event to carry its own ID, and have the compliance engine or the machine itself track which event IDs it's already applied, so a redelivered duplicate gets recognized and skipped rather than incorrectly counted as a second missed payment.",
        },
      ],
    },

    {
      id: "45",
      role: "interviewer",
      elapsedSeconds: 1222,
      content: [{ type: "text", value: "Good. I think that covers it." }],
    },

    {
      id: "46",
      role: "takeaway",
      elapsedSeconds: 1245,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the State pattern earned its place here because each lifecycle stage carried genuinely different behavior, not just different permissions — a plain transition table was considered and rejected for that specific reason. Pulling contract-specific business rules like grace periods out of the state classes and into a separate compliance engine kept the state machine testable and the business logic testable, independently. And the concurrency fix wasn't just 'add a lock' — it was scoping that lock to exactly the shared resource in contention, one machine at a time, which then surfaced a deeper modeling question about whether lifecycle state and maintenance status should ever have been the same field.",
        },
      ],
    },
  ],
};

const vendingMachineLeasing: TranscriptEntry = {
  summary: {
    slug: "vending-machine-leasing",
    title: "Design a Vending Machine Leasing System",
    category: "lld",
    difficulty: Difficulty.HARD,
    duration: 45,
    company: "Amazon",
    tags: [
      "Low Level Design",
      "State Pattern",
      "Concurrency",
      "Thread Safety",
      "Separation of Concerns",
      "Design Patterns",
    ],
    description:
      "LLD interview covering a vending machine leasing lifecycle, justifying the State pattern by distinct per-state behavior rather than pattern-matching, separating contract-specific business rules into a standalone compliance engine, and scoping concurrency fixes to per-machine locks rather than a global lock, including a modeling correction around independent maintenance status.",
  },

  transcript,
};

export default vendingMachineLeasing;