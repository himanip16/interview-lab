// src/content/transcripts/behavioral/thrift-grpc-migration.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Thrift to gRPC Migration — Disagree and Commit",
    difficulty: Difficulty.HARD,
    company: "Amazon",
    duration: 40,
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
            "Tell me about a time you disagreed with a plan or a timeline and had to push back on it, but still committed fully once a decision was made.",
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
            "Sure — at Uber, I was on a backend service on the Data Compliance platform. The org was migrating internal service communication from Thrift to gRPC, and the initial estimate for our service was around five days.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 35,
      content: [
        { type: "text", value: "Five days for what, exactly — implementing the new server, or the whole migration end to end?" },
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
            "As I remember it, the five days was really just scoped to standing up the gRPC server side. It didn't account for anything past that, which was kind of the whole problem.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 62,
      content: [
        { type: "text", value: "Why was that more than just swapping a library?" },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 80,
      content: [
        {
          type: "text",
          value:
            "Because it wasn't just our service — there were, I want to say around a dozen or so internal consumers, each on their own release cadence. A straight cutover would've meant coordinating all of them to switch at basically the same moment, which isn't really how distributed teams operate in practice.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 95,
      content: [
        { type: "text", value: "So what did you actually do instead of just accepting the five-day number?" },
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
            "I sat down and broke the work into pieces — interface changes, what client compatibility actually required, how we'd sequence deployment, how consumers would migrate on their own timeline, testing, observability, and a rollback plan.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 125,
      content: [
        { type: "text", value: "Walk me through backward compatibility specifically. How do you keep Thrift and gRPC consumers both working during the transition?" },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 140,
      content: [
        {
          type: "text",
          value:
            "So... the way I remember approaching it, the service exposed both protocols side by side for a while. The existing Thrift interface stayed up, and we stood up gRPC alongside it rather than replacing it outright. Consumers moved over whenever their team was actually ready, not on our schedule.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 155,
      content: [
        { type: "text", value: "Doesn't running two protocols simultaneously double your operational surface? What does that actually cost you?" },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 172,
      content: [
        {
          type: "text",
          value:
            "Yeah, it does — two code paths to keep healthy, two things to monitor, and a real chance of subtle serialization differences that don't show up until a consumer hits some edge case. It's more overhead short-term, but it's the price for not forcing everyone to flip at once.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 185,
      content: [
        { type: "text", value: "Give me a concrete failure mode you were actually worried about — not abstractly, something specific." },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 202,
      content: [
        {
          type: "text",
          value:
            "Timeout behavior was one that stuck with me. Thrift and gRPC don't necessarily default to the same timeout semantics, so a consumer that had tuned their client around Thrift's behavior could suddenly see different failure patterns just from switching transports, even with no business logic changing at all.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 215,
      content: [
        { type: "text", value: "How would you have caught that before it hit production?" },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 230,
      content: [
        {
          type: "text",
          value:
            "Honestly, I don't think we caught every instance of that ahead of time — some of it we found because we were watching closely during rollout, not because we'd predicted it perfectly in advance. That's part of why the phased approach mattered — the blast radius of getting something like that wrong stayed small instead of hitting everyone.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 245,
      content: [
        { type: "text", value: "Let's get into the phased rollout itself. What did the phases actually look like?" },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 262,
      content: [
        {
          type: "text",
          value:
            "If I'm recalling it right, we didn't flip everyone at once — started with one or two lower-traffic consumers first, let that run for a bit, checked things looked healthy, then expanded out, rather than going straight to the highest-traffic consumers up front.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 275,
      content: [
        { type: "text", value: "How long did you let each phase bake before moving to the next?" },
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
            "I want to say somewhere around a few days per phase — enough to catch things that only show up under real traffic patterns, not just right after deploy. Though I'll be honest, I don't remember the exact number of days for every single phase, it wasn't a fixed formula, it was more 'does this look stable, then move on.'",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 305,
      content: [
        { type: "text", value: "What metrics were you actually watching to decide 'this looks stable'?" },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 322,
      content: [
        {
          type: "text",
          value:
            "Error rate was the big one, compared against the Thrift baseline for that same consumer, not just an absolute number. Latency too, since gRPC's serialization overhead isn't identical to Thrift's, so I wanted to see p99 wasn't creeping up. And basic throughput — making sure requests were actually completing at the rate they should be.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 338,
      content: [
        { type: "text", value: "Say error rate ticked up during one of those phases. What's your actual trigger for rolling back, versus just watching it longer?" },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 355,
      content: [
        {
          type: "text",
          value:
            "That's a fair question, and I don't think we had a perfectly crisp number going in, if I'm being honest — it was more judgment in the moment, is this a small blip or a sustained trend. If I had to define it after the fact, I'd say a meaningful, sustained jump over baseline, not just a single spike, is what should trigger a rollback rather than waiting it out.",
        },
        {
          id: "highlight-honest-uncertainty",
          type: "highlight",
          status: "strong",
          value: "don't think we had a perfectly crisp number going in",
          explanation:
            "Admits the rollback threshold wasn't precisely defined in the moment rather than retrofitting a clean number after the fact, then still offers a reasonable articulation of it — honest about the gap without dodging the question.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 370,
      content: [
        { type: "text", value: "How would you actually roll back, mechanically, if a consumer started failing after moving to gRPC?" },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 388,
      content: [
        {
          type: "text",
          value:
            "Since the Thrift path was still alive the whole time, rolling back mostly meant having that consumer point their client back at the Thrift interface. It wasn't a from-scratch redeploy of anything — more like flipping which interface they were calling.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 400,
      content: [
        { type: "text", value: "So the rollback plan was really just 'the old thing never went away' — is that actually a rollback plan, or is that just not having migrated yet?" },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 418,
      content: [
        {
          type: "text",
          value:
            "...That's a fair way to put it, honestly. I think the real rollback plan is more specific than just 'the old path exists' — it's making sure the consumer's config or client pointer is something we can flip quickly without them redeploying their own service, and that we'd actually validated the Thrift path was still fully functional the whole time, not just technically still running. So it's less 'nothing was removed' and more 'we kept it a first-class, tested option the entire way through,' if that makes sense.",
        },
        {
          id: "highlight-rollback-reframe",
          type: "highlight",
          status: "strong",
          value: "we kept it a first-class, tested option the entire way through",
          explanation:
            "Doesn't just concede the interviewer's challenge — pushes back on the reframing and sharpens what actually made it a rollback plan (validated, flip-able, no redeploy required) rather than accepting 'we just didn't remove the old thing' at face value.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 432,
      content: [
        { type: "text", value: "What trade-off did you make between migration speed and operational safety, concretely?" },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 448,
      content: [
        {
          type: "text",
          value:
            "The phased approach is just slower — instead of one deployment window, it stretched out to meaningfully longer than the original five days. I don't have the exact final number in front of me, but it was a real stretch, not a rounding error. The trade was accepting that longer timeline so the blast radius of any one mistake stayed small instead of hitting every consumer at once.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 462,
      content: [
        { type: "text", value: "If leadership had insisted on the original five-day timeline, what would you actually have done?" },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 480,
      content: [
        {
          type: "text",
          value:
            "I'd have pushed back with the specific risks laid out — not 'this feels risky' but the actual scenarios, like a subset of consumers breaking simultaneously with no isolation. If they still wanted to hold the timeline after that, I think the honest move is making sure the risk acceptance is explicit and documented, coming from whoever owns that call, rather than me quietly going along with it and owning the fallout alone if it went wrong.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 495,
      content: [
        { type: "text", value: "Is that actually 'disagree and commit,' or is that just disagreeing and making someone else commit?" },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 512,
      content: [
        {
          type: "text",
          value:
            "Ha — that's a good distinction, actually. I think disagree and commit means once the decision's made with full information on the table, you commit to executing it well, even if it's not what you'd have picked. It doesn't mean you personally have to agree the risk was the right call — it means you don't sandbag it or drag your feet because you were overruled. In this case it didn't come to that, since the team actually did agree with the phased plan once we walked through it, so I didn't end up needing to test that version of myself.",
        },
        {
          id: "highlight-disagree-and-commit-distinction",
          type: "highlight",
          status: "strong",
          value: "doesn't mean you personally have to agree the risk was the right call",
          explanation:
            "Catches a real distinction the interviewer's pushback exposed — between escalating a documented risk decision and genuinely 'committing' to it — and is candid that this particular story never actually tested that harder version of the principle.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 528,
      content: [
        { type: "text", value: "Looking back, what would you actually improve about how you ran this?" },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 545,
      content: [
        {
          type: "text",
          value:
            "Probably earlier automated contract testing between the Thrift and gRPC interfaces, so some of those edge-case behavior differences — like the timeout thing — got caught before a phase even started, instead of us relying so much on watching production closely during rollout. That was more reactive than I'd like.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 558,
      content: [
        { type: "text", value: "Good, that's what I wanted to dig into. Let's stop there." },
      ],
    },

    {
      id: "38",
      role: "takeaway",
      elapsedSeconds: 575,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the story holds up under drill-down because the candidate stays honest about what wasn't precisely defined in the moment — the rollback trigger, the exact phase durations, the final timeline overrun — rather than retrofitting clean numbers after the fact. Two moments matter most: pushing back on the interviewer's reframing of the rollback plan instead of just conceding it, and, when challenged on whether 'escalate and document the risk' is really disagree-and-commit, drawing the real distinction between committing to execute a decision well and personally agreeing the decision was right — while being candid that this particular story never had to test that harder version.",
        },
      ],
    },
  ],
};

const amazonThriftGrpcMigrationBehavioral: TranscriptEntry = {
  summary: {    id: 5,

    slug: "amazon-thrift-grpc-migration-behavioral",
    title: "Thrift to gRPC Migration — Disagree and Commit",
    category: "behavioral",
    difficulty: Difficulty.HARD,
    duration: 40,
    company: "Amazon",
    tags: [
      "Behavioral",
      "Leadership Principles",
      "Disagree and Commit",
      "Distributed Systems",
      "Migration",
      "Ownership",
    ],
    description:
      "SDE2 behavioral interview with bar-raiser-style technical drill-down on a Thrift-to-gRPC migration story. Covers why the migration was more than a library swap, the dual-protocol backward-compatibility approach, concrete failure modes, phased rollout mechanics and monitoring, a pushback-and-reframe on what actually makes a rollback plan real, and a sharp distinction between escalating a documented risk and genuinely disagreeing and committing.",
  },

  transcript,
};

export default amazonThriftGrpcMigrationBehavioral;