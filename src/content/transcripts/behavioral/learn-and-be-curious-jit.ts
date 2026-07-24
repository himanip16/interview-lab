// src/content/transcripts/behavioral/learn-curious-ownership-jit-incident.ts

import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Learn & Be Curious + Ownership: Order Release JIT Incident Investigation",
    difficulty: Difficulty.MEDIUM,
    duration: 38,
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
            "Tell me about a time when you had to jump into something completely unfamiliar and figure it out under pressure.",
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
            "Yeah, so... I'd been at Deliveroo for about two weeks when I got assigned to the order logistics team.",
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
          value: "Okay, so completely new to the team.",
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
            "Right. And I inherited eight to nine services that I'd never touched. The codebase was totally new to me. But then basically on my third week, there's this DLQ spike.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 58,
      content: [
        {
          type: "text",
          value: "What's getting backed up?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 72,
      content: [
        {
          type: "text",
          value:
            "Order release queue. We're seeing like 500 messages per day going to DLQ starting on the 16th. That's... that's not normal.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 88,
      content: [
        {
          type: "text",
          value: "Did you have any context on the system, or...?",
        },
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
            "Barely. I mean, I understood at a high level—orders come in, they get scheduled or they're ASAP, then they move through pipelines. But the actual mechanics? No idea.",
        },
        {
          id: "highlight-knowledge-gap",
          type: "highlight",
          status: "missed",
          value: "I could have asked for a runbook, but I just started digging instead",
          explanation:
            "The instinct to dive into the codebase instead of pausing to get context is common but costs time. A newer engineer might have asked the team for documentation or a walkthrough first, which would've sped up understanding the JIT concept.",
        },
        {
          type: "text",
          value: " So I had to learn it while investigating.",
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
          value: "What was your first move?",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 145,
      content: [
        {
          type: "text",
          value:
            "I pulled a sample of the DLQ messages. Started reading through them to see if there was a pattern in the errors.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 160,
      content: [
        {
          type: "text",
          value: "And?",
        },
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
            "Nothing. That's the thing. No error logs. No specific failure message. Just... messages failing silently and bouncing to DLQ.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 188,
      content: [
        {
          type: "text",
          value: "That's actually harder. So what'd you do?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 205,
      content: [
        {
          type: "text",
          value:
            "I extracted all the order IDs from the DLQ into a document. Then I dumped them into Snowflake and ran some queries to see what these orders had in common.",
        },
        {
          id: "highlight-data-investigation",
          type: "highlight",
          status: "strong",
          value: "I queried the events table to see order status, release time, whether they were scheduled, and their JIT timestamps",
          explanation:
            "Moving from passive log-reading to active data investigation—setting up a query that captures the full order lifecycle—is what reveals patterns that error logs don't. This is the difference between looking at symptoms and understanding the system.",
        },
        {
          type: "text",
          value: "",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 225,
      content: [
        {
          type: "text",
          value: "What'd you find?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 242,
      content: [
        {
          type: "text",
          value:
            "So all the orders in the DLQ were scheduled orders. ASAP orders were fine. And they all had this JIT timestamp that was like... hours in the future.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 260,
      content: [
        {
          type: "text",
          value: "JIT is... just-in-time scheduling?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 275,
      content: [
        {
          type: "text",
          value:
            "Yeah. It's the calculated time when we should send the order to the restaurant kitchen so it's ready exactly when a rider is available. It factors in rider availability, weather, traffic, all that.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 295,
      content: [
        {
          type: "text",
          value: "So why would scheduled orders with far-future JIT times be failing?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 312,
      content: [
        {
          type: "text",
          value:
            "I didn't know at first. So I dug into the code. The order release queue is an SQS queue. And SQS has this hard limit—",
        },
        {
          id: "highlight-constraint-discovery",
          type: "highlight",
          status: "strong",
          value: "maximum delay is 15 minutes. You cannot hold a message for longer than 900 seconds",
          explanation:
            "Discovering a platform constraint that directly contradicts the business requirement is the pivot point. This is when 'we're getting failures' becomes 'the architecture is wrong for this use case.'",
        },
        {
          type: "text",
          value:
            ". If a scheduled order's JIT time is two hours away, SQS can't hold it.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 335,
      content: [
        {
          type: "text",
          value: "So what happens when you try?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 352,
      content: [
        {
          type: "text",
          value:
            "The message times out. And then we retry. We have this re-queueing logic—every 15 minutes we re-enqueue the message back into the order release queue. But we only allow up to nine retries. So nine retries times 15 minutes is only 135 minutes.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 375,
      content: [
        {
          type: "text",
          value: "And if the JIT is further than that?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 390,
      content: [
        {
          type: "text",
          value:
            "Goes to DLQ. And here's the thing—on the 16th, another team started calculating JIT for scheduled orders. Before that, scheduled orders didn't have JIT. They just got released immediately.",
        },
        {
          id: "highlight-root-cause",
          type: "highlight",
          status: "strong",
          value: "The change in JIT calculation for scheduled orders exposed an architectural mismatch",
          explanation:
            "Connecting the timeline (16th spike = 16th feature launch) to the root cause (new JIT calculation + SQS 15-min limit) is what moves from 'this is broken' to 'this was always broken, the new feature just exposed it.'",
        },
        {
          type: "text",
          value: "",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 410,
      content: [
        {
          type: "text",
          value: "So what'd you do about it?",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 428,
      content: [
        {
          type: "text",
          value:
            "Short term? We stopped routing scheduled orders to the order release queue at all. Only ASAP orders go through. That killed the DLQ spike immediately.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 448,
      content: [
        {
          type: "text",
          value: "That's a band-aid though.",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 465,
      content: [
        {
          type: "text",
          value:
            "Yeah. At the time we just needed the spike gone. But it meant scheduled orders with JIT weren't being released to the kitchen at the right time anymore.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 482,
      content: [
        {
          type: "text",
          value: "Did you think about a better fix?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 500,
      content: [
        {
          type: "text",
          value:
            "Not immediately. But after, yeah. SQS is just the wrong tool for long-term scheduling. The max 15-minute delay kills it.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 520,
      content: [
        {
          type: "text",
          value: "What would be better?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 538,
      content: [
        {
          type: "text",
          value:
            "DynamoDB. Store the order with a ReleaseTimestamp attribute. Then either use DynamoDB Streams or a scheduled Lambda poller that runs every minute—when the timestamp hits, push the order into the queue.",
        },
        {
          id: "highlight-better-architecture",
          type: "highlight",
          status: "strong",
          value: "DynamoDB holds the order state, a poller releases it at the right time—decouples storage from the 15-minute SQS limit",
          explanation:
            "Proposing a specific architecture that fixes the root constraint (SQS delay limit) rather than working around it shows you've learned not just what failed, but why the failure happened and what the right abstraction is.",
        },
        {
          type: "text",
          value:
            " That way orders can sit for hours if they need to, and we release them exactly when JIT time arrives.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 568,
      content: [
        {
          type: "text",
          value: "Did you implement that?",
        },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 585,
      content: [
        {
          type: "text",
          value:
            "No. Not in that incident. We were in triage mode. But I documented it. And I used the rest of that incident—the investigation, the Snowflake queries, the timeline analysis—to make the case to the team that we needed to revisit it.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 610,
      content: [
        {
          type: "text",
          value: "Did that lead anywhere?",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 625,
      content: [
        {
          type: "text",
          value:
            "Eventually. It got on the backlog as a technical debt item. We didn't implement it immediately, but ",
        },
        {
          id: "highlight-impact-metrics",
          type: "highlight",
          status: "strong",
          value: "the investigation reduced DLQ resolution time from 'we don't know' to 'we know exactly why this is happening'",
          explanation:
            "Quantifying impact not just as 'we fixed the spike' but as 'we eliminated ambiguity and gave the team a clear path forward' shows ownership of the entire problem-solving process, not just the immediate fix.",
        },
        {
          type: "text",
          value:
            ". That changed how we think about scheduling at this scale.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 648,
      content: [
        {
          type: "text",
          value: "What did you learn from this?",
        },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 668,
      content: [
        {
          type: "text",
          value:
            "Two things, actually. First, ",
        },
        {
          id: "highlight-context-first",
          type: "highlight",
          status: "missed",
          value: "I should have asked for context before diving into the code",
          explanation:
            "Jumping into the codebase first—instead of asking for a runbook, a team walkthrough, or even just a 10-minute sync—cost time. Curiosity needs a target. A senior engineer would have spent 15 minutes understanding the architecture first.",
        },
        {
          type: "text",
          value:
            ". I was new, and I could've asked the team for a runbook or even just... sat down and listened.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 692,
      content: [
        {
          type: "text",
          value: "And the second?",
        },
      ],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 710,
      content: [
        {
          type: "text",
          value:
            "When you find a root cause, don't just fix the symptom. Spend time thinking about what the real fix should be, even if you can't ship it today. I had the architecture answer pretty quickly, but I didn't push hard on getting it prioritized because the spike was handled.",
        },
      ],
    },

    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 738,
      content: [
        {
          type: "text",
          value: "Anything else?",
        },
      ],
    },

    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 755,
      content: [
        {
          type: "text",
          value:
            "That's the main stuff. The Snowflake investigation was the turning point—that's what unlocked understanding the system.",
        },
      ],
    },

    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 772,
      content: [
        {
          type: "text",
          value: "Got it. Thanks for walking through that.",
        },
      ],
    },

    {
      id: "44",
      role: "takeaway",
      elapsedSeconds: 790,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Learn & Be Curious shows up in multiple ways here. The candidate inherits a codebase they don't know, an unfamiliar system architecture, and a production incident with no error logs. Instead of panicking or asking for handholding, they move from passive log-reading to active data investigation—pulling order data into Snowflake, cross-referencing with event logs, and building a timeline. This is curiosity directed at understanding, not just noise. Ownership is evident in: taking the incident, diving into unfamiliar code, making the investigative decisions that matter, proposing a real architectural fix, and documenting it for the team. The honest gap—jumping into code before asking for context—shows a newer engineer's instinct but also learning. The setup (SQS + JIT + 15-minute limit) is complex enough that it requires genuine thinking, not checklist following. The candidate doesn't solve it perfectly, but they understand the problem deeply enough to propose the right solution for next time.",
        },
      ],
    },
  ],
};

const amazonLearnCuriousOwnershipJit: TranscriptEntry = {
  summary: {
    slug: "amazon-learn-curious-ownership-jit-incident",
    title: "Learn & Be Curious + Ownership: Order Release JIT Incident Investigation",
    category: "behavioral",
    difficulty: Difficulty.MEDIUM,
    duration: 38,
    company: "Amazon",
    tags: [
      "Learn and Be Curious",
      "Ownership",
      "Incident Response",
      "Root Cause Analysis",
      "Data Investigation",
      "System Design",
      "STAR Method",
      "Behavioral",
    ],
    description:
      "STAR-format behavioral interview. Candidate joins team, three weeks later inherits unfamiliar codebase when 500 DLQ messages/day spike on order release queue. With no error logs, they investigate by extracting order IDs to Snowflake, discover all failing orders are scheduled with far-future JIT timestamps, identify root cause (SQS 15-min delay limit + new JIT calculation for scheduled orders), implement short-term fix (block scheduled orders from queue), and propose long-term architecture (DynamoDB + poller). Reflects on asking for context first and pushing harder on real fixes.",
  },

  transcript,
};

export default amazonLearnCuriousOwnershipJit;