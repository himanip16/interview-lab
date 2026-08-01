// src/content/transcripts/behavioral/compliance-workflow-deliver-results.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Compliance Workflow Automation — Deliver Results",
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
            "Tell me about a time you took ownership of delivering a system end to end, especially something with real reliability challenges.",
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
            "Sure — our compliance team had to manually create a Salesforce case, upload a report, and attach files for every audit cycle. I worked on automating that whole thing end to end.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 35,
      content: [
        { type: "text", value: "What kicked off the automation — an event, a schedule?" },
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
            "A Kafka event, actually. Once a report finished generating on our side, we published an event, and a consumer service picked that up and kicked off the Salesforce side — create the case, upload the report, attach it.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 62,
      content: [
        { type: "text", value: "Walk me through what happened when it didn't go as planned." },
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
            "The case creation call would succeed, but then the upload call would sometimes fail — a timeout, some transient Salesforce error — and now Salesforce already had a case sitting there with nothing attached. Compliance would notice an empty case and have to chase it down manually.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 92,
      content: [
        { type: "text", value: "Why not just retry from the very beginning — recreate the case fresh, resend everything?" },
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
            "Because at that point Salesforce already has that case — recreating it means either a duplicate, or overwriting state that's already good, which felt worse than the original problem. So a plain retry-from-scratch wasn't really on the table.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 120,
      content: [
        { type: "text", value: "So what did you actually do?" },
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
            "I proposed persisting execution state after each step. Once case creation succeeded, we recorded that as done, so on retry we'd skip straight to the upload step instead of starting over.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 150,
      content: [
        { type: "text", value: "Why didn't you make the whole thing transactional instead — wrap it all in a transaction so it's all-or-nothing?" },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 168,
      content: [
        {
          type: "text",
          value:
            "Salesforce's API isn't something we control internally — there's no real distributed transaction spanning our system and theirs. I can't roll back a case creation on their side the way I'd roll back a database write on ours. So all-or-nothing wasn't really available to me; the workflow crossing an external system's boundary is exactly why I went with tracking progress and resuming instead of trying to force atomicity across a boundary I don't own.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 182,
      content: [
        { type: "text", value: "Okay. Suppose retries fail permanently — Salesforce keeps rejecting the upload for three or four attempts. What happens then?" },
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
            "After some number of attempts — I think it was three, with backoff between each — if it still hadn't succeeded, we'd stop retrying automatically and flag it instead of hammering the API forever.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 210,
      content: [
        { type: "text", value: "Flag it how — who actually finds out?" },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 225,
      content: [
        {
          type: "text",
          value:
            "It went into some kind of dead-letter state — honestly I don't remember if that was a literal dead-letter queue or just a status flag in our own tracking table that a monitoring job picked up. Either way, it surfaced as an alert to whoever was on call rather than silently sitting there.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 240,
      content: [
        { type: "text", value: "So the compliance team's actual recovery path in that case is what?" },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 255,
      content: [
        {
          type: "text",
          value:
            "Once it's flagged, someone on the engineering side — or possibly compliance directly, if we'd exposed a retry action — could manually re-trigger just the failed step, since we already knew exactly which step it died on. They weren't redoing the whole workflow, just resuming it.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 268,
      content: [
        { type: "text", value: "You mentioned Kafka earlier. Suppose that publish happens twice for the same report. What stops downstream from processing it twice?" },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 285,
      content: [
        {
          type: "text",
          value:
            "The consumer needs to be idempotent on the report identifier — before creating a case, it checks whether one already exists for that report ID. If the workflow already ran, or already has persisted state for that ID, it just no-ops instead of creating a second case.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 298,
      content: [
        { type: "text", value: "Is that a hard guarantee, or best-effort?" },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 312,
      content: [
        {
          type: "text",
          value:
            "I'd say... best-effort unless there's something enforcing uniqueness at the storage layer too, like a unique constraint on report ID in the execution-state table. If it's only an application-level check-then-act, there's technically a race if two consumers processed the same event concurrently. So honestly, a unique constraint at the database level is what would make it a real guarantee instead of just 'usually fine.'",
        },
        {
          id: "highlight-idempotency-honesty",
          type: "highlight",
          status: "strong",
          value: "a real guarantee instead of just 'usually fine'",
          explanation:
            "Distinguishes an application-level check-then-act idempotency check from an actual storage-level guarantee, rather than presenting a race-prone check as if it were airtight.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 328,
      content: [
        { type: "text", value: "Suppose Salesforce starts rate-limiting your API calls. What does your system do?" },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 345,
      content: [
        {
          type: "text",
          value:
            "Ideally back off — if the response comes back as a 429 or some rate-limit-specific error, I'd want the retry logic to slow down rather than hit it at the same pace, so we're not making the rate limiting worse right after being told to slow down.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 358,
      content: [
        { type: "text", value: "Did you actually implement that distinction, or was it just generic retry-with-backoff regardless of the error?" },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 372,
      content: [
        {
          type: "text",
          value:
            "If I'm being honest, ours was closer to generic backoff regardless of the specific error code — not something that detected rate-limit responses and reacted differently. That's probably a gap. Ideally you'd treat a rate-limit response differently than, say, a plain timeout, since one of those is the other system explicitly telling you to slow down.",
        },
        {
          id: "highlight-rate-limit-gap",
          type: "highlight",
          status: "strong",
          value: "that's probably a gap",
          explanation:
            "Names a real limitation in what was actually built instead of describing an idealized version of the system, distinguishing generic backoff from error-aware backoff the interviewer specifically probed for.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 388,
      content: [
        { type: "text", value: "Suppose Salesforce goes down entirely for six hours. Do reports wait? Queue? Who gets told?" },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 405,
      content: [
        {
          type: "text",
          value:
            "They'd queue, effectively — since execution state is persisted per report, one that hasn't completed its Salesforce steps just sits in a not-yet-done state, and once Salesforce is back, whatever's retrying picks it back up. Someone would get paged well before the six-hour mark, though — alerting was based on failures accumulating or retries piling up, not a fixed outage duration.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 420,
      content: [
        { type: "text", value: "Suppose your cleanup job deletes a case that an operator had actually already fixed manually. How do you avoid that?" },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 438,
      content: [
        {
          type: "text",
          value:
            "Hm — that's a real gap, honestly. If cleanup just sweeps anything older than some age threshold that's still 'not complete,' and an operator fixed it manually but didn't update our tracking state, cleanup would still think it's abandoned and go after it.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 452,
      content: [
        { type: "text", value: "So how would you actually prevent that?" },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 468,
      content: [
        {
          type: "text",
          value:
            "Manual intervention needs to update the same execution-state record the automated system reads from — if an operator resolves it by hand, that action has to mark our tracking record as done too, not just fix things on the Salesforce side and leave our side thinking it's still broken. I'm not fully sure we had that closed that tightly in practice, if I'm honest — that's the kind of edge case I'd want to go verify rather than assume we handled.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 485,
      content: [
        { type: "text", value: "Why retries at all, instead of just failing immediately and telling the operator to retry manually?" },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 500,
      content: [
        {
          type: "text",
          value:
            "Because most of the failures we saw were transient — a timeout, a blip, something that would just work seconds later on a second attempt. Paging a human for something that resolves itself on retry is a worse outcome than quietly retrying a couple times first. Manual escalation is for when retries have already told us this isn't a blip.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 515,
      content: [
        { type: "text", value: "What metrics would've told you this system was becoming unhealthy before compliance actually complained?" },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 532,
      content: [
        {
          type: "text",
          value:
            "The rate of workflows landing in that flagged or dead-letter state over time, relative to total volume — a rising trend there before it's a huge absolute number. And how long things were sitting in a partial state, not just whether they eventually completed, since a growing backlog of half-finished workflows is a leading indicator even before anything's technically failed outright.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 548,
      content: [
        { type: "text", value: "Which of those would you actually trust more as an early warning — the failure rate, or the backlog age?" },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 565,
      content: [
        {
          type: "text",
          value:
            "Probably backlog age, actually, now that I think about it. Failure rate can look totally fine if things are retrying successfully within a couple attempts, but if the average time-to-completion is quietly creeping up, that's telling you something's degrading before it ever shows up as an outright failure spike.",
        },
        {
          id: "highlight-leading-indicator",
          type: "highlight",
          status: "strong",
          value: "before it ever shows up as an outright failure spike",
          explanation:
            "Reconsiders in real time and lands on backlog age over failure rate as the better leading indicator, since a system can be quietly degrading — completions taking longer — while every retry still eventually succeeds and the failure-rate metric stays flat.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 580,
      content: [
        { type: "text", value: "Good, that's what I wanted to dig into. Let's stop there." },
      ],
    },

    {
      id: "40",
      role: "takeaway",
      elapsedSeconds: 598,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the story holds together under drill-down by staying honest about the gap between what was built and what an ideal version would look like — generic backoff instead of error-aware backoff, an idempotency check that's best-effort without a database-level constraint, and an unverified assumption about manual fixes updating tracking state. The strongest moments are recognizing that a transaction can't span a boundary you don't own, so persisted, resumable state is the real substitute for atomicity — and, when pushed to choose between two plausible early-warning metrics, updating the answer in real time toward the one that actually catches quiet degradation before failures spike.",
        },
      ],
    },
  ],
};

const amazonComplianceWorkflowDeliverResults: TranscriptEntry = {
  summary: {    id: 4,

    slug: "amazon-compliance-workflow-deliver-results",
    title: "Compliance Workflow Automation — Deliver Results",
    category: "behavioral",
    difficulty: Difficulty.HARD,
    duration: 42,
    company: "Amazon",
    tags: [
      "Behavioral",
      "Leadership Principles",
      "Deliver Results",
      "Distributed Systems",
      "Idempotency",
      "Reliability",
      "Observability",
    ],
    description:
      "SDE2 behavioral interview with drill-down on automating a multi-step compliance workflow against Salesforce. Covers why the workflow uses persisted, resumable state instead of a cross-system transaction, permanent retry failure and recovery, Kafka duplicate-delivery idempotency and its actual guarantee level, an honestly-acknowledged rate-limiting gap, a six-hour outage scenario, a cleanup-versus-manual-fix race condition, why retries over immediate escalation, and choosing backlog age over failure rate as the better early-warning signal.",
  },

  transcript,
};

export default amazonComplianceWorkflowDeliverResults;