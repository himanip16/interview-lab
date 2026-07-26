// src/content/transcripts/behavioral/are-right-a-lot-labelling-deduplication.ts

import type { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";
import { Difficulty } from "@prisma/client";

const transcript: TranscriptData = {
  metadata: {
    title: "Are Right, A Lot — Deduplication vs. Scaling Decision at Deliveroo",
    difficulty: Difficulty.MEDIUM,
    duration: 34,
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
        "Tell me about a time you had to make an important technical decision without having complete information. There were multiple reasonable paths forward, but you had to decide which one was actually right. What was the situation?",
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
        "This happened at Deliveroo. I was working on a pipeline responsible for determining whether restaurants were eligible for scheduled orders whenever their menu changed.",
    },
    {
      type: "text",
      value:
        "We started seeing long queue backlogs during large menu updates. Some restaurants would publish hundreds of menu changes at once, and those events would take much longer than expected to process. As the backlog grew, downstream systems also started falling behind.",
    },
    {
      type: "text",
      value:
        "At that point we knew we had a scaling problem, but we didn't actually know why it was happening. That uncertainty was the real decision I had to make.",
    },
  ],
},

{
  id: "3",
  role: "interviewer",
  elapsedSeconds: 52,
  content: [
    {
      type: "text",
      value:
        "When you say you didn't know why, what were the realistic possibilities? I'm trying to understand whether this was genuinely ambiguous or whether the answer became obvious once you looked.",
    },
  ],
},

{
  id: "4",
  role: "candidate",
  elapsedSeconds: 72,
  content: [
    {
      type: "text",
      value:
        "There were several explanations that all sounded reasonable at the time.",
    },
    {
      type: "text",
      value:
        "The first was simply that we'd outgrown our current capacity. If Lambdas weren't processing messages quickly enough, increasing concurrency and scaling the database would probably reduce the backlog. That's usually the first thing people think about when queues start growing.",
    },
    {
      type: "text",
      value:
        "The second possibility was that the system wasn't actually underpowered—it was doing unnecessary work. If the same restaurant was being evaluated repeatedly during a burst of menu updates, then adding more compute would only let us perform the redundant work faster.",
    },
    {
      type: "text",
      value:
        "The third option was changing the event model itself so upstream services would batch menu updates instead of emitting hundreds of individual events. That would reduce traffic, but it meant coordinating changes across multiple teams and services.",
    },
    {
      type: "text",
      value:
        "The difficult part was that each solution solved a different problem. If I picked the wrong explanation, we could spend weeks implementing something that either cost more than necessary or didn't actually fix the bottleneck.",
    },
  ],
},

{
  id: "5",
  role: "interviewer",
  elapsedSeconds: 146,
  content: [
    {
      type: "text",
      value:
        "That's a good set of options. Before we get into what you chose, why didn't you simply start with the least risky approach and scale the infrastructure? If that reduced the backlog, wouldn't that have been good enough?",
    },
  ],
},
{
  id: "6",
  role: "candidate",
  elapsedSeconds: 165,
  content: [
    {
      type: "text",
      value:
        "My first instinct was the same as everyone else's: maybe we just needed more compute. But before recommending that, I wanted to understand what each event was actually causing the system to do.",
    },
  ],
},

{
  id: "7",
  role: "interviewer",
  elapsedSeconds: 180,
  content: [
    {
      type: "text",
      value:
        "What did a single event represent, and what happened when one arrived?",
    },
  ],
},

{
  id: "8",
  role: "candidate",
  elapsedSeconds: 194,
  content: [
    {
      type: "text",
      value:
        "Each event represented a single menu item being added, updated, or removed. When one arrived, our service would re-evaluate whether that restaurant was eligible for scheduled orders. If the eligibility changed, we'd publish downstream updates so other services could react.",
    },
  ],
},

{
  id: "9",
  role: "interviewer",
  elapsedSeconds: 214,
  content: [
    {
      type: "text",
      value:
        "So if a restaurant updated 300 menu items, you'd run that eligibility check 300 times?",
    },
  ],
},

{
  id: "10",
  role: "candidate",
  elapsedSeconds: 223,
  content: [
    {
      type: "text",
      value:
        "Exactly. That immediately made me wonder whether all of those evaluations were actually necessary, or whether we were just repeating the same work over and over. So I pulled production traces from a few recent bulk menu updates and followed individual restaurants through the pipeline instead of looking at aggregate metrics.",
    },
  ],
},

{
  id: "11",
  role: "interviewer",
  elapsedSeconds: 251,
  content: [
    {
      type: "text",
      value:
        "What were you looking for in those traces?",
    },
  ],
},

