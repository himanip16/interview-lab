// src/content/transcripts/system-design/url-shortener-hld.ts

import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Design a URL Shortener",
    difficulty: Difficulty.MEDIUM,
    duration: 30,
    template: "System Design",
    category: "System Design",
    company: ["Google"],
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
            "Design a URL shortener — something like TinyURL. Users submit a long URL, get back a short one, and when anyone opens that short URL, they get redirected to the original. Expect about 100 million new URLs a day, and 10 billion redirects a day. Redirect latency needs to stay under 100 milliseconds, and links should keep working for years.",
        },
      ],
    },
    {
      id: "1",
      role: "interviewer",
      elapsedSeconds: 12,
      content: [{ type: "text", value: "Where do you want to start?" }],
    },
    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 25,
      content: [
        {
          type: "text",
          value:
            "With how lopsided those two numbers are, honestly. A hundred million writes against ten billion reads — that's roughly a hundred-to-one read-to-write ratio, so before I draw anything, I already know this is going to live or die on caching and read scaling, not on the write path. But I want to check whether that traffic is smooth or spiky. If a chunk of these are marketing campaign links, I could see a single link getting hammered the moment a campaign goes live. Is that a real concern here, or is traffic reasonably uniform?",
        },
      ],
    },
    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 42,
      content: [
        { type: "text", value: "Assume mostly steady traffic, but yes — a small number of links can go viral and spike hard." },
      ],
    },
    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 55,
      content: [
        {
          type: "text",
          value:
            "Good to know, I'll want hot-key handling then. Next — how short is short? Does it need to be pronounceable or typeable by a human, or is a random-looking blob fine?",
        },
      ],
    },
    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 65,
      content: [
        { type: "text", value: "Doesn't need to be memorable. Six or seven characters, alphanumeric, is fine." },
      ],
    },
    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 75,
      content: [
        {
          type: "text",
          value:
            "That opens up my options quite a bit. Last clarifying question — 'available for years' — is there any legitimate deletion path, or once created, does a link live forever unless someone explicitly sets an expiration?",
        },
      ],
    },
    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 88,
      content: [{ type: "text", value: "Lives forever by default. Expiration is opt-in." }],
    },
    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 95,
      content: [
        {
          type: "text",
          value:
            "Okay — so storage only grows, never shrinks on its own. That's a detail I'll come back to when I think about database choice. I'll hold off on click analytics for now, since that feels like something bolted onto the side of the core redirect path rather than something that shapes it. Fair to set that aside until the core design's solid?",
        },
      ],
    },
    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 108,
      content: [{ type: "text", value: "Fair. Let's start with the API." }],
    },
    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 122,
      content: [
        {
          type: "text",
          value:
            "Two endpoints, roughly. A POST to something like /shorten, taking the long URL and optionally a custom alias, returning the short URL. And a GET on /{shortcode} that does the actual redirect.",
        },
      ],
    },
    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 132,
      content: [{ type: "text", value: "What HTTP status code for the redirect, and why does it matter?" }],
    },
    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 148,
      content: [
        {
          type: "text",
          value:
            "It's a smaller question than it looks. A 301 tells the browser 'this is permanent, cache it yourself' — which is great for my server load, since the browser stops asking me entirely after the first hit. A 302 says 'temporary, ask me again next time,' which costs me more requests but means I actually see every redirect happen. Given that click analytics is on the requirements list even as optional, I'd lean 302 — otherwise I'm blind to a huge share of my own traffic.",
        },
        {
          id: "highlight-redirect-status",
          type: "highlight",
          status: "strong",
          value: "Ties an HTTP status code choice back to a business requirement, not habit",
          explanation:
            "301 vs 302 is often picked by convention. The candidate instead derives it from whether analytics matters, which is the kind of small decision that reveals whether someone's actually thinking about the whole system.",
        },
      ],
    },
    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 165,
      content: [{ type: "text", value: "Agreed, go with 302. Now — how do you actually generate the short code?" }],
    },
    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 182,
      content: [
        {
          type: "text",
          value:
            "Two directions worth weighing. One — hash the long URL, like MD5, and truncate to seven characters. Simple, deterministic, but truncated hashes collide, and now I'm doing a lookup on every write just to check, and retrying with a different salt if it collides. Two — keep a global counter, and base62-encode it. No collisions ever, by construction, since every counter value is unique. I'd lean counter.",
        },
      ],
    },
    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 195,
      content: [{ type: "text", value: "A single global counter at 100 million writes a day. Isn't that just a bottleneck with extra steps?" }],
    },
    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 212,
      content: [
        {
          type: "text",
          value:
            "It would be, if every write hit the same counter row. So don't do that — hand out ranges instead. An app server asks a lightweight coordination service for a block, say a thousand IDs at a time, and then mints short codes locally out of that block without talking to anyone else until it runs out. Same idea as Snowflake-style ID allocation.",
        },
      ],
    },
    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 225,
      content: [{ type: "text", value: "And if that app server crashes with 400 unused IDs still in its block?" }],
    },
    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 240,
      content: [
        {
          type: "text",
          value:
            "Those IDs are just gone. Never reused, never assigned. And I'm fine with that — seven base62 characters gives me something like 3.5 trillion possible codes. Even wasting thousands per crash, I'd need an absurd number of crashes to make a dent in a keyspace that size over a few years.",
        },
        {
          id: "highlight-wasted-id-tradeoff",
          type: "highlight",
          status: "strong",
          value: "Accepts a small, permanent waste of ID space instead of engineering around it",
          explanation:
            "A weaker answer tries to reclaim the lost IDs, adding complexity to solve a problem that the sheer size of the keyspace already makes irrelevant. The candidate checks the actual numbers before deciding it's worth solving.",
        },
      ],
    },
    {
      id: "19",
      role: "takeaway",
      elapsedSeconds: 255,
      content: [
        {
          type: "text",
          value:
            "Worth noticing what just happened: the candidate didn't defend the counter approach in the abstract, they did the arithmetic. 3.5 trillion possible codes against 100 million writes a day is the kind of back-of-envelope check that turns 'is this safe?' into a yes/no instead of a feeling.",
        },
      ],
    },
    {
      id: "20",
      role: "interviewer",
      elapsedSeconds: 268,
      content: [{ type: "text", value: "Sketch the architecture for me." }],
    },
    {
      id: "21",
      role: "candidate",
      elapsedSeconds: 300,
      content: [
        {
          type: "whiteboard",
          value:
            "<svg viewBox=\"0 0 420 260\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"10\" y=\"110\" width=\"70\" height=\"40\" rx=\"6\" fill=\"none\" stroke=\"currentColor\"/><text x=\"20\" y=\"134\" font-size=\"12\">Client</text><rect x=\"110\" y=\"110\" width=\"90\" height=\"40\" rx=\"6\" fill=\"none\" stroke=\"currentColor\"/><text x=\"120\" y=\"134\" font-size=\"12\">Load Balancer</text><rect x=\"230\" y=\"40\" width=\"90\" height=\"40\" rx=\"6\" fill=\"none\" stroke=\"currentColor\"/><text x=\"238\" y=\"64\" font-size=\"12\">App Servers</text><rect x=\"230\" y=\"180\" width=\"90\" height=\"40\" rx=\"6\" fill=\"none\" stroke=\"currentColor\"/><text x=\"235\" y=\"204\" font-size=\"11\">ID Range Service</text><rect x=\"350\" y=\"40\" width=\"60\" height=\"40\" rx=\"6\" fill=\"none\" stroke=\"currentColor\"/><text x=\"362\" y=\"64\" font-size=\"12\">Cache</text><rect x=\"350\" y=\"180\" width=\"60\" height=\"40\" rx=\"6\" fill=\"none\" stroke=\"currentColor\"/><text x=\"365\" y=\"204\" font-size=\"12\">DB</text><line x1=\"80\" y1=\"130\" x2=\"110\" y2=\"130\" stroke=\"currentColor\"/><line x1=\"200\" y1=\"120\" x2=\"230\" y2=\"70\" stroke=\"currentColor\"/><line x1=\"230\" y1=\"200\" x2=\"200\" y2=\"140\" stroke=\"currentColor\"/><line x1=\"320\" y1=\"60\" x2=\"350\" y2=\"60\" stroke=\"currentColor\"/><line x1=\"320\" y1=\"200\" x2=\"350\" y2=\"200\" stroke=\"currentColor\"/><line x1=\"380\" y1=\"80\" x2=\"380\" y2=\"180\" stroke=\"currentColor\" stroke-dasharray=\"3,3\"/></svg>",
          caption: "Client → LB → app servers, which read the cache first and fall through to the DB, with a separate ID range service on the write path",
        },
        {
          type: "text",
          value:
            "Nothing exotic. Client hits the load balancer, app servers handle both the shorten and redirect paths. Redirects check cache first, only falling through to the database on a miss. Writes go through the app server too, but only touch the ID range service, not the read cache directly — I don't want write traffic anywhere near the thing serving ten billion reads a day.",
        },
      ],
    },
    {
      id: "22",
      role: "interviewer",
      elapsedSeconds: 320,
      content: [{ type: "text", value: "SQL or NoSQL for the actual mapping table?" }],
    },
    {
      id: "23",
      role: "candidate",
      elapsedSeconds: 338,
      content: [
        {
          type: "text",
          value:
            "The access pattern is about as simple as it gets — short code in, long URL out. No joins, no multi-row transactions in the common case. That screams key-value store to me — something like DynamoDB or Cassandra, wide-column, horizontally scalable by just adding nodes. I wouldn't reach for a relational database here; I'd be paying for guarantees I'm not using.",
        },
      ],
    },
    {
      id: "24",
      role: "interviewer",
      elapsedSeconds: 350,
      content: [{ type: "text", value: "What about custom aliases, though — two people racing for the same one. NoSQL doesn't give you transactions." }],
    },
    {
      id: "25",
      role: "candidate",
      elapsedSeconds: 365,
      content: [
        {
          type: "text",
          value:
            "I don't actually need a full transaction, just a conditional write — put this row only if the key doesn't already exist. DynamoDB supports that natively. It's a much smaller guarantee than a transaction, but it's exactly the guarantee this problem needs.",
        },
      ],
    },
    {
      id: "26",
      role: "interviewer",
      elapsedSeconds: 378,
      content: [{ type: "text", value: "Let's get into caching, then, since you keep leaning on it." }],
    },
    {
      id: "27",
      role: "candidate",
      elapsedSeconds: 400,
      content: [
        {
          type: "text",
          value:
            "Cache-aside on the redirect path — check cache, miss, hit the DB, populate the cache, return. With a hundred-to-one read-write ratio, an LRU cache is going to absorb the overwhelming majority of redirects before they ever touch the database. TTL doesn't need to be aggressive either, since a short code's target basically never changes once created.",
        },
      ],
    },
    {
      id: "28",
      role: "interviewer",
      elapsedSeconds: 412,
      content: [{ type: "text", value: "You mentioned viral links earlier. What happens when one link suddenly gets a huge spike, right as its cache entry expires?" }],
    },
    {
      id: "29",
      role: "candidate",
      elapsedSeconds: 428,
      content: [
        {
          type: "text",
          value:
            "That's the classic cache stampede — a thousand requests all miss at the same instant and all go pound the database for the same row. I'd add request coalescing at the app server: the first request in goes to the DB, everyone else behind it for that same key just waits on that one in-flight lookup instead of firing their own. One database hit instead of a thousand.",
        },
      ],
    },
    {
      id: "30",
      role: "interviewer",
      elapsedSeconds: 440,
      content: [{ type: "text", value: "Sub-100ms redirect latency, globally. How do you actually hit that number?" }],
    },
    {
      id: "31",
      role: "candidate",
      elapsedSeconds: 458,
      content: [
        {
          type: "text",
          value:
            "Geography's the real enemy of latency, more than compute. I'd push the redirect logic to the edge — CDN-level, or edge functions — so a user in Singapore isn't round-tripping to a data center in Virginia for something as trivial as a redirect. Hot links live in edge caches close to where they're actually being clicked; only genuinely cold, rarely-hit codes fall all the way back to a central database.",
        },
      ],
    },
    {
      id: "32",
      role: "interviewer",
      elapsedSeconds: 470,
      content: [{ type: "text", value: "Where does this design actually break as it scales?" }],
    },
    {
      id: "33",
      role: "candidate",
      elapsedSeconds: 490,
      content: [
        {
          type: "text",
          value:
            "Honestly, not where I'd have guessed at the start. The redirect path scales fine — it's mostly cache hits and edge logic. The part that worries me is analytics, once we bring it back in. Ten billion redirects a day means ten billion potential analytics events. If I write each one synchronously on the redirect's critical path, I've just tied my 100ms latency budget to an analytics write, which is absurd.",
        },
      ],
    },
    {
      id: "34",
      role: "interviewer",
      elapsedSeconds: 502,
      content: [{ type: "text", value: "So don't do that." }],
    },
    {
      id: "35",
      role: "candidate",
      elapsedSeconds: 515,
      content: [
        {
          type: "text",
          value:
            "Right — fire the event onto something like Kafka after the redirect's already been sent to the user, and let a separate consumer aggregate it into whatever analytics store downstream, on its own schedule. The user never waits on it.",
        },
        {
          id: "highlight-analytics-decoupling",
          type: "highlight",
          status: "strong",
          value: "Identifies the 'optional' feature as the actual scaling risk",
          explanation:
            "Click analytics was framed as optional in the requirements, which makes it easy to underweight. The candidate correctly clocks that at 10B events/day it's arguably harder to scale than the core redirect, and decouples it before it can contaminate the latency budget.",
        },
      ],
    },
    {
      id: "36",
      role: "takeaway",
      elapsedSeconds: 528,
      content: [
        {
          type: "text",
          value:
            "That's a useful instinct to name explicitly: 'optional' in a requirements doc describes priority, not scale. Analytics was the last thing on the list and turns out to be the biggest volume in the entire system. The fix isn't cutting the feature, it's making sure it can never sit on the same critical path as the 100ms guarantee.",
        },
      ],
    },
    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 540,
      content: [{ type: "text", value: "Last one. Your ID range service goes down. What breaks?" }],
    },
    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 555,
      content: [
        {
          type: "text",
          value:
            "New shorten requests start failing, or queue up if I've got a retry with backoff. But redirects keep working completely untouched, because reads never go anywhere near that service — they only ever hit cache and the DB. It's a nice property of this design that write-path failures and read-path failures are almost entirely decoupled from each other.",
        },
      ],
    },
    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 565,
      content: [{ type: "text", value: "And the cache — what if it just disappears entirely?" }],
    },
    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 582,
      content: [
        {
          type: "text",
          value:
            "That one actually worries me more. Every redirect becomes a database read, and I'm suddenly asking the DB to eat ten billion reads a day cold, with no warm-up. I'd want a circuit breaker that sheds load rather than letting the database fall over entirely — serve a slightly slower redirect, or in the worst case a brief error, instead of a full outage. And I'd bring the cache back up warmed from a snapshot rather than empty, so I'm not walking straight back into the same stampede I just survived.",
        },
      ],
    },
    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 595,
      content: [{ type: "text", value: "That's a good place to stop." }],
    },
  ],
};

const urlShortenerHld: TranscriptEntry = {
  summary: {    id: 46,

    slug: "url-shortener-hld",
    title: "URL Shortener — High-Level Design",
    category: "hld",
    difficulty: Difficulty.MEDIUM,
    duration: 30,
    tags: [
      "System Design",
      "Caching",
      "Database Design",
      "ID Generation",
      "Scalability",
    ],
    description:
      "High-level system design interview for a URL shortener, written as a genuine back-and-forth rather than a lecture with dialogue attached. The candidate reasons out loud with some wit but stays logically anchored — deriving the redirect status code from the analytics requirement instead of habit, choosing counter-based ID generation over hashing and defending the wasted-ID tradeoff with real arithmetic against the keyspace size, and landing on request coalescing for cache stampedes and Kafka-based decoupling once analytics turns out to be the real scaling risk hiding behind an 'optional' requirement. Failure scenarios close the interview by showing that read and write paths fail almost independently of each other, without wrapping every open question into a tidy bow.",
  },

  transcript,
};

export default urlShortenerHld;