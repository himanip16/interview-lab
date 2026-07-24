// src/content/transcripts/behavioral/earn-trust-spain-serviceid.ts

import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Earn Trust: Spain Compliance Reporting — Challenging Your Own Design",
    difficulty: Difficulty.MEDIUM,
    duration: 37,
    template: "Behavioral",
    category: "Behavioral",
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
            "Tell me about a time when you realized a design decision you'd made was wrong, and you had to go back and fix it.",
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
            "Yeah. So this was at Uber, working on Spain's real-time compliance reporting platform.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 32,
      content: [
        {
          type: "text",
          value: "Compliance reporting to the regulator?",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 42,
      content: [
        {
          type: "text",
          value:
            "Right. Spanish regulator requires us to report every trip lifecycle event in real time. Reservation, driver assigned, arrival, start, completion, cancellation.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 60,
      content: [
        {
          type: "text",
          value: "And the critical constraint?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 75,
      content: [
        {
          type: "text",
          value:
            "When we register a reservation, the regulator returns a unique identifier called a serviceId. Every future event for that trip has to include that same serviceId. If any event arrives without the correct serviceId, the regulator rejects it outright.",
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
          value: "So the core problem was storing and retrieving the mapping.",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 112,
      content: [
        {
          type: "text",
          value:
            "Exactly. Uber's internal trip ID to the regulator's serviceId. I proposed storing it in Flink state.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 128,
      content: [
        {
          type: "text",
          value: "Why Flink?",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 142,
      content: [
        {
          type: "text",
          value:
            "All trip events were already flowing through Flink. Lookups would be extremely fast. We wouldn't need an additional database dependency. It was clean, simple, low latency.",
        },
        {
          id: "highlight-initial-logic",
          type: "highlight",
          status: "strong",
          value: "It made a lot of sense for stream processing",
          explanation:
            "The proposal wasn't bad for stream processing. It was a reasonable architectural choice for that frame. The problem was the frame itself was incomplete.",
        },
        {
          type: "text",
          value: " The proposal was well received during design review.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 165,
      content: [
        {
          type: "text",
          value: "What happened next?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 180,
      content: [
        {
          type: "text",
          value:
            "A few weeks later, we shipped it. It worked. But then, during an operational review with the compliance and ops teams, the conversation turned to what happens during a reporting outage.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 202,
      content: [
        {
          type: "text",
          value: "What'd they ask?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 218,
      content: [
        {
          type: "text",
          value:
            "Basically, if we miss events during an outage, can we replay them later? And the answer was no. Spain doesn't support backfills.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 235,
      content: [
        {
          type: "text",
          value: "No replays at all?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 250,
      content: [
        {
          type: "text",
          value:
            "Right. If we fail to report an event within the regulator's accepted window, there's no mechanism to resend it. That event is simply lost. Permanently.",
        },
        {
          id: "highlight-no-backfill",
          type: "highlight",
          status: "missed",
          value: "I knew Spain didn't support backfills, but I hadn't fully internalized what that meant for a compliance system",
          explanation:
            "This is the gap between knowing a constraint and understanding its consequences. The candidate knew the fact but hadn't connected it to the architecture implications until it was named explicitly.",
        },
        {
          type: "text",
          value: "",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 275,
      content: [
        {
          type: "text",
          value: "That's when it clicked for you.",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 290,
      content: [
        {
          type: "text",
          value:
            "Yeah. That changed everything about how I saw the design. Flink state is highly reliable, but it's optimized for stream processing performance, not for being the authoritative source of truth for a regulatory identifier.",
        },
        {
          id: "highlight-pivot-point",
          type: "highlight",
          status: "strong",
          value: "Even with aggressive checkpointing, there's always a window where a newly created serviceId mapping exists only in the running job",
          explanation:
            "Naming the specific technical vulnerability—the checkpoint window where data is unprotected—shows the candidate understands both the system and the risk clearly.",
        },
        {
          type: "text",
          value:
            " For most systems, that small risk is acceptable. But here, losing a single serviceId mapping could permanently prevent future events from being accepted.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 318,
      content: [
        {
          type: "text",
          value: "What was the business consequence?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 332,
      content: [
        {
          type: "text",
          value:
            "Potentially Uber's ability to operate in that market. The probability was low, but the consequence was asymmetric. You can't rationalize away a compliance risk just because it's unlikely.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 352,
      content: [
        {
          type: "text",
          value: "So you had to change it.",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 368,
      content: [
        {
          type: "text",
          value:
            "I had two options. Defend it, because the failure probability was genuinely low. Or go back, document the risk, and propose a better design.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 385,
      content: [
        {
          type: "text",
          value: "What made you choose the second?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 402,
      content: [
        {
          type: "text",
          value:
            "The uncomfortable part was that I'd been one of the strongest advocates for the Flink state design. It was my proposal.",
        },
        {
          id: "highlight-discomfort",
          type: "highlight",
          status: "strong",
          value: "I had been one of the strongest advocates for the Flink state design",
          explanation:
            "Naming the discomfort explicitly—'this was my idea and I have to say it's wrong'—shows genuine integrity. It would have been easier to stay quiet or let someone else raise it.",
        },
        {
          type: "text",
          value:
            " But protecting the system mattered more than protecting my position.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 428,
      content: [
        {
          type: "text",
          value: "How'd you approach it?",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 445,
      content: [
        {
          type: "text",
          value:
            "I wrote up the failure scenarios clearly. What happens if the Flink job loses recent state during a severe infrastructure failure. What that means for the serviceId mapping. What that means for compliance. I walked through it with my manager and the partner teams without softening it.",
        },
        {
          id: "highlight-honest-documentation",
          type: "highlight",
          status: "strong",
          value: "I documented the risk honestly and walked through it publicly without softening",
          explanation:
            "Not hiding the problem, not burying it in technical jargon, not rationalizing it away—just stating what could go wrong and why it matters. That's what earns trust.",
        },
        {
          type: "text",
          value: "",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 472,
      content: [
        {
          type: "text",
          value: "And then you proposed a new design.",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 488,
      content: [
        {
          type: "text",
          value:
            "MySQL became the source of truth for the trip-to-serviceId mapping. Redis sat in front of it as a low-latency cache for lookups. Flink remained responsible for event processing, which is what it's actually designed for.",
        },
        {
          id: "highlight-redesign",
          type: "highlight",
          status: "strong",
          value: "MySQL for durability, Redis for latency, Flink for what it does best—processing events",
          explanation:
            "The redesign shows clear thinking about tool-fit. Not 'we need more complexity' but 'we need the right tool for each problem.' Each layer has a purpose aligned with what it's good at.",
        },
        {
          type: "text",
          value:
            " If Redis missed, we fell back to MySQL. The serviceId was never at risk.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 515,
      content: [
        {
          type: "text",
          value: "What was the cost?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 530,
      content: [
        {
          type: "text",
          value:
            "It added complexity. But a cache miss impacts latency. Losing a serviceId mapping impacts compliance and potentially Uber's ability to operate in that market. Those aren't the same category of problem.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 552,
      content: [
        {
          type: "text",
          value: "Did the team buy it?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 568,
      content: [
        {
          type: "text",
          value:
            "Yeah. And I think they trusted it precisely because they saw I was willing to go back and challenge my own proposal when the risk profile changed. I wasn't protecting my earlier position. I was protecting the system.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 592,
      content: [
        {
          type: "text",
          value: "Got it. Thanks for walking through that.",
        },
      ],
    },

    {
      id: "34",
      role: "takeaway",
      elapsedSeconds: 605,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Earn Trust here is about catching your own mistake and fixing it publicly. The candidate wasn't wrong to propose Flink state—it was a sound decision for stream processing. The gap was in not fully internalizing the 'no backfill' constraint until an operational review surfaced it. That's when the risk profile became clear: low probability, asymmetric consequence. Most people would either defend the original design (probability is low, so it's fine) or quietly patch it. This candidate did neither. They documented the risk without softening, named their own discomfort explicitly ('I'd been one of the strongest advocates'), and proposed a cleaner redesign. The redesign wasn't about adding complexity for complexity's sake—it was about the right tool for each problem. MySQL for durability (what it's good at), Redis for performance (what it's good at), Flink for event processing (what it's good at). The team trusts this candidate because they've demonstrated they prioritize the system over their ego. That's what Earn Trust actually means in practice.",
        },
      ],
    },
  ],
};

const amazonEarnTrustSpainServiceId: TranscriptEntry = {
  summary: {
    slug: "amazon-earn-trust-spain-serviceid-compliance",
    title: "Earn Trust: Spain Compliance Reporting — Challenging Your Own Design",
    category: "behavioral",
    difficulty: Difficulty.MEDIUM,
    duration: 37,
    company: "Amazon",
    tags: [
      "Earn Trust",
      "Ownership",
      "Technical Design",
      "Compliance",
      "Risk Management",
      "Integrity",
      "System Design",
      "STAR Method",
      "Behavioral",
    ],
    description:
      "STAR-format behavioral interview. Candidate proposes storing trip-to-serviceId mapping in Flink state for Spain compliance reporting. Design is sound for stream processing: fast, no external dependencies, well-received in review. Weeks later, operational review surfaces constraint: Spain regulator doesn't support backfills. If an event is lost during outage, it's permanently unrecoverable. Candidate realizes Flink state is not suitable as authoritative source of truth for compliance identifiers—even low-probability failures have asymmetric consequences. Rather than defend original design, documents risk honestly, names discomfort (was strongest advocate), and proposes redesign: MySQL for durability, Redis for cache, Flink for event processing. Team trusts redesign because candidate prioritized system over ego.",
  },

  transcript,
};

export default amazonEarnTrustSpainServiceId;