// src/content/transcripts/technical/most-frequent-word-scrollable-viewport.ts

import { Difficulty } from "@prisma/client";
import { TranscriptData } from "@/features/library/types/transcript";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Most Frequent Word in a Scrollable Viewport",
    difficulty: Difficulty.HARD,
    duration: 45,
    template: "DSA",
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
            "You have a long, scrollable page of text content. At any point in time, I want to know the word that occurs most frequently within whatever's currently visible on screen. Design this.",
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
            "A few things I need before picking a structure. Is 'currently visible' a contiguous range of words — like word index 500 to 650 — or something more complex like multiple visible blocks? Is matching case-insensitive, and do we strip punctuation? And if two words tie for most frequent, is any correct answer acceptable, or is there a tie-break rule?",
        },
      ],
    },
    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 40,
      content: [
        {
          type: "text",
          value:
            "Contiguous range, yes. Case-insensitive, punctuation stripped. Any word at max frequency is an acceptable answer on a tie.",
        },
      ],
    },
    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 58,
      content: [
        {
          type: "text",
          value:
            "Good, that simplifies things. Edge cases before I propose anything: empty visible window returns no result. A window that's a single word returns that word trivially. And scroll events can fire very rapidly — every frame, potentially — so whatever I design has to handle the window shifting by a small amount very often, not just handle one static query.",
        },
        {
          id: "highlight-frame-rate-edge-case",
          type: "highlight",
          status: "strong",
          value: "Identifies scroll-event frequency as a first-class constraint before proposing a design",
          explanation:
            "The candidate treats 'this gets called constantly, not once' as part of the problem definition itself, not an afterthought optimization concern raised later by the interviewer.",
        },
      ],
    },
    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 85,
      content: [
        {
          type: "text",
          value: "Give me a brute-force approach and its cost before you write anything.",
        },
      ],
    },
    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 110,
      content: [
        {
          type: "text",
          value:
            "On every scroll event, take the current window of visible words, build a fresh HashMap of word to count by scanning the whole window, then scan that map to find the max. If the window has w words, that's O(w) to build the count map, plus O(distinct words) to find the max — call it O(w) overall per query, worst case. If scroll events fire on every frame at 60fps and w is a few hundred words, that's re-scanning hundreds of words sixty times a second — wasteful, since between two adjacent scroll positions almost the entire window is unchanged, only a few words entered or left at the edges.",
        },
        {
          id: "highlight-brute-force-cost",
          type: "highlight",
          status: "strong",
          value: "States O(w) per-query brute-force cost and names exactly why it's wasteful given the access pattern",
          explanation:
            "Complexity is stated up front, and the justification for optimizing isn't generic — it's tied to the specific fact that adjacent windows overlap almost entirely.",
        },
      ],
    },
    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 140,
      content: [
        {
          type: "text",
          value: "So don't recompute from scratch. What do you do instead?",
        },
      ],
    },
    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 165,
      content: [
        {
          type: "text",
          value:
            "Sliding window update: when the window shifts, I only touch the words that entered and the words that left — decrement the leaving word's count, increment the entering word's count. That's O(1) per word crossing the boundary, not O(w) for the whole window. The harder part is getting the max efficiently after each of those small updates, without rescanning every distinct word's count.",
        },
      ],
    },
    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 185,
      content: [
        {
          type: "text",
          value: "Right — that's the actual problem. A max-heap gets you the max fast. Why not just do that?",
        },
      ],
    },
    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 210,
      content: [
        {
          type: "text",
          value:
            "A heap gives O(log n) for updates and O(1) peek at the max, which is good, but it has a real problem here — when a word's count changes, I need to update its position in the heap, and standard binary heaps don't support efficient arbitrary-key updates without an auxiliary index mapping word to heap position, which adds real complexity. Also, decrementing a count means the old max might not be the new max anymore, and a heap alone doesn't cleanly tell me 'the second-highest count' without more scanning. I'd rather use a structure built specifically for O(1) increment, decrement, and get-max — a frequency-bucket structure, similar to how an LFU cache tracks access counts.",
        },
        {
          id: "highlight-heap-rejection",
          type: "highlight",
          status: "strong",
          value: "Explains specifically why a heap is a worse fit here, not just that a different structure exists",
          explanation:
            "Rather than jumping straight to the target data structure, candidate engages with the heap option honestly and names its concrete limitation — arbitrary key updates — before moving on.",
        },
      ],
    },
    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 245,
      content: [
        {
          type: "text",
          value: "Describe the frequency-bucket structure. What's actually in it?",
        },
      ],
    },
    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 280,
      content: [
        {
          type: "text",
          value:
            "Two pieces working together. First, a HashMap from word to its current count — that's how I know a word's count in O(1). Second, a doubly linked list of 'frequency buckets', each bucket holding the set of words that currently share that exact count, and the buckets are kept in ascending count order in the list. Each word also stores a reference to which bucket node it's currently sitting in. When a word's count changes, I move it from its old bucket to the correct neighboring bucket — creating a new bucket if none exists at that count yet, and deleting the old bucket if it becomes empty. The max is just whatever bucket sits at the tail of the list — O(1) to read.",
        },
        {
          id: "highlight-bucket-structure",
          type: "highlight",
          status: "strong",
          value: "Designs the frequency-bucket doubly linked list with word-to-bucket back-references",
          explanation:
            "This is the core structural insight — buckets ordered by count with O(1) neighbor access, plus a back-reference from word to bucket so a word's move is O(1) rather than requiring a search.",
        },
      ],
    },
    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 310,
      content: [
        {
          type: "text",
          value: "Code the core move-and-update operation. Plain Java.",
        },
      ],
    },
    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 380,
      content: [
        {
          type: "code",
          language: "java",
          value:
            "class Bucket {\n    int count;\n    Bucket prev;\n    Bucket next;\n    Set<String> words = new LinkedHashSet<>();\n\n    Bucket(int count) {\n        this.count = count;\n    }\n}\n\npublic class WordFrequencyTracker {\n    private final Map<String, Integer> wordCount = new HashMap<>();\n    private final Map<String, Bucket> wordBucket = new HashMap<>();\n    private final Bucket head = new Bucket(Integer.MIN_VALUE);\n    private final Bucket tail = new Bucket(Integer.MAX_VALUE);\n\n    public WordFrequencyTracker() {\n        head.next = tail;\n        tail.prev = head;\n    }\n\n    public void increment(String word) {\n        int oldCount = wordCount.getOrDefault(word, 0);\n        int newCount = oldCount + 1;\n        wordCount.put(word, newCount);\n\n        Bucket oldBucket = wordBucket.get(word);\n        Bucket newBucket = (oldBucket != null && oldBucket.next.count == newCount)\n                ? oldBucket.next\n                : insertBucketAfter(oldBucket != null ? oldBucket : head, newCount);\n\n        newBucket.words.add(word);\n        wordBucket.put(word, newBucket);\n\n        if (oldBucket != null) {\n            oldBucket.words.remove(word);\n            if (oldBucket.words.isEmpty()) {\n                removeBucket(oldBucket);\n            }\n        }\n    }\n\n    private Bucket insertBucketAfter(Bucket node, int count) {\n        Bucket created = new Bucket(count);\n        created.prev = node;\n        created.next = node.next;\n        node.next.prev = created;\n        node.next = created;\n        return created;\n    }\n\n    private void removeBucket(Bucket bucket) {\n        bucket.prev.next = bucket.next;\n        bucket.next.prev = bucket.prev;\n    }\n\n    public String getMaxWord() {\n        if (tail.prev == head) return null;\n        return tail.prev.words.iterator().next();\n    }\n}",
        },
        {
          type: "text",
          value:
            "Sentinel head and tail buckets so I never special-case an empty list. getMaxWord() just looks at tail.prev.",
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
            "I don't see a decrement() for words leaving the window. Sketch it, and tell me the bug you'd hit if you just mirrored increment() carelessly.",
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
            "The mirrored version moves a word to the bucket *before* its current one instead of after, and deletes the entry entirely if its count hits zero rather than moving it to a zero-bucket. The bug I'd hit if I copy-pasted increment() without changing direction: I'd search `oldBucket.next` for the target count instead of `oldBucket.prev`, which is exactly backwards — decrementing always moves toward the head, not the tail. If I got that wrong, words would end up parked in buckets with counts higher than their real count, and getMaxWord would silently return a word that isn't actually the most frequent anymore.",
        },
        {
          id: "highlight-decrement-direction-bug",
          type: "highlight",
          status: "strong",
          value: "Names the exact directional bug from naively mirroring increment logic for decrement",
          explanation:
            "Interviewer asks the candidate to anticipate a bug rather than just write correct code from the start — candidate identifies the precise wrong-direction traversal and its silent, hard-to-notice consequence.",
        },
        {
          type: "code",
          language: "java",
          value:
            "public void decrement(String word) {\n    int oldCount = wordCount.get(word);\n    int newCount = oldCount - 1;\n\n    Bucket oldBucket = wordBucket.get(word);\n\n    if (newCount == 0) {\n        wordCount.remove(word);\n        wordBucket.remove(word);\n    } else {\n        wordCount.put(word, newCount);\n        Bucket newBucket = (oldBucket.prev.count == newCount)\n                ? oldBucket.prev\n                : insertBucketAfter(oldBucket.prev, newCount);\n        newBucket.words.add(word);\n        wordBucket.put(word, newBucket);\n    }\n\n    oldBucket.words.remove(word);\n    if (oldBucket.words.isEmpty()) {\n        removeBucket(oldBucket);\n    }\n}",
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
          value: "Why this approach over the heap, concretely — walk me through the actual numbers, not just Big-O.",
        },
      ],
    },
    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 520,
      content: [
        {
          type: "text",
          value:
            "At 60fps, a scroll event budget is about 16 milliseconds per frame, and the word-count update has to be a small fraction of that to leave room for actual rendering. With the bucket structure, each word crossing the boundary costs a constant number of hashmap lookups and linked-list pointer updates — call it low single-digit microseconds, independent of how many distinct words are in the window. A heap-with-index-map alternative would cost O(log d) per update, where d is distinct word count — for a window with a few hundred distinct words, log d is maybe 8-9, so still fast in absolute terms, but it's non-constant and carries more constant-factor overhead per operation from heap sift-up/sift-down. The real deciding factor for me wasn't raw speed at this scale — both would likely hit frame budget fine — it's that the bucket structure keeps update cost flat regardless of vocabulary size as the page and window grow, where the heap's cost grows with it.",
        },
        {
          id: "highlight-why-approach-with-data",
          type: "highlight",
          status: "strong",
          value: "Answers 'why this approach' with concrete numbers, not a restated Big-O comparison",
          explanation:
            "Follow-up specifically pushes past complexity notation into real numbers — frame budget, microseconds, distinct word counts — and the candidate gives an honest answer that both options work at this scale, isolating the actual deciding factor as scaling behavior rather than raw speed.",
        },
      ],
    },
    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 555,
      content: [
        {
          type: "text",
          value: "What did you get wrong on your first pass, before you had this clean?",
        },
      ],
    },
    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 590,
      content: [
        {
          type: "text",
          value:
            "My first instinct was to only maintain the HashMap of counts and rescan it for the max lazily, thinking I could get away with caching the last known max word and only re-deriving it when that specific word's count dropped. That falls apart the moment two words are near-tied and swap rank on almost every scroll step — I'd end up rescanning constantly anyway, which defeats the purpose. The bucket structure only clicked once I stopped thinking 'cache the answer' and started thinking 'maintain the full ordering incrementally' — that reframing is really the whole solution.",
        },
        {
          id: "highlight-what-learned",
          type: "highlight",
          status: "strong",
          value: "Reflects honestly on an earlier, weaker approach and names the specific reframing that fixed it",
          explanation:
            "Answers the 'what did you learn' layer with a real account of a discarded approach and why it failed, rather than presenting the final solution as if it were obvious from the start.",
        },
      ],
    },
    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 620,
      content: [
        {
          type: "text",
          value: "Last one — how would you test the sliding-window update logic specifically?",
        },
      ],
    },
    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 655,
      content: [
        {
          type: "text",
          value:
            "Concrete sequences: window ['the','cat','sat'], slide right to drop 'the' and add 'mat' — 'the' should decrement to zero and disappear entirely, 'mat' should appear at count 1. A tie case: two words both at count 3, getMaxWord returns either, but after one of them increments to 4, it must be the one returned. A case where the current max word's count drops to tie with the second place, confirming the max bucket now correctly holds both. And a stress case — slide the window across a long sequence of repeated words and confirm bucket count stays bounded by distinct word count, not by window length, since that's the actual efficiency claim I'm making.",
        },
        {
          id: "highlight-bounded-bucket-test",
          type: "highlight",
          status: "strong",
          value: "Includes a test that verifies the structural efficiency claim itself, not just correctness",
          explanation:
            "Testing that bucket count tracks distinct words rather than window length directly checks the premise the whole design rests on, beyond just checking that answers are correct.",
        },
      ],
    },
    {
      id: "23",
      role: "takeaway",
      elapsedSeconds: 680,
      content: [
        {
          type: "text",
          value:
            "Takeaway: this round is decisive because every technical claim gets a second and third layer of pressure — 'why this approach' isn't answered with Big-O alone, it's answered with actual frame-budget numbers and an honest admission that a heap would also work at this scale, isolating the real deciding factor as scaling behavior with vocabulary size rather than raw speed. The 'what did you learn' layer surfaces a genuinely discarded first approach — a lazy-cache idea that breaks under near-tied words swapping rank — and names the specific reframing, from caching an answer to maintaining a full ordering incrementally, that led to the bucket structure. Technically, the design correctly separates concerns: a HashMap for O(1) count lookup, a word-to-bucket back-reference for O(1) relocation, and a doubly linked list of frequency buckets kept in order for O(1) max retrieval — sentinel head/tail nodes remove special-casing at the boundaries. The sharpest moment is being asked to anticipate a bug before writing it: naively mirroring increment() for decrement() reverses the traversal direction, silently parking words in buckets with stale, too-high counts. Depth here comes from treating scroll-event frequency as a day-one constraint, not an afterthought, and from being able to defend design choices with real numbers rather than notation alone.",
        },
      ],
    },
  ],
};

