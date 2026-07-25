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
            "Tell me about a time when you had to make a decision with incomplete information, and you arrived at the right answer. How did you know you were right?",
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
            "At Deliveroo, I faced a decision about how to handle a throughput problem in the campaign labelling pipeline. There were multiple reasonable solutions, but they would have led to very different outcomes.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 36,
      content: [
        {
          type: "text",
          value:
            "eval-problem-ambiguity: Walk me through what you were actually trying to decide.",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 54,
      content: [
        {
          type: "text",
          value:
            "The system was experiencing severe queue buildup during bulk menu updates. When restaurants added or removed menu items, the pipeline would process every single item change as a separate event. A restaurant with 500 items changing would generate 500 events.",
        },
        {
          type: "text",
          value:
            "The question was: why is the system overloaded? The initial hypothesis from the team was straightforward — we don't have enough compute. And that seemed reasonable. When throughput is low, usually you need more of something.",
        },
        {
          type: "text",
          value:
            "But here's where I wasn't certain. I had three plausible solutions, and I wasn't confident which one was actually correct without digging deeper:",
        },
        {
          type: "text",
          value:
            "Option 1: Increase Lambda concurrency and database capacity. Pros: straightforward, no architectural changes. Cons: costs money, doesn't address root cause if there is one.",
        },
        {
          type: "text",
          value:
            "Option 2: Redesign the architecture to defer partner-level evaluation with deduplication. Pros: if the problem is redundant work, this solves it permanently. Cons: more complex, higher risk of bugs, delayed activation.",
        },
        {
          type: "text",
          value:
            "Option 3: Change the event schema so item changes get batched instead of individual. Pros: reduces event volume. Cons: requires changes upstream, affects multiple teams.",
        },
        {
          type: "text",
          value:
            "All three could work. But they're solving for different root causes. I wasn't sure which one was actually right.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 140,
      content: [
        {
          type: "text",
          value:
            "eval-investigation-discipline: So you had competing hypotheses. How did you decide which one to bet on?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 160,
      content: [
        {
          type: "text",
          value:
            "I decided to investigate before proposing anything. I looked at production data from recent bulk menu updates. The key question I asked was: for a single restaurant experiencing a menu change event, how many times does the system evaluate whether that restaurant is eligible for scheduled orders?",
        },
        {
          type: "text",
          value:
            "I analyzed three different bulk updates and found something very specific. In one case, a restaurant added 47 items. The system fired 47 separate events. But partner eligibility depends only on the count of available items. So the restaurant's eligibility status—whether it should be active for scheduled orders — didn't actually change between the first item and the 47th.",
        },
        {
          type: "text",
          value:
            "I traced the flow for one of those events and realized: we were executing the entire eligibility evaluation for all 47 items, even though only the first one could have changed the actual state. The remaining 46 were redundant work.",
        },
        {
          type: "text",
          value:
            "That told me the root cause wasn't 'we don't have enough compute.' It was 'we're computing the same result over and over.'",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 216,
      content: [
        {
          type: "text",
          value:
            "eval-reasoning: Why did that matter? Why not just scale and be done with it?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 238,
      content: [
        {
          type: "text",
          value:
            "Because scaling doesn't solve redundancy — it just masks it. If you throw more compute at a problem that's fundamentally about doing redundant work, you're wasting resources. And that waste compounds.",
        },
        {
          type: "text",
          value:
            "Think about the second-order effects. More Lambda concurrency means more database connections. More database connections mean more contention. You're creating a cascade of resource pressure that doesn't actually make the business logic faster — it just makes the system burn through more resources to do the same work.",
        },
        {
          type: "text",
          value:
            "Also, bulk menu updates would continue to happen. If the issue is redundancy, it's not going to go away if you just scale. Every time you have a large menu change, you're back to square one, burning resources on duplicate evaluations.",
        },
        {
          type: "text",
          value:
            "But if the root cause was actually 'not enough compute,' then scaling is exactly the right move. So I needed to be confident I'd identified the real problem before proposing an architecture change.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 298,
      content: [
        {
          type: "text",
          value:
            "eval-validation: Okay, so you had a hypothesis. How did you validate it before committing to the redesign?",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 318,
      content: [
        {
          type: "text",
          value:
            "I ran a simple simulation. I took the event stream from a peak traffic period and asked: what if I collapse all events for the same restaurant within a 5-minute window into a single evaluation? How many evaluations would that save?",
        },
        {
          type: "text",
          value:
            "The answer was striking. We'd go from 50,000+ evaluations per hour during peak updates to under 5,000. That's a 90% reduction. That's not a marginal improvement — that's evidence that redundancy was the actual problem.",
        },
        {
          type: "text",
          value:
            "I also looked at whether a 5-minute deduplication window would be acceptable from a business perspective. I pulled data on how long restaurants typically wait between enabling scheduled orders and receiving the first customer order. The median was 45 minutes. A 5-minute delay in eligibility evaluation is noise compared to that.",
        },
        {
          type: "text",
          value:
            "That simulation gave me confidence. If deduplication could theoretically save 90% of evaluations, and the business wouldn't notice a 5-minute delay, then this was probably the right solution.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 372,
      content: [
        {
          type: "text",
          value:
            "eval-implementation-reality: But simulation is theory. What happened when you actually built and deployed it?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 392,
      content: [
        {
          type: "text",
          value:
            "Reality forced me to adjust my thinking in a few ways. First, deduplication worked, but I had to be very careful about the deduplication key. I initially thought I could just deduplicate by restaurant ID. But I quickly realized that wasn't quite right.",
        },
        {
          type: "text",
          value:
            "The same restaurant can be part of different missions and different markets. If a restaurant had menu changes in two different markets, those shouldn't be deduplicated together. That would be wrong.",
        },
        {
          type: "text",
          value:
            "So I had to adjust the key to be mission + market + restaurant ID. That's a small detail, but it's the difference between a correct system and a system that silently produces wrong results.",
        },
        {
          type: "text",
          value:
            "The other thing I discovered was that the rule engine itself had performance issues under peak load. My theory about deduplication was correct — that was the primary bottleneck. But once we fixed that, a secondary bottleneck appeared: the rule evaluation for each restaurant was getting slower because it wasn't caching intermediate results.",
        },
        {
          type: "text",
          value:
            "If I'd just thrown compute at the original problem, I would never have discovered that. The deduplication approach forced me to look deeper at the system, and I found that optimization opportunity.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 458,
      content: [
        {
          type: "text",
          value:
            "eval-proof: How do you know now, in retrospect, that you made the right call?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 478,
      content: [
        {
          type: "text",
          value:
            "Multiple ways. First, the metrics. We went from tens of thousands of downstream writes per hour to thousands. That's the smoking gun that redundancy was the actual problem. If it had been just a compute shortage, deduplication wouldn't have had that impact.",
        },
        {
          type: "text",
          value:
            "Second, the absence of side effects. We never had to fight resource contention after the change. We never had cascading failures during peak updates like we did before. The system just became stable.",
        },
        {
          type: "text",
          value:
            "Third, cost. If we'd scaled horizontally, every bulk menu update would be burning 10x more resources than it actually needed to. The difference in infrastructure cost over a year would have been substantial.",
        },
        {
          type: "text",
          value:
            "But the proof I'm most confident about is this: the problem went away completely. We went from 'we get paged during bulk updates' to 'the system handles bulk updates without any drama.' That only happens if you fixed the actual problem, not a symptom.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 528,
      content: [
        {
          type: "text",
          value:
            "eval-lessons: What did this teach you about making decisions under uncertainty?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 550,
      content: [
        {
          type: "text",
          value:
            "A few things. First: the obvious solution isn't always the right one. When throughput is low, the obvious answer is 'add more compute.' But that's only right if the problem is actually insufficient compute. You have to investigate.",
        },
        {
          type: "text",
          value:
            "Second: simulation and data are worth the time. Spending a day analyzing traffic patterns saved us from a decision that would have cost weeks of engineering and years of operational overhead.",
        },
        {
          type: "text",
          value:
            "Third: stay open to adjusting when you're wrong. I was confident deduplication was the answer, but I was wrong about the specific deduplication key initially. Being right doesn't mean you had all the details correct — it means you had the direction correct, and you adjust the details as you learn.",
        },
        {
          type: "text",
          value:
            "And finally: making a good decision usually requires seeing one or two levels deeper than the immediate problem. The immediate problem was 'queue is backed up.' One level deeper was 'redundant work.' But getting from the surface problem to the root cause required discipline and data.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 598,
      content: [
        {
          type: "text",
          value: "Thanks for working through that.",
        },
      ],
    },

    {
      id: "18",
      role: "takeaway",
      elapsedSeconds: 608,
      content: [
        {
          type: "text",
          value:
            "Takeaway: 'Are Right, A Lot' is not about being infallible; it's about consistently arriving at correct decisions through disciplined thinking. This story demonstrates: (1) recognizing ambiguity—multiple plausible solutions exist, you're not certain, (2) investigating before deciding—analyzing production data to distinguish between competing hypotheses, (3) clear reasoning—explaining why redundancy is a different problem than insufficient compute, (4) validation through simulation—using data to de-risk a major architecture change, (5) adjusting when reality contradicts assumptions—discovering that the deduplication key needed three fields, not one; that secondary bottlenecks existed, (6) measuring outcome—using multiple independent signals to confirm the decision was correct (load reduction, stability, cost, system behavior). The interviewer can see: the candidate doesn't jump to the obvious solution; they investigate root causes; they can articulate why one solution is fundamentally different from another; they validate through simulation; they adjust details when new information appears; they confirm through independent evidence. This is someone who will make sound decisions even when options aren't clear.",
        },
      ],
    },
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