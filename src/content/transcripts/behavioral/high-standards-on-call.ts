// src/content/transcripts/behavioral/oncall-alert-noise-highest-standards.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "On-Call Alert Noise Reduction — Insist on the Highest Standards",
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
            "Tell me about a time you pushed for a higher operational standard than what was already considered 'working.'",
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
            "Sure — at Uber, I worked on our regulatory reporting pipeline. Reports get scheduled through an internal scheduler called Pyper and executed on a platform called IRIS. Deadlines are strict, and IRIS itself already had retry logic built in.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 35,
      content: [
        { type: "text", value: "If IRIS already retried, what was actually broken?" },
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
            "The problem wasn't IRIS's retries — it was that Pyper, the layer that actually kicks off the workflow and pages on-call, didn't have any retry logic of its own. So the first time a task failed for any reason, Pyper immediately fired a page, even if IRIS would've eventually succeeded a few minutes later on its own.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 62,
      content: [
        { type: "text", value: "How'd you first notice that — a specific incident, or something you stumbled into?" },
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
            "I was on-call and kept getting paged at odd hours for things that, by the time I actually looked, had already resolved themselves. After enough of those I started wondering if that was actually the norm rather than a one-off.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 90,
      content: [
        { type: "text", value: "So you had a hunch. How'd you turn that into something you could act on?" },
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
            "I pulled a stretch of PagerDuty incident history and lined the alert timestamps up against the IRIS job execution logs, to see how many paged jobs actually needed a human versus how many eventually succeeded on their own without anyone touching anything.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 118,
      content: [
        { type: "text", value: "How many weeks exactly, and how'd you decide that was enough?" },
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
            "I want to say it was around four weeks — honestly I don't remember picking that number for some rigorous statistical reason. It felt like enough time to smooth out any one unusually bad or unusually quiet week, rather than a sample size I calculated ahead of time.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 145,
      content: [
        { type: "text", value: "And the number you landed on was north of 95%?" },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 158,
      content: [
        {
          type: "text",
          value:
            "Yeah — north of 95% of the paged failures ended up resolving on their own, either a later automated IRIS retry succeeded, or someone manually re-ran the exact same job with no code or infra change and it just worked.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 170,
      content: [
        { type: "text", value: "How confident are you in that number specifically — something you'd defend precisely, or a rough estimate?" },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 185,
      content: [
        {
          type: "text",
          value:
            "If you push me on the exact decimal, I wouldn't defend it that precisely. It was a real, measured number off the data I pulled for that period, not made up — but I also wouldn't swear it's stable at exactly that value across every month of the year. The part that mattered for the decision was 'the overwhelming majority,' not the specific decimal point.",
        },
        {
          id: "highlight-statistic-precision-honesty",
          type: "highlight",
          status: "strong",
          value: "not the specific decimal point",
          explanation:
            "Separates the measured, real number from an implied precision it doesn't actually have — defending the finding at the level of confidence it deserves rather than either inflating it or backing away from it entirely.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 200,
      content: [
        { type: "text", value: "Okay. What were the actual failure categories driving that number?" },
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
            "Mostly things like a Spark executor getting killed under resource pressure, YARN queue contention, short blips in S3 or HDFS connectivity, or the upstream data partition just not being there yet because it landed a few minutes late.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 228,
      content: [
        { type: "text", value: "So if you just added a blanket retry, what's the risk?" },
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
            "The risk is retrying something that's actually a real, fatal problem — a schema mismatch, bad SQL — and wasting time hammering something that was never going to succeed, while delaying when someone actually finds out. That was exactly the initial pushback: nobody wanted to accidentally mask a real compliance failure behind a retry loop.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 255,
      content: [
        { type: "text", value: "So how'd you actually address that concern?" },
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
            "I split failures into two buckets instead of retrying everything blindly — fatal errors, like schema issues or missing permissions, which still fail immediately and page right away, versus transient ones, the categories I just listed, which were the only ones eligible for a retry at all.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 282,
      content: [
        { type: "text", value: "How'd you classify an error as fatal versus transient in practice — is that a clean line?" },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 298,
      content: [
        {
          type: "text",
          value:
            "Not perfectly clean, no — it was based on exception type and message pattern. A known YARN resource-unavailable error or a specific S3 timeout signature got treated as transient, while a permission-denied or a syntax error got treated as fatal. I'm sure there were edge cases that didn't fit cleanly into either bucket, but the categories covered the overwhelming majority of what we actually saw.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 312,
      content: [
        { type: "text", value: "You mentioned compliance deadlines. How'd retries interact with those?" },
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
            "That was actually the trickiest part. We couldn't retry blindly right up against the deadline, since a report still retrying at the actual regulatory due time is arguably worse than one that failed and paged early enough for a human to fix. So the retry logic checked the remaining time against the deadline before attempting another retry — if there wasn't a safe buffer left, it paged immediately instead of trying again.",
        },
        {
          id: "highlight-deadline-aware-retry",
          type: "highlight",
          status: "strong",
          value: "checked the remaining time against the deadline before attempting another retry",
          explanation:
            "Recognizes that a naive retry policy interacts badly with a hard external deadline, and ties the retry decision itself to the actual SLA buffer remaining rather than treating retry count as the only safety mechanism.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 342,
      content: [
        { type: "text", value: "What if an infrastructure outage lasted longer than your max retry window?" },
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
            "Then it exhausts its retries and pages, same as before. The window itself was capped — I think it was three attempts inside about fifteen minutes, constrained by how much buffer we actually had against the compliance deadline. A long outage just falls through to the same page it always would have; we never tried to retry indefinitely against an SLA.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 372,
      content: [
        { type: "text", value: "Did suppressing pages for transient failures hide any real degradation from the team?" },
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
            "That was the other big concern going in, and it's a fair one — quietly succeeding after a retry could absolutely hide a pattern of infra getting flakier over time if nobody's watching for it. So we didn't just drop those retried attempts silently — we emitted them as a lower-priority metric to Grafana, separate from the actual page. If the retry rate started climbing across jobs, that shows up as a trend the platform team could act on during business hours, instead of nobody noticing until it eventually crossed some threshold and started paging again.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 405,
      content: [
        { type: "text", value: "Did anyone actually look at that dashboard regularly, or does the capability just exist?" },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 420,
      content: [
        {
          type: "text",
          value:
            "...That's a fair question, and honestly I don't have a clean answer for how often it was proactively checked versus just being there if someone thought to look. I know it existed and the data was real — I just can't tell you it was part of someone's daily routine to the point I'd claim we caught a real degradation from it, as opposed to it being a good safety net that was available.",
        },
        {
          id: "highlight-dashboard-usage-honesty",
          type: "highlight",
          status: "strong",
          value: "I just can't tell you it was part of someone's daily routine",
          explanation:
            "Distinguishes between building the observability capability and it actually being used as intended, rather than letting the existence of a dashboard stand in for evidence that it prevented anything in practice.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 435,
      content: [
        { type: "text", value: "What would you change if you were doing this again?" },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 450,
      content: [
        {
          type: "text",
          value:
            "Probably build an actual review cadence around that Grafana data instead of leaving it as something that exists — a weekly look at retry-rate trends, so the observability piece isn't just theoretically there but actually gets used the way it was intended.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 462,
      content: [
        { type: "text", value: "After you shipped this, how'd you know it actually worked, beyond just fewer pages?" },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 478,
      content: [
        {
          type: "text",
          value:
            "Fewer pages was the most visible thing, but the more important signal to me was that when an alert did come in afterward, people trusted it more. Before, there was some amount of on-call fatigue where a page didn't automatically mean 'drop everything' — and that's a genuinely dangerous place to be in a compliance system, since the one page that matters can get lost in the noise of the ones that don't.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 490,
      content: [
        { type: "text", value: "Good, that's what I wanted to dig into. Let's stop there." },
      ],
    },

    {
      id: "36",
      role: "takeaway",
      elapsedSeconds: 505,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the standard being raised here isn't 'the system works,' it's the operational experience of the people supporting it — and the story holds up because the candidate defends the headline 95% statistic at the level of confidence it actually deserves instead of treating it as exact, ties retry behavior directly to the compliance deadline rather than just a retry count, and is honest that the safety-net dashboard built to address the 'are we hiding degradation' concern was never confirmed to be part of anyone's regular routine — naming the gap between building observability and actually using it.",
        },
      ],
    },
  ],
};

const uberOncallAlertNoiseHighestStandards: TranscriptEntry = {
  summary: {
    id: 8,

    slug: "uber-oncall-alert-noise-insist-on-highest-standards",
    title: "On-Call Alert Noise Reduction — Insist on the Highest Standards",
    category: "behavioral",
    difficulty: Difficulty.HARD,
    duration: 40,
    company: "Amazon",
    tags: [
      "Behavioral",
      "Leadership Principles",
      "Insist on the Highest Standards",
      "Reliability",
      "Observability",
      "On-Call",
      "Distributed Systems",
    ],
    description:
      "SDE2 behavioral interview with drill-down on reducing on-call alert noise in Uber's regulatory reporting pipeline (Pyper scheduler + IRIS platform). Covers defending a measured 95%+ noise statistic at the right level of confidence, fatal-versus-transient error classification, deadline-aware retry logic that never risks a compliance SLA, and an honest admission that the safety-net dashboard built to address 'are we hiding degradation' was never confirmed to be part of anyone's actual routine.",
  },

  transcript,
};

export default uberOncallAlertNoiseHighestStandards;