const mostFrequentWordScrollableViewport: TranscriptEntry = {
  summary: {    id: 23,

    slug: "most-frequent-word-scrollable-viewport",
    title: "Most Frequent Word in a Scrollable Viewport",
    category: "dsa",
    difficulty: Difficulty.HARD,
    duration: 45,
    tags: [
      "Sliding Window",
      "Hash Map",
      "Design",
      "DSA",
      "Complexity Analysis",
      "System Design",
      "Java",
    ],
    description:
      "Design-style DSA problem: find the most frequent word within whatever's currently visible as a user scrolls a long page, with the window sliding continuously rather than being a one-off query. Candidate clarifies contiguity, case-insensitivity, punctuation handling, and tie-break rules up front, states brute-force O(w)-per-query cost and its specific waste (adjacent windows overlap almost entirely) before proposing anything, then builds an incremental sliding-window update backed by a frequency-bucket doubly linked list (LFU-cache-style) for O(1) increment, decrement, and max retrieval — explicitly rejecting a max-heap alternative by naming its arbitrary-key-update weakness rather than dismissing it in passing. Includes a live bug: naively mirroring increment() logic for decrement() reverses the bucket-traversal direction, silently corrupting the max. Answers layered follow-ups with real numbers — 60fps frame budget, microseconds per update, distinct-word scaling — an honest account of a discarded lazy-cache first approach and the reframing that fixed it, and concrete test cases including one that verifies the structural efficiency claim itself (bucket count bounded by distinct words, not window length).",
  },

  transcript,
};

export default mostFrequentWordScrollableViewport;