// src/content/transcripts/behavioral/customer-obsession.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Customer Obsession: Closing the Self-Service Reporting Gap",
    difficulty: Difficulty.MEDIUM,
    duration: 30,
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
            "So tell me about a time when you noticed something broken that nobody had actually flagged yet. Something where you had to own the whole thing.",
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
            "Yeah, so... this was on Iris. That's Uber's regulatory reporting platform. Basically it generates the reports that go directly to regulators in different jurisdictions.",
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
          value: "Okay.",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 38,
      content: [
        {
          type: "text",
          value:
            "And honestly, if those numbers are wrong or if two people generate the same report and get different results... that's not just a bug. That's actually dangerous for Uber's ability to keep operating in that market.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 55,
      content: [
        {
          type: "text",
          value: "Yep. So how'd you even notice there was a problem? Was this assigned to you?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 70,
      content: [
        {
          type: "text",
          value: "No, not assigned. So there was this Slack channel that Ops and Engineering shared...",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 80,
      content: [
        {
          type: "text",
          value: "Mm-hmm.",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 85,
      content: [
        {
          type: "text",
          value:
            "And operators would constantly post SQL queries asking for reviews, or asking engineering to pull data for weird date ranges. Usually because there was an audit or someone was investigating something, or incident debugging.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 105,
      content: [
        {
          type: "text",
          value: "Okay, but that happens everywhere. Different teams asking engineering for data. Why did that matter?",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 122,
      content: [
        {
          type: "text",
          value:
            "Yeah, so at first, honestly... I didn't think it was that weird. ",
        },
        {
          id: "highlight-isolated-assumption",
          type: "highlight",
          status: "missed",
          value: "I'd see a request, answer it, and then the next day a different person would ask basically the same thing",
          explanation:
            "Treating each new instance of a repeating request as its own unrelated ticket delays diagnosis of the systemic cause — the instinct to ask 'why does this keep happening' should trigger sooner than after weeks of repetition.",
        },
        {
          type: "text",
          value:
            ". Different operator, different question, so in my head they were all just... separate requests, you know?",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 148,
      content: [
        {
          type: "text",
          value: "So what changed?",
        },
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
            "I think I stopped dismissing it after maybe... a month? I realized ",
        },
        {
          id: "highlight-pattern-recognition",
          type: "highlight",
          status: "strong",
          value: "the same shape of request kept showing up week to week, different people",
          explanation:
            "Recognizing that a repeated pattern across different individuals is a signal of a structural gap, not a coincidence of unrelated requests, is what turns passive ticket-handling into active investigation.",
        },
        {
          type: "text",
          value:
            ". And that's when I actually stopped answering individually and thought, okay, something's structurally broken here.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 185,
      content: [
        {
          type: "text",
          value: "So you started digging. What'd you actually find?",
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
            "Yeah. So Iris only supported system-calculated reporting ranges. Like, if you want last quarter's report, you can get it. But if you need a custom date range? The system has no path for that.",
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
          value: "So operators had to go around Iris.",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 235,
      content: [
        {
          type: "text",
          value:
            "Right. They'd query Hive directly. Which... Hive has way more data than they need, there's sensitive columns gated by LDAP permissions, so not everyone even had access. The ones who did had these runbooks of copied queries that were constantly getting stale because the schema kept changing.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 265,
      content: [
        {
          type: "text",
          value:
            "Wait. So if permissions were gated, were operators actually able to access what they needed, or...",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 282,
      content: [
        {
          type: "text",
          value:
            "That's the thing. Some had access, some didn't. If you didn't, you'd ask engineering to run the query for you, which... defeats the whole self-service thing. And even the ones with access...",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 302,
      content: [
        {
          type: "text",
          value: "Their queries were stale.",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 310,
      content: [
        {
          type: "text",
          value:
            "Yeah. So this eventually caused an actual problem. ",
        },
        {
          id: "highlight-concrete-incident",
          type: "highlight",
          status: "strong",
          value: "Two operators pulled data for the same period and got different numbers",
          explanation:
            "Anchoring the case on one concrete, provable incident — rather than a vague sense that things could go wrong — is what makes the risk undeniable and gives the argument for change real weight.",
        },
        {
          type: "text",
          value:
            ". Because one had applied slightly different filters, different timezone handling, some business logic that was outside of Iris entirely.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 338,
      content: [
        {
          type: "text",
          value: "Oh wow. Did those go to a regulator, or...",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 350,
      content: [
        {
          type: "text",
          value:
            "No, they caught it internally first. But they had to be reconciled before anything went further. And that's when I actually realized, okay, this isn't just an inconvenience anymore.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 372,
      content: [
        {
          type: "text",
          value:
            "So the obvious fix would be just... give them access to Hive, right? Widen the permissions, problem solved.",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 388,
      content: [
        {
          type: "text",
          value:
            "Yeah, that was actually the first thing we discussed. It would've been the fastest ship.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 400,
      content: [
        {
          type: "text",
          value: "But you didn't do that.",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 410,
      content: [
        {
          type: "text",
          value:
            "No. Because ",
        },
        {
          id: "highlight-rejected-easy-fix",
          type: "highlight",
          status: "strong",
          value: "we'd be solving the symptom, not the problem",
          explanation:
            "Distinguishing between the fix that makes the immediate complaint go away and the fix that removes the underlying risk is the core of this decision — granting access would have looked responsive while leaving the real compliance exposure fully intact.",
        },
        {
          type: "text",
          value:
            ". Because schemas change, requirements evolve... and now you've got a hundred operators, each with their own query, their own version of the business logic. That's not controlled. That's not auditable. It's actually worse than before.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 442,
      content: [
        {
          type: "text",
          value: "Okay, so what was your actual fix?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 455,
      content: [
        {
          type: "text",
          value:
            "Build a self-service path directly in Iris. Operators pick a report and override the date range, then trigger the generation through the same pipeline used for scheduled reports. Same logic, same filters, same everything.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 480,
      content: [
        {
          type: "text",
          value:
            "Couldn't you just... I don't know, build something lighter? A separate tool that's faster to ship?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 498,
      content: [
        {
          type: "text",
          value:
            "That was considered. But that would just recreate the same problem with a prettier interface. ",
        },
        {
          id: "highlight-reuse-pipeline",
          type: "highlight",
          status: "strong",
          value: "I forced reusing the production report generation path",
          explanation:
            "Resisting the temptation to build a faster, simpler side tool — and instead paying the extra integration cost to route through production logic — is what actually guarantees manually generated reports stay consistent with scheduled ones, which was the entire point of the fix.",
        },
        {
          type: "text",
          value:
            ". You want the manually generated report to be indistinguishable from a scheduled one from a business logic perspective. Otherwise it's just a second source of truth.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 525,
      content: [
        {
          type: "text",
          value: "Right. Okay. So how did you actually get this prioritized?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 540,
      content: [
        {
          type: "text",
          value:
            "That was tricky because ",
        },
        {
          id: "highlight-prioritization-case",
          type: "highlight",
          status: "strong",
          value: "there was no ticket, no mandate, no incident forcing it",
          explanation:
            "Reframing an unglamorous, non-mandated fix as a recurring, quantifiable engineering tax — rather than pitching it as a nice-to-have — is what actually earns prioritization for work that has no ticket, no SLA, and no incident forcing it onto the roadmap.",
        },
        {
          type: "text",
          value:
            ". It wasn't on anyone's roadmap. So I had to make the case that engineering was paying a recurring tax. Every week, query reviews, access debugging, ad hoc requests. Small things individually, but constantly.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 570,
      content: [
        {
          type: "text",
          value: "Did that work?",
        },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 580,
      content: [
        {
          type: "text",
          value:
            "Yeah, I got the green light. Once I framed it that way—not as feature work but as removing an invisible recurring cost—it made sense.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 602,
      content: [
        {
          type: "text",
          value: "Walk me through what you actually built.",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 618,
      content: [
        {
          type: "text",
          value:
            "Both backend and frontend. On backend, I extended the report generation to accept custom date ranges. The production logic for scheduled reports didn't change at all. On frontend, added the UI to enter those dates and surface the result.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 645,
      content: [
        {
          type: "text",
          value: "Who could trigger this? How'd you handle permissions?",
        },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 662,
      content: [
        {
          type: "text",
          value:
            "Wired it into the existing LDAP auth. So if you already had access to the operational workflows the report touches, you can use the feature. ",
        },
        {
          id: "highlight-reuse-authz",
          type: "highlight",
          status: "strong",
          value: "No new permission model",
          explanation:
            "Extending an already-audited permission boundary instead of introducing a parallel one keeps the security surface flat — no new access model to review, no new place for permissions to drift out of sync with the operational workflows they're meant to gate.",
        },
        {
          type: "text",
          value: ". That was important—no new security surface to audit.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 688,
      content: [
        {
          type: "text",
          value: "And then... did people actually use it?",
        },
      ],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 705,
      content: [
        {
          type: "text",
          value:
            "Yeah. I ran a walkthrough with Ops myself instead of just... shipping it and hoping.",
        },
        {
          id: "highlight-owned-rollout",
          type: "highlight",
          status: "strong",
          value: "I did the transition training",
          explanation:
            "Personally running the transition session — rather than handing rollout off to docs or a release note — treats adoption as part of the deliverable, not an afterthought, and creates a direct feedback loop on whether the solution actually fits how people work.",
        },
        {
          type: "text",
          value:
            ". Because this was a real workflow change—from manually querying Hive to using Iris. I wanted to make sure it worked for them day to day.",
        },
      ],
    },

    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 735,
      content: [
        {
          type: "text",
          value: "Did it?",
        },
      ],
    },

    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 745,
      content: [
        {
          type: "text",
          value: "Yeah. The Slack requests pretty much stopped. Operators were generating their own data.",
        },
      ],
    },

    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 760,
      content: [
        {
          type: "text",
          value:
            "But like... Slack going quiet is kind of anecdotal, right? Did you measure anything?",
        },
      ],
    },

    {
      id: "44",
      role: "candidate",
      elapsedSeconds: 778,
      content: [
        {
          type: "text",
          value:
            "That's fair. Honestly... ",
        },
        {
          id: "highlight-measurement-gap",
          type: "highlight",
          status: "missed",
          value: "I didn't build a dashboard tracking manual versus scheduled generations",
          explanation:
            "An anecdotal signal like a channel going quiet is suggestive but not provable — without an explicit metric captured from day one, it's hard to demonstrate impact convincingly later, whether in a performance review or when justifying similar investments in the future.",
        },
        {
          type: "text",
          value:
            ". The audit logs existed with all the data. I could've built the view. I didn't. That's a miss.",
        },
      ],
    },

    {
      id: "45",
      role: "interviewer",
      elapsedSeconds: 805,
      content: [
        {
          type: "text",
          value: "So if you were doing this again, what'd you change?",
        },
      ],
    },

    {
      id: "46",
      role: "candidate",
      elapsedSeconds: 825,
      content: [
        {
          type: "text",
          value:
            "Two things. First, ",
        },
        {
          id: "highlight-retrospective-fix",
          type: "highlight",
          status: "strong",
          value: "instrument adoption metrics before launch",
          explanation:
            "Turning a retrospective gap into a concrete, specific fix — rather than a vague 'I'd measure things better' — shows the reflection converted into an actionable lesson, which is what separates genuine self-awareness from a rehearsed caveat.",
        },
        {
          type: "text",
          value:
            ". A simple dashboard of manual to scheduled ratio. Make it undeniable.",
        },
      ],
    },

    {
      id: "47",
      role: "interviewer",
      elapsedSeconds: 850,
      content: [
        {
          type: "text",
          value: "And second?",
        },
      ],
    },

    {
      id: "48",
      role: "candidate",
      elapsedSeconds: 865,
      content: [
        {
          type: "text",
          value:
            "Loop operators into design before building. I validated the workflow at the walkthrough, which worked. But that was closer to luck than process. I should've talked to them earlier.",
        },
      ],
    },

    {
      id: "49",
      role: "interviewer",
      elapsedSeconds: 890,
      content: [
        {
          type: "text",
          value: "Got it. Thanks for walking through that.",
        },
      ],
    },

    {
      id: "50",
      role: "takeaway",
      elapsedSeconds: 910,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the customer obsession part here isn't speed. It's recognizing a repeating pattern as a structural problem, rejecting the quick fix that relieves the symptom, and building the harder solution that's consistent and auditable. The decision-making chain—from Slack pattern to root cause to the why-reuse-not-build choice—shows discipline. But the honest gap—relying on anecdote instead of metrics—is what makes the retrospective credible. No candidate is perfect. The ones who are polished usually aren't real.",
        },
      ],
    },
  ],
};

const amazonCustomerObsessionIris: TranscriptEntry = {
  summary: {
    slug: "amazon-customer-obsession-iris-reporting",
    title: "Customer Obsession: Closing the Self-Service Reporting Gap",
    category: "behavioral",
    difficulty: Difficulty.MEDIUM,
    duration: 30,
    company: "Amazon",
    tags: [
      "Customer Obsession",
      "Ownership",
      "Bias for Action",
      "Regulatory Compliance",
      "Cross-functional Collaboration",
      "STAR Method",
      "Behavioral",
    ],
    description:
      "STAR-format behavioral interview built from a real project on Uber's Iris regulatory reporting platform. The candidate notices a Slack pattern, traces it to a systemic gap in self-service capabilities, rejects the quick fix (broader Hive access) in favor of reusing the production pipeline, earns prioritization without a mandate, ships the feature, and reflects honestly on missing instrumentation.",
  },

  transcript,
};

export default amazonCustomerObsessionIris;