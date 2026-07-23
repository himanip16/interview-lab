import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Design Autocomplete & Search Recommendations",
    difficulty: Difficulty.HARD,
    duration: 50,
    template: "High Level Design",
    category: "HLD",
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
            "Let's design the autocomplete system behind a retail search box — as a customer types, we suggest completed search terms.",
        },
      ],
    },

    {
      id: "2",
      role: "candidate",
      elapsedSeconds: 14,
      content: [{ type: "text", value: "Okay. Mind if I ask a couple questions first?" }],
    },

    { id: "3", role: "interviewer", elapsedSeconds: 24, content: [{ type: "text", value: "Go ahead." }] },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 40,
      content: [
        {
          type: "text",
          value:
            "Is this ranked purely by overall popularity, or does it need to reflect what's trending right now? And is it just English, or multiple languages?",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 62,
      content: [
        {
          type: "text",
          value:
            "Both trending and steady-state popularity matter, and yes — multiple languages, not just English.",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 84,
      content: [
        {
          type: "text",
          value:
            "And latency — this fires on every keystroke, so I'm guessing there's a real budget, not just 'be fast.'",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 106,
      content: [
        { type: "text", value: "Tens of milliseconds at p99. Assume that's non-negotiable." },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 128,
      content: [
        {
          type: "text",
          value:
            "Got it. Before I draw boxes, can I just follow one request through the system? I find that grounds things better than starting from data structures.",
        },
      ],
    },

    { id: "9", role: "interviewer", elapsedSeconds: 145, content: [{ type: "text", value: "Please." }] },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 168,
      content: [
        {
          type: "text",
          value:
            "So — a customer types 'iph'. The client sends that prefix, along with their locale, to some autocomplete service. That service has to hand back maybe ten suggestions, and it has to do it inside that tens-of-milliseconds window. Given that budget, I don't think we can afford to do any real ranking work at query time — whatever happens on the read path has to already be mostly decided before the request arrives.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 205,
      content: [{ type: "text", value: "Okay, keep going from there." }],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 230,
      content: [
        {
          type: "text",
          value:
            "Let me start with something simple, even though I already suspect it won't survive the latency requirement — I'd rather find that out than assume it. Build a trie from historical search terms, character by character. At query time, walk to the node matching the typed prefix, then look at everything under it, count up frequency, return the top ten.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 262,
      content: [
        {
          type: "text",
          value:
            "Someone types just the letter 'a'. How much of the trie does 'look at everything under it' actually touch?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 288,
      content: [
        {
          type: "text",
          value:
            "Hmm. Basically everything that starts with 'a' — which is a lot. That's nowhere close to tens of milliseconds if I'm walking a subtree that size on every keystroke.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 312,
      content: [{ type: "text", value: "So what do you do about it?" }],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 335,
      content: [
        {
          type: "text",
          value:
            "My first instinct is just to throw more servers at it — replicate the trie so more queries can be served in parallel.",
        },
        {
          id: "highlight-scale-out-only",
          type: "highlight",
          status: "missed",
          value: "",
          explanation:
            "Adding replicas increases throughput, not per-request latency — a single query still has to traverse a massive subtree, so the tens-of-milliseconds ceiling is still violated no matter how many replicas serve it.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 360,
      content: [
        {
          type: "text",
          value:
            "That gets you more queries per second. Does it make any single query faster?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 385,
      content: [
        {
          type: "text",
          value:
            "...No. Each request still walks the same huge subtree, I've just given myself more machines doing that same slow thing. That's throughput, not latency. Let me think about this differently — the subtree walk itself can't happen on the read path at all.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 415,
      content: [{ type: "text", value: "So where does it happen instead?" }],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 442,
      content: [
        { type: "text", value: "What if I moved that work to " },
        {
          id: "highlight-denormalized-topk",
          type: "highlight",
          status: "strong",
          value: "write time instead of read time",
          explanation:
            "Correctly shifts the expensive aggregation off the latency-critical read path — caching a small top-K heap at every node trades cheap, frequent writes for a read path that's just a bounded walk down to one node.",
        },
        {
          type: "text",
          value:
            "? Every node in the trie keeps a small, already-sorted list of its own top completions, and I update that list whenever something below it gets searched. Then a query just walks down to one node and reads whatever's cached there. No subtree walk on the read path.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 478,
      content: [{ type: "text", value: "Sit with that for a second — what did you just trade away?" }],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 505,
      content: [
        {
          type: "text",
          value:
            "Every search now costs more on the write side — I'm touching a bunch of ancestor nodes instead of just logging an event somewhere. I'm betting that reads vastly outnumber writes here, so it's worth paying more per write to make every read cheap. But I'm making that trade without knowing the actual read-to-write ratio yet.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 535,
      content: [
        {
          type: "text",
          value:
            "Fair, we can assume reads dominate heavily here — every keystroke is a read, searches are comparatively rare. Let's shift gears. Your customer in Tokyo searches. There are no spaces between words. Does character-by-character trie insertion still work?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 565,
      content: [
        {
          type: "text",
          value:
            "It doesn't, the way I described it — I was quietly assuming whitespace tells me where a word starts and ends, and that's an English-specific assumption, not a universal one.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 590,
      content: [{ type: "text", value: "What would you change?" }],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 615,
      content: [
        {
          type: "text",
          value:
            "I'd need something that segments text for a given script before it ever reaches the trie. My instinct is to also just split into a separate trie per language, so segmentation logic doesn't have to fight itself inside one shared structure. Though — actually, before I commit to that, I'd want to know the scale we're talking about. If there are, say, a hundred million terms spread across two hundred locales, separate tries probably simplifies things a lot. If ninety percent of traffic is one dominant locale, maybe the split needs to look different, like size-based rather than strictly one-tree-per-language.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 655,
      content: [
        {
          type: "text",
          value:
            "Assume it's closer to your first number — broad, fairly even spread across a couple hundred locales. Given that, is splitting by locale something you could walk back easily later?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 688,
      content: [
        {
          type: "text",
          value:
            "I don't think so. Once caching, counting, everything downstream is built assuming that boundary, un-splitting or re-splitting it means touching data across every locale we've ever built. That feels like the heavier decision here — get it wrong and moving things later is painful. Whatever segmentation library I pick for any one language, on the other hand, feels easy to swap out without anyone else noticing.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 722,
      content: [
        {
          type: "text",
          value:
            "Okay. Let's go back to that cached top-K sitting at each node. A major news event breaks and a term nobody searched yesterday suddenly explodes. How fresh is that cache?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 752,
      content: [
        {
          type: "text",
          value:
            "If I only recompute it from an overnight batch job — not at all, really, not until the next run. By then the news cycle's probably moved on.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 778,
      content: [{ type: "text", value: "So?" }],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 802,
      content: [
        {
          type: "text",
          value:
            "So searches need to feed the counters continuously, not in a nightly batch — each search nudges the count for its term, and that has to ripple up to the cached top-K at every ancestor node fairly quickly, not the next day.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 828,
      content: [
        {
          type: "text",
          value:
            "Are you keeping an exact count for every term that's ever been typed?",
        },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 855,
      content: [
        {
          type: "text",
          value:
            "Probably not — most terms are one-off and will never come close to a top-ten list, so exact counting for all of them is memory I don't need to spend. Something approximate, with a small bounded error, should be fine, since I only care about relative ranking among the top handful, not the precise count of something obscure.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 882,
      content: [{ type: "text", value: "That approximation choice — same category of decision as the locale split?" }],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 908,
      content: [
        {
          type: "text",
          value:
            "No, this one feels smaller — it's internal to how one node keeps its own counts. I could change the counting scheme later without anyone outside that node ever noticing, as long as it still hands back a top-K list the same way.",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 935,
      content: [
        {
          type: "text",
          value:
            "That same trending term now means a huge share of all traffic is hitting one specific node, over and over, in the same second. What happens to it?",
        },
      ],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 962,
      content: [
        {
          type: "text",
          value:
            "That node just becomes hot. Whatever single server happens to own that shard is suddenly taking a wildly disproportionate share of reads while everything else sits idle.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 988,
      content: [
        {
          type: "text",
          value: "Let's stay right here for a minute. What would you actually try first?",
        },
      ],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 1015,
      content: [
        {
          type: "text",
          value: "I'd want to detect that a node's traffic has spiked, and " },
        {
          id: "highlight-hot-node-replication",
          type: "highlight",
          status: "strong",
          value: "replicate just that node's cached top-K to a few extra servers",
          explanation:
            "Correctly scopes the mitigation to the specific hot node rather than over-engineering a global caching layer before confirming the problem is localized.",
        },
        {
          type: "text",
          value:
            ", so the load spreads across more than one machine. It's a fairly blunt fix, but it's cheap and it directly targets the one node that's actually in trouble, instead of rebuilding caching everywhere.",
        },
      ],
    },

    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 1048,
      content: [
        {
          type: "text",
          value:
            "Okay, let's move on for now — I want to come back to resiliency more broadly in a bit. First: why build custom trie infrastructure at all, instead of pointing autocomplete at whatever general-purpose search engine you'd probably already have for full product search?",
        },
      ],
    },

    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 1082,
      content: [
        {
          type: "text",
          value:
            "A general search engine is tuned for scoring relevance across whole documents. Even a fast one isn't really built for a single-field prefix lookup that has to land in tens of milliseconds on every keystroke. I'd lean toward something purpose-built, but I'll admit that's a bigger bet — a lot of tooling and operational muscle grows up around infrastructure like that, and it's not something we'd casually rip out in a year.",
        },
      ],
    },

    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 1115,
      content: [
        {
          type: "text",
          value:
            "Let's talk about failure more directly now. Say the real-time counting pipeline you described earlier falls behind during a spike. What does the customer actually see while it catches up?",
        },
      ],
    },

    {
      id: "44",
      role: "candidate",
      elapsedSeconds: 1148,
      content: [
        {
          type: "text",
          value:
            "I wouldn't want the read path waiting on that pipeline at all. If it's lagging, I'd rather just serve whatever top-K is already cached — a little stale — than have the request hang or come back empty. Something like a circuit breaker in front of the live counting dependency, so a slow pipeline degrades freshness, not availability.",
        },
      ],
    },

    {
      id: "45",
      role: "interviewer",
      elapsedSeconds: 1178,
      content: [
        {
          type: "text",
          value:
            "Now, separately — one locale's pipeline has a bug and starts falling badly behind. Should that touch any other locale?",
        },
      ],
    },

    {
      id: "46",
      role: "candidate",
      elapsedSeconds: 1205,
      content: [
        {
          type: "text",
          value:
            "It shouldn't, and since I already split tries by locale, it seems natural to carry that same line through counting and serving too — each locale gets its own pipeline and shard set, so a bug in one stays contained instead of dragging everything else down with it.",
        },
      ],
    },

    {
      id: "47",
      role: "interviewer",
      elapsedSeconds: 1235,
      content: [
        {
          type: "text",
          value:
            "Good, that's a solid high-level picture. Let's go deeper on one specific piece — the top-K structure cached at each node. Walk me through exactly what a write touches.",
        },
      ],
    },

    {
      id: "48",
      role: "candidate",
      elapsedSeconds: 1268,
      content: [
        {
          type: "text",
          value:
            "When a search comes in for a term, I'd walk that term's path from root to leaf, and at every node along the way, check whether this term's updated count now beats whatever's currently the lowest entry in that node's cached list — if so, swap it in, otherwise leave it alone.",
        },
      ],
    },

    {
      id: "49",
      role: "interviewer",
      elapsedSeconds: 1298,
      content: [
        {
          type: "text",
          value: "How many nodes does one search event actually touch, for a longer term?",
        },
      ],
    },

    {
      id: "50",
      role: "candidate",
      elapsedSeconds: 1325,
      content: [
        {
          type: "text",
          value:
            "One per character, root to leaf — so a fifteen-character term touches fifteen nodes. That scales with the length of the term someone typed, not with how many other terms exist, which is why it stays cheap even under a lot of write volume.",
        },
      ],
    },

    {
      id: "51",
      role: "interviewer",
      elapsedSeconds: 1355,
      content: [
        {
          type: "text",
          value:
            "That's fine under normal load. During the spike we've been circling back to, where's the actual bottleneck inside this structure, specifically?",
        },
      ],
    },

    {
      id: "52",
      role: "candidate",
      elapsedSeconds: 1385,
      content: [
        {
          type: "text",
          value:
            "It's not the update logic itself, that's cheap. It's contention — millions of near-identical events are all trying to update the same handful of ancestor nodes near the root at once. That's a hot lock, not a slow computation.",
        },
      ],
    },

    {
      id: "53",
      role: "interviewer",
      elapsedSeconds: 1412,
      content: [{ type: "text", value: "How would you relieve that?" }],
    },

    {
      id: "54",
      role: "candidate",
      elapsedSeconds: 1442,
      content: [
        {
          type: "text",
          value:
            "Maybe buffer updates locally for a short window and flush a single combined delta to the hot node, instead of applying every individual event as its own write. That turns a flood of contending writes into a much smaller number of batched ones. It does mean the top-K is a few hundred milliseconds behind truly instantaneous — but against a latency-critical read path, I think that's an easy trade.",
        },
      ],
    },

    {
      id: "55",
      role: "interviewer",
      elapsedSeconds: 1472,
      content: [
        {
          type: "text",
          value: "Good. Anything you'd specifically want monitored once this is live?",
        },
      ],
    },

    {
      id: "56",
      role: "candidate",
      elapsedSeconds: 1500,
      content: [
        {
          type: "text",
          value:
            "Read latency at the tail, broken out per locale — a regression in one language shouldn't be able to hide inside a healthy global average. And how far behind that write buffer gets during a spike, since that's really what determines how stale a trending suggestion is allowed to get before it starts to matter.",
        },
      ],
    },

    {
      id: "57",
      role: "takeaway",
      elapsedSeconds: 1530,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the important move here was protecting the read path. Because autocomplete has a strict latency budget, the expensive work — ranking, aggregation, counting — got pushed into the write and ingestion side, leaving reads as a simple, bounded lookup. Once that trade was made, most of the remaining complexity was about keeping those cached results fresh without letting a spike or a single bad locale take down anything else.",
        },
      ],
    },
  ],
};

const autocompleteSearch: TranscriptEntry = {
  summary: {
    slug: "autocomplete-search-recommendations",
    title: "Design Autocomplete & Search Recommendations",
    category: "hld",
    difficulty: Difficulty.HARD,
    duration: 50,
    company: "Amazon",
    tags: [
      "Distributed Systems",
      "Low Latency",
      "Multi-Language",
      "Trie",
      "Resiliency",
      "Blast Radius Isolation",
      "One-Way vs Two-Way Doors",
    ],
    description:
      "Production-grade HLD interview covering localized top-K prefix engines, multi-language tokenization, write-time top-K denormalization for hard latency ceilings, hot-key mitigation, blast-radius isolation per locale, explicit one-way/two-way door trade-offs, and a deep component drill into the trie's top-K node structure.",
  },

  transcript,
};

export default autocompleteSearch;