// src/content/transcripts/behavioral/are-right-a-lot-labelling-deduplication.ts

import type { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";
import { Difficulty } from "@prisma/client";

const transcript: TranscriptData = {
  metadata: {
    title: "Are Right, A Lot — Deduplication vs. Scaling Decision at Deliveroo",
    difficulty: Difficulty.MEDIUM,
    duration: 46,
    template: "Amazon LP",
    category: "Leadership Principles",
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
            "Tell me about a time you had to make an important technical decision without having complete information. There were multiple reasonable paths forward, but you had to decide which one was actually right.",
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
            "Sure. This was at Deliveroo. I owned a pipeline that decided whether a restaurant was eligible for scheduled orders whenever its menu changed.",
        },
        {
          type: "text",
          value:
            "At some point we started seeing big queue backlogs during large menu updates.",
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
          value: "Okay. How big is 'big' here?",
        },
      ],
    },
    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 37,
      content: [
        {
          type: "text",
          value:
            "Bad enough that downstream systems started falling behind too, not just our own queue. Some restaurants would push hundreds of menu changes in one go, and those bursts were the ones that really hurt us.",
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
          value: "And you didn't know why yet at this point?",
        },
      ],
    },
    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 58,
      content: [
        {
          type: "text",
          value:
            "Right, that uncertainty was really the core of the decision. We knew we had a scaling problem. We didn't know what kind.",
        },
      ],
    },
    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 70,
      content: [
        {
          type: "text",
          value: "Walk me through the realistic explanations you were weighing.",
        },
      ],
    },
    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 78,
      content: [
        {
          type: "text",
          value:
            "The obvious one was that we'd just outgrown our capacity. Lambdas weren't keeping up, so scale concurrency and the database and the backlog goes away.",
        },
      ],
    },
    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 92,
      content: [
        { type: "text", value: "That's usually the first guess. What else?" },
      ],
    },
    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 98,
      content: [
        {
          type: "text",
          value:
            "The second was that we weren't actually underpowered — we were just doing unnecessary work. If the same restaurant got re-evaluated over and over during one burst, throwing more compute at it just makes us do the redundant work faster.",
        },
      ],
    },
    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 118,
      content: [
        { type: "text", value: "Interesting. And a third option?" },
      ],
    },
    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 124,
      content: [
        {
          type: "text",
          value:
            "Change the event model upstream so menu updates get batched before they ever reach us, instead of arriving as hundreds of individual events. That fixes it at the source, but it means coordinating across teams we didn't own.",
        },
      ],
    },
    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 145,
      content: [
        {
          type: "text",
          value:
            "So three paths, three very different amounts of effort and blast radius. Why not just start with the safest one — scale the infrastructure — and see if that's good enough?",
        },
      ],
    },
    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 160,
      content: [
        {
          type: "text",
          value:
            "Honestly, that was my first instinct too. But before recommending it I wanted to actually understand what a single event was making the system do.",
        },
      ],
    },
    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 173,
      content: [
        { type: "text", value: "What does one event represent?" },
      ],
    },
    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 179,
      content: [
        {
          type: "text",
          value:
            "One menu item being added, changed, or removed. Each one triggers a full eligibility re-evaluation for that restaurant, and if the answer changes, we publish downstream.",
        },
      ],
    },
    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 195,
      content: [
        {
          type: "text",
          value:
            "Wait — so if a restaurant updates 300 items, you're running that check 300 separate times?",
        },
      ],
    },
    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 203,
      content: [
        { type: "text", value: "Exactly. And that's what made me suspicious." },
      ],
    },
    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 209,
      content: [
        { type: "text", value: "Suspicious of what, specifically?" },
      ],
    },
    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 214,
      content: [
        {
          type: "text",
          value:
            "Whether all 300 of those evaluations were actually necessary, or whether we were just repeating the same conclusion over and over. So instead of looking at aggregate metrics, I pulled production traces and followed individual restaurants through the pipeline.",
        },
      ],
    },
    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 232,
      content: [
        { type: "text", value: "What were you actually looking for in the traces?" },
      ],
    },
    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 238,
      content: [
        {
          type: "text",
          value:
            "Whether eligibility was really changing every time we checked it. If it was, the work was legitimate and scaling made sense. If the answer rarely changed, then compute wasn't the constraint — it was the waste.",
        },
      ],
    },
    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 258,
      content: [{ type: "text", value: "And?" }],
    },
    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 262,
      content: [
        {
          type: "text",
          value:
            "One restaurant made it really obvious. It pushed 47 menu items in a single bulk update, so we processed 47 events.",
        },
      ],
    },
    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 274,
      content: [{ type: "text", value: "Okay, go on." }],
    },
    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 278,
      content: [
        {
          type: "text",
          value:
            "I traced every single evaluation. Once the restaurant crossed the eligibility threshold, every remaining evaluation reached the exact same conclusion. Forty-something evaluations, one meaningful outcome.",
        },
      ],
    },
    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 296,
      content: [
        {
          type: "text",
          value:
            "That's a striking example, but it's still one restaurant. Did you check whether it was a fluke?",
        },
      ],
    },
    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 306,
      content: [
        {
          type: "text",
          value:
            "I checked several other bulk updates from the same period. Same pattern every time. That's when I got confident the backlog was coming from redundant work, not a lack of compute.",
        },
      ],
    },
    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 324,
      content: [
        {
          type: "text",
          value:
            "So you're saying the system wasn't slow — it was just busy doing the same thing forty times when it needed to do it once.",
        },
      ],
    },
    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 336,
      content: [{ type: "text", value: "That's exactly it." }],
    },
    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 340,
      content: [
        {
          type: "text",
          value:
            "Okay, but finding redundant work is one thing. Deciding to redesign a production pipeline around it is another. Were you ready to recommend that at this point?",
        },
      ],
    },
    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 355,
      content: [
        {
          type: "text",
          value:
            "No, honestly, I wasn't convinced yet. There were two ways I could still be wrong.",
        },
      ],
    },
    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 366,
      content: [{ type: "text", value: "Such as?" }],
    },
    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 370,
      content: [
        {
          type: "text",
          value:
            "One, maybe the repeated evaluations were intentional — a restaurant's state could genuinely flip back and forth during a burst, and I just hadn't seen it. Two, maybe the real bottleneck was somewhere else entirely and the redundant work was just a coincidence I happened to notice.",
        },
      ],
    },
    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 392,
      content: [
        { type: "text", value: "So what did you do about that?" },
      ],
    },
    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 397,
      content: [
        {
          type: "text",
          value: "I tried to actively disprove my own hypothesis before I trusted it.",
        },
      ],
    },
    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 405,
      content: [{ type: "text", value: "How?" }],
    },
    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 409,
      content: [
        {
          type: "text",
          value:
            "First I checked whether eligibility could realistically oscillate during a burst — flip true, false, true again. I went through production traffic looking for it and basically couldn't find real examples.",
        },
      ],
    },
    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 428,
      content: [{ type: "text", value: "Basically, or actually couldn't?" }],
    },
    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 433,
      content: [
        {
          type: "text",
          value:
            "Actually couldn't, across every case I sampled. Almost every restaurant crossed the threshold once, if at all, and then just stayed there while the rest of the events came in behind it.",
        },
      ],
    },
    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 450,
      content: [
        {
          type: "text",
          value: "That covers the safety side. How did you get evidence it would actually fix throughput?",
        },
      ],
    },
    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 460,
      content: [
        {
          type: "text",
          value:
            "I replayed a real production event stream from one of our busiest windows and asked: what if we only evaluated a restaurant once per five-minute window instead of on every single menu event?",
        },
      ],
    },
    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 476,
      content: [{ type: "text", value: "Not building anything yet, just simulating?" }],
    },
    {
      id: "44",
      role: "candidate",
      elapsedSeconds: 481,
      content: [
        {
          type: "text",
          value:
            "Right, just estimating impact first. The drop was bigger than I expected — roughly a ninety percent reduction in evaluations.",
        },
      ],
    },
    {
      id: "45",
      role: "interviewer",
      elapsedSeconds: 494,
      content: [
        {
          type: "text",
          value: "Ninety percent is a big claim. Hold on — where did five minutes even come from? That sounds arbitrary.",
        },
      ],
    },
    {
      id: "46",
      role: "candidate",
      elapsedSeconds: 508,
      content: [
        {
          type: "text",
          value:
            "It kind of was, at first. I'd picked it as a round number to test the mechanism, not because I'd justified it. That's actually the piece I almost skipped.",
        },
      ],
    },
    {
      id: "47",
      role: "interviewer",
      elapsedSeconds: 522,
      content: [
        { type: "text", value: "So how did you know it wasn't a business risk?" },
      ],
    },
    {
      id: "48",
      role: "candidate",
      elapsedSeconds: 528,
      content: [
        {
          type: "text",
          value:
            "I went and looked at historical order data instead of guessing. The median time between a restaurant becoming eligible and actually receiving its first scheduled order was around forty-five minutes.",
        },
      ],
    },
    {
      id: "49",
      role: "interviewer",
      elapsedSeconds: 546,
      content: [{ type: "text", value: "So a five-minute delay disappears next to that." }],
    },
    {
      id: "50",
      role: "candidate",
      elapsedSeconds: 553,
      content: [
        {
          type: "text",
          value:
            "Right — it's noise. That's what let me trade a small amount of freshness for a huge drop in load without any real customer impact. At that point I felt like I had enough to actually propose it.",
        },
      ],
    },
    {
      id: "51",
      role: "interviewer",
      elapsedSeconds: 570,
      content: [
        {
          type: "text",
          value: "Okay, that's a solid case. Did the rollout go the way the simulation predicted?",
        },
      ],
    },
    {
      id: "52",
      role: "candidate",
      elapsedSeconds: 580,
      content: [
        { type: "text", value: "Not entirely, no." },
      ],
    },
    {
      id: "53",
      role: "interviewer",
      elapsedSeconds: 585,
      content: [{ type: "text", value: "What went wrong?" }],
    },
    {
      id: "54",
      role: "candidate",
      elapsedSeconds: 589,
      content: [
        {
          type: "text",
          value:
            "We deployed the deduplication window keyed off restaurant ID, since that's the obvious key. Within the first day we started seeing some restaurants get stale eligibility results in a way we hadn't predicted.",
        },
      ],
    },
    {
      id: "55",
      role: "interviewer",
      elapsedSeconds: 606,
      content: [{ type: "text", value: "Stale how? Give me an example." }],
    },
    {
      id: "56",
      role: "candidate",
      elapsedSeconds: 611,
      content: [
        {
          type: "text",
          value:
            "Some restaurants operate the same restaurant ID across multiple markets, or under multiple mission types — think grocery versus restaurant delivery on the same account. We were deduplicating across all of those as if they were one thing, so an update in one market could suppress an evaluation that a different market actually needed.",
        },
      ],
    },
    {
      id: "57",
      role: "interviewer",
      elapsedSeconds: 634,
      content: [
        {
          type: "text",
          value: "So the key was too coarse. What did you change it to?",
        },
      ],
    },
    {
      id: "58",
      role: "candidate",
      elapsedSeconds: 641,
      content: [
        {
          type: "text",
          value:
            "Mission plus market plus restaurant ID together, not restaurant ID alone. That gave us dedup windows that actually matched the boundary where eligibility is independently meaningful.",
        },
      ],
    },
    {
      id: "59",
      role: "interviewer",
      elapsedSeconds: 658,
      content: [
        {
          type: "text",
          value: "Was that the only surprise, or did more show up once traffic dropped?",
        },
      ],
    },
    {
      id: "60",
      role: "candidate",
      elapsedSeconds: 668,
      content: [
        {
          type: "text",
          value:
            "One more, actually. Once evaluation volume dropped, I expected queue time to drop proportionally too, but it didn't fully.",
        },
      ],
    },
    {
      id: "61",
      role: "interviewer",
      elapsedSeconds: 682,
      content: [{ type: "text", value: "So there was a second bottleneck hiding underneath the first one." }],
    },
    {
      id: "62",
      role: "candidate",
      elapsedSeconds: 688,
      content: [
        {
          type: "text",
          value:
            "There was. The rule engine we called for each eligibility check was reloading and recompiling the same restaurant's ruleset on almost every invocation instead of caching it, and that had just been masked before by the bigger problem.",
        },
      ],
    },
    {
      id: "63",
      role: "interviewer",
      elapsedSeconds: 706,
      content: [{ type: "text", value: "Was that a quick fix once you found it?" }],
    },
    {
      id: "64",
      role: "candidate",
      elapsedSeconds: 711,
      content: [
        {
          type: "text",
          value:
            "Relatively — adding a short-lived cache keyed the same way as the dedup window closed most of the remaining gap. It wasn't the headline fix, but without it we wouldn't have gotten the full benefit.",
        },
      ],
    },
    {
      id: "65",
      role: "interviewer",
      elapsedSeconds: 728,
      content: [
        {
          type: "text",
          value: "Where did things end up once both fixes were in place?",
        },
      ],
    },
    {
      id: "66",
      role: "candidate",
      elapsedSeconds: 736,
      content: [
        {
          type: "text",
          value:
            "Downstream writes dropped dramatically since we weren't re-publishing the same eligibility result over and over. The backlog during bulk menu updates basically went away.",
        },
      ],
    },
    {
      id: "67",
      role: "interviewer",
      elapsedSeconds: 752,
      content: [{ type: "text", value: "Did that change anything operationally, day to day?" }],
    },
    {
      id: "68",
      role: "candidate",
      elapsedSeconds: 758,
      content: [
        {
          type: "text",
          value:
            "Yeah — bulk menu updates used to reliably page whoever was on call. After this shipped, that stopped being a thing we had to staff for. Infra cost came down too, since we weren't scaling compute to survive the redundant load anymore.",
        },
      ],
    },
    {
      id: "69",
      role: "interviewer",
      elapsedSeconds: 780,
      content: [
        {
          type: "text",
          value:
            "Looking back, what would you say the actual lesson was here? Not the technical fix — the decision-making part.",
        },
      ],
    },
    {
      id: "70",
      role: "candidate",
      elapsedSeconds: 792,
      content: [
        {
          type: "text",
          value:
            "That the cheapest-looking option isn't automatically the right one. Scaling infrastructure would have made the symptom less painful for a while and cost us real money doing it, without ever touching the actual cause.",
        },
      ],
    },
    {
      id: "71",
      role: "interviewer",
      elapsedSeconds: 810,
      content: [
        { type: "text", value: "And the traces were really what changed your mind." },
      ],
    },
    {
      id: "72",
      role: "candidate",
      elapsedSeconds: 816,
      content: [
        {
          type: "text",
          value:
            "Completely. I could have written a very reasonable-sounding proposal to scale up without ever looking at a single trace. It just wouldn't have been right — it would have been the obvious answer instead of the correct one.",
        },
      ],
    },
  ],
};

