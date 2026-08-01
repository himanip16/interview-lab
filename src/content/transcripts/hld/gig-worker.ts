// src/content/transcripts/system-design/gig-worker-identity-verification-platform.ts

import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Gig Worker Identity Verification Platform — High-Level Design",
    difficulty: Difficulty.HARD,
    duration: 60,
    template: "System Design",
    category: "hld",
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
            "Design a service that collects gig-worker data from platforms like Swiggy, Zomato, Ola, Uber, and Rapido, verifies each worker's PAN and identity, and serves that verified data back to companies that request it — with a way for those companies to pay for access. Take it wherever you want.",
        },
      ],
    },
    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 25,
      content: [
        {
          type: "text",
          value:
            "Let me drive the requirements gathering before I sketch anything. Functionally: platforms push worker data to us when someone onboards — name, PAN, maybe Aadhaar or a photo for KYC. We verify that identity against some authoritative source. Requesting companies — could be a background-check company, an insurer, another gig platform doing due diligence — query us for a worker's verified status. And there's billing: those companies pay per query or on some subscription, so we need usage metering tied to payment.",
        },
        {
          id: "highlight-drives-requirements",
          type: "highlight",
          status: "strong",
          value: "Proactively lays out functional requirements without waiting to be prompted",
          explanation:
            "Candidate takes ownership of framing the problem from the first response instead of asking the interviewer to enumerate requirements one at a time — sets the tone for the rest of the round.",
        },
      ],
    },
    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 55,
      content: [
        {
          type: "text",
          value: "Good. What's missing — what would you ask me before locking that in?",
        },
      ],
    },
    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 80,
      content: [
        {
          type: "text",
          value:
            "Can one worker be onboarded by more than one platform — someone driving for Ola and also delivering for Zomato? If so, do we treat that as one canonical worker record or separate ones per platform? And is verification a one-time check, or does it need periodic re-verification, since PAN status or fraud flags can change over time?",
        },
      ],
    },
    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 100,
      content: [
        {
          type: "text",
          value:
            "Same worker can appear across multiple platforms — treat that as one canonical identity. And yes, periodic re-verification matters, though don't over-index on it, focus on the core flow first.",
        },
      ],
    },
    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 125,
      content: [
        {
          type: "text",
          value:
            "That cross-platform overlap is actually the crux of the hard part here — it means identity has to be deduplicated on something stable, like the PAN itself, not on a platform-specific worker ID. Now non-functional requirements: scale to hundreds of millions of workers and presumably a much larger number of read queries from requesting companies. Strong consistency matters specifically for the 'is this person verified' flag — I don't want two platforms getting different answers for the same PAN. Availability matters more than perfect real-time freshness for reads. And this is sensitive PII plus a government ID, so security and compliance are first-class, not an afterthought.",
        },
        {
          id: "highlight-nfr-prioritization",
          type: "highlight",
          status: "strong",
          value: "States non-functional requirements with explicit priority reasoning, not just a list",
          explanation:
            "Rather than listing 'scalability, consistency, availability, security' generically, candidate explains which consistency matters most (verification status specifically) and why availability can be favored over freshness elsewhere.",
        },
      ],
    },
    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 160,
      content: [
        {
          type: "text",
          value: "Good. Lay out the components.",
        },
      ],
    },
    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 220,
      content: [
        {
          type: "whiteboard",
          value:
            "<svg viewBox=\"0 0 800 420\" xmlns=\"http://www.w3.org/2000/svg\" font-family=\"sans-serif\" font-size=\"13\"><rect x=\"20\" y=\"20\" width=\"150\" height=\"50\" rx=\"6\" fill=\"none\" stroke=\"currentColor\"/><text x=\"35\" y=\"50\">Platform Adapters</text><rect x=\"220\" y=\"20\" width=\"150\" height=\"50\" rx=\"6\" fill=\"none\" stroke=\"currentColor\"/><text x=\"255\" y=\"50\">Ingestion Queue</text><rect x=\"420\" y=\"20\" width=\"170\" height=\"50\" rx=\"6\" fill=\"none\" stroke=\"currentColor\"/><text x=\"440\" y=\"50\">Verification Worker</text><rect x=\"420\" y=\"120\" width=\"170\" height=\"50\" rx=\"6\" fill=\"none\" stroke=\"currentColor\"/><text x=\"455\" y=\"150\">KYC / PAN API</text><rect x=\"220\" y=\"220\" width=\"170\" height=\"50\" rx=\"6\" fill=\"none\" stroke=\"currentColor\"/><text x=\"245\" y=\"250\">Worker Identity DB</text><rect x=\"460\" y=\"220\" width=\"170\" height=\"50\" rx=\"6\" fill=\"none\" stroke=\"currentColor\"/><text x=\"480\" y=\"250\">Cache Layer</text><rect x=\"340\" y=\"320\" width=\"170\" height=\"50\" rx=\"6\" fill=\"none\" stroke=\"currentColor\"/><text x=\"365\" y=\"350\">Query API Gateway</text><rect x=\"580\" y=\"320\" width=\"170\" height=\"50\" rx=\"6\" fill=\"none\" stroke=\"currentColor\"/><text x=\"605\" y=\"350\">Billing / Metering</text><line x1=\"170\" y1=\"45\" x2=\"220\" y2=\"45\" stroke=\"currentColor\"/><line x1=\"370\" y1=\"45\" x2=\"420\" y2=\"45\" stroke=\"currentColor\"/><line x1=\"505\" y1=\"70\" x2=\"505\" y2=\"120\" stroke=\"currentColor\"/><line x1=\"420\" y1=\"145\" x2=\"390\" y2=\"245\" stroke=\"currentColor\"/><line x1=\"390\" y1=\"270\" x2=\"460\" y2=\"245\" stroke=\"currentColor\"/><line x1=\"305\" y1=\"270\" x2=\"400\" y2=\"320\" stroke=\"currentColor\"/><line x1=\"545\" y1=\"270\" x2=\"420\" y2=\"320\" stroke=\"currentColor\"/><line x1=\"510\" y1=\"345\" x2=\"580\" y2=\"345\" stroke=\"currentColor\"/></svg>",
          caption:
            "Ingestion (adapters → queue → verification worker → KYC API) feeds a canonical Worker DB; reads go through cache-backed Query API Gateway; usage metered into Billing",
        },
        {
          type: "text",
          value:
            "Left to right on the write path: platform-specific adapters normalize each source's payload into a common schema, push onto a queue so ingestion is async and platforms don't wait on us. A verification worker pool consumes the queue, calls the KYC/PAN verification API, writes results to a canonical Worker Identity DB. On the read path: requesting companies hit a Query API Gateway, which checks a cache before hitting the DB, and every call gets metered for billing.",
        },
      ],
    },
    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 260,
      content: [
        {
          type: "text",
          value:
            "You said 'canonical Worker Identity DB' twice now. What's actually the primary key, given the same person can show up from five different platforms?",
        },
      ],
    },
    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 290,
      content: [
        {
          type: "text",
          value:
            "The PAN itself — or more precisely, a hash of the normalized PAN, since I don't want the raw PAN sitting in an index. When a new onboarding event comes in from any platform, I look up by PAN hash first. If a canonical worker already exists for that hash, I just link the new platform association to the existing record and skip re-verification entirely. If it doesn't exist, that's a new worker, and it goes through the KYC flow.",
        },
        {
          id: "highlight-pan-hash-key",
          type: "highlight",
          status: "strong",
          value: "Uses hashed PAN as the deduplication key across platforms",
          explanation:
            "Directly answers the cross-platform identity problem raised earlier — PAN hash, not a platform-specific worker ID, is what makes 'one canonical identity' actually enforceable.",
        },
      ],
    },
    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 320,
      content: [
        {
          type: "text",
          value:
            "Two platforms submit the same new worker's PAN within the same second — Swiggy and Zomato onboard them almost simultaneously. Walk me through what happens.",
        },
      ],
    },
    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 355,
      content: [
        {
          type: "text",
          value:
            "That's exactly the idempotency risk. Both events land on the queue, both consumers do a lookup by PAN hash, both find nothing, and naively both would kick off a KYC verification call — which is wasteful since that API almost certainly costs money per call, and worse, could create two conflicting worker records. I'd handle it with a unique constraint on PAN hash in the database and an INSERT ... ON CONFLICT DO NOTHING pattern — whichever consumer's insert lands first wins and proceeds to verification, the second one's insert fails the uniqueness check, and that consumer just links its platform association to the row that already exists instead of starting a second verification.",
        },
        {
          id: "highlight-idempotent-dedupe",
          type: "highlight",
          status: "strong",
          value: "Uses a DB uniqueness constraint as the source of truth for the race, not application-level locking",
          explanation:
            "This is the idempotency question the interviewer specifically flagged as a probe target. Candidate pushes the race resolution down to the database's atomic constraint rather than trying to coordinate it in application code, which is the more robust answer under concurrent writers.",
        },
      ],
    },
    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 390,
      content: [
        {
          type: "text",
          value: "What if the KYC API call itself fails halfway — timeout, and you don't know if it actually succeeded?",
        },
      ],
    },
    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 420,
      content: [
        {
          type: "text",
          value:
            "I'd make the verification worker itself idempotent against retries — before calling the KYC API, write a row with status PENDING and a request ID. On timeout, don't blindly retry with a new call; first check status. If a third-party KYC provider supports idempotency keys on their side too, pass the same request ID so a retry doesn't trigger a duplicate billable check on their end. If they don't support that, I'd query their status-check endpoint first, if one exists, before assuming failure and retrying fresh.",
        },
        {
          id: "highlight-external-api-idempotency",
          type: "highlight",
          status: "strong",
          value: "Extends idempotency thinking to the external KYC provider call, not just the internal write",
          explanation:
            "Good instinct to treat the third-party call as a second place idempotency can break, and to distinguish the case where the provider supports idempotency keys from the case where it doesn't.",
        },
      ],
    },
    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 450,
      content: [
        {
          type: "text",
          value: "Now the read side. Hundreds of millions of workers, and companies querying constantly. Design that.",
        },
      ],
    },
    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 490,
      content: [
        {
          type: "text",
          value:
            "The Worker Identity DB gets sharded — PAN hash is already a good, evenly-distributed shard key since it's cryptographic output, so consistent hashing across shards avoids hotspotting on any one shard. Each shard has read replicas, since read volume from requesting companies is going to dwarf write volume from onboarding events by a large margin. In front of that, a cache — Redis, keyed by PAN hash — for verification status specifically, since that's the field queried far more than anything else and it changes rarely once set.",
        },
      ],
    },
    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 520,
      content: [
        {
          type: "text",
          value: "Cache invalidation — worker's status gets revoked after a fraud flag. How does the cache find out?",
        },
      ],
    },
    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 550,
      content: [
        {
          type: "text",
          value:
            "Write-through, not write-behind — when the DB record updates, the same transaction path also invalidates or updates the cache entry, rather than relying on a TTL alone to eventually catch it. I'd still keep a short TTL as a safety net — say a few minutes — in case an invalidation message gets dropped, so the system self-heals even if the write-through path has a gap, rather than trusting invalidation to be perfect.",
        },
        {
          id: "highlight-cache-invalidation-safety-net",
          type: "highlight",
          status: "strong",
          value: "Combines write-through invalidation with a TTL safety net instead of relying on either alone",
          explanation:
            "For a fraud/status-revocation field specifically, stale cache data has real consequences — candidate doesn't trust invalidation messaging alone and layers a bounded staleness guarantee underneath it.",
        },
      ],
    },
    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 580,
      content: [
        {
          type: "text",
          value: "APIs. Give me the shape of the request and response for a requesting company's query.",
        },
      ],
    },
    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 630,
      content: [
        {
          type: "code",
          language: "text",
          value:
            "GET /v1/workers/verification-status?pan_hash={hash}\nAuthorization: Bearer {company_api_key}\n\n200 OK\n{\n  \"pan_hash\": \"...\",\n  \"verified\": true,\n  \"verified_at\": \"2026-03-11T10:22:00Z\",\n  \"risk_flags\": [],\n  \"masked_pan\": \"XXXXX1234F\"\n}\n\n404 Not Found  -- worker unknown to the platform\n202 Accepted   -- verification still pending, poll or use webhook",
        },
        {
          type: "text",
          value:
            "The requesting company sends a PAN hash they compute themselves with our published hash function — they shouldn't need to send us the raw PAN if they already have it, which limits how much raw PII flows over this API. I return a masked PAN, never the full one, and a risk_flags array so this is extensible without a breaking schema change later. A 202 for pending status matters because verification is async — a company might query before our KYC worker has finished.",
        },
        {
          id: "highlight-pan-hash-in-transit",
          type: "highlight",
          status: "strong",
          value: "Minimizes raw PAN exposure in the query API by having callers send a pre-computed hash",
          explanation:
            "A concrete security-by-design choice: the query contract itself avoids transmitting the sensitive raw identifier where it isn't strictly necessary, rather than relying only on transport encryption.",
        },
      ],
    },
    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 665,
      content: [
        {
          type: "text",
          value: "Now the payment piece. How does billing actually work end to end?",
        },
      ],
    },
    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 710,
      content: [
        {
          type: "text",
          value:
            "Every request through the Query API Gateway carries the company's API key, and the gateway emits a usage event — company ID, endpoint, timestamp — onto its own queue, separate from the ingestion queue so billing load never competes with the verification pipeline. A metering service aggregates those events per company per billing period into a usage table. At period close, that feeds an invoice generation job which either charges a stored payment method through a payment gateway for pay-per-query customers, or just records usage against a flat subscription cap for others. I'd also want real-time quota enforcement at the gateway itself — reject or throttle once a company exceeds their plan's quota — rather than only finding out about overage at billing time.",
        },
        {
          id: "highlight-billing-separation",
          type: "highlight",
          status: "strong",
          value: "Isolates billing's usage-event queue from the verification pipeline's queue",
          explanation:
            "Prevents a billing traffic spike or backlog from ever backpressuring the actual identity-verification critical path — a real production separation-of-concerns decision, not just 'add a billing service'.",
        },
      ],
    },
    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 745,
      content: [
        {
          type: "text",
          value: "Real-time quota enforcement at the gateway, at this scale — how, without it becoming a bottleneck itself?",
        },
      ],
    },
    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 780,
      content: [
        {
          type: "text",
          value:
            "Per-company counters in a fast in-memory store like Redis, using something like a sliding-window or token-bucket counter keyed by API key, incremented on each request with a short expiry aligned to the plan's rate window. That's a single fast operation per request, not a database read, so it doesn't add meaningful latency. The counter doesn't need to be perfectly exact across every gateway instance in a multi-region setup — slight over-allowance during a race is an acceptable trade-off for not adding a synchronous cross-region consistency check on every single request.",
        },
        {
          id: "highlight-quota-tradeoff",
          type: "highlight",
          status: "strong",
          value: "Accepts approximate quota enforcement as a deliberate trade-off against added per-request latency",
          explanation:
            "Rather than chasing perfect global accuracy, candidate names the trade-off explicitly and picks the side that keeps the hot path fast — appropriate for a rate limiter, where slight overshoot is low-cost compared to added latency on every request.",
        },
      ],
    },
    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 815,
      content: [
        {
          type: "text",
          value: "Anything about this design that worries you, that we haven't talked about?",
        },
      ],
    },
    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 850,
      content: [
        {
          type: "text",
          value:
            "Data retention and right-to-erasure — if a worker leaves the gig economy entirely or a platform relationship ends, how long do we keep their verified identity data, and can they request deletion? That's a compliance question I don't have a full answer to without knowing the regulatory framework we're operating under, but I'd want a data retention policy and a deletion path baked into the schema from day one — a deleted_at or retention-expiry field on the canonical record — rather than bolting it on after the fact, since retrofitting deletion into a live PII system is much harder than designing for it upfront.",
        },
        {
          id: "highlight-retention-honesty",
          type: "highlight",
          status: "strong",
          value: "Raises data retention and deletion as an open concern instead of only presenting a finished design",
          explanation:
            "Candidate flags a real gap honestly rather than pretending the design is complete, and explains specifically why retrofitting deletion later is costlier than designing for it now — this is the kind of self-critique interviewers usually have to drag out of candidates.",
        },
      ],
    },
    {
      id: "27",
      role: "takeaway",
      elapsedSeconds: 890,
      content: [
        {
          type: "text",
          value:
            "Takeaway: this round rewards driving the conversation, and the candidate does that from the first response — functional and non-functional requirements are laid out proactively, with reasoning for why verification-status consistency matters more than read freshness, before the interviewer has to ask. The two probe areas the interviewer specifically targeted both get concrete, defensible answers: idempotent, consistent identity verification is solved by hashing the PAN as the canonical dedup key and pushing the concurrent-onboarding race down to a database uniqueness constraint rather than application-level coordination, and extended further to the third-party KYC call itself, not just the internal write. Read scaling to hundreds of millions relies on PAN-hash sharding (already well-distributed since it's a hash), read replicas, and a Redis cache with write-through invalidation backed by a TTL safety net for a field — fraud/status revocation — where staleness has real consequences. The billing design deliberately isolates its usage-event queue from the verification pipeline so billing load can never backpressure identity verification, and quota enforcement at the gateway trades small, bounded over-allowance for avoiding a synchronous cross-region consistency check on every request. The strongest single moment is the unprompted retention/deletion concern at the end — naming a real compliance gap and why it needs to be designed in from day one, rather than presenting the design as finished.",
        },
      ],
    },
  ],
};