{
  id: "12",
  role: "candidate",
  elapsedSeconds: 259,
  content: [
    {
      type: "text",
      value:
        "I wanted to know whether the restaurant's eligibility was actually changing every time we evaluated it. If it was, then the work was legitimate and scaling the system would probably make sense. But if the answer rarely changed, then we weren't constrained by compute—we were wasting compute.",
    },
  ],
},

{
  id: "13",
  role: "interviewer",
  elapsedSeconds: 286,
  content: [
    {
      type: "text",
      value:
        "And what did you find?",
    },
  ],
},

{
  id: "14",
  role: "candidate",
  elapsedSeconds: 294,
  content: [
    {
      type: "text",
      value:
        "One restaurant made the pattern really obvious. It added 47 menu items in a single bulk update, so we processed 47 events. I traced every evaluation, and after the restaurant crossed the eligibility threshold, every remaining evaluation reached exactly the same conclusion. We were repeatedly executing the same business logic even though nothing meaningful had changed. I checked several other bulk updates and saw the same pattern, which gave me confidence that the queue buildup was coming from redundant work rather than a lack of compute.",
    },
  ],
},

{
  id: "15",
  role: "interviewer",
  elapsedSeconds: 338,
  content: [
    {
      type: "text",
      value:
        "Finding redundant work is one thing. Deciding to redesign a production pipeline is another. What convinced you that you had enough evidence to recommend that change?",
    },
  ],
},
{
  id: "16",
  role: "candidate",
  elapsedSeconds: 356,
  content: [
    {
      type: "text",
      value:
        "I still wasn't ready to recommend a redesign. There were a couple of things that could have made my conclusion wrong. One possibility was that the repeated evaluations were intentional because the restaurant's state could legitimately change between events. Another was that the real bottleneck was somewhere else, and the redundant work was just something I happened to notice. So before proposing anything, I tried to disprove my own hypothesis.",
    },
  ],
},

{
  id: "17",
  role: "interviewer",
  elapsedSeconds: 385,
  content: [
    {
      type: "text",
      value:
        "How did you do that?",
    },
  ],
},

{
  id: "18",
  role: "candidate",
  elapsedSeconds: 392,
  content: [
    {
      type: "text",
      value:
        "First I checked whether eligibility could realistically oscillate during a burst of menu updates. Looking through production traffic, I couldn't find examples where it kept flipping back and forth. Almost every restaurant crossed the threshold once, if at all, and then stayed there while the remaining events were processed.",
    },
  ],
},

{
  id: "19",
  role: "interviewer",
  elapsedSeconds: 416,
  content: [
    {
      type: "text",
      value:
        "That explains why deduplication might be safe. How did you convince yourself it would actually solve the throughput problem?",
    },
  ],
},

{
  id: "20",
  role: "candidate",
  elapsedSeconds: 426,
  content: [
    {
      type: "text",
      value:
        "I replayed a production event stream from one of our busiest periods and asked a simple question: what if we only evaluated a restaurant once within a five-minute window instead of on every menu event? I wasn't trying to build the feature yet—I just wanted to estimate the impact. The reduction was much larger than I expected. The number of evaluations dropped by roughly ninety percent.",
    },
  ],
},

{
  id: "21",
  role: "interviewer",
  elapsedSeconds: 455,
  content: [
    {
      type: "text",
      value:
        "Five minutes sounds like a pretty arbitrary number. Why wasn't that a business risk?",
    },
  ],
},

{
  id: "22",
  role: "candidate",
  elapsedSeconds: 465,
  content: [
    {
      type: "text",
      value:
        "That was something I almost missed initially. The engineering side looked great, but I hadn't yet checked whether the business actually needed immediate activation. So I looked at historical order data. Restaurants typically waited much longer than five minutes before receiving their first scheduled order after becoming eligible. That told me we could trade a small amount of freshness for a very large reduction in load without creating a noticeable customer impact.",
    },
  ],
},

{
  id: "23",
  role: "interviewer",
  elapsedSeconds: 498,
  content: [
    {
      type: "text",
      value:
        "Okay. So you have evidence that it's safe and evidence that it should help. Did implementation go exactly as you expected?",
    },
  ],
}
  ],
};

const areRightALotLabellingDeduplication: TranscriptEntry = {
  summary: {
    slug: "are-right-a-lot-labelling-deduplication",
    title:
      "Are Right, A Lot — Deduplication vs. Scaling Decision at Deliveroo",
    category: "behavioral",
    difficulty: Difficulty.HARD,
    duration: 34,
    company: "Deliveroo",
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