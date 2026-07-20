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
            "Tell me about a time you noticed a problem that nobody had officially raised, and you took ownership of fixing it. I'm especially interested in how customer obsession showed up in your decision-making.",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 22,
      content: [
        {
          type: "text",
          value:
            "This was on Iris, Uber's regulatory reporting platform. Iris calculates reporting windows per jurisdiction and generates the actual reports regulators receive. If those numbers are wrong, or two people produce different numbers for the same period, that's not a minor bug — it's a direct threat to Uber's ability to keep operating in that market.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 50,
      content: [
        {
          type: "text",
          value: "How did this particular problem first land on your radar?",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 78,
      content: [
        {
          type: "text",
          value:
            "There was a Slack channel shared by Ops and Engineering. Operators kept posting SQL queries asking for a review, or asking for help pulling data for a custom date range — usually in the middle of a regulator investigation, an audit request, or incident debugging.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 105,
      content: [
        {
          type: "text",
          value: "Was that unusual? Engineers fielding ad hoc query requests doesn't sound like a five-alarm fire.",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 130,
      content: [
        {
          type: "text",
          value: "Honestly, at first I didn't treat it as anything more than that. ",
        },
        {
          id: "highlight-isolated-assumption",
          type: "highlight",
          status: "missed",
          value: "I assumed each one was an isolated, one-off request",
          explanation:
            "Treating each new instance of a repeating request as its own unrelated ticket delays diagnosis of the systemic cause — the instinct to ask 'why does this keep happening' should trigger sooner than after weeks of repetition.",
        },
        {
          type: "text",
          value:
            ", different operator, different question, nothing that looked systemic on any single day.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 158,
      content: [
        {
          type: "text",
          value: "So what changed your mind?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 185,
      content: [
        {
          type: "text",
          value: "The same shape of request ",
        },
        {
          id: "highlight-pattern-recognition",
          type: "highlight",
          status: "strong",
          value: "kept showing up, week after week, from different people",
          explanation:
            "Recognizing that a repeated pattern across different individuals is a signal of a structural gap, not a coincidence of unrelated requests, is what turns passive ticket-handling into active investigation.",
        },
        {
          type: "text",
          value:
            ". That repetition is what made me stop answering each one individually and start asking what was actually broken underneath all of them.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 215,
      content: [
        {
          type: "text",
          value: "What did you find when you actually dug in?",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 250,
      content: [
        {
          type: "text",
          value:
            "It was worse than I expected. Iris only supported system-calculated reporting ranges, so operators had no self-service path for a custom range. Their only option was querying Hive directly. Hive holds far more data than they need, with sensitive columns gated by LDAP groups, so not everyone even had access. The ones who did were maintaining runbooks of copied queries that quietly went stale every time the schema or the reporting logic changed.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 285,
      content: [
        {
          type: "text",
          value: "Did that actually cause a real problem, or was it just an inconvenience?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 315,
      content: [
        {
          type: "text",
          value: "It was a real problem. ",
        },
        {
          id: "highlight-concrete-incident",
          type: "highlight",
          status: "strong",
          value: "Two operators pulled data for the same reporting period and got different numbers",
          explanation:
            "Anchoring the case on one concrete, provable incident — rather than a vague sense that things could go wrong — is what makes the risk undeniable and gives the argument for change real weight.",
        },
        {
          type: "text",
          value:
            ", because each was applying slightly different filters, timezone handling, or business logic outside of Iris. Those numbers had to be reconciled before they could go any further.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 350,
      content: [
        {
          type: "text",
          value:
            "Given operators clearly needed more access to data, why not just widen the Hive permissions?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 385,
      content: [
        {
          type: "text",
          value: "Because that would have solved the symptom, not the problem. ",
        },
        {
          id: "highlight-rejected-easy-fix",
          type: "highlight",
          status: "strong",
          value: "Broader access doesn't stop ad hoc queries from drifting away from Iris's validated logic",
          explanation:
            "Distinguishing between the fix that makes the immediate complaint go away and the fix that removes the underlying risk is the core of this decision — granting access would have looked responsive while leaving the real compliance exposure fully intact.",
        },
        {
          type: "text",
          value:
            " as schemas and Requirements kept evolving. Every operator with wider access is another independent copy of business logic that can silently diverge. I wanted to eliminate that class of risk entirely, not just make it slightly less painful to work around.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 418,
      content: [
        {
          type: "text",
          value: "What did you propose instead?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 450,
      content: [
        {
          type: "text",
          value:
            "Let operators generate reports with custom date ranges directly through Iris: pick an existing report, specify override start and end dates, and trigger generation through the exact same pipeline used for scheduled reports.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 480,
      content: [
        {
          type: "text",
          value:
            "Why route it through the same production pipeline instead of building something lighter and faster to ship?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 512,
      content: [
        {
          type: "text",
          value: "Because a lighter parallel tool would have recreated the exact problem I was trying to remove. ",
        },
        {
          id: "highlight-reuse-pipeline",
          type: "highlight",
          status: "strong",
          value: "I deliberately reused the existing report generation path",
          explanation:
            "Resisting the temptation to build a faster, simpler side tool — and instead paying the extra integration cost to route through production logic — is what actually guarantees manually generated reports stay consistent with scheduled ones, which was the entire point of the fix.",
        },
        {
          type: "text",
          value:
            " — same logic, same filters, same timezone handling as production reports. If it doesn't share that path, it's just a second source of divergence with a nicer UI.",
        },
      ],
    },

    {
      id: "19",
      role: "candidate",
      elapsedSeconds: 545,
      content: [
        {
          type: "text",
          value: "This is roughly how the two paths compared — worth sketching out.",
        },
        {
          id: "whiteboard-before-after-flow",
          type: "whiteboard",
          caption:
            "Before: operators bypass Iris and query Hive directly, producing divergent results. After: operators trigger the same validated Iris pipeline with an override range.",
          value:
            "<svg viewBox=\"0 0 560 260\" xmlns=\"http://www.w3.org/2000/svg\"><text x=\"20\" y=\"28\" font-size=\"14\" font-weight=\"600\" fill=\"#1e293b\">Before</text><rect x=\"20\" y=\"40\" width=\"120\" height=\"44\" rx=\"6\" fill=\"#e2e8f0\" stroke=\"#94a3b8\"/><text x=\"80\" y=\"66\" font-size=\"12\" text-anchor=\"middle\" fill=\"#1e293b\">Operator</text><line x1=\"140\" y1=\"62\" x2=\"200\" y2=\"62\" stroke=\"#94a3b8\" stroke-width=\"2\" marker-end=\"url(#arrow)\"/><rect x=\"200\" y=\"40\" width=\"140\" height=\"44\" rx=\"6\" fill=\"#fecaca\" stroke=\"#dc2626\"/><text x=\"270\" y=\"58\" font-size=\"12\" text-anchor=\"middle\" fill=\"#7f1d1d\">Hive (direct query)</text><text x=\"270\" y=\"72\" font-size=\"10\" text-anchor=\"middle\" fill=\"#7f1d1d\">stale runbook, LDAP gate</text><line x1=\"340\" y1=\"62\" x2=\"400\" y2=\"62\" stroke=\"#94a3b8\" stroke-width=\"2\" marker-end=\"url(#arrow)\"/><rect x=\"400\" y=\"40\" width=\"140\" height=\"44\" rx=\"6\" fill=\"#fecaca\" stroke=\"#dc2626\"/><text x=\"470\" y=\"58\" font-size=\"12\" text-anchor=\"middle\" fill=\"#7f1d1d\">Divergent numbers</text><text x=\"470\" y=\"72\" font-size=\"10\" text-anchor=\"middle\" fill=\"#7f1d1d\">manual reconciliation</text><text x=\"20\" y=\"140\" font-size=\"14\" font-weight=\"600\" fill=\"#1e293b\">After</text><rect x=\"20\" y=\"152\" width=\"120\" height=\"44\" rx=\"6\" fill=\"#e2e8f0\" stroke=\"#94a3b8\"/><text x=\"80\" y=\"178\" font-size=\"12\" text-anchor=\"middle\" fill=\"#1e293b\">Operator</text><line x1=\"140\" y1=\"174\" x2=\"200\" y2=\"174\" stroke=\"#16a34a\" stroke-width=\"2\" marker-end=\"url(#arrowg)\"/><rect x=\"200\" y=\"152\" width=\"140\" height=\"44\" rx=\"6\" fill=\"#bbf7d0\" stroke=\"#16a34a\"/><text x=\"270\" y=\"170\" font-size=\"12\" text-anchor=\"middle\" fill=\"#14532d\">Iris + override range</text><text x=\"270\" y=\"184\" font-size=\"10\" text-anchor=\"middle\" fill=\"#14532d\">same LDAP auth model</text><line x1=\"340\" y1=\"174\" x2=\"400\" y2=\"174\" stroke=\"#16a34a\" stroke-width=\"2\" marker-end=\"url(#arrowg)\"/><rect x=\"400\" y=\"152\" width=\"140\" height=\"44\" rx=\"6\" fill=\"#bbf7d0\" stroke=\"#16a34a\"/><text x=\"470\" y=\"170\" font-size=\"12\" text-anchor=\"middle\" fill=\"#14532d\">Validated pipeline</text><text x=\"470\" y=\"184\" font-size=\"10\" text-anchor=\"middle\" fill=\"#14532d\">auditable, consistent</text><defs><marker id=\"arrow\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"4\" orient=\"auto\"><path d=\"M0,0 L8,4 L0,8 z\" fill=\"#94a3b8\"/></marker><marker id=\"arrowg\" markerWidth=\"8\" markerHeight=\"8\" refX=\"6\" refY=\"4\" orient=\"auto\"><path d=\"M0,0 L8,4 L0,8 z\" fill=\"#16a34a\"/></marker></defs></svg>",
        },
      ],
    },

    {
      id: "20",
      role: "interviewer",
      elapsedSeconds: 578,
      content: [
        {
          type: "text",
          value:
            "This wasn't a regulatory mandate or a production incident. How did you actually get it prioritized against everything else on the roadmap?",
        },
      ],
    },

    {
      id: "21",
      role: "candidate",
      elapsedSeconds: 610,
      content: [
        {
          type: "text",
          value: "I had to make the case myself, since ",
        },
        {
          id: "highlight-prioritization-case",
          type: "highlight",
          status: "strong",
          value: "prioritization wasn't automatic here",
          explanation:
            "Reframing an unglamorous, non-mandated fix as a recurring, quantifiable engineering tax — rather than pitching it as a nice-to-have — is what actually earns prioritization for work that has no ticket, no SLA, and no incident forcing it onto the roadmap.",
        },
        {
          type: "text",
          value:
            ". I framed it as a recurring engineering cost — query reviews, access requests, ad hoc debugging — that engineering was already paying, invisibly, every single week. A relatively small investment could remove that dependency permanently instead of continuing to pay it forever. Once I framed it that way, I got the green light.",
        },
      ],
    },

    {
      id: "22",
      role: "interviewer",
      elapsedSeconds: 645,
      content: [
        {
          type: "text",
          value: "Walk me through what you actually built.",
        },
      ],
    },

    {
      id: "23",
      role: "candidate",
      elapsedSeconds: 678,
      content: [
        {
          type: "text",
          value:
            "It was both backend and frontend work. On the backend, I extended the report generation flow to accept custom ranges while preserving all the existing validation and business logic — nothing about the production path changed for scheduled reports. On the frontend, I added the ability to enter those ranges and surface the resulting report.",
        },
      ],
    },

    {
      id: "24",
      role: "interviewer",
      elapsedSeconds: 710,
      content: [
        {
          type: "text",
          value: "How did you handle access control for this new capability?",
        },
      ],
    },

    {
      id: "25",
      role: "candidate",
      elapsedSeconds: 740,
      content: [
        {
          type: "text",
          value: "I ",
        },
        {
          id: "highlight-reuse-authz",
          type: "highlight",
          status: "strong",
          value: "wired it into the existing LDAP-based authorization model",
          explanation:
            "Extending an already-audited permission boundary instead of introducing a parallel one keeps the security surface flat — no new access model to review, no new place for permissions to drift out of sync with the operational workflows they're meant to gate.",
        },
        {
          type: "text",
          value:
            ", so only users who already had access to the corresponding operational workflows could use the feature. No new permission model, no new security surface to review or maintain.",
        },
      ],
    },

    {
      id: "26",
      role: "interviewer",
      elapsedSeconds: 772,
      content: [
        {
          type: "text",
          value:
            "Once it shipped, how did you make sure operators actually adopted it instead of falling back into old habits?",
        },
      ],
    },

    {
      id: "27",
      role: "candidate",
      elapsedSeconds: 805,
      content: [
        {
          type: "text",
          value: "I ",
        },
        {
          id: "highlight-owned-rollout",
          type: "highlight",
          status: "strong",
          value: "organized the walkthrough session myself",
          explanation:
            "Personally running the transition session — rather than handing rollout off to docs or a release note — treats adoption as part of the deliverable, not an afterthought, and creates a direct feedback loop on whether the solution actually fits how people work.",
        },
        {
          type: "text",
          value:
            " for the operations team. This was a real workflow change — from manually querying Hive to generating reports directly through Iris — so I wanted the transition to be smooth. It also gave me direct feedback on whether the solution actually fit how they worked day to day. It did.",
        },
      ],
    },

    {
      id: "28",
      role: "interviewer",
      elapsedSeconds: 838,
      content: [
        {
          type: "text",
          value: "What did you actually see change afterward, and how do you know it worked?",
        },
      ],
    },

    {
      id: "29",
      role: "candidate",
      elapsedSeconds: 870,
      content: [
        {
          type: "text",
          value:
            "The recurring query-review requests on Slack largely disappeared — operators were generating data themselves through Iris instead of pulling engineering in. Every report generation request, scheduled or manual, became auditable through the platform: who triggered it, when, and for what range. The stale runbooks were no longer needed, and because everything now runs through the same validated pipeline, the risk of inconsistent results from divergent ad hoc queries was eliminated entirely, not just reduced.",
        },
      ],
    },

    {
      id: "30",
      role: "interviewer",
      elapsedSeconds: 905,
      content: [
        {
          type: "text",
          value:
            "That's mostly a qualitative signal — a Slack channel going quiet. Did you track anything quantitative to confirm it, or is that a gap looking back?",
        },
      ],
    },

    {
      id: "31",
      role: "candidate",
      elapsedSeconds: 938,
      content: [
        {
          type: "text",
          value: "That's a fair push. Honestly, ",
        },
        {
          id: "highlight-measurement-gap",
          type: "highlight",
          status: "missed",
          value: "I leaned mostly on the Slack channel going quiet and the audit log existing as my signal",
          explanation:
            "An anecdotal signal like a channel going quiet is suggestive but not provable — without an explicit metric captured from day one, it's hard to demonstrate impact convincingly later, whether in a performance review or when justifying similar investments in the future.",
        },
        {
          type: "text",
          value:
            ", not a dashboard tracking manual-versus-scheduled generation volume over time. The audit trail existed, so the data was technically there, but I never built the view that would have made the before-and-after impact undeniable at a glance.",
        },
      ],
    },

    {
      id: "32",
      role: "interviewer",
      elapsedSeconds: 970,
      content: [
        {
          type: "text",
          value: "Last question. If you were doing this again from scratch, what would you change?",
        },
      ],
    },

    {
      id: "33",
      role: "candidate",
      elapsedSeconds: 1005,
      content: [
        {
          type: "text",
          value: "Two things. First, ",
        },
        {
          id: "highlight-retrospective-fix",
          type: "highlight",
          status: "strong",
          value: "I'd instrument adoption metrics before launch, not infer them afterward",
          explanation:
            "Turning a retrospective gap into a concrete, specific fix — rather than a vague 'I'd measure things better' — shows the reflection converted into an actionable lesson, which is what separates genuine self-awareness from a rehearsed caveat.",
        },
        {
          type: "text",
          value:
            " — a simple dashboard of manual versus scheduled generations would have made the impact provable, not just felt. Second, I'd loop operators into the design earlier, before backend and frontend work was already underway, rather than validating workflow fit at the walkthrough. It worked out, but that was closer to lucky timing than a repeatable process.",
        },
      ],
    },

    {
      id: "34",
      role: "interviewer",
      elapsedSeconds: 1040,
      content: [
        {
          type: "text",
          value: "Good. That's everything I wanted to cover.",
        },
      ],
    },

    {
      id: "35",
      role: "takeaway",
      elapsedSeconds: 1075,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the customer obsession signal here isn't responding faster to Slack requests — it's noticing that a repeated workaround is evidence of a structural gap, rejecting the fix that only relieves the symptom, and building the harder, consistent solution instead of the fast, divergent one. Making the case for prioritization without a mandate, reusing existing authorization rather than inventing new surface area, and personally owning the rollout are what turn a good technical decision into a complete one. The honest gap — no instrumented metric to prove impact, relying on an anecdotal signal instead — is what makes the retrospective credible rather than rehearsed.",
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
      "STAR-format behavioral interview built from a real project on Uber's Iris regulatory reporting platform, covering how a recurring Slack pattern was traced to a systemic self-service gap, why the easy fix (broader Hive access) was rejected in favor of reusing the validated report pipeline, how prioritization was earned without a mandate, and an honest retrospective on the missing adoption metrics.",
  },

  transcript,
};

export default amazonCustomerObsessionIris;