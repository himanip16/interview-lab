
import { Difficulty } from "@prisma/client";
import { TranscriptEntry } from "../types";

import { TranscriptData } from "@/features/library/types/transcript";


const transcript: TranscriptData = {
  metadata: {
    title: "Design a Reliable Webhook Delivery Platform",
    difficulty: Difficulty.MEDIUM,
    duration: 45,
    template: "Machine Coding",
    category: "Machine Coding",
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
            "Let's start with the take-home. Could you walk me through your webhook delivery system and the major design decisions you made?",
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
            "Sure. The system lets customers register webhook endpoints, publish events, and reliably deliver those events to subscribed endpoints. I built it in Python using FastAPI with SQLite as the persistence layer. The API stores delivery records, while a separate worker process is responsible for actually sending HTTP requests.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 48,
      content: [
        {
          type: "text",
          value:
            "Why SQLite? Most production webhook systems wouldn't choose that.",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 70,
      content: [
        {
          type: "text",
          value:
            "Mostly because it was a take-home assignment. I wanted something with zero setup so the reviewer could clone the project and run it immediately. SQLite was perfectly adequate for demonstrating persistence, retries and scheduling without introducing infrastructure complexity.",
        },
        {
          id: "highlight-sqlite-tradeoff",
          type: "highlight",
          status: "strong",
          value: "Optimized for simplicity in the interview, not production.",
          explanation:
            "Explains that technology choices should match constraints instead of blindly optimizing for scale.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 110,
      content: [
        {
          type: "text",
          value:
            "Suppose you were taking this into production. What changes first?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 135,
      content: [
        {
          type: "text",
          value:
            "I'd replace SQLite with Postgres, move scheduling onto a durable queue like SQS or Kafka depending on throughput requirements, run multiple workers behind a queue instead of polling a database, and add metrics, distributed tracing and monitoring around delivery success rates.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 178,
      content: [
        {
          type: "text",
          value:
            "Can you explain how deliveries actually happen after someone publishes an event?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 202,
      content: [
        {
          type: "text",
          value:
            "Publishing an event only persists delivery records. The API never waits for outbound webhook requests. Instead, a separate worker continuously polls for pending deliveries, sends the HTTP request, and updates the delivery status depending on the response.",
        },
        {
          id: "highlight-worker-separation",
          type: "highlight",
          status: "strong",
          value: "Separate API from delivery workers.",
          explanation:
            "Separating request ingestion from execution improves latency, scalability and resilience.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 248,
      content: [
        {
          type: "text",
          value:
            "What happens if the customer's endpoint returns a 503 or simply times out?",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 272,
      content: [
        {
          type: "text",
          value:
            "The worker marks the attempt as failed, increments the retry count and schedules another attempt using exponential backoff. Temporary failures shouldn't immediately cause permanent delivery failures.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 310,
      content: [
        {
          type: "text",
          value:
            "Why exponential backoff instead of retrying every few seconds?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 332,
      content: [
        {
          type: "text",
          value:
            "If an endpoint is unhealthy, retrying aggressively only increases load on an already struggling service. Exponential backoff gives it time to recover while reducing unnecessary traffic from our side.",
        },
        {
          id: "highlight-backoff",
          type: "highlight",
          status: "strong",
          value: "Exponential backoff avoids retry storms.",
          explanation:
            "Correctly identifies that retries themselves can become part of the outage if they're too aggressive.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 376,
      content: [
        {
          type: "text",
          value:
            "Do retries continue forever?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 392,
      content: [
        {
          type: "text",
          value:
            "No. I capped retries. After the maximum number of attempts, the delivery is marked permanently failed and moved to a dead-letter queue so it can be inspected later instead of disappearing silently.",
        },
        {
          id: "highlight-dlq",
          type: "highlight",
          status: "strong",
          value: "Dead-letter queue for permanent failures.",
          explanation:
            "Shows failures remain observable instead of being dropped.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 438,
      content: [
        {
          type: "text",
          value:
            "I noticed you also implemented a circuit breaker. Tell me about that.",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 462,
      content: [
        {
          type: "text",
          value:
            "I tracked consecutive failures for a destination endpoint. After ten failures in a row, the worker temporarily stopped attempting deliveries for that endpoint. That prevents wasting worker capacity repeatedly calling an endpoint that's clearly unhealthy.",
        },
        {
          id: "highlight-circuit-breaker",
          type: "highlight",
          status: "strong",
          value: "Circuit breaker after 10 consecutive failures.",
          explanation:
            "Protects both the worker fleet and downstream services during sustained outages.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 510,
      content: [
        {
          type: "text",
          value:
            "How long did you spend on the assignment?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 525,
      content: [
        {
          type: "text",
          value:
            "Roughly six hours, which honestly felt longer than I expected for a take-home. But the instructions specifically said they cared more about clean architecture and tests than feature completeness, so I spent most of my time making the design modular and writing tests instead of chasing every possible feature.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 565,
      content: [
        {
          type: "text",
          value:
            "Makes sense. Let's extend the implementation a little.",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 575,
      content: [
        {
          type: "text",
          value: "Sounds good.",
        },
      ],
    },
        {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 600,
      content: [
        {
          type: "text",
          value:
            "I'd like to extend the system a little. Right now anyone could POST to a customer's webhook endpoint pretending to be your service. How would you solve that?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 626,
      content: [
        {
          type: "text",
          value:
            "I'd implement HMAC request signing. Every webhook endpoint would have its own shared secret. Before sending a delivery, we'd compute an HMAC over the payload using that secret and include the signature in an HTTP header. The receiving application recomputes the signature locally and rejects the request if they don't match.",
        },
        {
          id: "highlight-hmac",
          type: "highlight",
          status: "strong",
          value: "Per-endpoint HMAC signatures.",
          explanation:
            "Authenticates webhook requests and detects payload tampering without transmitting secrets.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 676,
      content: [
        {
          type: "text",
          value:
            "Would every endpoint share the same secret?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 692,
      content: [
        {
          type: "text",
          value:
            "No. Each registered webhook endpoint should own an independent secret. Compromising one customer shouldn't invalidate the authenticity guarantees for everyone else.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 720,
      content: [
        {
          type: "text",
          value:
            "Good. The next feature I want is event filtering. Right now every endpoint receives every event.",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 742,
      content: [
        {
          type: "text",
          value:
            "I'd allow endpoints to register the specific event types they're interested in. When an event is published, the system only creates delivery records for matching subscriptions instead of broadcasting to everyone.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 782,
      content: [
        {
          type: "text",
          value:
            "Would you filter inside the worker or before creating deliveries?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 804,
      content: [
        {
          type: "text",
          value:
            "I'd filter before creating delivery records. Otherwise we'd generate unnecessary work only to discard it later. The worker should only process deliveries that genuinely need to be sent.",
        },
        {
          id: "highlight-filtering",
          type: "highlight",
          status: "strong",
          value: "Filter before enqueueing work.",
          explanation:
            "Avoids unnecessary database writes, queue entries and worker execution.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 846,
      content: [
        {
          type: "text",
          value:
            "Anything else you'd improve if this became a production service?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 868,
      content: [
        {
          type: "text",
          value:
            "I'd expose delivery history APIs, replay failed deliveries, add observability around retry rates and queue depth, implement idempotency identifiers, rate limiting per endpoint, payload compression for large events, and structured logging with trace IDs.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 914,
      content: [
        {
          type: "text",
          value:
            "Suppose your worker crashes immediately after making the HTTP request. What guarantees can you provide to the customer?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 936,
      content: [
        {
          type: "text",
          value:
            "The system provides at-least-once delivery rather than exactly-once delivery. If the worker crashes before persisting success, another worker may retry the delivery. That's why consumers should treat webhook deliveries as idempotent using an event ID or delivery ID.",
        },
        {
          id: "highlight-at-least-once",
          type: "highlight",
          status: "strong",
          value: "At-least-once delivery with idempotent consumers.",
          explanation:
            "Exactly-once delivery over HTTP isn't generally achievable; idempotency is the practical solution.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 990,
      content: [
        {
          type: "text",
          value:
            "Right. Let's look at something a little more subtle in your implementation.",
        },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 1002,
      content: [
        {
          type: "text",
          value:
            "Sure.",
        },
      ],
    },
        {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 1028,
      content: [
        {
          type: "text",
          value:
            "Suppose your worker picks up a delivery, marks it as IN_PROGRESS, sends the webhook, and then crashes before updating the database. What happens to that delivery?",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 1058,
      content: [
        {
          type: "text",
          value:
            "My first thought was that another worker would eventually retry it, but looking closer... it actually wouldn't. Every worker ignores deliveries marked IN_PROGRESS, so if the original worker dies, that record stays stuck forever.",
        },
        {
          id: "highlight-stuck-delivery",
          type: "highlight",
          status: "missed",
          value: "",
          explanation:
            "The implementation assumes workers always finish. A worker crash leaves deliveries permanently stuck because ownership is never released.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 1102,
      content: [
        {
          type: "text",
          value:
            "Exactly. How would you fix that without allowing two workers to process the same delivery at once?",
        },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 1130,
      content: [
        {
          type: "text",
          value:
            "Instead of permanently owning a delivery, the worker should acquire it using a lease. When claiming work, it stores a lease expiration timestamp. Other workers ignore the delivery while the lease is valid.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 1166,
      content: [
        {
          type: "text",
          value:
            "And what happens if that worker crashes?",
        },
      ],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 1182,
      content: [
        {
          type: "text",
          value:
            "Once the lease expires, another worker can safely assume the original worker is gone. It reclaims ownership, marks the delivery back to PENDING or acquires a new lease, and retries the webhook.",
        },
        {
          id: "highlight-lease",
          type: "highlight",
          status: "strong",
          value: "Lease-based ownership instead of permanent ownership.",
          explanation:
            "Leases recover automatically from worker crashes by allowing abandoned work to become visible again after a timeout.",
        },
      ],
    },

    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 1225,
      content: [
        {
          type: "text",
          value:
            "Wouldn't there still be situations where two workers both send the webhook?",
        },
      ],
    },

    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 1248,
      content: [
        {
          type: "text",
          value:
            "Yes. If a worker completes the HTTP request but crashes before recording success, another worker may retry after the lease expires. That's why I'd still document the system as providing at-least-once delivery and require consumers to process deliveries idempotently using the delivery ID or event ID.",
        },
      ],
    },

    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 1296,
      content: [
        {
          type: "text",
          value:
            "Good. Anything you took away from implementing this project?",
        },
      ],
    },

    {
      id: "44",
      role: "candidate",
      elapsedSeconds: 1315,
      content: [
        {
          type: "text",
          value:
            "The biggest lesson for me was that reliability isn't only about retrying failed HTTP requests. You also have to think about failures inside your own workers. I had implemented retries, exponential backoff, circuit breaking and a dead-letter queue, but I completely missed the case where the worker itself disappears while holding work. The lease approach was something I genuinely learned during the discussion, and it's a pattern I'd use in the future.",
        },
      ],
    },

    {
      id: "45",
      role: "takeaway",
      elapsedSeconds: 1360,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Build asynchronous webhook delivery around durable persistence, independent workers and at-least-once delivery semantics. Temporary failures should be handled with exponential backoff, repeated failures isolated with circuit breakers, and permanently failed deliveries retained in a dead-letter queue for inspection. Security comes from per-endpoint HMAC signatures, efficiency from filtering events before creating deliveries, and robustness from lease-based worker ownership so abandoned work is automatically recovered after crashes. Most importantly, reliability includes handling failures in your own infrastructure—not just failures of downstream services.",
        },
      ],
    },
  ],
};

const webhookDeliveryPlatform: TranscriptEntry = {
  summary: {
    slug: "webhook-delivery-platform",
    title: "Design a Reliable Webhook Delivery Platform",
    category: "machine-coding",
    difficulty: Difficulty.MEDIUM,
    duration: 45,
    company: "OpenAI",
    tags: [
      "Machine Coding",
      "Webhooks",
      "FastAPI",
      "Retries",
      "Exponential Backoff",
      "Circuit Breaker",
      "Dead Letter Queue",
      "HMAC",
      "Lease-Based Processing",
      "Distributed Systems",
    ],
    description:
      "Machine coding interview covering reliable webhook delivery, asynchronous workers, retry strategies, exponential backoff, dead-letter queues, HMAC request signing, event filtering, circuit breakers, worker crash recovery using leases, and the trade-offs behind at-least-once delivery.",
  },

  transcript,
};

export default webhookDeliveryPlatform;