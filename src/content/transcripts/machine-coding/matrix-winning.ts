import { TranscriptData } from "@/features/library/types/transcript";
import { Difficulty } from "@prisma/client";
import { TranscriptEntry } from "../types";

const transcript: TranscriptData = {
  metadata: {
    title: "Design a Matrix Winning Condition Checker",
    difficulty: Difficulty.MEDIUM,
    duration: 50,
    template: "Machine Coding",
    category: "Machine Coding",
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
            "Let's solve a game-related problem. You're given a matrix representing the board. Determine whether either player has won.",
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
            "Before coding I'd like to clarify the winning conditions. Are we checking rows, columns and diagonals? Can I assume the board is square, and should I optimize for a specific board size?",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 42,
      content: [
        {
          type: "text",
          value:
            "Assume rows, columns and diagonals. Focus on correctness first.",
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
            "I'll implement this incrementally. First I'll support horizontal wins, verify that, then extend to vertical and finally diagonals. That way the solution remains runnable throughout.",
        },
        {
          id: "highlight-incremental",
          type: "highlight",
          status: "strong",
          value: "Build runnable milestones.",
          explanation:
            "Implement one complete feature at a time so the solution can be validated even if interrupted.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 260,
      content: [
        {
          type: "text",
          value:
            "Can you run your code?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 272,
      content: [
        {
          type: "text",
          value:
            "Sure. Only the horizontal case is complete right now, so that's the behavior I'd expect to pass. The remaining conditions are still under implementation.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 300,
      content: [
        {
          type: "text",
          value:
            "Actually I wanted to see that basic condition working first.",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 314,
      content: [
        {
          type: "text",
          value:
            "That makes sense. I'll isolate that case, verify it, and then continue extending the implementation.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 360,
      content: [
        {
          type: "text",
          value:
            "The matrix format should actually look like this...",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 376,
      content: [
        {
          type: "text",
          value:
            "Thanks for clarifying. Before changing the implementation, let me confirm the new representation so I don't optimize around the wrong abstraction.",
        },
        {
          id: "highlight-clarify",
          type: "highlight",
          status: "strong",
          value: "Reconfirm changed requirements.",
          explanation:
            "Requirement changes are common. Restating them prevents implementing the wrong solution twice.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 520,
      content: [
        {
          type: "text",
          value:
            "Explain your algorithm.",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 534,
      content: [
        {
          type: "text",
          value:
            "The implementation is partially complete, so I'll explain the architecture first. The board traversal is independent of the winning rule. Each rule is implemented as a helper, making it easy to add rows, columns and diagonals without duplicating traversal logic.",
        },
        {
          id: "highlight-separation",
          type: "highlight",
          status: "strong",
          value: "Separate traversal from validation.",
          explanation:
            "Decoupling iteration from win detection keeps the implementation modular and easier to extend.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 612,
      content: [
        {
          type: "text",
          value:
            "How would you avoid scanning the matrix multiple times?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 630,
      content: [
        {
          type: "text",
          value:
            "For a single evaluation I'd combine checks where possible so every cell contributes to row, column and diagonal state during one traversal. That reduces unnecessary passes over the matrix.",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 700,
      content: [
        {
          type: "text",
          value:
            "Suppose the board size grows significantly.",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 716,
      content: [
        {
          type: "text",
          value:
            "The algorithm remains O(n²), which is optimal since every cell must be inspected at least once. The optimization focus would shift toward minimizing repeated work and avoiding unnecessary allocations.",
        },
        {
          id: "highlight-complexity",
          type: "highlight",
          status: "strong",
          value: "Reason from lower bounds.",
          explanation:
            "Recognizes that every cell must be examined, making O(n²) asymptotically optimal for an n×n board.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 810,
      content: [
        {
          type: "text",
          value:
            "There's a bug somewhere. Where would you start debugging?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 824,
      content: [
        {
          type: "text",
          value:
            "I'd first isolate whether the traversal or the validation logic is incorrect. Since traversal is shared across all conditions, I'd verify the helper functions independently with small matrices before inspecting the main control flow.",
        },
        {
          id: "highlight-debugging",
          type: "highlight",
          status: "strong",
          value: "Debug by isolating components.",
          explanation:
            "Rather than searching randomly, narrow the fault to either traversal or rule evaluation before inspecting individual functions.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 900,
      content: [
        {
          type: "text",
          value:
            "We have about thirty seconds left.",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 912,
      content: [
        {
          type: "text",
          value:
            "Given the remaining time, I'd prioritize verifying the helper responsible for the failing condition before changing broader logic. If that checks out, I'd validate the assumptions around the updated matrix representation since that requirement changed during implementation.",
        },
      ],
    },

    {
      id: "21",
      role: "takeaway",
      elapsedSeconds: 950,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Machine coding interviews are often interactive rather than uninterrupted implementation sessions. Build the solution in small runnable milestones, validate assumptions as requirements evolve, keep traversal separate from business logic, and communicate what is complete versus what is still in progress. When interrupted, explain the current state of the design instead of waiting for a perfect solution, and debug by isolating components rather than searching the entire codebase. This approach keeps progress visible and makes adapting to changing requirements much easier.",
        },
      ],
    },
  ],
};


const matrixWinning: TranscriptEntry = {
  summary: {
    slug: "matrix-winning-condition-checker",
    title: "Design a Matrix Winning Condition Checker",
    category: "machine-coding",
    difficulty: Difficulty.MEDIUM,
    duration: 45,
    company: "Airbnb",
    tags: [
      "Machine Coding",
      "Webhooks",
      "FastAPI",
      "Retries",
      "Exponential Backoff",
      "Circuit Breaker",
      "Dead Letter Queue",
      "HMAC",
      "Lease-Based Processing",
      "Distributed Systems",
    ],
    description:
      "Machine coding interview covering reliable webhook delivery, asynchronous workers, retry strategies, exponential backoff, dead-letter queues, HMAC request signing, event filtering, circuit breakers, worker crash recovery using leases, and the trade-offs behind at-least-once delivery.",
  },

  transcript,
};

export default matrixWinning;