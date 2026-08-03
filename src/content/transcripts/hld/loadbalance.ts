// src/content/transcripts/system-design/load-balancer-hld.ts

import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Design a Load Balancer",
    difficulty: Difficulty.MEDIUM,
    duration: 25,
    template: "System Design",
    category: "System Design",
    company: ["Amazon"],
  },

  messages: [
    {
      id: "0",
      role: "interviewer",
      elapsedSeconds: 0,
      content: [
        {
          type: "text",
          value:
            "Let's say you've got one web server. It's handling everything. Traffic grows, and eventually it either falls over or just can't keep up. Obvious fix — run more copies. But now something has to decide, for every request, which copy handles it.",
        },
      ],
    },
    {
      id: "1",
      role: "interviewer",
      elapsedSeconds: 12,
      content: [
        { type: "text", value: "Design that thing. Where do you want to start?" },
      ],
    },
    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 25,
      content: [
        {
          type: "text",
          value: "Scale, I guess. How many backend servers are we talking, and roughly what request volume?",
        },
      ],
    },
    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 35,
      content: [
        { type: "text", value: "Sure — but before that, why does that number even matter to your design?" },
      ],
    },
    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 48,
      content: [
        {
          type: "text",
          value:
            "Because if it's 5 servers and low traffic, a single load balancer instance is probably fine. If it's hundreds of servers and six figures of requests per second, the load balancer itself becomes a bottleneck — I'd need more than one, which changes the whole design.",
        },
      ],
    },
    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 62,
      content: [
        { type: "text", value: "Good. Let's say 500 servers, 100K requests a second." },
      ],
    },
    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 68,
      content: [
        { type: "text", value: "Any need for session affinity — same client always hitting the same backend?" },
      ],
    },
    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 75,
      content: [{ type: "text", value: "Yes, for some clients." }],
    },
    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 85,
      content: [
        {
          type: "text",
          value:
            "Okay. At a high level — clients hit the load balancer, it picks a healthy backend, forwards the request. But like I said, at 100K req/sec one LB instance can't take that alone, and it'd be a single point of failure anyway. So multiple LB instances, sitting behind DNS or an anycast IP.",
        },
      ],
    },
    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 100,
      content: [{ type: "text", value: "L4 or L7?" }],
    },
    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 112,
      content: [
        {
          type: "text",
          value:
            "L7, mainly because of the affinity requirement — I need to read cookies to know who the client is.",
        },
      ],
    },
    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 120,
      content: [{ type: "text", value: "Could L4 do affinity?" }],
    },
    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 130,
      content: [
        {
          type: "text",
          value:
            "Sort of — you can hash on source IP and pin that way. But that breaks for anyone behind a shared IP, like a corporate NAT, and it's not cookie-based. If the affinity requirement is cookie-driven, I need L7.",
        },
        {
          id: "highlight-l4-vs-l7",
          type: "highlight",
          status: "strong",
          value: "Doesn't just name L7 — tests it against what L4 could actually do first",
          explanation:
            "Rather than stating L7 as a fact, the candidate is pushed to justify it by ruling out the cheaper option, which surfaces the real reason: affinity granularity, not affinity in general.",
        },
      ],
    },
    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 145,
      content: [{ type: "text", value: "Fine, L7. So — how do you actually pick a backend per request?" }],
    },
    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 155,
      content: [
        { type: "text", value: "Simplest thing — round robin, or hash the client id mod number of servers." },
      ],
    },
    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 163,
      content: [
        { type: "text", value: "You have two clients hashing to the same server today. Tomorrow you add 50 more servers. What happens to them?" },
      ],
    },
    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 178,
      content: [
        { type: "text", value: "Hmm. With mod, the divisor changes, so—" },
      ],
    },
    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 183,
      content: [{ type: "text", value: "So?" }],
    },
    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 195,
      content: [
        {
          type: "text",
          value:
            "So basically everyone remaps, not just the two I mentioned. Almost every client's hash-mod-N result changes even though most servers didn't move. That kills session affinity and blows up cache locality at the same time.",
        },
      ],
    },
    {
      id: "19",
      role: "takeaway",
      elapsedSeconds: 205,
      content: [
        {
          type: "text",
          value:
            "That's the actual failure mode consistent hashing exists to fix — not an abstract one. hash(id) % N depends on N. Change N, and the mapping for almost everyone changes with it, even though 50 new servers joining shouldn't really affect the other 500.",
        },
      ],
    },
    {
      id: "20",
      role: "interviewer",
      elapsedSeconds: 220,
      content: [{ type: "text", value: "Right. So fix it." }],
    },
    {
      id: "21",
      role: "candidate",
      elapsedSeconds: 235,
      content: [
        {
          type: "text",
          value:
            "Consistent hashing — put servers and clients on a ring instead of a formula. A client goes to whichever server is next clockwise from it. Add a server, it only steals the clients between it and its neighbor. Everyone else's next-clockwise server is unchanged.",
        },
      ],
    },
    {
      id: "22",
      role: "interviewer",
      elapsedSeconds: 250,
      content: [{ type: "text", value: "Draw it. How many points per server on the ring?" }],
    },
    {
      id: "23",
      role: "candidate",
      elapsedSeconds: 270,
      content: [
        {
          type: "whiteboard",
          value:
            "<svg viewBox=\"0 0 320 320\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"160\" cy=\"160\" r=\"120\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"/><circle cx=\"160\" cy=\"40\" r=\"5\" fill=\"currentColor\"/><text x=\"170\" y=\"35\" font-size=\"12\">S1-a</text><circle cx=\"260\" cy=\"110\" r=\"5\" fill=\"currentColor\"/><text x=\"268\" y=\"110\" font-size=\"12\">S2-a</text><circle cx=\"240\" cy=\"230\" r=\"5\" fill=\"currentColor\"/><text x=\"248\" y=\"235\" font-size=\"12\">S1-b</text><circle cx=\"100\" cy=\"265\" r=\"5\" fill=\"currentColor\"/><text x=\"70\" y=\"282\" font-size=\"12\">S3-a</text><circle cx=\"50\" cy=\"150\" r=\"5\" fill=\"currentColor\"/><text x=\"10\" y=\"150\" font-size=\"12\">S2-b</text></svg>",
          caption: "Hash ring: each physical server placed at several points to spread load evenly",
        },
        {
          type: "text",
          value:
            "One point per server, and a server can get unlucky — land in a big gap and own way more than its share. So multiple points per server, maybe a hundred or so, hashed with different salts.",
        },
      ],
    },
    {
      id: "24",
      role: "interviewer",
      elapsedSeconds: 290,
      content: [{ type: "text", value: "Why a hundred and not ten? Or a thousand?" }],
    },
    {
      id: "25",
      role: "candidate",
      elapsedSeconds: 305,
      content: [
        {
          type: "text",
          value:
            "Honestly, it's a tradeoff I'd want to tune rather than derive. More points, more even the distribution — law of large numbers — but more points also means more ring metadata to store and update on every server join or leave. A hundred to a few hundred is the range I've seen work in practice; I wouldn't defend the exact number in a vacuum.",
        },
      ],
    },
    {
      id: "26",
      role: "interviewer",
      elapsedSeconds: 320,
      content: [{ type: "text", value: "Fair. Now — how does the load balancer know a backend's actually down?" }],
    },
    {
      id: "27",
      role: "candidate",
      elapsedSeconds: 332,
      content: [
        { type: "text", value: "Background health check on an interval — hit a `/health` endpoint every few seconds, pull it after a few misses." },
      ],
    },
    {
      id: "28",
      role: "interviewer",
      elapsedSeconds: 340,
      content: [{ type: "text", value: "Say the interval's 5 seconds. Server dies at second 1. What happens for the next 4?" }],
    },
    {
      id: "29",
      role: "candidate",
      elapsedSeconds: 352,
      content: [
        { type: "text", value: "Real traffic keeps getting routed there and failing, until the next check catches it." },
      ],
    },
    {
      id: "30",
      role: "interviewer",
      elapsedSeconds: 358,
      content: [{ type: "text", value: "So what do you do about that gap?" }],
    },
    {
      id: "31",
      role: "candidate",
      elapsedSeconds: 372,
      content: [
        {
          type: "text",
          value:
            "Passive checking on top — the LB watches its own live requests, and if a backend's error or timeout rate spikes past some threshold, pull it immediately instead of waiting on the polling cycle.",
        },
        {
          id: "highlight-active-passive-health",
          type: "highlight",
          status: "strong",
          value: "Adds passive detection once the polling gap is made concrete",
          explanation:
            "The candidate doesn't volunteer active+passive health checking as a memorized pair — they get there because the interviewer forces them to sit inside the 4-second gap first.",
        },
      ],
    },
    {
      id: "32",
      role: "interviewer",
      elapsedSeconds: 385,
      content: [{ type: "text", value: "Now the opposite problem — server's actually fine, health endpoint's just slow. What happens?" }],
    },
    {
      id: "33",
      role: "candidate",
      elapsedSeconds: 398,
      content: [
        { type: "text", value: "It gets flagged unhealthy for no real reason. Pulled from rotation even though it could take traffic." },
      ],
    },
    {
      id: "34",
      role: "interviewer",
      elapsedSeconds: 405,
      content: [{ type: "text", value: "And when it flags healthy again five seconds later?" }],
    },
    {
      id: "35",
      role: "candidate",
      elapsedSeconds: 420,
      content: [
        {
          type: "text",
          value:
            "I wouldn't dump full traffic on it right away — that's how you flap it right back into looking unhealthy. Bring it back at low weight and ramp up if it holds.",
        },
      ],
    },
    {
      id: "36",
      role: "takeaway",
      elapsedSeconds: 432,
      content: [
        {
          type: "text",
          value:
            "Two failure modes, same health-check system, opposite fixes: a server that's actually dead needs to be caught faster than the polling interval allows — that's what passive checking buys you. A server that's flagged by mistake needs to be trusted more slowly than a binary healthy/unhealthy flag would — that's what the gradual ramp-up buys you. Neither fix is about the health check being 'better,' both are about not trusting a single signal completely.",
        },
      ],
    },
    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 445,
      content: [{ type: "text", value: "Okay, last one. Where does this design actually break?" }],
    },
    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 460,
      content: [
        {
          type: "text",
          value:
            "Ring metadata. Every LB instance needs roughly the same view of the ring, or two instances could route the same client differently. That's a coordination problem I haven't solved — probably something like a shared config store or gossip between LB instances, but I'd want to think about the propagation delay there.",
        },
      ],
    },
    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 478,
      content: [{ type: "text", value: "That's a fair place to stop." }],
    },
  ],
};

const loadBalancerHld: TranscriptEntry = {
  summary: {    id: 44,

    slug: "load-balancer-hld",
    title: "Load Balancer — High-Level Design",
    category: "hld",
    difficulty: Difficulty.MEDIUM,
    duration: 25,
    tags: [
      "System Design",
      "Load Balancing",
      "Consistent Hashing",
      "Health Checks",
      "L4 vs L7",
    ],
    description:
      "High-level system design interview for a load balancer, Amazon style, written as a natural back-and-forth rather than Q&A-with-lectures. Short turns, interruptions, and a candidate who is pushed to justify choices (why L7 over L4, why a hash ring, how many virtual nodes) instead of reciting them, including one moment where the candidate proposes naive modulo hashing and has to discover why it breaks under growth rather than naming consistent hashing upfront. Ends with the candidate admitting an unsolved edge — ring metadata coordination across LB instances — rather than a tidy wrap-up. Narrator takeaways are kept to three, placed only where the conversation naturally pauses.",
  },

  transcript,
};

export default loadBalancerHld;