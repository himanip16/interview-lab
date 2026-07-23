// src/content/transcripts/lld/read-receipts.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Design WhatsApp Read Receipts (Tick Status)",
    difficulty: Difficulty.HARD,
    duration: 45,
    template: "Low Level Design",
    category: "LLD",
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
            "Let's do a low-level design problem. Assume the core messaging framework already exists, and there's already an observer-style event pipeline that fires events like message sent, delivered, and read. Your job is the component that turns those events into the tick status a user actually sees — single gray, double gray, double blue.",
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
            "Okay. Since I'm not building the event pipeline, can I assume I just receive events like 'user X read message Y' and my job is purely to maintain and expose status from there?",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 38,
      content: [
        { type: "text", value: "Exactly. You consume those events and answer 'what tick does this message show right now.'" },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 60,
      content: [
        {
          type: "text",
          value:
            "And this needs to work the same for a direct chat and a group with, say, two hundred people?",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 80,
      content: [
        { type: "text", value: "Yes, both. Group behavior is where most of the interesting problems live." },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 105,
      content: [
        {
          type: "text",
          value:
            "Let me start with the direct case since it's simpler, and use it to sanity-check the model before I complicate it for groups.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 120,
      content: [{ type: "text", value: "Go ahead." }],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 145,
      content: [
        {
          type: "text",
          value:
            "A message has a status — sent, delivered, read — and in a direct chat there's exactly one other participant, so the moment their read event arrives, the message flips straight to read, double blue. I'd model that as an enum on the message, updated by whichever event handler receives the read event.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 172,
      content: [
        {
          type: "text",
          value:
            "Now the group case. When does a message actually earn double blue there?",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 198,
      content: [
        {
          type: "text",
          value:
            "Only once every participant has read it — not just one person. So a single enum doesn't work anymore, I need to know who specifically has read it. Simplest thing: each message keeps a set of user IDs who've read it, and the tick is double blue only when that set contains every participant in the conversation.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 228,
      content: [
        {
          type: "text",
          value:
            "Fine so far. Now, different message types might need slightly different tick rules down the line — maybe disappearing messages, maybe broadcast lists. How are you structuring that so it's easy to extend?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 258,
      content: [
        {
          type: "text",
          value:
            "My first thought is to wrap each message in a decorator that adds the tick-computation behavior on top of the base message — that way I could layer on different tick rules without changing the message class itself.",
        },
        {
          id: "highlight-decorator-overreach",
          type: "highlight",
          status: "missed",
          value: "",
          explanation:
            "Decorator earns its place when behavior needs to be composed and layered dynamically at runtime. Here the tick rule is determined once, by conversation type, and never changes for a given message — that's a case for picking the right strategy up front, not wrapping and unwrapping behavior.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 288,
      content: [
        {
          type: "text",
          value:
            "Does the tick rule for a given message ever change after it's sent? Do you ever need to dynamically add or remove a layer of behavior at runtime?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 315,
      content: [
        {
          type: "text",
          value:
            "No — actually, no. Once a message is sent into a direct chat or a group, that's fixed for its whole lifetime. There's no dynamic wrapping and unwrapping happening. Decorator's solving a problem I don't have.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 340,
      content: [{ type: "text", value: "So what's a better fit?" }],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 368,
      content: [
        { type: "text", value: "I'd rather just pick " },
        {
          id: "highlight-strategy-justified",
          type: "highlight",
          status: "strong",
          value: "one tick-rule implementation per conversation type",
          explanation:
            "Justifies the pattern by what actually varies — behavior differs by a fixed, known-at-creation-time category (conversation type), which is exactly the case a simple strategy interface fits, without the runtime composition overhead decorator implies.",
        },
        {
          type: "text",
          value:
            " — a small interface with something like isFullyRead(message, context), and a direct-chat implementation and a group implementation behind it. It's chosen once, based on the conversation's type, and never changes. Simpler to read, and I'm not paying for flexibility I don't need.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 400,
      content: [
        {
          type: "text",
          value:
            "Good. Now, where does the 'has everyone read this' check actually live? Show me the class that owns it.",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 428,
      content: [
        {
          type: "text",
          value:
            "My instinct is to just put a method directly on the Message class — something like message.computeStatus() that looks at its own readBy set against the conversation's participant list.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 452,
      content: [
        {
          type: "text",
          value:
            "Group membership changes — people get added and removed. Where does the current participant list live, relative to that method?",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 480,
      content: [
        {
          type: "text",
          value:
            "It'd have to reach out to the conversation object to get the live roster, which means my message entity — supposedly just data — now depends on looking up mutable state that lives somewhere else entirely, and possibly changes after the message was even sent.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 508,
      content: [{ type: "text", value: "Is that a problem?" }],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 535,
      content: [
        {
          type: "text",
          value:
            "I think so — I'm mixing a plain data entity with logic that needs external, mutable context. It also raises a question I hadn't considered: if someone joins the group after a message was already sent, should that new person's lack of a read receipt drag an already-read message back down to not-fully-read?",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 562,
      content: [{ type: "text", value: "What's your answer?" }],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 590,
      content: [
        {
          type: "text",
          value:
            "I don't think it should — a message's tick status should only ever depend on the people who were actually in the group when it was sent. So I'd snapshot the participant list onto the message itself at send time, and keep the read-computation logic in a separate resolver class that takes the message and that snapshot, not the live, mutable conversation object. That keeps the entity as plain data and the business rule as its own thing.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 622,
      content: [
        {
          type: "text",
          value:
            "Good. Now let's build up your basic class structure a bit further, and then I want to ask something about it.",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 650,
      content: [
        {
          type: "text",
          value:
            "Sure — so, Message holds id, conversationId, senderId, and the participant snapshot at send time. Separately, a ReadReceipt tracks conversationId, userId, and which messages that user's read. And a resolver, keyed by conversation type, decides whether a given message counts as fully read given the receipts that exist so far.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 682,
      content: [
        {
          type: "text",
          value:
            "Okay. Now — what happens if two different threads call your 'mark as read' method for the same message at the exact same time?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 710,
      content: [
        {
          type: "text",
          value:
            "That could happen — same user reading from two devices at once, or two read events for the same message just landing back to back. If I'm mutating a shared readBy set without protection, I could lose an update, or get a set in a half-updated state depending on the underlying collection.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 735,
      content: [{ type: "text", value: "How do you fix that?" }],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 762,
      content: [
        {
          type: "text",
          value:
            "Simplest thing — synchronize the whole markRead method, so only one thread can touch it at a time.",
        },
        {
          id: "highlight-coarse-lock",
          type: "highlight",
          status: "missed",
          value: "",
          explanation:
            "A single lock around the whole method serializes read events for every message across the entire service, not just the one message being updated — under group fan-out with hundreds of simultaneous read events, that becomes a throughput bottleneck for something that only needs to be safe per-message.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 792,
      content: [
        {
          type: "text",
          value:
            "That method probably gets called constantly across every message in every conversation. What does one global lock do to all of that traffic?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 818,
      content: [
        {
          type: "text",
          value:
            "Right — it serializes reads for messages that have nothing to do with each other, just because they happen to share one lock. I only actually need safety per message, not across the whole service.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 842,
      content: [{ type: "text", value: "So how do you scope it down?" }],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 870,
      content: [
        {
          type: "text",
          value: "I'd keep the readBy set as a " },
        {
          id: "highlight-fine-grained-concurrency",
          type: "highlight",
          status: "strong",
          value: "concurrent, thread-safe collection keyed per message",
          explanation:
            "Correctly narrows the synchronization boundary — a concurrent set (or a ConcurrentHashMap keyed by messageId) makes each message's own state safe to mutate independently, so unrelated messages never contend with each other.",
        },
        {
          type: "text",
          value:
            " — something like a ConcurrentHashMap from messageId to a thread-safe set of user IDs. Adding a reader becomes an atomic operation on that specific message's set, and two unrelated messages never block each other at all.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 902,
      content: [
        {
          type: "text",
          value:
            "Good. Now — a follow-up that trips a lot of people up. A user goes offline for two days, comes back online, and opens the app to five hundred unread messages across several chats, all at once. What does that do to your system if you're handling this the way you've described?",
        },
      ],
    },

    {
      id: "36",
      role: "candidate",
      elapsedSeconds: 935,
      content: [
        {
          type: "text",
          value:
            "If the client fires one read event per message, that's five hundred separate events landing at nearly the same instant, each one touching its own message's concurrent set — which avoids the contention problem, but it's still five hundred individual writes and five hundred recomputations of tick status, for something that's conceptually one action: 'I've read up to here.'",
        },
      ],
    },

    {
      id: "37",
      role: "interviewer",
      elapsedSeconds: 965,
      content: [{ type: "text", value: "So how would you model it instead?" }],
    },

    {
      id: "38",
      role: "candidate",
      elapsedSeconds: 995,
      content: [
        {
          type: "text",
          value:
            "What if, instead of a set of message IDs a user has read, I track a single number per user per conversation — the sequence number of the last message they've read? A message is read by that user if its own sequence number is less than or equal to that watermark. Catching up on five hundred messages becomes one watermark update, not five hundred.",
        },
      ],
    },

    {
      id: "39",
      role: "interviewer",
      elapsedSeconds: 1028,
      content: [
        {
          type: "text",
          value: "Does that assumption always hold — that reading message five hundred means you've read everything before it?",
        },
      ],
    },

    {
      id: "40",
      role: "candidate",
      elapsedSeconds: 1058,
      content: [
        {
          type: "text",
          value:
            "It's an assumption, not a guarantee — someone could theoretically jump straight to the newest message without scrolling through the rest. But that matches how the client actually reports read state in practice, marking everything visible as read as you scroll past it, so I think it's a reasonable simplification here rather than something I'm hiding.",
        },
      ],
    },

    {
      id: "41",
      role: "interviewer",
      elapsedSeconds: 1088,
      content: [
        {
          type: "text",
          value:
            "Let's use that. Now, group read status — two hundred participants. How do you tell whether a message is fully read without checking two hundred people's watermarks on every single render?",
        },
      ],
    },

    {
      id: "42",
      role: "candidate",
      elapsedSeconds: 1120,
      content: [
        {
          type: "text",
          value:
            "If I did that naively, every time a client needs to know a message's tick, I'd query up to two hundred watermark rows and compare each one against the message's sequence number. For a chat screen showing dozens of messages at once, that's a lot of repeated, mostly redundant reads.",
        },
      ],
    },

    {
      id: "43",
      role: "interviewer",
      elapsedSeconds: 1150,
      content: [{ type: "text", value: "What would you cache instead?" }],
    },

    {
      id: "44",
      role: "candidate",
      elapsedSeconds: 1180,
      content: [
        {
          type: "text",
          value: "What if the group itself kept a single cached value — the " },
        {
          id: "highlight-group-min-watermark",
          type: "highlight",
          status: "strong",
          value: "minimum watermark across all current participants",
          explanation:
            "Denormalizes the expensive part of the computation — instead of scanning every participant's watermark per render, a single cached minimum lets any message's read status be answered with one comparison, updated incrementally rather than recomputed from scratch on every read.",
        },
        {
          type: "text",
          value:
            "? A message is fully read exactly when its sequence number is less than or equal to that one cached minimum. Any single message's tick becomes one comparison against one number, not a scan across every participant.",
        },
      ],
    },

    {
      id: "45",
      role: "interviewer",
      elapsedSeconds: 1215,
      content: [
        {
          type: "text",
          value: "How does that cached minimum get updated when one participant's watermark advances?",
        },
      ],
    },

    {
      id: "46",
      role: "candidate",
      elapsedSeconds: 1245,
      content: [
        {
          type: "text",
          value:
            "Most of the time, cheaply — if the participant whose watermark just advanced wasn't the one holding the current minimum, the group minimum doesn't change at all, so there's nothing to do. It only gets expensive in the rare case where the participant who was the minimum just advanced past it — then I actually do need to recompute the true minimum across everyone else.",
        },
      ],
    },

    {
      id: "47",
      role: "interviewer",
      elapsedSeconds: 1275,
      content: [
        {
          type: "text",
          value:
            "That recompute touches every participant's watermark. In a two-hundred-person group, could that happen often?",
        },
      ],
    },

    {
      id: "48",
      role: "candidate",
      elapsedSeconds: 1305,
      content: [
        {
          type: "text",
          value:
            "It could, if the slowest reader in the group happens to be the one advancing constantly in small steps — every step past the minimum would force a full rescan. I'd probably want to only trigger that expensive rescan lazily, say the next time someone actually asks for this message's tick status, rather than synchronously on every watermark update, so a burst of small advances from the slow reader doesn't each pay the full recompute cost.",
        },
      ],
    },

    {
      id: "49",
      role: "interviewer",
      elapsedSeconds: 1335,
      content: [
        {
          type: "text",
          value: "And thread safety on that shared minimum — multiple participants' watermarks could be advancing concurrently.",
        },
      ],
    },

    {
      id: "50",
      role: "candidate",
      elapsedSeconds: 1365,
      content: [
        {
          type: "text",
          value:
            "Right, that cached minimum is shared state at the conversation level, not the per-message level, so it needs its own protection — a lock scoped to that one conversation's minimum, not global, and not per-message either. Two different groups' minimums should never contend with each other.",
        },
      ],
    },

    {
      id: "51",
      role: "interviewer",
      elapsedSeconds: 1395,
      content: [
        {
          type: "text",
          value:
            "Good. One more — a new member joins the group. Does that affect the cached minimum for messages sent before they joined?",
        },
      ],
    },

    {
      id: "52",
      role: "candidate",
      elapsedSeconds: 1425,
      content: [
        {
          type: "text",
          value:
            "It shouldn't, going back to what we said earlier — a message only cares about the participants snapshotted at the time it was sent. So the group-level minimum watermark I just described really needs to be scoped per message's own participant snapshot, not one single number for the whole conversation regardless of history. In practice that probably means grouping messages by which snapshot of participants they were sent under, and maintaining a cached minimum per snapshot rather than per conversation.",
        },
      ],
    },

    {
      id: "53",
      role: "interviewer",
      elapsedSeconds: 1458,
      content: [
        { type: "text", value: "Good catch. I think that's a solid design. Any last concern before we wrap up?" },
      ],
    },

    {
      id: "54",
      role: "candidate",
      elapsedSeconds: 1485,
      content: [
        {
          type: "text",
          value:
            "Just that the lazy-recompute path needs a sensible upper bound — if it somehow never gets triggered, a message could show as unread forever even after everyone's actually caught up. I'd want some background sweep as a backstop, separate from the on-demand trigger.",
        },
      ],
    },

    {
      id: "55",
      role: "takeaway",
      elapsedSeconds: 1510,
      content: [
        {
          type: "text",
          value:
            "Takeaway: the pattern choice mattered less than asking what actually varies and when — a fixed, type-based rule called for a plain strategy, not a decorator built for runtime composition that was never needed. Keeping the read-computation logic out of the data entities avoided coupling to mutable group membership. And the two follow-ups shared one underlying idea: collapse many small facts into one cheap number — a watermark instead of a set of read messages, a cached minimum instead of a per-render scan — updated incrementally, with concurrency scoped to exactly the piece of state that's actually shared.",
        },
      ],
    },
  ],
};

const whatsappReadReceipts: TranscriptEntry = {
  summary: {
    slug: "whatsapp-read-receipts",
    title: "Design WhatsApp Read Receipts (Tick Status)",
    category: "lld",
    difficulty: Difficulty.HARD,
    duration: 45,
    company: "WhatsApp",
    tags: [
      "Low Level Design",
      "Concurrency",
      "Thread Safety",
      "Separation of Concerns",
      "Design Patterns",
      "Watermarking",
    ],
    description:
      "LLD interview covering tick status computation for direct and group chats, justifying strategy over decorator based on what actually varies, keeping business rules out of data entities, fine-grained concurrency for concurrent read events, and a watermark-based model for handling offline read blasts and efficient group read-status computation.",
  },

  transcript,
};

export default whatsappReadReceipts;