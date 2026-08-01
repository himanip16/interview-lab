// src/content/transcripts/behavioral/bias-for-action-certificate-expiration.ts

import { TranscriptData } from "@/features/library/types/transcript";
import { Difficulty } from "@prisma/client";
import type { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Bias for Action + Ownership — Certificate Expiration Incident Response",
    difficulty: Difficulty.MEDIUM,
    
    duration: 32,
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
            "Tell me about a time when you had to act quickly under time pressure, without perfect information.",
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
            "I was on call for our compliance data integration team at Uber. We have multiple integrations that send regulatory data to government agencies in different countries. One of those integrations—for a specific country's regulatory portal—suddenly stopped working, and we got paged in the middle of the night.",
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
          value:
            "eval-initial-diagnosis: What did you find when you started investigating?",
        },
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
            "I checked our monitoring dashboard, and the logs showed authentication failures. The government regulator's endpoint was rejecting our requests. The monitoring system flagged something specific: the client certificate we use to authenticate with the government portal was set to expire in approximately 24 hours.",
        },
        {
          type: "text",
          value:
            "Compliance data transmission is critical. If we don't get data to regulators on time, it can trigger audits and legal consequences. So I knew this wasn't something I could delegate or wait to handle in the morning.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 82,
      content: [
        {
          type: "text",
          value:
            "eval-knowledge-gap: Did you already know how to renew this certificate?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 100,
      content: [
        {
          type: "text",
          value:
            "No. This certificate only needed renewal every several years, so it wasn't a common operational task. The engineer who had originally set up this integration had already left Uber, and nobody on my current team had gone through a renewal before.",
        },
        {
          type: "text",
          value:
            "I had basically no playbook, no documentation, and no expert on the team. I had 24 hours to fix a critical compliance integration that I'd never worked on before.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 130,
      content: [
        {
          type: "text",
          value:
            "eval-action-sequencing: What was your first move? Did you immediately call someone for help?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 150,
      content: [
        {
          type: "text",
          value:
            "I didn't immediately escalate. I thought about this strategically. Escalating right away would mean waiting for someone to be available, and I only had a narrow window. Instead, I decided to do some detective work first and get as far as I could on my own.",
        },
        {
          type: "text",
          value:
            "My thinking was: if I can understand the process before calling for help, I'll ask better questions and move faster. So I started by reading the government documentation. I needed to understand what the regulator expected the certificate to look like and what authentication flow they were validating.",
        },
        {
          type: "text",
          value:
            "That took about 30 minutes. I understood from their docs that they required a valid client certificate for mutual TLS authentication. But here's where I hit a wall: the government documentation explained what they expected, but it didn't explain how Uber internally generates and manages credentials. That knowledge was tribal.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 196,
      content: [
        {
          type: "text",
          value:
            "eval-tribal-knowledge: So you knew what the government needed, but not how Uber provided it. What did you do?",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 216,
      content: [
        {
          type: "text",
          value:
            "I searched our internal documentation, Jira tickets, and deployment history to find any previous record of this certificate being renewed. I found an old ticket from about five years ago — roughly when this integration was first set up. It had some notes, but they were incomplete and the author had already left the company.",
        },
        {
          type: "text",
          value:
            "I then tried to find current team members who might remember the process. I messaged a few engineers who had been at Uber longer than me. Most either didn't remember the details or had moved to different teams. The institutional knowledge had basically evaporated.",
        },
        {
          type: "text",
          value:
            "At that point, I realized I needed to understand Uber's internal credential management system. I knew we used an internal secrets management platform, but I didn't know the specific workflow for generating and rotating certificates. That's when I decided to reach out to the IAM team — they owned credential infrastructure.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 268,
      content: [
        {
          type: "text",
          value:
            "eval-expert-coordination: How did you approach the IAM team, and what did you ask them?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 288,
      content: [
        {
          type: "text",
          value:
            "I called the IAM on-call engineer and I was very specific about what I needed. I didn't ask them to 'fix the certificate issue.' Instead, I said: 'Our government integration uses a client certificate that's expiring in 18 hours. I've read the government requirements and I understand what they need. What I need to understand is Uber's internal process for generating this certificate and how we deploy it into our services.'",
        },
        {
          type: "text",
          value:
            "I also asked specifically: 'Can I generate this locally on my laptop, or does it need to go through your secure issuance process?' The answer was: it has to go through the internal security process. You can't generate production credentials locally.",
        },
        {
          type: "text",
          value:
            "That was important because it told me I couldn't solve this myself. I had to coordinate with IAM, but I could at least guide the process because I understood the end-to-end flow by that point.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 336,
      content: [
        {
          type: "text",
          value:
            "eval-end-to-end-ownership: Walk me through how you actually resolved it. Who did what?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 356,
      content: [
        {
          type: "text",
          value:
            "I owned the end-to-end coordination. IAM handled the certificate generation through their internal secure workflow. I provided them with the specific requirements from the government documentation — the certificate needed to match a particular DN (distinguished name) format and needed to be valid for the external endpoint.",
        },
        {
          type: "text",
          value:
            "Once they generated the certificate, I received it and uploaded it into our internal secrets management platform — that's where services load their credentials. I then updated our integration service to use the new credential from the secrets platform.",
        },
        {
          type: "text",
          value:
            "Before deploying, I did a careful test. I connected to the government portal's sandbox endpoint using the new certificate to verify the TLS handshake would succeed. Once I confirmed that, I deployed the updated service configuration to production.",
        },
        {
          type: "text",
          value:
            "Within about 4 hours of the initial alert, data was flowing to the government portal again. We had cleared the backlog, and the integration was healthy.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 410,
      content: [
        {
          type: "text",
          value:
            "eval-prevention: After the incident was resolved, what did you do to prevent this from happening again?",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 428,
      content: [
        {
          type: "text",
          value:
            "I did two things. First, I documented the entire renewal procedure. I wrote down the steps: what the government requires, how to request a certificate from IAM, where to upload it in the secrets platform, and how to verify it works. That documentation went into our team wiki so future on-call engineers wouldn't have to rediscover the process.",
        },
        {
          type: "text",
          value:
            "Second, I worked with the platform team to set up monitoring. We now get an alert when a certificate is 30 days away from expiry, not when it's already expired. That gives us plenty of time to plan the renewal instead of scrambling in an emergency.",
        },
        {
          type: "text",
          value:
            "The incident itself was resolved in 4 hours. But more importantly, the knowledge is now captured so the next time someone has to renew this certificate, they won't be starting from zero.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 470,
      content: [
        {
          type: "text",
          value:
            "eval-reflection: What would you do differently if it happened again?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 488,
      content: [
        {
          type: "text",
          value:
            "I'd probably reach out to IAM slightly earlier, maybe after 30-40 minutes of investigation instead of waiting to exhaust all other options. The key insight I had was that I needed to understand the process before asking for help, but I could have moved faster if I'd involved them once I confirmed that credential generation required their secure workflow.",
        },
        {
          type: "text",
          value:
            "But overall, I think the approach was sound: investigate what you can independently, understand the problem deeply, then coordinate with the right expert team to solve the parts you can't solve alone.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 516,
      content: [
        {
          type: "text",
          value: "Thanks for walking through that.",
        },
      ],
    },

    {
      id: "20",
      role: "takeaway",
      elapsedSeconds: 524,
      content: [
        {
          type: "text",
          value:
            "Takeaway: This is Bias for Action in its clearest form. The candidate was paged with a critical production issue, had no playbook, no expert available, and 24 hours to fix it. Instead of waiting or panicking, they moved immediately and strategically. The smart sequencing—investigate independently first, ask targeted questions of experts, then coordinate end-to-end—shows mature judgment. Critically, they didn't hand off to IAM and step back; they owned the resolution. They understood what the government needed (from docs), what Uber could provide (from investigation), where the gap was (tribal knowledge), and how to bridge it (coordinate with IAM while owning end-to-end). After resolution, they prevented recurrence by documenting and adding monitoring. The interviewer can see: (1) bias for action under time pressure without rushing blindly, (2) ownership of a critical production issue outside their normal domain, (3) curiosity about unfamiliar systems before escalating, (4) good judgment about when to involve security experts vs. when to move independently, (5) learning from incident to prevent future ones. This is exactly the kind of engineer Amazon wants on their compliance and infrastructure teams.",
        },
      ],
    },
  ],
};
const biasForActionCertificateExpiration: TranscriptEntry = {
  summary: {    id: 2,

    slug: "bias-for-action-certificate-expiration",
    title:
      "Bias for Action + Ownership — Certificate Expiration Incident Response at Uber",
    category: "behavioral",
    difficulty: Difficulty.HARD,
    duration: 32,
    company: ["Amazon"],
    description:
      "Oncall page: government integration stopped working. Root cause: client certificate expiring in 24 hours. Compliance data transmission is critical—missing regulatory deadlines triggers audits and legal consequences. Problem: no playbook (certificate only renewed every several years), original engineer left, nobody on team had done renewal before. Candidate didn't immediately escalate. Instead: (1) read government documentation to understand what regulator expects, (2) searched internal tickets and found old notes from 5 years ago (incomplete, author left), (3) asked teammates who had context (most had moved to other teams), (4) realized credential generation requires Uber's internal security process (can't be done locally). Called IAM on-call with specific questions: 'What's Uber's process for generating this certificate? Does it require your secure workflow?' Coordinated end-to-end: IAM generated certificate per requirements, candidate uploaded to secrets platform, tested with government sandbox, deployed to production. Integration recovered in 4 hours. Prevented recurrence: (1) documented renewal procedure for team wiki, (2) configured 30-day expiry alerts instead of post-expiry alerts. Reflection: would have involved IAM slightly earlier, but the approach of investigating independently before escalating was sound.",
    tags: [
      "Leadership Principles",
      "Bias for Action",
      "Ownership",
      "Learn and Be Curious",
      "Earn Trust",
      "Time Pressure",
      "Incomplete Information",
      "Cross-Team Coordination",
      "Incident Response",
      "Compliance Systems",
      "Knowledge Management",
      "STAR Method",
      "Behavioral Interview",
    ],
  },

  transcript,
};

export default biasForActionCertificateExpiration;