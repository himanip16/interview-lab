// src/content/transcripts/dsa/word-search-ii-trie-backtracking.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Word Search II: Trie-Backed Simultaneous Search",
    difficulty: Difficulty.HARD,
    duration: 45,
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
            "Given a board of characters and a list of words, find all words that exist as paths on the board. Adjacent means horizontally or vertically neighboring. You can't reuse a cell in the same word. What's your approach?",
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
            "For each word, I could DFS from every cell on the board and check if the word exists as a path. That's straightforward.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 38,
      content: [
        {
          type: "text",
          value:
            "How expensive is that? You have up to 30,000 words and a 12x12 board.",
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
            "For each of 30,000 words, I do a DFS from each of 144 cells. Each DFS is O(4^L) where L is the word length, up to 10. So roughly 30,000 * 144 * 4^10, which is... billions of operations. That's too slow.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 78,
      content: [
        {
          type: "text",
          value:
            "Right. The inefficiency is that you're searching the board independently for each word. What if you could search for all words at once?",
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
            "One pass through the board, checking against all words simultaneously. But how do I track 30,000 words efficiently as I traverse?",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 118,
      content: [
        {
          type: "text",
          value:
            "What data structure lets you efficiently check if a prefix is the start of any word in your word list?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 140,
      content: [
        {
          type: "text",
          value:
            "A Trie. At each node, I can check if a character leads to the next part of any word. As I traverse the board, I traverse the Trie in parallel.",
        },
      ],
    },

    {
      id: "9",
      role: "interviewer",
      elapsedSeconds: 158,
      content: [
        {
          type: "text",
          value: "Exactly. So the algorithm is DFS on the board, but at each step, you also traverse the Trie. Describe the state.",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 185,
      content: [
        {
          type: "text",
          value:
            "Current position on the board (row, col), current node in the Trie, and the path built so far. As I move to a neighbor cell, I check if the neighbor's character is a child of the current Trie node.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 205,
      content: [
        {
          type: "text",
          value: "What if the neighbor's character isn't a child of the current Trie node?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 225,
      content: [
        {
          type: "text",
          value:
            "That path is invalid. I backtrack. I don't need to explore further down that branch.",
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
          value:
            "So the Trie acts as a pruning mechanism. You only explore board paths that match prefixes in your Trie. Clever. Now, what happens when you reach a word ending?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 265,
      content: [
        {
          type: "text",
          value:
            "Add the word to the result. But then should I keep traversing deeper, or stop?",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 280,
      content: [
        {
          type: "text",
          value:
            "Keep traversing. A word could be a prefix of another word in the list. You might find longer matches.",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 298,
      content: [
        {
          type: "text",
          value:
            "So when I find a word, I mark it as found but continue the DFS.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 313,
      content: [
        {
          type: "text",
          value:
            "Good. Now, after you find a word, remove it from the Trie or mark it as used. Why?",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 335,
      content: [
        {
          type: "text",
          value:
            "To avoid adding the same word to the result multiple times if there are multiple paths to it on the board.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 352,
      content: [
        {
          type: "text",
          value:
            "Right. But actually, there's another reason. The Trie branches that lead to found words can be pruned entirely. You've already extracted the value from that branch.",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 375,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-trie-pruning",
          type: "highlight",
          status: "strong",
          value: "deleting found words from the Trie during search prunes dead branches and speeds up future searches",
          explanation:
            "Once a word is found, there's no need to explore paths that end in that word again. Removing the word node from the Trie eliminates that entire subtree, reducing the search space and avoiding redundant exploration. This is a form of dynamic pruning that interleaves search and data structure modification.",
        },
        {
          type: "text",
          value:
            " If I delete the word from the Trie as I find it, I reduce the Trie size during the search. Fewer branches to explore means faster traversal.",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 400,
      content: [
        {
          type: "text",
          value: "Code it.",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 480,
      content: [
        {
          type: "text",
          value: "Build a Trie, then DFS from each cell, backtracking and pruning.",
        },
        {
          type: "code",
          id: "code-word-search-ii",
          language: "python",
          value:
            "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.word = None\n\ndef findWords(board, words):\n    # Build Trie\n    root = TrieNode()\n    for word in words:\n        node = root\n        for char in word:\n            if char not in node.children:\n                node.children[char] = TrieNode()\n            node = node.children[char]\n        node.word = word\n\n    result = []\n    m, n = len(board), len(board[0])\n\n    def dfs(row, col, node, visited):\n        char = board[row][col]\n        if char not in node.children:\n            return  # Pruned: no word with this prefix\n\n        next_node = node.children[char]\n        if next_node.word:\n            result.append(next_node.word)\n            next_node.word = None  # Avoid duplicates and prune\n\n        visited.add((row, col))\n        for dr, dc in [(0, 1), (1, 0), (0, -1), (-1, 0)]:\n            nr, nc = row + dr, col + dc\n            if 0 <= nr < m and 0 <= nc < n and (nr, nc) not in visited:\n                dfs(nr, nc, next_node, visited)\n        visited.remove((row, col))\n\n    for i in range(m):\n        for j in range(n):\n            dfs(i, j, root, set())\n\n    return result",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 510,
      content: [
        {
          type: "text",
          value:
            "Walk through the board [[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]] with words [\"oath\",\"pea\",\"eat\",\"rain\"]. Start from one cell and trace.",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 570,
      content: [
        {
          type: "text",
          value:
            "The Trie has branches for o, p, e, r at the root. Start DFS from board[0][0]='o'. 'o' is in root.children. Next node has a child for 'a'. board[0][1]='a', so move there. Next node has a child for 't'. board[1][1]='t', so move there. Next node has a child for 'h'. board[2][1]='h', so move there. next_node.word is 'oath'. Add 'oath' to result, set next_node.word = None. Continue exploring... no more neighbors with valid Trie paths. Backtrack. From 't', try other neighbors. board[2][0]='i' — no 'i' child in that Trie node, prune. board[2][2]='k' — no 'k' child, prune. Back to 'a'. Try other neighbors. From 'a' at board[0][1], try board[0][2]='a' — Trie has 'a' child (from 'oath' but also used by other prefixes), continue... This gets complex quickly because of branching.",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 620,
      content: [
        {
          type: "text",
          value:
            "The point is that the Trie pruning prevents exploring dead-end paths. Most of the board won't be visited because the Trie doesn't have branches for random character sequences. What's the complexity?",
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
            "Without the Trie, it'd be O(m * n * 4^L * W) for W words. With the Trie, you do one DFS pass of the board, O(m * n), and at each cell you branch to at most 26 Trie children. The depth is the max word length L. So roughly O(m * n * L * 26), which is much better.",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 675,
      content: [
        {
          type: "text",
          value:
            "Actually, it's a bit tighter. The branching factor at each Trie node is at most the alphabet size, but you're only exploring paths that exist in the Trie. The actual complexity is hard to state precisely, but empirically it's close to O(m * n * L) in many cases because most paths prune early. What if the Trie becomes unbalanced?",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 705,
      content: [
        {
          type: "text",
          value:
            "If all words start with the same prefix, the Trie is deep but narrow. The search would still follow that single path. If all words share no prefixes, the Trie is wide but shallow. Either way, the Trie structure adapts to the data.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 725,
      content: [
        {
          type: "text",
          value:
            "Good. Follow-up: what if you wanted to find all words starting from a specific cell, not from any cell?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 750,
      content: [
        {
          type: "text",
          value:
            "Call DFS only from that specific cell instead of looping through all cells. The algorithm stays the same.",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 765,
      content: [
        {
          type: "text",
          value:
            "Another follow-up: what if you had to support adding and removing words from your word list dynamically, and you wanted to reuse the same board for multiple queries?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 795,
      content: [
        {
          type: "text",
          value:
            "Build the Trie once with initial words. Then for add/remove, update the Trie dynamically. To handle multiple queries without re-building the Trie, keep it persistent. The DFS algorithm doesn't change — it just uses the current state of the Trie.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 815,
      content: [
        {
          type: "text",
          value:
            "But there's a catch. You marked word_nodes as None after finding them. Can you find them again if you add the same word back?",
        },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 840,
      content: [
        {
          type: "text",
          value:
            "No, because I set node.word = None permanently. If I want to support re-adding words, I'd either need to rebuild the Trie from scratch each time, or track found words separately — maybe a set of found_words — and check membership instead of modifying the Trie.",
        },
      ],
    },

    {
      id: "35",
      role: "interviewer",
      elapsedSeconds: 865,
      content: [
        {
          type: "text",
          value:
            "Right. The trade-off is between modifying the Trie for efficiency during static searches versus keeping it immutable for dynamic updates. For this problem, static is fine, but it's worth knowing the cost.",
        },
      ],
    },

    {
      id: "36",
      role: "takeaway",
      elapsedSeconds: 890,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Word Search II is a classic Trie + backtracking problem that's deceptively hard if approached naively. Searching the board independently for each word is exponential in the number of words. The insight is inverting the search: instead of word-by-word, search the board once while simultaneously traversing a Trie built from all words. The Trie acts as a multi-word prefix matcher, pruning branches that don't lead to any word. As you traverse the board with DFS, you also traverse the Trie; if a character isn't a Trie child, that path is dead and you backtrack immediately. Finding a word sets its Trie node to None, preventing duplicates and pruning that entire branch for future searches. This reduces the effective Trie size as the search progresses, making later searches faster. The visited set prevents using the same cell twice in a single word path. The complexity is data-dependent but significantly better than naive approach. The technique generalizes to other Trie-based multi-pattern matching problems.",
        },
      ],
    },
  ],
};

const wordSearchIITrieBacktracking: TranscriptEntry = {
  summary: {
    id: 34,

    slug: "word-search-ii-trie-backtracking",
    title: "Word Search II: Trie-Backed Simultaneous Search",
    category: "dsa",
    difficulty: Difficulty.HARD,
    duration: 45,
    company: "Generic",
    tags: [
      "Trie",
      "Backtracking",
      "DFS",
      "Board Search",
      "Prefix Matching",
      "Pruning",
    ],
    description:
      "Coding interview on LeetCode's Word Search II: recognizing why per-word search is exponential, understanding why a Trie enables simultaneous multi-pattern search, implementing Trie + DFS with backtracking and visited tracking, discovering dynamic pruning by deleting found words from the Trie, and discussing the trade-offs between efficiency and flexibility in dynamic scenarios. Emphasizes the inversion of search direction and how data structures enable pruning.",
  },

  transcript,
};

export default wordSearchIITrieBacktracking;