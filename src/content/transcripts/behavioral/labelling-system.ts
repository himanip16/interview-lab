// src/content/transcripts/behavioral/labelling-system-scale-deduplication.ts

import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Ownership + Bias for Action: Item-Partner Labelling System at Scale",
    difficulty: Difficulty.HARD,
    duration: 42,
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
            "Tell me about a system you designed that had to handle massive traffic spikes without breaking.",
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
            "Yeah. So at Deliveroo, I owned the item and partner labelling system. It determines whether a restaurant gets featured for time-specific offers like scheduled orders.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 38,
      content: [
        {
          type: "text",
          value: "What's the scale we're talking about?",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 52,
      content: [
        {
          type: "text",
          value:
            "Tens of thousands of restaurants across dozens of markets. During bulk menu updates—when a market or platform team changes food categories, pricing, or availability across hundreds of restaurants at once—we'd get absolute avalanches of events.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 75,
      content: [
        {
          type: "text",
          value: "What happens if you just process every event?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 92,
      content: [
        {
          type: "text",
          value:
            "You collapse. A single bulk menu update touching a thousand restaurants means a thousand item-level changes. If you evaluate partner eligibility for every single item change, you're hammering the database and downstream services with redundant work.",
        },
        {
          id: "highlight-scale-problem",
          type: "highlight",
          status: "strong",
          value: "Thousands of overlapping item modifications hitting the system simultaneously",
          explanation:
            "Naming the specific scale problem—not just 'lots of traffic' but 'N items × M restaurants × K concurrent updates'—shows you've thought through what actually breaks.",
        },
        {
          type: "text",
          value: "",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 115,
      content: [
        {
          type: "text",
          value: "How'd you solve it?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 132,
      content: [
        {
          type: "text",
          value:
            "I split the pipeline into two phases: Item Labelling and Partner Activation. Item changes flow through one path, but partner-level evaluation happens separately on a delayed schedule.",
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
          value: "What does the delay do?",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 168,
      content: [
        {
          type: "text",
          value:
            "I used a FIFO SQS queue with a 5-minute visibility delay and custom deduplication. The MessageDeduplicationId was a composite key: mission name, market, and restaurant ID.",
        },
        {
          id: "highlight-deduplication-key",
          type: "highlight",
          status: "strong",
          value: "Composite key deduplication (mission#market#restaurant_id) over 5-minute window compresses thousands of item updates into one evaluation",
          explanation:
            "This is where junior engineers see complexity for complexity's sake. The specific choice of the deduplication key (what actually matters for partner-level state) is what makes this elegant.",
        },
        {
          type: "text",
          value:
            " So if a bulk update triggered a thousand item changes for one restaurant within 5 minutes, FIFO deduplication would squash them into a single partner evaluation.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 198,
      content: [
        {
          type: "text",
          value: "What's the business impact of a 5-minute delay?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 215,
      content: [
        {
          type: "text",
          value:
            "Negligible. Partner activation for scheduled orders is about planning—users book orders hours in advance anyway. A 5-minute delay doesn't move the needle for user experience. But it cuts downstream processing load by over 90%.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 235,
      content: [
        {
          type: "text",
          value: "You mentioned Item Labelling runs separately. How's that protected?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 252,
      content: [
        {
          type: "text",
          value:
            "Item state changes trigger DynamoDB Streams, which fire into the menu-item-labelling-processor Lambda. The processor runs the rule engine, evaluates whether an item should be tagged, and then hits a cache table before pushing to downstream services.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 275,
      content: [
        {
          type: "text",
          value: "Why the cache layer?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 290,
      content: [
        {
          type: "text",
          value:
            "DynamoDB Streams can fire very aggressively. Without the cache, we'd be sending redundant writes down to Item Categorisation Service for every single event, even if the final label state didn't actually change.",
        },
        {
          id: "highlight-cache-protection",
          type: "highlight",
          status: "strong",
          value: "Cross-reference computed label against cache; only publish SQS message if state has actually changed",
          explanation:
            "This is downstream protection: don't just throttle the source, ensure messages are only forwarded if they represent actual changes. It protects both the system and data consistency.",
        },
        {
          type: "text",
          value:
            " So we only push an event to SQS if the label actually changed. Otherwise we safely discard it.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 318,
      content: [
        {
          type: "text",
          value: "What happens if events arrive out of order?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 335,
      content: [
        {
          type: "text",
          value:
            "That was a critical constraint. If partner and item states get out of sync, you could display a restaurant banner in the app with zero buyable items. That's a user-facing failure.",
        },
        {
          id: "highlight-data-consistency",
          type: "highlight",
          status: "strong",
          value: "Partner activation is derived from atomic count of tagged items, never pushed directly",
          explanation:
            "The key insight: make partner state an aggregation query over the latest item state, not a separate mutable entity. This prevents divergence by design.",
        },
        {
          type: "text",
          value:
            " So I designed it so partner state changes never push blindly to items. Item state changes roll upward.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 360,
      content: [
        {
          type: "text",
          value: "How does that work mechanically?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 378,
      content: [
        {
          type: "text",
          value:
            "The partner-activation-processor executes an atomic aggregation query: count tagged items for this restaurant right now. If the count meets the threshold, partner stays live. If it drops below, we immediately deactivate. No eventual consistency gap.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 400,
      content: [
        {
          type: "text",
          value: "How do you know this is actually working in production?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 418,
      content: [
        {
          type: "text",
          value:
            "I built comprehensive telemetry. Tracked tagged vs. untagged item counts split by mission and market. Correlated the business reasons for tags: out of stock, price changes, manual partner unapprovals. On the technical side, Lambda execution failures, processing latency percentiles, and DLQ accumulation rates.",
        },
        {
          id: "highlight-monitoring",
          type: "highlight",
          status: "strong",
          value: "Metrics split by mission and market; business signals (why items tagged/untagged) plus technical signals (latency, DLQ, errors)",
          explanation:
            "Not just 'throughput and latency.' The candidate tracks both business outcomes (item states) and technical health (errors, queues), which shows end-to-end ownership.",
        },
        {
          type: "text",
          value: "",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 445,
      content: [
        {
          type: "text",
          value: "Did you hit any edge cases during rollout?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 462,
      content: [
        {
          type: "text",
          value:
            "Yeah. During early testing, we saw the DLQ filling up during peak traffic. Turns out Lambda concurrency limits meant the processor couldn't keep up with stream events.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 480,
      content: [
        {
          type: "text",
          value: "How'd you fix it?",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 495,
      content: [
        {
          type: "text",
          value:
            "Reserved concurrency on the Lambda. But more importantly, I made sure failures were retriable and DLQ messages were actually getting re-processed. We batched DLQ drains into chunks and re-sent them to the stream. That turned an operational burden into a background job.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 520,
      content: [
        {
          type: "text",
          value: "What was your rollout strategy?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 537,
      content: [
        {
          type: "text",
          value:
            "Canary by market. Started with a small market, monitored for three days, then expanded to the next market. We tracked item tag rates and partner activation rates closely during each rollout to catch divergence early.",
        },
        {
          id: "highlight-rollout-discipline",
          type: "highlight",
          status: "strong",
          value: "Canary by market with business-level metrics monitoring (tag rates, activation rates) over observation period",
          explanation:
            "Not just 'gradually roll out.' The candidate has a specific trigger (business metrics) and timeline (3-day observation), which shows operational rigor.",
        },
        {
          type: "text",
          value: "",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 558,
      content: [
        {
          type: "text",
          value: "Any issues during production rollout?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 575,
      content: [
        {
          type: "text",
          value:
            "One market had a spike in cache misses because the rule engine got slower under peak load. We added result caching at the rule engine layer, not just at the label level. That cut the processor latency by 40%.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 598,
      content: [
        {
          type: "text",
          value: "Looking back, what would you do differently?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 615,
      content: [
        {
          type: "text",
          value:
            "Load testing. I should have stress-tested the full pipeline end-to-end before rollout. We caught the Lambda concurrency issue in early testing, but a proper load test would have surfaced it earlier and more predictably.",
        },
        {
          id: "highlight-retrospective",
          type: "highlight",
          status: "missed",
          value: "Should have done proper load testing of the full pipeline before rollout",
          explanation:
            "A genuine gap: the candidate found issues in testing but realizes a more systematic approach (production-like load tests) would have been more efficient.",
        },
        {
          type: "text",
          value: "",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 638,
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
      elapsedSeconds: 650,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Ownership shows up in every layer here. The candidate didn't just build a system; they designed it to handle the specific failure modes of scale (throughput avalanches, downstream protection, consistency guarantees). The deduplication strategy—composite key + 5-minute window compressing thousands of events into one—is elegant because it's rooted in understanding what actually matters at the partner level. The cache protection layer shows thinking about end-to-end flow, not just 'let's add a cache.' Data consistency is handled by design: make partner state derived from an atomic count, never mutable in isolation. Monitoring isn't an afterthought; it splits business signals (why items tagged) from technical signals (latency, errors), which shows end-to-end ownership. The honest miss—'should have load-tested more systematically'—is credible because the candidate clearly understands the problem space. This is the kind of system design that survives millions of requests per day without humans having to babysit it.",
        },
      ],
    },
  ],
};

const amazonLabellingSystemScale: TranscriptEntry = {
  summary: {
    slug: "amazon-labelling-system-scale-deduplication",
    title: "Ownership + Bias for Action: Item-Partner Labelling System at Scale",
    category: "behavioral",
    difficulty: Difficulty.HARD,
    duration: 42,
    company: "Amazon",
    tags: [
      "Ownership",
      "Bias for Action",
      "System Design",
      "Scale & Performance",
      "Data Consistency",
      "Deduplication",
      "Downstream Protection",
      "Monitoring",
      "STAR Method",
      "Behavioral",
    ],
    description:
      "STAR-format behavioral interview. Candidate designed item/partner labelling system for tens of thousands of restaurants. Bulk menu updates trigger avalanche of events (1K+ per update). Direct processing overwhelms databases and downstream services. Solution: split into Item Labelling (reactive, cached) and Partner Activation (delayed, deduplicated). FIFO SQS with 5-minute delay + composite key (mission#market#restaurant_id) compresses thousands of overlapping updates into single evaluation, reducing downstream load 90%. Cache layer ensures only label state changes propagate. Partner state derived from atomic count of tagged items, preventing out-of-sync states. Comprehensive telemetry tracks business signals (tag rates, reasons) and technical signals (latency, DLQ, errors). Canary rollout by market with 3-day observation period. Edge case: Lambda concurrency limits during peak traffic—resolved with reserved concurrency and batched DLQ reprocessing. Reflects on need for more systematic load testing.",
  },

  transcript,
};

export default amazonLabellingSystemScale;