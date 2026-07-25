// src/content/transcripts/behavioral/campaign-labelling-invent-and-simplify.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Campaign Labelling System — Invent and Simplify",
    difficulty: Difficulty.HARD,
    company: "Amazon",
    duration: 44,
    template: "BEHAVIORAL",
    category: "BEHAVIORAL",
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
            "Tell me about a time you simplified something that could have gotten a lot more complicated — where the easy path would've been to just add more machinery instead of stepping back.",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 20,
      content: [
        {
          type: "text",
          value:
            "Sure — at Deliveroo, I worked on an automated campaign labelling system. When restaurants updated their menus, item eligibility had to get recalculated and partner campaigns activated or deactivated automatically.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 35,
      content: [
        { type: "text", value: "What was the actual problem — not the feature description, the problem." },
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
            "The initial design had every single item update trigger a full partner evaluation downstream. Fine for a small change, but during a bulk menu refresh, one restaurant could throw off thousands of item events in a few minutes, and each one was triggering its own evaluation.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 62,
      content: [
        { type: "text", value: "What tipped you off that this was a real problem, versus something you decided to gold-plate on your own?" },
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
            "I was looking at event volume during a big menu import test and noticed we were about to send — I mean, thousands of partner evaluation calls for what was really just one restaurant settling into a final state. It wasn't hypothetical, I could see the volume ahead of production traffic actually hitting it.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 92,
      content: [
        { type: "text", value: "So what was the simpler thing you invented here, exactly? Walk me through it." },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 108,
      content: [
        {
          type: "text",
          value:
            "The simplification was realizing partner activation didn't need to react to every individual item event at all — only to where the restaurant ended up after everything settled. Once I saw that, I split the workflow into two stages: item-level labelling, and partner-level activation, instead of one path doing both.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 120,
      content: [
        { type: "text", value: "Isn't splitting one workflow into two stages adding complexity, not simplifying anything?" },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 138,
      content: [
        {
          type: "text",
          value:
            "I get why it sounds that way, but it's simplifying what each piece actually has to think about. Before, the single path had to reason about every intermediate item change and still produce a sane partner result. After splitting it, item labelling just reacts to change, full stop — and partner activation only has to answer one question, 'what does this restaurant look like right now,' instead of trying to make sense of a stream of in-between states. Each piece got dumber, even though there are technically two of them now.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 155,
      content: [
        { type: "text", value: "For item labelling, what stopped a no-op update from still going downstream?" },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 170,
      content: [
        {
          type: "text",
          value:
            "Before forwarding anything, I compared the newly computed label against whatever was already stored. If it hadn't actually changed, the event just stopped there instead of continuing on.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 182,
      content: [
        { type: "text", value: "And for partner activation — that's where the bigger problem was?" },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 198,
      content: [
        {
          type: "text",
          value:
            "Right. I put a FIFO SQS queue in front of it, keyed by partner ID for deduplication, with a five-minute delay before a message actually became visible for processing.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 212,
      content: [
        { type: "text", value: "Why five minutes specifically? Why not one, why not ten?" },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 228,
      content: [
        {
          type: "text",
          value:
            "Honestly, I don't think five minutes came out of some rigorous calculation — it was more of a judgment call based on how long a typical bulk menu import actually took to settle, from what we'd seen in practice. Long enough that most bursts had finished by the time the delay expired, short enough that campaign state wasn't stale for an uncomfortable amount of time. If I had to defend the exact number, it came from watching real import durations, not a formula.",
        },
        {
          id: "highlight-honest-judgment-call",
          type: "highlight",
          status: "strong",
          value: "not a formula",
          explanation:
            "Doesn't retrofit a precise-sounding justification for an operational constant that was actually chosen by observation and judgment — names the reasoning honestly instead of dressing it up as a calculated trade-off.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 242,
      content: [
        { type: "text", value: "What happens if another update for the same partner shows up during that five-minute window?" },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 260,
      content: [
        {
          type: "text",
          value:
            "Because it's deduplicated by partner ID, a second message for the same partner arriving inside that window doesn't create a separate entry to process — it collapses into whatever's already waiting. The burst effectively coalesces into one evaluation once the window closes, instead of one per message.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 274,
      content: [
        { type: "text", value: "Does that risk losing information? What if the second update actually mattered and the first one was already stale?" },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 290,
      content: [
        {
          type: "text",
          value:
            "It doesn't, because deduplication only controls how many times we trigger an evaluation — it's not what data the evaluation actually uses. When it finally runs, it doesn't replay whatever event triggered it, it reads the current menu snapshot fresh. So even if ten updates collapsed into one trigger, the evaluation that runs sees the true final state, not some stale intermediate one.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 305,
      content: [
        { type: "text", value: "How did you know deduplicating by partner ID specifically was safe, instead of by restaurant, or by item?" },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 320,
      content: [
        {
          type: "text",
          value:
            "Because the thing that actually needed deduplicating was 'how many times do we evaluate this partner,' not 'how many times did this item change' — those are different units. Deduplicating by item ID wouldn't have helped, since the redundant work was all landing on the partner evaluation step, and a single restaurant can map to more than one partner campaign, so partner was the actual unit of repeated work.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 335,
      content: [
        { type: "text", value: "How did you guarantee the final partner state was actually correct, given you're throwing away most of the individual events?" },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 350,
      content: [
        {
          type: "text",
          value:
            "Because correctness never depended on the events themselves — it depended on re-deriving eligibility from the latest menu snapshot at evaluation time. The events were only ever a trigger, a signal that something changed and it's worth re-checking, not the source of truth for what the state should be. Dropping duplicate triggers doesn't threaten correctness, since the one trigger that does get through recomputes from scratch off current data anyway.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 365,
      content: [
        { type: "text", value: "What if the partner evaluation Lambda itself fails partway through?" },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 380,
      content: [
        {
          type: "text",
          value:
            "It should retry — SQS handles some of that itself, redelivering a message if it isn't deleted after processing within the visibility timeout. After some number of failed attempts, I believe it lands in a dead-letter queue instead of retrying forever.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 392,
      content: [
        { type: "text", value: "Is re-running that evaluation idempotent? If it partially updated some partner state and then failed, does a retry cause any damage?" },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 408,
      content: [
        {
          type: "text",
          value:
            "It should be, since a retry just recomputes eligibility from the current snapshot again and writes the result — it's not incrementing or appending anything, it's overwriting with a freshly computed value. Running it twice in a row should land on the same end state either time... though I'll be honest, I'm not fully sure every downstream side effect of that evaluation — like whatever notifies the partner — was equally safe to fire twice. That's something I'd want to go double-check rather than assume was clean.",
        },
        {
          id: "highlight-idempotency-honesty",
          type: "highlight",
          status: "strong",
          value: "not something I'd want to assume was clean",
          explanation:
            "Separates 'the recomputation itself is idempotent' from 'every downstream side effect of it is safe to repeat,' and admits the second one was never actually verified rather than letting the first fact stand in for both.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 425,
      content: [
        { type: "text", value: "Why not just evaluate partner activation synchronously the moment an item changes, instead of all this queueing and delay?" },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 440,
      content: [
        {
          type: "text",
          value:
            "Because synchronous means every item event pays the cost of a full partner evaluation immediately — exactly the problem we were trying to get away from, thousands of evaluations for one restaurant settling. It also couples the item pipeline's latency directly to however long partner evaluation takes, so a slow partner evaluation would back up item processing too, when really those two things don't need to move at the same speed at all.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 455,
      content: [
        { type: "text", value: "How would you scale this to millions of restaurants instead of whatever scale you were actually running at?" },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 472,
      content: [
        {
          type: "text",
          value:
            "The two pipelines already scale somewhat independently, since they're decoupled by the queue, so that part holds up reasonably well. What I'd actually want to look at harder is queue throughput and partition key distribution — if partner IDs aren't evenly distributed, or a small number of huge partners dominate volume, you could end up with hot shards even with the pipeline split in place. I don't think I actually load-tested that specific failure mode at the scale we were running — I'm reasoning about where it would break based on the architecture, not something I verified firsthand.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 490,
      content: [
        { type: "text", value: "So if you're being honest, is this design actually proven at millions-of-restaurants scale, or does it just look like it should work?" },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 505,
      content: [
        {
          type: "text",
          value:
            "If I'm being honest, it's the second one, mostly. It held up fine at the scale we actually ran it at, and the reasoning for why it should keep holding up further makes sense to me, but I wouldn't claim I validated it at a scale meaningfully larger than what we saw in production. That's a real gap between 'this is a good design' and 'I've proven this design.'",
        },
        {
          id: "highlight-unverified-scale-honesty",
          type: "highlight",
          status: "strong",
          value: "a real gap between 'this is a good design' and 'I've proven this design'",
          explanation:
            "Refuses to let sound architectural reasoning stand in for actual validation at a scale that was never tested, naming that gap directly instead of letting a confident answer imply more certainty than the candidate actually has.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 520,
      content: [
        { type: "text", value: "What actually told you this was working well in production, versus just hoping it was?" },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 535,
      content: [
        {
          type: "text",
          value:
            "We had metrics around processing latency, how many duplicate events got dropped by the dedup step, Lambda failure counts, queue depth, and campaign activation counts. Queue depth was probably the one I watched closest, since a growing queue depth would've been the first sign that partner evaluations weren't keeping up with the incoming rate.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 548,
      content: [
        { type: "text", value: "Good, that's what I wanted to dig into. Let's stop there." },
      ],
    },

    {
      id: "38",
      role: "takeaway",
      elapsedSeconds: 565,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the invent-and-simplify angle here isn't the queue or the deduplication key by themselves — it's the earlier realization that partner activation only ever needed to answer one question about final state, which made everything downstream simpler even though it meant splitting one workflow into two. The story holds up under drill-down because the candidate defends the five-minute delay as an observed judgment call rather than inventing false precision, distinguishes an idempotent recomputation from unverified downstream side effects, and is direct that the design's soundness at far larger scale is reasoned, not proven — three moments where a less careful answer would have overclaimed certainty the candidate doesn't actually have.",
        },
      ],
    },
  ],
};

const deliverooCampaignLabellingInventAndSimplify: TranscriptEntry = {
  summary: {
    slug: "deliveroo-campaign-labelling-invent-and-simplify",
    title: "Campaign Labelling System — Invent and Simplify",
    category: "behavioral",
    difficulty: Difficulty.HARD,
    duration: 44,
    company: "Amazon",
    tags: [
      "Behavioral",
      "Leadership Principles",
      "Invent and Simplify",
      "Distributed Systems",
      "Event-Driven Architecture",
      "Queueing",
      "Scalability",
    ],
    description:
      "SDE2 behavioral interview with drill-down on simplifying an automated campaign labelling system at Deliveroo. Covers the core insight that partner activation only needed final restaurant state rather than every item event, defending a five-minute dedup delay as an observed judgment call rather than a formula, why deduplication by partner ID is safe, correctness via snapshot recomputation instead of event replay, an honestly-scoped idempotency answer, and being direct about what in the scaling story is reasoned versus actually proven.",
  },

  transcript,
};

export default deliverooCampaignLabellingInventAndSimplify;