const gigWorkerIdentityVerificationPlatform: TranscriptEntry = {
  summary: {    id: 39,

    slug: "gig-worker-identity-verification-platform",
    title: "Gig Worker Identity Verification Platform — High-Level Design",
    category: "hld",
    difficulty: Difficulty.HARD,
    duration: 60,
    tags: [
      "System Design",
      "Idempotency",
      "Consistency",
      "Sharding",
      "Caching",
      "API Design",
      "Billing",
      "Security",
    ],
    description:
      "60-minute whiteboard-format HLD round: design a service that ingests gig-worker data from multiple platforms (Swiggy, Zomato, Ola, Uber, Rapido), verifies PAN/identity, serves verified status back to paying requesting companies, and handles billing/metering. Candidate proactively drives functional and non-functional requirements gathering rather than waiting to be prompted. Identity is deduplicated across platforms using a hashed PAN as the canonical key; the concurrent-onboarding race (two platforms submitting the same new worker near-simultaneously) is resolved with a database uniqueness constraint rather than application-level locking, and idempotency thinking is extended to the third-party KYC provider call itself. Read scaling to hundreds of millions relies on PAN-hash sharding, read replicas, and a Redis cache using write-through invalidation plus a TTL safety net for the fraud/status-revocation field specifically. Query API design minimizes raw PAN exposure by having callers send a pre-computed hash. Billing isolates its usage-event queue from the verification pipeline, and gateway-level quota enforcement deliberately trades small bounded over-allowance for avoiding synchronous cross-region consistency checks. Closes with the candidate unprompted raising data retention and right-to-erasure as an open design concern.",
  },

  transcript,
};

export default gigWorkerIdentityVerificationPlatform;