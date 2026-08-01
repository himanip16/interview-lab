// src/content/transcripts/dsa/word-ladder-bfs.ts

import { Difficulty } from "@prisma/client";

import { TranscriptEntry } from "../types";
import { TranscriptData } from "@/features/library/types/transcript";

const transcript: TranscriptData = {
  metadata: {
    title: "Word Ladder: BFS Shortest Path With Efficient Neighbor Finding",
    difficulty: Difficulty.HARD,
    duration: 40,
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
            "You have a beginWord, an endWord, and a dictionary of words. Find the shortest sequence of transformations from begin to end, where each step changes exactly one letter and the intermediate words must be in the dictionary. Return the length of that sequence, or 0 if impossible.",
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
            "So I need to find the shortest path. That's a graph problem — words are nodes, and edges connect words that differ by one letter.",
        },
      ],
    },

    {
      id: "3",
      role: "interviewer",
      elapsedSeconds: 35,
      content: [
        {
          type: "text",
          value: "Right. How do you find the shortest path in a graph?",
        },
      ],
    },

    {
      id: "4",
      role: "candidate",
      elapsedSeconds: 52,
      content: [
        {
          type: "text",
          value: "BFS — breadth-first search. It explores level by level, so the first time you reach the destination, you've found the shortest path.",
        },
      ],
    },

    {
      id: "5",
      role: "interviewer",
      elapsedSeconds: 68,
      content: [
        {
          type: "text",
          value: "Why BFS and not DFS?",
        },
      ],
    },

    {
      id: "6",
      role: "candidate",
      elapsedSeconds: 88,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-bfs-vs-dfs",
          type: "highlight",
          status: "strong",
          value: "BFS explores by distance, so it reaches nodes in order of increasing distance, guaranteeing the first arrival is shortest",
          explanation:
            "DFS explores depth-first, potentially finding long paths before short ones. In an unweighted graph, BFS is the natural shortest-path algorithm because each edge has unit cost. DFS would require exploring all paths to find the minimum.",
        },
        {
          type: "text",
          value:
            " DFS explores deeply along one branch and might find a long path before a short one. BFS explores level by level, so distance increases monotonically. The first time you reach the target, you know it's via a shortest path.",
        },
      ],
    },

    {
      id: "7",
      role: "interviewer",
      elapsedSeconds: 110,
      content: [
        {
          type: "text",
          value:
            "Good. Now, the hardest part of this problem isn't BFS — it's efficiently finding neighbors. Given a word, how do you find all words in the dictionary that differ by exactly one letter?",
        },
      ],
    },

    {
      id: "8",
      role: "candidate",
      elapsedSeconds: 138,
      content: [
        {
          type: "text",
          value:
            "For each word, I could iterate through all words in the dictionary and check if they differ by one letter. That's O(dictionary_size) per word.",
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
          value:
            "And checking if two words differ by one letter costs how much?",
        },
      ],
    },

    {
      id: "10",
      role: "candidate",
      elapsedSeconds: 175,
      content: [
        {
          type: "text",
          value:
            "O(word_length). You compare them character by character. So overall it's O(dictionary_size * word_length) per word to find all neighbors.",
        },
      ],
    },

    {
      id: "11",
      role: "interviewer",
      elapsedSeconds: 192,
      content: [
        {
          type: "text",
          value:
            "In BFS, every word is processed once, and for each word you find its neighbors. So the total is O(number_of_words_visited * dictionary_size * word_length). That's quadratic in the dictionary size, which with 5000 words might be slow. Can you do better?",
        },
      ],
    },

    {
      id: "12",
      role: "candidate",
      elapsedSeconds: 220,
      content: [
        {
          type: "text",
          value:
            "What if I preprocess the dictionary? For each word, generate all possible one-letter transformations — like 'hit' becomes 'ait', 'bit', ..., 'hzt'. Then check which of those exist in the dictionary.",
        },
      ],
    },

    {
      id: "13",
      role: "interviewer",
      elapsedSeconds: 245,
      content: [
        {
          type: "text",
          value: "That's still checking existence repeatedly. How do you make existence checks fast?",
        },
      ],
    },

    {
      id: "14",
      role: "candidate",
      elapsedSeconds: 268,
      content: [
        {
          type: "text",
          value:
            "Put the dictionary in a set. Then for each of the word_length * 26 transformations, check if it's in the set in O(1).",
        },
      ],
    },

    {
      id: "15",
      role: "interviewer",
      elapsedSeconds: 285,
      content: [
        {
          type: "text",
          value: "Better. But there's another approach: group words by wildcard patterns. Explain that.",
        },
      ],
    },

    {
      id: "16",
      role: "candidate",
      elapsedSeconds: 310,
      content: [
        {
          type: "text",
          value:
            "Map each word to all its one-letter wildcard patterns. Like 'hit' maps to '*it', 'h*t', 'hi*'. If two words share a pattern, they differ by one letter at that position.",
        },
      ],
    },

    {
      id: "17",
      role: "interviewer",
      elapsedSeconds: 330,
      content: [
        {
          type: "text",
          value:
            "Right. So you preprocess: for each word, generate its patterns and record that word under each pattern. Then, to find neighbors of a word, you look up all its patterns and collect words under those patterns.",
        },
      ],
    },

    {
      id: "18",
      role: "candidate",
      elapsedSeconds: 355,
      content: [
        {
          type: "text",
          value: "",
        },
        {
          id: "highlight-wildcard-preprocessing",
          type: "highlight",
          status: "strong",
          value: "precomputing wildcard patterns clusters words by one-letter neighbors, turning O(dict²) pairwise checks into O(word_length * 26) pattern lookups",
          explanation:
            "Words that differ by one letter share exactly one wildcard pattern at the differing position. By grouping words under patterns upfront, neighbor finding becomes a hash lookup of patterns rather than pairwise comparison of all words. This trades O(preprocessing) for O(1) neighbor lookups.",
        },
        {
          type: "text",
          value:
            " Instead of comparing every pair of words during the search, you compute patterns once upfront. Then looking up neighbors is just a few hash table lookups per word.",
        },
      ],
    },

    {
      id: "19",
      role: "interviewer",
      elapsedSeconds: 378,
      content: [
        {
          type: "text",
          value: "Code the algorithm using wildcard patterns.",
        },
      ],
    },

    {
      id: "20",
      role: "candidate",
      elapsedSeconds: 450,
      content: [
        {
          type: "text",
          value: "Build a pattern map, then BFS.",
        },
        {
          type: "code",
          id: "code-word-ladder",
          language: "python",
          value:
            "from collections import defaultdict, deque\n\ndef ladderLength(beginWord, endWord, wordList):\n    if endWord not in wordList:\n        return 0\n\n    # Build pattern map\n    pattern_map = defaultdict(list)\n    for word in wordList:\n        for i in range(len(word)):\n            pattern = word[:i] + '*' + word[i+1:]\n            pattern_map[pattern].append(word)\n\n    # BFS\n    queue = deque([(beginWord, 1)])  # (word, distance)\n    visited = {beginWord}\n\n    while queue:\n        word, dist = queue.popleft()\n        if word == endWord:\n            return dist\n\n        # Find neighbors via patterns\n        for i in range(len(word)):\n            pattern = word[:i] + '*' + word[i+1:]\n            for neighbor in pattern_map[pattern]:\n                if neighbor not in visited:\n                    visited.add(neighbor)\n                    queue.append((neighbor, dist + 1))\n\n    return 0",
        },
      ],
    },

    {
      id: "21",
      role: "interviewer",
      elapsedSeconds: 480,
      content: [
        {
          type: "text",
          value:
            "Walk through the example. beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"].",
        },
      ],
    },

    {
      id: "22",
      role: "candidate",
      elapsedSeconds: 535,
      content: [
        {
          type: "text",
          value:
            "Pattern map: '*ot' -> [hot, dot, lot], 'h*t' -> [hot], 'ho*' -> [hot], etc. BFS starts with ('hit', 1). Patterns for 'hit' are '*it', 'h*t', 'hi*'. None of these are in the map (no words end with 'it' after one replacement from 'hit'), so no neighbors. Wait, that doesn't seem right.",
        },
      ],
    },

    {
      id: "23",
      role: "interviewer",
      elapsedSeconds: 565,
      content: [
        {
          type: "text",
          value:
            "Let me help. What's the first neighbor of 'hit'?",
        },
      ],
    },

    {
      id: "24",
      role: "candidate",
      elapsedSeconds: 585,
      content: [
        {
          type: "text",
          value: "'hot' differs by one letter (h-i-t vs h-o-t).",
        },
      ],
    },

    {
      id: "25",
      role: "interviewer",
      elapsedSeconds: 602,
      content: [
        {
          type: "text",
          value:
            "Right. So what pattern do 'hit' and 'hot' share?",
        },
      ],
    },

    {
      id: "26",
      role: "candidate",
      elapsedSeconds: 620,
      content: [
        {
          type: "text",
          value:
            "They differ at position 1. So 'h*t'. 'hit' generates 'h*t' as one of its patterns, and 'hot' also generates 'h*t'. So 'hot' is in pattern_map['h*t'].",
        },
      ],
    },

    {
      id: "27",
      role: "interviewer",
      elapsedSeconds: 640,
      content: [
        {
          type: "text",
          value:
            "Right. Continue the BFS from there.",
        },
      ],
    },

    {
      id: "28",
      role: "candidate",
      elapsedSeconds: 680,
      content: [
        {
          type: "text",
          value:
            "Pop ('hit', 1). Find patterns: 'h*t', 'h*t' gives 'hot'. Add ('hot', 2). Pop ('hot', 2). Patterns: '*ot', 'h*t', 'ho*'. '*ot' gives 'hot' (visited), 'dot', 'lot'. Add ('dot', 3) and ('lot', 3). Pop ('dot', 3). Patterns: '*ot', 'd*t', 'do*'. '*ot' gives 'hot' (visited), 'dot' (visited), 'lot' (already queued or visited soon). 'd*t' gives nothing. 'do*' gives 'dog'. Add ('dog', 4). Pop ('lot', 3). Patterns: '*ot', 'l*t', 'lo*'. 'lo*' gives 'log'. Add ('log', 4). Pop ('dog', 4). Patterns: 'd*g', 'do*', 'dog'. '*og' gives 'dog' (visited), 'log' (already visited/queued). 'do*' gives 'dog'. 'd*g' gives 'dog'. No new. Pop ('log', 4). Patterns: 'l*g', 'lo*', 'log'. 'l*g' gives 'log'. 'lo*' gives 'log'. 'log' gives 'cog'. Add ('cog', 5). Pop ('cog', 5). cog == endWord, return 5.",
        },
      ],
    },

    {
      id: "29",
      role: "interviewer",
      elapsedSeconds: 745,
      content: [
        {
          type: "text",
          value:
            "Good. The path was hit -> hot -> dot -> dog -> cog, which is indeed 5 words and the shortest. What's the complexity?",
        },
      ],
    },

    {
      id: "30",
      role: "candidate",
      elapsedSeconds: 775,
      content: [
        {
          type: "text",
          value:
            "Preprocessing: for each word, generate word_length patterns. That's O(dictionary_size * word_length). BFS visits each word at most once, and for each word, we look up word_length patterns. Each pattern might have multiple words, but in total we explore each edge at most once. It's O(number_of_edges), which is at most O(dictionary_size * word_length * 26) in the worst case. Overall O(dictionary_size * word_length).",
        },
      ],
    },

    {
      id: "31",
      role: "interviewer",
      elapsedSeconds: 805,
      content: [
        {
          type: "text",
          value:
            "Much better than the naive O(dictionary_size²) approach. Now, there's a bidirectional BFS variant. Why would you use it?",
        },
      ],
    },

    {
      id: "32",
      role: "candidate",
      elapsedSeconds: 835,
      content: [
        {
          type: "text",
          value:
            "Search from both beginWord and endWord simultaneously, meeting in the middle. If the path is long, you'd explore roughly (neighbors ^ (path_length/2)) from each direction instead of (neighbors ^ path_length) from one direction.",
        },
      ],
    },

    {
      id: "33",
      role: "interviewer",
      elapsedSeconds: 860,
      content: [
        {
          type: "text",
          value:
            "Right. Exponential search space shrinks significantly when you search from both ends. When would it not help?",
        },
      ],
    },

    {
      id: "34",
      role: "candidate",
      elapsedSeconds: 885,
      content: [
        {
          type: "text",
          value:
            "If the path is very short, the overhead of managing two queues and checking for intersection might outweigh the benefit. Also, if the endWord isn't in the dictionary, beginWord BFS terminates early anyway.",
        },
      ],
    },

    {
      id: "35",
      role: "takeaway",
      elapsedSeconds: 910,
      content: [
        {
          type: "text",
          value:
            "Takeaway: Word Ladder is a shortest-path problem on an implicit graph where words are nodes and edges connect words differing by one letter. BFS is the natural algorithm because it explores by distance, guaranteeing the first arrival at the target is shortest. The key optimization is avoiding O(dictionary²) pairwise comparison by precomputing wildcard patterns. Words differing by one letter share a wildcard pattern at the differing position, so grouping words by pattern enables O(word_length) neighbor lookup instead of O(dictionary_size) comparison. Visited tracking prevents revisiting words and ensures each node is processed once. The algorithm is O(dictionary_size × word_length) after preprocessing. Bidirectional BFS cuts the exponential search space roughly in half but adds complexity; use it when the path is long or the word list is large. The problem illustrates how problem constraints — 'differ by exactly one letter' — translate directly to graph structure, and how preprocessing can transform expensive lookups into cheap ones.",
        },
      ],
    },
  ],
};

const wordLadderBFS: TranscriptEntry = {
  summary: {    id: 33,

    slug: "word-ladder-bfs",
    title: "Word Ladder: BFS Shortest Path With Efficient Neighbor Finding",
    category: "dsa",
    difficulty: Difficulty.HARD,
    duration: 40,
    company: "Generic",
    tags: [
      "BFS",
      "Shortest Path",
      "Graph",
      "Word Problems",
      "Pattern Matching",
      "Hash Map",
    ],
    description:
      "Coding interview on LeetCode's Word Ladder: recognizing the problem as shortest-path on an implicit graph, understanding why BFS over DFS, implementing naive neighbor finding and recognizing its O(n²) cost, discovering wildcard pattern preprocessing to reduce neighbor lookup from O(dictionary_size) to O(word_length × 26), coding the optimized solution, tracing through an example, and discussing bidirectional BFS as a further optimization. Emphasizes problem structure to algorithm mapping and preprocessing for efficiency.",
  },

  transcript,
};

export default wordLadderBFS;