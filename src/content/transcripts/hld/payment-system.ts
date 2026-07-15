import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Design a Payment System",
    difficulty: Difficulty.HARD,
    duration: 45,
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
            "Let's design a payment system capable of handling millions of transactions every day.",
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
            "Before jumping into architecture I'd like to clarify a few requirements.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 30,
      content: [
        {
          type: "text",
          value: "Sure.",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 48,
      content: [
        {
          type: "text",
          value:
            "Are we only responsible for processing payments or should refunds, settlements and reconciliation also be part of the system?",
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
            "Let's focus on payment processing first. We can extend later if needed.",
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
            "Great. Functional requirements would be creating payments, querying payment status and supporting retries safely.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 101,
      content: [
        {
          type: "text",
          value:
            "Sounds good. Assume we integrate with external payment gateways.",
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
            "For non-functional requirements I'm optimizing for availability, durability and exactly-once user experience even if internally components retry.",
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
          value:
            "How would you prevent duplicate charges when clients retry requests?",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 165,
      content: [
        {
          type: "text",
          value: "I'd introduce an ",
        },
        {
          id: "highlight-idempotency",
          type: "highlight",
          status: "strong",
          value: "idempotency key",
          explanation:
            "Excellent. Starts from the business guarantee instead of talking about databases first.",
        },
        {
          type: "text",
          value:
            " supplied by the client. Every retry with the same key maps to the same logical payment instead of creating another charge.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 195,
      content: [
        {
          type: "text",
          value:
            "Where would you store that information?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 218,
      content: [
        {
          type: "text",
          value:
            "Inside the payments database together with the payment record. The idempotency key should have a unique constraint so concurrent retries resolve to the same row.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 250,
      content: [
        {
          type: "text",
          value:
            "The payment succeeded, but downstream services never receive the event. What happens?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 272,
      content: [
        {
          type: "text",
          value: "I would first ",
        },
        {
          id: "highlight-separate-state",
          type: "highlight",
          status: "strong",
          value: "separate payment state from event delivery",
          explanation:
            "Correctly distinguishes the external side effect from event propagation. This separation drives the rest of the design.",
        },
        {
          type: "text",
          value:
            ". The payment may already be successful even if another service hasn't observed it yet.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 305,
      content: [
        {
          type: "text",
          value:
            "Interesting. Continue.",
        },
      ],
    },    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 326,
      content: [
        {
          type: "text",
          value:
            "Our payment service shouldn't assume that publishing an event is part of the same atomic operation as updating the database.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 346,
      content: [
        {
          type: "text",
          value:
            "Suppose the database commit succeeds, but the application crashes before publishing to Kafka.",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 371,
      content: [
        {
          type: "text",
          value: "I'd use ",
        },
        {
          id: "highlight-kafka-answer",
          type: "highlight",
          status: "missed",
          value:
            "Kafka because Kafka guarantees delivery and makes everything eventually consistent.",
          explanation:
            "This answer names a technology instead of explaining the failure window. Kafka cannot recover an event that was never published.",
        },
        {
          type: "text",
          value: ".",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 395,
      content: [
        {
          type: "text",
          value:
            "Kafka only guarantees messages after they're written to Kafka. The crash happened before that. What now?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 418,
      content: [
        {
          type: "text",
          value:
            "You're right. There's still a gap between committing the payment and publishing the event.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 437,
      content: [
        {
          type: "text",
          value:
            "Exactly. How do you remove that gap?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 462,
      content: [
        {
          type: "text",
          value:
            "Instead of publishing immediately, I'd insert an event into an ",
        },
        {
          id: "highlight-outbox",
          type: "highlight",
          status: "strong",
          value: "Outbox table",
          explanation:
            "Excellent recovery. The candidate identifies the transactional outbox pattern, eliminating the DB-to-Kafka failure window.",
        },
        {
          type: "text",
          value:
            " inside the same database transaction as the payment record.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 490,
      content: [
        {
          type: "text",
          value:
            "Walk me through that transaction.",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 515,
      content: [
        {
          type: "text",
          value:
            "Within one database transaction I'd write the payment row and the corresponding outbox event together. Either both commit or both roll back.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 540,
      content: [
        {
          type: "text",
          value:
            "How does the event eventually reach Kafka?",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 565,
      content: [
        {
          type: "text",
          value:
            "A separate background ",
        },
        {
          id: "highlight-relay",
          type: "highlight",
          status: "strong",
          value: "relay process",
          explanation:
            "Correctly separates business transactions from event publication. This worker can safely retry forever.",
        },
        {
          type: "text",
          value:
            " continuously scans unpublished outbox records and publishes them to Kafka.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 592,
      content: [
        {
          type: "text",
          value:
            "What if the relay crashes after publishing but before marking the event as processed?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 617,
      content: [
        {
          type: "text",
          value:
            "Then it may publish the same event again after restart.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 632,
      content: [
        {
          type: "text",
          value:
            "Would that break downstream services?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 655,
      content: [
        {
          type: "text",
          value:
            "Not if consumers are ",
        },
        {
          id: "highlight-idempotent-consumer",
          type: "highlight",
          status: "strong",
          value: "idempotent",
          explanation:
            "Excellent. Exactly-once delivery is rarely achievable across distributed systems, so idempotent consumers are the practical solution.",
        },
        {
          type: "text",
          value:
            ". Duplicate events should be harmless because each event carries a unique identifier.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 684,
      content: [
        {
          type: "text",
          value:
            "How would consumers implement that?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 708,
      content: [
        {
          type: "text",
          value:
            "Each consumer stores processed event IDs. If an event arrives again, it's acknowledged but ignored because the side effect has already been applied.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 736,
      content: [
        {
          type: "text",
          value:
            "Good. Now let's discuss failures in external payment gateways.",
        },
      ],
    },    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 760,
      content: [
        {
          type: "text",
          value:
            "The payment gateway is another unreliable distributed system, so every interaction with it has to be treated as potentially failing.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 781,
      content: [
        {
          type: "text",
          value:
            "Suppose the gateway times out. What do you do?",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 806,
      content: [
        {
          type: "text",
          value:
            "First I'd determine whether the timeout happened before or after the gateway actually processed the request. If that isn't immediately knowable, I'd avoid blindly issuing another charge.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 835,
      content: [
        {
          type: "text",
          value:
            "So how do retries work?",
        },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 861,
      content: [
        {
          type: "text",
          value:
            "Retries should always reuse the same ",
        },
        {
          id: "highlight-retry-idempotency",
          type: "highlight",
          status: "strong",
          value: "idempotency key",
          explanation:
            "Excellent. Safe retries come from identifying the logical operation rather than creating a brand-new payment request.",
        },
        {
          type: "text",
          value:
            ". The gateway either returns the previous result or safely processes the request once.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 891,
      content: [
        {
          type: "text",
          value:
            "Would you retry forever?",
        },
      ],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 913,
      content: [
        {
          type: "text",
          value:
            "No. I'd use exponential backoff with jitter and eventually move requests requiring manual investigation into a recovery workflow.",
        },
      ],
    },

    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 941,
      content: [
        {
          type: "text",
          value:
            "The gateway starts failing for everyone. What prevents your service from making things worse?",
        },
      ],
    },

    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 968,
      content: [
        {
          type: "text",
          value:
            "I'd protect the gateway using a ",
        },
        {
          id: "highlight-circuit-breaker",
          type: "highlight",
          status: "strong",
          value: "circuit breaker",
          explanation:
            "Good operational thinking. Continuing to send requests to an unhealthy dependency only amplifies failures.",
        },
        {
          type: "text",
          value:
            ". When failures exceed a threshold we temporarily stop sending traffic and fail fast.",
        },
      ],
    },

    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 996,
      content: [
        {
          type: "text",
          value:
            "Eventually the gateway recovers. How do you verify your database still matches reality?",
        },
      ],
    },

    {
      id: "44",
      role: "candidate",
      elapsedSeconds: 1025,
      content: [
        {
          type: "text",
          value:
            "I'd run a scheduled reconciliation job comparing our payment records against the gateway's authoritative ledger.",
        },
      ],
    },

    {
      id: "45",
      role: "interviewer",
      elapsedSeconds: 1053,
      content: [
        {
          type: "text",
          value:
            "Why isn't eventual consistency enough?",
        },
      ],
    },

    {
      id: "46",
      role: "candidate",
      elapsedSeconds: 1078,
      content: [
        {
          type: "text",
          value:
            "Because infrastructure bugs, software defects and operator mistakes still happen. Reconciliation provides a safety net that discovers mismatches nobody anticipated.",
        },
      ],
    },

    {
      id: "47",
      role: "interviewer",
      elapsedSeconds: 1109,
      content: [
        {
          type: "text",
          value:
            "Good. Last question—how would you scale this architecture?",
        },
      ],
    },

    {
      id: "48",
      role: "candidate",
      elapsedSeconds: 1136,
      content: [
        {
          type: "text",
          value:
            "Payment requests are stateless, so API servers scale horizontally behind a load balancer. Kafka partitions distribute downstream processing, databases shard by merchant or payment ID, and consumers remain idempotent so scaling doesn't change correctness.",
        },
      ],
    },

    {
      id: "49",
      role: "takeaway",
      elapsedSeconds: 1165,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Design for failure first. Idempotency protects clients, the transactional outbox closes the database-to-Kafka gap, idempotent consumers tolerate duplicates, and reconciliation catches the failures you didn't predict.",
        },
      ],
    },
  ],
};

const paymentSystem: TranscriptEntry = {
  summary: {
    slug: "payment-system",
    title: "Design a Payment System",
    category: "hld",
    difficulty: Difficulty.HARD,
    duration: 45,
    company: "Stripe",
    tags: [
      "Kafka",
      "Distributed Systems",
      "Payments",
      "Outbox",
      "Idempotency",
      "Consistency",
    ],
    description:
      "Production-grade HLD interview covering payment processing, retries, transactional outbox, reconciliation, and distributed consistency.",
  },

  transcript,
};

export default paymentSystem;