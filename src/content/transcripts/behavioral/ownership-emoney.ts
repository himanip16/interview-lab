// src/content/transcripts/behavioral/emoney-safeguarding-ownership.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "eMoney Safeguarding Delay — Ownership",
    difficulty: Difficulty.HARD,
    company: "Amazon",
    duration: 42,
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
            "Tell me about a time you took ownership of a problem that was bigger than your team's boundaries — something with real business risk attached.",
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
            "Sure — at Uber, I worked on our financial compliance platform. In certain international markets, ride payment funds have to be processed and deposited within a legally mandated SLA window, under eMoney safeguarding regulations, before driver payouts happen. During high traffic, we started seeing our compliance consumer's lag creep up toward that window.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 35,
      content: [
        { type: "text", value: "How'd you first notice that — an actual near-miss, or just a metric trending the wrong way?" },
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
            "It was telemetry trending the wrong way before it became an actual incident. During peak hours our compliance consumer's lag kept creeping up — close enough to the SLA window that it made me nervous, even though we hadn't technically breached anything yet.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 62,
      content: [
        { type: "text", value: "What would've been the easy thing to do here, and why didn't you do that?" },
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
            "The easy thing would've been an alert that pages someone when lag gets close to the threshold, so a human can go intervene manually. I didn't want that to be the answer, because it just moves the risk onto whoever's on call reacting fast enough — it doesn't actually remove the underlying risk.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 90,
      content: [
        { type: "text", value: "So what did you actually find when you dug in?" },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 105,
      content: [
        {
          type: "text",
          value:
            "I traced the payment event's path through our messaging infra and found the eMoney payout events were sharing a Kafka topic with a bunch of unrelated, high-volume telemetry — things like receipt generation events and promo code tracking, way higher volume and nothing to do with compliance.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 118,
      content: [
        { type: "text", value: "Why does sharing a topic actually cause a problem? Walk me through the mechanism, not just 'it was busy.'" },
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
            "During a burst of that low-priority traffic, the partition fills up with those events ahead of ours, and since it's effectively a queue, our consumer has to work through everything ahead of it in order — so it falls behind, even though our own event volume hadn't changed at all. We were just stuck behind everyone else's spike.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 145,
      content: [
        { type: "text", value: "Why not just add more partitions to that same topic to relieve the pressure?" },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 160,
      content: [
        {
          type: "text",
          value:
            "We actually talked about that, and it doesn't really solve it — more partitions spreads load out, but the low-priority events are still competing for the same consumer-side compute and network resources as ours. It doesn't give you an actual isolation boundary, it just spreads the same contention around more thinly.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 172,
      content: [
        { type: "text", value: "So you decoupled it. That meant touching a service your team didn't own, right — how'd that actually go, not the polished version?" },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 188,
      content: [
        {
          type: "text",
          value:
            "Yeah, the checkout service publishing those events belonged to another team. I didn't want to just show up asking them to change their producer code, so I went in with the consumer lag data and the actual regulatory risk laid out, and proposed routing financial events to a separate topic instead of asking them to duplicate anything on their end.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 200,
      content: [
        { type: "text", value: "What do you mean, without asking them to duplicate anything?" },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 215,
      content: [
        {
          type: "text",
          value:
            "Instead of checkout publishing to two different topics itself, I proposed a router sitting at that boundary — checkout still only publishes once, the same way it always did, and the router inspects the event type and forwards financial events to the new high-SLA topic while everything else goes where it always went. That way their side barely changed.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 228,
      content: [
        { type: "text", value: "Did they push back at all, or was it an easy sell?" },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 242,
      content: [
        {
          type: "text",
          value:
            "There was some friction, mostly around who'd own and maintain that routing layer going forward, since it's now a new piece of shared infrastructure sitting on their critical path. I don't remember every detail of how we resolved long-term ownership of it, but the immediate decision to route financial events separately was something they agreed to fairly quickly once they saw the actual lag numbers.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 255,
      content: [
        { type: "text", value: "When you said you presented the regulatory risk to them, what did that actually look like — a slide deck, a doc, a hallway conversation?" },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 270,
      content: [
        {
          type: "text",
          value:
            "Mostly a doc with the lag chart next to it — showing consumer lag creeping toward the SLA window during peak periods over a few weeks, and just plainly stating the consequence: mandatory self-reporting and financial penalties if we crossed it. I didn't dress it up much beyond that — the lag trend next to the compliance consequence made the case on its own.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 285,
      content: [
        { type: "text", value: "You mentioned a batch reconciliation piece too. Why not just trust the new streaming path once it's isolated?" },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 300,
      content: [
        {
          type: "text",
          value:
            "Because isolating the topic reduces the risk of lag, it doesn't guarantee zero risk — there's still things like a transient network blip or a consumer restart that could delay or drop a message. So I added a batch job against our data warehouse that re-checks recent transactions against what actually got processed, as a backstop for that residual risk specifically, not as the primary mechanism.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 312,
      content: [
        { type: "text", value: "How'd you make sure that batch job didn't create duplicate payouts if the streaming path already handled something?" },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 328,
      content: [
        {
          type: "text",
          value:
            "Every transaction carried a deterministic ID generated at ingestion, and the database write was an upsert keyed on that ID — insert if it doesn't exist, otherwise update. Whichever path got there first set the actual state, and the second path just landed on the same row instead of creating a new one.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 342,
      content: [
        { type: "text", value: "What if the batch job ran while the streaming path was mid-processing the same event — is there a window where that upsert logic could still race?" },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 358,
      content: [
        {
          type: "text",
          value:
            "That's a fair question, and honestly I'd want to go check the exact mechanics again rather than promise you a specific guarantee off the top of my head. My recollection is the streaming side used some form of exactly-once processing with checkpointing, so a half-processed event shouldn't have been externally visible yet for the batch job to even see — but I wouldn't want to overstate the precision of that answer without actually looking at how the checkpoint commit and the batch job's read boundary lined up.",
        },
        {
          id: "highlight-race-condition-honesty",
          type: "highlight",
          status: "strong",
          value: "wouldn't want to overstate the precision of that answer",
          explanation:
            "Distinguishes a confident recollection of the general mechanism from a verified guarantee about the exact race window, declining to manufacture false precision under a pointed follow-up.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 372,
      content: [
        { type: "text", value: "How'd you monitor that the new dedicated topic didn't just develop its own lag problem down the line?" },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 388,
      content: [
        {
          type: "text",
          value:
            "We set up an alert on consumer offset lag specifically for that new consumer group, with a threshold set well under the actual SLA buffer, so if lag started creeping up again we'd know with enough runway to react before it became a compliance issue, not right at the edge of it.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 400,
      content: [
        { type: "text", value: "What was the actual trade-off of building all this, versus just leaving it as a monitored risk?" },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 415,
      content: [
        {
          type: "text",
          value:
            "More infrastructure to maintain, basically — now there's a routing layer, a dedicated topic, and a batch reconciliation job all needing to stay healthy, instead of just one topic and an alert. That's real ongoing operational surface. I think it was worth it given the regulatory stakes, but I wouldn't pretend it was free.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 428,
      content: [
        { type: "text", value: "You said this eliminated the delays completely. How long did you actually watch it before being confident saying that?" },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 443,
      content: [
        {
          type: "text",
          value:
            "If I'm honest, I don't remember the exact length of time I watched it before feeling confident calling it solved — it was at least a few weeks of clean peak-traffic cycles with no lag creeping back up, but I couldn't tell you it was some fixed observation period we'd predefined as 'proof.' It was more that we kept watching and it kept staying flat, and at some point that became enough to call it resolved.",
        },
        {
          id: "highlight-eliminated-claim-honesty",
          type: "highlight",
          status: "strong",
          value: "not some fixed observation period we'd predefined as 'proof'",
          explanation:
            "Backs off a clean 'eliminated completely' framing into what actually happened — an informal but real observation window rather than a predefined validation criterion — instead of letting the strong result claim imply more rigor than there was.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 455,
      content: [
        { type: "text", value: "If you were starting this over knowing what you know now, what would you do differently?" },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 470,
      content: [
        {
          type: "text",
          value:
            "Probably push for jointly owning that routing layer from day one instead of leaving its long-term maintenance ownership vague. That ambiguity was the one part of this that didn't get cleanly resolved, and it's exactly the kind of thing that quietly becomes nobody's problem a year later if it isn't nailed down up front.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 482,
      content: [
        { type: "text", value: "Good, that's what I wanted to dig into. Let's stop there." },
      ],
    },

    {
      id: "36",
      role: "takeaway",
      elapsedSeconds: 498,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the ownership signal here is choosing to fix the structural cause across a team boundary instead of shipping an alert and calling it done, and using lag data plus concrete regulatory consequences — not authority — to get an upstream team to agree to a change. The story holds up under drill-down because the candidate distinguishes a confident recollection of the exactly-once mechanism from a verified guarantee about the exact race window, is honest that 'eliminated completely' rested on an informal observation period rather than a predefined validation criterion, and names the one loose end — ambiguous long-term ownership of the new routing layer — as the actual thing they'd fix next time, rather than presenting the story as flawlessly closed.",
        },
      ],
    },
  ],
};

const uberEmoneySafeguardingOwnership: TranscriptEntry = {
  summary: {
    slug: "uber-emoney-safeguarding-ownership",
    title: "eMoney Safeguarding Delay — Ownership",
    category: "behavioral",
    difficulty: Difficulty.HARD,
    duration: 42,
    company: "Amazon",
    tags: [
      "Behavioral",
      "Leadership Principles",
      "Ownership",
      "Distributed Systems",
      "Kafka",
      "Compliance",
      "Cross-Team Collaboration",
    ],
    description:
      "SDE2 behavioral interview with drill-down on resolving an eMoney safeguarding SLA risk at Uber caused by a noisy-neighbor Kafka topic. Covers why partition scaling doesn't fix a shared-resource contention problem, getting an upstream team to agree to a routing change without asking them to duplicate publishing logic, idempotent dual-path reconciliation, an honest limit on how precisely the streaming-versus-batch race condition was actually verified, and naming ambiguous cross-team ownership of the new routing layer as the real unresolved loose end.",
  },

  transcript,
};

export default uberEmoneySafeguardingOwnership;