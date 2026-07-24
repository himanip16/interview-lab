// src/content/transcripts/behavioral/customer-obsession-eway-bill.ts

import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Customer Obsession: e-Way Bill Visibility vs. Feature Adoption",
    difficulty: Difficulty.MEDIUM,
    duration: 36,
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
            "Tell me about a time when you built something you thought solved a customer's problem, but then realized you'd missed something important.",
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
            "Yeah. So at my startup, we had a logistics platform used by operations teams managing shipments across states in India.",
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
          value: "Okay, so operations-facing tool.",
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
            "Right. And the critical compliance requirement in that domain is the e-Way Bill. It's a government-issued document required for interstate transportation. Without one, vehicles can literally be stopped mid-transit by authorities.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 60,
      content: [
        {
          type: "text",
          value: "So high stakes.",
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
          value:
            "Yeah. Stopped vehicle means delayed shipment means direct financial loss for the customer. But at the time, our platform had zero support for e-Way Bill generation.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 85,
      content: [
        {
          type: "text",
          value: "How were operators handling it?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 102,
      content: [
        {
          type: "text",
          value:
            "They had to leave our system, log into the government portal manually, re-enter all the shipment details that already existed in our platform, generate the document, download it, then distribute it to drivers.",
        },
        {
          id: "highlight-customer-pain",
          type: "highlight",
          status: "strong",
          value: "Manual data re-entry of information already in the system, slow and error-prone",
          explanation:
            "Identifying the specific customer pain—not just 'they need this feature' but 'they're repeating work'—is what shaped the first solution. Customer obsession starts with really understanding the friction.",
        },
        {
          type: "text",
          value:
            " I was the primary point of contact for the ops team, so I heard this frustration regularly.",
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
          value: "So you built the feature.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 142,
      content: [
        {
          type: "text",
          value:
            "Yeah. Integration that lets operators generate e-Way Bills directly from the platform. Shipment details auto-populate from existing data. No re-entry. The generated document gets linked to the shipment record.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 162,
      content: [
        {
          type: "text",
          value: "How'd that land?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 175,
      content: [
        {
          type: "text",
          value:
            "I was confident it solved the problem. It did, in a sense. But a few weeks after launch, one of the operators came to me directly.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 190,
      content: [
        {
          type: "text",
          value: "What'd he say?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 208,
      content: [
        {
          type: "text",
          value:
            "He'd had an operational emergency. System needed an e-Way Bill fast, and he went directly to the government portal. Generated it there. But when he came back to our platform, it wasn't showing up anywhere.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 228,
      content: [
        {
          type: "text",
          value: "So he bypassed your feature.",
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
            "Right. But not because he didn't like the feature. The situation demanded it. Emergencies happen. Systems go down. And his team had no visibility into what he'd generated.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 262,
      content: [
        {
          type: "text",
          value: "What'd you do?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 280,
      content: [
        {
          type: "text",
          value:
            "My first instinct was to say he should just use our feature next time. But I paused.",
        },
        {
          id: "highlight-pause-listen",
          type: "highlight",
          status: "strong",
          value: "I didn't defend my solution. I listened and realized I'd framed the problem wrong",
          explanation:
            "The moment where the candidate doesn't get defensive—doesn't rationalize why the operator should adopt their feature—is crucial. Customer obsession means being willing to be wrong about your own solution.",
        },
        {
          type: "text",
          value:
            " Because the real customer need wasn't feature adoption. It was visibility.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 305,
      content: [
        {
          type: "text",
          value: "Visibility into what?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 320,
      content: [
        {
          type: "text",
          value:
            "Every e-Way Bill associated with every shipment, regardless of where it was created. Inside our platform or outside. The operator had done everything right. The document existed. But from the platform's perspective, the shipment looked incomplete.",
        },
        {
          id: "highlight-reframed-need",
          type: "highlight",
          status: "strong",
          value: "The real need was completeness of the shipment record, not just enabling one workflow",
          explanation:
            "Reframing from 'how do we get them to use our feature' to 'how do we give them complete visibility' is what separates solving the symptom from solving the actual problem.",
        },
        {
          type: "text",
          value: "",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 345,
      content: [
        {
          type: "text",
          value: "So what'd you build?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 362,
      content: [
        {
          type: "text",
          value:
            "A second integration that lets operators import externally generated e-Way Bills and link them back to shipment records. If someone generates a document outside our platform for any reason—emergency, system downtime, whatever—it can still be attached to the shipment lifecycle.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 388,
      content: [
        {
          type: "text",
          value: "And now?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 405,
      content: [
        {
          type: "text",
          value:
            "Single source of truth. Operators spend less time on manual data entry, drivers get documents faster, and finance and support teams have complete visibility into shipment compliance without chasing anyone on chat.",
        },
        {
          id: "highlight-impact",
          type: "highlight",
          status: "strong",
          value: "No shipment record was incomplete just because someone used the government portal in an emergency",
          explanation:
            "The outcome isn't just 'feature adoption improved.' It's 'the system is now resilient to how customers actually behave.' That's what customer obsession looks like in practice.",
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
      elapsedSeconds: 428,
      content: [
        {
          type: "text",
          value: "How long between v1 and v2?",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 443,
      content: [
        {
          type: "text",
          value:
            "A few weeks. v1 shipped, seemed good, then the operator feedback came in. I could've dismissed it, but... I didn't. I sat with it, realized my initial framing had been too narrow.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 463,
      content: [
        {
          type: "text",
          value: "Looking back, what made you pause instead of defending v1?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 482,
      content: [
        {
          type: "text",
          value:
            "At a startup, you're in constant contact with your users. The operator felt comfortable coming to me directly. And when he explained the situation, it was clear he'd made a reasonable decision. He wasn't avoiding our feature. He was solving an immediate problem.",
        },
        {
          id: "highlight-empathy",
          type: "highlight",
          status: "strong",
          value: "He hadn't bypassed the feature out of laziness. Emergencies happen. The situation demanded it.",
          explanation:
            "Understanding the operator's context and constraints—rather than viewing the workaround as a failure of adoption—shows genuine customer empathy. This is the mindset that unlocks the real insight.",
        },
        {
          type: "text",
          value:
            " That reframe made everything else click.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 512,
      content: [
        {
          type: "text",
          value: "Did you ever have to revisit this later?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 528,
      content: [
        {
          type: "text",
          value:
            "Not really. Once v2 shipped, the problem was solved. Both workflows became part of the normal system. Operators could generate internally or import externally, and everything was visible.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 548,
      content: [
        {
          type: "text",
          value: "Got it. Thanks for walking through that.",
        },
      ],
    },

    {
      id: "32",
      role: "takeaway",
      elapsedSeconds: 560,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Customer obsession here shows up in the willingness to be wrong about your own solution. The candidate built v1 based on what they *thought* the problem was—manual re-entry was slow. It was a real problem, and they fixed it. But v1 was built on an incomplete understanding. When the operator came back and explained the emergency scenario, the candidate didn't rationalize or defend. They listened, reframed, and rebuilt. The key insight—'the real need is visibility, not feature adoption'—came from respecting the customer's context and constraints, not dismissing the workaround. This isn't just iteration; it's a mindset where customer feedback reshapes your assumption about what 'solved' means. The setup is strong (high-stakes compliance, government portals, direct operator contact), the conflict is genuine (v1 works but doesn't solve the real problem), and the resolution is elegant (import + link, not just generate). Most candidates defend their solutions. The ones who listen and reframe are the ones who build systems that actually fit how customers work.",
        },
      ],
    },
  ],
};

const amazonCustomerObsessionEWayBill: TranscriptEntry = {
  summary: {
    slug: "amazon-customer-obsession-eway-bill-visibility",
    title: "Customer Obsession: e-Way Bill Visibility vs. Feature Adoption",
    category: "behavioral",
    difficulty: Difficulty.MEDIUM,
    duration: 36,
    company: "Amazon",
    tags: [
      "Customer Obsession",
      "Ownership",
      "Problem Framing",
      "Empathy",
      "Iteration",
      "Compliance",
      "Logistics",
      "STAR Method",
      "Behavioral",
    ],
    description:
      "STAR-format behavioral interview. Candidate builds e-Way Bill generation feature for logistics platform (auto-populates from existing data, eliminating manual re-entry). Feature ships, seems successful. Weeks later, operator comes back: generated document externally during emergency, no visibility in platform. Candidate could have defended the feature or blamed the operator for not adopting. Instead, listens and reframes: real need is complete visibility regardless of generation source. Builds v2: import + link external documents. Single source of truth. Reflects on listening to customer context and reframing assumptions.",
  },

  transcript,
};

export default amazonCustomerObsessionEWayBill;