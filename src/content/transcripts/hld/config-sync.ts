// src/content/transcripts/hld/config-sync.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Design a Multi-Device Configuration Sync Platform",
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
            "Let's design the system that migrates a customer's settings from an old device to a new one — think an old Echo to a new Echo, or an old Kindle to a new Kindle.",
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
          value: "Happy to start with a few clarifying questions.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 26,
      content: [{ type: "text", value: "Go ahead." }],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 44,
      content: [
        {
          type: "text",
          value:
            "What counts as 'configuration' here — just app preferences, or things like WiFi credentials and account tokens too?",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 62,
      content: [
        {
          type: "text",
          value:
            "Both. WiFi credentials, auth tokens, skill or app settings, and general device preferences.",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 84,
      content: [
        {
          type: "text",
          value:
            "And is the old and new device always the same firmware version, or can someone migrate from a three-year-old device to a brand new one?",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 105,
      content: [
        {
          type: "text",
          value:
            "Definitely not the same version. Assume the old device could be running software from years ago.",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 128,
      content: [
        {
          type: "text",
          value:
            "Okay. Functionally then: read a config off an old device, transform it so it's meaningful to a newer device, transfer it securely, and apply it on the new device — including large payloads like downloaded content, not just small settings.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 152,
      content: [
        {
          type: "text",
          value:
            "Right. And non-functionally — this has to hold up on a product launch day, when a huge wave of people set up new devices at once, and it can never leak a WiFi password.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 178,
      content: [
        {
          type: "text",
          value:
            "Got it — so availability under a traffic spike, and confidentiality of sensitive fields, are both first-class Requirements, not afterthoughts. Let me sketch something simple first.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 200,
      content: [{ type: "text", value: "Go for it." }],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 224,
      content: [
        {
          type: "text",
          value:
            "Old device serializes its full config into a blob and uploads it to a Sync Service, which stores it. The customer's companion app links the new device to that same account, the new device pulls the blob down, and applies it directly.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 252,
      content: [
        {
          type: "text",
          value:
            "The old device is running firmware from three years ago — config schema v1.2. The new device only understands schema v2.0. What happens when it applies that blob directly?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 280,
      content: [
        {
          type: "text",
          value:
            "It'd either choke on fields it doesn't recognize, or worse, silently misinterpret a field that changed meaning between versions. Let me think — I could have the new device check the version and branch its parsing logic depending on which version it sees.",
        },
        {
          id: "highlight-if-else-schema",
          type: "highlight",
          status: "missed",
          value: "",
          explanation:
            "Branching on every historical schema version inside the device's own parsing logic doesn't scale — every device model would need to carry parsing logic for every version that ever shipped, forever.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 308,
      content: [
        {
          type: "text",
          value:
            "You said the old device could be years old. Now imagine ten schema versions from now — every new device model has to know how to parse v1.0 through v2.0 forever?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 335,
      content: [
        {
          type: "text",
          value:
            "Right, that doesn't scale — the parsing burden grows with every version we ever ship, and it lives on the device, which is the hardest place to update. The transformation shouldn't be the new device's job at all.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 360,
      content: [{ type: "text", value: "Whose job should it be?" }],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 388,
      content: [
        { type: "text", value: "I'd put a " },
        {
          id: "highlight-transformer-engine",
          type: "highlight",
          status: "strong",
          value: "stateless transformer engine",
          explanation:
            "Correctly moves schema translation out of the device and into a central, statelessly-scalable service, and frames it as a chain of small migrations rather than a single all-versions mapping.",
        },
        {
          type: "text",
          value:
            " in the Sync Service itself. Each schema version only needs a small migration function to the next version — v1.2 to v1.3, v1.3 to v1.4, and so on. Given any input version, the engine walks that chain up to whatever version the target device needs.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 420,
      content: [
        {
          type: "text",
          value: "Is that a decision you can easily change your mind about later?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 448,
      content: [
        {
          type: "text",
          value:
            "The idea of using versioned, chained migrations instead of format-specific parsers — that's close to a one-way door. Every future schema change has to fit that model once devices and services are built around it. But the transformer engine's own implementation, how it's hosted, how many hops it computes at once, that stays a two-way door — we can optimize that later without touching the versioning contract.",
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
            "Good distinction. Let's talk about the WiFi credentials now. How are they protected in what you've drawn so far?",
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
            "Right now, nothing special — it's part of the same blob. I'd start with TLS in transit and server-side encryption at rest for the whole payload.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 532,
      content: [
        {
          type: "text",
          value:
            "The Sync Service holds the encryption key to decrypt that payload at rest. Does that satisfy 'never store it in plaintext,' in spirit?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 558,
      content: [
        {
          type: "text",
          value:
            "Not really — anyone with access to that key, including us operationally, could still read the WiFi password. Server-side encryption protects against someone stealing the disk, not against the service itself being able to see it.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 585,
      content: [
        { type: "text", value: "So how do you make sure even the Sync Service can't read it?" },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 615,
      content: [
        {
          type: "text",
          value: "The old and new device would need to establish ",
        },
        {
          id: "highlight-e2ee-key-exchange",
          type: "highlight",
          status: "strong",
          value: "a shared secret directly with each other",
          explanation:
            "Correctly identifies that true end-to-end confidentiality requires the key to be negotiated device-to-device, not held by the intermediary service that only relays ciphertext.",
        },
        {
          type: "text",
          value:
            " — a key exchange during the pairing step, maybe triggered by scanning a code the new device displays. Once they agree on a key, the old device encrypts the sensitive fields with it, and the Sync Service only ever stores and relays ciphertext it can't decrypt.",
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
            "Would you apply that same end-to-end scheme to every field, like the volume setting or theme preference?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 678,
      content: [
        {
          type: "text",
          value:
            "Probably not everything. For non-sensitive preferences, envelope encryption through a managed key service is fine, and it keeps support and debugging workflows possible. I'd reserve device-negotiated end-to-end encryption specifically for the fields we genuinely can't let the platform see — credentials and tokens.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 705,
      content: [{ type: "text", value: "Which of those two feels like the harder decision to walk back?" }],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 732,
      content: [
        {
          type: "text",
          value:
            "The end-to-end pairing protocol is the one-way door — once it's baked into device firmware, changing the key exchange mechanism means every device in the field needs a firmware update to stay compatible. Swapping which managed key service wraps the non-sensitive envelope encryption is comparatively a two-way door — that's a backend change devices never see.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 762,
      content: [
        {
          type: "text",
          value:
            "Let's talk about what actually gets transferred. Some of this — downloaded books, media libraries — is large. What happens if the old device loses WiFi halfway through uploading a few gigabytes?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 792,
      content: [
        {
          type: "text",
          value:
            "If it's one big upload, the connection drops and we'd have to restart the whole thing from zero, which on a flaky connection might never finish.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 818,
      content: [{ type: "text", value: "How would you avoid restarting from zero?" }],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 845,
      content: [
        { type: "text", value: "I'd split the payload into " },
        {
          id: "highlight-chunked-resumable",
          type: "highlight",
          status: "strong",
          value: "content-addressed chunks that upload independently",
          explanation:
            "Correctly reframes a large fragile transfer as many small idempotent transfers, so connectivity loss only costs the in-flight chunk rather than the whole payload.",
        },
        {
          type: "text",
          value:
            ", each identified by a hash of its own content. If the connection drops, the device just resumes from whichever chunks the server hasn't acknowledged yet, instead of starting over.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 875,
      content: [
        {
          type: "text",
          value: "What if the same chunk gets uploaded twice because the ack itself got lost?",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 900,
      content: [
        {
          type: "text",
          value:
            "That's harmless if chunks are keyed by their content hash — writing the same chunk again just overwrites itself with identical bytes. The upload endpoint is naturally idempotent as long as we key on content, not on upload order.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 928,
      content: [
        {
          type: "text",
          value:
            "All chunks arrive, but the final 'migration complete' signal from device to service gets lost in the same flaky connection. What does the customer see?",
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
            "The new device would look like it's still mid-setup even though everything actually arrived. I'd give the completion signal its own migration ID and make that endpoint idempotent too — the device can safely retry 'mark this migration complete' as many times as it needs, and the server just checks whether it's already marked done.",
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
          value:
            "Good. Now — launch day. A new device ships, and hundreds of thousands of customers start migrations within the same hour. What breaks first?",
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
          value:
            "If everything sits behind one shared Sync Service and one shared transformer engine, a spike big enough to slow down the transformer engine slows down every migration everywhere, even accounts that have nothing to do with the new launch.",
        },
      ],
    },

    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 1042,
      content: [{ type: "text", value: "How do you contain that?" }],
    },

    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 1070,
      content: [
        {
          type: "text",
          value: "I'd shard by account or region into separate ",
        },
        {
          id: "highlight-blast-radius",
          type: "highlight",
          status: "strong",
          value: "isolated cells",
          explanation:
            "Correctly names blast-radius isolation as the mechanism — a launch-day surge or a bad deploy in one cell degrades a bounded slice of customers rather than the whole platform.",
        },
        {
          type: "text",
          value:
            " so a surge or a bad deploy affecting one cell only degrades that slice of customers, not the whole platform. On top of that I'd put a circuit breaker in front of the transformer engine — if it starts timing out, we stop hammering it and fall back to queuing the migration for retry instead of blocking the customer's whole setup flow. A rate limiter on the upload path protects it from the initial burst, and the device gets a clear 'retry shortly' signal rather than the request just hanging.",
        },
      ],
    },

    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 1108,
      content: [
        {
          type: "text",
          value:
            "Let's pin down the store that tracks migration state — status, chunk progress, which device is waiting on what. DynamoDB or Postgres?",
        },
      ],
    },

    {
      id: "44",
      role: "candidate",
      elapsedSeconds: 1138,
      content: [
        {
          type: "text",
          value:
            "The access pattern here is almost entirely point lookups and writes by migration ID or account ID — get this migration's status, update this chunk's progress. There's no real need for joins across migrations. That points toward DynamoDB: it fits the access pattern directly and there's less operational overhead than running and scaling a relational cluster for something that's fundamentally key-value.",
        },
      ],
    },

    {
      id: "45",
      role: "interviewer",
      elapsedSeconds: 1168,
      content: [{ type: "text", value: "Is that choice easy to walk back later?" }],
    },

    {
      id: "46",
      role: "candidate",
      elapsedSeconds: 1195,
      content: [
        {
          type: "text",
          value:
            "Not really — once the partition key is chosen and data's been written at scale, migrating to a different store or repartitioning means a live data migration across every existing record, which is exactly the kind of thing we've spent this whole conversation trying to make safe for customer devices, and now we'd be doing it to ourselves. I'd treat the partition key choice as the one-way door here and spend real time on it up front — probably migration ID, since that's the natural unit almost every read and write centers on.",
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
            "Good, that's the high-level picture. Let's go deeper on that migration state store specifically. Walk me through exactly how a chunk-progress update flows through it.",
        },
      ],
    },

    {
      id: "48",
      role: "candidate",
      elapsedSeconds: 1262,
      content: [
        {
          type: "text",
          value:
            "Each migration gets one partition keyed by migration ID. Within that partition, I'd use the chunk sequence number as the sort key, so a device's 'chunk 47 uploaded' write lands as its own item, and reading 'what's still missing' is a range query over that partition rather than a scan.",
        },
      ],
    },

    {
      id: "49",
      role: "interviewer",
      elapsedSeconds: 1295,
      content: [
        {
          type: "text",
          value:
            "Under standard load that's fine. On launch day, what does a hot partition look like here?",
        },
      ],
    },

    {
      id: "50",
      role: "candidate",
      elapsedSeconds: 1325,
      content: [
        {
          type: "text",
          value:
            "A single migration's partition itself shouldn't get hot — one device only writes its own chunks at its own pace. The real risk is if I'd chosen something coarser, like account ID, as the partition key instead — a customer migrating several devices at once, or worse, a monitoring job scanning 'all in-progress migrations' across accounts, would hammer a small number of partitions. Keying on migration ID specifically avoids that, since migrations naturally spread themselves across a huge key space.",
        },
      ],
    },

    {
      id: "51",
      role: "interviewer",
      elapsedSeconds: 1358,
      content: [
        {
          type: "text",
          value:
            "What about the transformer engine itself — where's the bottleneck when it has to apply a long chain of migrations, say ten hops from an ancient schema version?",
        },
      ],
    },

    {
      id: "52",
      role: "candidate",
      elapsedSeconds: 1390,
      content: [
        {
          type: "text",
          value:
            "Walking ten sequential migration functions one at a time on every request is wasted work if most old devices cluster around just a few common versions — we'd be recomputing the same v1.2-to-v2.0 chain repeatedly.",
        },
      ],
    },

    {
      id: "53",
      role: "interviewer",
      elapsedSeconds: 1418,
      content: [{ type: "text", value: "So what would you change?" }],
    },

    {
      id: "54",
      role: "candidate",
      elapsedSeconds: 1448,
      content: [
        {
          type: "text",
          value:
            "I'd cache the composed transformation for common version pairs — effectively precomputing 'v1.2 to v2.0' as a single collapsed function instead of replaying every intermediate hop on the hot path. New or rare version pairs still fall back to walking the chain live, but the common case, which is what launch-day traffic actually looks like, skips straight to a cached path.",
        },
      ],
    },

    {
      id: "55",
      role: "interviewer",
      elapsedSeconds: 1478,
      content: [
        {
          type: "text",
          value: "Good. Anything you'd still want monitored once this is live?",
        },
      ],
    },

    {
      id: "56",
      role: "candidate",
      elapsedSeconds: 1505,
      content: [
        {
          type: "text",
          value:
            "I'd watch the circuit breaker's trip rate on the transformer engine and the queue depth behind it — those tell us the fallback path is actually absorbing load rather than silently piling up. And I'd want an alert on any migration that completes with a mismatch between the number of chunks the device says it sent and what the store actually has, since that's the kind of gap reconciliation should be catching before a customer notices a missing photo library.",
        },
      ],
    },

    {
      id: "57",
      role: "takeaway",
      elapsedSeconds: 1540,
      content: [
        {
          type: "text",
          value:
            "Takeaway: separate the decisions that are genuinely hard to reverse — the schema-versioning contract, the device-negotiated encryption protocol, the partition key — from the ones that aren't, and spend deliberation accordingly. Chunked, content-addressed transfers and idempotent completion signals make offline-first sync safe to retry. Cell-based isolation, circuit breakers, rate limiting, and backpressure keep a launch-day spike from becoming a global outage. And end-to-end encryption belongs specifically where the platform itself must never be able to read the data — not applied uniformly everywhere.",
        },
      ],
    },
  ],
};

const configSyncPlatform: TranscriptEntry = {
  summary: {
    slug: "config-sync-platform",
    title: "Design a Multi-Device Configuration Sync Platform",
    category: "hld",
    difficulty: Difficulty.HARD,
    duration: 50,
    company: "Amazon",
    tags: [
      "Distributed Systems",
      "Schema Evolution",
      "End-to-End Encryption",
      "Offline-First",
      "Resiliency",
      "Blast Radius Isolation",
      "One-Way vs Two-Way Doors",
    ],
    description:
      "Production-grade HLD interview covering schema-drift transformation, device-negotiated end-to-end encryption, resumable idempotent chunked sync, blast-radius isolation on launch-day load, explicit one-way/two-way door trade-offs, and a deep component drill into the migration state store and transformer engine.",
  },

  transcript,
};

export default configSyncPlatform;