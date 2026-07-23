import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Optimize Repeated Resource Fetching on a Mobile Client",
    difficulty: Difficulty.MEDIUM,
    duration: 35,
    template: "Coding",
    category: "DSA",
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
            "A mobile app needs a set of resources from the server — A, B, C, D, whatever. Here's an access log: A A B A B B B A C A C D. Each one hits the server and gets processed. Memory and CPU on the device are both limited, and the server call is expensive. Optimize this.",
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
            "Okay — looking at that log, it's not random. A shows up, then again two requests later, B repeats three times in a row at one point... there's clumping.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 28,
      content: [
        {
          type: "text",
          value: "So?",
        },
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
            "So whatever we just used is likely to get used again soon. If that holds, we don't need to go to the server every single time — we cache locally and only fall back to the server on a miss.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 64,
      content: [
        {
          type: "text",
          value: "Cache everything, forever?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 82,
      content: [
        {
          type: "text",
          value:
            "No — device has limited memory, you said. Can't just keep growing a map. Needs a cap, and some rule for what gets thrown out once it's full.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 98,
      content: [
        {
          type: "text",
          value: "What rule.",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 122,
      content: [
        {
          type: "text",
          value:
            "First instinct is frequency — keep whatever's been asked for the most. But actually, no — that reacts slowly. Something could've been hot yesterday and dead today and frequency counting still protects it. What actually matches the pattern here is ",
        },
        {
          id: "highlight-locality-lru",
          type: "highlight",
          status: "strong",
          value: "recency, not frequency",
          explanation:
            "Correctly distinguishes LRU from LFU by tying the eviction policy to the actual access pattern (temporal locality) rather than defaulting to a frequency counter, which reacts slower to shifting hot sets.",
        },
        {
          type: "text",
          value: " — evict whatever hasn't been touched in the longest time. So, LRU.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 148,
      content: [
        {
          type: "text",
          value: "Fine. How do you actually build that.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 172,
      content: [
        {
          type: "text",
          value:
            "I need two things — fast lookup by key, and fast reordering by recency. A hash map alone gives me lookup but no ordering. A plain list gives me ordering but lookup's linear.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 190,
      content: [
        {
          type: "text",
          value: "So combine them.",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 214,
      content: [
        {
          type: "text",
          value: "Right — ",
        },
        {
          id: "highlight-o1-structure",
          type: "highlight",
          status: "strong",
          value: "hash map plus a doubly linked list",
          explanation:
            "Identifies the standard O(1) LRU structure — a hash map for key lookup paired with a doubly linked list for recency ordering — and correctly reasons about why each alone is insufficient.",
        },
        {
          type: "text",
          value:
            ", map keys to nodes in the list. Front of the list is most recent, back is least recent. A hit moves its node to the front — that's a couple pointer updates, not a scan. A miss inserts at the front, and if we're over capacity, drop whatever's at the back. Map lookup's O(1), reordering's O(1).",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 240,
      content: [
        {
          type: "text",
          value: "Walk the log through it. Capacity 2.",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 260,
      content: [
        {
          type: "text",
          value:
            "A — miss, server call, cache is [A]. A again — hit. B — miss, server call, cache [B, A]. A — hit, moves front, [A, B]. B — hit. B, B — hit, hit.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 278,
      content: [
        {
          type: "text",
          value: "Then A, then C.",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 296,
      content: [
        {
          type: "text",
          value:
            "A — hit. Then C — miss, server call. Capacity's 2 and it's full, so... whatever's at the back goes. That'd be B, since A's been touched more recently. Cache becomes [C, A].",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 314,
      content: [
        {
          type: "text",
          value: "Then A, C, D.",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 336,
      content: [
        {
          type: "text",
          value:
            "A — hit. C — hit. D — miss, server call, evict the back — that's A now. Cache ends at [D, C]. So out of twelve requests, only four actually reached the server — A, B, C, D, once each. Everything else got served locally.",
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
          value: "Where does the actual server call live in this design?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 384,
      content: [
        {
          type: "text",
          value:
            "Not scattered through the app — I'd wrap the whole thing behind one function. Caller asks for a resource, that function checks the cache first, only calls the server ",
        },
        {
          id: "highlight-cache-aside",
          type: "highlight",
          status: "strong",
          value: "on an actual miss, then populates the cache before returning",
          explanation:
            "Correctly names and applies the cache-aside pattern — the cache sits transparently in front of every access path so callers never need to know whether a given request was a hit or a miss.",
        },
        {
          type: "text",
          value: ". Callers never know or care whether it was a hit or a miss.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 406,
      content: [
        {
          type: "text",
          value: "You said memory's limited. Capacity 2, capacity 200 — does the number matter?",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 428,
      content: [
        {
          type: "text",
          value:
            "It matters, but... hold on, actually the bigger issue is what I'm counting. If I cap it at, say, 50 items, but resource A is 2KB and resource D is 20MB, item count doesn't protect memory at all.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 448,
      content: [
        {
          type: "text",
          value: "So?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 470,
      content: [
        {
          type: "text",
          value: "I'd track ",
        },
        {
          id: "highlight-weighted-capacity",
          type: "highlight",
          status: "strong",
          value: "capacity in bytes, not item count",
          explanation:
            "Recognizes that the actual constraint is memory footprint, not entry count — a meaningful refinement for variable-size resources that a naive count-based LRU would miss.",
        },
        {
          type: "text",
          value:
            ", if the resources actually vary in size like that. Same structure, just evict repeatedly from the back until the new item fits, instead of stopping after one eviction.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 492,
      content: [
        {
          type: "text",
          value: "What if the resource itself changes on the server after you've cached it?",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 516,
      content: [
        {
          type: "text",
          value:
            "Hmm — that's a staleness problem, separate from the eviction problem. Depends how often these actually change. If it's rare, an ETag or version check on refetch is probably enough. If it's frequent, LRU alone isn't the whole answer, you'd want a short TTL layered on top so an entry expires even if it's still \"recent.\"",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 540,
      content: [
        {
          type: "text",
          value: "Good enough. Multiple threads hitting this cache at once — problem?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 562,
      content: [
        {
          type: "text",
          value:
            "If it's genuinely single-threaded on the device, no. If not, the map and the list both need to be behind one lock, or you get a torn update — one thread mid-reorder while another's evicting. I'd rather take one coarse lock around get/put than try to make the linked-list pointer updates lock-free, that's not worth the complexity here.",
        },
      ],
    },

    {
      id: "29",
      role: "takeaway",
      elapsedSeconds: 590,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the access pattern shows temporal locality, which points to LRU over LFU or a bare TTL cache. A hash map plus a doubly linked list gets O(1) get/put, wrapped behind a cache-aside function so callers never see the difference between a hit and a miss. Capacity should be sized in bytes if resources vary in size, and staleness (ETags or a short TTL) is a separate concern layered on top of eviction, not solved by it.",
        },
      ],
    },
  ],
};

const resourceCaching: TranscriptEntry = {
  summary: {
    slug: "mobile-resource-caching-lru",
    title: "Optimize Repeated Resource Fetching on a Mobile Client",
    category: "dsa",
    difficulty: Difficulty.MEDIUM,
    duration: 35,
    company: "Generic",
    tags: [
      "Caching",
      "LRU",
      "Data Structures",
      "Hash Map",
      "Linked List",
      "Mobile Systems",
      "Cache-Aside Pattern",
    ],
    description:
      "Coding interview deriving an LRU cache from an access-pattern log: recency vs. frequency, O(1) hash-map-plus-linked-list design, byte-weighted capacity, and staleness vs. eviction.",
  },

  transcript,
};

export default resourceCaching;