const areRightALotLabellingDeduplication: TranscriptEntry = {
  summary: {    id: 1,

    slug: "are-right-a-lot-labelling-deduplication",
    title:
      "Are Right, A Lot — Deduplication vs. Scaling Decision at Deliveroo",
    category: "behavioral",
    difficulty: Difficulty.HARD,
    duration: 46,
    company: ["Deliveroo"],
    tags: [
      "Leadership Principles",
      "Are Right, A Lot",
      "Decision-Making Under Uncertainty",
      "Root Cause Analysis",
      "Data-Driven Reasoning",
      "Hypothesis Validation",
      "System Design",
      "Architecture",
      "Risk Mitigation",
      "STAR Method",
      "Behavioral Interview",
    ],
    description:
      "Faced decision about how to handle queue buildup during bulk menu updates. Three competing hypotheses: (1) insufficient compute—scale horizontally, (2) redundant work—defer and deduplicate, (3) upstream batching—change event schema. Candidate investigated production data and discovered that bulk menu updates trigger hundreds of events for the same restaurant, but partner eligibility depends only on item count. Realized redundant evaluation was the actual root cause. Simulated deduplication: 50K+ evaluations/hour → <5K evaluations/hour (90% reduction). Validated business impact: median 45-minute order booking time makes 5-minute delay negligible. Deployed but discovered deduplication key needed mission+market+restaurant (not just restaurant_id). Also discovered secondary bottleneck in rule engine caching. Results validated original hypothesis: downstream writes dropped dramatically, system stopped requiring oncall during bulk updates, cost reduced. Proof that addressing the correct root cause is fundamentally different from scaling.",
  },

  transcript,
};

export default areRightALotLabellingDeduplication;